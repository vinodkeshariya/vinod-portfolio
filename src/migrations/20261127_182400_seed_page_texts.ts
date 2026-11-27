import { type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Moves the remaining page texts into the CMS — headings, intros, cards, buttons and Google titles that
 * were written in the page files (snapshot: ./seed/page-texts.json). Only the new "Page texts" fields are
 * written; content already edited in /admin is left as it is.
 */

type Json = Record<string, unknown>

// a new context object per call (Payload plugins write flags into it)
const ctx = () => ({ skipRevalidate: true })

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const seed: Record<string, Json> = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'seed', 'page-texts.json'), 'utf8'))

  // "@file:name.webp" → the id of that file in the Media library
  const names = new Set<string>()
  JSON.stringify(seed).replace(/"@file:([^"]+)"/g, (_, n: string) => (names.add(n), ''))
  const { docs } = await payload.find({ collection: 'media', where: { filename: { in: [...names] } }, depth: 0, pagination: false, req })
  const ids = new Map(docs.map((d) => [d.filename, d.id]))
  const link = (value: unknown): unknown => {
    if (typeof value === 'string' && value.startsWith('@file:')) {
      const id = ids.get(value.slice(6))
      if (!id) throw new Error(`[seed] media file ${value.slice(6)} not found`)
      return id
    }
    if (Array.isArray(value)) return value.map(link)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, link(v)]))
    return value
  }

  for (const [slug, data] of Object.entries(seed)) {
    await payload.updateGlobal({ slug: slug as never, data: link(data) as never, req, context: ctx() })
    payload.logger.info(`[seed] page texts: ${slug}`)
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('[seed] down: page texts are kept')
}
