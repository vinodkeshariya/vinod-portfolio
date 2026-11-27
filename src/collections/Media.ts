import type { CollectionConfig } from "payload";

/**
 * Uploaded images and documents. Files go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set
 * (see payload.config.ts), otherwise to the local /media folder during development.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true, // files are public, like any image on the website
  },
  admin: {
    useAsTitle: "alt",
  },
  upload: {
    mimeTypes: ["image/*", "application/pdf"],
    focalPoint: true,
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 800 },
      { name: "wide", width: 1600 },
    ],
  },
  fields: [
    {
      name: "alt",
      label: "Description (alt text)",
      type: "text",
      required: true,
      admin: { description: "What the image shows — used by screen readers and Google." },
    },
  ],
};
