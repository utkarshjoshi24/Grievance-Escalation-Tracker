import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGrievances } from '../../context/GrievanceContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Timeline from '../../components/ui/Timeline';
import Button from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';

export const AuthorityGrievanceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGrievanceById, updateGrievanceStatus, escalateGrievance } = useGrievances();
  const { user } = useAuth();

  const grievance = getGrievanceById(id);

  const [status, setStatus] = useState(grievance?.status || 'In-Review');
  const [remarks, setRemarks] = useState(grievance?.resolutionNotes || '');
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalateBox, setShowEscalateBox] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!grievance) {
    return (
      <div className="py-12">
        <EmptyState
          icon="error"
          title="Grievance Record Not Found"
          description={`No record found matching token or ID "${id}".`}
          actionLabel="Back to Queue"
          onAction={() => navigate('/authority/grievances')}
        />
      </div>
    );
  }

  const handleUpdateStatus = (newStatusToSave) => {
    updateGrievanceStatus(grievance.id, newStatusToSave || status, remarks);
    setToastMessage(`Grievance status updated to "${newStatusToSave || status}" successfully.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEscalateToNextTier = () => {
    if (!escalateReason.trim()) {
      alert('Please provide a reason for manual escalation.');
      return;
    }
    escalateGrievance(grievance.id, escalateReason);
    setShowEscalateBox(false);
    setToastMessage(`Grievance escalated to next administrative tier.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/authority/grievances"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Assigned Queue</span>
        </Link>
        <span className="text-xs font-mono text-outline">
          Created: {new Date(grievance.createdAt).toLocaleString()}
        </span>
      </div>

      {toastMessage && (
        <Alert type="success" onClose={() => setToastMessage(null)}>
          {toastMessage}
        </Alert>
      )}

      {/* Main Details Card */}
      <Card className="p-6 space-y-6 bg-surface-container border-white/[0.10]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-mono font-bold text-primary">{grievance.token}</span>
              <StatusBadge status={grievance.status} size="md" />
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                {grievance.category}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
                Tier {grievance.currentLevel} ({grievance.currentAuthorityTitle})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-on-surface pt-1 leading-snug">
              {grievance.title}
            </h1>

            <p className="text-xs text-outline font-mono">
              Department: {grievance.department} • Priority: {grievance.priority}
            </p>
          </div>
        </div>

        {/* SLA Countdown Timer */}
        {grievance.status !== 'Resolved' && grievance.status !== 'Closed' && (
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
              Live Resolution SLA Window
            </span>
            <SLACountdown
              deadline={grievance.slaDeadline}
              totalHours={grievance.slaHoursTotal || 48}
            />
          </div>
        )}

        {/* Complainant Privacy Info Box */}
        <div className="p-4 rounded-xl bg-surface-container-high/60 border border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl text-emerald-400">
              {grievance.isAnonymous ? 'lock' : 'person'}
            </span>
            <div>
              <p className="text-xs font-semibold text-on-surface">
                Complainant:{' '}
                {grievance.isAnonymous ? 'Protected Anonymous Complainant' : grievance.complainantName}
              </p>
              <p className="text-[11px] text-outline">
                {grievance.isAnonymous
                  ? 'Student identity withheld under Zero-Knowledge integrity protocol.'
                  : `Email: ${grievance.complainantEmail || 'Registered on file'}`}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-outline">
            {grievance.isAnonymous ? 'Shielded' : 'Verified'}
          </span>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
            Grievance Description & Facts
          </span>
          <div className="p-4 rounded-xl bg-surface-container-low border border-white/[0.04] text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {grievance.description}
          </div>
        </div>

        {/* Attachments */}
        {grievance.attachments && grievance.attachments.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
              Evidence Attachments ({grievance.attachments.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {grievance.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface-container-high/60 border border-white/[0.04] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-primary text-base">
                      attach_file
                    </span>
                    <span className="text-on-surface font-mono truncate">{file.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-outline shrink-0">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* AUTHORITY ACTION & RESOLUTION PANEL */}
      <Card className="p-6 space-y-6 bg-surface-container border-primary/30 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">gavel</span>
            <h3 className="text-sm font-semibold text-on-surface">
              Authority Action & Redressal Panel
            </h3>
          </div>
          <span className="text-xs font-mono text-outline">
            Actor: {user?.name} ({user?.title})
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1.5">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/60 text-xs text-on-surface rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Pending">Pending (Awaiting review)</option>
                <option value="In-Review">In-Review (Investigation in progress)</option>
                <option value="Resolved">Resolved (Redressal complete)</option>
                <option value="Closed">Closed (Case finalized)</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                icon="save"
                onClick={() => handleUpdateStatus()}
              >
                Save Status & Remarks
              </Button>
            </div>
          </div>

          <Textarea
            label="Official Resolution Findings & Action Taken"
            rows={4}
            placeholder="Record formal findings, actions taken, meeting summaries, or instructions given to course instructors / facility teams..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            helperText="Saved remarks will be appended to the lifecycle audit trail and notified to the student."
          />

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="success"
                size="sm"
                icon="check_circle"
                onClick={() => {
                  setStatus('Resolved');
                  handleUpdateStatus('Resolved');
                }}
              >
                Mark as Resolved
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon="upgrade"
              className="text-amber-300 border-amber-500/40 hover:bg-amber-950/40"
              onClick={() => setShowEscalateBox(!showEscalateBox)}
            >
              Manual Escalation to Tier 3 (Dean)
            </Button>
          </div>

          {/* Manual Escalation Drawer */}
          {showEscalateBox && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3 animate-slide-up">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="material-symbols-outlined text-base">warning</span>
                <span>Manual Administrative Escalation to Dean of Student Welfare / Academic Dean</span>
              </div>

              <Textarea
                label="Reason for Administrative Escalation"
                rows={3}
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                placeholder="Explain the administrative complexities or policy decisions requiring higher deanery intervention..."
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEscalateBox(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon="warning"
                  onClick={handleEscalateToNextTier}
                >
                  Confirm Escalation
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lifecycle Timeline */}
      <Card className="p-6 space-y-4 bg-surface-container border-white/[0.10]">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">history</span>
            <h3 className="text-sm font-semibold text-on-surface">
              Complete Lifecycle Timeline & Audit Trail
            </h3>
          </div>
          <span className="text-[11px] font-mono text-outline">
            {grievance.timeline?.length || 0} Milestones Logged
          </span>
        </div>

        <Timeline events={grievance.timeline} />
      </Card>
    </div>
  );
};

export default AuthorityGrievanceDetailPage;
