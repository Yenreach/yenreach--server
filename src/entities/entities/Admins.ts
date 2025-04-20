import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("admins", { schema: "yenreach" })
export class Admins {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "name", length: 1000 })
  name: string;

  @Column("varchar", { name: "username", length: 1000 })
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("int", { name: "timer" })
  timer: number;

  @Column("varchar", { name: "personal_email", length: 1000 })
  personalEmail: string;

  @Column("varchar", { name: "official_email", length: 1000 })
  officialEmail: string;

  @Column("varchar", { name: "phone", length: 255 })
  phone: string;

  @Column("int", { name: "activation" })
  activation: number;

  @Column("int", { name: "autho_level" })
  authoLevel: number;

  @Column("int", { name: "created" })
  created: number; 9
  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
