# Grievance Escalation Tracker (GET) — Frontend

> **GET Integrity System**: A production-grade, dark-mode institutional grievance redressal frontend built with **React**, **Vite**, **Tailwind CSS**, and **React Router**, faithfully matching the **Google Stitch GET Design System**.

---

## 🌟 Key Features

1. **Faithful Stitch Visual Fidelity**:
   - Deep canvas & surface tier palette (`#050505`, `#0b0d10`, `#111418`, `#1d2024`, `#272a2e`).
   - Hairline borders (`#22272e`), inner-keylight highlights, and subtle glow states.
   - Typography powered by **Geist** and **JetBrains Mono** with Material Symbols.

2. **Zero-Knowledge Student Confidentiality**:
   - Students can lodge anonymous grievances where student profile metadata is stripped.
   - Public tracking securely displays official authority titles (e.g., *Head of Department*) without exposing personal identities.

3. **Strict Time-Bound SLA Countdown Engine**:
   - Real-time ticking timers calculating remaining SLA hours/minutes.
   - Color-coded progress thresholds: **Within SLA** (Emerald), **Due Soon** (Amber, <6h), and **SLA Breached** (Ruby Red).

4. **Multi-Role Experience & Built-in Role Switcher**:
   - **Student / Complainant**: Dashboard, Active SLA Timers, Ticket Submission, Tracking via UUID/Token, Notifications.
   - **Authority / Resolver**: Assigned Queue, SLA Warnings, In-Review Status Updates, Resolution Findings, Manual Escalation.
   - **Ombudsman / Admin**: Institutional Health Metrics, Apex Breaches (Tier 4 Overdue), Category Hierarchy Rulebook Config, Universal Grievance Repository with CSV Export, SLA Analytics.
   - **Floating Role Switcher**: Instant one-click toggle in the bottom right corner between Student, HoD, and Admin personas.

5. **API-Ready Service Layer**:
   - Centralized Axios client (`src/services/api.js`) referencing `VITE_API_BASE_URL`.
   - Ready for plug-and-play backend connection without UI refactoring.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will start on **http://localhost:5173**.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Application Routes

### Public Pages
- `/` — Public Landing Page (Hero, Live Case Simulator, Hierarchy Pillars, FAQ)
- `/track` & `/track/:token` — Public Grievance Tracker with Live SLA and Lifecycle Timeline
- `/submit` — Confidential Grievance Submission with Token Generator Modal
- `/login` — Institutional Sign In with 1-Click Demo Personas
- `/register` — Student Enrollment Form

### Student Portal (`/student`)
- `/student` — Student Dashboard (Active SLA trackers, quick actions)
- `/student/grievances` — My Submitted Grievances (Filters & Search)
- `/student/grievances/:id` — Detailed View (Evidence, Timeline, Resolution Report)
- `/student/notifications` — Student Status Alerts

### Authority Portal (`/authority`)
- `/authority` — Authority Dashboard (Triage queue, SLA warnings)
- `/authority/grievances` — Assigned Resolution Queue
- `/authority/grievances/:id` — Authority Action Panel (Status update, resolution notes, manual escalation)
- `/authority/notifications` — Impending Breach Warnings

### Admin / Ombudsman Portal (`/admin`)
- `/admin` — Apex Command Center (SLA compliance, department workload, apex breaches)
- `/admin/grievances` — Universal Grievance Registry (Override status, CSV export)
- `/admin/hierarchy` — Category Escalation Hierarchy Configuration (Tier 1 to 4 editor)
- `/admin/analytics` — SLA Compliance Analytics & Category Distribution
- `/admin/notifications` — System Health & Apex Breach Alerts
- `/admin/settings` — SLA Engine Parameters & Factory Demo Data Reset

---

## 🧪 Demo Personas & Fast Testing

You can switch personas at any time using the **floating widget** in the bottom-right corner or the 1-click buttons on `/login`:

| Role | Persona Name | Designation / Context |
| :--- | :--- | :--- |
| **Student** | Aarav Sharma | CSE 4th Year Student |
| **Authority** | Dr. Radhika Sen | Head of Department (Tier 2 Resolver) |
| **Admin** | Prof. Vikram Malhotra | Director of Institutional Integrity & Ombudsman |

Demo tracking tokens:
- `GET-2026-8941` (Academic • Tier 2 In-Review)
- `GET-2026-4820` (Hostel • Anonymous • Tier 2 Escalated)
- `GET-2026-9032` (Faculty Conduct • Anonymous • Tier 4 Overdue Top Level)
- `GET-2026-1193` (Infrastructure • Resolved)
