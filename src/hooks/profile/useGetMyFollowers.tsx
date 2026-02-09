import { getFollowersList } from "@/lib/api/user";
import { useAppStore } from "@/store/useAppStore";
import { useQuery } from "@tanstack/react-query";

export function useGetMyFollowers(limit = 20, skip = 0) {
  const userId = useAppStore((s) => s.user?._id);

  return useQuery({
    queryKey: ["followers", userId, limit, skip],
    queryFn: () => getFollowersList(userId!, limit, skip),
    enabled: !!userId,
  });
}
    