import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';
import { CardToken } from './card-token.entity';

@Entity('users', { schema: 'yenreach' })
export class Users {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'verify_string', length: 255, nullable: true })
  public verifyString: string;

  @Column('varchar', { name: 'name', length: 1000 })
  public name: string;

  @Index()
  @Column('varchar', { name: 'email', length: 255, unique: true })
  public email: string;

  @Column('varchar', { name: 'password', length: 255 })
  public password: string;

  @Column('varchar', { name: 'profile_image', length: 255, nullable: true })
  public profileImage: string;

  @Column('varchar', { name: 'referral', length: 255, nullable: true })
  public referral: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;

  @Column('boolean', { name: 'email_verified', default: false })
  public emailVerified: boolean;

  @Column('varchar', { name: 'curriculum_vitae', length: 250, nullable: true })
  public cv: string;

  @Column('varchar', { name: 'date_of_birth', length: 250, nullable: true })
  public dob: string;

  @Column('varchar', { name: 'phone_number', length: 250, nullable: true })
  public phoneNumber: string;

  @Column('varchar', { name: 'gender', length: 250, nullable: true })
  public gender: string;

  @Column('int', { name: 'timer', nullable: true })
  timer: number;

  @OneToMany(() => CardToken, token => token.user)
  cardTokens: CardToken[];

  @OneToMany(() => Businesses, bussiness => bussiness.user, { cascade: ['soft-remove', 'remove'] })
  public businesses: Businesses[];
}
