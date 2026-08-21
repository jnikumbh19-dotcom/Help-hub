import { userService } from '../services/userService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const userController = {
  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.params.id, req.user._id.toString(), req.body);
      return successResponse(res, user, 'Profile updated');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async updateRole(req, res) {
    try {
      const user = await userService.updateRole(req.params.id, req.body.role, req.user);
      return successResponse(res, user, 'Role updated');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return successResponse(res, users, 'Users retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
