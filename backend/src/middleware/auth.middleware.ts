import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface for decoded token
interface DecodedToken {
  id: number;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: UserRole;
    }
  }
}

// Verify JWT token middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    return next();
  };
};
