# User Flows & System Interaction Specification

**Project Name:** Grievance Escalation Tracker  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Reference Document:** [PRD.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/PRD.md)

---

## 1. Overall System Lifecycle Flow

The Grievance Escalation Tracker coordinates an end-to-end asynchronous workflow between students, authority resolvers, the automated escalation engine, and institutional administrators.

```mermaid
flowchart TD
    Start([User Arrives at Platform]) --> AuthChoice{Authentication Mode}
    
    AuthChoice -->|Anonymous / Direct Tracking| TrackDirect[Enter UUID Tracking Token]
    AuthChoice -->|Student Login / Register| StudentAuth[Student Authenticates via Mock SSO]
    AuthChoice -->|Authority Login| AuthLogin[Authority Authenticates via JWT]
    AuthChoice -->|Admin Login| AdminLogin[Admin Authenticates via JWT]
    
    StudentAuth --> Submit[Submit Grievance Form<br>Category + Description]
    Submit --> TokenGen[Generate UUID Token & Compute Level 1 SLA]
    TokenGen --> StudentDash[Token Displayed to Student<br>Status: Pending]
    
    TrackDirect --> PublicView[View Public Status Timeline & SLA Countdown]
    
    StudentDash --> TriagePhase
    PublicView --> TriagePhase
    
    subgraph TriagePhase [Authority Triage & Resolution Phase]
        AuthLogin --> AuthQueue[View Assigned Queue<br>Current Level & Department]
        AuthQueue --> ActionChoice{Authority Action}
        ActionChoice -->|Acknowledge| InReviewState[Mark Status: In-Review]
        ActionChoice -->|Resolve Ticket| ResolvedState[Provide Remarks -> Status: Resolved]
        ActionChoice -->|Early Escalation| ManualEsc[Provide Reason -> Status: Escalated]
    end
    
    InReviewState --> ResolvedState
    ResolvedState --> ClosePhase[Student Confirms OR 7-Day Auto-Close -> Status: Closed]
    
    subgraph AutoEscalationEngine [Background SLA Escalation Engine]
        Cron[node-cron Trigger<br>Periodic Check] --> CheckSLA{slaDeadline < Now AND<br>Status in Pending/In-Review?}
        CheckSLA -->|Yes| CheckTier{Next Tier Exists in HierarchyConfig?}
        CheckTier -->|Yes| DoEscalate[Increment currentLevel<br>Compute New SLA<br>Status: Escalated<br>Commit EscalationLog]
        CheckTier -->|No| DoOverdue[Status: Overdue - Top Level<br>Trigger Admin Alert]
        CheckSLA -->|No| Idle[Wait for next cycle]
    end
    
    ManualEsc --> DoEscalate
    DoEscalate --> AuthQueue
    DoOverdue --> AdminLogin
```

---

## 2. Student / Complainant Flow

The student journey focuses on high-speed submission, zero identity exposure, and friction-free tracking.

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (Complainant)
    participant Client as Frontend (React Client)
    participant API as Backend (Express API)
    participant DB as Database (MongoDB)

    Student->>Client: Navigate to /submit (or Student Dashboard)
    Client->>Student: Render category options (Academic, Hostel, Harassment, etc.) & description field
    Student->>Client: Select category, enter grievance details, click Submit
    Client->>API: POST /api/grievances (Bearer JWT)
    Note over API: 1. Hash student ID (submittedByHash)<br/>2. Fetch Level 1 SLA from HierarchyConfig<br/>3. Generate UUID trackingToken<br/>4. Compute slaDeadline = now + slaHours
    API->>DB: Insert Grievance { trackingToken, category, description, submittedByHash, currentLevel: 1, status: 'Pending', slaDeadline }
    DB-->>API: Document Saved
    API-->>Client: 201 Created { trackingToken, status: 'Pending', slaDeadline, category }
    Client->>Student: Display Token Modal with Copy Button & Advice to Store Safely
    Student->>Client: Click "Track Now" or view in Dashboard
    Client->>API: GET /api/grievances/track/:token
    API->>DB: Query Grievance by trackingToken + lookup EscalationLogs
    DB-->>API: Return Grievance + EscalationLogs
    API-->>Client: 200 OK (Generic Level Title, Status, Timeline, SLA Countdown)
    Client->>Student: Render Timeline & Live Countdown Clock
    
    opt Resolution & Closure
        Note over Student, Client: When Status reaches 'Resolved'
        Student->>Client: Click "Confirm & Close Grievance"
        Client->>API: PATCH /api/grievances/:id/status { status: 'Closed' }
        API->>DB: Update Grievance status = 'Closed'
        API-->>Client: 200 OK
        Client->>Student: Display Closed Status (Terminal State)
    end
