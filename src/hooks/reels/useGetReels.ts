import { fetchReels } from "@/lib/api/reels";
import { useQuery } from "@tanstack/react-query";

export function useReels(limit = 20, skip = 0) {
  return useQuery({
    queryKey: ["reels", limit, skip],
    queryFn: () => fetchReels(limit, skip),
    placeholderData: (prev) => prev, // v5 replacement
  });
}
