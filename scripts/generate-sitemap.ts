import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { institutions } from '../src/data/institutions'

const SITE_URL = 'https://d-majumder.github.io/gradewise'

const staticPaths = ['/', '/universities', '/methodology', '/about', '/developer', '/report', '/privacy']
const universityPaths = institutions.map((inst) => `/universities/${inst.id}`)
const allPaths = [...staticPaths, ...universityPaths]

const body = allPaths.map((path) => `  <url><loc>${SITE_URL}${path === '/' ? '/' : path}</loc></url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

const outPath = resolve(import.meta.dirname, '../public/sitemap.xml')
writeFileSync(outPath, xml)
console.log(`Wrote ${allPaths.length} URLs to ${outPath}`)
