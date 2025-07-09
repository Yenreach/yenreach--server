import { spawn } from 'child_process';
import * as path from 'path';

const migrations: string[] = [
  // './src/data-migrations/scripts/migrate-state.ts',
  // './src/data-migrations/scripts/migrate-lgas.ts',
  './src/data-migrations/scripts/migrate-blogs.ts',
  // './src/data-migrations/scripts/migrate-sections.ts',
  // './src/data-migrations/scripts/migrate-categories.ts',
  // './src/data-migrations/scripts/migrate-users.ts',
  // './src/data-migrations/scripts/migrate-user-timer.ts',
  // './src/data-migrations/scripts/migrate-business.ts',
  // './src/data-migrations/scripts/migrate-business-photos.ts',
  // './src/data-migrations/scripts/migrate-business-videos.ts',
  // './src/data-migrations/scripts/migrate-business-categories.ts',
  // './src/data-migrations/scripts/migrate-business-working-hours.ts',
  // './src/data-migrations/scripts/migrate-saved-businesses.ts',
  // './src/data-migrations/scripts/migrate-products.ts',
  // './src/data-migrations/scripts/migrate-product-categories.ts',
  // './src/data-migrations/scripts/migrate-product-photos.ts',
  // './src/data-migrations/scripts/migrate-comments.ts',
  // './src/data-migrations/scripts/migrate-feedbacks.ts',
  // './src/data-migrations/scripts/migrate-jobs.ts',
  // './src/data-migrations/scripts/migrate-job-tags.ts',
  // './src/data-migrations/scripts/migrate-business-reviews.ts',
];

const runMigration = (scriptsPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(scriptsPath);

    console.log(`\n🚀 Running migration: ${fullPath}`);
    const proc = spawn('npx', ['ts-node', fullPath], {
      stdio: 'inherit',
      shell: true,
    });

    proc.on('exit', code => {
      if (code === 0) {
        console.log(`✅ Completed: ${scriptsPath}`);
        resolve();
      } else {
        console.error(`❌ Migration failed: ${scriptsPath} (exit code ${code})`);
        reject(new Error(`Migration failed: ${scriptsPath}`));
      }
    });
  });
};

const runAllMigrations = async () => {
  try {
    for (const migration of migrations) {
      await runMigration(migration);
    }
    console.log('\n🎉 All migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\n🔥 Migration process failed:', error);
    process.exit(1);
  }
};

runAllMigrations();
