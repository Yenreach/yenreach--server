import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users", { schema: "yenreach" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "name", length: 1000 })
  name: string;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("int", { name: "timer" })
  timer: number;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "image", length: 255 })
  image: string;

  @Column("int", { name: "listed" })
  listed: number;

  @Column("varchar", { name: "refer_method", length: 255 })
  referMethod: string;

  @Column("int", { name: "admin" })
  admin: number;

  @Column("datetime", { name: "datecreated" })
  datecreated: Date;

  @Column("datetime", { name: "lastmodified" })
  lastmodified: Date;

  @Column("varchar", { name: "modifiedby", length: 255 })
  modifiedby: string;

  @Column("int", { name: "activation" })
  activation: number;

  @Column("int", { name: "autho_level" })
  authoLevel: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;

  @Column("int", { name: "confirmed_email" })
  confirmedEmail: number;

  @Column("int", { name: "email_track", nullable: true, default: () => "'1'" })
  emailTrack: number | null;

  @Column("int", { name: "sms_track", default: () => "'1'" })
  smsTrack: number;

  @Column("varchar", { name: "cv", length: 250 })
  cv: string;

  @Column("varchar", { name: "dob", length: 250 })
  dob: string;

  @Column("varchar", { name: "phone", length: 250 })
  phone: string;

  @Column("varchar", { name: "gender", length: 250 })
  gender: string;
}
