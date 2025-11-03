import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sql } from 'slonik';
import { z } from 'zod';
import { getPool } from '../../db/connection';

interface LoginRequest {
  username: string;
  password: string;
}

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
});

export const loginPostRequest = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const pool = await getPool();

  try {
    const user = await pool.maybeOne(sql.type(userSchema)`
      SELECT id, username, password
      FROM users
      WHERE username = ${username}
    `);

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
