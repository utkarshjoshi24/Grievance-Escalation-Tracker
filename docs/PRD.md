# Product Requirements Document (PRD)

**Project Name:** Grievance Escalation Tracker  
**Tagline:** A Web-Based System for Time-Bound, Auto-Escalating Grievance Redressal  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Primary Tech Stack:** MERN (MongoDB, Express.js, React, Node.js) with Tailwind CSS, node-cron, Socket.IO, Nodemailer

---

## 1. Product Overview

### 1.1 Product Name & Tagline
- **Name:** Grievance Escalation Tracker (GET)
- **Tagline:** A Web-Based System for Time-Bound, Auto-Escalating Grievance Redressal

### 1.2 Product Description
The Grievance Escalation Tracker is an institutional web platform designed to streamline, track, and automatically escalate grievances in higher education institutions. By decoupling the grievance payload from student identity via cryptographic hashing and UUID-based tracking tokens, the platform guarantees whistleblower confidentiality while enforcing institutional accountability through automated, SLA-driven hierarchy escalations.

### 1.3 Purpose
To replace informal, unreliable, and manual grievance handling mechanisms (e.g., physical registers, suggestion boxes, informal chat groups) with an automated, auditable, and transparent digital workflow where inaction directly triggers escalation to higher administrative tiers.

### 1.4 Target Environment
- **Primary Domain:** Higher education institutions, colleges, university departments, and residential campuses.
- **Deployment Profile:** Responsive Web Application accessible across modern desktop, tablet, and mobile web browsers.

---

## 2. Problem Statement

In collegiate environments, grievances concerning faculty conduct, infrastructure deficiencies, hostel living conditions, ragging, harassment, or academic disputes are predominantly handled through informal and fragmented channels. These traditional channels suffer from three fundamental defects:

1. **Lack of Accountability:** Once a complaint is submitted physically or verbally, there is no technical mechanism enforcing a time-bound response. Follow-up depends entirely on individual memory, resulting in grievances being ignored, delayed indefinitely, or quietly buried.
2. **Lack of Visibility:** Complainants possess zero real-time insight into the status of their grievance, who is currently evaluating it, or what corrective actions have been taken. The only recourse is inquiring in person, which introduces administrative friction and anxiety.
3. **Fear of Identification:** Students frequently withhold critical grievances—especially those involving faculty conduct, discrimination, or administrative abuse—due to justifiable fears of academic retaliation, social stigma, or administrative backlash when their identity is exposed to resolving authorities.

---

## 3. Product Vision

The Grievance Escalation Tracker transforms manual, discretionary complaint handling into a rules-driven, transparent, and time-bound digital ecosystem. By establishing multi-tiered administrative hierarchies with hard SLA timers, the platform ensures that inaction carries an automatic procedural consequence: escalation to the next senior authority. Through private tracking tokens and anonymized submission protocols, the system creates a secure environment that empowers students to voice concerns without fear, while granting institutional leaders actionable analytics to identify systemic bottlenecks.

---

## 4. Objectives

1. **Confidential Grievance Submission:** Enable verified institutional members to submit grievances across designated categories with cryptographic anonymity, ensuring resolver authorities never receive personal identifiers.
2. **Configurable Escalation Hierarchies:** Implement a dynamic hierarchy structure per category (e.g., Class Representative → Head of Department → Dean → Vice Chancellor) with custom SLA durations.
3. **Automated SLA Escalation Engine:** Deploy an autonomous background worker that monitors grievance deadlines and escalates unresolved tickets to senior administrative tiers immediately upon SLA expiry.
4. **Transparent Public/Token Tracking:** Provide a real-time audit timeline accessible via a unique UUID tracking token, displaying progress milestones and generic resolver titles without exposing private user data.
5. **Role-Tailored Dashboards:** Deliver dedicated operational consoles for Students, Departmental Authorities, and System Administrators.
6. **Administrative Analytics:** Provide high-level metrics including average resolution times, departmental escalation rates, category distributions, and top-tier overdue bottlenecks.

---

## 5. Target Users & Role Matrix

| User Role | Description | Allowed Actions | Restricted Actions |
| :--- | :--- | :--- | :--- |
| **Student / Complainant** | Enrolled student or verified complainant seeking redressal. | • Register & Login (Mock SSO)<br>• Submit anonymous grievance with category & description<br>• Receive private UUID tracking token<br>• Track grievance status & timeline via token<br>• View submitted grievances in personal student dashboard<br>• Confirm resolution & close grievance | • Cannot view resolver's personal identity (sees generic titles only)<br>• Cannot alter hierarchy configurations or SLAs<br>• Cannot access authority triage consoles |
| **Authority / Resolver** | Faculty, HOD, Dean, or Warden assigned to a specific hierarchy level and department. | • Login to Authority Dashboard<br>• View grievances assigned strictly to their level and department<br>• Acknowledge grievance (transition to `In-Review`)<br>• Resolve grievance with formal resolution remarks<br>• Manually escalate early with a mandatory rationale | • Cannot view complainant's name, email, or student ID<br>• Cannot modify hierarchy levels or system SLAs<br>• Cannot view or act upon grievances assigned to other levels/departments |
| **Administrator** | System administrator or Institutional Ombudsperson overseeing the platform. | • Access system-wide Admin Dashboard<br>• View all grievances across all categories, tiers, and statuses<br>• Configure escalation hierarchies and SLA hours per category<br>• Access operational analytics and export metrics<br>• Monitor and intervene in `Overdue - Top Level` grievances | • Cannot decrypt or reveal complainant identities<br>• Should not bypass standard resolution workflows without audit logging |

---

## 6. Core Features

### 6.1 Anonymous Grievance Submission
- Complainants select from predefined categories:
  - **Academic** (e.g., grading disputes, timetable clashes, syllabus coverage)
  - **Hostel** (e.g., room maintenance, mess food quality, water/electricity issues)
  - **Harassment** (e.g., bullying, ragging, discriminatory conduct)
  - **Infrastructure** (e.g., lab equipment failure, classroom facilities, library resources)
  - **Faculty Conduct** (e.g., unprofessionalism, absenteeism, bias)
  - **Other** (general institutional matters)
- Submission requires a detailed description.
- To prevent spam and abuse while preserving anonymity, the backend computes a one-way cryptographic hash of the submitter's verified user ID (`submittedByHash`). This hash is used strictly for rate-limiting and duplicate prevention, and is never exposed or reverse-engineered to reveal identity.

### 6.2 Private Tracking Token
- Upon successful submission, the system generates a cryptographically random UUID v4 tracking token (e.g., `8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c`).
- The token is presented once in a high-visibility modal/card with a copy-to-clipboard utility.
- Complainants utilize this token to query grievance progress publicly or from their dashboard without authenticating resolver visibility.

### 6.3 SLA Timer & Countdown
- Every submitted grievance is assigned a dynamic SLA deadline based on the active `HierarchyConfig` for that category at Level 1.
- Deadlines are stored as absolute UTC timestamps (`slaDeadline`).
- Frontends render a live countdown clock indicating hours and minutes remaining before automated escalation.

### 6.4 Automatic Multi-Tier Escalation
- An automated background worker (powered by `node-cron`) periodically evaluates active grievances against the current system time.
- **Escalation Progression:**
  $$\text{Level 1 (e.g., Class Rep / Warden)} \xrightarrow{\text{SLA Breach}} \text{Level 2 (e.g., HOD)} \xrightarrow{\text{SLA Breach}} \text{Level 3 (e.g., Dean)} \xrightarrow{\text{SLA Breach}} \dots$$
- When an SLA expires without resolution:
  1. The grievance level increments (`currentLevel = currentLevel + 1`).
  2. A new `slaDeadline` is calculated from the next level's configured `slaHours`.
  3. Status updates to `Escalated`.
  4. An immutable audit record is committed to `EscalationLogs` with reason `"SLA expired"`.
  5. Notifications are dispatched to the newly assigned authority and the complainant's tracking channel.
- If a grievance breaches its SLA at the highest defined hierarchy tier, its status updates to `Overdue - Top Level`, triggering high-priority administrative dashboard alerts.

### 6.5 Grievance Status Lifecycle
The system supports six distinct operational states:
1. `Pending`: Grievance submitted, awaiting acknowledgment at the current level.
2. `In-Review`: Assigned authority has opened and acknowledged the grievance.
3. `Escalated`: Grievance escalated (automatically via SLA timeout or manually by authority) to a higher tier.
4. `Resolved`: Authority has addressed the issue and submitted resolution notes.
5. `Closed`: Complainant has confirmed resolution, or ticket was auto-closed after 7 days in `Resolved` state.
6. `Overdue - Top Level`: Final escalation tier SLA expired without resolution; pending administrative intervention.

### 6.6 Role-Based Dashboards
- **Student Dashboard:** View historical submissions, tracking tokens, active statuses, and SLA progress.
- **Authority Dashboard:** Triage queue filtered by current hierarchy level and department, action modal for status changes (`In-Review`, `Resolved`, manual `Escalate`).
- **Admin Dashboard:** Global oversight panel with hierarchy configuration editor, category SLA management, grievance inspection table, and real-time operational telemetry.

### 6.7 Notification System
- **Email Dispatch (Nodemailer):** Sends transaction alerts to authorities upon assignment/escalation and status notifications to students.
- **Real-Time WebSockets (Socket.IO):** Pushes instant status updates to active client sessions (authority queues and public tracking views).

