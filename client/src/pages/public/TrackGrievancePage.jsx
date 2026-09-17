import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrievances } from '../../context/GrievanceContext';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';
import Timeline from '../../components/ui/Timeline';
import TrackingTokenCard from '../../components/ui/TrackingTokenCard';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

export const TrackGrievancePage = () => {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const { trackGrievance, grievances } = useGrievances();

  const [inputToken, setInputToken] = useState(urlToken || '');
  const [grievance, setGrievance] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlToken) {
      setInputToken(urlToken);
      performSearch(urlToken);
    }
  }, [urlToken]);

  const performSearch = (tokenToSearch) => {
    if (!tokenToSearch?.trim()) return;
    setLoading(true);
    setSearched(true);

    setTimeout(() => {
      const result = trackGrievance(tokenToSearch);
      setGrievance(result);
      setLoading(false);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputToken.trim()) {
      navigate(`/track/${encodeURIComponent(inputToken.trim().toUpperCase())}`);
      performSearch(inputToken.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
          <span className="material-symbols-outlined text-sm">travel_explore</span>
          <span>PUBLIC REDRESSAL TRACKER</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
          Track Grievance Lifecycle
        </h1>
        <p className="text-xs sm:text-sm text-outline max-w-lg mx-auto">
          Enter your official institutional Tracking Token or UUID to inspect real-time SLA countdown and escalation status.
        </p>
      </div>

      {/* Search Input Box */}
      <Card className="p-4 sm:p-6 bg-surface-container border-white/[0.12]">
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-outline text-lg">
                fingerprint
              </span>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="e.g. GET-2026-8941 or full UUID"
                className="w-full bg-surface-container-high border border-outline-variant/60 focus:border-primary text-sm text-on-surface placeholder:text-outline/60 rounded-xl pl-10 pr-4 py-2.5 font-mono uppercase focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon="search"
              loading={loading}
            >
              Inspect Status
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-outline pt-1">
            <span>
              Quick Demo IDs:{' '}
              {grievances.slice(0, 3).map((g) => (
                <button
                  key={g.token}
                  type="button"
                  onClick={() => {
                    setInputToken(g.token);
                    navigate(`/track/${g.token}`);
                    performSearch(g.token);
                  }}
                  className="text-primary hover:underline mr-2"
                >
                  {g.token}
                </button>
              ))}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Identity Shielded
            </span>
          </div>
        </form>
      </Card>

      {/* Result Section */}
      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-outline uppercase tracking-wider">
            Fetching cryptographic record...
          </p>
        </div>
      )}

      {!loading && searched && !grievance && (
        <Alert
          type="error"
          title="Grievance Record Not Found"
          className="animate-slide-up"
        >
          No grievance matched token <strong>"{inputToken}"</strong>. Please verify the alphanumeric code from your confirmation receipt.
        </Alert>
      )}

      {!loading && grievance && (
        <div className="space-y-6 animate-slide-up">
          {/* Token Card */}
          <TrackingTokenCard
            token={grievance.token}
            uuid={grievance.trackingUuid}
            isAnonymous={grievance.isAnonymous}
          />

          {/* Core Status & Metadata Card */}
          <Card className="p-6 space-y-6 bg-surface-container border-white/[0.10]">
            {/* Title & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={grievance.status} size="md" />
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
                    {grievance.category}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300">
                    Tier {grievance.currentLevel} Escalation
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface pt-2 leading-snug">
                  {grievance.title}
                </h2>
                <p className="text-xs text-outline font-mono">
                  Submitted: {new Date(grievance.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* SLA Countdown Timer */}
            {grievance.status !== 'Resolved' && grievance.status !== 'Closed' && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
                  Live Resolution SLA
                </span>
                <SLACountdown
                  deadline={grievance.slaDeadline}
                  totalHours={grievance.slaHoursTotal || 48}
                />
              </div>
            )}

            {/* Grievance Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-outline">
                  Current Assigned Authority (Role)
                </span>
                <p className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">
                    admin_panel_settings
                  </span>
                  {grievance.currentAuthorityDisplay || grievance.currentAuthorityTitle}
                </p>
                <p className="text-[11px] text-outline">
                  Personal resolver identity masked per institutional privacy protocol.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-high/60 border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-outline">
                  Complainant Identity
                </span>
                <p className="font-semibold text-on-surface text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-400">
                    {grievance.isAnonymous ? 'lock' : 'person'}
                  </span>
                  {grievance.isAnonymous ? 'Protected / Anonymous Student' : grievance.complainantName}
                </p>
                <p className="text-[11px] text-outline">
                  {grievance.isAnonymous
                    ? 'Protected by Zero-Knowledge Student Shield.'
                    : 'Registered Student Complainant.'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
                Grievance Statement
              </span>
              <div className="p-4 rounded-xl bg-surface-container-low border border-white/[0.04] text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {grievance.description}
              </div>
            </div>

            {/* Resolution Notes (if resolved) */}
            {grievance.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
                  <span className="material-symbols-outlined text-base">task_alt</span>
                  Resolution & Action Taken
                </div>
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                  {grievance.resolutionNotes}
                </p>
              </div>
            )}
          </Card>

          {/* Full Lifecycle Timeline */}
          <Card className="p-6 space-y-4 bg-surface-container border-white/[0.10]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">history</span>
                <h3 className="text-sm font-semibold text-on-surface">
                  Lifecycle Audit Trail
                </h3>
              </div>
              <span className="text-[11px] font-mono text-outline">
                {grievance.timeline?.length || 0} Milestones Logged
              </span>
            </div>

            <Timeline events={grievance.timeline} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrackGrievancePage;
