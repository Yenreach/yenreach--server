import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("products", { schema: "yenreach" })
export class Products {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "business_string" })
  businessString: string;

  @Column("text", { name: "product_string" })
  productString: string;

  @Column("text", { name: "product_name" })
  productName: string;

  @Column("text", { name: "product_description" })
  productDescription: string;

  @Column("int", { name: "product_quantity" })
  productQuantity: number;

  @Column("int", { name: "product_price" })
  productPrice: number;

  @Column("text", { name: "product_color" })
  productColor: string;

  @Column("text", { name: "product_safety_tip" })
  productSafetyTip: string;

  @Column("tinyint", { name: "product_status", width: 1 })
  productStatus: boolean;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
