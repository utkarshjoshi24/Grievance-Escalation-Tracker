import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { SLA_STATES } from '../../utils/constants';

export const SLACountdown = ({
  deadline,
  totalHours = 48,
  compact = false,
  showProgress = true,
  className,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    percentLeft: 100,
    totalRemainingHours: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!deadline) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: false, percentLeft: 100, totalRemainingHours: 0 });
        return;
      }

      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          percentLeft: 0,
          totalRemainingHours: 0,
        });
        return;
      }

      const totalRemainingHours = diff / (1000 * 60 * 60);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const percent = Math.min(100, Math.max(0, (totalRemainingHours / (totalHours || 48)) * 100));

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
        percentLeft: percent,
        totalRemainingHours,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline, totalHours]);

  // Determine SLA Health State
  let slaState = SLA_STATES.HEALTHY;
  if (timeLeft.isExpired) {
    slaState = SLA_STATES.EXPIRED;
  } else if (timeLeft.totalRemainingHours <= 6) {
    slaState = SLA_STATES.DUE_SOON;
  }

  if (compact) {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium',
          slaState.bg,
          slaState.color,
          slaState.border,
          className
        )}
      >
        <span className="material-symbols-outlined text-[13px] leading-none">
          {slaState.icon}
        </span>
        <span>
          {timeLeft.isExpired
            ? 'SLA Breached'
            : `${timeLeft.hours}h ${timeLeft.minutes}m`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'p-4 rounded-xl border transition-all duration-200',
        slaState.bg,
        slaState.border,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={clsx('material-symbols-outlined text-lg', slaState.color)}>
            {slaState.icon}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            {slaState.label}
          </span>
        </div>
        <div className={clsx('text-xs font-mono font-bold', slaState.color)}>
          {timeLeft.isExpired ? (
            <span className="animate-pulse">OVERDUE</span>
          ) : (
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      {showProgress && (
        <div className="space-y-1">
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-500 rounded-full',
                timeLeft.isExpired
                  ? 'bg-red-500 w-full'
                  : timeLeft.totalRemainingHours <= 6
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              )}
              style={{
                width: timeLeft.isExpired ? '100%' : `${timeLeft.percentLeft}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-outline">
            <span>Window: {totalHours}h SLA</span>
            <span>
              {timeLeft.isExpired
                ? 'Escalation Alert Active'
                : `${Math.round(timeLeft.percentLeft)}% window remains`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLACountdown;
