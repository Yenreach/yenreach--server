import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAdminTable1739978044396 implements MigrationInterface {
  name = "CreateAdminTable1739978044396";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "admins",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "verify_string",
            type: "varchar",
            length: "255",
            isNullable: false
          },
          {
            name: "name",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "username",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "timer",
            type: "int",
            isNullable: false,
          },
          {
            name: "personal_email",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "official_email",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "phone",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "activation",
            type: "int",
            isNullable: false,
          },
          {
            name: "autho_level",
            type: "int",
            isNullable: false,
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
          }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("admins");
  }
}

