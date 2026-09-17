# Frontend & UI Implementation Specification

**Project Name:** Grievance Escalation Tracker  
**Document Version:** 1.0.0  
**Frontend Framework:** React 18+ (Vite)  
**Styling Framework:** Tailwind CSS (configured with Stitch Design System)  
**Design Reference:** Google Stitch (`stitch_grievance_escalation_tracker/`)  
**Status:** Approved for Implementation  
**Reference Documents:** [PRD.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/PRD.md), [USER_FLOWS.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/USER_FLOWS.md), [API_SPEC.md](file:///Users/utkarshjoshi/Desktop/Utkarsh%20Joshi/Grievance%20Escalation%20Tracker/docs/API_SPEC.md)

---

## 1. Design System & Tokens (Google Stitch Spec)

The user interface follows the **GET Integrity System** design tokens established in the Stitch UI exports, delivering a high-precision, dark-mode institutional console aesthetic reminiscent of developer-grade platforms like Linear and Vercel.

### 1.1 Color Palette

```
Canvas Base:           #050505
Surface Level 1:       #0B0D10 (Sidebars, structural panels)
Surface Level 2:       #111418 (Cards, table rows, modules)
Surface Level 3:       #161A20 (Modals, popovers, dropdowns)
Surface High:          #1D2024 / #272A2E

Borders & Hairlines:
  Base Border:         #22272E (1px continuous hairline)
  Hover/Focus Border:  #2D333B
  Active/Selected:     #3B82F6

Accents & Functional Status:
  Primary Electric:    #3B82F6 (Hover scaling to Cyan #00D2FF)
  Secondary Accent:    #A078FF / #D0BCFF (Tertiary violet)
  Pending (Slate):     #64748B (Bg: rgba(30, 41, 59, 0.20), Border: #334155)
  In-Review (Blue):    #3B82F6 (Bg: rgba(29, 78, 216, 0.15), Border: rgba(37, 99, 235, 0.40))
  Escalated (Amber):   #F59E0B (Bg: rgba(180, 83, 9, 0.15), Border: rgba(217, 119, 6, 0.40))
  Resolved (Emerald):  #10B981 (Bg: rgba(4, 120, 87, 0.15), Border: rgba(5, 150, 105, 0.40))
  Overdue (Ruby Red):  #EF4444 (Bg: rgba(185, 28, 28, 0.20), Border: rgba(220, 38, 38, 0.50), Pulsing Halo)

Typography Colors:
  Primary Text:        #EDEDED / #FFFFFF
  Secondary Text:      #8B949E
  Muted Annotations:   #6E7681 / #484F58
```

### 1.2 Typography Hierarchy
- **Primary Body & UI Font:** `Geist`, `Inter`, or system sans-serif.
- **Monospace Font (Strictly Enforced for Grievance IDs, UUID Tokens, SLA Timers, and Badges):** `JetBrains Mono`.

| Token | Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | Geist | 36px | 600 (Semibold) | 44px | -0.025em |
| `headline-lg` | Geist | 28px | 600 (Semibold) | 36px | -0.02em |
| `headline-md` | Geist | 20px | 500 (Medium) | 28px | -0.015em |
| `headline-sm` | Geist | 16px | 500 (Medium) | 24px | -0.01em |
| `body-lg` | Geist | 16px | 400 (Regular) | 26px | -0.005em |
| `body-md` | Geist | 14px | 400 (Regular) | 22px | 0em |
| `body-sm` | Geist | 13px | 400 (Regular) | 18px | 0em |
| `label-md` | JetBrains Mono | 12px | 500 (Medium) | 16px | +0.02em |
| `label-sm` | JetBrains Mono | 11px | 500 (Medium) | 14px | +0.04em |
| `data-mono` | JetBrains Mono | 13px | 400 (Regular) | 18px | -0.01em |

### 1.3 Tailwind Config Blueprint (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#050505',
        surface: {
          1: '#0B0D10',
          2: '#111418',
          3: '#161A20',
          high: '#1D2024',
          highest: '#272A2E'
        },
        hairline: {
          base: '#22272E',
          active: '#2D333B'
        },
        electric: {
          DEFAULT: '#3B82F6',
          cyan: '#00D2FF',
          dark: '#1D4ED8'
        },
        status: {
          pending: '#64748B',
          inreview: '#3B82F6',
          escalated: '#F59E0B',
          resolved: '#10B981',
          overdue: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'inner-keylight': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-electric': '0 0 14px -1px rgba(59, 130, 246, 0.35)',
        'glow-amber': '0 0 12px -2px rgba(245, 158, 11, 0.30)',
        'glow-ruby': '0 0 16px -2px rgba(239, 68, 68, 0.40)'
      }
    }
  },
  plugins: []
};
```

---

## 2. Screen & Page Catalog

| # | Page / Screen | Stitch Source Directory | Route Path | Access Clearance | Description & UI Features |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Landing Page** | `public_landing_page/` | `/` | Public | Hero headline, live tracking token input search bar, feature pillars (Anonymity, SLA Timer, Auto-Escalation), role login buttons. |
| **2** | **Login** | `Design Pending / Implementation Decision` | `/login` | Public | High-contrast dark card modal with email, password, role toggle, and mock demo account credentials. |
| **3** | **Register** | `Design Pending / Implementation Decision` | `/register` | Public | Account creation form supporting student and authority registrations. |
| **4** | **Student Dashboard** | `student_dashboard/` | `/student` | `student` | Recent submissions list, active SLA countdowns, copy token button, "Submit Grievance" primary CTA. |
| **5** | **Submit Grievance** | `submit_grievance_page/` | `/submit` | `student`, `admin` | Category picker cards (Academic, Hostel, Harassment, etc.), department selector, rich text description area, anonymity pledge shield. |
| **6** | **Submission Success Modal** | `submit_grievance_page/` | Modal on `/submit` | `student` | High-security card presenting UUID token with single-click clipboard copy and urgent backup warning. |
| **7** | **Public Track Grievance** | `public_track_grievance/` | `/track/:token` | Public | Token lookup bar, dynamic status badge, live countdown timer, generic authority title pill, vertical audit timeline stepper. |
| **8** | **Authority Dashboard** | `authority_dashboard/` | `/authority` | `authority` | Triage queue filtered by current tier/dept, critical SLA breach warnings, quick filter pills, search bar. |
| **9** | **Authority Grievance Detail** | `authority_dashboard/` | Drawer / Modal | `authority` | Complete complaint narrative, historical timeline, action buttons ("Mark In-Review", "Resolve Grievance", "Escalate Early"). |
| **10** | **Admin Dashboard** | `admin_dashboard/` | `/admin` | `admin` | Global telemetry cards (Total, In-Review, Escalated, Overdue), department escalation breakdown, overdue emergency table. |
| **11** | **Hierarchy Configuration** | `hierarchy_configuration/` | `/admin/hierarchy` | `admin` | Category selector, drag/reorderable tier builder, role title editor, SLA hour inputs with live validation. |
| **12** | **Admin Analytics** | `admin_dashboard/` | `/admin/analytics` | `admin` | Mean resolution time chart, departmental breach heatmaps, category volume distribution. |
| **13** | **Notifications Center** | `Design Pending / Implementation Decision` | Modal / `/notifications` | Authenticated | Live Socket.IO notification feed for assignments, escalations, and resolutions. |
| **14** | **Settings / Profile** | `Design Pending / Implementation Decision` | `/settings` | Authenticated | User details, password change, and demo SLA mode toggle (Admin only). |

---

## 3. Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx           # Main wrapper with Sidebar + Topbar
│   │   ├── Navbar.jsx              # Brand logo, global search, user profile menu
│   │   ├── Sidebar.jsx             # Collapsible rail (64px mini / 260px expanded)
│   │   └── PublicLayout.jsx        # Lightweight header + footer for public views
│   ├── common/
│   │   ├── Button.jsx              # Primary (Electric), Secondary (Hairline), Destructive (Ruby)
│   │   ├── Input.jsx               # Dark input with focus glow ring
│   │   ├── Select.jsx              # Custom styled dark dropdown
│   │   ├── StatusBadge.jsx         # Compact JetBrains Mono badge with pulsing status dot
│   │   ├── SLACountdown.jsx        # Real-time ticking countdown clock with dynamic color states
│   │   ├── StatCard.jsx            # Metric summary card with sub-pixel top inner keylight
│   │   ├── Modal.jsx               # Floating dialog with backdrop blur
│   │   ├── Drawer.jsx              # Slide-over triage inspector panel
│   │   ├── Toast.jsx               # Ambient toast alert container
│   │   ├── EmptyState.jsx          # Illustrated empty state container
│   │   ├── LoadingSpinner.jsx      # Glowing electric circular loader
│   │   └── AnonymityCapsule.jsx    # "Cryptographically Protected" identity shield pill
│   ├── grievance/
│   │   ├── GrievanceCard.jsx       # Triage board card unit
│   │   ├── GrievanceTable.jsx      # High-density data table with sort/filter
│   │   ├── CategoryPicker.jsx      # 6-grid selection cards with custom iconography
│   │   ├── TimelineStepper.jsx     # Vertical hairline audit timeline with node rings
│   │   ├── TrackingTokenCard.jsx   # Copyable UUID token box with security disclaimer
│   │   └── ManualEscalateModal.jsx # Mandatory justification input dialog
│   └── hierarchy/
│       ├── TierCard.jsx            # Hierarchy tier block (Level, Title, SLA hours)
│       └── HierarchyBuilder.jsx    # Visual ladder editor for categories
```

