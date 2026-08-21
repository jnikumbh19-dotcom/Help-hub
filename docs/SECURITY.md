* Authentication: JWT
* Authorization: Middleware checking role ('user', 'business', 'admin').
* Password hashing: bcrypt (Cost factor 10)
* Sensitive data handling: Passwords never returned in API responses.
* Environment secrets: Stored in .env, never hardcoded.
* Injection prevention: Mongoose avoids SQL injection by default, input validation prevents NoSQL injection.
* Error info leakage: Stack traces only in development mode.
* CORS: Configured for frontend origin only.
