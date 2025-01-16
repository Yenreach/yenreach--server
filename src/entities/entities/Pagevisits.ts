import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("pagevisits", { schema: "yenreach" })
export class Pagevisits {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("text", { name: "categories" })
  categories: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "day", length: 2 })
  day: string;

  @Column("varchar", { name: "month", length: 2 })
  month: string;

  @Column("varchar", { name: "year", length: 4 })
  year: string;

  @Column("int", { name: "frequency" })
  frequency: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
