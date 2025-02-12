import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
// import { Business } from "./business.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: false })
  product_name: string;

  @Column({ type: "text", nullable: false })
  product_description: string;

  @Column({ type: "integer", nullable: false })
  product_quantity: number;

  @Column({ type: "integer", nullable: false })
  product_price: number;

  @Column({ type: "text", nullable: false })
  product_color: string;

  @Column({ type: "text", nullable: false })
  product_safety_tip: string;

  @Column({ type: "tinyint", nullable: false })
  product_status: number;

  @Column({ type: "integer", nullable: false })
  created_at: number;

  @Column({ type: "integer", nullable: false })
  updated_at: number;

  @Column({ type: "integer", nullable: false })
  business_id: number;

  // @ManyToOne(() => Business, (business) => business.products, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  // @JoinColumn({ name: "business_id" })
  // business: Business;
}
