import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import { CATEGORIES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export const StudentGrievancesPage = () => {
  const { user } = useAuth();
  const { grievances } = useGrievances();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const studentGrievances = grievances.filter(
    (g) => g.complainantId === user?.id || (!g.complainantId && g.isAnonymous) || g.complainantEmail === user?.email
  );

  const filteredGrievances = studentGrievances.filter((g) => {
    const matchCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || g.status === selectedStatus;
    const matchSearch =
      !searchQuery.trim() ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            My Submitted Grievances
          </h1>
          <p className="text-xs text-outline font-mono mt-0.5">
            Total {studentGrievances.length} tickets recorded in institutional registry
          </p>
        </div>

        <Link to="/submit">
          <Button variant="primary" size="md" icon="add_circle">
            Submit Grievance
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-surface-container border-white/[0.08] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Title, Token, or Keywords..."
              className="w-full bg-surface-container-high border border-outline-variant/60 focus:border-primary text-xs text-on-surface placeholder:text-outline/60 rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In-Review">In-Review</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
            <option value="Overdue - Top Level">Overdue - Top Level</option>
          </select>
        </div>
      </Card>

      {/* Grievances List */}
      {filteredGrievances.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No Grievances Found"
          description="Try clearing your filters or search keywords."
          actionLabel="Submit Grievance"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-3">
          {filteredGrievances.map((g) => (
            <Card
              key={g.id}
              className="p-5 bg-surface-container-low border-white/[0.08] hover:border-white/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary">{g.token}</span>
                    <StatusBadge status={g.status} size="sm" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                      {g.category}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/20">
                      Tier {g.currentLevel} ({g.currentAuthorityTitle})
                    </span>
                    {g.isAnonymous && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                        Shielded Anonymous
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-on-surface">{g.title}</h3>

                  <p className="text-xs text-outline line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-outline pt-1">
                    <span>Submitted: {new Date(g.createdAt).toLocaleDateString()}</span>
                    <span>Department: {g.department}</span>
                    <span>Milestones: {g.timeline?.length || 0}</span>
                  </div>
                </div>

                {/* Right Action & SLA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.04]">
                  {g.status !== 'Resolved' && g.status !== 'Closed' && (
                    <SLACountdown
                      deadline={g.slaDeadline}
                      totalHours={g.slaHoursTotal || 48}
                      compact={true}
                    />
                  )}

                  <Link to={`/student/grievances/${g.token}`}>
                    <Button variant="secondary" size="sm" icon="arrow_forward" iconPosition="right">
                      Inspect Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentGrievancesPage;
