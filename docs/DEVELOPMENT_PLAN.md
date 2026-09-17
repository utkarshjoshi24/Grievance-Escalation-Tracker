# Development Plan & Implementation Roadmap

**Project Name:** Grievance Escalation Tracker  
**Document Version:** 1.0.0  
**Target Architecture:** MERN Stack (Vite React + Express.js + MongoDB + Node.js)  
**Status:** Approved for Implementation  
**Reference Documents:** [PRD.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/PRD.md), [USER_FLOWS.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/USER_FLOWS.md), [DATABASE_SCHEMA.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/DATABASE_SCHEMA.md), [API_SPEC.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/API_SPEC.md), [UI_IMPLEMENTATION.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/UI_IMPLEMENTATION.md)

---

## 1. Project Directory Structure Blueprint

The future coding agent will structure the workspace into two clean decoupled directories: `client/` and `server/`.

```
grievance-escalation-tracker/
├── client/                               # Frontend React Application (Vite)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── brand-logo.svg
│   ├── src/
│   │   ├── api/                          # Axios instance & endpoint functions
│   │   │   ├── client.js
│   │   │   ├── authApi.js
│   │   │   ├── grievanceApi.js
│   │   │   └── adminApi.js
│   │   ├── assets/                       # Static SVGs and imagery
│   │   ├── components/                   # Modular React UI components
│   │   │   ├── common/                   # Buttons, Badges, Inputs, Modals, Timers
│   │   │   ├── layout/                   # Navbar, Sidebar, AppLayout, PublicLayout
│   │   │   ├── grievance/                # GrievanceCard, Table, Timeline, CategoryPicker
│   │   │   └── hierarchy/                # TierCard, HierarchyBuilder
│   │   ├── context/                      # Global state providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/                        # View controllers
│   │   │   ├── public/                   # LandingPage, TrackPage
│   │   │   ├── auth/                     # LoginPage, RegisterPage
│   │   │   ├── student/                  # StudentDashboard, SubmitGrievancePage
│   │   │   ├── authority/                # AuthorityDashboard
│   │   │   └── admin/                    # AdminDashboard, HierarchyConfigPage, AdminAnalyticsPage
│   │   ├── routes/                       # React Router tree & role guards
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── utils/                        # Formatters, SLA calculations, token helpers
│   │   │   └── dateUtils.js
│   │   ├── App.jsx
│   │   ├── index.css                     # Tailwind base + custom design tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                               # Backend Node.js / Express Application
│   ├── config/                           # Environment & DB initialization
│   │   ├── db.js
│   │   └── defaultHierarchy.js           # Seed data for category hierarchies
│   ├── controllers/                      # Business logic controllers
│   │   ├── authController.js
│   │   ├── grievanceController.js
│   │   └── adminController.js
│   ├── jobs/                             # Background scheduling engine
│   │   └── escalationJob.js              # node-cron worker
│   ├── middleware/                       # Request processing guards
│   │   ├── authMiddleware.js             # JWT verification
│   │   ├── roleGuard.js                  # RBAC validator
│   │   ├── errorHandler.js               # Centralized exception formatter
│   │   └── rateLimiter.js                # Anti-spam protection
│   ├── models/                           # Mongoose schema definitions
│   │   ├── User.js
│   │   ├── Grievance.js
│   │   ├── EscalationLog.js
│   │   └── HierarchyConfig.js
│   ├── routes/                           # REST route routers
│   │   ├── authRoutes.js
│   │   ├── grievanceRoutes.js
│   │   └── adminRoutes.js
│   ├── socket/                           # Socket.IO event manager
│   │   └── socketHandler.js
│   ├── utils/                            # Reusable backend utilities
│   │   ├── mailer.js                     # Nodemailer SMTP dispatcher
│   │   ├── tokenGenerator.js             # UUID token helper
│   │   └── hashUtil.js                   # SHA-256 student ID hasher
│   ├── .env.example
│   ├── package.json
│   └── server.js                         # Application entry point
│
└── docs/                                 # Complete Technical Documentation Suite
```

