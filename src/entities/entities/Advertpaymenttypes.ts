import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("advertpaymenttypes", { schema: "yenreach" })
export class Advertpaymenttypes {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("int", { name: "duration_type" })
  durationType: number;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("double", { name: "amount", precision: 22 })
  amount: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
