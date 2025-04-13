import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("productphotos", { schema: "yenreach" })
export class Productphotos {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "photo_string" })
  photoString: string;

  @Column("text", { name: "product_string" })
  productString: string;

  @Column("text", { name: "filename" })
  filename: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
