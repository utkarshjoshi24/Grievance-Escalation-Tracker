import React from 'react';
import clsx from 'clsx';
import Button from './Button';

export const EmptyState = ({
  icon = 'inbox',
  title = 'No Grievances Found',
  description = 'There are no records matching your current filter criteria.',
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center p-10 bg-surface-container-low/60 border border-white/[0.05] rounded-2xl border-dashed',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-outline mb-4 border border-outline-variant/40">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h4 className="text-base font-semibold text-on-surface tracking-tight mb-1">
        {title}
      </h4>
      <p className="text-xs text-outline max-w-sm leading-relaxed mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} icon="add">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const LoadingState = ({ message = 'Loading institutional records...', className }) => {
  return (
    <div className={clsx('flex flex-col items-center justify-center p-12 space-y-3', className)}>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-mono text-outline tracking-wider uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
