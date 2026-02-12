import { fetchMeetings } from "@/lib/api/meetings";
import { useQuery } from "@tanstack/react-query";

export function useGetMeetings(
  filter: "my-meetings" | "all" = "all",
  force?: boolean,
) {
  return useQuery({
    queryKey: ["meetings", filter, force],
    queryFn: () => fetchMeetings(filter, force),
  });
}
