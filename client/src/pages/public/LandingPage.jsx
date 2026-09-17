import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';

export const LandingPage = () => {
  const [quickToken, setQuickToken] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (quickToken.trim()) {
      navigate(`/track/${encodeURIComponent(quickToken.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="space-y-24 py-8 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>TIME-BOUND AUTO-ESCALATION ENGINE ACTIVE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-on-surface tracking-tight leading-[1.1]">
              Institutional Redressal with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-primary text-transparent bg-clip-text">
                Guaranteed Timelines
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-outline max-w-2xl leading-relaxed">
              A transparent, encrypted grievance redressal portal. If your issue is not resolved within the enforced SLA window, the system automatically escalates it to higher institutional authorities—up to the Ombudsman.
            </p>

            {/* Quick Track Input Bar */}
            <form onSubmit={handleTrackSubmit} className="pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl bg-surface-container-low border border-white/[0.12] rounded-2xl p-2 shadow-2xl">
                <div className="flex items-center gap-2 flex-1 px-3 py-1">
                  <span className="material-symbols-outlined text-outline text-xl">travel_explore</span>
                  <input
                    type="text"
                    value={quickToken}
                    onChange={(e) => setQuickToken(e.target.value)}
                    placeholder="Enter Tracking Token (e.g. GET-2026-8941)"
                    className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline/60 focus:outline-none font-mono"
                  />
                </div>
                <Button type="submit" size="md" variant="primary" icon="arrow_forward" iconPosition="right">
                  Track Now
                </Button>
              </div>
              <p className="text-[11px] font-mono text-outline mt-2 pl-2">
                Try demo tokens: <span onClick={() => setQuickToken('GET-2026-8941')} className="text-primary hover:underline cursor-pointer">GET-2026-8941</span>, <span onClick={() => setQuickToken('GET-2026-4820')} className="text-primary hover:underline cursor-pointer">GET-2026-4820</span>
              </p>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to="/submit">
                <Button size="lg" variant="primary" icon="add_moderator">
                  Submit Confidential Grievance
                </Button>
              </Link>
              <Link to="/student">
                <Button size="lg" variant="secondary" icon="dashboard">
                  Student Portal
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-6 text-xs text-outline font-mono">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-400 text-base">verified_user</span>
                <span>Zero-Knowledge Anonymity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-400 text-base">timer</span>
                <span>Strict 24h - 96h SLA Policy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-purple-400 text-base">lock</span>
                <span>Cryptographic Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Glowing Background Blob */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-cyan-500/20 rounded-3xl blur-2xl opacity-70" />

              <div className="relative bg-surface-container border border-white/[0.14] rounded-2xl p-6 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <span className="material-symbols-outlined text-lg">crisis_alert</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-outline">Active Redressal Case</span>
                      <h4 className="text-xs font-mono font-bold text-on-surface">GET-2026-8941</h4>
                    </div>
                  </div>
                  <StatusBadge status="In-Review" size="sm" />
                </div>

                {/* Grievance Title & Department */}
                <div>
                  <h3 className="text-base font-semibold text-on-surface leading-snug">
                    Irregular Evaluation & Delay in Midterm Exam Grades
                  </h3>
                  <p className="text-xs text-outline mt-1 font-mono">
                    Department: Computer Science & Engineering
                  </p>
                </div>

                {/* Live SLA Countdown Widget */}
                <SLACountdown
                  deadline={new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString()}
                  totalHours={48}
                />

                {/* Escalation Hierarchy Stepper */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono text-outline uppercase tracking-wider block">
                    Escalation Chain Status
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-surface-container-high/60 border border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-sm">schedule_send</span>
                        <span className="text-on-surface">Tier 1: Course Coordinator</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400">SLA Expired (24h)</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400 text-sm">search</span>
                        <span className="font-semibold text-blue-300">Tier 2: Head of Department (Active)</span>
                      </div>
                      <span className="text-[10px] font-mono text-blue-400 font-bold">18h Left</span>
                    </div>

                    <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-surface-container-low/40 border border-white/[0.02] text-outline">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                        <span>Tier 3: Dean of Academic Affairs</span>
                      </div>
                      <span className="text-[10px] font-mono">Standby</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-outline">
                  <span>Anonymous Protection: ON</span>
                  <Link to="/track/GET-2026-8941" className="text-primary hover:underline flex items-center gap-1">
                    <span>Inspect Case</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE ARCHITECTURAL PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
            Zero Retaliation • Total Accountability
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-on-surface tracking-tight">
            How the Auto-Escalation Engine Works
          </h2>
          <p className="text-xs sm:text-sm text-outline">
            Built from the ground up to solve administrative stagnation, opaque delays, and fear of academic repercussions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 hover:border-blue-500/40">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-2xl">enhanced_encryption</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight">
              1. Zero-Knowledge Submission
            </h3>
            <p className="text-xs sm:text-sm text-outline leading-relaxed">
              Submit grievances anonymously. Your student profile metadata is cryptographically detached from the ticket while providing you with an immutable Tracking Token.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-2xl">alarm_smart_wake</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight">
              2. Strict Time-Bound SLAs
            </h3>
            <p className="text-xs sm:text-sm text-outline leading-relaxed">
              Every authority has a predefined time limit (24h–48h) to acknowledge and redress the grievance. Live countdowns display compliance transparently.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:border-emerald-500/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-2xl">vertical_align_top</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface tracking-tight">
              3. Automatic Tier Escalation
            </h3>
            <p className="text-xs sm:text-sm text-outline leading-relaxed">
              If an authority fails to act within the SLA window, the grievance bypasses them automatically and escalates up to the Head of Dept, Dean, and Vice Chancellor.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. FOUR-TIER ESCALATION HIERARCHY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-surface-container border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                Hierarchical Redressal Matrix
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                4-Tier Escalation Path for Academic & Institutional Redressal
              </h2>
              <p className="text-xs sm:text-sm text-outline leading-relaxed">
                Categories like Harassment, Hostel Disruption, and Faculty Conduct follow customized institutional routing matrices configured by the university administration.
              </p>
              <div className="pt-2">
                <Link to="/submit">
                  <Button variant="primary" icon="arrow_forward" iconPosition="right">
                    Register Grievance Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {[
                { tier: 'Tier 1', role: 'Department Grievance Liaison / Coordinator', sla: '24 Hours SLA', desc: 'First point of departmental intake & resolution' },
                { tier: 'Tier 2', role: 'Head of Department (HoD)', sla: '48 Hours SLA', desc: 'Departmental authority with administrative override' },
                { tier: 'Tier 3', role: 'Dean of Academic Affairs / Student Welfare', sla: '72 Hours SLA', desc: 'Faculty-wide and campus welfare oversight' },
                { tier: 'Tier 4', role: 'Vice Chancellor & Apex Ombudsman Tribunal', sla: '96 Hours SLA', desc: 'Highest institutional authority with binding resolution' },
              ].map((item, idx) => (
                <div
                  key={item.tier}
                  className="p-4 rounded-xl bg-surface-container-high/60 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-surface-container-highest border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-primary">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-on-surface">
                        {item.role}
                      </h4>
                      <p className="text-[11px] text-outline">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 shrink-0 self-start sm:self-auto">
                    {item.sla}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Ready to lodge or track a grievance?
          </h2>
          <p className="text-sm text-outline leading-relaxed">
            Experience complete transparency, enforceable timelines, and absolute confidentiality.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/submit">
              <Button size="lg" variant="primary" icon="add_circle">
                Submit a Grievance
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="secondary" icon="travel_explore">
                Track Existing Token
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
