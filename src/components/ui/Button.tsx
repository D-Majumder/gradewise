import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--accent)] text-[var(--accent-text)] hover:bg-[var(--accent-hover)] border-transparent shadow-sm',
  secondary: 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] border-[var(--border)]',
  ghost: 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] border-transparent',
  danger: 'bg-[var(--danger)] text-white hover:opacity-90 border-transparent',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3.5 rounded-xl gap-2',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium border transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
