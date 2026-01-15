# API Documentation v1

Base URL: `/api/v1`

## 👥 Users (Patients & Doctors)

### **List Users**
Retrieve a paginated list of users filtered by role.

-   **Endpoint**: `GET /users`
-   **Query Parameters**:
    -   `role` (Required): `PATIENT` | `DOCTOR` | `ADMIN`
    -   `page` (Optional): Page number (default: 1)
    -   `limit` (Optional): Items per page (default: 10)
-   **Response**:
    ```json
    {
      "status": 200,
      "data": [
        {
          "_id": "678...",
          "firstName": "John",
          "email": "john@example.com",
          "role": "PATIENT"
        }
      ],
      "metadata": {
        "pagination": {
          "total": 50,
          "page": 1,
          "limit": 10,
          "totalPages": 5
        }
      }
    }
    ```

### **Create User**
Register a new user (Patient or Doctor).

-   **Endpoint**: `POST /users`
-   **Body** (JSON):
    ```json
    {
      "firstName": "Jane",
      "lastName": "Doe",   // Optional
      "email": "jane@example.com", // Optional, must be unique if present
      "mobile": "1234567890", // Optional
      "role": "PATIENT",   // Required: PATIENT | DOCTOR
      "age": 30,           // Number
      "gender": "Female"
    }
    ```
-   **Response**: `201 Created`

---

## 🏢 Departments

### **List Departments**
Get all hospital departments.

-   **Endpoint**: `GET /departments`
-   **Response**:
    ```json
    {
      "status": 200,
      "data": [
        { "name": "Cardiology", "code": "CARD" }
      ]
    }
    ```

### **Create Department**
Add a new department.

-   **Endpoint**: `POST /departments`
-   **Body**:
    ```json
    {
      "name": "Neurology",
      "code": "NEURO"
    }
    ```

### **Get/Update/Delete Department**
Manage specific departments by ID.

-   **Endpoints**:
    -   `GET /departments/:id`
    -   `PUT /departments/:id`
    -   `DELETE /departments/:id`