---

## 4. Frontend Route Hierarchy & Route Guards

```javascript
// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import TrackPage from '../pages/public/TrackPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import SubmitGrievancePage from '../pages/student/SubmitGrievancePage';

// Authority Pages
import AuthorityDashboard from '../pages/authority/AuthorityDashboard';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import HierarchyConfigPage from '../pages/admin/HierarchyConfigPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/track" element={<TrackPage />} />
      <Route path="/track/:token" element={<TrackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/submit" element={<SubmitGrievancePage />} />
      </Route>

      {/* Authority Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['authority', 'admin']} />}>
        <Route path="/authority" element={<AuthorityDashboard />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/hierarchy" element={<HierarchyConfigPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

---

## 5. State Management & API Integration Layer

### 5.1 Auth Context (`AuthContext.jsx`)
- Manages `user`, `token`, `role`, `isAuthenticated`, `login(credentials)`, and `logout()`.
- Persists JWT in `localStorage` (`get_auth_token`).

### 5.2 Socket Context (`SocketContext.jsx`)
- Establishes persistent WebSocket link via `socket.io-client`.
- Listens for global events:
  - `grievance_updated`: Updates assigned queue and active detail drawers.
  - `grievance_escalated`: Emits audio/visual ping on authority queues and updates timeline.
  - `admin_overdue_alert`: Triggers high-priority pulse in admin navbar.

### 5.3 Axios API Client (`src/api/client.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('get_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data?.error || { message: 'Network connection error' })
);

