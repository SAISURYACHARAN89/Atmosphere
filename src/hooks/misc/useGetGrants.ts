import { useQuery } from "@tanstack/react-query";
import { fetchGrants } from "@/lib/api/misc";

export function useGetGrants(limit = 20, skip = 0) {
  const query = useQuery({
    queryKey: ["grants", limit, skip],
    queryFn: () => fetchGrants(limit, skip),
  });

  return {
    grants: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