```

### Step-by-Step Student Experience:
1. **Authentication:** Student logs in via `/login` or registers via `/register`.
2. **Dashboard Overview:** Student arrives at `/student` displaying their past submissions and token shortcuts.
3. **Grievance Initiation:** Student clicks *"Submit New Grievance"*.
4. **Form Completion:** Student selects one of 6 categories (Academic, Hostel, Harassment, Infrastructure, Faculty Conduct, Other), enters a comprehensive description, and submits.
5. **Token Delivery:** A secure modal presents the UUID token with a single-click copy utility. The user is cautioned: *"Save this tracking token. It is your only cryptographic proof of submission."*
6. **Live Tracking:** Student navigates to `/track/:token` to monitor the live countdown and audit timeline.
7. **Closure Confirmation:** Once marked `Resolved` by an authority, the student can confirm satisfactory redressal, moving the status to `Closed`.

---

## 3. Anonymous Public Tracking Flow

Anyone with a valid UUID tracking token can inspect progress without logging into an institutional account.

```mermaid
sequenceDiagram
    autonumber
    actor Complainant as Anonymous Complainant
    participant Browser as React Client (/track)
    participant API as Backend (/api/grievances/track/:token)
    participant DB as MongoDB

    Complainant->>Browser: Enters UUID tracking token into search bar
    Browser->>API: GET /api/grievances/track/8f4b7a12-9c3d-4e5f-b6a1-2d3e4f5a6b7c
    
    alt Invalid or Non-existent Token
        API->>DB: Query { trackingToken }
        DB-->>API: Null
        API-->>Browser: 404 Not Found { message: "Invalid tracking token" }
        Browser->>Complainant: Show Error State: "Grievance not found. Please verify token."
    else Valid Token Found
        API->>DB: Query Grievance + populate HierarchyConfig roleTitle + EscalationLogs
        DB-->>API: Return Record
        Note over API: Sanitize response:<br/>- Exclude submittedByHash<br/>- Map currentLevel -> generic roleTitle (e.g., "Head of Department")<br/>- NEVER return resolver names
        API-->>Browser: 200 OK { category, status, currentRoleTitle, slaDeadline, timeline, createdAt }
        Browser->>Complainant: Render Status Badge, SLA Countdown, & Chronological Audit Stepper
    end
```

---

## 4. Authority / Resolver Flow

Authorities are assigned grievances based on their designated hierarchy level and department.

```mermaid
sequenceDiagram
    autonumber
    actor Auth as Authority (e.g., HOD, Level 2)
    participant Client as Authority Dashboard (/authority)
    participant API as Express API
    participant DB as MongoDB
    participant Socket as Socket.IO Hub

    Auth->>Client: Logs in with credentials
    Client->>API: GET /api/grievances/assigned (Bearer JWT)
    API->>DB: Query Grievances where currentLevel == auth.hierarchyLevel AND department == auth.department
    DB-->>API: Return assigned tickets
    API-->>Client: 200 OK [ Array of Assigned Grievances ]
    Client->>Auth: Render Triage Queue with SLA countdowns & severity indicators
    
    Auth->>Client: Selects Grievance card to inspect details
    Client->>Auth: Opens Grievance Drawer (Category, Description, SLA Timer, Past Escalation Logs)
    
    alt Case A: Acknowledge Grievance
        Auth->>Client: Clicks "Mark In-Review"
        Client->>API: PATCH /api/grievances/:id/status { status: 'In-Review' }
        API->>DB: Update status = 'In-Review'
        API->>Socket: Emit 'grievance_updated' { id, status: 'In-Review' }
        API-->>Client: 200 OK
        Client->>Auth: Update badge to 'In-Review'
    else Case B: Resolve Grievance
        Auth->>Client: Clicks "Resolve Grievance", enters resolution remarks
        Client->>API: PATCH /api/grievances/:id/status { status: 'Resolved', remarks: "Action taken..." }
        API->>DB: Update status = 'Resolved', resolutionRemarks
        API->>Socket: Emit 'grievance_updated' { id, status: 'Resolved' }
        API-->>Client: 200 OK
        Client->>Auth: Remove from active queue / Move to resolved tab
    else Case C: Early Manual Escalation
        Auth->>Client: Clicks "Escalate Early", inputs mandatory justification
        Client->>API: PATCH /api/grievances/:id/escalate { reason: "Beyond department purview" }
        API->>DB: Fetch HierarchyConfig for next level
        API->>DB: Update Grievance currentLevel += 1, status = 'Escalated', new slaDeadline
        API->>DB: Insert EscalationLogs { grievanceId, fromLevel, toLevel, reason, timestamp }
        API->>Socket: Emit 'grievance_escalated' { id, newLevel }
        API-->>Client: 200 OK
        Client->>Auth: Remove from current authority queue with toast confirmation
    end
