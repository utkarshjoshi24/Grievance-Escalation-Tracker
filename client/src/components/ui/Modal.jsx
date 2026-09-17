import React, { useEffect } from 'react';
import clsx from 'clsx';
import Button from './Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={clsx(
          'relative w-full bg-surface-container border border-white/[0.12] rounded-2xl shadow-2xl p-6 z-10 animate-slide-up max-h-[90vh] flex flex-col',
          maxWidth
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-lg font-semibold text-on-surface tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-outline mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl leading-none">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 overflow-y-auto custom-scrollbar flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const Alert = ({
  type = 'info', // 'info' | 'warning' | 'error' | 'success'
  title,
  children,
  icon,
  className,
  onClose,
}) => {
  const types = {
    info: {
      bg: 'bg-blue-950/30 border-blue-500/30 text-blue-300',
      iconDefault: 'info',
      iconColor: 'text-blue-400',
    },
    warning: {
      bg: 'bg-amber-950/30 border-amber-500/30 text-amber-300',
      iconDefault: 'warning',
      iconColor: 'text-amber-400',
    },
    error: {
      bg: 'bg-red-950/30 border-red-500/30 text-red-300',
      iconDefault: 'error',
      iconColor: 'text-red-400',
    },
    success: {
      bg: 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300',
      iconDefault: 'check_circle',
      iconColor: 'text-emerald-400',
    },
  };

  const config = types[type] || types.info;

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border text-xs leading-relaxed',
        config.bg,
        className
      )}
    >
      <span className={clsx('material-symbols-outlined text-lg shrink-0 mt-0.5', config.iconColor)}>
        {icon || config.iconDefault}
      </span>
      <div className="flex-1 space-y-0.5">
        {title && <h5 className="font-semibold text-on-surface text-xs">{title}</h5>}
        <div className="text-on-surface-variant text-[13px]">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-outline hover:text-on-surface p-0.5 rounded transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </div>
  );
};

export default Modal;
