import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconRight,
      className,
      id,
      required,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-on-surface-variant tracking-wide"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-outline pointer-events-none flex items-center">
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            required={required}
            className={clsx(
              'w-full bg-surface-container-high/80 text-on-surface placeholder:text-outline/60 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container',
              icon ? 'pl-9' : 'pl-3.5',
              iconRight ? 'pr-9' : 'pr-3.5',
              'py-2.5',
              error
                ? 'border-red-500/70 focus:ring-red-500 focus:border-red-500 bg-red-950/10'
                : 'border-outline-variant/60 hover:border-outline-variant',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3 text-outline pointer-events-none flex items-center">
              <span className="material-symbols-outlined text-lg">{iconRight}</span>
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>}
        {helperText && !error && (
          <p className="text-[11px] text-outline">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      className,
      id,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-on-surface-variant tracking-wide"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          required={required}
          className={clsx(
            'w-full bg-surface-container-high/80 text-on-surface placeholder:text-outline/60 text-sm rounded-lg border px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container resize-y',
            error
              ? 'border-red-500/70 focus:ring-red-500 focus:border-red-500 bg-red-950/10'
              : 'border-outline-variant/60 hover:border-outline-variant',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>}
        {helperText && !error && (
          <p className="text-[11px] text-outline">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      icon,
      className,
      id,
      required,
      placeholder = 'Select an option...',
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-on-surface-variant tracking-wide"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-outline pointer-events-none flex items-center">
              <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={clsx(
              'w-full appearance-none bg-surface-container-high text-on-surface text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container cursor-pointer',
              icon ? 'pl-9' : 'pl-3.5',
              'pr-10 py-2.5',
              error
                ? 'border-red-500/70 focus:ring-red-500 focus:border-red-500'
                : 'border-outline-variant/60 hover:border-outline-variant',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-surface-2 text-outline">
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={value} value={value} className="bg-surface-2 text-on-surface">
                  {label}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 text-outline pointer-events-none flex items-center">
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </div>
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>}
        {helperText && !error && (
          <p className="text-[11px] text-outline">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Input;
