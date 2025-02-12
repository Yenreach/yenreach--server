import { Column, Entity, OneToMany } from "typeorm";
import { LocalGovernments } from "./Localgovernments";

@Entity("states", { schema: "yenreach" })
export class States {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @OneToMany(
    () => LocalGovernments,
    (localGovernments) => localGovernments.state
  )
  localGovernments: LocalGovernments[];
}
