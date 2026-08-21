import { complaintService } from '../services/complaintService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const complaintController = {
  async getAll(req, res) {
    try {
      const complaints = await complaintService.getAll(req.query, req.user);
      return successResponse(res, complaints, 'Complaints retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async create(req, res) {
    try {
      const complaint = await complaintService.create(req.body, req.user);
      return successResponse(res, complaint, 'Complaint filed', 201);
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },

  async updateStatus(req, res) {
    try {
      const complaint = await complaintService.updateStatus(req.params.id, req.body, req.user);
      return successResponse(res, complaint, 'Complaint status updated');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
