import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateBusinessTable1739978061121 implements MigrationInterface {
  name = "CreateBusinessTable1739978061121";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "businesses",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "user_string",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "subscription_string",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "category",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "facilities",
            type: "text",
            isNullable: false,
          },
          {
            name: "address",
            type: "text",
            isNullable: false,
          },
          {
            name: "town",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "lga",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "state",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "state_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "phonenumber",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "whatsapp",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "website",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "facebook_link",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "twitter_link",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "instagram_link",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "youtube_link",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "linkedin_link",
            type: "varchar",
            length: "1000",
            isNullable: false,
          },
          {
            name: "working_hours",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "cv",
            type: "text",
            isNullable: false,
          },
          {
            name: "experience",
            type: "int",
            isNullable: false,
          },
          {
            name: "month_started",
            type: "varchar",
            length: "2",
            isNullable: false,
          },
          {
            name: "year_started",
            type: "varchar",
            length: "4",
            isNullable: false,
          },
          {
            name: "profile_img",
            type: "varchar",
            length: "250",
            isNullable: false,
          },
          {
            name: "cover_img",
            type: "varchar",
            length: "250",
            isNullable: false,
          },
          {
            name: "reg_stage",
            type: "int",
            isNullable: false,
          },
          {
            name: "activation",
            type: "int",
            isNullable: false,
          },
          {
            name: "filename",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "remarks",
            type: "text",
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

    // Adding foreign key constraints
    await queryRunner.createForeignKey(
      "businesses",
      new TableForeignKey({
        columnNames: ["state_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "states",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "businesses",
      new TableForeignKey({
        columnNames: ["user_string"],
        referencedColumnNames: ["verify_string"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "businesses",
      new TableForeignKey({
        columnNames: ["subscription_string"],
        referencedColumnNames: ["verify_string"],
        referencedTableName: "subscriptions",
        onDelete: "SET NULL",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("businesses");
  }
}
