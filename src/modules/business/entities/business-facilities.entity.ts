import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("businessfacilities", { schema: "yenreach" })
export class Businessfacilities {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "verify_string", length: 255 })
  verifyString: string;

  @Column("varchar", { name: "business_string", length: 255 })
  businessString: string;

  @Column("varchar", { name: "facility_string", length: 255 })
  facilityString: string;

  @Column("int", { name: "created" })
  created: number;

  @Column("int", { name: "last_updated" })
  lastUpdated: number;
}
