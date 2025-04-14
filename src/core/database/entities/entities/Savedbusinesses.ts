import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("savedbusinesses", { schema: "yenreach" })
export class Savedbusinesses {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("int", { name: "created" })
  created: number;
}
