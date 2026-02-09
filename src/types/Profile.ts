import { z } from "zod";
import { zUserSchema } from "./auth";

export const zGetProfileResponse = z.object({
  details: z.unknown(),
  user: zUserSchema,
});


export const zUploadResponseSchema = z.object({
  success: z.boolean(),
  url: z.string().url(),
  key: z.string(),
});

export const zSettingsUser = z.object({
  avatarUrl: z.string().url().nullable().optional(),
  displayName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  username: z.string(),
});

export type ZSettingsUser = z.infer<typeof zSettingsUser>;
export type ZUploadResponse = z.infer<typeof zUploadResponseSchema>;
export type ZGetProfileResponse = z.infer<typeof zGetProfileResponse>;
