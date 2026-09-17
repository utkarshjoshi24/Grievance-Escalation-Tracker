// Centralized Status Configuration & App Constants

export const STATUS_CONFIG = {
  'Pending': {
    label: 'Pending',
    color: 'text-slate-400',
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/60',
    dot: 'bg-slate-400',
    icon: 'hourglass_empty',
    badgeClass: 'status-badge-pending',
    description: 'Awaiting acknowledgment by the assigned authority',
  },
  'In-Review': {
    label: 'In-Review',
    color: 'text-blue-400',
    bg: 'bg-blue-950/40',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    icon: 'search',
    badgeClass: 'status-badge-inreview',
    description: 'Under active investigation and redressal',
  },
  'Escalated': {
    label: 'Escalated',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
    icon: 'warning',
    badgeClass: 'status-badge-escalated',
    description: 'Transferred to higher administrative tier due to SLA breach',
  },
  'Resolved': {
    label: 'Resolved',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: 'check_circle',
    badgeClass: 'status-badge-resolved',
    description: 'Grievance addressed and marked resolved by authority',
  },
  'Closed': {
    label: 'Closed',
    color: 'text-zinc-400',
    bg: 'bg-zinc-800/40',
    border: 'border-zinc-700/60',
    dot: 'bg-zinc-400',
    icon: 'task_alt',
    badgeClass: 'status-badge-closed',
    description: 'Redressal finalized and closed',
  },
  'Overdue - Top Level': {
    label: 'Overdue - Top Level',
    color: 'text-red-400',
    bg: 'bg-red-950/50',
    border: 'border-red-500/50',
    dot: 'bg-red-500 animate-ping',
    icon: 'error',
    badgeClass: 'status-badge-overdue',
    description: 'Critical SLA breach at the highest administrative authority',
  },
};

export const SLA_STATES = {
  HEALTHY: {
    label: 'Within SLA',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-500/30',
    icon: 'check_circle',
  },
  DUE_SOON: {
    label: 'Due Soon',
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-500/30',
    icon: 'schedule',
  },
  EXPIRED: {
    label: 'SLA Breached',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-500/40',
    icon: 'report_problem',
  },
};

export const CATEGORIES = [
  'Academic',
  'Hostel',
  'Harassment',
  'Infrastructure',
  'Faculty Conduct',
  'Other',
];

export const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low Priority', color: 'text-slate-400', bg: 'bg-slate-800' },
  { value: 'MEDIUM', label: 'Medium Priority', color: 'text-blue-400', bg: 'bg-blue-900/30' },
  { value: 'HIGH', label: 'High Priority', color: 'text-amber-400', bg: 'bg-amber-900/30' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-400', bg: 'bg-red-900/40' },
];

export const USER_ROLES = {
  STUDENT: 'student',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
};

export const DEFAULT_HIERARCHY_LEVELS = [
  { level: 1, title: 'Department Representative / Grievance Officer', defaultSlaHours: 48 },
  { level: 2, title: 'Head of Department (HoD)', defaultSlaHours: 48 },
  { level: 3, title: 'Dean of Student Welfare / Academic Dean', defaultSlaHours: 72 },
  { level: 4, title: 'Vice Chancellor / Ombudsman', defaultSlaHours: 96 },
];
