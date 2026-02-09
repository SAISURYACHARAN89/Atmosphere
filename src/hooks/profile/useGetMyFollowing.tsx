import { getFollowingList } from "@/lib/api/user";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";

export function useGetMyFollowing(limit = 20, skip = 0) {
  const userId = useAppStore((s) => s.user?._id);

  return useQuery({
    queryKey: ["following", userId, limit, skip],
    queryFn: () => getFollowingList(userId!, limit, skip),
    enabled: !!userId,
  });
}
