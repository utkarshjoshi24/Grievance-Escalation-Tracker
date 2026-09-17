# REST API Specification

**Project Name:** Grievance Escalation Tracker  
**Document Version:** 1.0.0  
**Protocol:** RESTful over HTTPS  
**Data Format:** JSON (`application/json`)  
**Base URL:** `/api`  
**Status:** Approved for Implementation  
**Reference Documents:** [PRD.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/PRD.md), [USER_FLOWS.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/USER_FLOWS.md), [DATABASE_SCHEMA.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/DATABASE_SCHEMA.md)

---

## 1. Global API Standards

### 1.1 Response Envelope Structure

All API responses strictly adhere to a standardized JSON envelope format:

#### Standard Success Response:
```json
{
  "success": true,
  "data": {},
  "message": "Human-readable operation confirmation."
}
```

#### Standard Error Response:
```json
{
  "success": false,
  "error": {
    "code": "ERR_CODE_IDENTIFIER",
    "message": "Detailed description of the error."
  }
}
```

### 1.2 Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing, invalid, or expired JWT token.
- `403 Forbidden`: Authenticated user lacks the required role or hierarchy clearance.
- `404 Not Found`: Requested resource or tracking token does not exist.
- `409 Conflict`: State conflict (e.g., email already registered or race-condition during escalation).
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server exception.

### 1.3 Authentication & Authorization Model
- **Token Type:** JSON Web Token (JWT) passed in the HTTP Authorization header: `Authorization: Bearer <jwt_token>`.
- **JWT Payload Structure:**
```json
{
  "userId": "66e85a10f1a2b3c4d5e60002",
  "role": "authority",
  "department": "Computer Science",
  "hierarchyLevel": 2,
  "iat": 1726500000,
  "exp": 1726586400
}
```
- **Middleware Chain:**
  1. `authMiddleware.js`: Verifies token signature with `JWT_SECRET` and populates `req.user`.
  2. `roleGuard.js(roles)`: Enforces that `roles.includes(req.user.role)`.

---

## 2. API Endpoints Directory

```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login

Student / Public Grievance:
  POST   /api/grievances
  GET    /api/grievances/track/:token
  GET    /api/grievances/my

Authority Operations:
  GET    /api/grievances/assigned
  PATCH  /api/grievances/:id/status
  PATCH  /api/grievances/:id/escalate

Administrator Operations:
  GET    /api/admin/grievances
  GET    /api/admin/hierarchy
  PUT    /api/admin/hierarchy/:category
  GET    /api/admin/analytics
```

---

## 3. Authentication Endpoints

### 3.1 Register User (Mock SSO)
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Purpose:** Creates a new user account across student, authority, or admin roles.
- **Authentication:** None (Public)
- **Role Required:** None

#### Request Body:
```json
{
  "name": "Alex Mercer",
  "email": "alex.student@university.edu",
  "password": "SecurePassword123!",
  "role": "student",
  "department": "Computer Science",
  "hierarchyLevel": null
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66e85a10f1a2b3c4d5e60001",
      "name": "Alex Mercer",
      "email": "alex.student@university.edu",
      "role": "student",
      "department": "Computer Science",
      "hierarchyLevel": null
    }
  },
  "message": "User registered successfully."
}
```

#### Common Error Responses:
- `400 Bad Request`: `{ "success": false, "error": { "code": "ERR_VALIDATION", "message": "Email and password are required. Password must be $\\ge 8$ characters." } }`
- `409 Conflict`: `{ "success": false, "error": { "code": "ERR_EMAIL_EXISTS", "message": "An account with this email address already exists." } }`

---

### 3.2 Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Purpose:** Authenticates user credentials and issues a signed JWT.
- **Authentication:** None (Public)
- **Role Required:** None

#### Request Body:
```json
{
  "email": "hod.cs@university.edu",
  "password": "SecurePassword123!"
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66e85a10f1a2b3c4d5e60002",
      "name": "Dr. Sarah Jenkins",
      "email": "hod.cs@university.edu",
      "role": "authority",
      "department": "Computer Science",
      "hierarchyLevel": 2
    }
  },
  "message": "Login successful."
}
```

#### Common Error Responses:
- `401 Unauthorized`: `{ "success": false, "error": { "code": "ERR_INVALID_CREDENTIALS", "message": "Invalid email or password." } }`

---

## 4. Student & Public Grievance Endpoints

### 4.1 Submit Grievance
- **Method:** `POST`
- **Endpoint:** `/api/grievances`
- **Purpose:** Submits an anonymous grievance, computes initial SLA, and issues a tracking token.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `student` (or `admin`)