### 6.8 Administrative Analytics
- **Average Resolution Time:** Aggregate duration from submission to resolution per category.
- **Escalation Frequency:** Count and percentage of grievances escalating beyond Level 1.
- **Departmental Heatmap:** Escalation and breach distribution across academic and administrative departments.
- **Critical Backlog:** Real-time counter of `Overdue - Top Level` grievances requiring emergency ombudsperson intervention.

---

## 7. Functional Requirements

### 7.1 Authentication & Authorization
- **FR-001:** The system shall allow users to register with name, email, password, role (`student`, `authority`, `admin`), department, and hierarchy level (for authorities).
- **FR-002:** The system shall authenticate users using bcrypt password hashing and issue stateless JSON Web Tokens (JWT) containing `userId`, `role`, `department`, and `hierarchyLevel`.
- **FR-003:** The system shall enforce role-based access control (RBAC) middleware on all protected API routes.

### 7.2 Grievance Submission & Ingestion
- **FR-004:** The system shall allow authenticated students to submit grievances by providing a category and textual description.
- **FR-005:** Upon grievance submission, the system shall generate a unique UUID v4 tracking token.
- **FR-006:** The system shall compute a SHA-256 hash of the student's ID (`submittedByHash`) and store it with the grievance document while omitting any direct foreign key or plain-text student reference in the authority-facing payload.
- **FR-007:** The system shall initialize new grievances with `currentLevel = 1`, `status = 'Pending'`, and compute `slaDeadline = currentTime + Level1.slaHours`.

### 7.3 Status Tracking & Timeline
- **FR-008:** The system shall provide a public, unauthenticated tracking endpoint accessible strictly via valid UUID tracking token.
- **FR-009:** The tracking response shall return category, description, current status, generic role title of current resolver, SLA deadline countdown, creation timestamp, and full escalation timeline.
- **FR-010:** The tracking interface shall never return the real name, email, or employee ID of the assigned authority.

### 7.4 Authority Actions & Manual Escalation
- **FR-011:** The system shall restrict authority grievance queries to records where `currentLevel == authority.hierarchyLevel` and `department == authority.department` (or institutional-wide categories).
- **FR-012:** An authority shall be able to update status from `Pending` to `In-Review`.
- **FR-013:** An authority shall be able to mark an `In-Review` grievance as `Resolved` by submitting resolution notes.
- **FR-014:** An authority shall be able to manually escalate a grievance early to the next tier by providing a mandatory explanation string.

### 7.5 Automated Escalation Engine
- **FR-015:** A scheduled background job (`node-cron`) shall execute at configured intervals (e.g., every 15 minutes in production; every 1-2 minutes in demo mode).
- **FR-016:** The cron job shall atomically query all grievances where `status IN ['Pending', 'In-Review']` and `slaDeadline <= currentTime`.
- **FR-017:** For each expired grievance, if a subsequent hierarchy level exists in `HierarchyConfig`, the system shall:
  - Increment `currentLevel` by 1.
  - Calculate new `slaDeadline = currentTime + nextLevel.slaHours`.
  - Update `status = 'Escalated'`.
  - Append a record in `EscalationLogs` (`fromLevel`, `toLevel`, `reason: 'SLA expired'`, `timestamp`).
  - Emit real-time Socket.IO events and dispatch email notifications.
- **FR-018:** If an expired grievance is already at the maximum configured hierarchy level, the system shall update `status = 'Overdue - Top Level'` and flag it for administrative attention.

### 7.6 Administration & Configuration
- **FR-019:** Administrators shall be able to view and edit the escalation hierarchy and SLA hours for each category via `HierarchyConfig`.
- **FR-020:** Administrators shall be able to view aggregated analytics, including category resolution times, escalation rates per department, and overdue summaries.

---

## 8. Non-Functional Requirements

### 8.1 Security
- Passwords must be hashed using `bcrypt` with a work factor $\ge 10$.
- All API communication must be structured over HTTPS.
- Authentication tokens must be signed with a secure, environment-managed `JWT_SECRET` with appropriate expiration windows.
- Database inputs must be sanitized against NoSQL injection via Mongoose schema validators.

### 8.2 Privacy & Confidentiality
- Authority-facing API payloads and UI views must strictly exclude complainant identity.
- Database records must isolate complainant identifiers via one-way cryptographic hashing (`submittedByHash`).
- Public tracking endpoints must never expose internal user IDs or personal authority credentials.

### 8.3 Performance & Responsiveness
- REST API response times for standard queries must remain $< 200\text{ ms}$ under normal academic load.
- Background cron escalation execution must process active queue items atomically within $< 5\text{ seconds}$.
- Web client must be fully responsive across mobile ($< 768\text{px}$), tablet ($768\text{px} - 1024\text{px}$), and desktop ($> 1024\text{px}$) viewports.

