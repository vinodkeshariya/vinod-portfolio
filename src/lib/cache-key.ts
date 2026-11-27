import "server-only";
import { createHash } from "node:crypto";

/**
 * Extra parts for the CMS cache keys (unstable_cache keeps its entries across builds and restarts):
 * the deployment, so a new deploy never reads entries cached by an older one, and the database,
 * so pointing DATABASE_URL somewhere else (e.g. a test database) never shows the other one's content.
 */
export const cmsCacheKey = [
  process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  createHash("sha256").update(process.env.DATABASE_URL ?? "").digest("hex").slice(0, 12),
];
