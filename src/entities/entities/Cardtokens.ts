import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("cardtokens", { schema: "yenreach" })
export class Cardtokens {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_type", length: 255 })
  userType: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "platform", length: 255 })
  platform: string;

  @Column("varchar", { name: "card_type", length: 100 })
  cardType: string;

  @Column("varchar", { name: "issuer", length: 255 })
  issuer: string;

  @Column("varchar", { name: "card_digits", length: 100 })
  cardDigits: string;

  @Column("varchar", { name: "expiry", length: 50 })
  expiry: string;

  @Column("varchar", { name: "token", length: 500 })
  token: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
