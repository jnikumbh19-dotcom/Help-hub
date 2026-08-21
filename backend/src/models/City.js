import mongoose from 'mongoose';

const emergencyHotlinesSchema = new mongoose.Schema({
  police: { type: String, required: true },
  ambulance: { type: String, required: true },
  fire: { type: String, required: true },
  traffic: { type: String, default: '' },
  disaster: { type: String, default: '' },
  womenHelp: { type: String, default: '' },
}, { _id: false });

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  state: { type: String, required: true },
  tagline: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  emergencyHotlines: { type: emergencyHotlinesSchema, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

citySchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt) delete obj.createdAt;
  if (obj.updatedAt) delete obj.updatedAt;
  return obj;
};

const City = mongoose.model('City', citySchema);
export default City;