export default api;
```

---

## 6. Privacy & Anonymity UX Requirements

1. **Authority View Anonymization:**
   - The authority triage board and detail drawer must **never** render student names, emails, avatars, or roll numbers.
   - Student info is replaced with a stylized `AnonymityCapsule` badge: `Protected Whistleblower (SHA-256 Verified)`.

2. **Public Tracking Generalization:**
   - Complainants inspecting `/track/:token` must see generic institutional titles (e.g., *"Assigned to: Head of Department (HOD)"*).
   - Personal names, phone numbers, or individual email addresses of resolving authorities must **never** appear in the DOM or network responses.

---

## 7. Responsive Behavior & Breakpoints

- **Mobile Viewport ($< 768\text{px}$):**
  - Collapses sidebar into a bottom navigation bar or hamburger flyout.
  - Triage boards collapse from grid/table into single-column stacked cards.
  - Sticky bottom action bar for authority status actions ("Resolve", "Escalate").
- **Tablet Viewport ($768\text{px} - 1024\text{px}$):**
  - Dual-pane layout (left triage list 40%, right detail drawer 60%).
- **Desktop Viewport ($> 1024\text{px}$):**
  - Full 3-column institutional layout (260px navigation, central triage board, 480px docked timeline and evidence inspector).

---

## 8. Accessibility & Interactive States

- **Keyboard Traversal:** All action buttons, category cards, and modal triggers support `Tab` cycling and `Enter`/`Space` activation.
- **Focus Indicators:** Active focus states replace browser defaults with a 1px `#3B82F6` border and a soft glow ring (`box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2)`).
- **Zero CLS / Skeleton Loaders:** All tables and stat cards render dark pulsing skeleton placeholders during initial fetch to eliminate Cumulative Layout Shift.
