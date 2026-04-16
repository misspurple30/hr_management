import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export default function Input({ label, error, icon, id, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full rounded-lg border bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 ${
            icon ? 'pl-10 pr-4' : 'px-3.5'
          } py-2.5 ${
            error
              ? 'border-error-500 focus:ring-2 focus:ring-error-500/20 focus:border-error-500'
              : 'border-neutral-300 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500'
          } disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed outline-none ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-error-600">{error}</p>}
    </div>
  );
}
