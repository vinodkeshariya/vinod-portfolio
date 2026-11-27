import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Faqs } from "./collections/Faqs.ts";
import { Media } from "./collections/Media.ts";
import { Posts } from "./collections/Posts.ts";
import { Projects } from "./collections/Projects.ts";
import { Users } from "./collections/Users.ts";
import { AboutPage } from "./globals/AboutPage.ts";
import { ContactPage } from "./globals/ContactPage.ts";
import { HomePage } from "./globals/HomePage.ts";
import { ServicesPage } from "./globals/ServicesPage.ts";
import { SiteSettings } from "./globals/SiteSettings.ts";

/**
 * Payload CMS — admin at /admin, REST at /api/<collection>, GraphQL at /api/graphql.
 * Every text, project, service, FAQ and blog post on the site is edited here; the pages read it
 * through src/lib/content.ts and src/lib/blog.ts, and refresh by themselves after each change.
 *
 * Environment variables:
 *   DATABASE_URL            Neon PostgreSQL connection string (required)
 *   PAYLOAD_SECRET          long random string that signs login tokens (required)
 *   BLOB_READ_WRITE_TOKEN   Vercel Blob store token — uploads go there when set (required on Vercel)
 */

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " — Vinod Keshariya CMS",
      icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }],
    },
  },
  collections: [Posts, Projects, Faqs, Media, Users],
  globals: [SiteSettings, HomePage, AboutPage, ServicesPage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    migrationDir: path.resolve(dirname, "migrations"),
    // Local development and the live site share the Neon database, so the schema only ever
    // changes through migrations (npm run migrate:create / npm run migrate) — never automatically.
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // keep the plugin's fields (e.g. `prefix`) in the schema even when the token is missing locally,
      // so migrations made on a laptop match the live database
      alwaysInsertFields: true,
      // file URLs point straight at the Blob CDN (media is public anyway) instead of going through /api/media/file
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: true, // large files go straight from the browser to Blob (Vercel limits request bodies to 4.5 MB)
    }),
  ],
});
