import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("activitylogs", { schema: "yenreach" })
export class Activitylogs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "agent_type", length: 255 })
  agentType: string;

  @Column("varchar", { name: "agent_string", length: 255 })
  agentString: string;

  @Column("varchar", { name: "object_type", length: 255 })
  objectType: string;

  @Column("varchar", { name: "object_string", length: 255 })
  objectString: string;

  @Column("varchar", { name: "activity", length: 255 })
  activity: string;

  @Column("text", { name: "details" })
  details: string;

  @Column("int", { name: "created" })
  created: number;
}
