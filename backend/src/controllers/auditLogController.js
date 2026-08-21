import { auditLogService } from '../services/auditLogService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const auditLogController = {
  async getAll(req, res) {
    try {
      const logs = await auditLogService.getAll(req.query);
      return successResponse(res, logs, 'Audit logs retrieved');
    } catch (error) {
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  },
};
