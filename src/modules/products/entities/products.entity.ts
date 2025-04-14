import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { ProductCategory } from "./product-categories.entity";
import { ProductPhoto } from "./product-photos.entity";
import { IProduct } from "../interfaces";
// import { Business } from "./business.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
// import { Businesses } from "../../business/entities/businesses.entity";

@Entity("products")
export class Products implements IProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "verify_string", type: "text", nullable: false })
  verifyString: string;

  @Column({ name: "business_string", type: "text", nullable: false })
  businessString: string;

  @Column({ name: "product_name", type: "text", nullable: false })
  productName: string;

  @Column({ name: "product_description", type: "text", nullable: false })
  productDescription: string;

  @Column({ name: "product_quantity", type: "integer", nullable: false })
  productQuantity: number;

  @Column({ name: "product_price", type: "integer", nullable: false })
  productPrice: number;

  @Column({ name: "product_color", type: "text", nullable: false })
  productColor: string;

  @Column({ name: "product_safety_tip", type: "text", nullable: false })
  productSafetyTip: string;

  @Column({ type: "tinyint", nullable: false })
  productStatus: number;

  @Column({ name: "created_at", type: "integer", nullable: false })
  createdAt: number;

  @Column({ name: "updated_at", type: "integer", nullable: false })
  updatedAt: number;

  @OneToMany(() => ProductPhoto, (photo) => photo.product)
  photos: ProductPhoto[];

  @ManyToMany(() => ProductCategory, (category) => category.products)
  @JoinTable({
      name: "product_category_relations",
      joinColumn: { name: "product_id", referencedColumnName: "id" },
      inverseJoinColumn: { name: "category_id", referencedColumnName: "id" }
  })
  categories: ProductCategory[];

  // @ManyToOne(() => Businesses, (business) => business.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  // @JoinColumn({ name: "business_string" })
  // business: Businesses;
}
