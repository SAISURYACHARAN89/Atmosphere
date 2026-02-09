import { fetchStartupPosts } from "@/lib/api/startup";
import { useQuery } from "@tanstack/react-query";

export function useGetStartupPosts(limit = 20, skip = 0) {
  return useQuery({
    queryKey: ["startup-posts", limit, skip],
    queryFn: () => fetchStartupPosts(limit, skip),
  });
}
