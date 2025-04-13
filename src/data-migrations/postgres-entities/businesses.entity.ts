import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Tree,
  OneToMany,
  Index,
} from 'typeorm';
import { Users } from './users.entity';
import { States } from './states.entity';
import { LocalGovernments } from './local-governments.entity';
import { BusinessRegistrationState } from '../../modules/business/enums/business.enums';
import { BusinessCategories } from './business-categories.entity';
import { BusinessPhotos } from './business-photos.entity';
import { BusinessReviews } from './business.reviews.entity';
import { BusinessVideos } from './business-videos.entity';
import { BusinessWorkingHours } from './business-working-hours.entity';
import { Products } from './product.entity';

@Entity('businesses', { schema: 'yenreach_schema' })
export class Businesses {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'verify_string', length: 255 })
  public verifyString: string;

  @Column('varchar', { name: 'name', length: 255 })
  public name: string;

  @Column('text', { name: 'description' })
  public description: string;

  @Column('varchar', { name: 'user_string', length: 255 })
  public userString: string;

  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @Column('varchar', { name: 'subscription_string', length: 255, nullable: true })
  public subscriptionString: string;

  @Column('varchar', { name: 'address', length: 500 })
  public address: string;

  @Column('varchar', { name: 'town', length: 500 })
  public town: string;

  @Column('varchar', { name: 'lga_id', nullable: true })
  public lgaId: string;

  @Column('varchar', { name: 'state_id', nullable: true })
  public stateId: string;

  @Column('varchar', { name: 'phone_number', length: 100 })
  public phoneNumber: string;

  @Column('varchar', { name: 'whatsapp', length: 100 })
  public whatsapp: string;

  @Column('varchar', { name: 'email', length: 500 })
  public email: string;

  @Column('varchar', { name: 'website', length: 500, nullable: true })
  public website: string;

  @Column('varchar', { name: 'facebook_link', length: 500, nullable: true })
  public facebookLink: string;

  @Column('varchar', { name: 'twitter_link', length: 500, nullable: true })
  public twitterLink: string;

  @Column('varchar', { name: 'instagram_link', length: 500, nullable: true })
  public instagramLink: string;

  @Column('varchar', { name: 'youtube_link', length: 500, nullable: true })
  public youtubeLink: string;

  @Column('varchar', { name: 'linkedin_link', length: 500, nullable: true })
  public linkedinLink: string;

  @Column('varchar', { name: 'curriculum_vitae', nullable: true })
  public cv: string;

  @Column('int', { name: 'experience' })
  public experience: number;

  @Column('varchar', { name: 'month_started', length: 100 })
  public monthStarted: string;

  @Column('varchar', { name: 'year_started', length: 100 })
  public yearStarted: string;

  @Column('varchar', { name: 'profile_img', length: 250, nullable: true })
  public profileImg: string;

  @Column('varchar', { name: 'cover_img', length: 250, nullable: true })
  public coverImg: string;

  @Column('enum', { name: 'registration_status', enum: BusinessRegistrationState, default: BusinessRegistrationState.PENDING })
  public registrationStatus: BusinessRegistrationState;

  @Column('boolean', { name: 'is_active', default: false })
  public isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;

  @OneToMany(() => Products, product => product.business)
  public products: Products[];

  @OneToMany(() => BusinessCategories, businessCategory => businessCategory.business)
  public businessCategories: BusinessCategories[];

  @OneToMany(() => BusinessPhotos, businessPhotos => businessPhotos.business)
  public businessPhotos: BusinessPhotos[];

  @OneToMany(() => BusinessReviews, businessReviews => businessReviews.business)
  public businessReviews: BusinessReviews[];

  @OneToMany(() => BusinessVideos, businessVideos => businessVideos.business)
  public businessVideos: BusinessVideos[];

  @OneToMany(() => BusinessWorkingHours, businessWorkingHours => businessWorkingHours.business)
  public businessWorkingHours: BusinessWorkingHours[];

  @ManyToOne(() => Users, (user: Users) => user.businesses)
  @JoinColumn({ name: 'user_id' })
  public user: Users;

  @ManyToOne(() => States)
  @JoinColumn({ name: 'state_id' })
  public state: States;

  @ManyToOne(() => LocalGovernments)
  @JoinColumn({ name: 'lga_id' })
  public lga: LocalGovernments;
}
