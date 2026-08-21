import { authService } from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const authController = {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, result, 'Registration successful', 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async getMe(req, res) {
    try {
      const user = await authService.getMe(req.user._id);
      return successResponse(res, user, 'User retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
