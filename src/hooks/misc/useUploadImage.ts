import { uploadImageWeb } from "@/lib/api/misc";
import { useMutation } from "@tanstack/react-query";

export function useUploadImage() {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadImageWeb(file),
  });

  return {
    uploadImage: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
