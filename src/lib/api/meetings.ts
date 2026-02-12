import { ZCreateMeetingPayload, ZMeeting } from "@/types/meetings";
import axiosClient from "./axiosClient";
import { MEETING_ENDPOINTS } from "./endpoints";

interface MeetingRes {
  meetings: ZMeeting[];
}

/* ---------- Get meetings ---------- */
export async function fetchMeetings(
  filter: "my-meetings" | "all",
  force?: boolean,
) {
  const res: MeetingRes = await axiosClient.get(
    MEETING_ENDPOINTS.LIST(filter, force),
  );
  return res.meetings || [];
}

/* ---------- Get single meeting ---------- */
export async function getMeeting(meetingId: string) {
  const res: MeetingRes = await axiosClient.get(
    MEETING_ENDPOINTS.MEETING(meetingId),
  );
  return res.meeting || null;
}

/* ---------- Add participant ---------- */
export async function addParticipant(
  meetingId: string,
  payload: { userId: string },
) {
  return axiosClient.post(
    MEETING_ENDPOINTS.ADD_PARTICIPANT(meetingId),
    payload,
  );
}


/* ---------- Create meeting ---------- */
export async function createMeeting(payload: ZCreateMeetingPayload) {
  return axiosClient.post(
    MEETING_ENDPOINTS.BASE,
    payload
  );
}
