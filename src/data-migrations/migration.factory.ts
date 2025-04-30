import { DataSource, DeepPartial } from 'typeorm';

export class MigrationFactory {
  constructor(private oldDataSource: DataSource, private newDataSource: DataSource) {}

  // === Migrate all records in a single transaction ===
  public async migrateAllInTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity> | null> | null,
  ) {
    const queryRunner = this.newDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const oldEntities = await this.oldDataSource.getRepository(oldEntityClass).find();

      const transformed = (await Promise.all(oldEntities.map(old => transform(old)))).filter(t => t !== null);

      const newEntities = transformed.map(data => queryRunner.manager.create(newEntityClass, data));

      // const newEntities = await Promise.all(oldEntities.map(async old => queryRunner.manager.create(newEntityClass, await transform(old))));

      // const newEntities: NewEntity[] = [];

      // for (const old of oldEntities) {
      //   try {
      //     const transformed = await transform(old);
      //     const newEntity = queryRunner.manager.create(newEntityClass, transformed);
      //     newEntities.push(newEntity);
      //   } catch (err) {
      //     console.error('Transform failed for entity:', old, '\nError:', err);
      //     throw err;
      //   }
      // }

      const saved = await queryRunner.manager.save(newEntityClass, newEntities);
      await queryRunner.commitTransaction();

      console.log(`✅ Migrated ${saved.length} entities.`);
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Migration failed in transaction:', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // === Migrate one-by-one without transaction ===
  public async migrateIndividuallyWithoutTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
  ) {
    const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
    const newRepo = this.newDataSource.getRepository(newEntityClass);
    const oldEntities = await oldRepo.find();

    let count = 0;
    for (const old of oldEntities) {
      try {
        const newEntity = newRepo.create(await transform(old));
        await newRepo.save(newEntity);
        count++;
        console.log(`→ Migrated ${count}`);
      } catch (err) {
        console.error('⚠️ Failed to migrate one entity:', err);
      }
    }

    console.log(`✅ Migration complete: ${count} entities`);
    return count;
  }

  // === Migrate one-by-one with transaction per entity ===
  public async migrateIndividuallyWithTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
  ) {
    const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
    const oldEntities = await oldRepo.find();

    let count = 0;
    for (const old of oldEntities) {
      const queryRunner = this.newDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newEntity = queryRunner.manager.create(newEntityClass, await transform(old));
        await queryRunner.manager.save(newEntity);
        await queryRunner.commitTransaction();
        count++;
        console.log(`→ Migrated ${count}`);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('⚠️ Failed in transaction for entity:', err);
      } finally {
        await queryRunner.release();
      }
    }

    console.log(`✅ Migration complete: ${count} entities`);
    return count;
  }

  // === Migrate all at once without transaction ===
  public async migrateAllWithoutTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
  ) {
    const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
    const newRepo = this.newDataSource.getRepository(newEntityClass);

    const oldEntities = await oldRepo.find();
    const newEntities = await Promise.all(oldEntities.map(async old => newRepo.create(await transform(old))));

    await newRepo.save(newEntities);
    console.log(`✅ Migrated ${newEntities.length} entities (no transaction)`);
    return newEntities.length;
  }

  // === Migrate in batches without transaction ===
  async migrateInBatchesWithoutTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
    batchSize = 5,
  ) {
    const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
    const newRepo = this.newDataSource.getRepository(newEntityClass);

    let offset = 0;
    let count = 0;

    while (true) {
      const batch = await oldRepo.find({ take: batchSize, skip: offset });
      if (!batch.length) break;

      const transformed = await Promise.all(batch.map(async old => newRepo.create(await transform(old))));
      await newRepo.save(transformed);

      count += transformed.length;
      offset += batchSize;
      console.log(`→ Migrated ${count} records...`);
    }

    console.log(`✅ Total migrated: ${count} (batch, no transaction)`);
  }

  // === Migrate in batches with transaction ===
  public async migrateInBatchesWithTransaction<OldEntity, NewEntity>(
    oldEntityClass: new () => OldEntity,
    newEntityClass: new () => NewEntity,
    transform: (old: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
    batchSize = 5,
  ) {
    const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
    const newRepo = this.newDataSource.getRepository(newEntityClass);

    let offset = 0;
    let count = 0;

    while (true) {
      const batch = await oldRepo.find({ take: batchSize, skip: offset });
      if (!batch.length) break;

      const queryRunner = this.newDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newEntities = await Promise.all(batch.map(async old => queryRunner.manager.create(newEntityClass, await transform(old))));

        await queryRunner.manager.save(newEntities);
        await queryRunner.commitTransaction();

        count += newEntities.length;
        offset += batchSize;
        console.log(`→ Migrated ${count} records...`);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.error('⚠️ Batch failed, rolled back:', err);
      } finally {
        await queryRunner.release();
      }
    }

    console.log(`✅ Total migrated: ${count} (batch, with transaction)`);
  }
}
