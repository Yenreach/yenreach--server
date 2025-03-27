import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCmsTable1743068772171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "cms",
        columns: [
          { name: "id", type: "char", length: "36", isPrimary: true },
          { name: "product_image", type: "text", isNullable: true },
          { name: "job_image", type: "text", isNullable: true },
          { name: "business_image", type: "text", isNullable: true },
          { name: "product_text", type: "text", isNullable: true },
          { name: "job_text", type: "text", isNullable: true },
          { name: "business_text", type: "text", isNullable: true },
          { name: "about_us", type: "text", isNullable: true },
          { name: "privacy_policy", type: "text", isNullable: true },
          { name: "terms_conditions", type: "text", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()", onUpdate: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "images",
        columns: [
          { name: "id", type: "char", length: "36", isPrimary: true },
          { name: "url", type: "text" },
          { name: "cms_id", type: "char", length: "36", isNullable: false },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()", onUpdate: "CURRENT_TIMESTAMP" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "images",
      new TableForeignKey({
        columnNames: ["cms_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "cms",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("images");
    await queryRunner.dropTable("cms");
  }
}
