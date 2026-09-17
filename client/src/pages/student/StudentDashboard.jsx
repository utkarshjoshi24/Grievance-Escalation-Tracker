import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { grievances } = useGrievances();

  // Get grievances for this student (or anonymous ones submitted in session)
  const studentGrievances = grievances.filter(
    (g) => g.complainantId === user?.id || (!g.complainantId && g.isAnonymous) || g.complainantEmail === user?.email
  );

  const activeGrievances = studentGrievances.filter((g) => g.status !== 'Resolved' && g.status !== 'Closed');
  const resolvedGrievances = studentGrievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed');
  const escalatedGrievances = studentGrievances.filter((g) => g.status === 'Escalated' || g.status === 'Overdue - Top Level');
  const inReviewGrievances = studentGrievances.filter((g) => g.status === 'In-Review');

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Complainant Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 font-semibold">
              Student Complainant Portal
            </span>
            <span className="text-xs font-mono text-outline">{user?.rollNumber || '2023CS0142'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Welcome back, {user?.name || 'Aarav'}
          </h1>
          <p className="text-xs text-outline font-mono">
            {user?.department || 'Department of Computer Science & Engineering'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/track">
            <Button variant="secondary" size="md" icon="travel_explore">
              Track by UUID
            </Button>
          </Link>
          <Link to="/submit">
            <Button variant="primary" size="md" icon="add_circle">
              Lodge Grievance
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Metrics / StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Grievances"
          value={activeGrievances.length}
          subtitle="Awaiting resolution"
          icon="hourglass_top"
          iconColor="text-blue-400"
          iconBg="bg-blue-950/60 border-blue-500/30"
          accentBorder="blue"
        />
        <StatCard
          title="Under In-Review"
          value={inReviewGrievances.length}
          subtitle="Actively investigated"
          icon="search"
          iconColor="text-cyan-400"
          iconBg="bg-cyan-950/60 border-cyan-500/30"
        />
        <StatCard
          title="Auto-Escalated"
          value={escalatedGrievances.length}
          subtitle="Advanced to higher tier"
          icon="warning"
          iconColor="text-amber-400"
          iconBg="bg-amber-950/60 border-amber-500/30"
          accentBorder={escalatedGrievances.length > 0 ? 'amber' : null}
        />
        <StatCard
          title="Resolved Cases"
          value={resolvedGrievances.length}
          subtitle="Successfully closed"
          icon="check_circle"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-950/60 border-emerald-500/30"
          accentBorder="emerald"
        />
      </div>

      {/* 3. Fast Submit Callout Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-surface-container to-surface-container border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">enhanced_encryption</span>
            <h3 className="text-base font-bold text-on-surface">
              Need to lodge a confidential complaint?
            </h3>
          </div>
          <p className="text-xs text-outline max-w-2xl leading-relaxed">
            All grievances are protected by Zero-Knowledge Identity Shield. If the designated department doesn't act within 24–48 hours, the system automatically escalates your case to the HoD or Dean.
          </p>
        </div>
        <Link to="/submit" className="shrink-0">
          <Button variant="primary" size="md" icon="add_moderator">
            Submit New Grievance
          </Button>
        </Link>
      </div>

      {/* 4. Active Grievances & Live SLA Monitor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">crisis_alert</span>
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Active Grievance Queues & Live SLA
            </h2>
          </div>
          <Link to="/student/grievances" className="text-xs font-mono text-primary hover:underline flex items-center gap-1">
            <span>View All ({studentGrievances.length})</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {activeGrievances.length === 0 ? (
          <EmptyState
            icon="verified"
            title="No Active Grievances"
            description="You currently have no open grievances in the institutional queue."
            actionLabel="Lodge Grievance"
            onAction={() => {}}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrievances.map((g) => (
              <Card
                key={g.id}
                className="p-5 space-y-4 bg-surface-container border-white/[0.08] hover:border-white/20 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-primary">{g.token}</span>
                      <StatusBadge status={g.status} size="sm" />
                      {g.isAnonymous && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface line-clamp-1">
                      {g.title}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container-high text-outline shrink-0">
                    Tier {g.currentLevel}
                  </span>
                </div>

                {/* SLA Timer */}
                <SLACountdown
                  deadline={g.slaDeadline}
                  totalHours={g.slaHoursTotal || 48}
                  compact={false}
                />

                {/* Details Footer */}
                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
                  <div className="text-outline font-mono text-[11px] truncate max-w-[60%]">
                    Assigned: <span className="text-on-surface">{g.currentAuthorityTitle}</span>
                  </div>
                  <Link
                    to={`/student/grievances/${g.token}`}
                    className="text-xs font-mono font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 5. Recently Resolved Grievances */}
      {resolvedGrievances.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-lg">task_alt</span>
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Resolved Grievance History
            </h2>
          </div>

          <div className="space-y-3">
            {resolvedGrievances.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-surface-container-low border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-primary">{g.token}</span>
                    <StatusBadge status="Resolved" size="sm" />
                    <span className="text-xs text-outline font-mono">• {g.category}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-on-surface">{g.title}</h4>
                </div>
                <Link
                  to={`/student/grievances/${g.token}`}
                  className="text-xs font-mono text-primary hover:underline shrink-0 flex items-center gap-1"
                >
                  <span>View Resolution Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
