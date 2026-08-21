Use a consistent API error format for all responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": []
}
```

Centralized error handling middleware will catch and format all thrown errors.
Avoid exposing stack traces or internal implementation details in production.
Use standard HTTP status codes (400, 401, 403, 404, 500).
