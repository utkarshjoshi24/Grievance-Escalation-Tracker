import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SLACountdown from '../../components/ui/SLACountdown';

export const LandingPage = () => {
  const [quickToken, setQuickToken] = useState('');
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'authority' | 'admin'
  const { isAuthenticated, role, user } = useAuth();
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (quickToken.trim()) {
      navigate(`/track/${encodeURIComponent(quickToken.trim().toUpperCase())}`);
    }
  };

  const getDashboardLink = () => {
    if (role === 'student') return '/student';
    if (role === 'authority') return '/authority';
    if (role === 'admin') return '/admin';
    return '/student';
  };

  const rolePortals = [
    {
      key: 'student',
      title: 'Student Portal',
      badge: 'Student / Complainant Access',
      badgeColor: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
      glowColor: 'from-blue-600/30 to-cyan-500/20',
      icon: 'school',
      iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/40',
      description:
        'Lodge confidential or 100% anonymous grievances with guaranteed time-bound SLA tracking and zero fear of academic retribution.',
      features: [
        'Confidential & Zero-Knowledge anonymous filing',
        'Live SLA countdowns & automatic tier escalations',
        'Cryptographic tracking token & immutable audit trail',
        'Real-time status updates & instant notifications',
      ],
      loginPath: '/login?role=student',
      registerPath: '/register?role=student',
      demoEmail: 'alex.student@university.edu',
      demoName: 'Alex Mercer (Student)',
    },
    {
      key: 'authority',
      title: 'Authority Portal',
      badge: 'Resolvers & Department Heads',
      badgeColor: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      glowColor: 'from-amber-600/30 to-orange-500/20',
      icon: 'shield_person',
      iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      description:
        'Multi-tier resolution console for Course Coordinators, HoDs, and Deans to review, investigate, resolve, or escalate assigned grievances.',
      features: [
        'Tier-specific assigned queue (Tier 1 / Tier 2 / Tier 3)',
        'SLA urgency countdowns & breach warning indicators',
        'Formal resolution remarks & evidence documentation',
        'Inter-departmental forwarding & manual escalations',
      ],
      loginPath: '/login?role=authority',
      registerPath: '/register?role=authority',
      demoEmail: 'instructor@university.edu',
      demoName: 'Dr. Robert Langdon (Tier 1)',
    },
    {
      key: 'admin',
      title: 'Ombudsman & Admin',
      badge: 'Institutional Governance & Apex Oversight',
      badgeColor: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
      glowColor: 'from-purple-600/30 to-indigo-500/20',
      icon: 'admin_panel_settings',
      iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
      description:
        'Apex command center for Ombudsman, Deans, and Campus Directors to configure escalation hierarchies and inspect university-wide compliance.',
      features: [
        'Apex oversight across all institutional categories',
        'Dynamic 4-Tier category escalation matrix builder',
        'Departmental SLA compliance & resolution analytics',
        'System-wide audit logs & administrative overrides',
      ],
      loginPath: '/login?role=admin',
      registerPath: '/register?role=admin',
      demoEmail: 'admin@university.edu',
      demoName: 'Campus Administrator (Admin)',
    },
  ];

  return (
    <div className="space-y-24 py-8 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Universal Quick-Track */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-mono shadow-inner-keylight">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>ZERO-RETALIATION • TIME-BOUND ENFORCED SLA ENGINE</span>
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
              A transparent, encrypted grievance redressal portal. If an issue is not redressed within the enforced SLA window, the system automatically escalates it through institutional tiers up to the Vice Chancellor & Ombudsman.
            </p>

            {/* Authenticated Quick Status or Track Bar */}
            {isAuthenticated && user ? (
              <div className="p-4 rounded-2xl bg-surface-container border border-primary/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                    <span className="material-symbols-outlined text-xl">account_circle</span>
                  </div>
                  <div>
                    <p className="text-xs text-outline font-mono uppercase">Logged in as {role}</p>
                    <p className="text-sm font-bold text-on-surface">{user.name}</p>
                  </div>
                </div>
                <Link to={getDashboardLink()}>
                  <Button variant="primary" size="md" icon="dashboard" iconPosition="right">
                    Open {role} Dashboard
                  </Button>
                </Link>
              </div>
            ) : null}

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
                  Track Grievance
                </Button>
              </div>
              <p className="text-[11px] font-mono text-outline mt-2 pl-2">
                Sample Tokens: <span onClick={() => setQuickToken('GET-2026-8941')} className="text-primary hover:underline cursor-pointer">GET-2026-8941</span>, <span onClick={() => setQuickToken('GET-2026-4091')} className="text-primary hover:underline cursor-pointer">GET-2026-4091</span>
              </p>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/submit">
                <Button size="lg" variant="primary" icon="add_moderator">
                  Submit Confidential Grievance
                </Button>
              </Link>
              <a href="#role-portals">
                <Button size="lg" variant="secondary" icon="login">
                  Select Role Portal
                </Button>
              </a>
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
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">SLA Expired (24h)</span>
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
                    <span>Inspect Case Timeline</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED ROLE PORTALS SECTION (SEPARATE LOGIN & SIGNUP FOR ALL ROLES) */}
      <section id="role-portals" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase">
            <span>Role-Based Authentication & Isolation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
            Institutional Role Portals
          </h2>
          <p className="text-sm sm:text-base text-outline leading-relaxed">
            Select your role to register a new account or log in to your dedicated portal. Each role features tailored capabilities, distinct SLA matrices, and strict security isolation.
          </p>
        </div>

        {/* 3 Dedicated Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rolePortals.map((portal) => (
            <div
              key={portal.key}
              className="relative group rounded-3xl p-1 bg-surface-container border border-white/[0.1] hover:border-white/[0.25] transition-all duration-300 flex flex-col justify-between shadow-2xl hover:-translate-y-1"
            >
              {/* Subtle top glowing gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${portal.glowColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${portal.iconColor}`}
                    >
                      <span className="material-symbols-outlined text-2xl">{portal.icon}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${portal.badgeColor}`}
                    >
                      {portal.key.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-on-surface tracking-tight">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-outline mt-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="pt-2 space-y-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-outline tracking-wider font-semibold">
                      Portal Capabilities
                    </span>
                    <ul className="space-y-2 text-xs text-on-surface-variant">
                      {portal.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-sm shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Separate Login & Signup CTAs */}
                <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                  <div className="grid grid-cols-2 gap-2">
                    <Link to={portal.loginPath} className="w-full">
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full text-xs font-semibold justify-center"
                        icon="login"
                      >
                        {portal.key === 'admin' ? 'Admin Login' : portal.key === 'authority' ? 'Auth Login' : 'Student Login'}
                      </Button>
                    </Link>

                    <Link to={portal.registerPath} className="w-full">
                      <Button
                        variant="secondary"
                        size="md"
                        className="w-full text-xs font-semibold justify-center"
                        icon="how_to_reg"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Demo Credentials Info */}
                  <div className="p-2 rounded-xl bg-surface-container-low border border-white/[0.04] text-[11px] font-mono text-outline flex items-center justify-between">
                    <span className="truncate">Demo: {portal.demoEmail}</span>
                    <Link
                      to={portal.loginPath}
                      className="text-primary hover:underline shrink-0 ml-2 font-semibold"
                    >
                      Fill ➜
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FOUR-TIER ESCALATION MATRIX SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-surface-container border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                Hierarchical Redressal Matrix
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
                4-Tier Automatic Escalation Flow
              </h2>
              <p className="text-xs sm:text-sm text-outline leading-relaxed">
                If an assigned authority does not resolve an issue within their designated SLA window, the backend SLA engine automatically bypasses and escalates the ticket up the chain.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link to="/submit">
                  <Button variant="primary" icon="add_circle">
                    Submit Grievance
                  </Button>
                </Link>
                <Link to="/track">
                  <Button variant="secondary" icon="travel_explore">
                    Public Tracking
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              {[
                { tier: 'Tier 1', role: 'Course Coordinator / Resident Warden', sla: '24 Hours SLA', desc: 'First point of departmental intake & immediate corrective action' },
                { tier: 'Tier 2', role: 'Head of Department (HoD) / Chief Warden', sla: '48 Hours SLA', desc: 'Departmental authority with administrative override & faculty inquiry' },
                { tier: 'Tier 3', role: 'Dean of Academic Affairs / Student Welfare', sla: '72 Hours SLA', desc: 'Faculty-wide oversight, disciplinary board & campus welfare' },
                { tier: 'Tier 4', role: 'Vice Chancellor & Apex Ombudsman Tribunal', sla: '96 Hours SLA', desc: 'Highest institutional authority with legally binding resolution' },
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
            Experience complete transparency, enforceable timelines, and absolute confidentiality without institutional retribution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/login?role=student">
              <Button size="lg" variant="primary" icon="school">
                Student Portal
              </Button>
            </Link>
            <Link to="/login?role=authority">
              <Button size="lg" variant="secondary" icon="shield_person">
                Authority Portal
              </Button>
            </Link>
            <Link to="/login?role=admin">
              <Button size="lg" variant="secondary" icon="admin_panel_settings">
                Admin Command
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
