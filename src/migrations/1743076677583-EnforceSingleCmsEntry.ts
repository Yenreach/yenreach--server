import { MigrationInterface, QueryRunner } from "typeorm";

export class EnforceSingleCmsEntry1743076677583 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`cms\` ADD CONSTRAINT \`UQ_CMS_SINGLE_ENTRY\` UNIQUE (\`id\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`cms\` DROP CONSTRAINT \`UQ_CMS_SINGLE_ENTRY\`;
    `);
  }
}
