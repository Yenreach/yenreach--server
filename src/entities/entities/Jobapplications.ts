import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("jobapplications", { schema: "yenreach" })
export class Jobapplications {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "application_string", length: 250 })
  applicationString: string;

  @Column("varchar", { name: "job_string", length: 250 })
  jobString: string;

  @Column("varchar", { name: "user_string", length: 250 })
  userString: string;

  @Column("varchar", { name: "full_name", length: 250 })
  fullName: string;

  @Column("varchar", { name: "email", length: 250 })
  email: string;

  @Column("varchar", { name: "phone", length: 250 })
  phone: string;

  @Column("varchar", { name: "document", length: 250 })
  document: string;

  @Column("varchar", { name: "status", length: 250 })
  status: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
