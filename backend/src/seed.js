/**
 * Database seed script - Seeds initial data from the frontend's mockData.
 * Can be run standalone: node src/seed.js
 * Or imported as: import { seedDatabase } from './seed.js'
 */
import mongoose from 'mongoose';
import User from './models/User.js';
import ServiceProvider from './models/ServiceProvider.js';
import City from './models/City.js';
import Complaint from './models/Complaint.js';
import AuditLog from './models/AuditLog.js';
import logger from './config/logger.js';

const CITIES_DATA = [
  {
    name: 'Nashik', state: 'Maharashtra', tagline: 'Godavari Valley & Industrial Corridor',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    emergencyHotlines: { police: '0253-2305200', ambulance: '108', fire: '0253-2575555', traffic: '0253-2305233', disaster: '0253-2578500', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Pune', state: 'Maharashtra', tagline: 'Oxford of the East & Auto Hub',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    emergencyHotlines: { police: '020-26126296', ambulance: '108', fire: '020-26451707', traffic: '020-26208225', disaster: '020-25501269', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Mumbai', state: 'Maharashtra', tagline: 'Financial Capital & Coastal Metropolis',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    emergencyHotlines: { police: '022-22620111', ambulance: '108', fire: '022-23076111', traffic: '022-24937747', disaster: '022-22694727', womenHelp: '103' },
    isActive: true,
  },
  {
    name: 'Thane', state: 'Maharashtra', tagline: 'City of Lakes & Metro Suburb',
    coordinates: { lat: 19.2183, lng: 72.9781 },
    emergencyHotlines: { police: '022-25443535', ambulance: '108', fire: '022-25332333', traffic: '022-25344444', disaster: '022-25373737', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Nagpur', state: 'Maharashtra', tagline: 'Zero Mile & Central Logistics Hub',
    coordinates: { lat: 21.1458, lng: 79.0882 },
    emergencyHotlines: { police: '0712-2561222', ambulance: '108', fire: '0712-2567777', traffic: '0712-2566555', disaster: '0712-2562668', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', tagline: 'Heritage Hub & Marathwada Center',
    coordinates: { lat: 19.8762, lng: 75.3433 },
    emergencyHotlines: { police: '0240-2240500', ambulance: '108', fire: '0240-2334444', traffic: '0240-2240533', disaster: '0240-2331198', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Delhi NCR', state: 'Delhi', tagline: 'National Capital Region',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    emergencyHotlines: { police: '011-23015555', ambulance: '102', fire: '011-23412222', traffic: '011-25844444', disaster: '011-22421212', womenHelp: '1091' },
    isActive: true,
  },
  {
    name: 'Bengaluru', state: 'Karnataka', tagline: 'Silicon Valley & Tech Capital',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    emergencyHotlines: { police: '080-22942222', ambulance: '108', fire: '080-22971550', traffic: '080-22942888', disaster: '080-22975555', womenHelp: '1091' },
    isActive: true,
  },
];

const USERS_DATA = [
  {
    name: 'Rahul Sharma', email: 'user@helphub.org', password: 'password123', phone: '+91 98220 12345',
    role: 'user', city: 'Nashik',
    emergencyProfile: {
      bloodGroup: 'O+ Positive', iceContactName: 'Pooja Sharma (Spouse)', iceContactPhone: '+91 98220 54321',
      medicalNotes: 'No known drug allergies. Asthmatic (carries inhaler).',
      vehicleNumber: 'MH-15-DX-4412', vehicleModel: 'Hyundai Creta 2023 (Petrol)',
    },
    savedProviderIds: [], isActive: true,
  },
  {
    name: 'Ramesh Patil', email: 'business@helphub.org', password: 'password123', phone: '+91 98220 19283',
    role: 'business', city: 'Nashik', businessId: '', savedProviderIds: [], isActive: true,
  },
  {
    name: 'Dr. Vikram Adhikari', email: 'admin@helphub.org', password: 'password123', phone: '+91 98220 99999',
    role: 'admin', city: 'Nashik', savedProviderIds: [], isActive: true,
  },
  {
    name: 'Anjali Deshmukh', email: 'anjali.d@example.com', password: 'password123', phone: '+91 98231 77665',
    role: 'user', city: 'Pune', savedProviderIds: [], isActive: true,
  },
  {
    name: 'Sanjay Deshmukh', email: 'sanjay.towing@example.com', password: 'password123', phone: '+91 98501 12233',
    role: 'business', city: 'Nashik', businessId: '', savedProviderIds: [], isActive: true,
  },
];

const PROVIDERS_DATA = [
  {
    name: 'Nashik Highway 24x7 Express Garage', category: 'breakdown',
    subcategory: 'Full Mechanic & Roadside Assistance',
    phone: '0253-2591234', altPhone: '9822019283', email: 'contact@nashikexpressgarage.com',
    address: 'NH-60 Mumbai-Agra Highway, Near Dwarka Circle', city: 'Nashik', cityId: 'city-nashik',
    landmark: 'Dwarka Circle Flyover Pillar #14',
    coordinates: { lat: 19.9925, lng: 73.7925 }, distanceKm: 0.8, rating: 4.9, reviewCount: 240,
    isVerified: true, verificationStatus: 'verified', isOpen24x7: true,
    services: ['Engine Diagnostics', 'Tyre Puncture', 'Battery Jump Start', 'Towing Coordination', 'AC Repair', 'Brake Service'],
    lastVerifiedDate: '2026-08-20', isActive: true, isDemoData: true,
  },
  {
    name: 'Wockhardt Super Specialty Hospital', category: 'medical',
    subcategory: 'Multi-Specialty Emergency Hospital',
    phone: '0253-2664111', altPhone: '0253-2664222', email: 'emergency@wockhardt-nashik.com',
    address: 'Mumbai Naka, Near CBS', city: 'Nashik', cityId: 'city-nashik',
    landmark: 'Opposite Mumbai Naka Bus Stand',
    coordinates: { lat: 20.0010, lng: 73.7890 }, distanceKm: 1.2, rating: 4.8, reviewCount: 512,
    isVerified: true, verificationStatus: 'verified', isOpen24x7: true,
    capacityStatus: { erWaitTime: '~12 min', icuBeds: 'Available', bloodBank: 'A+, B+, O+, AB+', oxygen: 'Adequate' },
    services: ['24/7 Emergency', 'Trauma Center', 'ICU', 'Blood Bank', 'Ambulance Fleet', 'Cardiac Care'],
    lastVerifiedDate: '2026-08-20', isActive: true, isDemoData: true,
  },
  {
    name: 'MedPlus 24/7 Pharmacy', category: 'pharmacy',
    subcategory: 'Round-the-Clock Pharmacy & Medical Supplies',
    phone: '0253-2350789', email: 'nashik@medplus.in',
    address: 'College Road, Near Canada Corner', city: 'Nashik', cityId: 'city-nashik',
    landmark: 'Adjacent to SBI Canada Corner Branch',
    coordinates: { lat: 19.9980, lng: 73.7850 }, distanceKm: 0.5, rating: 4.6, reviewCount: 180,
    isVerified: true, verificationStatus: 'verified', isOpen24x7: true,
    services: ['Prescription Medicines', 'OTC Drugs', 'Oxygen Cylinders', 'First Aid Kits', 'Surgical Supplies'],
    lastVerifiedDate: '2026-08-18', isActive: true, isDemoData: true,
  },
  {
    name: 'Godavari Roadside Towing Service', category: 'towing',
    subcategory: 'Heavy & Light Vehicle Towing & Recovery',
    phone: '0253-2580999', altPhone: '9850112233', email: 'godavaritow@example.com',
    address: 'Trimbak Road, Near MIDC Satpur', city: 'Nashik', cityId: 'city-nashik',
    landmark: 'Near MIDC Satpur Gate',
    coordinates: { lat: 20.0050, lng: 73.7750 }, distanceKm: 2.1, rating: 4.5, reviewCount: 95,
    isVerified: true, verificationStatus: 'verified', isOpen24x7: true,
    services: ['Flatbed Towing', 'Accident Recovery', 'Highway Assistance', 'Crane Service', 'Motorcycle Towing'],
    lastVerifiedDate: '2026-08-19', isActive: true, isDemoData: true,
  },
];

const COMPLAINTS_DATA = [
  {
    userName: 'Kunal Jadhav', userPhone: '+91 98221 44556', city: 'Nashik',
    providerName: 'Dwarka Fast Towing (Unlisted)', category: 'towing',
    subject: 'Excessive charges demanded for 2 km highway tow',
    description: 'The driver requested Rs. 4,500 for a 2 km tow near Dwarka circle despite standard rates being Rs. 1,200.',
    status: 'investigating', priority: 'high',
    adminResponse: 'Assigned to Transport Vigilance Officer. Verification team dispatched.',
  },
  {
    userName: 'Priya Kulkarni', userPhone: '+91 98230 11223', city: 'Pune',
    providerName: 'Pune Express Auto Clinic', category: 'breakdown',
    subject: 'Mechanic arrived in 10 minutes - excellent service',
    description: 'Wanted to commend the fast dispatch on Mumbai-Pune expressway when our car battery died at midnight.',
    status: 'resolved', priority: 'low',
    adminResponse: 'Positive feedback recorded and 5-star rating verified in audit trail.',
  },
];

export async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ServiceProvider.deleteMany({});
    await City.deleteMany({});
    await Complaint.deleteMany({});
    await AuditLog.deleteMany({});
    logger.info('Cleared existing data');

    // Seed cities
    const cities = await City.insertMany(CITIES_DATA);
    logger.info(`Seeded ${cities.length} cities`);

    // Seed users (passwords will be hashed by pre-save hook)
    const users = [];
    for (const userData of USERS_DATA) {
      const user = await User.create(userData);
      users.push(user);
    }
    logger.info(`Seeded ${users.length} users`);

    // Link providers to business users
    const businessUser = users.find(u => u.email === 'business@helphub.org');
    const businessUser2 = users.find(u => u.email === 'sanjay.towing@example.com');

    PROVIDERS_DATA[0].ownerId = businessUser?._id.toString() || '';
    PROVIDERS_DATA[0].ownerName = businessUser?.name || '';
    PROVIDERS_DATA[3].ownerId = businessUser2?._id.toString() || '';
    PROVIDERS_DATA[3].ownerName = businessUser2?.name || '';

    const providers = await ServiceProvider.insertMany(PROVIDERS_DATA);
    logger.info(`Seeded ${providers.length} providers`);

    // Update business users with their provider IDs
    if (businessUser) {
      businessUser.businessId = providers[0]._id.toString();
      await businessUser.save();
    }
    if (businessUser2) {
      businessUser2.businessId = providers[3]._id.toString();
      await businessUser2.save();
    }

    // Update citizen saved providers
    const citizenUser = users.find(u => u.email === 'user@helphub.org');
    if (citizenUser) {
      citizenUser.savedProviderIds = [providers[0]._id.toString(), providers[1]._id.toString(), providers[2]._id.toString()];
      await citizenUser.save();
    }

    // Seed complaints
    const complaints = await Complaint.insertMany(COMPLAINTS_DATA);
    logger.info(`Seeded ${complaints.length} complaints`);

    // Seed audit log
    await AuditLog.create({
      user: 'System',
      action: 'DATABASE_SEED',
      target: 'All Collections',
      details: 'Initial seed data loaded successfully.',
    });

    logger.info('✅ Database seeded successfully!');
    logger.info('Demo Credentials: user@helphub.org / business@helphub.org / admin@helphub.org (password: password123)');
  } catch (error) {
    logger.error('Seed error:', error);
    throw error;
  }
}

// Run standalone if executed directly
const isMainModule = process.argv[1] && process.argv[1].includes('seed.js');
if (isMainModule) {
  import('./config/env.js').then(async ({ env }) => {
    const { connectDB, disconnectDB } = await import('./config/database.js');
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  }).catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
