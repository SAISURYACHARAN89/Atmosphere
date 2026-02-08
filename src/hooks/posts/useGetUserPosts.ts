import { fetchMyPosts } from "@/lib/api/posts";
import { ZMyPostsResponse } from "@/types/posts";
import { useQuery } from "@tanstack/react-query";

export function useMyPosts() {
  return useQuery<ZMyPostsResponse>({
    queryKey: ["my-posts"],
    queryFn: async (): Promise<ZMyPostsResponse> => {
      const response = await fetchMyPosts();
      return response;
    },
  });
}
