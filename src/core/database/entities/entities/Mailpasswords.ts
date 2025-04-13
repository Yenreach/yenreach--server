import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mailpasswords", { schema: "yenreach" })
export class Mailpasswords {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "user_type", length: 255 })
  userType: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "email", length: 1000 })
  email: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;

  @Column("varchar", { name: "incoming_server", length: 1000 })
  incomingServer: string;

  @Column("varchar", { name: "outgoing_server", length: 1000 })
  outgoingServer: string;

  @Column("varchar", { name: "smtp_port", length: 10 })
  smtpPort: string;

  @Column("varchar", { name: "pop3_port", length: 10 })
  pop3Port: string;

  @Column("varchar", { name: "imap_port", length: 10 })
  imapPort: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
