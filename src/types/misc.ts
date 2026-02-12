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



/* ---------- Poster ---------- */
export const zJobPosterSchema = z.object({
  _id: z.string(),
  username: z.string(),
  displayName: z.string(),
  roles: z.array(z.string()),
  verified: z.boolean(),
  fullName: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
}).nullable();

/* ---------- Job ---------- */
export const zJobSchema = z.object({
  _id: z.string(),

  poster: zJobPosterSchema.optional(),

  title: z.string(),
  startupName: z.string().optional(),
  sector: z.string(),
  locationType: z.string(),

  employmentType: z.string(),
  isRemote: z.boolean().optional(),

  compensation: z.string().optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),

  customQuestions: z.array(z.string()),

  applicationUrl: z.string().optional(),

  isVerifiedByAdmin: z.boolean().optional(),
  status: z.string().optional(),

  chatGroupId: z.string().optional(),

  applicantCount: z.number(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  __v: z.number(),
});

/* ---------- Jobs Response ---------- */
export const zJobsResponseSchema = z.object({
  jobs: z.array(zJobSchema),
  count: z.number(),
  total: z.number(),
});


export const zCreateJobPayload = z.object({
  title: z.string().min(1),

  startupName: z.string().optional(),
  sector: z.string().optional(),
  locationType: z.string().optional(),

  employmentType: z.string().optional(),
  isRemote: z.boolean().optional(),

  compensation: z.string().optional(),
  description: z.string().optional(),

  requirements: z.string().min(1),

  customQuestions: z.array(z.string()).optional(),

  applicationUrl: z.string().optional(),
});

export type ZCreateJobPayload = z.infer<typeof zCreateJobPayload>;
export type ZJobPoster = z.infer<typeof zJobPosterSchema>;
export type ZJob = z.infer<typeof zJobSchema>;
export type ZJobsResponse = z.infer<typeof zJobsResponseSchema>;
