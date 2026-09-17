import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGrievances } from '../../context/GrievanceContext';
import { CATEGORIES } from '../../utils/constants';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';

export const AdminGrievancesPage = () => {
  const { grievances, updateGrievanceStatus, escalateGrievance } = useGrievances();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [targetGrievance, setTargetGrievance] = useState(null);
  const [overrideStatus, setOverrideStatus] = useState('Resolved');
  const [overrideRemarks, setOverrideRemarks] = useState('');

  const filteredGrievances = grievances.filter((g) => {
    const matchCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || g.status === selectedStatus;
    const matchSearch =
      !searchQuery.trim() ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchStatus && matchSearch;
  });

  const handleOpenOverride = (g) => {
    setTargetGrievance(g);
    setOverrideStatus(g.status === 'Resolved' ? 'Closed' : 'Resolved');
    setOverrideRemarks(g.resolutionNotes || '');
    setOverrideModalOpen(true);
  };

  const handleSaveOverride = () => {
    if (targetGrievance) {
      updateGrievanceStatus(targetGrievance.id, overrideStatus, `[Ombudsman Override] ${overrideRemarks}`);
      setOverrideModalOpen(false);
      setTargetGrievance(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Token', 'Title', 'Category', 'Department', 'Status', 'CurrentLevel', 'Complainant', 'CreatedAt'];
    const rows = filteredGrievances.map((g) => [
      g.token,
      `"${g.title.replace(/"/g, '""')}"`,
      g.category,
      `"${g.department}"`,
      g.status,
      `Tier ${g.currentLevel}`,
      g.isAnonymous ? 'Protected Anonymous' : `"${g.complainantName}"`,
      g.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GET_Grievance_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Universal Grievance Repository
          </h1>
          <p className="text-xs text-outline font-mono mt-0.5">
            Apex administrative oversight • {grievances.length} total records across all university departments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" icon="download" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Link to="/submit">
            <Button variant="primary" size="sm" icon="add_circle">
              Create Ticket
            </Button>
          </Link>
        </div>
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
              placeholder="Search across all institutional records..."
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

      {/* Table */}
      {filteredGrievances.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No Matching Grievances Found"
          description="Try broadening your search query or reset filter dropdowns."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-surface-container-low shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/60 border-b border-white/[0.06] text-outline font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Token & Title</th>
                <th className="py-3.5 px-4">Category & Dept</th>
                <th className="py-3.5 px-4">Current Authority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Live SLA</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredGrievances.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-surface-container/60 transition-colors group"
                >
                  {/* Token & Title */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{g.token}</span>
                        {g.isAnonymous && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
                            Anonymous
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/admin/grievances/${g.token}`}
                        className="font-medium text-on-surface hover:text-primary transition-colors block line-clamp-1"
                      >
                        {g.title}
                      </Link>
                    </div>
                  </td>

                  {/* Category & Dept */}
                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className="font-mono text-on-surface-variant font-medium text-[11px]">
                        {g.category}
                      </span>
                      <p className="text-[11px] text-outline truncate max-w-[160px]">
                        {g.department}
                      </p>
                    </div>
                  </td>

                  {/* Current Authority */}
                  <td className="py-4 px-4 font-mono text-[11px]">
                    <span className="text-on-surface block font-medium">
                      Tier {g.currentLevel}: {g.currentAuthorityTitle}
                    </span>
                    <span className="text-outline text-[10px]">
                      {g.currentAuthorityName || 'Designated Resolver'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <StatusBadge status={g.status} size="sm" />
                  </td>

                  {/* SLA Countdown */}
                  <td className="py-4 px-4">
                    {g.status !== 'Resolved' && g.status !== 'Closed' ? (
                      <SLACountdown
                        deadline={g.slaDeadline}
                        totalHours={g.slaHoursTotal || 48}
                        compact={true}
                      />
                    ) : (
                      <span className="text-emerald-400 font-mono text-[11px]">
                        Closed / Resolved
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenOverride(g)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-purple-300 text-[11px] font-mono border border-purple-500/30 transition-colors"
                        title="Ombudsman Override"
                      >
                        Override
                      </button>

                      <Link
                        to={`/admin/grievances/${g.token}`}
                        className="p-1 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
                        title="Full Record"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ombudsman Override Modal */}
      {overrideModalOpen && targetGrievance && (
        <Modal
          isOpen={overrideModalOpen}
          onClose={() => setOverrideModalOpen(false)}
          title={`Ombudsman Override: ${targetGrievance.token}`}
          subtitle="Administrative override with binding executive authority."
          footer={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setOverrideModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon="gavel" onClick={handleSaveOverride}>
                Apply Executive Override
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/[0.04]">
              <h4 className="text-xs font-semibold text-on-surface">{targetGrievance.title}</h4>
              <p className="text-[11px] text-outline mt-0.5">
                Current Level: Tier {targetGrievance.currentLevel} ({targetGrievance.currentAuthorityTitle})
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                Forced Override Status
              </label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="In-Review">Force In-Review</option>
                <option value="Escalated">Force Escalation</option>
                <option value="Resolved">Force Mark Resolved</option>
                <option value="Closed">Executive Closure</option>
              </select>
            </div>

            <Textarea
              label="Binding Administrative Findings / Reason for Override"
              rows={4}
              placeholder="Record the official executive rationale, tribunal ruling, disciplinary measures, or policy exceptions..."
              value={overrideRemarks}
              onChange={(e) => setOverrideRemarks(e.target.value)}
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminGrievancesPage;
