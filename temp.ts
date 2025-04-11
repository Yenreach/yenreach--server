// import { DataSource, DeepPartial } from 'typeorm';

// export class MigrationFactory {
//   constructor(private oldDataSource: DataSource, private newDataSource: DataSource) {}

//   //migrate one by one without transaction

//   async migrateEntityOneByOneWithoutTransaction<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//   ) {
//     try {
//       console.log('Starting migration without transaction');

//       // Get repositories
//       const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//       const newRepo = this.newDataSource.getRepository(newEntityClass);

//       // Fetch all entities from the old database
//       const oldEntities = await oldRepo.find();

//       let migratedCount = 0;

//       // Process and save each entity individually
//       for (const oldEntity of oldEntities) {
//         try {
//           // Transform the entity
//           const transformedEntity = await transformFunction(oldEntity);

//           // Create a new entity from the transformed data
//           const newEntity = newRepo.create(transformedEntity);

//           // Save the entity individually (without transaction)
//           await newRepo.save(newEntity);
//           migratedCount++;
//           console.log(`Migrated ${migratedCount} entities...`);
//         } catch (error) {
//           console.error('Error saving entity:', error);
//           // Handle individual entity errors as needed
//         }
//       }

//       console.log(`Migration completed: ${migratedCount} entities successfully`);
//       return migratedCount;
//     } catch (error) {
//       console.error('Migration failed:', error);
//       throw error;
//     } finally {
//       console.log('Migration ended');
//     }
//   }

//   // Migration method with full database transaction
//   async migrateEntity<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//   ) {
//     const queryRunner = this.newDataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       console.log('Transaction started');
//       // Get repositories
//       const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//       const newRepo = queryRunner.manager.getRepository(newEntityClass);

//       // Fetch all entities from old database
//       const oldEntities = await oldRepo.find();

//       // Transform entities
//       const newEntities = await Promise.all(
//         oldEntities.map(async oldEntity => {
//           return newRepo.create(await transformFunction(oldEntity));
//         }),
//       );

//       // Bulk save the created entities within the transaction
//       const savedEntities = await newRepo.save(newEntities);

//       // Commit the entire transaction
//       await queryRunner.commitTransaction();
//       console.log(`Migrated ${savedEntities.length} entities successfully`);
//       return savedEntities;
//     } catch (error) {
//       // Rollback the entire transaction if anything fails
//       await queryRunner.rollbackTransaction();
//       console.error('Entity migration failed:', error);
//       throw error;
//     } finally {
//       // Always release the query runner
//       await queryRunner.release();
//       console.log('Transaction ended');
//     }
//   }

//   // Migration method using batch processing without transaction for each batch
//   async migrateEntityInBatchesWithoutTransaction<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//     batchSize = 5, // Adjust based on performance
//   ) {
//     const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//     const newRepo = this.newDataSource.getRepository(newEntityClass);
//     let offset = 0;
//     let migratedCount = 0;

//     while (true) {
//       // Fetch a batch of old entities
//       const oldEntities = await oldRepo.find({
//         take: batchSize,
//         skip: offset,
//       });

//       if (oldEntities.length === 0) break; // No more records

//       // Transform entities
//       const newEntities = await Promise.all(
//         oldEntities.map(async oldEntity => {
//           return newRepo.create(await transformFunction(oldEntity));
//         }),
//       );

//       // Save the created entities directly (no transaction management)
//       await newRepo.save(newEntities);

//       migratedCount += newEntities.length;
//       offset += batchSize;
//       console.log(`Migrated ${migratedCount} records...`);
//     }

//     console.log(`Migration completed: ${migratedCount} records.`);
//   }

//   // Migration method: migrate one by one with transactions
//   async migrateEntityOneByOneWithTransaction<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//   ) {
//     try {
//       console.log('Starting migration one by one with transactions');

//       // Get repositories
//       const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//       const newRepo = this.newDataSource.getRepository(newEntityClass);

