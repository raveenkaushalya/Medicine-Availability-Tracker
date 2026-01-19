# Backend

This directory contains the server-side logic for the Medicine Availability Tracker application.

## Structure

```
backend/
├── src/
│   ├── api/           # API route definitions and endpoint handlers
│   ├── services/      # Business logic layer
│   ├── models/        # Database models and schemas
│   ├── controllers/   # Request/response handling
│   ├── middleware/    # Custom middleware (auth, validation, etc.)
│   ├── utils/         # Utility functions and helpers
│   └── config/        # Configuration files
├── tests/             # Test files
└── README.md          # This file
```

## Folder Descriptions

### `/src/api`
Contains all API route definitions and endpoint handlers. Organize routes by resource or feature.

**Example:**
- `medicines.routes.js` - Medicine-related endpoints
- `pharmacies.routes.js` - Pharmacy-related endpoints
- `users.routes.js` - User authentication and management

### `/src/services`
Business logic layer that implements the core functionality. Services should be independent of the HTTP layer and reusable.

**Example:**
- `medicine.service.js` - Medicine search, availability checking
- `pharmacy.service.js` - Pharmacy management logic
- `notification.service.js` - Notification delivery logic

### `/src/models`
Database models and schemas. Define the structure of your data.

**Example:**
- `Medicine.model.js` - Medicine entity definition
- `Pharmacy.model.js` - Pharmacy entity definition
- `User.model.js` - User entity definition

### `/src/controllers`
Controllers handle HTTP requests and responses. They coordinate between routes, services, and models.

**Example:**
- `medicine.controller.js` - Handle medicine-related requests
- `pharmacy.controller.js` - Handle pharmacy-related requests

### `/src/middleware`
Custom middleware functions for request processing.

**Example:**
- `auth.middleware.js` - Authentication verification
- `validation.middleware.js` - Input validation
- `error-handler.middleware.js` - Centralized error handling

### `/src/utils`
Utility functions and helper modules used across the application.

**Example:**
- `logger.js` - Logging utility
- `response.js` - Standard response formatting
- `validators.js` - Common validation functions

### `/src/config`
Configuration files for different environments and services.

**Example:**
- `database.config.js` - Database connection configuration
- `server.config.js` - Server settings
- `constants.js` - Application constants

### `/tests`
Test files for unit, integration, and e2e testing. Mirror the src structure.

**Example:**
- `services/medicine.service.test.js`
- `api/medicines.routes.test.js`

## Getting Started

*Instructions will be added once the tech stack is finalized.*

## API Documentation

API documentation will be available at `/api/docs` when the server is running (using Swagger/OpenAPI).

## Environment Variables

Create a `.env` file in this directory with the following variables:

```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Code Style

Follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md) for code style and structure.
