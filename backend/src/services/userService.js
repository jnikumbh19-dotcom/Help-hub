import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

export const userService = {
  async updateProfile(userId, requestingUserId, updateData) {
    // Users can only update their own profile
    if (userId !== requestingUserId) {
      throw Object.assign(new Error('Not authorized to update this profile'), { statusCode: 403 });
    }

    const user = await User.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    // Update allowed fields
    const allowedFields = ['name', 'phone', 'city', 'avatar', 'emergencyProfile', 'savedProviderIds'];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'emergencyProfile') {
          user.emergencyProfile = { ...user.emergencyProfile?.toObject?.() || {}, ...updateData[field] };
        } else {
          user[field] = updateData[field];
        }
      }
    }

    await user.save();
    return user.toPublicJSON();
  },

  async updateRole(userId, newRole, adminUser) {
    const user = await User.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    user.role = newRole;
    await user.save();

    // Audit log
    await AuditLog.create({
      user: adminUser.name || 'Platform Admin',
      action: 'UPDATE_USER_ROLE',
      target: userId,
      details: `Role reassigned to ${newRole.toUpperCase()}.`,
    });

    return user.toPublicJSON();
  },

  async getAllUsers() {
    const users = await User.find().sort({ createdAt: -1 });
    return users.map(u => u.toPublicJSON());
  },
};
