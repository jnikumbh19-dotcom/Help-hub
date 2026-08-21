import { z } from 'zod';
import { errorResponse } from '../utils/response.js';

/**
 * Generic validation middleware factory.
 * Usage: validate(schema) or validate(schema, 'query')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return errorResponse(res, 'Validation failed', 400, errors, 'VALIDATION_ERROR');
    }
    req[source] = result.data;
    next();
  };
};

// ---- Auth Schemas ----
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(5, 'Phone is required'),
  role: z.enum(['user', 'business']).default('user'),
  city: z.string().optional().default('Nashik'),
  businessName: z.string().optional(),
  businessCategory: z.string().optional(),
  iceName: z.string().optional(),
  icePhone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or identifier is required'),
  password: z.string().min(1, 'Password is required'),
});

// ---- Provider Schemas ----
export const createProviderSchema = z.object({
  name: z.string().min(1, 'Provider name is required'),
  category: z.enum(['medical', 'police', 'fire', 'breakdown', 'towing', 'fuel', 'pharmacy', 'locksmith', 'other']),
  subcategory: z.string().optional().default(''),
  phone: z.string().min(5, 'Phone is required'),
  altPhone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  cityId: z.string().optional().default(''),
  landmark: z.string().optional().default(''),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  isOpen24x7: z.boolean().optional().default(false),
  operatingHours: z.string().optional().default(''),
  services: z.array(z.string()).optional().default([]),
  licenseNumber: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
});

export const updateProviderSchema = createProviderSchema.partial();

// ---- Complaint Schemas ----
export const createComplaintSchema = z.object({
  providerName: z.string().optional().default(''),
  category: z.enum(['medical', 'police', 'fire', 'breakdown', 'towing', 'fuel', 'pharmacy', 'locksmith', 'other']),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum(['open', 'investigating', 'resolved', 'dismissed']),
  adminResponse: z.string().optional().default(''),
});

// ---- City Schemas ----
export const createCitySchema = z.object({
  name: z.string().min(1, 'City name is required'),
  state: z.string().min(1, 'State is required'),
  tagline: z.string().optional().default(''),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  emergencyHotlines: z.object({
    police: z.string().min(1),
    ambulance: z.string().min(1),
    fire: z.string().min(1),
    traffic: z.string().optional().default(''),
    disaster: z.string().optional().default(''),
    womenHelp: z.string().optional().default(''),
  }),
});

// ---- User Profile Schema ----
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  avatar: z.string().optional(),
  emergencyProfile: z.object({
    bloodGroup: z.string().optional(),
    iceContactName: z.string().optional(),
    iceContactPhone: z.string().optional(),
    medicalNotes: z.string().optional(),
    vehicleNumber: z.string().optional(),
    vehicleModel: z.string().optional(),
  }).optional(),
  savedProviderIds: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['user', 'business', 'admin']),
});
