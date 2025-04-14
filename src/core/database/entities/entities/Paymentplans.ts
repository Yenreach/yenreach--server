import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("paymentplans", { schema: "yenreach" })
export class Paymentplans {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "subscription_string", length: 255 })
  subscriptionString: string;

  @Column("varchar", { name: "plan", length: 255 })
  plan: string;

  @Column("int", { name: "duration_type" })
  durationType: number;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("text", { name: "description" })
  description: string;

  @Column("double", { name: "price", precision: 22 })
  price: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
