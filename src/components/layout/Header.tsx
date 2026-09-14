import { NavLink } from 'react-router-dom'
import { ThemeToggle } from '../ThemeToggle'
import { cn } from '../../lib/cn'

const NAV_LINKS = [
  { to: '/', label: 'Calculator', end: true },
  { to: '/universities', label: 'Universities' },
  { to: '/methodology', label: 'Methodology' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-[var(--text)]" aria-label="GradeWise home">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-sm font-extrabold text-[var(--accent-text)]"
            aria-hidden="true"
          >
            G
          </span>
          GradeWise
        </NavLink>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </div>

      <nav aria-label="Primary" className="flex items-center gap-1 overflow-x-auto border-t border-[var(--border)] px-4 py-2 sm:hidden">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
