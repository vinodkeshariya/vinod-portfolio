import { type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Moves the site's existing content into the CMS — the texts, projects, services, FAQs and blog posts that
 * used to live in src/lib/data.ts and content/blog/*.md (snapshot: ./seed/content.json).
 * Images and the résumé are uploaded from /public to the Media library (Vercel Blob on the live site).
 * Runs once, on the first deploy after the move; after that the content is edited in /admin.
 */

type Seed = {
  media: { key: string; file: string; alt: string }[]
  siteSettings: Record<string, unknown>
  homePage: Record<string, unknown>
  aboutPage: Record<string, unknown>
  servicesPage: Record<string, unknown>
  contactPage: Record<string, unknown>
  projects: Record<string, unknown>[]
  faqs: Record<string, unknown>[]
  posts: Record<string, unknown>[]
}

const ROOT = path.resolve(import.meta.dirname, '..', '..')
const TYPES: Record<string, string> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf' }
// The hooks that refresh the live pages have nothing to refresh while deploying.
// A NEW object for every call: Payload's storage plugin writes flags into the request context, and a
// shared object would carry its "skip upload" flag into the next file (only the first file reached Blob).
const ctx = () => ({ skipRevalidate: true })

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const seed: Seed = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'seed', 'content.json'), 'utf8'))

  // 1. files → Media library
  const ids = new Map<string, number>()
  const urls = new Map<string, string>()
  for (const m of seed.media) {
    const data = fs.readFileSync(path.join(ROOT, m.file))
    const ext = path.extname(m.file).toLowerCase()
    // readable, unique file names: projects/fashion-catalog/cover → fashion-catalog-cover.webp
    const name = m.key.replace(/^projects\//, '').replace(/\//g, '-') + ext
    const doc = await payload.create({
      collection: 'media',
      data: { alt: m.alt },
      file: { data, mimetype: TYPES[ext] ?? 'application/octet-stream', name, size: data.length },
      req,
      context: ctx(),
    })
    ids.set(m.key, doc.id)
    urls.set(m.key, doc.url ?? '')
    payload.logger.info(`[seed] media ${name}`)
  }

  /** "@media:key" → the file's id (upload fields) */
  const link = <T>(value: T): T => {
    if (typeof value === 'string' && value.startsWith('@media:')) {
      const id = ids.get(value.slice(7))
      if (!id) throw new Error(`[seed] unknown media ${value}`)
      return id as T
    }
    if (Array.isArray(value)) return value.map(link) as T
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, link(v)])) as T
    return value
  }
  /** "(@media:key" inside Markdown → the file's URL */
  const inline = (md: string) => md.replace(/\(@media:([^\s)]+)/g, (_, key: string) => `(${urls.get(key) ?? key}`)

  // 2. pages and settings
  await payload.updateGlobal({ slug: 'site-settings', data: link(seed.siteSettings), req, context: ctx() })
  await payload.updateGlobal({ slug: 'home-page', data: link(seed.homePage), req, context: ctx() })
  await payload.updateGlobal({ slug: 'about-page', data: link(seed.aboutPage), req, context: ctx() })
  await payload.updateGlobal({ slug: 'services-page', data: link(seed.servicesPage), req, context: ctx() })
  await payload.updateGlobal({ slug: 'contact-page', data: link(seed.contactPage), req, context: ctx() })

  // 3. collections, in their original order
  for (const p of seed.projects) await payload.create({ collection: 'projects', data: link(p) as never, req, context: ctx() })
  for (const f of seed.faqs) await payload.create({ collection: 'faqs', data: f as never, req, context: ctx() })
  for (const p of seed.posts) {
    const data = link({ ...p, content: inline(String(p.content)), source: 'manual', _status: 'published' })
    await payload.create({ collection: 'posts', data: data as never, draft: false, req, context: ctx() })
  }
  payload.logger.info(
    `[seed] ${seed.media.length} files, ${seed.projects.length} projects, ${seed.faqs.length} FAQs, ${seed.posts.length} blog posts and the page settings are in the CMS`,
  )
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // content is never removed automatically — delete it in /admin if needed
  payload.logger.info('[seed] down: nothing to undo automatically')
}
