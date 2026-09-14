import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../../lib/cn'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
  suffix?: ReactNode
}

export function Field({ label, hint, error, suffix, className, id, ...rest }: FieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-[var(--text)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          aria-describedby={cn(hintId, errorId) || undefined}
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-[var(--text)] gw-tabular',
            'placeholder:text-[var(--text-faint)] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)]',
            error ? 'border-[var(--danger)]' : 'border-[var(--border)]',
            suffix ? 'pr-12' : '',
            className,
          )}
          {...rest}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-faint)]">
            {suffix}
          </span>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--text-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  )
}
