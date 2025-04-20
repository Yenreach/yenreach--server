import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mailattachments", { schema: "yenreach" })
export class Mailattachments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "mail_string", length: 255 })
  mailString: string;

  @Column("varchar", { name: "filename", length: 255 })
  filename: string;

  @Column("varchar", { name: "filepath", length: 1000 })
  filepath: string;

  @Column("int", { name: "created" })
  created: number;
}
