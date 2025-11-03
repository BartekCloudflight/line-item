import { createPool } from 'slonik';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/line_item_db';

const poolPromise = createPool(connectionString);

export const getPool = async () => {
  return await poolPromise;
};

export const closePool = async (): Promise<void> => {
  const pool = await poolPromise;
  await pool.end();
};
