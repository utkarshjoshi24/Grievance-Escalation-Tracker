import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

export const AuthorityDashboard = () => {
  const { user } = useAuth();
  const { grievances, updateGrievanceStatus, escalateGrievance } = useGrievances();
  const navigate = useNavigate();

  // Selected grievance for fast status update modal
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('In-Review');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  // Assigned grievances (matching department or authority categories)
  const assignedGrievances = grievances.filter(
    (g) =>
      g.currentLevel === (user?.tierLevel || 2) ||
      g.department?.toLowerCase().includes('computer') ||
      g.currentAuthorityTitle?.toLowerCase().includes('head') ||
      g.status !== 'Closed'
  );

  const pendingCount = assignedGrievances.filter((g) => g.status === 'Pending').length;
  const inReviewCount = assignedGrievances.filter((g) => g.status === 'In-Review').length;
  const escalatedCount = assignedGrievances.filter((g) => g.status === 'Escalated' || g.status === 'Overdue - Top Level').length;
  const resolvedCount = assignedGrievances.filter((g) => g.status === 'Resolved').length;

  const handleOpenStatusModal = (g) => {
    setSelectedGrievance(g);
    setNewStatus(g.status === 'Pending' ? 'In-Review' : 'Resolved');
    setResolutionNotes(g.resolutionNotes || '');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = () => {
    if (selectedGrievance) {
      updateGrievanceStatus(selectedGrievance.id, newStatus, resolutionNotes);
      setStatusModalOpen(false);
      setSelectedGrievance(null);
    }
  };

  const handleOpenEscalateModal = (g) => {
    setSelectedGrievance(g);
    setEscalateReason('Complex multi-departmental issue requiring Dean intervention');
    setEscalateModalOpen(true);
  };

  const handleSaveEscalation = () => {
    if (selectedGrievance) {
      escalateGrievance(selectedGrievance.id, escalateReason);
      setEscalateModalOpen(false);
      setSelectedGrievance(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Authority Persona Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-300 font-semibold">
              Authority Redressal Queue • Tier {user?.tierLevel || 2}
            </span>
            <span className="text-xs font-mono text-outline">{user?.title || 'Head of Department'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Welcome, {user?.name || 'Dr. Radhika Sen'}
          </h1>
          <p className="text-xs text-outline font-mono">
            {user?.department || 'Department of Computer Science & Engineering'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/authority/grievances">
            <Button variant="secondary" size="md" icon="list_alt">
              Full Assigned Queue
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="outline" size="md" icon="travel_explore">
              Audit Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. StatCards Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Queue"
          value={assignedGrievances.length}
          subtitle="Total active cases"
          icon="inbox"
          iconColor="text-blue-400"
          iconBg="bg-blue-950/60 border-blue-500/30"
          accentBorder="blue"
        />
        <StatCard
          title="Pending Triage"
          value={pendingCount}
          subtitle="Requires acknowledgment"
          icon="hourglass_empty"
          iconColor="text-slate-400"
          iconBg="bg-slate-800 border-slate-700"
        />
        <StatCard
          title="Under In-Review"
          value={inReviewCount}
          subtitle="Active inquiry ongoing"
          icon="search"
          iconColor="text-cyan-400"
          iconBg="bg-cyan-950/60 border-cyan-500/30"
        />
        <StatCard
          title="Escalated / Overdue"
          value={escalatedCount}
          subtitle="SLA Breached / Advanced"
          icon="warning"
          iconColor="text-amber-400"
          iconBg="bg-amber-950/60 border-amber-500/30"
          accentBorder={escalatedCount > 0 ? 'amber' : null}
        />
      </div>

      {/* 3. SLA Warning Alert */}
      {escalatedCount > 0 && (
        <Alert
          type="warning"
          title="SLA Escalation Alert"
          icon="warning"
        >
          There are <strong>{escalatedCount} grievances</strong> approaching SLA expiry or escalated to higher tiers. Prompt status updates prevent automatic tribunal intervention.
        </Alert>
      )}

      {/* 4. Priority Triage Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">view_list</span>
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Assigned Grievance Triage Queue
            </h2>
          </div>
          <span className="text-xs font-mono text-outline">
            Showing top {assignedGrievances.length} cases
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-surface-container-low shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high/60 border-b border-white/[0.06] text-outline font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Token / Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Complainant</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Live SLA Timer</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {assignedGrievances.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-surface-container/60 transition-colors group"
                >
                  {/* Token & Title */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary">{g.token}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-container-high text-outline">
                          Tier {g.currentLevel}
                        </span>
                      </div>
                      <Link
                        to={`/authority/grievances/${g.token}`}
                        className="font-medium text-on-surface hover:text-primary transition-colors block line-clamp-1"
                      >
                        {g.title}
                      </Link>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="font-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md text-[11px]">
                      {g.category}
                    </span>
                  </td>

                  {/* Complainant (Privacy Shielded) */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-emerald-400">
                        {g.isAnonymous ? 'lock' : 'person'}
                      </span>
                      <span className="font-mono text-[11px] text-outline">
                        {g.isAnonymous ? 'Anonymous Student' : g.complainantName}
                      </span>
                    </div>
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
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check</span>
                        Resolved
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenStatusModal(g)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary text-[11px] font-mono border border-primary/20 transition-colors"
                        title="Update Status"
                      >
                        Update Status
                      </button>

                      <button
                        onClick={() => handleOpenEscalateModal(g)}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-[11px] font-mono border border-amber-500/30 transition-colors"
                        title="Manual Escalate"
                      >
                        Escalate
                      </button>

                      <Link
                        to={`/authority/grievances/${g.token}`}
                        className="p-1 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
                        title="Full Details"
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
      </div>

      {/* Fast Status Update Modal */}
      {statusModalOpen && selectedGrievance && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Grievance: ${selectedGrievance.token}`}
          subtitle="Change status and log official redressal remarks for the student."
          footer={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon="save" onClick={handleSaveStatus}>
                Save Status & Notify
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surface-container-low border border-white/[0.04]">
              <h4 className="text-xs font-semibold text-on-surface">{selectedGrievance.title}</h4>
              <p className="text-[11px] text-outline mt-0.5">
                Current Status: <strong>{selectedGrievance.status}</strong> • Tier {selectedGrievance.currentLevel}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                New Target Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Pending">Pending (Awaiting investigation)</option>
                <option value="In-Review">In-Review (Actively investigated)</option>
                <option value="Resolved">Resolved (Redressal completed)</option>
                <option value="Closed">Closed (Case finalized)</option>
              </select>
            </div>

            <Textarea
              label="Official Authority Remarks / Action Report"
              rows={4}
              placeholder="Detail the actions taken, repairs made, schedule revisions, or decisions communicated to faculty..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              helperText="These remarks will be visible to the student and logged in the immutable audit trail."
            />
          </div>
        </Modal>
      )}

      {/* Fast Manual Escalation Modal */}
      {escalateModalOpen && selectedGrievance && (
        <Modal
          isOpen={escalateModalOpen}
          onClose={() => setEscalateModalOpen(false)}
          title={`Escalate Grievance: ${selectedGrievance.token}`}
          subtitle="Advance this ticket to the higher administrative tier (Tier 3 Dean level)."
          footer={
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setEscalateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" icon="warning" onClick={handleSaveEscalation}>
                Confirm Escalation to Dean
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="warning" title="Notice on Manual Escalation">
              Escalating this ticket will immediately notify the Dean and re-initialize the SLA clock under Tier 3 rules.
            </Alert>

            <Textarea
              label="Reason for Administrative Escalation"
              rows={3}
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              placeholder="Explain why this grievance requires Dean / Apex committee intervention..."
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AuthorityDashboard;
