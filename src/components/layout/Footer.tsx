import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/developer', label: 'Developer' },
  { to: '/report', label: 'Report an issue' },
  { to: '/privacy', label: 'Privacy' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          GradeWise is a free, client-side academic conversion tool. It does not store, transmit, or collect any of
          your marks, grades, or results — everything runs in your browser.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2">
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-[var(--text)] hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
