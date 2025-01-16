import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("productcategorylist", { schema: "yenreach" })
export class Productcategorylist {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "category_string" })
  categoryString: string;

  @Column("text", { name: "category" })
  category: string;

  @Column("text", { name: "details" })
  details: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
