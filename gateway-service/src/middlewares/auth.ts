import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  guestId?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not set in environment variables');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.cookies?.token;
    if (token) {
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          // For optional auth, just continue without user if secret is missing
          next();
          return;
        }
        const decoded = jwt.verify(token, jwtSecret) as {
          userId: string;
          email: string;
          role: string;
        };
        req.user = decoded;
      } catch (error) {
        // Invalid token, continue as guest
      }
    }

    // If no user, use guest ID from header
    if (!req.user) {
      const guestId = req.headers['x-guest-id'] as string;
      if (guestId) {
        req.guestId = guestId;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
