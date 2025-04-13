import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("jobtags", { schema: "yenreach" })
export class Jobtags {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "tag_string", length: 250 })
  tagString: string;

  @Column("varchar", { name: "job_string", length: 250 })
  jobString: string;

  @Column("varchar", { name: "tag", length: 250 })
  tag: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
