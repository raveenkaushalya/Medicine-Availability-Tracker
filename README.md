# Pharmora – AI-Powered Medicine Tracking & Pharmacy Management System

## Overview
**Pharmora** is a web-based AI-powered medicine tracking and pharmacy management platform designed to help users quickly find medicine availability across multiple pharmacies in Sri Lanka.  
The system provides real-time stock visibility, price transparency, and powerful management tools for pharmacy owners and administrators.

This project was developed as part of the **DEA (Development of Enterprise Applications) Module**.

---

## Key Features

### Public Users
- Real-time medicine search across pharmacies
- Medicine availability status (In Stock / Out of Stock)
- Price tracking with last updated timestamps
- Browse pharmacies with contact details and directions
- 24/7 emergency access support

### Pharmacy Owners
- Inventory management dashboard
- Add / Update / Delete medicines
- Stock level monitoring
- Profile & license management
- Customer inquiries chat system
- Theme & appearance settings

### Admin / Super Admin
- Centralized medicine database management
- Pharmacy verification & approval
- Analytics dashboard with charts
- Bulk operations
- Role-based access control
- System configuration panel

---

## Technology Stack

### Frontend
- React.js
- Modern CSS / Responsive UI
- Chart Libraries
- State Management

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate ORM
- RESTful APIs
- Relational Database

---

## System Architecture
The backend follows a **Layered Architecture**:

- **Controller Layer** – Handles HTTP requests/responses  
- **Service Layer** – Business logic & validations  
- **Repository Layer** – Database interactions  
- **DTO Layer** – Data transfer & validation  

---

## Security Features
- Role-Based Access Control (RBAC)
- Spring Security Integration
- Admin Security Key Protection
- Encrypted Credentials
- CORS Configuration
- Session Management

---

## Core Functionalities
- Pharmacy Registration & Verification
- Medicine CRUD Operations
- Real-Time Inventory Tracking
- Search & Filter System
- Error Handling & Standardized API Responses
- Configuration Management

---

## API Endpoints

### Public
| Endpoint | Method | Description |
|---------|--------|------------|
| /api/v1/auth/login | POST | User Authentication |
| /api/v1/pharmacies/register | POST | Register Pharmacy |
| /api/medicines/search | GET | Search Medicines |
| /api/medicines/list | GET | List Medicines |

### Admin (Protected)
| Endpoint | Method | Description |
|---------|--------|------------|
| /api/v1/admin/dashboard | GET | Analytics Dashboard |
| /api/v1/admin/medicines | CRUD | Manage Medicines |
| /api/v1/admin/pharmacies | GET/PUT | Verify Pharmacies |

---

## Future Enhancements
- Google Maps Integration
- Prescription Upload & OCR
- Patient User Accounts
- Price Comparison Engine
- Push Notifications
- Mobile Applications (iOS / Android)
- Multi-Language Support
- JWT Authentication
- Redis Caching
- WebSockets for Live Updates
- Microservices Architecture

---

## Project Goals
- Improve medicine accessibility
- Provide price transparency
- Enable pharmacy digital management
- Support emergency medicine search
- Deliver scalable healthcare solutions

---

## Conclusion
Pharmora bridges the gap between patients and pharmacies by offering a reliable, real-time, and user-friendly platform for medicine discovery and management. With secure architecture, modern technologies, and scalable design, the system is built to evolve and support the growing healthcare ecosystem in Sri Lanka.

---

## License
This project is developed for academic purposes under the DEA module.  
You may modify and extend it for learning and research.




