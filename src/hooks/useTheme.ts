import { createContext, useContext, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'gradewise-theme'

export function getStoredTheme(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // localStorage may be unavailable (private mode, disabled storage) — fall back silently.
  }
  return 'system'
}

export function applyTheme(pref: ThemePreference) {
  const root = document.documentElement
  if (pref === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', pref)
  }
}

interface ThemeContextValue {
  theme: ThemePreference
  setTheme: (t: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeState(): ThemeContextValue {
  const [theme, setThemeState] = useState<ThemePreference>(() => getStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore storage failures
    }
  }, [theme])

  const setTheme = (t: ThemePreference) => setThemeState(t)

  return { theme, setTheme }
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeContext.Provider')
  return ctx
}
