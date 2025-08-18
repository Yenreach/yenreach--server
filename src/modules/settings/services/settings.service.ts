import { RedisClientType } from 'redis';
import AppDataSource from '../../../database';
import { Settings } from '../../../database/entities/settings.entity';
import { Repository } from 'typeorm';
import { getRedisClient } from '../../../lib/redis/redis.service';
import { logger } from '../../../lib/utils';
import { SettingValue } from '../../../shared/types/common';
import { SettingsValueType } from '../../../shared/enums';
import { CreateSettingsDto, UpdateSettingsDto } from '../schema';
import { HttpException } from '../../../lib/exceptions';
import { HttpCodes } from '../../../lib/constants';

export class SettingsService {
  private static instance: SettingsService;
  private redis: RedisClientType;
  private readonly SettingsRepository: Repository<Settings>;

  private readonly REDIS_TTL = 60 * 60 * 24;

  constructor() {
    this.SettingsRepository = AppDataSource.getRepository(Settings);
  }

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private parseSettings(settings: Settings[]): { name: string; value: SettingValue }[] {
    return settings.map(setting => {
      let parsedValue: SettingValue;

      switch (setting.valueType) {
        case SettingsValueType.Number:
          parsedValue = Number(setting.value);
          break;
        case SettingsValueType.String:
          parsedValue = String(setting.value);
          break;
        case SettingsValueType.Enum:
          parsedValue = setting.value;
          break;
        case SettingsValueType.Boolean:
          parsedValue = setting.value === 'true' || setting.value === true;
          break;
        case SettingsValueType.StringArray:
          parsedValue = String(setting.value);
          break;
        case SettingsValueType.NumberArray:
          parsedValue = Number(setting.value);
          break;
        case SettingsValueType.Object:
        case SettingsValueType.ObjectArray:
        case SettingsValueType.Options:
          parsedValue = setting.value;
          break;
        default:
          parsedValue = setting.value;
      }

      return {
        name: setting.name,
        value: parsedValue,
      };
    });
  }

  private parseSetting(setting: Settings): { name: string; value: SettingValue } {
    let parsedValue: SettingValue;

    switch (setting.valueType) {
      case SettingsValueType.Number:
        parsedValue = Number(setting.value);
        break;
      case SettingsValueType.String:
        parsedValue = String(setting.value);
        break;
      case SettingsValueType.Enum:
        parsedValue = setting.value;
        break;
      case SettingsValueType.Boolean:
        parsedValue = setting.value === 'true' || setting.value === true;
        break;
      case SettingsValueType.StringArray:
        parsedValue = String(setting.value);
        break;
      case SettingsValueType.NumberArray:
        parsedValue = Number(setting.value);
        break;
      case SettingsValueType.Object:
      case SettingsValueType.ObjectArray:
      case SettingsValueType.Options:
        parsedValue = setting.value;
        break;
      default:
        parsedValue = setting.value;
    }

    return {
      name: setting.name,
      value: parsedValue,
    };
  }

  private testValue(value: any, valueType: SettingsValueType): boolean {
    switch (valueType) {
      case SettingsValueType.Number:
      case SettingsValueType.NumberArray:
        return !isNaN(Number(value)) && isFinite(Number(value));

      case SettingsValueType.String:
      case SettingsValueType.StringArray:
        return typeof value === 'string';

      case SettingsValueType.Boolean:
        return typeof value === 'boolean';

      case SettingsValueType.Object:
      case SettingsValueType.ObjectArray:
        return typeof value === 'object' && value !== null;

      case SettingsValueType.Enum:
      case SettingsValueType.Options:
        return true;

      default:
        return false;
    }
  }

  public async refreshCache() {
    try {
      const settings = await this.SettingsRepository.find();
      const parsedSettings = this.parseSettings(settings);
      const pipeline = this.redis.multi();
      for (let setting of parsedSettings) {
        pipeline.set(setting.name, JSON.stringify(setting.value));
        pipeline.expire(setting.name, this.REDIS_TTL);
      }
      pipeline.exec();
    } catch (error) {
      logger.error(`error occured while refreshing setttings cache ${error}`);
      throw error;
    }
  }

  public async init() {
    try {
      this.redis = getRedisClient();
      const settings = await this.SettingsRepository.find();
      const parsedSettings = this.parseSettings(settings);
      const pipeline = this.redis.multi();
      for (let setting of parsedSettings) {
        pipeline.set(setting.name, JSON.stringify(setting.value));
        pipeline.expire(setting.name, this.REDIS_TTL);
      }
      pipeline.exec();
    } catch (error) {
      logger.error(`error occured while initilaiizng settting ${error}`);
      throw error;
    }
  }

  public async getSetting<T = unknown>(settingName: string): Promise<T | null> {
    const cachedSetting = await this.redis.get(settingName);

    if (!cachedSetting) {
      const s = await this.SettingsRepository.findOneBy({ name: settingName });
      if (!s) return null;
      const parsedSetting = this.parseSetting(s);
      await this.redis.setEx(parsedSetting.name, this.REDIS_TTL, JSON.stringify(parsedSetting.value));
      return parsedSetting.value as T;
    }
    return JSON.parse(cachedSetting) as T;
  }

  public async getSettings(): Promise<{ name: string; value: SettingValue }[] | []> {
    const settings = await this.SettingsRepository.find();

    if (!settings.length) return [];

    const parsedSettings = this.parseSettings(settings);
    return parsedSettings;
  }

  public async createSetting(data: CreateSettingsDto): Promise<Settings> {
    const setting = await this.SettingsRepository.findOneBy({ name: data.name });
    if (setting) {
      return await this.updateSetting(data.name, data)
    } else {
      const newSetting = this.SettingsRepository.create(data);
      const savedSetting = await this.SettingsRepository.save(newSetting);
      const parsedSetting = this.parseSetting(savedSetting);
      await this.redis.set(parsedSetting.name, JSON.stringify(parsedSetting.value));
      return savedSetting;
    }
  }

  public async updateSetting(name: string, data: UpdateSettingsDto): Promise<Settings> {
    const setting = await this.SettingsRepository.findOneBy({ name });
    if (!setting) throw new HttpException(HttpCodes.NOT_FOUND, 'Setting not found');

    if (!data.valueType) {
      const result = this.testValue(data.value, setting.valueType);
      if (!result) throw new HttpException(HttpCodes.BAD_REQUEST, 'New Value does not match value type');
    }

    Object.assign(setting, data);

    const parsedSetting = this.parseSetting(setting);
    await this.SettingsRepository.save(setting);
    await this.redis.set(parsedSetting.name, JSON.stringify(parsedSetting.value));
    return setting;
  }
}

export default SettingsService;
