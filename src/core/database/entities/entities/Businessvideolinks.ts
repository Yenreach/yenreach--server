import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businessvideolinks", { schema: "yenreach" })
export class Businessvideolinks {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "user_string", length: 255 })
  userString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "video_link", length: 1000 })
  videoLink: string;

  @Column("varchar", { name: "real_link", length: 1000 })
  realLink: string;

  @Column("varchar", { name: "platform", length: 255 })
  platform: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
