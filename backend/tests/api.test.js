import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/database.js';
import { seedDatabase } from '../src/seed.js';

describe('Help Hub Backend API Test Suite', () => {
  let userToken = '';
  let businessToken = '';
  let adminToken = '';
  let testUserId = '';
  let testProviderId = '';
  let testComplaintId = '';
  let testCityId = '';

  before(async () => {
    await connectDB();
    await seedDatabase();

    // Login as Citizen User
    const userRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@helphub.org', password: 'password123' });
    assert.equal(userRes.status, 200);
    userToken = userRes.body.data.token;
    testUserId = userRes.body.data.user.id;

    // Login as Business User
    const bizRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'business@helphub.org', password: 'password123' });
    assert.equal(bizRes.status, 200);
    businessToken = bizRes.body.data.token;

    // Login as Admin
    const adminRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@helphub.org', password: 'password123' });
    assert.equal(adminRes.status, 200);
    adminToken = adminRes.body.data.token;
  });

  after(async () => {
    await disconnectDB();
  });

  // ================= 1. SYSTEM HEALTH =================
  describe('System & Health', () => {
    test('GET /health returns 200 and status OK', async () => {
      const res = await request(app).get('/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.status, 'OK');
    });

    test('GET non-existent route returns 404', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  // ================= 2. AUTHENTICATION =================
  describe('Authentication Module', () => {
    test('POST /api/v1/auth/register creates new citizen user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test Citizen',
          email: `citizen_${Date.now()}@example.com`,
          password: 'securePassword123',
          phone: '+91 9988776655',
          role: 'user',
          city: 'Pune',
          iceName: 'Spouse',
          icePhone: '+91 9988776600',
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token);
      assert.equal(res.body.data.user.role, 'user');
    });

    test('POST /api/v1/auth/register creates new business user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Garage Owner',
          email: `garage_${Date.now()}@example.com`,
          password: 'securePassword123',
          phone: '+91 9876543210',
          role: 'business',
          city: 'Nashik',
          businessName: 'Express Repair',
          businessCategory: 'breakdown',
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.data.user.role, 'business');
      assert.ok(res.body.data.user.businessId);
    });

    test('POST /api/v1/auth/register rejects public admin registration (BR rule)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Fake Admin',
          email: 'fake_admin@example.com',
          password: 'password123',
          phone: '+91 9000000000',
          role: 'admin',
        });
      // Validation error or forbidden
      assert.ok(res.status === 400 || res.status === 403);
      assert.equal(res.body.success, false);
    });

    test('POST /api/v1/auth/register fails with duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'user@helphub.org',
          password: 'password123',
          phone: '+91 9123456789',
          role: 'user',
        });
      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
    });

    test('POST /api/v1/auth/login fails with invalid password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@helphub.org', password: 'wrongPassword' });
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });

    test('GET /api/v1/auth/me returns current user data with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${userToken}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.email, 'user@helphub.org');
    });

    test('GET /api/v1/auth/me returns 401 without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      assert.equal(res.status, 401);
    });
  });

  // ================= 3. CITIES MODULE =================
  describe('Cities Module', () => {
    test('GET /api/v1/cities returns seeded cities (public)', async () => {
      const res = await request(app).get('/api/v1/cities');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 8);
      testCityId = res.body.data[0].id;
    });

    test('POST /api/v1/cities creates a new city zone (Admin only)', async () => {
      const res = await request(app)
        .post('/api/v1/cities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: `City_${Date.now()}`,
          state: 'Maharashtra',
          tagline: 'Smart Growth Corridor',
          coordinates: { lat: 19.5, lng: 74.2 },
          emergencyHotlines: {
            police: '100',
            ambulance: '108',
            fire: '101',
          },
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
    });

    test('POST /api/v1/cities rejected for non-admin user', async () => {
      const res = await request(app)
        .post('/api/v1/cities')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized City',
          state: 'State',
          coordinates: { lat: 10, lng: 20 },
          emergencyHotlines: { police: '100', ambulance: '108', fire: '101' },
        });
      assert.equal(res.status, 403);
    });

    test('PUT /api/v1/cities/:id/toggle toggles active state (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/cities/${testCityId}/toggle`)
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(res.status, 200);
      assert.equal(typeof res.body.data.isActive, 'boolean');
    });
  });

  // ================= 4. SERVICE PROVIDERS =================
  describe('Service Providers Module', () => {
    test('GET /api/v1/providers returns list with filtering', async () => {
      const res = await request(app)
        .get('/api/v1/providers')
        .query({ category: 'breakdown', city: 'Nashik' });
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 1);
      testProviderId = res.body.data[0].id;
    });

    test('GET /api/v1/providers/:id returns provider detail', async () => {
      const res = await request(app).get(`/api/v1/providers/${testProviderId}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.id, testProviderId);
    });

    test('POST /api/v1/providers creates new provider (Business user)', async () => {
      const res = await request(app)
        .post('/api/v1/providers')
        .set('Authorization', `Bearer ${businessToken}`)
        .send({
          name: 'Patil 24/7 Breakdown Assistance',
          category: 'breakdown',
          subcategory: 'Engine, Towing, Electricals',
          phone: '0253-2445566',
          address: 'Satpur MIDC, Trimbak Highway',
          city: 'Nashik',
          coordinates: { lat: 19.995, lng: 73.765 },
          isOpen24x7: true,
          services: ['Jumpstart', 'Puncture', 'Towing'],
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.data.isVerified, false);
      assert.equal(res.body.data.verificationStatus, 'pending');
    });

    test('PUT /api/v1/providers/:id/verify toggles verification (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/providers/${testProviderId}/verify`)
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    test('PUT /api/v1/providers/:id/approve approves provider (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/providers/${testProviderId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.isVerified, true);
      assert.equal(res.body.data.verificationStatus, 'verified');
    });

    test('PUT /api/v1/providers/:id/reject rejects provider with reason (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/providers/${testProviderId}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ reason: 'Trade license document unreadable' });
      assert.equal(res.status, 200);
      assert.equal(res.body.data.verificationStatus, 'rejected');
      assert.equal(res.body.data.rejectionReason, 'Trade license document unreadable');
    });
  });

  // ================= 5. COMPLAINTS & GRIEVANCES =================
  describe('Complaints Module', () => {
    test('POST /api/v1/complaints files a citizen complaint', async () => {
      const res = await request(app)
        .post('/api/v1/complaints')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          providerName: 'Overcharge Towing',
          category: 'towing',
          subject: 'Unauthorized rate demand on highway',
          description: 'Demanded 3x the standard rate for 5km tow assistance.',
          priority: 'high',
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.data.status, 'open');
      testComplaintId = res.body.data.id;
    });

    test('GET /api/v1/complaints returns complaints for user', async () => {
      const res = await request(app)
        .get('/api/v1/complaints')
        .set('Authorization', `Bearer ${userToken}`);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 1);
    });

    test('PUT /api/v1/complaints/:id/status updates status and response (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/complaints/${testComplaintId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'investigating',
          adminResponse: 'Assigned to Transport Vigilance Officer.',
        });
      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'investigating');
      assert.equal(res.body.data.adminResponse, 'Assigned to Transport Vigilance Officer.');
    });
  });

  // ================= 6. USER PROFILES =================
  describe('User Profile Module', () => {
    test('PUT /api/v1/users/:id/profile updates ICE profile', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${testUserId}/profile`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Rahul Sharma (Updated)',
          emergencyProfile: {
            bloodGroup: 'O+ Positive',
            iceContactName: 'Pooja Sharma',
            iceContactPhone: '+91 98220 54321',
            medicalNotes: 'Asthmatic, carries rescue inhaler',
            vehicleNumber: 'MH-15-DX-4412',
          },
        });
      assert.equal(res.status, 200);
      assert.equal(res.body.data.name, 'Rahul Sharma (Updated)');
      assert.equal(res.body.data.emergencyProfile.bloodGroup, 'O+ Positive');
    });

    test('PUT /api/v1/users/:id/role updates user role (Admin only)', async () => {
      const res = await request(app)
        .put(`/api/v1/users/${testUserId}/role`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'user' });
      assert.equal(res.status, 200);
      assert.equal(res.body.data.role, 'user');
    });

    test('GET /api/v1/users returns all users (Admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
    });
  });

  // ================= 7. AUDIT LOGS =================
  describe('Audit Logs Module', () => {
    test('GET /api/v1/audit-logs returns audit entries (Admin only)', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 1);
    });

    test('GET /api/v1/audit-logs blocked for regular users', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${userToken}`);
      assert.equal(res.status, 403);
    });
  });
});
