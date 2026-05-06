import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Lightweight Select that matches shadcn's Select API surface for our needs.
 * Uses a styled native <select> for simplicity, full keyboard accessibility,
 * and zero runtime overhead. Can be swapped for Radix Select later without
 * touching consumers.
 */
const Select = forwardRef(
  (
    {
      className,
      children,
      placeholder,
      value,
      onValueChange,
      onChange,
      disabled,
      error,
      ...props
    },
    ref
  ) => {
    const handleChange = (e) => {
      if (onValueChange) onValueChange(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          value={value ?? ''}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'block h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all',
            'dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-blue-400/30 dark:focus:border-blue-400',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500 dark:border-red-500'
              : 'border-gray-300 dark:border-gray-600',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = 'Select';

const SelectItem = forwardRef(({ className, children, value, ...props }, ref) => (
  <option ref={ref} value={value} className={className} {...props}>
    {children}
  </option>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };
