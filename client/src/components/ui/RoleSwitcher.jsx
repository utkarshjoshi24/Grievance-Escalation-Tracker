import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export const RoleSwitcher = () => {
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      key: 'student',
      label: 'Student / Complainant',
      name: 'Aarav Sharma',
      detail: 'CSE 4th Year',
      icon: 'school',
      route: '/student',
      badge: 'bg-blue-950 text-blue-300 border-blue-500/30',
    },
    {
      key: 'authority',
      label: 'Authority / Resolver',
      name: 'Dr. Radhika Sen',
      detail: 'Head of Department (Tier 2)',
      icon: 'admin_panel_settings',
      route: '/authority',
      badge: 'bg-amber-950 text-amber-300 border-amber-500/30',
    },
    {
      key: 'admin',
      label: 'Admin / Ombudsman',
      name: 'Prof. Vikram Malhotra',
      detail: 'Institutional Integrity Director',
      icon: 'shield_person',
      route: '/admin',
      badge: 'bg-purple-950 text-purple-300 border-purple-500/30',
    },
  ];

  const handleSelectRole = (roleKey, route) => {
    switchRole(roleKey);
    navigate(route);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-3 bg-surface-container border border-white/[0.14] rounded-2xl p-3 shadow-2xl w-72 animate-slide-up backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] px-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-sm">switch_account</span>
              <span className="text-[11px] font-mono uppercase font-semibold text-on-surface tracking-wider">
                Dev Role Switcher
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-outline font-mono">
              Live Demo
            </span>
          </div>

          <div className="space-y-1.5">
            {roles.map((r) => {
              const isActive = role === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleSelectRole(r.key, r.route)}
                  className={clsx(
                    'w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2',
                    isActive
                      ? 'bg-surface-container-high border-primary/50 text-on-surface'
                      : 'bg-surface-container-low/60 border-transparent hover:bg-surface-container-high/60 text-outline hover:text-on-surface'
                  )}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                        r.badge
                      )}
                    >
                      <span className="material-symbols-outlined text-base">{r.icon}</span>
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-on-surface leading-tight truncate">
                        {r.label}
                      </p>
                      <p className="text-[11px] text-outline truncate">{r.name} • {r.detail}</p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="material-symbols-outlined text-primary text-base shrink-0">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-high/90 hover:bg-surface-container-highest border border-white/[0.14] text-on-surface text-xs font-medium shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-outline">Role:</span>
        <span className="font-semibold text-primary capitalize">{role}</span>
        <span className="material-symbols-outlined text-base text-outline">
          {isOpen ? 'expand_more' : 'unfold_more'}
        </span>
      </button>
    </div>
  );
};

export default RoleSwitcher;
