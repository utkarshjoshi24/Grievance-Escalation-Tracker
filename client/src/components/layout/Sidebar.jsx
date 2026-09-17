import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();
  const location = useLocation();

  const studentNavItems = [
    { label: 'Dashboard', path: '/student', icon: 'dashboard' },
    { label: 'My Grievances', path: '/student/grievances', icon: 'list_alt' },
    { label: 'Submit New', path: '/submit', icon: 'add_circle' },
    { label: 'Public Tracker', path: '/track', icon: 'travel_explore' },
    { label: 'Notifications', path: '/student/notifications', icon: 'notifications' },
  ];

  const authorityNavItems = [
    { label: 'Dashboard', path: '/authority', icon: 'dashboard' },
    { label: 'Assigned Queue', path: '/authority/grievances', icon: 'inbox' },
    { label: 'Public Tracker', path: '/track', icon: 'travel_explore' },
    { label: 'Notifications', path: '/authority/notifications', icon: 'notifications' },
  ];

  const adminNavItems = [
    { label: 'Command Center', path: '/admin', icon: 'admin_panel_settings' },
    { label: 'All Grievances', path: '/admin/grievances', icon: 'table_view' },
    { label: 'Hierarchy Config', path: '/admin/hierarchy', icon: 'account_tree' },
    { label: 'SLA Analytics', path: '/admin/analytics', icon: 'insights' },
    { label: 'Notifications', path: '/admin/notifications', icon: 'notifications' },
    { label: 'Settings', path: '/admin/settings', icon: 'settings' },
  ];

  let currentNavItems = studentNavItems;
  if (role === 'authority') currentNavItems = authorityNavItems;
  if (role === 'admin') currentNavItems = adminNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-surface-1 border-r border-white/[0.06] flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 overflow-y-auto custom-scrollbar',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="space-y-6">
          {/* User Role Card */}
          <div className="p-3 bg-surface-container-low border border-white/[0.06] rounded-xl shadow-inner-keylight">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                <span className="material-symbols-outlined text-lg">
                  {role === 'student' ? 'school' : role === 'authority' ? 'shield_person' : 'security'}
                </span>
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-on-surface truncate">{user?.name}</p>
                <span className="text-[10px] font-mono text-primary uppercase font-medium">
                  {user?.title || `${role} Portal`}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-outline mb-2">
              Navigation
            </p>
            {currentNavItems.map((item) => {
              const isActive =
                item.path === location.pathname ||
                (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/student' && item.path !== '/authority' && item.path !== '/admin');

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-primary-container/20 text-primary border border-primary/30 shadow-inner-keylight font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border border-transparent'
                  )}
                >
                  <span
                    className={clsx(
                      'material-symbols-outlined text-lg transition-transform group-hover:scale-110',
                      isActive ? 'text-primary' : 'text-outline group-hover:text-on-surface'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick Links */}
          <div className="space-y-1 pt-4 border-t border-white/[0.04]">
            <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-outline mb-2">
              Institutional Links
            </p>
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-outline hover:text-on-surface hover:bg-surface-container-high/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span>Landing Page</span>
            </NavLink>
            <NavLink
              to="/submit"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-outline hover:text-on-surface hover:bg-surface-container-high/40 transition-colors"
            >
              <span className="material-symbols-outlined text-base">add_moderator</span>
              <span>Confidential Submit</span>
            </NavLink>
          </div>
        </div>

        {/* System Integrity Footer */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <div className="p-2.5 bg-surface-container-lowest/80 border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                SLA Engine v2.4
              </span>
            </div>
            <span className="text-[10px] font-mono text-outline">Active</span>
          </div>
          <p className="text-[10px] text-center text-outline/60 font-mono">
            GET Institutional Shield © 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
