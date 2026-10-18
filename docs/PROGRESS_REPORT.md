# Grievance Escalation Tracker — Comprehensive Progress Report

**Generated Date**: October 12, 2026  
**Project**: Grievance Escalation Tracker  
**Tech Stack**: Node.js, Express, MongoDB (Mongoose), React 18, Vite, Tailwind CSS  

---

## 1. Executive Summary

The **Grievance Escalation Tracker** is an institutional redressal platform engineered to handle grievances systematically across academic and administrative hierarchies. It incorporates multi-tier automated escalations, strict role-based access control, confidential tracking, and deadline enforcement.

Over the recent development cycles, the system was upgraded from development prototypes to **strict role isolation**, introducing dedicated multi-role landing portals, separated authentication workflows, secured route guards, and live database integration.

---

## 2. System Architecture

```
┌────────────────────────────────┐
│   Vite + React Client (5173)   │
└───────────────┬────────────────┘
                │ /api Proxy
                ▼
┌────────────────────────────────┐
│ Express.js REST API (5001)     │
└───────────────┬────────────────┘
                │ Mongoose
                ▼
┌────────────────────────────────┐
│   MongoDB Instance (27017)     │
└────────────────────────────────┘
```

- **Frontend Port**: `5173`
- **Backend Port**: `5001` (remapped from `5000` to avoid conflicts with macOS AirPlay receiver)
- **Database**: MongoDB running locally on port `27017`

---

## 3. Core Modules & Capabilities

### Backend (`server/`)
- **Authentication**: JWT token generation and validation, Bcrypt password hashing.
- **Role Verification**: Middleware-level authorization checking against `student`, `authority`, and `admin` roles.
- **Escalation Engine**:
  - Automated cron job (`jobs/escalationJob.js`) executing every hour.
  - Hierarchical progression: Tier 1 (Faculty/Advisor) → Tier 2 (HOD/Dean) → Tier 3 (Ombudsman/Admin).
- **Database Seeding**: Utility script (`utils/seeder.js`) pre-populates default hierarchies, test users, and sample grievances.

### Frontend (`client/`)
- **Portal Pages**:
  - **Student**: Dashboard, Submit Grievance, Grievance Details, Tracking.
  - **Authority**: Redressal Queue, Investigation, Resolution, Escalation Management.
  - **Admin**: System Overview, Institutional Analytics, User Directory, Category & SLA Config.
- **Shared Components**: High-fidelity UI cards, status badges, timeline trackers, and layout wrappers.

---

## 4. Key Work Done So Far

### A. Dedicated Multi-Role Landing Page
- **File**: `client/src/pages/public/LandingPage.jsx`
- Replaced single generic action buttons with **three dedicated role portals**:
  1. **Student Redressal Portal**: Login & Registration links.
  2. **Authority & Resolver Queue**: Login & Registration links.
  3. **Ombudsman & Governance**: Login & Registration links.
- Included real-time tracking bar, SLA breakdown, and tier resolution overview.

### B. Role-Segregated Authentication Flows
- **Login Flow (`client/src/pages/auth/LoginPage.jsx`)**:
  - Role tabs pre-selected based on URL parameters (e.g., `/login?role=student`).
  - Strict post-login redirection directly to the user's role dashboard (`/student/dashboard`, `/authority/dashboard`, `/admin/dashboard`).
  - Inline demo credential helpers for testing.
- **Registration Flow (`client/src/pages/auth/RegisterPage.jsx`)**:
  - Role-specific dynamic forms:
    - **Students**: Roll Number, Department, Year of Study.
    - **Authority**: Department, Designation/Title, Hierarchy Level (1–3).
    - **Admin**: Institutional Access Key for administrative validation.

### C. Enforced Role Isolation & Protected Routes
- **Route Guard (`client/src/routes/ProtectedRoute.jsx`)**:
  - Intercepts unauthorized navigation attempts.
  - If a user tries to access routes for another role, they are redirected back to their own authorized dashboard.
- **App Routes (`client/src/routes/AppRoutes.jsx`)**:
  - All `/student/*`, `/authority/*`, and `/admin/*` routes wrapped with `ProtectedRoute`.

### D. Disabled In-Dashboard Role Hopping
- **Files Modified**:
  - `client/src/components/ui/RoleSwitcher.jsx` (neutralized)
  - `client/src/components/layout/DashboardLayout.jsx` (removed switcher)
  - `client/src/components/layout/PublicLayout.jsx` (removed switcher)
- Users cannot change roles from within a dashboard; they must log out and log in with the corresponding credentials.

### E. Real Backend API Integration
- **File**: `client/src/context/AuthContext.jsx`
- Replaced mock user fallback state with real API calls:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/me`
- Persists session tokens in `localStorage`.

### F. Environment & Network Conflict Resolution
- Created `server/.env` configured with `PORT=5001` and local MongoDB connection.
- Updated `client/vite.config.js` proxy to route `/api` requests to `http://localhost:5001`.

---

## 5. Verification & Test Results

1. **Client Build**:
   - `npm run build` completed successfully with 0 errors.
2. **API Endpoint Verification**:
   - `POST /api/auth/login` verified with live HTTP calls for:
     - Student (`alex.student@university.edu`): 200 OK
     - Authority (`instructor@university.edu`): 200 OK
     - Admin (`admin@university.edu`): 200 OK

---

## 6. Demo Accounts & Credentials

| Role | Email | Password | Access Target |
| :--- | :--- | :--- | :--- |
| **Student** | `alex.student@university.edu` | `Password123!` | `/student/dashboard` |
| **Authority (Tier 1)** | `instructor@university.edu` | `Password123!` | `/authority/dashboard` |
| **Authority (Tier 2)** | `hod.cs@university.edu` | `Password123!` | `/authority/dashboard` |
| **Admin / Ombudsman** | `admin@university.edu` | `Password123!` | `/admin/dashboard` |

---

## 7. How to Run the Application

```bash
# 1. Start MongoDB (if not running)
brew services start mongodb/brew/mongodb-community

# 2. Start Backend API
cd "server"
npm run dev

# 3. Start Frontend Client (in a separate terminal)
cd "client"
npm run dev
```
- Client URL: `http://localhost:5173`
- Backend API URL: `http://localhost:5001`
