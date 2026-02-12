import { createMeeting } from "@/lib/api/meetings";
import { ZCreateMeetingPayload } from "@/types/meetings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ZCreateMeetingPayload) =>
      createMeeting(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}
