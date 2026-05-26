import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';

interface TokenPayload {
  userId: string;
  email: string;
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Please log in to access this resource.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token is missing.');
    }

    // 2. Verify token
    const secret = process.env.JWT_SECRET || 'tree_monitoring_secret_key_2026_super_secure';
    
    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      
      // 3. Attach user info to request
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
      
      return next();
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired authentication token.');
    }
  } catch (error) {
    return next(error);
  }
};
