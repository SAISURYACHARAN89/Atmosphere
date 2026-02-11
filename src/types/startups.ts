import { z } from "zod";

/* ---------- Stats ---------- */
export const zStartupStats = z.object({
  likes: z.number(),
  comments: z.number(),
  crowns: z.number(),
  shares: z.number(),
});

/* ---------- Financial Profile ---------- */
export const zFinancialProfile = z.object({
  stages: z.array(z.string()),
  revenueType: z.string(),
  fundingMethod: z.string(),
  fundingAmount: z.number().nullable(),
});

/* ---------- Funding Round ---------- */
export const zStartupRound = z.record(z.any());

/* ---------- Startup ---------- */
export const zStartup = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  verified: z.boolean(),

  profileImage: z.string().nullable(),
  video: z.string().nullable(),

  description: z.string(),

  stage: z.string(),
  currentRound: z.string(),

  financialProfile: zFinancialProfile,

  revenueType: z.string(),
  rounds: z.number(),

  age: z.number(),

  fundingRaised: z.number(),
  fundingNeeded: z.number(),

  fundingRounds: z.array(zStartupRound),
  totalRaisedAll: z.number(),

  stats: zStartupStats,

  likedByCurrentUser: z.boolean(),
  crownedByCurrentUser: z.boolean(),

  isFollowing: z.boolean(),

  isSaved: z.boolean(),
  savedId: z.string().nullable(),
});




export const zAuthorSchema = z.object({
  _id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const zCommentSchema = z.object({
  _id: z.string(),
  startup: z.string(),
  author: zAuthorSchema,
  text: z.string().nullable(),
  parent: z.string().nullable(),
  likesCount: z.number(),
  createdAt: z.string(), // or z.coerce.date()
  updatedAt: z.string(), // or z.coerce.date()
  __v: z.number(),
});

/* ---------- comments ---------- */
export type ZComment = z.infer<typeof zCommentSchema>;


/* ---------- List ---------- */
export const zStartupList = z.array(zStartup);

/* ---------- Types ---------- */
export type ZStartup = z.infer<typeof zStartup>;
export type ZStartupStats = z.infer<typeof zStartupStats>;
export type ZFinancialProfile = z.infer<typeof zFinancialProfile>;


/* ---------- User ---------- */
export const zStartupUserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  username: z.string(),
  displayName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

/* ---------- Team Member ---------- */
export const zTeamMemberSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  role: z.string().optional(),
  userId: z.string().optional(),
  _id: z.string(),
});

/* ---------- Funding Round ---------- */
export const zFundingRoundSchema = z.object({
  round: z.string(),
  amount: z.number(),
  investorName: z.string().optional(),
  doc: z.string().optional(),
  _id: z.string(),
});

/* ---------- Financial Profile ---------- */
export const zFinancialProfileSchema = z.object({
  revenueType: z.string().optional(),
  fundingMethod: z.string().optional(),
  fundingAmount: z.number().nullable().optional(),
  investorName: z.string().optional(),
  investorDoc: z.string().optional(),
  stages: z.array(z.string()).optional(),
});

/* ---------- Meta ---------- */
export const zStartupMetaSchema = z.object({
  likes: z.number().optional(),
  commentsCount: z.number().optional(),
  crowns: z.number().optional(),
});

/* ---------- Weekly Counts ---------- */
export const zWeekCountsSchema = z.object({
  crowns: z.number(),
  likes: z.number(),
  comments: z.number(),
  shares: z.number(),
});

/* ---------- Startup ---------- */
export const zStartupSchema = z.object({
  _id: z.string(),
  user: zStartupUserSchema,

  companyName: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  companyType: z.string().optional(),
  address: z.string().optional(),

  establishedOn: z.string().optional(),
  website: z.string().optional(),
  video: z.string().optional(),
  documents: z.string().optional(),

  teamMembers: z.array(zTeamMemberSchema).optional(),
  fundingRounds: z.array(zFundingRoundSchema).optional(),
  financialProfile: zFinancialProfileSchema.optional(),

  verified: z.boolean().optional(),
  profileImage: z.string().optional(),

  stage: z.string().optional(),
  rounds: z.number().optional(),
  age: z.number().optional(),

  fundingRaised: z.number().optional(),
  fundingNeeded: z.number().optional(),
  totalRaisedAll: z.number().optional(),

  likesCount: z.number().optional(),

  previousInvestments: z.array(z.any()).optional(),

  meta: zStartupMetaSchema.optional(),
  weekCounts: zWeekCountsSchema.optional(),

  score: z.number().optional(),

  launchDate: z.string().optional(),
  launchDateTs: z.number().optional(),

  likedByCurrentUser: z.boolean().optional(),
  crownedByCurrentUser: z.boolean().optional(),
  isFollowing: z.boolean().optional(),

  revenueType: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

/* ---------- Week Info ---------- */
export const zWeekInfoSchema = z.object({
  currentWeek: z.number(),
  selectedWeek: z.number(),
  month: z.number(),
  year: z.number(),
});

/* ---------- Response ---------- */
export const zHottestStartupsResponseSchema = z.object({
  startups: z.array(zStartupSchema),
  count: z.number(),
  weekInfo: zWeekInfoSchema,
});

/* ---------- Types ---------- */
export type ZTopStartup = z.infer<typeof zStartupSchema>;