---

## 2. Phased Implementation Roadmap

---

### Phase 1: Project Foundation & Design System Setup
- **Goal:** Initialize frontend project, install dependencies, implement the GET Integrity System design tokens in Tailwind CSS, and build foundational shell components.
- **Tasks:**
  1. Initialize React project with Vite (`npm create vite@latest client -- --template react`).
  2. Install core frontend dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `react-router-dom`, `lucide-react`, `axios`, `socket.io-client`, `clsx`, `tailwind-merge`.
  3. Configure `tailwind.config.js` with dark palette (`#050505`, `#0B0D10`, `#111418`, `#3B82F6`, `#EF4444`, `#F59E0B`, `#10B981`) and typography (`Geist`, `JetBrains Mono`).
  4. Create base atomic components: `Button`, `Input`, `StatusBadge`, `StatCard`, `SLACountdown`, and `Modal`.
  5. Build `AppLayout`, collapsible `Sidebar`, and `Navbar` matching the Stitch UI design.
- **Files Affected:**
  - `client/tailwind.config.js`
  - `client/src/index.css`
  - `client/src/components/common/*`
  - `client/src/components/layout/*`
- **Dependencies:** None.
- **Acceptance Criteria:**
  - Vite dev server runs without errors.
  - Design tokens render exact high-contrast dark aesthetic with inner keylights and status badges.
  - Shell layouts adapt cleanly across desktop and mobile viewports.

---

