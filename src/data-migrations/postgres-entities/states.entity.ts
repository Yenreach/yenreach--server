import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

import { LocalGovernments } from './local-governments.entity';

@Entity('states', { schema: 'yenreach_schema' })
export class States {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('int', { name: 'num_id' })
  public num_id: number;

  @Column('varchar', { name: 'name', length: 100 })
  public name: string;

  @OneToMany(() => LocalGovernments, (localGovernments: LocalGovernments) => localGovernments.state)
  public localGovernments: LocalGovernments[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