```

---

## 5. Administrator Flow

Administrators manage system-wide escalation hierarchies, calibrate category SLA windows, inspect operational telemetry, and handle breached terminal escalations.

```mermaid
sequenceDiagram
    autonumber
    actor Admin as System Administrator
    participant Client as Admin Dashboard (/admin)
    participant API as Express API
    participant DB as MongoDB

    Admin->>Client: Login with Admin credentials
    Client->>API: GET /api/admin/analytics (Bearer JWT)
    API->>DB: Run MongoDB aggregation pipeline (resolution times, escalation counts per dept, overdue list)
    DB-->>API: Aggregate metrics
    API-->>Client: 200 OK { metrics, overdueTickets, categoryStats }
    Client->>Admin: Render Analytics Cards, Department Heatmap, & Overdue Alerts
    
    Admin->>Client: Navigate to Hierarchy Configuration (/admin/hierarchy)
    Client->>API: GET /api/admin/hierarchy
    API->>DB: Fetch all HierarchyConfig documents
    DB-->>API: Return category hierarchies
    API-->>Client: 200 OK [ HierarchyConfig Array ]
    Client->>Admin: Render visual tier builder (Levels, Role Titles, SLA Hours)
    
    Admin->>Client: Edit Category SLA (e.g., Harassment Level 1 SLA changed from 48h to 24h)
    Admin->>Client: Click "Save Configuration"
    Client->>API: PUT /api/admin/hierarchy/Harassment { levels: [...] }
    API->>DB: Update HierarchyConfig for category
    DB-->>API: Configuration updated
    API-->>Client: 200 OK { message: "Hierarchy updated successfully" }
    Client->>Admin: Show success toast notification
```

---

## 6. Detailed Automatic Escalation Engine Flow

The automated escalation engine is the technical backbone of the system, guaranteeing that bureaucratic inaction automatically triggers higher-level oversight.

```mermaid
flowchart TD
    CronStart([Cron Job Triggered: Every N Minutes]) --> QueryExpired[Query DB: status IN ('Pending', 'In-Review') AND slaDeadline <= now()]
    QueryExpired --> RecordsFound{Grievances Found?}
    
    RecordsFound -->|No| CronEnd([End Cron Execution Cycle])
    RecordsFound -->|Yes| ForEach[Iterate Each Expired Grievance]
    
    ForEach --> FetchConfig[Fetch HierarchyConfig for Grievance Category]
    FetchConfig --> CheckNextLevel{Does Level = currentLevel + 1 Exist?}
    
    CheckNextLevel -->|Yes| CalculateNext[Read nextLevel.slaHours & roleTitle<br>Compute newDeadline = now + slaHours<br>newLevel = currentLevel + 1]
    CalculateNext --> AtomicUpdate[Atomic DB Update: Grievance<br>currentLevel = newLevel<br>status = 'Escalated'<br>slaDeadline = newDeadline]
    AtomicUpdate --> WriteAudit[Insert EscalationLog:<br>grievanceId, fromLevel, toLevel,<br>reason: 'SLA expired', timestamp]
    WriteAudit --> DispatchNotifs[1. Trigger Nodemailer to Level N+1 Authority<br>2. Emit Socket.IO 'grievance_escalated'<br>3. Send Email to Student if registered]
    DispatchNotifs --> NextRecord{More Records in Batch?}
    
    CheckNextLevel -->|No: Reached Top Tier| TopTierBreach[Atomic DB Update: Grievance<br>status = 'Overdue - Top Level']
    TopTierBreach --> WriteTopAudit[Insert EscalationLog:<br>reason: 'SLA expired at Top Tier - Escalation Cap Reached']
    TopTierBreach --> AdminAlert[1. Trigger High-Priority Admin Email<br>2. Emit Socket.IO 'admin_overdue_alert']
    AdminAlert --> NextRecord
    
    NextRecord -->|Yes| ForEach
    NextRecord -->|No| CronEnd
