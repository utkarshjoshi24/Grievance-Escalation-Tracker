# Grievance Escalation Tracker — Technical Documentation Package

**Project Name:** Grievance Escalation Tracker  
**Tagline:** A Web-Based System for Time-Bound, Auto-Escalating Grievance Redressal  
**Architecture:** MERN Stack (MongoDB, Express.js, React Vite, Node.js) with Tailwind CSS, node-cron, Socket.IO, and Nodemailer  
**Document Suite Version:** 1.0.0  

---

## 1. Purpose of this Documentation Package

This documentation package provides the technical specifications, architectural blueprints, database schemas, API contracts, UI component designs, and phased implementation plans for the **Grievance Escalation Tracker**.

It has been authored to serve as a comprehensive, unambiguous, and production-ready implementation guide for an AI coding agent or development team to build, test, and deploy the entire system without guessing requirements or inventing arbitrary design patterns.

---

## 2. Documentation Index & Recommended Reading Order

To understand the system holistically, read the documents in the following order:

```text
docs/
├── README.md               # [Current File] Overview, index & source of truth hierarchy
├── PRD.md                  # 1. Product Requirements Document (Problem, Scope, Roles, Features, FRs/NFRs)
├── USER_FLOWS.md           # 2. System Interactions, State Machine & Escalation Engine Logic (Mermaid)
├── DATABASE_SCHEMA.md      # 3. MongoDB Collections, Mongoose Models, Indexes & ER Diagrams
├── API_SPEC.md             # 4. RESTful API Contracts, JWT Auth, Request/Response Schemas & Status Codes
├── UI_IMPLEMENTATION.md    # 5. React/Tailwind Specs, Stitch UI Design Tokens & Component Architecture
└── DEVELOPMENT_PLAN.md     # 6. Step-by-Step 9-Phase Development Roadmap & Deployment Guide
```

---

## 3. Source of Truth Hierarchy

When implementing the system, the following hierarchy of authority governs all design and architectural decisions:

1. **Primary Source of Truth:** Original Project File (`Grievance_Escalation_Tracker_Project_File.docx`) & Stitch UI (`stitch_grievance_escalation_tracker/`)
2. **Product Requirements:** [`docs/PRD.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/PRD.md)
3. **Behavioral & Interaction Flows:** [`docs/USER_FLOWS.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/USER_FLOWS.md)
4. **Data Layer & Schemas:** [`docs/DATABASE_SCHEMA.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/DATABASE_SCHEMA.md)
5. **API & Interface Contracts:** [`docs/API_SPEC.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/API_SPEC.md)
6. **Frontend & Styling:** [`docs/UI_IMPLEMENTATION.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/UI_IMPLEMENTATION.md)
7. **Execution Roadmap:** [`docs/DEVELOPMENT_PLAN.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/DEVELOPMENT_PLAN.md)

> [!IMPORTANT]
> **Conflict Resolution Rule:** If an apparent discrepancy is identified between any two documents, do NOT silently guess or override requirements. Flag the conflict explicitly for architectural clarification before writing application code.

---

## 4. Instructions for the Future AI Coding Agent

When you receive the command to build this application, execute the implementation following these non-negotiable instructions:

1. **Follow the Development Phases in Sequence:**
   - Execute Phase 1 through Phase 9 as defined in [`docs/DEVELOPMENT_PLAN.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/DEVELOPMENT_PLAN.md). Do not skip ahead or build frontend components before their backing models and API endpoints are established.
2. **Preserve Complete Anonymity by Design:**
   - Never attach student names, emails, or student IDs to authority-facing API responses or database documents.
   - Use SHA-256 hashes (`submittedByHash`) strictly for rate-limiting.
   - On the public tracking interface (`/track/:token`), display generic institutional role titles (e.g. *"Head of Department"*), never individual resolver names.
3. **Adhere to the Stitch Design System (GET Integrity System):**
   - Implement the dark-mode aesthetic using the exact tokens specified in [`docs/UI_IMPLEMENTATION.md`](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/UI_IMPLEMENTATION.md):
     - Backgrounds: `#050505`, `#0B0D10`, `#111418`
     - Accents: Electric Blue (`#3B82F6`), Amber (`#F59E0B`), Ruby Red (`#EF4444`), Emerald (`#10B981`)
     - Typography: `Geist` for body and UI; `JetBrains Mono` for IDs, tokens, badges, and SLA countdowns.
4. **Implement Atomic Escalations:**
   - In `server/jobs/escalationJob.js`, ensure the background cron job updates grievance statuses atomically to prevent race conditions with concurrent authority updates.
5. **No Speculative Feature Inventions:**
   - Do not add AI grievance classifiers, sentiment analysis, or complex ERP/SSO integrations unless marked as future scope.
