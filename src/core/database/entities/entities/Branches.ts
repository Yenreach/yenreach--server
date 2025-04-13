import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("branches", { schema: "yenreach" })
export class Branches {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "head_designation", length: 255 })
  headDesignation: string;

  @Column("varchar", { name: "head_name", length: 1000 })
  headName: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("varchar", { name: "email", length: 1000 })
  email: string;

  @Column("text", { name: "address" })
  address: string;

  @Column("varchar", { name: "town", length: 1000 })
  town: string;

  @Column("varchar", { name: "lga", length: 255 })
  lga: string;

  @Column("int", { name: "state_id" })
  stateId: number;

  @Column("varchar", { name: "state", length: 255 })
  state: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updates" })
  lastUpdates: number;
}
