export type EmergencyCategory =
  | 'medical'
  | 'police'
  | 'fire'
  | 'breakdown'
  | 'towing'
  | 'fuel'
  | 'pharmacy'
  | 'locksmith'
  | 'other';

export type UserRole = 'user' | 'business' | 'admin';

export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatar?: string;
  businessId?: string;
  emergencyProfile?: {
    bloodGroup?: string;
    iceContactName?: string;
    iceContactPhone?: string;
    medicalNotes?: string;
    vehicleNumber?: string;
    vehicleModel?: string;
  };
  savedProviderIds: string[];
  createdAt: string;
  isActive: boolean;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  tagline: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  emergencyHotlines: {
    police: string;
    ambulance: string;
    fire: string;
    traffic: string;
    disaster: string;
    womenHelp?: string;
  };
  isActive: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: EmergencyCategory;
  subcategory?: string;
  phone: string;
  altPhone?: string;
  email?: string;
  address: string;
  city: string;
  cityId?: string;
  landmark?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  licenseNumber?: string;
  ownerId?: string;
  ownerName?: string;
  isOpen24x7: boolean;
  operatingHours?: string;
  imageUrl?: string;
  capacityStatus?: {
    erWaitTime?: string;
    icuBeds?: 'Available' | 'Full' | 'Limited' | 'N/A';
    bloodBank?: string;
    oxygen?: 'Adequate' | 'Critical' | 'Available' | 'N/A';
  };
  services: string[];
  lastVerifiedDate: string;
  isActive: boolean;
  isDemoData?: boolean;
}

export interface OfficialEmergencyContact {
  id: string;
  name: string;
  number: string;
  category: 'primary' | 'specialized';
  city?: string;
  description: string;
  icon: string;
  badgeColor?: string;
  bgColor?: string;
}

export interface LocationState {
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  isGPS: boolean;
  accuracyMeters?: number;
  statusText: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
}

export interface ComplaintTicket {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  city: string;
  providerName?: string;
  category: EmergencyCategory;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  adminResponse?: string;
}

export interface CategoryConfig {
  id: EmergencyCategory;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  icon: string;
  badge: string;
  isActive: boolean;
  priorityOrder: number;
}

export type ActiveScreen =
  | 'home'
  | 'category'
  | 'provider-detail'
  | 'official-numbers'
  | 'police-security'
  | 'offline-mode'
  | 'user-dashboard'
  | 'business-panel'
  | 'admin-portal'
  | 'auth';

export interface SafetyGuide {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  steps: string[];
  warning?: string;
}

export interface EmergencyPhrase {
  id: string;
  category: string;
  english: string;
  hindi: string;
  marathi: string;
}
