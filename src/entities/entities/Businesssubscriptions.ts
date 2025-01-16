import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businesssubscriptions", { schema: "yenreach" })
export class Businesssubscriptions {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "package", length: 255 })
  package: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("int", { name: "position" })
  position: number;

  @Column("int", { name: "photos" })
  photos: number;

  @Column("int", { name: "videos" })
  videos: number;

  @Column("int", { name: "slider" })
  slider: number;

  @Column("int", { name: "socialmedia" })
  socialmedia: number;

  @Column("int", { name: "branches" })
  branches: number;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
