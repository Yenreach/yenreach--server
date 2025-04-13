import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { States } from './states.entity';

@Entity('local_governments', { schema: 'yenreach_schema' })
export class LocalGovernments {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('int', { name: 'num_id' })
  public num_id: number;

  @Column('varchar', { name: 'name', length: 1000 })
  public name: string;

  @Column('uuid', { name: 'state_id' })
  public stateId: string;

  @ManyToOne(() => States, (state: States) => state.localGovernments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  public state: States;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