```

---

## 7. Grievance State Machine

A grievance progresses through a strictly defined finite state machine.

```mermaid
stateDiagram-v2
    [*] --> Pending : Grievance Submitted (Level 1, SLA Timer Activated)
    
    Pending --> In_Review : Authority opens/acknowledges grievance
    Pending --> Escalated : SLA expires at current level OR Authority escalates manually
    
    In_Review --> Resolved : Authority submits resolution remarks
    In_Review --> Escalated : SLA expires at current level OR Authority escalates manually
    
    Escalated --> In_Review : Higher-tier Authority opens/acknowledges grievance
    Escalated --> Escalated : SLA expires again (advances to next tier)
    Escalated --> Overdue_Top_Level : SLA expires at maximum configured hierarchy tier
    
    Overdue_Top_Level --> In_Review : Administrator intervenes & reassigns / investigates
    Overdue_Top_Level --> Resolved : Administrator / Ombudsperson forces resolution
    
    Resolved --> Closed : Complainant confirms resolution via token UI
    Resolved --> Closed : Auto-closed after 7 days in Resolved state
    
    Closed --> [*] : Terminal Archival State
```

### State Transition Rules:
| Current State | Target State | Trigger / Condition | Permitted Actors |
| :--- | :--- | :--- | :--- |
| `[*] (None)` | `Pending` | Complainant submits valid grievance form | Student / Complainant |
| `Pending` | `In-Review` | Assigned authority acknowledges the ticket | Assigned Authority |
| `Pending` | `Escalated` | `slaDeadline` expires OR Authority initiates early escalation | node-cron Engine / Assigned Authority |
| `In-Review` | `Resolved` | Authority submits formal resolution remarks | Assigned Authority |
| `In-Review` | `Escalated` | `slaDeadline` expires without resolution OR Manual escalation | node-cron Engine / Assigned Authority |
| `Escalated` | `In-Review` | Newly assigned senior authority acknowledges ticket | Senior Tier Authority |
| `Escalated` | `Overdue - Top Level` | SLA expires when `currentLevel` equals maximum hierarchy tier | node-cron Engine |
| `Overdue - Top Level`| `Resolved` | System Admin / Ombudsperson resolves emergency ticket | Administrator |
| `Resolved` | `Closed` | Student confirms resolution OR 7-day timeout expires | Complainant / System Auto-Worker |

---

## 8. Error, Boundary & Edge Case Flows

### 8.1 Invalid or Malformed Tracking Token
- **Condition:** User enters a non-existent UUID or corrupted string at `/track`.
- **System Behavior:** Backend returns `404 Not Found` with `{ success: false, error: "ERR_INVALID_TOKEN", message: "No grievance found matching this tracking token." }`.
- **UI UX:** Client displays a styled empty state card with guidance to check for typo or trailing whitespace.

### 8.2 Expired SLA During Concurrent Authority Action
- **Condition:** Authority attempts to click "Resolve" at the exact moment the `node-cron` job runs an auto-escalation.
- **System Behavior:** Handled via Mongoose atomic conditional updates (`findOneAndUpdate({ _id, currentLevel: req.user.hierarchyLevel, status: { $ne: 'Escalated' } })`). If the cron job escalated first, the authority update fails with `409 Conflict` (`"Grievance has already been escalated to Tier N+1"`).

### 8.3 No Next Hierarchy Level Configured
- **Condition:** An escalation occurs on a category whose `HierarchyConfig` lacks Level $N+1$.
- **System Behavior:** The system prevents incrementing out-of-bounds, transitions status immediately to `Overdue - Top Level`, logs the exception, and alerts the Administrator.

### 8.4 Unauthorized Authority Access Attempt
- **Condition:** An authority from the *Civil Engineering* department attempts to view or update a *Computer Science* departmental grievance.
- **System Behavior:** RBAC middleware verifies `req.user.department === grievance.department`. If mismatched, returns `403 Forbidden` (`"Access Denied: You are not authorized to triage grievances for this department."`).

### 8.5 Duplicate / Rapid Spam Submissions
- **Condition:** A student attempts to submit 50 grievances within 1 minute.
- **System Behavior:** Rate limiter middleware checks `submittedByHash` within an in-memory window. Rejections return `429 Too Many Requests` (`"Submission limit exceeded. Please wait 15 minutes before filing another grievance."`).

### 8.6 Notification / SMTP Delivery Failure
- **Condition:** Institutional SMTP server is unreachable or drops connection during escalation email dispatch.
- **System Behavior:** Email dispatch is wrapped in a `try/catch` non-blocking block. The escalation database transaction commits successfully; the error is logged to server logs without rolling back the state change.

### 8.7 Backend / Network Disconnection on Client
- **Condition:** User's network drops during status polling or socket event.
- **System Behavior:** Socket.IO client executes exponential backoff reconnection. REST API wrappers render an ambient "Offline / Reconnecting" banner.
