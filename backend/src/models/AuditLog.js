import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: String, default: () => new Date().toLocaleString() },
  user: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, required: true },
  details: { type: String, default: '' },
}, { timestamps: true });

auditLogSchema.index({ action: 1 });

auditLogSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  if (obj.updatedAt) delete obj.updatedAt;
  // Keep createdAt from mongoose but frontend uses timestamp field
  if (obj.createdAt) delete obj.createdAt;
  return obj;
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
