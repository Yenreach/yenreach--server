import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mailings", { schema: "yenreach" })
export class Mailings {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "ticket_id", length: 255 })
  ticketId: string;

  @Column("varchar", { name: "movement", length: 255 })
  movement: string;

  @Column("varchar", { name: "from_name", length: 1000 })
  fromName: string;

  @Column("varchar", { name: "from_mail", length: 1000 })
  fromMail: string;

  @Column("varchar", { name: "recipient_name", length: 1000 })
  recipientName: string;

  @Column("varchar", { name: "recipient_mail", length: 1000 })
  recipientMail: string;

  @Column("varchar", { name: "recipient_cc_name", length: 1000 })
  recipientCcName: string;

  @Column("varchar", { name: "recipient_cc", length: 1000 })
  recipientCc: string;

  @Column("varchar", { name: "recipient_bcc_name", length: 1000 })
  recipientBccName: string;

  @Column("varchar", { name: "recipient_bcc", length: 1000 })
  recipientBcc: string;

  @Column("varchar", { name: "subject", length: 255 })
  subject: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("text", { name: "alt_content" })
  altContent: string;

  @Column("varchar", { name: "reciever", length: 1000 })
  reciever: string;

  @Column("varchar", { name: "reply_name", length: 1000 })
  replyName: string;

  @Column("varchar", { name: "reply_mail", length: 1000 })
  replyMail: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "received_created" })
  receivedCreated: number;

  @Column("int", { name: "status" })
  status: number;
}
