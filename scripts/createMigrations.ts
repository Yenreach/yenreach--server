import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Path to entities folder
const entitiesDir = path.join(__dirname, "../src/entities/entities");

// Read all entity files from the folder
const entityFiles = fs.readdirSync(entitiesDir)
  .filter(file => file.endsWith(".ts"))
  .map(file => path.parse(file).name)

if (entityFiles.length === 0) {
  console.log("❌ No entities found in src/entities.");
  process.exit(1);
}

// Function to create migrations
const createMigration = (entity: string) => {
  const command = `npx typeorm migration:create src/migrations/Create${entity}Table`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error creating migration for ${entity}:`, error);
      return;
    }
    console.log(`✅ Migration created: Create${entity}Table`);
  });
};

// Generate migration for each entity
entityFiles.forEach(createMigration);
