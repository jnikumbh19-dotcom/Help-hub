## Entities

**User**
- id, name, email, password, phone, role, city, avatar, businessId
- emergencyProfile (bloodGroup, iceContactName, iceContactPhone, medicalNotes, vehicleNumber, vehicleModel)
- savedProviderIds
- isActive

**ServiceProvider**
- id, name, category, subcategory, phone, altPhone, email, address, city, cityId, landmark, coordinates (lat, lng), distanceKm, rating, reviewCount
- isVerified, verificationStatus, rejectionReason, licenseNumber, ownerId, ownerName
- isOpen24x7, operatingHours, imageUrl, capacityStatus, services, lastVerifiedDate, isActive, isDemoData

**CityData**
- id, name, state, tagline, coordinates (lat, lng), emergencyHotlines (police, ambulance, fire, traffic, disaster, womenHelp), isActive

**ComplaintTicket**
- id, userId, userName, userPhone, city, providerName, category, subject, description, status, priority, adminResponse

**AuditLogEntry**
- id, timestamp, user, action, target, details

**Database Type:** MongoDB
