import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("billboardapplications", { schema: "yenreach" })
export class Billboardapplications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "code", length: 255 })
  code: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "filename", length: 255 })
  filename: string;

  @Column("varchar", { name: "title", length: 50 })
  title: string;

  @Column("varchar", { name: "text", length: 160 })
  text: string;

  @Column("varchar", { name: "call_to_action_type", length: 255 })
  callToActionType: string;

  @Column("varchar", { name: "call_to_action_link", length: 255 })
  callToActionLink: string;

  @Column("varchar", { name: "advert_type", length: 255 })
  advertType: string;

  @Column("varchar", { name: "proposed_start_date", length: 255 })
  proposedStartDate: string;

  @Column("date", { name: "start_date" })
  startDate: string;

  @Column("date", { name: "end_date" })
  endDate: string;

  @Column("int", { name: "stage" })
  stage: number;

  @Column("text", { name: "remarks" })
  remarks: string;

  @Column("varchar", { name: "agent_type", length: 255 })
  agentType: string;

  @Column("varchar", { name: "agent_string", length: 255 })
  agentString: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
