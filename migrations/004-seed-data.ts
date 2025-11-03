import { DatabasePool, sql } from 'slonik';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const idSchema = z.number();

export const up = async (pool: DatabasePool): Promise<void> => {
  // Create 2 users
  const user1Id = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO users (username, password, created_at, updated_at)
    VALUES ('user1', 'password1', NOW(), NOW())
    RETURNING id
  `)) as unknown as number;

  const user2Id = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO users (username, password, created_at, updated_at)
    VALUES ('user2', 'password2', NOW(), NOW())
    RETURNING id
  `)) as unknown as number;

  // Create carts for user1
  const user1ActiveCartId = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO carts (user_id, created_at, updated_at, completed_at)
    VALUES (${user1Id}, NOW(), NOW(), NULL)
    RETURNING id
  `)) as unknown as number;

  const user1CompletedCartId = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO carts (user_id, created_at, updated_at, completed_at)
    VALUES (${user1Id}, NOW(), NOW(), NOW() - INTERVAL '7 days')
    RETURNING id
  `)) as unknown as number;

  // Create carts for user2
  const user2ActiveCartId = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO carts (user_id, created_at, updated_at, completed_at)
    VALUES (${user2Id}, NOW(), NOW(), NULL)
    RETURNING id
  `)) as unknown as number;

  const user2CompletedCartId = (await pool.oneFirst(sql.type(idSchema)`
    INSERT INTO carts (user_id, created_at, updated_at, completed_at)
    VALUES (${user2Id}, NOW(), NOW(), NOW() - INTERVAL '5 days')
    RETURNING id
  `)) as unknown as number;

  // Helper function to create line items
  const createLineItems = async (cartId: number, multiplier: number) => {
    // 2 non-free items
    await pool.query(sql.unsafe`
      INSERT INTO line_items (id, cart_id, name, price, is_free)
      VALUES
        (${faker.string.uuid()}, ${cartId}, ${faker.commerce.productName()}, ${100 * multiplier}, false),
        (${faker.string.uuid()}, ${cartId}, ${faker.commerce.productName()}, ${200 * multiplier}, false)
    `);

    // 1 free item
    await pool.query(sql.unsafe`
      INSERT INTO line_items (id, cart_id, name, price, is_free)
      VALUES (${faker.string.uuid()}, ${cartId}, ${faker.commerce.productName()}, ${50}, true)
    `);
  };

  // Create line items for all carts
  await createLineItems(user1ActiveCartId, 1);
  await createLineItems(user1CompletedCartId, 1);
  await createLineItems(user2ActiveCartId, 10);
  await createLineItems(user2CompletedCartId, 10);
};

export const down = async (pool: DatabasePool): Promise<void> => {
  await pool.query(sql.unsafe`DELETE FROM line_items`);
  await pool.query(sql.unsafe`DELETE FROM carts`);
  await pool.query(sql.unsafe`DELETE FROM users`);
};
