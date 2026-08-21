## Authentication

### POST /api/v1/auth/register
Auth: Public
Request: { name, email, password, phone, role('user'|'business'), city?, businessName?, businessCategory?, iceName?, icePhone? }
Response: { success, data: { token, user } }
Notes: Admin registration blocked.

### POST /api/v1/auth/login
Auth: Public
Request: { email, password }
Response: { success, data: { token, user } }

### GET /api/v1/auth/me
Auth: Bearer Token
Response: { success, data: User }

---

## Users

### GET /api/v1/users
Auth: Admin only
Response: { success, data: User[] }

### PUT /api/v1/users/:id/profile
Auth: Bearer Token (own profile only)
Request: { name?, phone?, city?, avatar?, emergencyProfile?, savedProviderIds? }
Response: { success, data: User }

### PUT /api/v1/users/:id/role
Auth: Admin only
Request: { role: 'user'|'business'|'admin' }
Response: { success, data: User }

---

## Service Providers

### GET /api/v1/providers
Auth: Public
Query: category?, city?, isVerified?, isActive?, search?
Response: { success, data: ServiceProvider[] }

### GET /api/v1/providers/:id
Auth: Public
Response: { success, data: ServiceProvider }

### POST /api/v1/providers
Auth: Business or Admin
Request: { name, category, subcategory?, phone, altPhone?, email?, address, city, cityId?, landmark?, coordinates: {lat, lng}, isOpen24x7?, operatingHours?, services?, licenseNumber?, imageUrl? }
Response: { success, data: ServiceProvider }

### PUT /api/v1/providers/:id
Auth: Owner or Admin
Request: (partial provider fields)
Response: { success, data: ServiceProvider }

### DELETE /api/v1/providers/:id
Auth: Admin only
Response: { success, data: { message } }

### PUT /api/v1/providers/:id/verify
Auth: Admin only
Response: { success, data: ServiceProvider } (toggles isVerified)

### PUT /api/v1/providers/:id/approve
Auth: Admin only
Response: { success, data: ServiceProvider }

### PUT /api/v1/providers/:id/reject
Auth: Admin only
Request: { reason }
Response: { success, data: ServiceProvider }

### PUT /api/v1/providers/:id/toggle-active
Auth: Owner or Admin
Response: { success, data: ServiceProvider }

---

## Complaints

### GET /api/v1/complaints
Auth: Bearer Token (users see own, admin sees all)
Query: status?, city?
Response: { success, data: Complaint[] }

### POST /api/v1/complaints
Auth: Bearer Token
Request: { providerName?, category, subject, description, priority? }
Response: { success, data: Complaint }

### PUT /api/v1/complaints/:id/status
Auth: Admin only
Request: { status: 'open'|'investigating'|'resolved'|'dismissed', adminResponse? }
Response: { success, data: Complaint }

---

## Cities

### GET /api/v1/cities
Auth: Public
Response: { success, data: City[] }

### POST /api/v1/cities
Auth: Admin only
Request: { name, state, tagline?, coordinates: {lat, lng}, emergencyHotlines: {police, ambulance, fire, traffic?, disaster?, womenHelp?} }
Response: { success, data: City }

### PUT /api/v1/cities/:id/toggle
Auth: Admin only
Response: { success, data: City }

---

## Audit Logs

### GET /api/v1/audit-logs
Auth: Admin only
Query: action?
Response: { success, data: AuditLog[] }
