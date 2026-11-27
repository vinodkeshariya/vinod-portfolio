import type { CollectionConfig } from "payload";

/**
 * Admin users who can sign in to /admin.
 * The very first user is created at /admin/create-first-user; after that only signed-in admins can add users.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "updatedAt"],
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // stay signed in for 8 hours
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes after 5 wrong passwords
  },
  fields: [
    // email + password are added by `auth`
    { name: "name", type: "text" },
  ],
};
