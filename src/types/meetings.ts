import { z } from "zod";

/* ---------- Participant ---------- */
export const zParticipantSchema = z.object({
  userId: z.string(),
  status: z.string(),
});

/* ---------- Create Meeting ---------- */
export const zCreateMeetingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),

  scheduledAt: z.string(),
  startTime: z.string(),
  endTime: z.string(),

  duration: z.number(),

  location: z.string().optional(),

  participants: z.array(zParticipantSchema),

  meetingType: z.string(),

  category: z.string().optional(),
  pitchDuration: z.number().optional(),
  participantType: z.string().optional(),
  verifiedOnly: z.string().optional(),

  industries: z.array(z.string()).optional(),

  maxParticipants: z.number().optional(),
});


/* ---------- Organizer ---------- */
export const zOrganizerSchema = z.object({
  _id: z.string(),
  username: z.string(),
  verified: z.boolean(),
  avatarUrl: z.string().optional(),
});


/* ---------- Meeting Response ---------- */
export const zMeetingSchema = z.object({
  _id: z.string(),

  organizer: zOrganizerSchema,

  title: z.string(),
  description: z.string().optional(),

  scheduledAt: z.string(),
  startTime: z.string(),
  endTime: z.string(),

  duration: z.number(),

  meetingType: z.string(),
  category: z.string().optional(),

  pitchDuration: z.number().optional(),
  participantType: z.string().optional(),
  verifiedOnly: z.boolean().optional(),

  industries: z.array(z.string()).optional(),
  maxParticipants: z.number().optional(),

  participants: z.array(zParticipantSchema),
  participantsCount: z.number(),

  location: z.string().optional(),
  meetingLink: z.string(),

  type: z.string(),
  status: z.string(),

  reminderSent: z.boolean(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ---------- Types ---------- */
export type ZMeeting = z.infer<typeof zMeetingSchema>;
export type ZCreateMeetingPayload = z.infer<typeof zCreateMeetingSchema>;
