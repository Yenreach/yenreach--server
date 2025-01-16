import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("feedback", { schema: "yenreach" })
export class Feedback {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "feedback_string" })
  feedbackString: string;

  @Column("text", { name: "name" })
  name: string;

  @Column("text", { name: "email" })
  email: string;

  @Column("text", { name: "subject" })
  subject: string;

  @Column("text", { name: "message" })
  message: string;

  @Column("int", { name: "status" })
  status: number;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