### Phase 2: Backend Foundation & Authentication Module
- **Goal:** Set up Express server, MongoDB connection, JWT authentication, bcrypt password hashing, and role-based access control.
- **Tasks:**
  1. Initialize Node project in `server/` and install `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `helmet`, `morgan`.
  2. Implement database connection in `server/config/db.js`.
  3. Implement `User` Mongoose schema in `server/models/User.js`.
  4. Build `authController.js` (`register`, `login`) and `authRoutes.js`.
  5. Implement `authMiddleware.js` and `roleGuard.js`.
  6. Connect client `AuthContext.jsx`, `LoginPage.jsx`, and `RegisterPage.jsx`.
- **Files Affected:**
  - `server/server.js`
  - `server/config/db.js`
  - `server/models/User.js`
  - `server/controllers/authController.js`
  - `server/middleware/authMiddleware.js`
  - `server/middleware/roleGuard.js`
  - `client/src/context/AuthContext.jsx`
  - `client/src/pages/auth/LoginPage.jsx`
- **Dependencies:** Phase 1.
- **Acceptance Criteria:**
  - Users can register and login as `student`, `authority`, and `admin`.
  - Passwords are securely hashed with bcrypt ($2b$10$).
  - Valid JWTs are issued with embedded roles; invalid or expired tokens are rejected with `401 Unauthorized`.
  - Role-protected routes enforce RBAC constraints.

---

### Phase 3: Grievance Ingestion & Public Tracking Engine
- **Goal:** Enable anonymous grievance filing, UUID tracking token generation, SHA-256 student ID hashing, and public status tracking with SLA countdown clocks.
- **Tasks:**
  1. Implement `Grievance` and `EscalationLog` Mongoose models.
  2. Create utility `server/utils/hashUtil.js` (one-way SHA-256 hashing of student IDs) and `server/utils/tokenGenerator.js` (UUID v4).
  3. Build `POST /api/grievances` endpoint (computes initial Level 1 SLA deadline, saves grievance).
  4. Build `GET /api/grievances/track/:token` (returns sanitized status, timeline, and generic role titles).
  5. Build `GET /api/grievances/my` (fetches student's past submissions).
  6. Implement frontend `SubmitGrievancePage.jsx`, `CategoryPicker.jsx`, `SubmissionSuccessModal.jsx`, and `TrackPage.jsx`.
  7. Build `SLACountdown.jsx` and `TimelineStepper.jsx`.
- **Files Affected:**
  - `server/models/Grievance.js`
  - `server/models/EscalationLog.js`
  - `server/controllers/grievanceController.js`
  - `server/routes/grievanceRoutes.js`
  - `client/src/pages/student/SubmitGrievancePage.jsx`
  - `client/src/pages/public/TrackPage.jsx`
  - `client/src/components/grievance/TimelineStepper.jsx`
- **Dependencies:** Phase 2.
- **Acceptance Criteria:**
  - Submitting a grievance yields a valid UUID v4 token.
  - Student identity is stripped and stored strictly as `submittedByHash`.
  - Public tracking lookup resolves status, generic authority title, and audit timeline without authentication.
  - Live countdown clock accurately reflects hours/minutes remaining.

---

### Phase 4: Authority Triage & Resolution Console
- **Goal:** Deliver the Authority Dashboard allowing resolvers to inspect assigned grievances, acknowledge tickets (`In-Review`), resolve tickets with remarks, and initiate early manual escalations.
- **Tasks:**
  1. Implement `GET /api/grievances/assigned` (filters by `currentLevel == req.user.hierarchyLevel` and `department`).
  2. Implement `PATCH /api/grievances/:id/status` (updates status to `In-Review` or `Resolved` with validation).
  3. Implement `PATCH /api/grievances/:id/escalate` (executes immediate manual escalation with mandatory rationale).
  4. Build frontend `AuthorityDashboard.jsx`, triage queue card components, and `Drawer.jsx` for inspection.
  5. Implement `ResolveModal.jsx` and `ManualEscalateModal.jsx`.
- **Files Affected:**
  - `server/controllers/grievanceController.js`
  - `client/src/pages/authority/AuthorityDashboard.jsx`
  - `client/src/components/grievance/GrievanceCard.jsx`
  - `client/src/components/grievance/ManualEscalateModal.jsx`
- **Dependencies:** Phase 3.
- **Acceptance Criteria:**
  - Authorities only see grievances assigned to their exact level and department.
  - Complainant identities are completely redacted (displays `AnonymityCapsule`).
  - Status updates commit cleanly to MongoDB and emit live UI feedback.

---

### Phase 5: Administration & Hierarchy Calibration
- **Goal:** Build the Admin Dashboard, dynamic hierarchy and SLA configuration builder, and global analytics pipeline.
- **Tasks:**
  1. Implement `HierarchyConfig` Mongoose schema and seed default institutional category ladders in `server/config/defaultHierarchy.js`.
  2. Build `GET /api/admin/hierarchy` and `PUT /api/admin/hierarchy/:category`.
  3. Build `GET /api/admin/analytics` using MongoDB aggregation pipelines (average resolution times, escalation counts per department, overdue top-level list).
  4. Build `GET /api/admin/grievances` (global view across all statuses).
  5. Build frontend `AdminDashboard.jsx`, `HierarchyConfigPage.jsx`, and `HierarchyBuilder.jsx`.
- **Files Affected:**
  - `server/models/HierarchyConfig.js`
  - `server/controllers/adminController.js`
  - `server/routes/adminRoutes.js`
  - `client/src/pages/admin/AdminDashboard.jsx`
  - `client/src/pages/admin/HierarchyConfigPage.jsx`
  - `client/src/components/hierarchy/HierarchyBuilder.jsx`
- **Dependencies:** Phase 4.
- **Acceptance Criteria:**
  - Admins can modify category tier ladders and SLA durations with immediate effect on future submissions.
  - Analytics cards accurately aggregate system-wide performance and overdue bottlenecks.

---

### Phase 6: Automated Escalation Engine (node-cron)
- **Goal:** Deploy the autonomous background escalation worker to evaluate SLAs, advance grievance tiers, record audit logs, and trigger top-level overdue alerts.
- **Tasks:**
  1. Install `node-cron`.
  2. Implement `server/jobs/escalationJob.js`.
  3. Configure scheduled query: `status IN ['Pending', 'In-Review'] AND slaDeadline <= now()`.
  4. For each expired ticket:
     - Check `HierarchyConfig` for level $N+1$.
     - If level $N+1$ exists: atomically increment `currentLevel`, set `status = 'Escalated'`, compute new `slaDeadline`, write to `EscalationLogs`, and trigger alerts.
     - If at top tier: set `status = 'Overdue - Top Level'` and write terminal log.
  5. Add demo-mode accelerator toggle allowing short testing intervals (e.g., 2-minute SLAs).
- **Files Affected:**
  - `server/jobs/escalationJob.js`
  - `server/server.js`
- **Dependencies:** Phase 5.
- **Acceptance Criteria:**
  - Expired grievances are escalated within 1 cron cycle without manual intervention.
  - Race conditions during concurrent authority resolution are prevented via atomic Mongoose queries.
  - Top-tier breaches correctly enter `Overdue - Top Level` status.

---

### Phase 7: Real-Time WebSockets & Email Dispatch
- **Goal:** Implement real-time client UI synchronization using Socket.IO and transactional email notifications using Nodemailer.
- **Tasks:**
  1. Install `socket.io` on server and `socket.io-client` on frontend.
  2. Configure Socket.IO server in `server/socket/socketHandler.js` and mount to HTTP server.
  3. Integrate `SocketContext.jsx` in frontend to broadcast and receive `grievance_updated`, `grievance_escalated`, and `admin_overdue_alert` events.
  4. Configure Nodemailer transporter in `server/utils/mailer.js` (SMTP) with HTML email templates for escalation alerts.
- **Files Affected:**
  - `server/socket/socketHandler.js`
  - `server/utils/mailer.js`
  - `client/src/context/SocketContext.jsx`
- **Dependencies:** Phase 6.
- **Acceptance Criteria:**
  - Authority and tracking screens update instantly upon status change without manual page refresh.
  - Email alerts dispatch reliably (with non-blocking error handling if SMTP is offline).

---

### Phase 8: End-to-End Testing & Verification
- **Goal:** Validate system functionality across unit, integration, role authorization, and simulated SLA escalation test suites.
- **Tasks:**
  1. Unit tests (Jest): Verify JWT utilities, hash generators, and SLA calculation functions.
  2. Integration tests (Supertest): Test full lifecycle (`POST /api/grievances` $\rightarrow$ cron auto-escalate $\rightarrow$ authority resolution).
  3. Security & RBAC tests: Verify students and authorities cannot access restricted administrative routes or view unauthorized departmental queues.
  4. Live demonstration test: Run test suite with demo SLA mode (2-minute window) to verify live auto-escalation in front of evaluators.
- **Files Affected:**
  - `server/tests/*`
  - `client/src/__tests__/*`
- **Dependencies:** Phase 7.
- **Acceptance Criteria:**
  - All automated test suites pass with 0 failures.
  - 100% compliance with privacy and role-guard policies.

---

### Phase 9: Cloud Deployment & Production Configuration
- **Goal:** Deploy the frontend to Vercel, backend API and cron worker to Render/Railway, and database to MongoDB Atlas.
- **Tasks:**
  1. Create MongoDB Atlas cluster; whitelist network access and configure connection URI.
  2. Deploy `server/` to Render Web Service:
     - Set environment variables (`MONGO_URI`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `CLIENT_URL`).
     - Verify `escalationJob.js` cron worker is active in server logs.
  3. Deploy `client/` to Vercel:
     - Set `VITE_API_BASE_URL` pointing to the deployed Render backend URL.
  4. Validate CORS policies, HTTPS encryption, and live WebSocket handshake.
- **Files Affected:**
  - `server/.env.example`
  - `client/.env.example`
  - `vercel.json`
- **Dependencies:** Phase 8.
- **Acceptance Criteria:**
  - Live production URLs are functional end-to-end.
  - Database persistence, cron scheduling, and Socket.IO operate reliably in cloud environments.

---

## 3. Environment Variables Reference

### Server (`server/.env`):
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/grievance_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_institution_2026
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM="Grievance Redressal System <grievance@university.edu>"
CRON_SCHEDULE="*/5 * * * *"
DEMO_MODE=false
```

### Client (`client/.env`):
```ini
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
