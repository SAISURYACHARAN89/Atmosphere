import { fetchHottestStartups } from "@/lib/api/startup";
import { useQuery } from "@tanstack/react-query";

export function useHottestStartups(limit = 10, week?: number) {
  const query = useQuery({
    queryKey: ["hottest-startups", limit, week],
    queryFn: async () => {
      return fetchHottestStartups(limit, week);
    },
  });

  return {
    startups: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
