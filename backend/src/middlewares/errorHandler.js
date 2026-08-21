import { env } from '../config/env.js';
import logger from '../config/logger.js';
import { errorResponse } from '../utils/response.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  if (env.NODE_ENV !== 'production' && err.stack) {
    logger.error(err.stack);
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return errorResponse(res, 'Validation Error', 400, errors, 'VALIDATION_ERROR');
  }

  // Handle JWT Errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Unauthorized - Invalid Token', 401, [], 'UNAUTHORIZED');
  }

  return errorResponse(
    res, 
    err.message || 'Internal Server Error', 
    statusCode, 
    env.NODE_ENV === 'development' ? [err.stack] : [],
    'SERVER_ERROR'
  );
};
