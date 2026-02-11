import { z } from "zod";

const zUserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  displayName: z.string(),
  verified: z.boolean(),
  avatarUrl: z.string().url().optional().nullable(),
  isFollowing: z.boolean(),
});

/* ---------- Reel ---------- */
export const zReelSchema = z.object({
  _id: z.string(),

  author: zUserSchema,

  videoUrl: z.string().url(),
  thumbnailUrl: z.string().url(),

  caption: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),

  likesCount: z.number(),
  commentsCount: z.number(),
  viewsCount: z.number(),
  sharesCount: z.number(),

  duration: z.number(),

  visibility: z.enum(["public", "private", "followers"]).default("public"),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  __v: z.number().optional(),

  isLiked: z.boolean(),
  isSaved: z.boolean(),
  savedId: z.string().nullable(),

  isFollowing: z.boolean(),
});
/* ---------- Types ---------- */
export type ZReel = z.infer<typeof zReelSchema>;
