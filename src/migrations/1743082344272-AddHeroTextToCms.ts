import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddHeroTextToCms1743082344272 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn("cms", new TableColumn({
      name: "hero_text",
      type: "text",
      isNullable: true // Set to false if it must be required
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("cms", "hero_text");
  }

}
