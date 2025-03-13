import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
// import { Business } from "./business.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  verifyString: string;

  @Column({ type: "text", nullable: false })
  businessString: string;

  @Column({ type: "text", nullable: false })
  productName: string;

  @Column({ type: "text", nullable: false })
  productDescription: string;

  @Column({ type: "integer", nullable: false })
  productQuantity: number;

  @Column({ type: "integer", nullable: false })
  productPrice: number;

  @Column({ type: "text", nullable: false })
  productColor: string;

  @Column({ type: "text", nullable: false })
  productSafetyTip: string;

  @Column({ type: "tinyint", nullable: false })
  productStatus: number;

  @Column({ type: "integer", nullable: false })
  createdAt: number;

  @Column({ type: "integer", nullable: false })
  updatedAt: number;

  @Column({ type: "integer", nullable: false })
  businessId: number;

  // @ManyToOne(() => Business, (business) => business.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  // @JoinColumn({ name: "business_id" })
  // business: Business;
}
