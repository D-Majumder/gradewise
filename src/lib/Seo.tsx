import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://d-majumder.github.io/gradewise'
const SITE_NAME = 'GradeWise'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630

export interface SeoProps {
  title: string
  description: string
  path: string // e.g. "/calculators/cgpa-to-percentage"
  /** Absolute image URL for social previews. Defaults to the site-wide OG banner. */
  image?: string
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  noindex?: boolean
}

export function Seo({ title, description, path, image, jsonLd, noindex }: SeoProps) {
  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(OG_IMAGE_HEIGHT)} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={`${SITE_NAME} — Your grades. Your university. Your percentage.`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdList.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT }
