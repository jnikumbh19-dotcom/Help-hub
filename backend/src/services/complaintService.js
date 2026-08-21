import Complaint from '../models/Complaint.js';
import AuditLog from '../models/AuditLog.js';

export const complaintService = {
  async getAll(query = {}, requestingUser) {
    const filter = {};
    // Non-admin users can only see their own complaints
    if (requestingUser.role !== 'admin') {
      filter.userId = requestingUser._id.toString();
    }
    if (query.status) filter.status = query.status;
    if (query.city) filter.city = query.city;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    return complaints.map(c => c.toPublicJSON());
  },

  async create(data, requestingUser) {
    const complaint = await Complaint.create({
      ...data,
      userId: requestingUser._id.toString(),
      userName: requestingUser.name,
      userPhone: requestingUser.phone,
      city: requestingUser.city || 'Unknown',
    });

    await AuditLog.create({
      user: requestingUser.name,
      action: 'FILE_COMPLAINT',
      target: data.providerName || data.subject,
      details: `Ticket #${complaint._id}: ${data.subject}`,
    });

    return complaint.toPublicJSON();
  },

  async updateStatus(id, statusData, requestingUser) {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      throw Object.assign(new Error('Complaint not found'), { statusCode: 404 });
    }

    complaint.status = statusData.status;
    if (statusData.adminResponse) {
      complaint.adminResponse = statusData.adminResponse;
    }
    await complaint.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'RESOLVE_COMPLAINT',
      target: id,
      details: `Status set to ${statusData.status}. Response: ${statusData.adminResponse || 'None'}`,
    });

    return complaint.toPublicJSON();
  },
};