#### Request Body:
```json
{
  "category": "Academic",
  "department": "Computer Science",
  "description": "Continuous lab equipment failure during Operating Systems practical sessions. Workstations in Lab 3 lack updated compilers, blocking weekly assignments."
}
```

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "data": {
    "trackingToken": "8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c",
    "category": "Academic",
    "department": "Computer Science",
    "status": "Pending",
    "currentLevel": 1,
    "slaDeadline": "2026-09-17T10:00:00.000Z",
    "createdAt": "2026-09-16T10:00:00.000Z"
  },
  "message": "Grievance submitted successfully. Please save your tracking token."
}
```

#### Anonymity & Implementation Logic:
- Backend extracts `req.user.userId`, hashes it with SHA-256 (`submittedByHash`), and saves it to the document.
- `req.user.name` or `req.user.email` are **never** attached to the `Grievance` document.

---

### 4.2 Track Grievance Status (Public by Token)
- **Method:** `GET`
- **Endpoint:** `/api/grievances/track/:token`
- **Purpose:** Fetches grievance status, SLA countdown, and audit timeline via UUID tracking token.
- **Authentication:** None (Public)
- **URL Parameter:** `token` (String, UUID v4 format)

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "trackingToken": "8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c",
    "category": "Academic",
    "department": "Computer Science",
    "description": "Continuous lab equipment failure during Operating Systems practical sessions...",
    "status": "In-Review",
    "currentLevel": 2,
    "currentRoleTitle": "Head of Department (HOD)",
    "slaDeadline": "2026-09-18T14:00:00.000Z",
    "resolutionRemarks": null,
    "createdAt": "2026-09-15T10:00:00.000Z",
    "timeline": [
      {
        "event": "Grievance Filed",
        "level": 1,
        "roleTitle": "Course Instructor / Class Advisor",
        "timestamp": "2026-09-15T10:00:00.000Z",
        "reason": "Initial submission"
      },
      {
        "event": "Auto-Escalated (Tier Jump)",
        "fromLevel": 1,
        "toLevel": 2,
        "roleTitle": "Head of Department (HOD)",
        "timestamp": "2026-09-16T10:00:00.000Z",
        "reason": "SLA expired"
      },
      {
        "event": "Acknowledged & In-Review",
        "level": 2,
        "roleTitle": "Head of Department (HOD)",
        "timestamp": "2026-09-16T11:30:00.000Z",
        "reason": "Authority acknowledged grievance"
      }
    ]
  },
  "message": "Grievance record retrieved."
}
```

#### Privacy Guarantee:
- The response returns `currentRoleTitle: "Head of Department (HOD)"`. It **never** returns resolver names, emails, or student IDs.

#### Common Error Responses:
- `404 Not Found`: `{ "success": false, "error": { "code": "ERR_TOKEN_NOT_FOUND", "message": "Grievance not found for the provided tracking token." } }`

---

### 4.3 Get Student Submissions
- **Method:** `GET`
- **Endpoint:** `/api/grievances/my`
- **Purpose:** Retrieves all grievances submitted by the authenticated student (matched via `submittedByHash`).
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `student`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "trackingToken": "8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c",
      "category": "Academic",
      "department": "Computer Science",
      "status": "In-Review",
      "currentLevel": 2,
      "slaDeadline": "2026-09-18T14:00:00.000Z",
      "createdAt": "2026-09-15T10:00:00.000Z"
    }
  ],
  "message": "Student grievance list retrieved."
}
```

---

## 5. Authority Operations Endpoints

### 5.1 Get Assigned Grievances
- **Method:** `GET`
- **Endpoint:** `/api/grievances/assigned`
- **Purpose:** Retrieves grievances currently assigned to the requesting authority's level and department.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `authority`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "66e85c30f1a2b3c4d5e60020",
      "trackingToken": "8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c",
      "category": "Academic",
      "department": "Computer Science",
      "description": "Continuous lab equipment failure during Operating Systems practical sessions...",
      "currentLevel": 2,
      "status": "In-Review",
      "slaDeadline": "2026-09-18T14:00:00.000Z",
      "createdAt": "2026-09-15T10:00:00.000Z",
      "updatedAt": "2026-09-16T11:30:00.000Z"
    }
  ],
  "message": "Assigned grievances retrieved."
}
```

---

### 5.2 Update Grievance Status (Acknowledge / Resolve)
- **Method:** `PATCH`
- **Endpoint:** `/api/grievances/:id/status`
- **Purpose:** Acknowledges ticket (`In-Review`) or records formal resolution remarks (`Resolved` / `Closed`).
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `authority` (or `admin`, or `student` for closing)

#### Request Body:
```json
{
  "status": "Resolved",
  "resolutionRemarks": "Operating System lab workstations have been re-imaged with GCC 13 and CMake toolchains. Verified with lab technician."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "66e85c30f1a2b3c4d5e60020",
    "status": "Resolved",
    "resolutionRemarks": "Operating System lab workstations have been re-imaged with GCC 13...",
    "updatedAt": "2026-09-16T15:00:00.000Z"
  },
  "message": "Grievance status updated to Resolved."
}
```

#### Common Error Responses:
- `400 Bad Request`: `{ "success": false, "error": { "code": "ERR_INVALID_TRANSITION", "message": "Cannot transition status directly from Pending to Closed." } }`
- `403 Forbidden`: `{ "success": false, "error": { "code": "ERR_UNAUTHORIZED_TIER", "message": "You are not assigned to this grievance's current escalation level." } }`

---

### 5.3 Early Manual Escalation
- **Method:** `PATCH`
- **Endpoint:** `/api/grievances/:id/escalate`
- **Purpose:** Manually escalates a grievance to the next tier prior to SLA expiration.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `authority`

