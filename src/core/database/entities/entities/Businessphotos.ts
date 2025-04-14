import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businessphotos", { schema: "yenreach" })
export class Businessphotos {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "filename", length: 255 })
  filename: string;

  @Column("varchar", { name: "filepath", length: 255 })
  filepath: string;

  @Column("int", { name: "size" })
  size: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
