import React from 'react';
import clsx from 'clsx';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10 border-primary/20',
  trend,
  trendPositive = true,
  badgeText,
  badgeVariant = 'default',
  accentBorder = null, // 'red' | 'amber' | 'blue' | 'emerald'
  className,
}) => {
  const accentBorders = {
    red: 'border-l-4 border-l-red-500',
    amber: 'border-l-4 border-l-amber-500',
    blue: 'border-l-4 border-l-blue-500',
    emerald: 'border-l-4 border-l-emerald-500',
  };

  return (
    <div
      className={clsx(
        'relative bg-surface-container-low border border-white/[0.07] rounded-xl p-5 shadow-inner-keylight transition-all duration-200 hover:border-white/[0.14] group overflow-hidden',
        accentBorder && accentBorders[accentBorder],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-outline">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight font-mono">
              {value}
            </span>
            {badgeText && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-on-surface-variant font-medium">
                {badgeText}
              </span>
            )}
          </div>
        </div>

        {icon && (
          <div
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center border shrink-0',
              iconBg,
              iconColor
            )}
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs">
          {subtitle && <span className="text-outline">{subtitle}</span>}
          {trend && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 font-medium ml-auto',
                trendPositive ? 'text-emerald-400' : 'text-red-400'
              )}
            >
              <span className="material-symbols-outlined text-sm leading-none">
                {trendPositive ? 'trending_up' : 'trending_down'}
              </span>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
