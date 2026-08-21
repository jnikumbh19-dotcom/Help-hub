import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

/**
 * Protect routes - require valid JWT
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Not authorized - No token provided', 401, [], 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return errorResponse(res, 'Not authorized - User not found or inactive', 401, [], 'UNAUTHORIZED');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized - Invalid token', 401, [], 'UNAUTHORIZED');
  }
};

/**
 * Authorize by role(s)
 * Usage: authorize('admin') or authorize('admin', 'business')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authorized', 401, [], 'UNAUTHORIZED');
    }
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden - Insufficient permissions', 403, [], 'FORBIDDEN');
    }
    next();
  };
};
