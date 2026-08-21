import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const emergencyProfileSchema = new mongoose.Schema({
  bloodGroup: { type: String, default: '' },
  iceContactName: { type: String, default: '' },
  iceContactPhone: { type: String, default: '' },
  medicalNotes: { type: String, default: '' },
  vehicleNumber: { type: String, default: '' },
  vehicleModel: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone: { type: String, required: true, trim: true },
  role: { type: String, enum: ['user', 'business', 'admin'], default: 'user' },
  city: { type: String, default: 'Nashik' },
  avatar: { type: String, default: '' },
  businessId: { type: String, default: '' },
  emergencyProfile: { type: emergencyProfileSchema, default: () => ({}) },
  savedProviderIds: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform to JSON (never expose password)
userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  // Map createdAt to a string for frontend compat
  if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt) delete obj.updatedAt;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
