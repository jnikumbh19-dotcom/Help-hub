import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import AuditLog from '../models/AuditLog.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const authService = {
  async register({ name, email, password, phone, role, city, businessName, businessCategory, iceName, icePhone }) {
    // Prevent admin registration
    if (role === 'admin') {
      throw Object.assign(new Error('Public admin registration is disabled'), { statusCode: 403 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw Object.assign(new Error('User with this email already exists'), { statusCode: 409 });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: role === 'business' ? 'business' : 'user',
      city: city || 'Nashik',
      savedProviderIds: [],
      isActive: true,
    };

    // Set role-specific fields
    if (role === 'user') {
      userData.emergencyProfile = {
        iceContactName: iceName || '',
        iceContactPhone: icePhone || '',
      };
    }
    if (role === 'business') {
      userData.businessId = `prov-new-${Date.now()}`;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    return { token, user: user.toPublicJSON() };
  },

  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    if (!user.isActive) {
      throw Object.assign(new Error('Account is deactivated'), { statusCode: 403 });
    }

    const token = generateToken(user._id);
    return { token, user: user.toPublicJSON() };
  },

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user.toPublicJSON();
  },
};
