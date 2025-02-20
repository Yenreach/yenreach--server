import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("jobs", { schema: "yenreach" })
export class Jobs {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "job_string", length: 250 })
  jobString: string;

  @Column("varchar", { name: "business_string", length: 250 })
  businessString: string;

  @Column("varchar", { name: "company_name", length: 250 })
  companyName: string;

  @Column("varchar", { name: "job_title", length: 250 })
  jobTitle: string;

  @Column("varchar", { name: "job_type", length: 250 })
  jobType: string;

  @Column("varchar", { name: "location", length: 250 })
  location: string;

  @Column("varchar", { name: "salary", length: 250 })
  salary: string;

  @Column("varchar", { name: "job_overview", length: 250 })
  jobOverview: string;

  @Column("varchar", { name: "job_benefit", length: 250 })
  jobBenefit: string;

  @Column("tinyint", { name: "status", width: 1 })
  status: boolean;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;

  @Column("tinyint", { name: "admin_job", width: 1 })
  adminJob: boolean;

  @Column("varchar", { name: "job_link", length: 250 })
  jobLink: string;

  @Column("varchar", { name: "admin_string", length: 250 })
  adminString: string;

  @Column("varchar", { name: "expiry_date", length: 250 })
  expiryDate: string;
}

