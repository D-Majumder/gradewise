/**
 * Single source of truth for creator/attribution links, used by the About and Developer pages.
 * Portfolio and LinkedIn are not hardcoded because no real URL for either exists in this repo —
 * set them via environment variables (see .env.example) rather than adding a placeholder link
 * that would go live pointing nowhere. Until set, those links simply don't render.
 */
export const CREATOR = {
  name: 'Dhruba Majumder',
  githubProfile: 'https://github.com/D-Majumder',
  repo: 'https://github.com/D-Majumder/gradewise',
  linkedin: import.meta.env.VITE_LINKEDIN_URL?.trim() || '',
  portfolio: import.meta.env.VITE_PORTFOLIO_URL?.trim() || '',
}
