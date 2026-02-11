import { saveReel, unsaveReel } from "@/lib/api/reels";
import { useMutation } from "@tanstack/react-query";

export function useSaveReel(reelId: string, savedId?: string) {
  const saveMutation = useMutation({
    mutationFn: () => saveReel(reelId),
  });

  const unsaveMutation = useMutation({
    mutationFn: () => unsaveReel(savedId!),
  });

  const toggleSave = async (isSaved: boolean) => {
    if (isSaved && savedId) {
      return unsaveMutation.mutateAsync();
    } else {
      return saveMutation.mutateAsync();
    }
  };

  return {
    toggleSave,
    isLoading: saveMutation.isPending || unsaveMutation.isPending,
  };
}
