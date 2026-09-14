import { useTheme, type ThemePreference } from '../hooks/useTheme'
import { cn } from '../lib/cn'

const OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div role="radiogroup" aria-label="Theme" className="inline-flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={theme === opt.value}
          title={opt.label}
          onClick={() => setTheme(opt.value)}
          className={cn(
            'rounded-lg px-2.5 py-1.5 text-sm transition-colors',
            theme === opt.value
              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]',
          )}
        >
          <span aria-hidden="true">{opt.icon}</span>
          <span className="sr-only">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
