import type { Field } from "payload";
import { ICON_NAMES } from "../lib/icons.ts";

/**
 * Small field builders shared by the collections and globals.
 * Imports use relative paths with .ts extensions so the Payload CLI can load the config with Node's own
 * TypeScript support (see package.json → "payload" scripts).
 */

/** A list of short items edited as plain text, one per line (bullet points, tags, tools…) */
export function lines(name: string, label: string, description = "One per line."): Field {
  return { name, label, type: "textarea", admin: { description, rows: 6 } };
}

/** Choose one of the site's icons */
export function icon(name = "icon", label = "Icon"): Field {
  return {
    name,
    label,
    type: "select",
    required: true,
    options: ICON_NAMES.map((v) => ({ label: v, value: v })),
    admin: { description: "Icon shown next to this item." },
  };
}

/** Required single-line text */
export const text = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: "text",
  required: true,
  ...(description && { admin: { description } }),
});

/** Required multi-line text */
export const para = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: "textarea",
  required: true,
  ...(description && { admin: { description } }),
});

/** An image from the Media library */
export const image = (name: string, label: string, required = true, description?: string): Field => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
  required,
  ...(description && { admin: { description } }),
});
