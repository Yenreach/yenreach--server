import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class Migrations1739181518069 implements MigrationInterface {
  name = 'Migrations1739181518069'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "products" table
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "product_name",
            type: "text",
            isNullable: false,
          },
          {
            name: "product_description",
            type: "text",
            isNullable: false,
          },
          {
            name: "product_quantity",
            type: "integer",
            isNullable: false,
          },
          {
            name: "product_price",
            type: "integer",
            isNullable: false,
          },
          {
            name: "product_color",
            type: "text",
            isNullable: false,
          },
          {
            name: "product_safety_tip",
            type: "text",
            isNullable: false,
          },
          {
            name: "product_status",
            type: "tinyint",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "integer",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "integer",
            isNullable: false,
          },
          {
            name: "business_id",
            type: "integer",
            isNullable: false,
          }
        ]
      })
    );

    // Create foreign key constraint for business_id
    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["business_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "businesses",
        onDelete: "CASCADE", // Deletes products if the referenced business is deleted
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key
    const table = await queryRunner.getTable("products");
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("business_id") !== -1
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey("products", foreignKey);
    }

    // Drop the "products" table
    await queryRunner.dropTable("products");
  }
}
