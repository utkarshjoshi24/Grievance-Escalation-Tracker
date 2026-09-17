import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import { MOCK_ANALYTICS } from '../../data/mockData';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { grievances } = useGrievances();

  const totalCount = grievances.length;
  const activeCount = grievances.filter((g) => g.status !== 'Resolved' && g.status !== 'Closed').length;
  const escalatedCount = grievances.filter((g) => g.status === 'Escalated' || g.status === 'Overdue - Top Level').length;
  const topOverdueCount = grievances.filter((g) => g.status === 'Overdue - Top Level').length;
  const resolvedCount = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length;

  const complianceRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 92;

  // Critical apex breaches (Tier 4 / Overdue)
  const criticalBreaches = grievances.filter(
    (g) => g.status === 'Overdue - Top Level' || g.currentLevel >= 4
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Ombudsman & Institutional Command Center Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 font-semibold">
              Apex Ombudsman Command Center
            </span>
            <span className="text-xs font-mono text-outline">System Integrity v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Institutional Oversight & SLA Compliance
          </h1>
          <p className="text-xs text-outline font-mono">
            Administrator: {user?.name || 'Prof. Vikram Malhotra'} • {user?.title || 'Director of Integrity'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/hierarchy">
            <Button variant="secondary" size="md" icon="account_tree">
              Configure Hierarchy
            </Button>
          </Link>
          <Link to="/admin/analytics">
            <Button variant="primary" size="md" icon="insights">
              SLA Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. StatCards Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Institutional Compliance"
          value={`${complianceRate}%`}
          subtitle="Within SLA target window"
          icon="verified"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-950/60 border-emerald-500/30"
          trend="+2.4% this month"
          trendPositive={true}
          accentBorder="emerald"
        />
        <StatCard
          title="Total Registered"
          value={totalCount}
          subtitle={`${activeCount} active in system`}
          icon="folder_open"
          iconColor="text-blue-400"
          iconBg="bg-blue-950/60 border-blue-500/30"
          accentBorder="blue"
        />
        <StatCard
          title="Auto-Escalated"
          value={escalatedCount}
          subtitle="Transferred across tiers"
          icon="warning"
          iconColor="text-amber-400"
          iconBg="bg-amber-950/60 border-amber-500/30"
          accentBorder={escalatedCount > 0 ? 'amber' : null}
        />
        <StatCard
          title="Apex Overdue (Tier 4)"
          value={topOverdueCount}
          subtitle="Vice Chancellor alert active"
          icon="error"
          iconColor="text-red-400"
          iconBg="bg-red-950/60 border-red-500/30"
          accentBorder={topOverdueCount > 0 ? 'red' : null}
        />
      </div>

      {/* 3. Top-Level Critical Overdue Alert Banner */}
      {topOverdueCount > 0 && (
        <Alert
          type="error"
          title="Apex Tier SLA Breach Warning"
          icon="report_problem"
        >
          There are <strong>{topOverdueCount} critical grievances</strong> currently overdue at the Vice Chancellor / Ombudsman apex level. Immediate administrative review and binding disposition is required.
        </Alert>
      )}

      {/* 4. Critical Breaches Section */}
      {criticalBreaches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-400 text-lg animate-pulse">
                emergency
              </span>
              <h2 className="text-base font-bold text-on-surface tracking-tight">
                Apex Tier Escalations & SLA Breaches
              </h2>
            </div>
            <span className="text-xs font-mono text-red-400">
              {criticalBreaches.length} Urgent Actions Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalBreaches.map((g) => (
              <Card
                key={g.id}
                className="p-5 bg-surface-container border-red-500/40 shadow-glow-ruby/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-red-400">{g.token}</span>
                      <StatusBadge status={g.status} size="sm" />
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high text-outline">
                        {g.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-on-surface">{g.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-red-400 px-2 py-1 rounded bg-red-950/80 border border-red-500/40 shrink-0">
                    Tier {g.currentLevel}
                  </span>
                </div>

                <p className="text-xs text-outline line-clamp-2">{g.description}</p>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-outline font-mono text-[11px]">
                    Authority: <strong className="text-on-surface">{g.currentAuthorityTitle}</strong>
                  </span>
                  <Link
                    to={`/admin/grievances/${g.token}`}
                    className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Ombudsman Override</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5. Department Performance & Workload Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">domain</span>
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Departmental Workload & SLA Compliance Table
            </h2>
          </div>
          <Link to="/admin/analytics" className="text-xs font-mono text-primary hover:underline">
            View Detailed Charts →
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-surface-container-low shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/60 border-b border-white/[0.06] text-outline font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Department / Facility</th>
                <th className="py-3.5 px-4">Active Cases</th>
                <th className="py-3.5 px-4">Avg Resolution Time</th>
                <th className="py-3.5 px-4">SLA Compliance Rate</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MOCK_ANALYTICS.departmentPerformance.map((dept, idx) => (
                <tr key={idx} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-on-surface">{dept.department}</td>
                  <td className="py-3.5 px-4 font-mono">{dept.active} cases</td>
                  <td className="py-3.5 px-4 font-mono">{dept.avgResolutionDays} days</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dept.complianceRate >= 90
                              ? 'bg-emerald-400'
                              : dept.complianceRate >= 80
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                          style={{ width: `${dept.complianceRate}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-bold">{dept.complianceRate}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        dept.complianceRate >= 90
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : dept.complianceRate >= 80
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          : 'bg-red-950 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {dept.complianceRate >= 90 ? 'Optimal' : dept.complianceRate >= 80 ? 'Monitored' : 'Breach Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Quick Universal Management Access */}
      <div className="p-6 rounded-2xl bg-surface-container border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-on-surface">Universal Grievance Repository</h3>
          <p className="text-xs text-outline">
            Review, override, and reassign all institutional grievances across all schools and tiers.
          </p>
        </div>
        <Link to="/admin/grievances">
          <Button variant="primary" size="md" icon="table_chart">
            Open Universal Grievance Registry
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
