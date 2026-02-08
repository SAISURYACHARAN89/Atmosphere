import { z } from "zod";

/* ---------- Media ---------- */
export const zMediaSchema = z.object({
  _id: z.string(),
  url: z.string().url(),
  type: z.string(),
});

/* ---------- Author ---------- */
export const zAuthorSchema = z.object({
  _id: z.string(),
  username: z.string(),
  verified: z.boolean(),
});

/* ---------- Post ---------- */
export const zPostSchema = z.object({
  _id: z.string(),
  author: zAuthorSchema,
  content: z.string(),
  media: z.array(zMediaSchema).default([]),
  visibility: z.string(),
  likesCount: z.number(),
  commentsCount: z.number(),
  sharesCount: z.number(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

/* ---------- Response ---------- */
export const zMyPostsResponseSchema = z.object({
  posts: z.array(zPostSchema),
  count: z.number(),
});

export type ZMedia = z.infer<typeof zMediaSchema>;
export type ZAuthor = z.infer<typeof zAuthorSchema>;
export type ZPost = z.infer<typeof zPostSchema>;
export type ZMyPostsResponse = z.infer<typeof zMyPostsResponseSchema>;
