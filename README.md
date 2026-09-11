# Project Management System (ProjectFlow)

A full-stack **Project Management System** built with **React**, **Node.js with Express.js**, and **MySQL** (optimized for XAMPP). The application empowers users to register, log in, create projects, organize tasks within projects, track execution progress, and view live dashboard analytics.

---

## Features & Highlights

- **User Authentication**: Secure Registration, Login, Logout with **bcrypt** password hashing and **JWT** authorization tokens.
- **Project Management**: Full CRUD for projects owned by the authenticated user with status tracking (`Not Started`, `In Progress`, `Completed`) and custom date ranges.
- **Task Management**: Full CRUD for project tasks with priority tiers (`Low`, `Medium`, `High`), execution states (`Pending`, `In Progress`, `Completed`), and quick-completion check controls.
- **Dashboard Analytics**: Real-time stats display of Total Projects, Projects In Progress, Total Tasks, Completed Tasks, and Pending Tasks.
- **Search & Filtering**: Search projects and tasks by name, filter by project status, task status, task priority, and project ID.
- **Security & Authorization**: User scoping enforcement on all endpoints, SQL injection protection via parameterized queries, express rate limiting on authentication routes, and input validation.

---

## Project Structure

```
project management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL database connection pool & auto-initializer
│   ├── controllers/              # Auth, Project, and Task business logic
│   ├── database/
│   │   └── schema.sql            # MySQL table creation & seed file
│   ├── middleware/               # Auth JWT, Rate Limiting, Input Validation
│   ├── routes/                   # REST API route handlers
│   ├── .env                      # Active environment variables
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express application entry
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, ProjectModal, TaskModal, Toast
│   │   ├── context/              # React AuthContext
│   │   ├── pages/                # AuthPage, Dashboard, ProjectsPage, TasksPage
│   │   ├── services/             # Axios API client with JWT interceptor
│   │   ├── App.jsx
│   │   ├── index.css             # Glassmorphism design tokens & styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── API_DOCUMENTATION.md          # REST API Specification
├── DATABASE_ERD.md               # Database ER Diagram & Relational Schemas
└── README.md                     # Setup instructions & project guide
```

---

## Requirements

- **Node.js**: v18.0.0 or higher
- **MySQL Database**: Local MySQL server or **XAMPP Control Panel** (MySQL service running on port 3306).

---

## 🛠️ Database Setup Instructions (XAMPP / MySQL)

1. Start your **XAMPP Control Panel**.
2. Click **Start** next to **MySQL** (Default port `3306`).
3. (Optional) Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
4. You can either:
   - Import `backend/database/schema.sql` into phpMyAdmin.
   - **OR** simply start the backend server! The backend includes an **Auto-Initializer** (`config/db.js`) that automatically creates the `project_management_db` database and all relational tables on startup if they do not exist.

---

## Environment Variables Documentation

### Backend Environment Variables (`backend/.env`)

A template is provided in [backend/.env.example](file:///d:/youtube%20and%20practice/project_Managements/project%20management/backend/.env.example).

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express server |
| `DB_HOST` | `localhost` | MySQL hostname |
| `DB_USER` | `root` | MySQL username (Default XAMPP user) |
| `DB_PASSWORD` | `""` | MySQL password (Default XAMPP is blank) |
| `DB_NAME` | `project_management_db` | MySQL database name |
| `DB_PORT` | `3306` | MySQL port |
| `JWT_SECRET` | `super_secret_jwt_key_project_management_2026` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token validity duration |

### Frontend Environment Variables (`frontend/.env`)

A template is provided in [frontend/.env.example](file:///d:/youtube%20and%20practice/project_Managements/project%20management/frontend/.env.example).

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend REST API base URL |

---

## Quick Start / Running Locally

### Step 1: Run the Backend Server
```bash
cd backend
npm install
npm start
```
*Backend will run on `http://localhost:5000`.*

### Step 2: Run the React Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`.*

---

## Security Specifications

1. **Authentication Security**:
   - Password Hashing: `bcryptjs` with salt rounds = 10.
   - Plain-text passwords are NEVER saved or logged.
   - Rate Limiting: `express-rate-limit` caps repeated login/register attempts to 20 per 15 minutes.
2. **Authorization Enforcement**:
   - Users can only read, update, or delete projects/tasks that carry their `user_id`.
   - Cross-user data access returns 404 or 403 Forbidden.
3. **Database Injection Defense**:
   - All MySQL queries utilize prepared statements (`mysql2/promise` parameterized placeholders `?`).

---

## 📄 Documentation Links
- [API Documentation](file:///d:/youtube%20and%20practice/project_Managements/project%20management/API_DOCUMENTATION.md)
- [Database Schema & ER Diagram](file:///d:/youtube%20and%20practice/project_Managements/project%20management/DATABASE_ERD.md)
