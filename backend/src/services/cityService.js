import City from '../models/City.js';
import AuditLog from '../models/AuditLog.js';

export const cityService = {
  async getAll() {
    const cities = await City.find().sort({ name: 1 });
    return cities.map(c => c.toPublicJSON());
  },

  async create(data, requestingUser) {
    const existingCity = await City.findOne({ name: data.name });
    if (existingCity) {
      throw Object.assign(new Error('City with this name already exists'), { statusCode: 409 });
    }

    const city = await City.create(data);

    await AuditLog.create({
      user: requestingUser.name,
      action: 'ADD_CITY_ZONE',
      target: city.name,
      details: `Configured municipal hotlines: Police ${data.emergencyHotlines.police}, Ambulance ${data.emergencyHotlines.ambulance}`,
    });

    return city.toPublicJSON();
  },

  async toggleActive(id, requestingUser) {
    const city = await City.findById(id);
    if (!city) {
      throw Object.assign(new Error('City not found'), { statusCode: 404 });
    }

    city.isActive = !city.isActive;
    await city.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'TOGGLE_CITY_ACTIVE',
      target: city.name,
      details: `City active state set to ${city.isActive}.`,
    });

    return city.toPublicJSON();
  },
};
