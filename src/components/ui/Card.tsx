import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn('rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
