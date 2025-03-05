import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductTable1739978073126 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "product_string",
            type: "text",
          },
          {
            name: "product_name",
            type: "text",
          },
          {
            name: "product_description",
            type: "text",
          },
          {
            name: "product_quantity",
            type: "int",
          },
          {
            name: "product_price",
            type: "int",
          },
          {
            name: "product_color",
            type: "text",
          },
          {
            name: "product_safety_tip",
            type: "text",
          },
          {
            name: "product_status",
            type: "tinyint",
            width: 1,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: "business_string",
            type: "varchar",
            length: "255",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["business_string"],
        referencedColumnNames: ["verify_string"],
        referencedTableName: "businesses",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("products", "business_string");
    await queryRunner.dropTable("products");
  }
}
