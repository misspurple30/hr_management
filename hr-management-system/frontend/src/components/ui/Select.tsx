import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export default function Select({ label, error, id, children, className = '', ...props }: SelectProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border bg-white text-sm text-neutral-900 px-3.5 py-2.5 transition-colors duration-150 ${
          error
            ? 'border-error-500 focus:ring-2 focus:ring-error-500/20 focus:border-error-500'
            : 'border-neutral-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
        } disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-error-600">{error}</p>}
    </div>
  );
}
