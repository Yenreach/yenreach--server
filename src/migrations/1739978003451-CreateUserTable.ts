import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1739978003451 implements MigrationInterface {
  name = 'CreateUserTable1739978003451'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "users",
      columns: [
        { name: "id", type: "integer", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "verify_string", type: "varchar", length: "255", isNullable: false },
        { name: "name", type: "varchar", length: "1000", isNullable: false },
        { name: "email", type: "varchar", length: "255", isNullable: false },
        { name: "timer", type: "integer", isNullable: false },
        { name: "password", type: "varchar", length: "255", isNullable: false },
        { name: "image", type: "varchar", length: "255", isNullable: true },
        { name: "listed", type: "integer", isNullable: true },
        { name: "refer_method", type: "varchar", length: "255", isNullable: true },
        { name: "admin", type: "integer", isNullable: true },
        { name: "activation", type: "integer", default: 2, isNullable: false },
        { name: "autho_level", type: "integer", default: 1, isNullable: false },
        { name: "confirmed_email", type: "integer", isNullable: true },
        { name: "email_track", type: "integer", default: 1, isNullable: true },
        { name: "sms_track", type: "integer", default: 1, isNullable: false },
        { name: "cv", type: "varchar", length: "250", isNullable: true },
        { name: "dob", type: "varchar", length: "250", isNullable: true },
        { name: "phone", type: "varchar", length: "250", isNullable: true },
        { name: "gender", type: "varchar", length: "250", isNullable: true },
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
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}

