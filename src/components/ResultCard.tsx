import type { ReactNode } from 'react'
import { Card } from './ui/Card'
import { cn } from '../lib/cn'
import { useAnimatedNumber } from '../hooks/useAnimatedNumber'
import { formatNumber } from '../engine/round'
import type { RuleStatus, RuleSource } from '../engine/types'

const STATUS_LABEL: Record<RuleStatus, string> = {
  official: 'Official formula',
  custom: 'Custom formula',
  unverified: 'Unverified formula',
}

const STATUS_CLASS: Record<RuleStatus, string> = {
  official: 'bg-[var(--success-soft)] text-[var(--success)]',
  custom: 'bg-[var(--accent-soft)] text-[var(--accent)]',
  unverified: 'bg-[var(--warning-soft)] text-[var(--warning)]',
}

export interface ResultCardProps {
  label: string
  value: number
  unit: string
  decimals?: number
  status?: RuleStatus
  source?: RuleSource
  formulaDisplay?: string
  children?: ReactNode
}

export function ResultCard({ label, value, unit, decimals = 2, status, source, formulaDisplay, children }: ResultCardProps) {
  const animated = useAnimatedNumber(value)

  return (
    <Card className="p-6 sm:p-8" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
        {status && (
          <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', STATUS_CLASS[status])}>
            {STATUS_LABEL[status]}
          </span>
        )}
      </div>

      <p className="mt-2 gw-tabular text-5xl font-bold tracking-tight text-[var(--text)] sm:text-6xl">
        {formatNumber(animated, decimals)}
        <span className="ml-2 text-2xl font-semibold text-[var(--text-muted)] sm:text-3xl">{unit}</span>
      </p>

      {formulaDisplay && (
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Formula used: <span className="gw-tabular font-medium text-[var(--text)]">{formulaDisplay}</span>
        </p>
      )}

      {source && (
        <p className="mt-1 text-xs text-[var(--text-faint)]">
          Source: {source.url ? (
            <a href={source.url} target="_blank" rel="noreferrer" className="underline decoration-dotted hover:text-[var(--accent)]">
              {source.title}
            </a>
          ) : (
            source.title
          )}
          {source.verifiedAt ? ` · verified ${source.verifiedAt}` : ''}
        </p>
      )}

      {status === 'unverified' && (
        <p className="mt-1 text-xs text-[var(--warning)]">
          This formula could not be verified against an official document. Please cross-check with your institution before relying on it.
        </p>
      )}

      {children && <div className="mt-4 border-t border-[var(--border)] pt-4">{children}</div>}
    </Card>
  )
}
