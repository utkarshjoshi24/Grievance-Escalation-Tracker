import React from 'react';
import { MOCK_ANALYTICS } from '../../data/mockData';
import { useGrievances } from '../../context/GrievanceContext';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

export const AdminAnalyticsPage = () => {
  const { grievances } = useGrievances();

  const totalGrievances = grievances.length;
  const resolved = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length;
  const active = totalGrievances - resolved;
  const compliance = totalGrievances > 0 ? Math.round((resolved / totalGrievances) * 100) : 88;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Institutional SLA & Redressal Analytics
          </h1>
          <p className="text-xs text-outline font-mono mt-0.5">
            System-wide performance metrics, category distribution, and bottleneck diagnostics
          </p>
        </div>

        <Button variant="secondary" size="sm" icon="print" onClick={() => window.print()}>
          Print Compliance Report
        </Button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall SLA Compliance"
          value={`${compliance}%`}
          subtitle="Institutional standard >85%"
          icon="check_circle"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-950/60 border-emerald-500/30"
          accentBorder="emerald"
        />
        <StatCard
          title="Avg Resolution Time"
          value="36.2h"
          subtitle="Target threshold 48.0h"
          icon="timer"
          iconColor="text-blue-400"
          iconBg="bg-blue-950/60 border-blue-500/30"
          accentBorder="blue"
        />
        <StatCard
          title="Active Open Cases"
          value={active}
          subtitle={`${totalGrievances} lifetime submissions`}
          icon="hourglass_top"
          iconColor="text-amber-400"
          iconBg="bg-amber-950/60 border-amber-500/30"
        />
        <StatCard
          title="Auto-Escalation Rate"
          value="6.1%"
          subtitle="Cases requiring tier bypass"
          icon="warning"
          iconColor="text-purple-400"
          iconBg="bg-purple-950/60 border-purple-500/30"
        />
      </div>

      {/* Category Performance Breakdown */}
      <Card className="p-6 bg-surface-container border-white/[0.08] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-on-surface">
              Grievance Volume & Resolution by Category
            </h3>
            <p className="text-xs text-outline">
              Historical breakdown of complaints submitted across university departments
            </p>
          </div>
          <span className="text-xs font-mono text-outline">6 Categories Active</span>
        </div>

        <div className="space-y-4">
          {MOCK_ANALYTICS.categoryBreakdown.map((cat) => {
            const pct = Math.round((cat.resolved / cat.total) * 100);
            return (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">{cat.category}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-outline">{cat.resolved} / {cat.total} resolved</span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-emerald-400 h-full rounded-l-full transition-all duration-500"
                    style={{ width: `${(cat.resolved / cat.total) * 100}%` }}
                    title={`Resolved: ${cat.resolved}`}
                  />
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${(cat.active / cat.total) * 100}%` }}
                    title={`Active: ${cat.active}`}
                  />
                  {cat.breached > 0 && (
                    <div
                      className="bg-red-500 h-full rounded-r-full transition-all duration-500"
                      style={{ width: `${(cat.breached / cat.total) * 100}%` }}
                      title={`Breached: ${cat.breached}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-6 pt-2 text-xs font-mono text-outline border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span>Resolved within SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>In-Review Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>SLA Breached / Escalated</span>
          </div>
        </div>
      </Card>

      {/* Monthly Intake vs Resolution Trend */}
      <Card className="p-6 bg-surface-container border-white/[0.08] space-y-4">
        <h3 className="text-base font-semibold text-on-surface">
          Monthly Submission vs. Redressal Trend
        </h3>
        <div className="grid grid-cols-6 gap-3 pt-4">
          {MOCK_ANALYTICS.monthlyTrend.map((m) => (
            <div key={m.month} className="text-center space-y-2">
              <div className="h-32 bg-surface-container-high/60 rounded-xl p-2 flex items-end justify-center gap-2">
                <div
                  className="w-3 sm:w-5 bg-blue-500/80 rounded-t-md transition-all duration-500"
                  style={{ height: `${(m.submitted / 45) * 100}%` }}
                  title={`Submitted: ${m.submitted}`}
                />
                <div
                  className="w-3 sm:w-5 bg-emerald-400 rounded-t-md transition-all duration-500"
                  style={{ height: `${(m.resolved / 45) * 100}%` }}
                  title={`Resolved: ${m.resolved}`}
                />
              </div>
              <span className="text-xs font-mono text-outline block">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
