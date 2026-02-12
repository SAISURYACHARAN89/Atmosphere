import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJob } from "@/lib/api/jobs";
import { ZCreateJobPayload } from "@/types/misc";

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ZCreateJobPayload) =>
      createJob(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
