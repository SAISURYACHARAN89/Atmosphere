import { z } from "zod";
import { ZComment } from "./startups";

export const zChangePasswordResponse = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ZChangePasswordResponse = z.infer<typeof zChangePasswordResponse>;


export interface ZGetCommentsRes{
  comments: ZComment[];
} 

/* ---------- Grant ---------- */
export const zGrantSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),

  organization: z.string().optional(),
  amount: z.number().optional(),

  location: z.string().optional(),
  deadline: z.string().optional(),

  link: z.string().url().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});


export const zEventSchema = z.object({
  _id: z.string(),
  name: z.string(),
  organizer: z.string(),
  location: z.string(),
  date: z.string(), // ISO string
  time: z.string(),
  description: z.string(),
  url: z.string().url(),
  createdBy: z.string(),
  createdAt: z.string(),
  __v: z.number().optional(),
});

export type ZEvent = z.infer<typeof zEventSchema>;



/* ---------- Types ---------- */
export type ZGrant = z.infer<typeof zGrantSchema>;