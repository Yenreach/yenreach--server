import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJobColumnsLength20250918214700 implements MigrationInterface {
  name = 'UpdateJobColumnsLength20250918214700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN company_name TYPE VARCHAR(500)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN tittle TYPE VARCHAR(500)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN type TYPE VARCHAR(500)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN location TYPE VARCHAR(500)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN salary TYPE VARCHAR(500)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN application_expiry TYPE VARCHAR(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN company_name TYPE VARCHAR(255)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN tittle TYPE VARCHAR(255)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN type TYPE VARCHAR(255)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN location TYPE VARCHAR(255)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN salary TYPE VARCHAR(255)
    `);

    await queryRunner.query(`
      ALTER TABLE yenreach.jobs 
      ALTER COLUMN application_expiry TYPE VARCHAR(255)
    `);
  }
}
