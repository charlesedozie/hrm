# ImpactCore HRM System

## Overview

ImpactCore HRM is a cloud-ready Human Resource Management System designed to support workforce management, reporting, and organizational decision-making.

The system was developed as a scalable backend-driven application, supporting structured data workflows, analytics, and API-driven integrations.

---

## Key Features

Employee lifecycle management (onboarding, records, updates)
Payroll and reporting system
Attendance and leave tracking
Role-based access control
Data reporting and analytics dashboard
RESTful API services for system integration


---

## Technical Architecture

Backend: Node.js
Database: PostgreSQL
API: RESTful architecture with OpenAPI (Swagger) documentation
Deployment: Node.js application on supported infrastructure
Security: Authentication, role-based authorization
API Documentation (Swagger)
Swagger UI enables interactive testing and validation of all endpoints.

---

## DevOps & Deployment

Hosted on server with secure configuration
Environment-based configuration using .env
Manual CI/CD workflow (transitioning to GitHub Actions)
Linux / Windows server deployment with Node.js support

---

##  Deployment & Setup Instructions

1. Clone the Repository
git clone https://github.com/charlesedozie/hrm.git
cd hrm
2. Install Dependencies
npm install
3. Environment Configuration

Create a .env file:

DB_URL=postgresql://username:password@localhost:5432/database_name?schema=public
JWT_SECRET=your_jwt_secret_key
PORT=3005

⚠️ Ensure your PostgreSQL database is created before running seed scripts.

5. npx prisma validate
6. npx prisma generate     # generate the client
7. npx prisma migrate dev --name init 

8. npm run seed
9. Run Application (Development)
npm run start:dev
10. Run Application (Production)
npm run build
npm run start
11. Access API Documentation
http://localhost:4000/api-docs



## Author
Charles Okonkwo