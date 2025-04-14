import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("subscribers", { schema: "yenreach" })
export class Subscribers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "subscription_string", length: 255 })
  subscriptionString: string;

  @Column("varchar", { name: "paymentplan_string", length: 255 })
  paymentplanString: string;

  @Column("double", { name: "amount_paid", precision: 22 })
  amountPaid: number;

  @Column("int", { name: "duration_type" })
  durationType: number;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("int", { name: "started" })
  started: number;

  @Column("int", { name: "expired" })
  expired: number;

  @Column("int", { name: "true_expiry" })
  trueExpiry: number;

  @Column("int", { name: "status" })
  status: number;

  @Column("varchar", { name: "payment_method", length: 255 })
  paymentMethod: string;

  @Column("int", { name: "auto_renew" })
  autoRenew: number;

  @Column("int", { name: "auto_renewal" })
  autoRenewal: number;

  @Column("varchar", { name: "agent_type", length: 255 })
  agentType: string;

  @Column("varchar", { name: "agent_string", length: 255 })
  agentString: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
