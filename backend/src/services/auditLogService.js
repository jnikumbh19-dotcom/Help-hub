import AuditLog from '../models/AuditLog.js';

export const auditLogService = {
  async getAll(query = {}) {
    const filter = {};
    if (query.action) filter.action = query.action;

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200);
    return logs.map(l => l.toPublicJSON());
  },
};
