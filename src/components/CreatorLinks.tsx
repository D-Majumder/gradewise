import { CREATOR } from '../lib/creator'
import { cn } from '../lib/cn'

interface LinkItem {
  label: string
  href: string
}

const linkClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--text)] underline decoration-[var(--text-faint)] decoration-1 underline-offset-4 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]'

export function CreatorLinks({ className }: { className?: string }) {
  const links: LinkItem[] = [
    { label: 'GitHub', href: CREATOR.githubProfile },
    ...(CREATOR.linkedin ? [{ label: 'LinkedIn', href: CREATOR.linkedin }] : []),
    ...(CREATOR.portfolio ? [{ label: 'Visit Portfolio →', href: CREATOR.portfolio }] : []),
  ]

  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      {links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer noopener" className={linkClass}>
          {link.label}
        </a>
      ))}
    </div>
  )
}
