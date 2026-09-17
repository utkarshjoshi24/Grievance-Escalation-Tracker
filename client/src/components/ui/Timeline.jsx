import React from 'react';
import clsx from 'clsx';

export const Timeline = ({ events = [], className }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-outline font-mono">
        No lifecycle events recorded yet.
      </div>
    );
  }

  const getEventConfig = (type) => {
    switch (type) {
      case 'SUBMISSION':
        return {
          icon: 'send',
          color: 'text-blue-400',
          bg: 'bg-blue-950/60 border-blue-500/40',
          lineColor: 'border-blue-500/30',
        };
      case 'ASSIGNMENT':
        return {
          icon: 'person_pin',
          color: 'text-cyan-400',
          bg: 'bg-cyan-950/60 border-cyan-500/40',
          lineColor: 'border-cyan-500/30',
        };
      case 'REVIEW':
      case 'STATUS_UPDATE':
        return {
          icon: 'search',
          color: 'text-indigo-400',
          bg: 'bg-indigo-950/60 border-indigo-500/40',
          lineColor: 'border-indigo-500/30',
        };
      case 'ESCALATION':
        return {
          icon: 'warning',
          color: 'text-amber-400',
          bg: 'bg-amber-950/60 border-amber-500/50',
          lineColor: 'border-amber-500/40',
        };
      case 'CRITICAL_BREACH':
        return {
          icon: 'error',
          color: 'text-red-400',
          bg: 'bg-red-950/70 border-red-500/60',
          lineColor: 'border-red-500/40',
        };
      case 'RESOLUTION':
        return {
          icon: 'check_circle',
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/60 border-emerald-500/40',
          lineColor: 'border-emerald-500/30',
        };
      default:
        return {
          icon: 'radio_button_checked',
          color: 'text-slate-400',
          bg: 'bg-slate-800 border-slate-700',
          lineColor: 'border-slate-800',
        };
    }
  };

  const formatTimestamp = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className={clsx('relative pl-6 space-y-6', className)}>
      {/* Vertical Connecting Line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-blue-500/40 via-amber-500/30 to-emerald-500/40" />

      {events.map((event, index) => {
        const config = getEventConfig(event.type);
        const isLatest = index === events.length - 1;

        return (
          <div key={event.id || index} className="relative group">
            {/* Node Icon */}
            <div
              className={clsx(
                'absolute -left-6 top-0 w-6 h-6 rounded-full border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110',
                config.bg
              )}
            >
              <span className={clsx('material-symbols-outlined text-[13px]', config.color)}>
                {config.icon}
              </span>
            </div>

            {/* Event Content Box */}
            <div className="ml-3 bg-surface-container-low/70 border border-white/[0.06] rounded-xl p-3.5 shadow-inner-keylight transition-colors hover:border-white/[0.12]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-semibold text-on-surface tracking-tight">
                  {event.title}
                </h4>
                <span className="text-[11px] font-mono text-outline">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {event.description}
              </p>

              {event.actorRole && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-outline">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span>
                  <span>Actor: {event.actorRole}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
