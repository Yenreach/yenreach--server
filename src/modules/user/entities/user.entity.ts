import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'yenreach_migrate_db' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'verify_string', type: 'text', nullable: false })
  verifyString: string;

  @Column('varchar', { name: 'name', length: 1000 })
  name: string;

  @Column('varchar', { name: 'email', length: 255 })
  email: string;

  @Column('int', { name: 'timer' })
  timer: number;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', { name: 'image', length: 255, nullable: true })
  image: string;

  @Column('int', { name: 'listed', nullable: true })
  listed: number;

  @Column('varchar', { name: 'refer_method', length: 255, nullable: true })
  referMethod: string;

  @Column('int', { name: 'admin', nullable: true })
  admin: number;

  @Column('datetime', { name: 'datecreated', default: Date.now() })
  datecreated: Date;

  @Column('datetime', { name: 'lastmodified', default: Date.now() })
  lastmodified: Date;

  @Column('varchar', { name: 'modifiedby', length: 255, nullable: true })
  modifiedby: string;

  @Column('int', { name: 'activation', default: 2 })
  activation: number;

  @Column('int', { name: 'autho_level', default: 1 })
  authoLevel: number;

  @Column('int', { name: 'created', default: Date.now() })
  created: number;

  @Column('int', { name: 'last_updated', default: Date.now() })
  lastUpdated: number;

  @Column('int', { name: 'confirmed_email', nullable: true })
  confirmedEmail: number;

  @Column('int', { name: 'email_track', nullable: true, default: () => "'1'" })
  emailTrack: number | null;

  @Column('int', { name: 'sms_track', default: () => "'1'" })
  smsTrack: number;

  @Column('varchar', { name: 'cv', length: 250, nullable: true })
  cv: string;

  @Column('varchar', { name: 'dob', length: 250, nullable: true })
  dob: string;

  @Column('varchar', { name: 'phone', length: 250, nullable: true })
  phone: string;

  @Column('varchar', { name: 'gender', length: 250, nullable: true })
  gender: string;
}
