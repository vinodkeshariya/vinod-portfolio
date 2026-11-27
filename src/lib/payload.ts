import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";

/**
 * Payload Local API for server components, route handlers and server actions —
 * reads the database directly, no HTTP round trip.
 *
 *   const payload = await getPayloadClient();
 *   const { docs } = await payload.find({ collection: "media", limit: 10 });
 */
export function getPayloadClient() {
  return getPayload({ config });
}
