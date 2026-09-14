import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://d-majumder.github.io/gradewise'
const SITE_NAME = 'GradeWise'

export interface SeoProps {
  title: string
  description: string
  path: string // e.g. "/calculators/cgpa-to-percentage"
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

export function Seo({ title, description, path, jsonLd, noindex }: SeoProps) {
  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {jsonLdList.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_URL, SITE_NAME }
