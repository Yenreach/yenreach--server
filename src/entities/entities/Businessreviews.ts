import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businessreviews", { schema: "yenreach" })
export class Businessreviews {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("text", { name: "review" })
  review: string;

  @Column("int", { name: "star" })
  star: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
