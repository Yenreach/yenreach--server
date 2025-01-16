import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("facilities", { schema: "yenreach" })
export class Facilities {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "facility", length: 1000 })
  facility: string;

  @Column("varchar", { name: "minimum_subscription", length: 255 })
  minimumSubscription: string;

  @Column("int", { name: "activation" })
  activation: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "updated" })
  updated: number;
}
