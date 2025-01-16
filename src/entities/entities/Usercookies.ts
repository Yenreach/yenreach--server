import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usercookies", { schema: "yenreach" })
export class Usercookies {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "cookie", length: 500 })
  cookie: string;

  @Column("int", { name: "created" })
  created: number;
}
