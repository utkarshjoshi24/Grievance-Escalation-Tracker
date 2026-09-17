import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import clsx from 'clsx';

export const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, role, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useGrievances();
  const navigate = useNavigate();

  const [trackQuery, setTrackQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Filter notifications for current user/role
  const userNotifications = notifications.filter(
    (n) => n.role === role || n.userId === user?.id
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      navigate(`/track/${encodeURIComponent(trackQuery.trim().toUpperCase())}`);
      setTrackQuery('');
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.grievanceToken) {
      if (role === 'student') navigate(`/student/grievances/${notif.grievanceToken}`);
      else if (role === 'authority') navigate(`/authority/grievances/${notif.grievanceToken}`);
      else if (role === 'admin') navigate(`/admin/grievances/${notif.grievanceToken}`);
    }
    setShowNotifications(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-1/90 backdrop-blur-md border-b border-white/[0.06] h-16 flex items-center px-4 lg:px-6 justify-between gap-4">
      {/* Left: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <span className="material-symbols-outlined text-2xl">
            {isSidebarOpen ? 'close' : 'menu'}
          </span>
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-electric font-bold text-sm">
            <span className="material-symbols-outlined text-lg">shield</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm tracking-tight text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
              GET
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 border border-primary/20 text-primary font-normal">
                Integrity System
              </span>
            </span>
            <p className="text-[10px] text-outline leading-none font-mono">
              Auto-Escalation Tracker
            </p>
          </div>
        </Link>
      </div>

      {/* Middle: Universal Grievance Quick-Track */}
      <form onSubmit={handleQuickTrack} className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            placeholder="Quick Track Grievance (e.g. GET-2026-8941)..."
            className="w-full bg-surface-container-low border border-white/[0.08] focus:border-primary/50 text-xs text-on-surface placeholder:text-outline/60 rounded-full pl-9 pr-20 py-2 transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono"
          />
          <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-base">
            search
          </span>
          <button
            type="submit"
            className="absolute right-1 top-1 px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest text-[10px] font-mono font-medium text-primary rounded-full border border-primary/20 transition-colors"
          >
            Track
          </button>
        </div>
      </form>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Submit CTA */}
        <Link
          to="/submit"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-xs font-semibold shadow-inner-keylight hover:bg-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Submit Grievance</span>
        </Link>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors relative"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container border border-white/[0.12] rounded-2xl shadow-2xl p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-on-surface">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(role)}
                    className="text-[11px] text-primary hover:underline font-mono"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
                {userNotifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-outline font-mono">
                    No notifications yet.
                  </p>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={clsx(
                        'p-3 rounded-xl border text-left cursor-pointer transition-colors',
                        notif.isRead
                          ? 'bg-surface-container-low/50 border-transparent text-outline hover:bg-surface-container-high/40'
                          : 'bg-surface-container-high border-primary/30 text-on-surface hover:bg-surface-container-highest'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-on-surface truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-mono text-outline shrink-0">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-white/10"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-on-surface leading-tight">{user?.name}</p>
              <p className="text-[10px] font-mono text-outline capitalize">{user?.title || role}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container border border-white/[0.12] rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
              <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                <p className="text-xs font-semibold text-on-surface">{user?.name}</p>
                <p className="text-[11px] text-outline font-mono truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container-highest text-primary">
                  {role} account
                </span>
              </div>

              <Link
                to={role === 'student' ? '/student' : role === 'authority' ? '/authority' : '/admin'}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                Dashboard
              </Link>
              <Link
                to="/track"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-base">travel_explore</span>
                Track Grievance
              </Link>
              <Link
                to="/submit"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-base">add_box</span>
                Submit Grievance
              </Link>

              <div className="pt-1 mt-1 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
