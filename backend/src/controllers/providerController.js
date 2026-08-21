import { providerService } from '../services/providerService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const providerController = {
  async getAll(req, res) {
    try {
      const providers = await providerService.getAll(req.query);
      return successResponse(res, providers, 'Providers retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async getById(req, res) {
    try {
      const provider = await providerService.getById(req.params.id);
      return successResponse(res, provider, 'Provider retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async create(req, res) {
    try {
      const provider = await providerService.create(req.body, req.user);
      return successResponse(res, provider, 'Provider created', 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async update(req, res) {
    try {
      const provider = await providerService.update(req.params.id, req.body, req.user);
      return successResponse(res, provider, 'Provider updated');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async delete(req, res) {
    try {
      const result = await providerService.delete(req.params.id, req.user);
      return successResponse(res, result, 'Provider deleted');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async verify(req, res) {
    try {
      const provider = await providerService.verify(req.params.id, req.user);
      return successResponse(res, provider, 'Verification status toggled');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async approve(req, res) {
    try {
      const provider = await providerService.approve(req.params.id, req.user);
      return successResponse(res, provider, 'Provider approved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async reject(req, res) {
    try {
      const { reason } = req.body;
      const provider = await providerService.reject(req.params.id, reason, req.user);
      return successResponse(res, provider, 'Provider rejected');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async toggleActive(req, res) {
    try {
      const provider = await providerService.toggleActive(req.params.id, req.user);
      return successResponse(res, provider, 'Active status toggled');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
