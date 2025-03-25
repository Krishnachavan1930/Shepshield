
# SepsisCare Application

A full-stack application for monitoring and managing sepsis cases in healthcare facilities.

## Project Structure

This project is divided into two main parts:

- `client/` - Frontend React application
- `server/` - Backend Express/Node.js API with MongoDB database

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Setup Instructions

1. Clone this repository

2. Setup the server:
```
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

4. Seed the database with sample data:
```
npm run seed
```

5. Start the server:
```
npm run dev
```

6. Setup the client:
```
cd ../client
npm install
```

7. Start the client:
```
npm run dev
```

8. Access the application at: http://localhost:5173

## Demo Credentials

You can use these credentials to log in:

- Email: doctor@example.com
- Password: password123

## Features

- User authentication and authorization
- Patient management
- Vital signs monitoring
- Sepsis risk calculation
- Analytics dashboard
- Mobile-responsive design

## API Documentation

The API is organized around REST. All requests should be made to endpoints beginning with `/api/`.

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user information
- `PATCH /api/auth/update-password` - Update user password
- `PATCH /api/auth/update-me` - Update user profile

### Patient Endpoints

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get a specific patient
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient
- `DELETE /api/patients/:id` - Delete a patient
- `GET /api/patients/:id/vitals` - Get a patient's vital signs
- `POST /api/patients/:id/vitals` - Add vital signs to a patient
- `GET /api/patients/:id/labs` - Get a patient's lab results
- `POST /api/patients/:id/labs` - Add lab results to a patient

### Analytics Endpoints

- `GET /api/analytics` - Get general analytics
- `GET /api/analytics/monthly` - Get monthly data
- `GET /api/analytics/departments` - Get department data
- `GET /api/analytics/detection-rate` - Get detection rate
- `GET /api/analytics/outcomes` - Get patient outcomes
- `GET /api/analytics/risk-distribution` - Get risk distribution

### Doctor Endpoints

- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get a specific doctor
- `POST /api/doctors` - Create a new doctor
- `PUT /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor
