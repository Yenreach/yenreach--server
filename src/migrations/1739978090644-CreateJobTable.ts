import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateJobTable1739978090644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "jobs",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "job_string",
            type: "varchar",
            length: "250",
            isUnique: true,
          },
          {
            name: "business_string",
            type: "varchar",
            length: "250",
          },
          {
            name: "company_name",
            type: "varchar",
            length: "250",
          },
          {
            name: "job_title",
            type: "varchar",
            length: "250",
          },
          {
            name: "job_type",
            type: "varchar",
            length: "250",
          },
          {
            name: "location",
            type: "varchar",
            length: "250",
          },
          {
            name: "salary",
            type: "varchar",
            length: "250",
          },
          {
            name: "job_overview",
            type: "varchar",
            length: "250",
          },
          {
            name: "job_benefit",
            type: "varchar",
            length: "250",
          },
          {
            name: "status",
            type: "tinyint",
            width: 1,
          },
          {
            name: "admin_job",
            type: "tinyint",
            width: 1,
          },
          {
            name: "job_link",
            type: "varchar",
            length: "250",
          },
          {
            name: "admin_string",
            type: "varchar",
            length: "250",
          },
          {
            name: "expiry_date",
            type: "varchar",
            length: "250",
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
        ],
      })
    );

    await queryRunner.createForeignKey(
      "jobs",
      new TableForeignKey({
        columnNames: ["business_string"],
        referencedColumnNames: ["verify_string"],
        referencedTableName: "businesses",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("jobs", "business_string");
    await queryRunner.dropTable("jobs");
  }
}
