import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  userId: { type: String, default: '' },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  city: { type: String, required: true },
  providerName: { type: String, default: '' },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'police', 'fire', 'breakdown', 'towing', 'fuel', 'pharmacy', 'locksmith', 'other'],
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved', 'dismissed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  adminResponse: { type: String, default: '' },
}, { timestamps: true });

complaintSchema.index({ userId: 1 });
complaintSchema.index({ status: 1 });

complaintSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  obj.createdAt = obj.createdAt ? obj.createdAt.toISOString() : '';
  delete obj._id;
  delete obj.__v;
  if (obj.updatedAt) delete obj.updatedAt;
  return obj;
};

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
