import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['x-api-token'] as string;

  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};
