import { RedisClientType } from 'redis';
import AppDataSource from '../../../database';
import { Settings } from '../../../database/entities/settings.entity';
import { Repository } from 'typeorm';
import { getRedisClient } from '../../../lib/redis/redis.service';
import { logger } from '../../../lib/utils';
import { SettingValue } from '../../../shared/types/common';
import { SettingsValueType } from '../../../shared/enums';
import { CreateSettingsDto, UpdateSettingsDto } from '../schema';

export class SettingsService {
  private static instance: SettingsService;
  private readonly redis: RedisClientType;
  private readonly SettingsRepository: Repository<Settings>;

  constructor() {
    this.redis = getRedisClient();
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
        case SettingsValueType.Enum:
          break;
        case SettingsValueType.Boolean:
          parsedValue = Boolean(setting.value);
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
      case SettingsValueType.Enum:
        break;
      case SettingsValueType.Boolean:
        parsedValue = Boolean(setting.value);
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

  public async refreshCache() {
    try {
      const settings = await this.SettingsRepository.find();
      const parsedSettings = this.parseSettings(settings);
      const pipeline = this.redis.multi();
      for (let setting of parsedSettings) {
        pipeline.set(setting.name, JSON.stringify(setting.value));
      }
      pipeline.exec();
    } catch (error) {
      logger.error(`error occured while refreshing setttings cache ${error}`);
      throw error;
    }
  }

  public async init() {
    try {
      const settings = await this.SettingsRepository.find();
      const parsedSettings = this.parseSettings(settings);
      const pipeline = this.redis.multi();
      for (let setting of parsedSettings) {
        pipeline.set(setting.name, JSON.stringify(setting.value));
      }
      pipeline.exec();
    } catch (error) {
      logger.error(`error occured while initilaiizng settting ${error}`);
      throw error;
    }
  }

  public async getSetting<T = unknown>(settingName: string): Promise<T> {
    const cachedSetting = await this.redis.get(settingName);

    if (!cachedSetting) {
      const s = await this.SettingsRepository.findOneBy({ name: settingName });
      const parsedSetting = this.parseSetting(s);
      return parsedSetting.value as T;
    }
    return JSON.parse(cachedSetting) as T;
  }

  public async getSettings(): Promise<{ name: string; value: SettingValue }[]> {
    const settings = await this.SettingsRepository.find();
    const parsedSettings = this.parseSettings(settings);
    return parsedSettings;
  }

  public async createSetting(data: CreateSettingsDto): Promise<Settings> {
    const newSetting = this.SettingsRepository.create(data);
    const savedSetting = await this.SettingsRepository.save(newSetting);
    const parsedSetting = this.parseSetting(savedSetting);
    await this.redis.set(parsedSetting.name, JSON.stringify(parsedSetting.value));
    return savedSetting;
  }
}

export default SettingsService;
