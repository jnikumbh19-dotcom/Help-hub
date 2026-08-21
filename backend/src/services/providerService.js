import ServiceProvider from '../models/ServiceProvider.js';
import AuditLog from '../models/AuditLog.js';

export const providerService = {
  async getAll(query = {}) {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.city) filter.city = query.city;
    if (query.isVerified !== undefined) filter.isVerified = query.isVerified === 'true';
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { address: { $regex: query.search, $options: 'i' } },
        { services: { $regex: query.search, $options: 'i' } },
      ];
    }

    const providers = await ServiceProvider.find(filter).sort({ rating: -1, createdAt: -1 });
    return providers.map(p => p.toPublicJSON());
  },

  async getById(id) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }
    return provider.toPublicJSON();
  },

  async create(data, requestingUser) {
    const providerData = {
      ...data,
      ownerId: requestingUser._id.toString(),
      ownerName: requestingUser.name,
      verificationStatus: 'pending',
      isVerified: false,
    };

    const provider = await ServiceProvider.create(providerData);

    // If business user, update their businessId
    if (requestingUser.role === 'business' && !requestingUser.businessId) {
      requestingUser.businessId = provider._id.toString();
      await requestingUser.save();
    }

    await AuditLog.create({
      user: requestingUser.name,
      action: 'CREATE_PROVIDER',
      target: `${provider.name} (${provider._id})`,
      details: `Added new provider in ${provider.category} category for ${provider.city}.`,
    });

    return provider.toPublicJSON();
  },

  async update(id, data, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    // Authorization: only owner or admin can update
    if (requestingUser.role !== 'admin' && provider.ownerId !== requestingUser._id.toString()) {
      throw Object.assign(new Error('Not authorized to update this provider'), { statusCode: 403 });
    }

    Object.assign(provider, data);
    await provider.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'UPDATE_PROVIDER_PROFILE',
      target: provider.name,
      details: 'Operating hours, capacity or services updated.',
    });

    return provider.toPublicJSON();
  },

  async delete(id, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    const provName = provider.name;
    await provider.deleteOne();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'DELETE_PROVIDER',
      target: provName,
      details: 'Listing removed from the emergency registry.',
    });

    return { message: 'Provider deleted' };
  },

  async verify(id, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    const updated = !provider.isVerified;
    provider.isVerified = updated;
    provider.verificationStatus = updated ? 'verified' : 'unverified';
    provider.lastVerifiedDate = new Date().toISOString();
    await provider.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: updated ? 'VERIFY_PROVIDER' : 'UNVERIFY_PROVIDER',
      target: `${provider.name} (${provider._id})`,
      details: `Provider status set to ${updated ? 'Verified' : 'Unverified'}.`,
    });

    return provider.toPublicJSON();
  },

  async approve(id, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    provider.isVerified = true;
    provider.verificationStatus = 'verified';
    provider.isActive = true;
    provider.lastVerifiedDate = new Date().toISOString();
    await provider.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'APPROVE_REGISTRATION',
      target: provider.name,
      details: 'Trade license verified and dispatched onto live network.',
    });

    return provider.toPublicJSON();
  },

  async reject(id, reason, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    provider.isVerified = false;
    provider.verificationStatus = 'rejected';
    provider.rejectionReason = reason || '';
    await provider.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: 'REJECT_REGISTRATION',
      target: provider._id.toString(),
      details: `Rejection notice: ${reason}`,
    });

    return provider.toPublicJSON();
  },

  async toggleActive(id, requestingUser) {
    const provider = await ServiceProvider.findById(id);
    if (!provider) {
      throw Object.assign(new Error('Provider not found'), { statusCode: 404 });
    }

    // Authorization: only owner or admin
    if (requestingUser.role !== 'admin' && provider.ownerId !== requestingUser._id.toString()) {
      throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
    }

    const updated = !provider.isActive;
    provider.isActive = updated;
    await provider.save();

    await AuditLog.create({
      user: requestingUser.name,
      action: updated ? 'ACTIVATE_SERVICE' : 'DEACTIVATE_SERVICE',
      target: `${provider.name} (${provider._id})`,
      details: `Dispatch availability updated to ${updated ? 'Active 24/7' : 'Offline'}.`,
    });

    return provider.toPublicJSON();
  },
};
