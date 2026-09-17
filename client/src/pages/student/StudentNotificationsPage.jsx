import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGrievances } from '../../context/GrievanceContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import clsx from 'clsx';

export const StudentNotificationsPage = () => {
  const { user, role } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useGrievances();

  const userNotifications = notifications.filter(
    (n) => n.role === role || n.userId === user?.id
  );

  const getNotifIcon = (type) => {
    switch (type) {
      case 'ESCALATION':
        return { icon: 'warning', color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-500/30' };
      case 'RESOLVED':
        return { icon: 'check_circle', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-500/30' };
      case 'CRITICAL':
        return { icon: 'error', color: 'text-red-400', bg: 'bg-red-950/60 border-red-500/30' };
      default:
        return { icon: 'notifications', color: 'text-blue-400', bg: 'bg-blue-950/60 border-blue-500/30' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Notifications & System Alerts
          </h1>
          <p className="text-xs text-outline font-mono mt-0.5">
            Real-time status updates and auto-escalation notifications
          </p>
        </div>

        {userNotifications.some((n) => !n.isRead) && (
          <Button
            variant="secondary"
            size="sm"
            icon="done_all"
            onClick={() => markAllNotificationsRead(role)}
          >
            Mark All Read
          </Button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title="No Notifications"
          description="You're completely up to date. New SLA updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {userNotifications.map((notif) => {
            const style = getNotifIcon(notif.type);
            return (
              <Card
                key={notif.id}
                className={clsx(
                  'p-4 transition-all duration-200 border',
                  notif.isRead
                    ? 'bg-surface-container-low/60 border-white/[0.04]'
                    : 'bg-surface-container border-primary/40 shadow-inner-keylight'
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
                      style.bg,
                      style.color
                    )}
                  >
                    <span className="material-symbols-outlined text-xl">{style.icon}</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-on-surface">
                        {notif.title}
                      </h4>
                      <span className="text-[11px] font-mono text-outline">
                        {new Date(notif.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      {notif.grievanceToken && (
                        <Link
                          to={`/student/grievances/${notif.grievanceToken}`}
                          className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Inspect Grievance {notif.grievanceToken}</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="text-[11px] text-outline hover:text-on-surface font-mono"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsPage;
