import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("privacypolicy", { schema: "yenreach" })
export class Privacypolicy {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "admin_string" })
  adminString: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
