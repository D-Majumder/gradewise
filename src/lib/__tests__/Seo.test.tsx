import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { DEFAULT_OG_IMAGE, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_URL, Seo } from '../Seo'

/**
 * Verifies the Seo component always emits complete, absolute Open Graph and
 * Twitter Card metadata — this is what a non-JS-executing social crawler
 * (WhatsApp, Telegram, Discord) or the raw production HTML must contain.
 * react-helmet-async commits tags directly into document.head asynchronously
 * in a client render (its `context` prop is for server rendering only), so
 * we wait for a known tag to land there before inspecting the rest.
 */
async function renderSeo(props: Parameters<typeof Seo>[0]): Promise<string> {
  render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>,
  )
  await waitFor(() => expect(document.querySelector('link[rel="canonical"]')).not.toBeNull())
  return document.head.innerHTML
}

afterEach(() => {
  cleanup()
  document.head.innerHTML = ''
})

describe('Seo', () => {
  it('emits absolute canonical and og:url for the homepage', async () => {
    const html = await renderSeo({ title: 'Home', description: 'desc', path: '/' })
    expect(html).toContain(`href="${SITE_URL}/"`)
    expect(html).toContain(`content="${SITE_URL}/"`)
  })

  it('defaults og:image (and twitter:image) to the absolute site-wide banner with full dimensions', async () => {
    const html = await renderSeo({ title: 'Home', description: 'desc', path: '/' })
    expect(DEFAULT_OG_IMAGE).toBe(`${SITE_URL}/og-image.png`)
    expect(html).toContain(`property="og:image" content="${DEFAULT_OG_IMAGE}"`)
    expect(html).toContain(`property="og:image:width" content="${OG_IMAGE_WIDTH}"`)
    expect(html).toContain(`property="og:image:height" content="${OG_IMAGE_HEIGHT}"`)
    expect(html).toContain('property="og:image:type" content="image/png"')
    expect(html).toContain(`name="twitter:image" content="${DEFAULT_OG_IMAGE}"`)
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
  })

  it('builds an absolute, path-specific canonical URL for a non-root route', async () => {
    const html = await renderSeo({ title: 'Jadavpur University', description: 'desc', path: '/universities/jadavpur-university' })
    expect(html).toContain(`href="${SITE_URL}/universities/jadavpur-university"`)
  })

  it('appends the site name to a page title exactly once', async () => {
    const html = await renderSeo({ title: 'About', description: 'desc', path: '/about' })
    expect(html).toContain('<title>About | GradeWise</title>')
  })
})
