import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Cms } from "../../cms/entities/cms.entity";

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  url: string;

  @ManyToOne(() => Cms, (cms) => cms.hero_images, { onDelete: "CASCADE" })
  cms: Cms;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
