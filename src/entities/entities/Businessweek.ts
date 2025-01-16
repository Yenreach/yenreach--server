import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businessweek", { schema: "yenreach" })
export class Businessweek {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("int", { name: "expiry" })
  expiry: number;

  @Column("int", { name: "created" })
  created: number;
}
