import { likeReel, unlikeReel } from "@/lib/api/reels";
import { useMutation } from "@tanstack/react-query";

export function useLikeReel(reelId: string) {
  const likeMutation = useMutation({
    mutationFn: () => likeReel(reelId),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeReel(reelId),
  });

  const toggleLike = async (isLiked: boolean) => {
    if (isLiked) {
      return unlikeMutation.mutateAsync();
    } else {
      return likeMutation.mutateAsync();
    }
  };

  return {
    toggleLike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
  };
}
