import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchGrants } from "@/lib/api/misc";

export function useGetEvents(limit = 20, skip = 0) {
  const query = useQuery({
    queryKey: ["events", limit, skip],
    queryFn: () => fetchEvents(limit, skip),
  });

  return {
    events: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
