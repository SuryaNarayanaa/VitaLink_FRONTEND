# VitaLink2025 API Documentation

This document provides details about all available API endpoints in the VitaLink2025 application.

## Table of Contents
- [General Routes](#general-routes)
- [Authentication Routes](#authentication-routes)
- [Admin Routes](#admin-routes)
- [Doctor Routes](#doctor-routes)
- [Patient Routes](#patient-routes)

## General Routes

### GET /
- **Description**: Root endpoint
- **Response**: JSON with a hello message
- **Response Example**:
```json
{
  "message": "Hello World."
}
```

## Authentication Routes

### POST /login
- **Description**: Handle user login and set session variables
- **Request Body**: Form data with username and password
- **Response**: JSON with login status and role
- **Response Example**:
```json
{
  "message": "login successful",
  "role": "admin/doctor/patient"
}
```

### GET /logout
- **Description**: Handle user logout
- **Required**: Valid session cookie
- **Response**: JSON with logout status
- **Response Example**:
```json
{
  "message": "logout successful"
}
```

## Admin Routes

### GET /admin
- **Description**: Admin dashboard with all items
- **Required**: Admin role
- **Response**: JSON with all items and columns
- **Response Example**:
```json
{
  "items": [...],
  "columns": [...]
}
```

### GET /item/update/{item_id}
- **Description**: Fetch an item's details by its ID
- **Required**: Admin role
- **Path Parameters**: 
  - `item_id`: The ObjectId of the item
- **Response**: JSON with item details

### POST /item/create
- **Description**: Create a new item
- **Required**: Admin role
- **Request Body**: JSON object containing the item data
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Item created successfully"
}
```

### POST /item/update/{item_id}
- **Description**: Update an existing item
- **Required**: Admin role
- **Path Parameters**:
  - `item_id`: The ObjectId of the item
- **Request Body**: JSON object containing the updated item data
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Item updated successfully"
}
```

### POST /item/delete/{item_id}
- **Description**: Delete an item
- **Required**: Admin role
- **Path Parameters**:
  - `item_id`: The ObjectId of the item
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Item deleted successfully"
}
```

## Doctor Routes

### GET /doctor
- **Description**: Doctor dashboard with assigned patients
- **Required**: Doctor role
- **Response**: JSON with patients list and user data
- **Response Example**:
```json
{
  "patients": [...],
  "user": {...}
}
```

### GET /doctor/list-api
- **Description**: Get list of all doctors
- **Response**: JSON array of doctors with ID and name
- **Response Example**:
```json
[
  {
    "fullName": "Dr. John Doe",
    "ID": "DOC00001"
  },
  ...
]
```

### POST /doctor/reassign/{patient_id}
- **Description**: Reassign a doctor to a patient
- **Path Parameters**:
  - `patient_id`: The ID of the patient
- **Query Parameters**:
  - `doc`: New doctor ID
  - `typ`: "Doctor" or "Caretaker"
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Doctor reassigned successfully",
  "patientID": "PAT00001",
  "newDoctorID": "DOC00002"
}
```

### POST /doctor/add-patient
- **Description**: Add a new patient to the database
- **Required**: Doctor role
- **Request Body**: Patient data
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Success!"
}
```

### GET /doctor/view-patient/{patient_id}
- **Description**: View patient details
- **Required**: Doctor role
- **Path Parameters**:
  - `patient_id`: The ID of the patient
- **Response**: JSON with patient data, user info, and statistics
- **Response Example**:
```json
{
  "patient": {...},
  "user": {...},
  "chart_data": [...],
  "missed_doses": [...]
}
```

### POST /doctor/edit-dosage/{patient_id}
- **Description**: Edit patient dosage schedule
- **Required**: Doctor role
- **Path Parameters**:
  - `patient_id`: The ID of the patient
- **Request Body**: List of dosage schedule objects
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Success!"
}
```

### GET /doctor/reports
- **Description**: View patient reports
- **Required**: Doctor role
- **Query Parameters**:
  - `typ`: "today" or patient_id
- **Response**: JSON with reports data
- **Response Example**:
```json
{
  "user": {...},
  "reports": [...]
}
```

## Patient Routes

### GET /patient
- **Description**: Patient dashboard
- **Required**: Patient role
- **Response**: JSON with patient data and statistics
- **Response Example**:
```json
{
  "patient": {...},
  "chart_data": [...],
  "missed_doses": [...]
}
```

### POST /patient/update-inr
- **Description**: Update INR report
- **Required**: Patient role
- **Form Parameters**:
  - `inr_value`: Float value
  - `location_of_test`: String
  - `date`: Date string
  - `file`: Uploaded file
- **Response**: JSON with status message and report data
- **Response Example**:
```json
{
  "message": "INR report added successfully",
  "report": {...}
}
```

### GET /patient/report
- **Description**: Get patient report form
- **Required**: Patient role
- **Query Parameters**:
  - `type`: Report type (lifestyleChanges, otherMedication, sideEffects, prolongedIllness)
- **Response**: JSON with patient data, message, and type information
- **Response Example**:
```json
{
  "patient": {...},
  "message": "Type your Lifestyle Changes Here",
  "type": "lifestyleChanges",
  "page": "Report Lifestyle Changes"
}
```

### POST /patient/report
- **Description**: Submit patient report
- **Required**: Patient role
- **Form Parameters**:
  - `typ`: Report type
  - `field`: Report content
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "report submitted"
}
```

### GET /patient/take-dose
- **Description**: Get take dose form
- **Required**: Patient role
- **Response**: JSON with patient data and missed doses
- **Response Example**:
```json
{
  "patient": {...},
  "missed_doses": [...]
}
```

### POST /patient/take-dose
- **Description**: Submit dose taken
- **Required**: Patient role
- **Query Parameters**:
  - `date`: Date string
- **Response**: JSON with status message
- **Response Example**:
```json
{
  "message": "Success!"
}
```
