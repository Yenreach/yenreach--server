import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveBusinessConstraint implements MigrationInterface {
  name = 'AddBusinessOfTheWeekConstraint';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX one_business_of_the_week
      ON business_of_the_week (expires_at)
      WHERE expires_at > NOW()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX one_business_of_the_week`);
  }
}
