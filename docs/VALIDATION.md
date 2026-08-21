Use `joi` or `zod` for input validation before hitting the controller.

* Required fields enforced for registration (name, email, password, phone, role).
* Email format validated.
* Roles restricted to enum: ['user', 'business', 'admin'].
* Provider categories restricted to EmergencyCategory enum.
* Coordinates must be valid numbers (lat: -90 to 90, lng: -180 to 180).
