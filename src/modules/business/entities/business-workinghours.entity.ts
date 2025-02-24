import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('businessworkinghours', { schema: 'yenreach' })
export class Businessworkinghours {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'verify_string', length: 255 })
  verifyString: string;

  @Column('varchar', { name: 'business_string', length: 255 })
  businessString: string;

  @Column('varchar', { name: 'day', length: 255 })
  day: string;

  @Column('varchar', { name: 'timing', length: 255 })
  timing: string;

  @Column('varchar', { name: 'opening_time', length: 255 })
  openingTime: string;

  @Column('varchar', { name: 'closing_time', length: 255 })
  closingTime: string;

  @Column('int', { name: 'created' })
  created: number;

  @Column('int', { name: 'last_updated' })
  lastUpdated: number;
}
