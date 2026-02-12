# Getting Started Guide

Welcome to the Medicine Availability Tracker project! This guide will help you get started with development.

## Prerequisites

Before you begin, ensure you have the following installed:

### For Backend Development
- **Node.js** (v18 or higher) OR **Python** (v3.10 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher) - optional but recommended
- **Git**

### For Frontend Development
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**

### Development Tools
- **Code Editor**: VS Code, IntelliJ IDEA, or your preferred editor
- **API Testing Tool**: Postman, Insomnia, or curl
- **Database Client**: pgAdmin, DBeaver, or similar

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/raveenkaushalya/Medicine-Availability-Tracker.git
cd Medicine-Availability-Tracker
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies (example for Node.js)
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your configuration
# Configure database connection, JWT secret, etc.

# Run database migrations
npm run migrate

# Seed database with sample data (optional)
npm run seed

# Start development server
npm run dev
```

The backend server should now be running on `http://localhost:3000` (or your configured port).

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with backend API URL

# Start development server
npm run dev
```

The frontend application should now be running on `http://localhost:5173` (or your configured port).

### 4. Set Up Database

#### Using PostgreSQL

```bash
# Create database
createdb medicine_tracker

# Or using psql
psql -U postgres
CREATE DATABASE medicine_tracker;
\q
```

#### Using Docker (Alternative)

```bash
# Start all services with Docker Compose
docker-compose up -d

# This will start:
# - PostgreSQL database
# - Redis cache
# - Backend API
# - Frontend application
```

## Project Structure Overview

```
Medicine-Availability-Tracker/
├── backend/          # Backend API (Node.js/Python)
├── frontend/         # Frontend web application (React)
├── database/         # Database migrations and schemas
├── docs/             # Project documentation
└── .github/          # GitHub templates and workflows
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

Follow the code style guidelines in [docs/CODE_STYLE.md](docs/CODE_STYLE.md).

### 3. Test Your Changes

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat(medicine): add search by generic name"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Available Scripts

### Backend

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linter
npm run migrate      # Run database migrations
npm run seed         # Seed database
```

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run lint         # Run linter
npm run format       # Format code with Prettier
```

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medicine_tracker
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Redis Configuration (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
API_VERSION=v1
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1

# Feature Flags (optional)
VITE_ENABLE_MAPS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## Common Tasks

### Adding a New API Endpoint

1. Create route in `backend/src/api/`
2. Create controller in `backend/src/controllers/`
3. Create service in `backend/src/services/`
4. Add validation middleware if needed
5. Update API documentation

### Adding a New Frontend Component

1. Create component in `frontend/src/components/`
2. Add styles (CSS/SCSS)
3. Export from index file
4. Add tests
5. Update documentation

### Running Database Migrations

```bash
cd backend

# Create new migration
npm run migrate:create migration_name

# Run migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists
- Check firewall settings

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

- Verify CORS_ORIGIN in backend `.env`
- Check API URL in frontend `.env`
- Ensure both servers are running

## Useful Resources

### Documentation
- [Architecture Overview](docs/architecture/overview.md)
- [Code Style Guide](docs/CODE_STYLE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

### Learning Resources
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL management
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - State debugging

## Getting Help

If you encounter issues:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/raveenkaushalya/Medicine-Availability-Tracker/issues)
3. Ask in project discussions
4. Create a new issue with detailed information

## Next Steps

1. Read the [Architecture Overview](docs/architecture/overview.md)
2. Review the [Code Style Guide](docs/CODE_STYLE.md)
3. Check out [open issues](https://github.com/raveenkaushalya/Medicine-Availability-Tracker/issues)
4. Start contributing!

## Code of Conduct

Please read and follow our [Contributing Guidelines](CONTRIBUTING.md).

---

Happy coding! 🚀
