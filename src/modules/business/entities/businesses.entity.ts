import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../user/entities/user.entity';

@Entity('businesses', { schema: 'yenreach' })
export class Businesses {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({
    type: 'uuid',
    name: 'business_id',
    length: 255,
    unique: true,
  })
  @Generated('uuid')
  businessId: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'user_id' })
  ownerId: string;

  @Column('varchar', { name: 'verify_string', length: 255 })
  verifyString: string;

  @Column('varchar', { name: 'name', length: 1000 })
  name: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('varchar', { name: 'user_string', length: 255 })
  userString: string;

  @Column('varchar', { name: 'subscription_string', length: 255 })
  subscriptionString: string;

  @Column('varchar', { name: 'category', length: 1000 })
  category: string;

  @Column('text', { name: 'facilities' })
  facilities: string;

  @Column('text', { name: 'address' })
  address: string;

  @Column('varchar', { name: 'town', length: 1000 })
  town: string;

  @Column('varchar', { name: 'lga', length: 1000 })
  lga: string;

  @Column('varchar', { name: 'state', length: 500 })
  state: string;

  @Column('int', { name: 'state_id' })
  stateId: number;

  @Column('varchar', { name: 'phonenumber', length: 100 })
  phonenumber: string;

  @Column('varchar', { name: 'whatsapp', length: 100 })
  whatsapp: string;

  @Column('varchar', { name: 'email', length: 1000 })
  email: string;

  @Column('varchar', { name: 'website', length: 1000 })
  website: string;

  @Column('varchar', { name: 'facebook_link', length: 1000 })
  facebookLink: string;

  @Column('varchar', { name: 'twitter_link', length: 255 })
  twitterLink: string;

  @Column('varchar', { name: 'instagram_link', length: 1000 })
  instagramLink: string;

  @Column('varchar', { name: 'youtube_link', length: 1000 })
  youtubeLink: string;

  @Column('varchar', { name: 'linkedin_link', length: 1000 })
  linkedinLink: string;

  @Column('varchar', { name: 'working_hours', length: 500 })
  workingHours: string;

  @Column('text', { name: 'cv' })
  cv: string;

  @Column('varchar', { name: 'modifiedby', length: 255 })
  modifiedby: string;

  @Column('int', { name: 'experience' })
  experience: number;

  @Column('varchar', { name: 'month_started', length: 2 })
  monthStarted: string;

  @Column('varchar', { name: 'year_started', length: 4 })
  yearStarted: string;

  @Column('varchar', { name: 'profile_img', length: 250 })
  profileImg: string;

  @Column('varchar', { name: 'cover_img', length: 250 })
  coverImg: string;

  @Column('int', { name: 'reg_stage' })
  regStage: number;

  @Column('int', { name: 'activation' })
  activation: number;

  @Column('varchar', { name: 'filename', length: 255 })
  filename: string;

  @Column('text', { name: 'remarks' })
  remarks: string;

  @Column('int', { name: 'created' })
  created: number;

  @Column('int', { name: 'last_updated' })
  lastUpdated: number;
}
