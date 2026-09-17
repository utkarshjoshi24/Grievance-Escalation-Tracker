import React from 'react';
import clsx from 'clsx';

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-primary-container hover:bg-blue-600 text-on-primary-container font-semibold shadow-inner-keylight shadow-glow-electric border border-blue-400/30 focus:ring-primary-container',
      secondary:
        'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/60 hover:border-outline focus:ring-outline',
      outline:
        'bg-transparent hover:bg-surface-container-high/60 text-on-surface border border-outline-variant hover:border-primary/60 focus:ring-primary',
      ghost:
        'bg-transparent hover:bg-surface-container-high/50 text-on-surface-variant hover:text-on-surface focus:ring-outline-variant',
      danger:
        'bg-red-600/90 hover:bg-red-500 text-white shadow-glow-ruby border border-red-500/40 focus:ring-red-500',
      success:
        'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-glow-emerald border border-emerald-500/40 focus:ring-emerald-500',
      electric:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-electric border border-blue-400/40 font-medium',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
      md: 'px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'px-6 py-2.5 text-base rounded-xl gap-2.5',
      icon: 'p-2 rounded-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="material-symbols-outlined text-base animate-spin">
            progress_activity
          </span>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="material-symbols-outlined text-lg leading-none">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="material-symbols-outlined text-lg leading-none">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
