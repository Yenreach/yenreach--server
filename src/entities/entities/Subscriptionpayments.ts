import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("subscriptionpayments", { schema: "yenreach" })
export class Subscriptionpayments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_type", length: 255 })
  userType: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "subscription_string", length: 255 })
  subscriptionString: string;

  @Column("varchar", { name: "paymentplan_string", length: 255 })
  paymentplanString: string;

  @Column("int", { name: "status" })
  status: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
