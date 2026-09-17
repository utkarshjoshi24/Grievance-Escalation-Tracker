import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-container-low border-white/[0.07]',
    surface: 'bg-surface-container border-white/[0.08]',
    high: 'bg-surface-container-high border-white/[0.10]',
    elevated: 'bg-surface-2 border-white/[0.07] shadow-xl',
    glass: 'bg-surface-container-low/80 backdrop-blur-md border-white/[0.08]',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border shadow-inner-keylight p-5 transition-all duration-200',
        variants[variant],
        hoverable && 'hover:border-white/20 hover:bg-surface-container hover:shadow-glow-electric/20 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className }) => (
  <div className={clsx('flex items-start justify-between gap-4 mb-4', className)}>
    <div>
      {title && <h3 className="text-base font-semibold text-on-surface tracking-tight">{title}</h3>}
      {subtitle && <p className="text-xs text-outline mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default Card;
