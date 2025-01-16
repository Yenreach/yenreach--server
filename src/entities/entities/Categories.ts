import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories", { schema: "yenreach" })
export class Categories {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "section_string", length: 255 })
  sectionString: string;

  @Column("varchar", { name: "category", length: 255 })
  category: string;

  @Column("text", { name: "details" })
  details: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
