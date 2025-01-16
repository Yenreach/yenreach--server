import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { States } from "./States";

@Index("state_id", ["stateId"], {})
@Entity("local_governments", { schema: "yenreach" })
export class LocalGovernments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "state_id" })
  stateId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @ManyToOne(() => States, (states) => states.localGovernments, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "state_id", referencedColumnName: "id" }])
  state: States;
}
