import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./collections/Media.ts";
import { Users } from "./collections/Users.ts";

/**
 * Payload CMS — admin at /admin, REST at /api/<collection>, GraphQL at /api/graphql.
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
  collections: [Users, Media],
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
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: true, // large files go straight from the browser to Blob (Vercel limits request bodies to 4.5 MB)
    }),
  ],
});
