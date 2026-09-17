import React from 'react';
import clsx from 'clsx';
import { STATUS_CONFIG } from '../../utils/constants';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className,
  dot = false,
  dotColor,
}) => {
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant border-outline-variant/50',
    primary: 'bg-blue-950/60 text-blue-300 border-blue-500/30',
    secondary: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    success: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    danger: 'bg-red-950/60 text-red-300 border-red-500/30',
    outline: 'bg-transparent text-outline border-outline-variant',
    subtle: 'bg-surface-2 text-on-surface-variant border-hairline-base',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] gap-1 font-medium',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            dotColor || 'bg-current'
          )}
        />
      )}
      {icon && (
        <span className="material-symbols-outlined text-[14px] leading-none">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export const StatusBadge = ({ status = 'Pending', size = 'md', showIcon = true, className }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-mono tracking-tight font-medium',
        config.bg,
        config.color,
        config.border,
        size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1.5' : 'px-2.5 py-1 text-xs gap-1.5',
        className
      )}
      title={config.description}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      {showIcon && config.icon && (
        <span className="material-symbols-outlined text-[13px] leading-none opacity-80">
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default Badge;
