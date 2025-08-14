import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SettingsValueType } from '../../shared/enums';
import { SettingValue } from '../../shared/types/common';

@Entity('settings', { schema: 'yenreach' })
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('varchar', { name: 'name', nullable: false, length: 100, unique: true })
  public name: string;

  @Column('jsonb', { name: 'value' })
  public value: SettingValue;

  @Column({ name: 'value_type', type: 'enum', enum: SettingsValueType, default: SettingsValueType.Boolean })
  public valueType: SettingsValueType;

  @Column('text', { name: 'options', array: true, nullable: true })
  public options: string[] | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
