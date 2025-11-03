import { Request, Response } from 'express';
import { sql } from 'slonik';
import { z } from 'zod';
import { getPool } from '../../db/connection';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cartSchema = z.object({
  id: z.number(),
  total: z.number(),
});

export const getCartRequest = async (req: Request, res: Response): Promise<void> => {
  {
    const userId = req.userId!;
    const pool = await getPool();

    try {
      /**
       * It will fail becasue query for schema is invalid
       */

      // const cart = await pool.maybeOne(sql.type(cartSchema)`
      //   SELECT * FROM carts WHERE user_id = ${userId}
      // `);

      const cart = await pool.any(sql.unsafe`
        SELECT
          *
        FROM carts WHERE user_id = ${userId}
      `);

      if (!cart) {
        res.status(404).json({ error: 'No active cart found' });
        return;
      }

      res.json({
        id: 1,
        total: 1,
      });
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
