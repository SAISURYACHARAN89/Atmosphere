import { fetchJobs } from "@/lib/api/jobs";
import { useQuery } from "@tanstack/react-query";

export function useGetJobs(limit = 20, skip = 0) {
  const query = useQuery({
    queryKey: ["jobs", limit, skip],
    queryFn: () => fetchJobs(limit, skip),
  });

  return {
    jobs: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
