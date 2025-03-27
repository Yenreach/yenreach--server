import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Image } from "../../images/entities/image.entity";

@Entity("cms")
export class Cms {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  hero_text: string;

  // Single images as URL fields
  @Column({ type: "text", nullable: true })
  product_image: string;

  @Column({ type: "text", nullable: true })
  job_image: string;

  @Column({ type: "text", nullable: true })
  business_image: string;

  // Multiple hero images (One-to-Many relationship)
  @OneToMany(() => Image, (image) => image.cms, { cascade: true })
  hero_images: Image[];

  @Column({ type: "text", nullable: true })
  product_text: string;

  @Column({ type: "text", nullable: true })
  job_text: string;

  @Column({ type: "text", nullable: true })
  business_text: string;

  @Column({ type: "text", nullable: true })
  about_us: string;

  @Column({ type: "text", nullable: true })
  privacy_policy: string;

  @Column({ type: "text", nullable: true })
  terms_conditions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
