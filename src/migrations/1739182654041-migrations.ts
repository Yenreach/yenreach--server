import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Migrations1739182654041 implements MigrationInterface {
  name = 'Migrations1739182654041'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "1000", isNullable: false },
        { name: "email", type: "varchar", length: "255", isNullable: false },
        { name: "timer", type: "integer", isNullable: false },
        { name: "password", type: "varchar", length: "255", isNullable: false },
        { name: "image", type: "varchar", length: "255", isNullable: true },
        { name: "listed", type: "integer", isNullable: true },
        { name: "refer_method", type: "varchar", length: "255", isNullable: true },
        { name: "admin", type: "integer", isNullable: true },
        { name: "datecreated", type: "datetime", default: "CURRENT_TIMESTAMP", isNullable: false },
        { name: "lastmodified", type: "datetime", default: "CURRENT_TIMESTAMP", isNullable: false },
        { name: "modifiedby", type: "varchar", length: "255", isNullable: true },
        { name: "activation", type: "integer", default: 2, isNullable: false },
        { name: "autho_level", type: "integer", default: 1, isNullable: false },
        { name: "created", type: "integer", default: "CURRENT_TIMESTAMP", isNullable: false },
        { name: "last_updated", type: "integer", default: "CURRENT_TIMESTAMP", isNullable: false },
        { name: "confirmed_email", type: "integer", isNullable: true },
        { name: "email_track", type: "integer", default: 1, isNullable: true },
        { name: "sms_track", type: "integer", default: 1, isNullable: false },
        { name: "cv", type: "varchar", length: "250", isNullable: true },
        { name: "dob", type: "varchar", length: "250", isNullable: true },
        { name: "phone", type: "varchar", length: "250", isNullable: true },
        { name: "gender", type: "varchar", length: "250", isNullable: true }
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