#### Request Body:
```json
{
  "reason": "Requires administrative funding allocation exceeding departmental authority."
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "_id": "66e85c30f1a2b3c4d5e60020",
    "currentLevel": 3,
    "status": "Escalated",
    "slaDeadline": "2026-09-21T15:00:00.000Z",
    "escalationLogId": "66e85d40f1a2b3c4d5e60035"
  },
  "message": "Grievance manually escalated to Tier 3."
}
```

#### Common Error Responses:
- `400 Bad Request`: `{ "success": false, "error": { "code": "ERR_MISSING_REASON", "message": "A detailed justification string is mandatory for manual escalation." } }`

---

## 6. Administrator Endpoints

### 6.1 Get System Hierarchy Configuration
- **Method:** `GET`
- **Endpoint:** `/api/admin/hierarchy`
- **Purpose:** Fetches escalation tiers and SLA hours across all categories.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `admin`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "_id": "66e85b20f1a2b3c4d5e60010",
      "category": "Academic",
      "levels": [
        { "levelNumber": 1, "roleTitle": "Course Instructor / Class Advisor", "slaHours": 24 },
        { "levelNumber": 2, "roleTitle": "Head of Department (HOD)", "slaHours": 48 },
        { "levelNumber": 3, "roleTitle": "Dean of Academic Affairs", "slaHours": 72 },
        { "levelNumber": 4, "roleTitle": "Vice Chancellor / Ombudsperson", "slaHours": 96 }
      ]
    }
  ],
  "message": "Hierarchy configurations retrieved."
}
```

---

### 6.2 Update Category Hierarchy & SLA
- **Method:** `PUT`
- **Endpoint:** `/api/admin/hierarchy/:category`
- **Purpose:** Modifies tiers, titles, and SLA hours for a specific category.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `admin`

#### Request Body:
```json
{
  "levels": [
    { "levelNumber": 1, "roleTitle": "Course Instructor", "slaHours": 12 },
    { "levelNumber": 2, "roleTitle": "Head of Department", "slaHours": 24 },
    { "levelNumber": 3, "roleTitle": "Dean of Academic Affairs", "slaHours": 48 },
    { "levelNumber": 4, "roleTitle": "Vice Chancellor", "slaHours": 72 }
  ]
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "category": "Academic",
    "levels": [ ... ],
    "updatedAt": "2026-09-16T16:00:00.000Z"
  },
  "message": "Hierarchy configuration for Academic updated successfully."
}
```

---

### 6.3 Get System-Wide Analytics
- **Method:** `GET`
- **Endpoint:** `/api/admin/analytics`
- **Purpose:** Aggregates resolution metrics, escalation rates, category distributions, and top-tier overdue alerts.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `admin`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalGrievances": 142,
      "pendingCount": 18,
      "inReviewCount": 24,
      "escalatedCount": 12,
      "resolvedCount": 82,
      "overdueTopLevelCount": 6,
      "averageResolutionHours": 34.5
    },
    "categoryBreakdown": [
      { "category": "Academic", "total": 54, "escalated": 8, "avgHours": 28.2 },
      { "category": "Hostel", "total": 38, "escalated": 11, "avgHours": 42.0 },
      { "category": "Harassment", "total": 12, "escalated": 2, "avgHours": 14.5 },
      { "category": "Infrastructure", "total": 26, "escalated": 6, "avgHours": 49.1 },
      { "category": "Faculty Conduct", "total": 8, "escalated": 3, "avgHours": 36.0 },
      { "category": "Other", "total": 4, "escalated": 1, "avgHours": 22.0 }
    ],
    "departmentEscalations": [
      { "department": "Computer Science", "escalationCount": 9 },
      { "department": "Hostel Affairs", "escalationCount": 11 },
      { "department": "Mechanical Engineering", "escalationCount": 4 }
    ],
    "overdueTopLevelTickets": [
      {
        "_id": "66e85c30f1a2b3c4d5e60099",
        "trackingToken": "9a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
        "category": "Infrastructure",
        "department": "Campus Facilities",
        "currentLevel": 4,
        "slaDeadline": "2026-09-14T08:00:00.000Z",
        "daysOverdue": 2.5
      }
    ]
  },
  "message": "Analytics telemetry generated."
}
```

---

### 6.4 Get All Grievances (Admin Global View)
- **Method:** `GET`
- **Endpoint:** `/api/admin/grievances`
- **Purpose:** Returns paginated list of all system grievances with optional filters.
- **Authentication:** Required (`Bearer JWT`)
- **Role Required:** `admin`
- **Query Parameters:** `page`, `limit`, `status`, `category`, `department`

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "grievances": [
      {
        "_id": "66e85c30f1a2b3c4d5e60020",
        "trackingToken": "8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c",
        "category": "Academic",
        "department": "Computer Science",
        "status": "In-Review",
        "currentLevel": 2,
        "slaDeadline": "2026-09-18T14:00:00.000Z",
        "createdAt": "2026-09-15T10:00:00.000Z"
      }
    ]
  },
  "message": "Global grievances retrieved."
}
```
