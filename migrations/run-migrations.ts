import { createPool } from 'slonik';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigrations = async () => {
  const connectionString =
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/line_item_db';

  const pool = await createPool(connectionString);

  try {
    console.log('Running migrations...');

    const migrations = [
      { name: '001-create-users-table', module: await import('./001-create-users-table') },
      { name: '002-create-carts-table', module: await import('./002-create-carts-table') },
      {
        name: '003-create-line-items-table',
        module: await import('./003-create-line-items-table'),
      },
      { name: '004-seed-data', module: await import('./004-seed-data') },
    ];

    for (const migration of migrations) {
      console.log(`Running migration: ${migration.name}`);
      await migration.module.up(pool);
      console.log(`✓ Completed: ${migration.name}`);
    }

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
