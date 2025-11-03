import { DatabasePool, sql } from 'slonik';

export const up = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`
    CREATE TABLE carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMP NULL
    )
  `);
};

export const down = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS carts`);
};
