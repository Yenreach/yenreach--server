import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexesToBillboardAndBusinessOfTheWeek implements MigrationInterface {
  name = 'AddIndexesToBillboardAndBusinessOfTheWeek';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_billboard_status_start_end" 
      ON "billboard_entries" ("status", "start_date", "end_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_botw_start_expires" 
      ON "business_of_the_week" ("start_date", "expires_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_botw_start_expires"`);
    await queryRunner.query(`DROP INDEX "IDX_billboard_status_start_end"`);
  }
}
