
# SepsisCare Server

This is the backend server for the SepsisCare application, a comprehensive monitoring system for early sepsis detection and management.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory using the `.env.example` as a template:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=5000
   ```
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user profile
- PATCH `/api/auth/update-password` - Update password
- PATCH `/api/auth/update-me` - Update user profile

### Patients
- GET `/api/patients` - Get all patients (with filtering & pagination)
- POST `/api/patients` - Create a new patient
- GET `/api/patients/:id` - Get a specific patient's details
- PUT `/api/patients/:id` - Update a patient's information
- DELETE `/api/patients/:id` - Delete a patient (admin/doctor only)
- GET `/api/patients/:id/vitals` - Get a patient's vital signs
- POST `/api/patients/:id/vitals` - Add vital signs to a patient
- GET `/api/patients/:id/labs` - Get a patient's lab results
- POST `/api/patients/:id/labs` - Add lab results to a patient

### Doctors
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/:id` - Get a specific doctor's details
- POST `/api/doctors` - Create a new doctor (admin only)
- PUT `/api/doctors/:id` - Update a doctor's information (admin only)
- DELETE `/api/doctors/:id` - Delete a doctor (admin only)

### Analytics
- GET `/api/analytics` - Get general analytics overview
- GET `/api/analytics/monthly` - Get monthly sepsis case data
- GET `/api/analytics/departments` - Get department-wise sepsis distribution
- GET `/api/analytics/detection-rate` - Get sepsis detection rate statistics
- GET `/api/analytics/outcomes` - Get patient outcome statistics
- GET `/api/analytics/risk-distribution` - Get risk level distribution

## Sample User Credentials

For testing purposes, you can use these credentials:

- Admin: 
  - Email: admin@example.com
  - Password: password123

- Doctor:
  - Email: doctor@example.com
  - Password: password123

- Nurse:
  - Email: nurse@example.com
  - Password: password123
