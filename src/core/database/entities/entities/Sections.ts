import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sections", { schema: "yenreach" })
export class Sections {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "section", length: 255 })
  section: string;

  @Column("text", { name: "details" })
  details: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
