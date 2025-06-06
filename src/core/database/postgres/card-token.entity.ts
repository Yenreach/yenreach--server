import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Users } from './users.entity';

@Entity('card_token', { schema: 'yenreach' })
@Unique(['token']) // Prevents duplicate tokens
export class CardToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column()
  last4: string;

  @Column()
  cardType: string; // e.g. 'visa', 'mastercard'

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  expiry: string;

  // @ManyToOne(() => Users, user => user.cardTokens, { onDelete: 'CASCADE' })
  // user: Users;

  @ManyToOne(() => Users, user => user.cardTokens)
  user: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
