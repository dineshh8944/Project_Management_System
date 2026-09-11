# REST API Documentation - Project Management System

Base URL: `http://localhost:5000/api`

---

## Authentication Header

Protected endpoints require a JSON Web Token (JWT) sent in the HTTP `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Endpoint**: `POST /api/auth/register`
- **Rate Limited**: Yes (Max 20 attempts / 15 mins)
- **Request Body**:
```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "full_name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### 1.2 Login User
- **Endpoint**: `POST /api/auth/login`
- **Rate Limited**: Yes
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": 1,
    "full_name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### 1.3 Logout User
- **Endpoint**: `POST /api/auth/logout`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### 1.4 Get Profile
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-09-11 10:30:00"
  }
}
```

---

## 2. Project Management Endpoints

### 2.1 Get All User Projects
- **Endpoint**: `GET /api/projects`
- **Query Parameters**:
  - `search` (optional): Filter projects by name substring
  - `status` (optional): `'Not Started'`, `'In Progress'`, `'Completed'`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "projects": [
    {
      "id": 1,
      "user_id": 1,
      "name": "E-Commerce Mobile App",
      "description": "Building React Native application",
      "status": "In Progress",
      "start_date": "2026-09-01",
      "end_date": "2026-10-31",
      "created_at": "2026-09-11 10:30:00",
      "total_tasks": 4,
      "completed_tasks": 2
    }
  ]
}
```

### 2.2 Get Single Project Details
- **Endpoint**: `GET /api/projects/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "project": {
    "id": 1,
    "name": "E-Commerce Mobile App",
    "tasks": [...]
  }
}
```

### 2.3 Create Project
- **Endpoint**: `POST /api/projects`
- **Request Body**:
```json
{
  "name": "E-Commerce Mobile App",
  "description": "Building React Native application",
  "status": "In Progress",
  "start_date": "2026-09-01",
  "end_date": "2026-10-31"
}
```

### 2.4 Update Project
- **Endpoint**: `PUT /api/projects/:id`
- **Request Body**: Same as Create Project.

### 2.5 Delete Project
- **Endpoint**: `DELETE /api/projects/:id`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Project and all associated tasks deleted successfully."
}
```

### 2.6 Get Dashboard Statistics
- **Endpoint**: `GET /api/projects/stats/dashboard`
- **Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "total_projects": 3,
    "in_progress_projects": 2,
    "completed_projects": 1,
    "not_started_projects": 0,
    "total_tasks": 10,
    "completed_tasks": 6,
    "pending_tasks": 3,
    "in_progress_tasks": 1
  },
  "recent_projects": [...]
}
```

---

## 3. Task Management Endpoints

### 3.1 Get All Tasks
- **Endpoint**: `GET /api/tasks`
- **Query Parameters**:
  - `search` (optional): Search by task name
  - `project_id` (optional): Filter by project ID
  - `status` (optional): `'Pending'`, `'In Progress'`, `'Completed'`
  - `priority` (optional): `'Low'`, `'Medium'`, `'High'`

### 3.2 Create Task
- **Endpoint**: `POST /api/tasks`
- **Request Body**:
```json
{
  "project_id": 1,
  "name": "Integrate Payment Gateway",
  "description": "Stripe API integration",
  "priority": "High",
  "status": "Pending",
  "due_date": "2026-09-25"
}
```

### 3.3 Update Task
- **Endpoint**: `PUT /api/tasks/:id`

### 3.4 Patch Task Status (Quick Toggle)
- **Endpoint**: `PATCH /api/tasks/:id/status`
- **Request Body**:
```json
{
  "status": "Completed"
}
```

### 3.5 Delete Task
- **Endpoint**: `DELETE /api/tasks/:id`
