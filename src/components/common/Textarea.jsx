import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

const Textarea = forwardRef(function Textarea(
  { className, label, error, rows = 4, id, ...props },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-y',
          'dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:ring-blue-400/30 dark:focus:border-blue-400',
          error
            ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500 dark:border-red-500'
            : 'border-gray-300 dark:border-gray-600',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${textareaId}-error`}
          className="mt-1.5 text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export { Textarea };
export default Textarea;
