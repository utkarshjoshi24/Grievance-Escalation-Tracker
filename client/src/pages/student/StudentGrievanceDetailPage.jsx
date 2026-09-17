import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGrievances } from '../../context/GrievanceContext';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Timeline from '../../components/ui/Timeline';
import TrackingTokenCard from '../../components/ui/TrackingTokenCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

export const StudentGrievanceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGrievanceById } = useGrievances();

  const grievance = getGrievanceById(id);

  if (!grievance) {
    return (
      <div className="py-12">
        <EmptyState
          icon="error"
          title="Grievance Record Not Found"
          description={`No record found matching token or ID "${id}".`}
          actionLabel="Back to Grievances"
          onAction={() => navigate('/student/grievances')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/grievances"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Grievance List</span>
        </Link>
        <span className="text-xs font-mono text-outline">
          Created: {new Date(grievance.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Tracking Token Card */}
      <TrackingTokenCard
        token={grievance.token}
        uuid={grievance.trackingUuid}
        isAnonymous={grievance.isAnonymous}
      />

      {/* Main Details Card */}
      <Card className="p-6 space-y-6 bg-surface-container border-white/[0.10]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={grievance.status} size="md" />
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                {grievance.category}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-500/30">
                Tier {grievance.currentLevel} Escalation
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-on-surface pt-1 leading-snug">
              {grievance.title}
            </h1>

            <p className="text-xs text-outline font-mono">
              Department: {grievance.department}
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

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-surface-container-high/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] font-mono uppercase text-outline">
              Assigned Redressal Authority
            </span>
            <p className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">
                admin_panel_settings
              </span>
              {grievance.currentAuthorityTitle}
            </p>
            <p className="text-[11px] text-outline">
              Designated Resolver: {grievance.currentAuthorityName || 'Departmental Officer'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-high/60 border border-white/[0.04] space-y-1">
            <span className="text-[10px] font-mono uppercase text-outline">
              Complainant Confidentiality Shield
            </span>
            <p className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-400 text-base">
                {grievance.isAnonymous ? 'lock' : 'verified_user'}
              </span>
              {grievance.isAnonymous ? 'Shielded Anonymous Complainant' : grievance.complainantName}
            </p>
            <p className="text-[11px] text-outline">
              {grievance.isAnonymous
                ? 'Zero-Knowledge Cryptographic Shield active.'
                : 'Direct student identity registered.'}
            </p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
            Grievance Description
          </span>
          <div className="p-4 rounded-xl bg-surface-container-low border border-white/[0.04] text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {grievance.description}
          </div>
        </div>

        {/* Attachments */}
        {grievance.attachments && grievance.attachments.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
              Attached Evidence ({grievance.attachments.length})
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

        {/* Resolution Notes */}
        {grievance.resolutionNotes && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
              <span className="material-symbols-outlined text-base">task_alt</span>
              Official Redressal Resolution
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              {grievance.resolutionNotes}
            </p>
          </div>
        )}
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

export default StudentGrievanceDetailPage;
