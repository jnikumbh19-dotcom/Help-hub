import { cityService } from '../services/cityService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const cityController = {
  async getAll(req, res) {
    try {
      const cities = await cityService.getAll();
      return successResponse(res, cities, 'Cities retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async create(req, res) {
    try {
      const city = await cityService.create(req.body, req.user);
      return successResponse(res, city, 'City created', 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async toggleActive(req, res) {
    try {
      const city = await cityService.toggleActive(req.params.id, req.user);
      return successResponse(res, city, 'City active status toggled');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
