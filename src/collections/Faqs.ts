import type { CollectionConfig } from "payload";
import { afterChange, afterDelete } from "../cms/revalidate.ts";
import { para, text } from "../cms/fields.ts";

/** Questions and answers — the FAQ section and the site assistant's ready answers */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  orderable: true,
  admin: {
    group: "Content",
    useAsTitle: "question",
    defaultColumns: ["question", "answer"],
    description: "Drag to reorder. The first question is shown open.",
  },
  hooks: { afterChange: [afterChange], afterDelete: [afterDelete] },
  fields: [text("question", "Question"), para("answer", "Answer")],
};