//       // Fetch all entities from the old database
//       const oldEntities = await oldRepo.find();

//       let migratedCount = 0;

//       // Process and save each entity individually with a transaction
//       for (const oldEntity of oldEntities) {
//         const queryRunner = this.newDataSource.createQueryRunner();
//         await queryRunner.connect();
//         await queryRunner.startTransaction();

//         try {
//           // Transform the entity
//           const transformedEntity = await transformFunction(oldEntity);

//           // Create a new entity from the transformed data
//           const newEntity = newRepo.create(transformedEntity);

//           // Save the entity individually within a transaction
//           await queryRunner.manager.save(newEntity);
//           await queryRunner.commitTransaction();
//           migratedCount++;
//           console.log(`Migrated ${migratedCount} entities...`);
//         } catch (error) {
//           // Rollback the transaction if anything fails
//           await queryRunner.rollbackTransaction();
//           console.error('Error saving entity:', error);
//         } finally {
//           await queryRunner.release();
//         }
//       }

//       console.log(`Migration completed: ${migratedCount} entities successfully`);
//       return migratedCount;
//     } catch (error) {
//       console.error('Migration failed:', error);
//       throw error;
//     }
//   }

//   // Migration method: migrate entities in batches with transactions
//   async migrateEntityInBatchesWithTransaction<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//     batchSize = 5, // Adjust based on performance
//   ) {
//     const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//     const newRepo = this.newDataSource.getRepository(newEntityClass);
//     let offset = 0;
//     let migratedCount = 0;

//     while (true) {
//       // Fetch a batch of old entities
//       const oldEntities = await oldRepo.find({
//         take: batchSize,
//         skip: offset,
//       });

//       if (oldEntities.length === 0) break; // No more records

//       const queryRunner = this.newDataSource.createQueryRunner();
//       await queryRunner.connect();
//       await queryRunner.startTransaction();

//       try {
//         // Transform entities
//         const newEntities = await Promise.all(
//           oldEntities.map(async oldEntity => {
//             return newRepo.create(await transformFunction(oldEntity));
//           }),
//         );

//         // Save the created entities within the transaction
//         await queryRunner.manager.save(newEntities);

//         // Commit the transaction after processing the batch
//         await queryRunner.commitTransaction();
//         migratedCount += newEntities.length;
//         offset += batchSize;
//         console.log(`Migrated ${migratedCount} records...`);
//       } catch (error) {
//         // Rollback the transaction if anything fails
//         await queryRunner.rollbackTransaction();
//         console.error('Error migrating batch:', error);
//       } finally {
//         await queryRunner.release();
//       }
//     }

//     console.log(`Migration completed: ${migratedCount} records.`);
//   }

//   // Migration method migrating all records at once without transactions or batching
//   async migrateEntityAllAtOnceWithoutTransaction<OldEntity, NewEntity>(
//     oldEntityClass: new () => OldEntity,
//     newEntityClass: new () => NewEntity,
//     transformFunction: (oldEntity: OldEntity) => DeepPartial<NewEntity> | Promise<DeepPartial<NewEntity>>,
//   ) {
//     const oldRepo = this.oldDataSource.getRepository(oldEntityClass);
//     const newRepo = this.newDataSource.getRepository(newEntityClass);

//     try {
//       console.log('Migrating all entities at once without transactions...');
//       // Fetch all entities from the old database
//       const oldEntities = await oldRepo.find();

//       // Transform entities
//       const newEntities = await Promise.all(
//         oldEntities.map(async oldEntity => {
//           return newRepo.create(await transformFunction(oldEntity));
//         }),
//       );

//       // Save the created entities directly (no transaction management)
//       await newRepo.save(newEntities);

//       console.log(`Migrated ${newEntities.length} entities successfully`);
//     } catch (error) {
//       console.error('Migration failed:', error);
//       throw error;
//     }
//   }
// }
