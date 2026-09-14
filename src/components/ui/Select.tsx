import type { SelectHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '../../lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
}

export function Select({ label, hint, className, id, children, ...rest }: SelectProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = hint ? `${fieldId}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <select
        id={fieldId}
        aria-describedby={hintId}
        className={cn(
          'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)]',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      {hint && (
        <p id={hintId} className="text-xs text-[var(--text-muted)]">
          {hint}
        </p>
      )}
    </div>
  )
}
