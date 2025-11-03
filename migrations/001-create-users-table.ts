import { DatabasePool, sql } from 'slonik';

export const up = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
};

export const down = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS users`);
};