### 8.4 Reliability & Availability
- Database operations involving status updates and escalation logs must maintain transactional consistency.
- Background jobs must gracefully handle edge cases (e.g., missing hierarchy configs, network timeouts) without crashing the primary server process.

### 8.5 Accessibility & Usability
- Interface typography, contrast ratios, and interactive elements must comply with WCAG 2.1 AA standards.
- High-visibility status badges and countdown clocks must use standard color coding (Slate = Pending, Blue = In-Review, Amber = Escalated, Emerald = Resolved, Ruby = Overdue).

---

## 9. Privacy & Anonymity Architecture

The architecture enforces strict procedural anonymity through three distinct technical boundaries:

```
[ Complainant / Student ]
          │
          ▼
 ┌──────────────────────────────────────────────────────────┐
 │ Submission Boundary: Generate UUID Token & Hash ID       │
 │ - trackingToken = crypto.randomUUID()                   │
 │ - submittedByHash = SHA256(studentId + Salt)             │
 └──────────────────────────────────────────────────────────┘
          │
          ▼
 ┌──────────────────────────────────────────────────────────┐
 │ Storage Layer: Grievance Collection                     │
 │ - trackingToken (Indexed)                               │
 │ - submittedByHash (Hidden from Authority queries)        │
 │ - NO plaintext student reference                        │
 └──────────────────────────────────────────────────────────┘
          │
          ├───► [ Authority Interface ]: Sees ONLY Category, Text, Generic Level, SLA
          └───► [ Public Tracking UI ]: Sees ONLY Status, Timeline, Role Title (e.g. "HOD")
```

1. **Resolver Boundary:** Authority queries project only grievance content, category, current tier, and timeline. No user join is ever performed to attach student credentials.
2. **Public Boundary:** Public tracking views resolve role titles generically (e.g., *"Assigned to: Head of Department"* rather than *"Assigned to: Dr. Jane Doe"*).
3. **Audit Boundary:** The `submittedByHash` prevents repeat spam submissions while guaranteeing that even database administrators cannot trivially reverse the hash to identify complainants.

---

## 10. Project Scope

### 10.1 In Scope
- User authentication with role segregation (Student, Authority, Admin).
- Anonymous grievance submission across 6 standardized categories.
- Automatic UUID tracking token issuance.
- Configurable escalation hierarchy and SLA hours per category.
- Automated background SLA escalation engine (`node-cron`).
- Email alerts (Nodemailer) and live updates (Socket.IO).
- Public token-based status timeline and countdown timer.
- Role-specific dashboards for Students, Authorities, and Administrators.
- Administrative analytics reporting.

### 10.2 Out of Scope
- Native mobile applications (iOS/Android) — web-responsive interface only.
- AI-based natural language grievance classification or sentiment analysis.
- Production Single Sign-On (SSO) / LDAP / ERP integration (Mock SSO used instead).
- Formal legal case-management and judicial discovery workflows.

---

## 11. Future Scope (Documented Extensibility)
- Direct integration with campus ERP/SSO systems (SAML/OAuth2) behind the anonymity layer.
- SMS and WhatsApp dispatch channels for urgent safety and harassment categories.
- Cross-platform mobile client built with React Native.
- Natural Language Processing (NLP) for auto-tagging and duplicate grievance detection.
- Multi-variable escalation criteria based on urgency severity scores.

---

## 12. Success Criteria

1. **Escalation Accuracy:** 100% of expired grievances automatically transition to the next hierarchy tier within 1 cron cycle of SLA breach.
2. **Zero Identity Leakage:** 0% exposure of student identities in authority triage queries and public tracking endpoints.
3. **End-to-End Traceability:** Complete audit history captured in `EscalationLogs` for every automated and manual tier jump.
4. **Sub-second Triage:** Intuitive, dark-mode SaaS user interface allowing authorities to review and action assigned grievances within 3 clicks.

---

## 13. Assumptions & Constraints

- **Mock Authentication:** The system relies on standard email/password authentication simulating institutional credentials rather than a live university LDAP/Active Directory link.
- **Free-Tier Hosting Constraints:** Cloud hosts (e.g., Render/Railway free tiers) may exhibit cold-start latency after inactivity; uptime ping mechanisms or demo evaluation notes are required.
- **SLA Demo Mode:** For live evaluation and grading demonstrations, SLA windows can be configured in minutes rather than real-world days/hours via `HierarchyConfig`.
- **Single-Timezone Standard:** All SLA timers and timestamps are calculated in UTC and formatted in the client's local institutional timezone.
