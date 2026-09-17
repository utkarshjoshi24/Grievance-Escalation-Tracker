import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleSwitcher from '../ui/RoleSwitcher';
import clsx from 'clsx';

export const PublicLayout = () => {
  const { user, role, isAuthenticated } = useAuth();
  const location = useLocation();

  const getDashboardLink = () => {
    if (role === 'student') return '/student';
    if (role === 'authority') return '/authority';
    return '/admin';
  };

  return (
    <div className="min-h-screen bg-canvas text-on-surface flex flex-col antialiased selection:bg-primary-container selection:text-white">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface-1/90 backdrop-blur-md border-b border-white/[0.06] h-16 flex items-center px-4 sm:px-8 justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-primary-container to-cyan-400 flex items-center justify-center text-white shadow-glow-electric font-bold text-base">
            <span className="material-symbols-outlined text-xl">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-on-surface group-hover:text-primary transition-colors">
                GET
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-semibold uppercase">
                Integrity System
              </span>
            </div>
            <p className="text-[10px] text-outline font-mono leading-none hidden sm:block">
              Time-Bound Auto-Escalating Grievance Redressal
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              location.pathname === '/'
                ? 'bg-surface-container-high text-on-surface'
                : 'text-outline hover:text-on-surface hover:bg-surface-container-high/40'
            )}
          >
            Home
          </Link>
          <Link
            to="/track"
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              location.pathname === '/track'
                ? 'bg-surface-container-high text-on-surface'
                : 'text-outline hover:text-on-surface hover:bg-surface-container-high/40'
            )}
          >
            Track Grievance
          </Link>
          <Link
            to="/submit"
            className={clsx(
              'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
              location.pathname === '/submit'
                ? 'bg-surface-container-high text-on-surface'
                : 'text-outline hover:text-on-surface hover:bg-surface-container-high/40'
            )}
          >
            Submit Grievance
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/track"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-outline hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">travel_explore</span>
            <span>Lookup Token</span>
          </Link>

          {isAuthenticated && user ? (
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold shadow-inner-keylight hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-2 text-xs font-semibold bg-primary-container text-on-primary-container rounded-xl shadow-inner-keylight hover:bg-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Institutional Footer */}
      <footer className="bg-surface-1 border-t border-white/[0.06] py-12 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white text-xs font-bold">
                <span className="material-symbols-outlined text-base">shield</span>
              </div>
              <span className="font-bold text-sm text-on-surface tracking-tight">GET Integrity System</span>
            </div>
            <p className="text-xs text-outline leading-relaxed">
              Institutional grievance escalation and compliance framework ensuring impartial, zero-retaliation, time-bound conflict resolution.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-mono uppercase text-on-surface font-semibold tracking-wider">
              Student Portals
            </h5>
            <ul className="space-y-1.5 text-xs text-outline">
              <li><Link to="/submit" className="hover:text-primary transition-colors">Submit Confidential Grievance</Link></li>
              <li><Link to="/track" className="hover:text-primary transition-colors">Track via UUID / Token</Link></li>
              <li><Link to="/student" className="hover:text-primary transition-colors">Student Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Institutional Login</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-mono uppercase text-on-surface font-semibold tracking-wider">
              Administration
            </h5>
            <ul className="space-y-1.5 text-xs text-outline">
              <li><Link to="/authority" className="hover:text-primary transition-colors">Authority Resolution Queue</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Ombudsman Command Center</Link></li>
              <li><Link to="/admin/hierarchy" className="hover:text-primary transition-colors">Escalation Matrix Config</Link></li>
              <li><Link to="/admin/analytics" className="hover:text-primary transition-colors">Institutional SLA Compliance</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-mono uppercase text-on-surface font-semibold tracking-wider">
              Security & Compliance
            </h5>
            <p className="text-xs text-outline leading-relaxed">
              All submissions are cryptographically stamped. Anonymous mode engages Zero-Knowledge redaction protecting student records against institutional retribution.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                256-Bit Encrypted
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400">
                Auto-SLA v2.4
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline font-mono">
          <p>© 2026 Grievance Escalation Tracker. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-on-surface cursor-pointer">Privacy Charter</span>
            <span className="hover:text-on-surface cursor-pointer">Escalation Policy</span>
            <span className="hover:text-on-surface cursor-pointer">Ombudsman Contact</span>
          </div>
        </div>
      </footer>

      {/* Floating Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};

export default PublicLayout;
