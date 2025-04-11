import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AdminAuthorizationLevel } from '../../modules/auth/enums';

@Entity('admins', { schema: 'yenreach_schema' })
export class Admins {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'name', length: 100 })
  public name: string;

  @Column('varchar', { name: 'username', length: 100, unique: true })
  public username: string;

  @Column('varchar', { name: 'password', length: 200 })
  public password: string;

  @Column('varchar', { name: 'personal_email', length: 200, unique: true })
  public personal_email: string;

  @Column('varchar', { name: 'official_email', length: 200, unique: true })
  public official_email: string;

  @Column('varchar', { name: 'phone_email', length: 200, unique: true })
  public phoneNumber: string;

  @Column('enum', { name: 'authorization_level' })
  public authorizationLevel: AdminAuthorizationLevel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
