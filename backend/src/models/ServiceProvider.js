import mongoose from 'mongoose';

const capacityStatusSchema = new mongoose.Schema({
  erWaitTime: { type: String, default: '' },
  icuBeds: { type: String, enum: ['Available', 'Full', 'Limited', 'N/A', ''], default: 'N/A' },
  bloodBank: { type: String, default: '' },
  oxygen: { type: String, enum: ['Adequate', 'Critical', 'Available', 'N/A', ''], default: 'N/A' },
}, { _id: false });

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['medical', 'police', 'fire', 'breakdown', 'towing', 'fuel', 'pharmacy', 'locksmith', 'other'],
  },
  subcategory: { type: String, default: '' },
  phone: { type: String, required: true },
  altPhone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, required: true },
  city: { type: String, required: true },
  cityId: { type: String, default: '' },
  landmark: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  distanceKm: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified', 'pending', 'rejected'],
    default: 'pending',
  },
  rejectionReason: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  ownerId: { type: String, default: '' },
  ownerName: { type: String, default: '' },
  isOpen24x7: { type: Boolean, default: false },
  operatingHours: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  capacityStatus: { type: capacityStatusSchema, default: () => ({}) },
  services: [{ type: String }],
  lastVerifiedDate: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isDemoData: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for common queries
serviceProviderSchema.index({ category: 1, city: 1 });
serviceProviderSchema.index({ ownerId: 1 });
serviceProviderSchema.index({ isActive: 1, isVerified: 1 });

serviceProviderSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt) delete obj.createdAt;
  if (obj.updatedAt) delete obj.updatedAt;
  return obj;
};

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;
