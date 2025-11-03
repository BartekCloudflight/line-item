import { DatabasePool, sql } from 'slonik';

export const up = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`
    CREATE TABLE line_items (
      id VARCHAR(255) PRIMARY KEY,
      cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      price INTEGER NOT NULL,
      is_free BOOLEAN NOT NULL
    )
  `);
};

export const down = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`DROP TABLE IF EXISTS line_items`);
};
