# Propertia API Testing Guide

This guide provides examples for testing all API endpoints using curl, Postman, or any HTTP client.



## Base URL
- **Development**: `http://localhost:4000`
- **Production**: `https://your-deployment-url.com`

## Authentication

Most endpoints require a JWT token. Get a token by logging in first:

```bash
# Login to get a token
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "userpassword"
  }'
```

Response will include a token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

Use this token in subsequent requests:
```bash
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 User Authentication Endpoints

### 1. User Registration
```bash
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 3. Admin Login
```bash
curl -X POST http://localhost:4000/api/users/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@buildestate.com",
    "password": "your_admin_password"
  }'
```

### 4. Forgot Password
```bash
curl -X POST http://localhost:4000/api/users/forgot \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### 5. Reset Password
```bash
curl -X POST http://localhost:4000/api/users/reset/RESET_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

### 6. Get Current User Info
```bash
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🏠 Property Endpoints

### 1. Get All Properties
```bash
curl -X GET http://localhost:4000/api/products
```

### 2. Create New Property (Admin)
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Luxury Apartment in Downtown",
    "location": "New York, NY",
    "price": 850000,
    "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "beds": 3,
    "baths": 2,
    "sqft": 1200,
    "type": "Apartment",
    "availability": "Available",
    "description": "Beautiful luxury apartment with city views",
    "amenities": ["Gym", "Pool", "Parking", "Security"],
    "phone": "+1234567890"
  }'
```

### 3. Update Property (Admin)
```bash
curl -X PUT http://localhost:4000/api/products/PROPERTY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Updated Property Title",
    "price": 900000
  }'
```

### 4. Delete Property (Admin)
```bash
curl -X DELETE http://localhost:4000/api/products/PROPERTY_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. AI-Powered Property Search
```bash
curl -X POST http://localhost:4000/api/properties/search \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Mumbai",
    "maxPrice": 2,
    "propertyCategory": "Residential",
    "propertyType": "Flat",
    "limit": 6
  }'
```

### 6. Get Location Trends
```bash
curl -X GET "http://localhost:4000/api/locations/Mumbai/trends?limit=5"
```

---

## 📅 Appointment Endpoints

### 1. Get User Appointments
```bash
curl -X GET http://localhost:4000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Create New Appointment
```bash
curl -X POST http://localhost:4000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "propertyId": "PROPERTY_ID_HERE",
    "date": "2024-12-25",
    "time": "14:00",
    "message": "I would like to schedule a viewing"
  }'
```

### 3. Update Appointment
```bash
curl -X PUT http://localhost:4000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2024-12-26",
    "time": "15:00",
    "status": "confirmed"
  }'
```

### 4. Cancel Appointment
```bash
curl -X DELETE http://localhost:4000/api/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Forms & Contact Endpoints

### 1. Submit Contact Form
```bash
curl -X POST http://localhost:4000/api/forms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I am interested in your services",
    "subject": "General Inquiry"
  }'
```

### 2. Get Form Submissions (Admin)
```bash
curl -X GET http://localhost:4000/api/forms \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📰 News & Blog Endpoints

### 1. Get All News Articles
```bash
curl -X GET http://localhost:4000/api/news
```

### 2. Create News Article (Admin)
```bash
curl -X POST http://localhost:4000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Real Estate Market Update",
    "content": "The real estate market shows positive trends...",
    "author": "Admin",
    "category": "Market News",
    "image": "https://example.com/news-image.jpg",
    "tags": ["market", "trends", "2024"]
  }'
```

### 3. Update News Article (Admin)
```bash
curl -X PUT http://localhost:4000/api/news/NEWS_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Updated News Title",
    "content": "Updated content here..."
  }'
```

### 4. Delete News Article (Admin)
```bash
curl -X DELETE http://localhost:4000/api/news/NEWS_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 📊 Admin Dashboard Endpoints

### 1. Get Dashboard Statistics
```bash
curl -X GET http://localhost:4000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Get All Users (Admin)
```bash
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Get All Properties (Admin)
```bash
curl -X GET http://localhost:4000/api/admin/properties \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🔍 Health Check Endpoints

### 1. Server Status
```bash
curl -X GET http://localhost:4000/status
```

### 2. Root Health Check
```bash
curl -X GET http://localhost:4000/
```

---

## 📤 File Upload Examples

### Upload Property Images
```bash
curl -X POST http://localhost:4000/api/products/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 🚨 Error Responses

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

---

## 🔄 Rate Limiting

The API is rate-limited to 500 requests per 15 minutes per IP address. When rate limit is exceeded:

```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## 📝 Postman Collection

You can import this collection into Postman for easier testing:

1. Create a new collection in Postman
2. Add the base URL as a variable: `{{base_url}}` = `http://localhost:4000`
3. Add an authentication token variable: `{{token}}` = `your_jwt_token`
4. Copy the curl commands above and convert them to Postman requests

---

## 🧪 Testing Tips

1. **Start with authentication**: Always test login first to get a valid token
2. **Use environment variables**: Set up base URL and tokens as variables
3. **Test error cases**: Try invalid data to test error handling
4. **Check rate limits**: Be aware of the 500 requests per 15 minutes limit
5. **Validate responses**: Check that responses match expected schema
6. **Test with different roles**: Test both user and admin endpoints

---

## 🔧 Advanced Testing

### Testing with different environments:
```bash
# Development
export BASE_URL=http://localhost:4000

# Staging
export BASE_URL=https://staging-api.buildestate.com

# Production
export BASE_URL=https://api.buildestate.com

# Use in requests
curl -X GET $BASE_URL/status
```

### Automated testing script:
```bash
#!/bin/bash
# Quick API health check

echo "Testing Propertia API..."

# Health check
echo "1. Health check:"
curl -s $BASE_URL/status | jq '.status'

# User registration
echo "2. User registration:"
curl -s -X POST $BASE_URL/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' \
  | jq '.success'

echo "API testing completed!"
```
