import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("recievedpayments", { schema: "yenreach" })
export class Recievedpayments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", nullable: true, length: 255 })
  verifyString: string | null;

  @Column("varchar", { name: "platform", length: 500 })
  platform: string;

  @Column("varchar", { name: "tx_ref", length: 255 })
  txRef: string;

  @Column("varchar", { name: "user_type", length: 255 })
  userType: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "reason", length: 255 })
  reason: string;

  @Column("varchar", { name: "subject", length: 255 })
  subject: string;

  @Column("varchar", { name: "currency", length: 5 })
  currency: string;

  @Column("double", { name: "amount", precision: 22 })
  amount: number;

  @Column("text", { name: "response1" })
  response1: string;

  @Column("text", { name: "response2" })
  response2: string;

  @Column("text", { name: "response3" })
  response3: string;

  @Column("text", { name: "response4" })
  response4: string;

  @Column("text", { name: "response5" })
  response5: string;

  @Column("int", { name: "status" })
  status: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
