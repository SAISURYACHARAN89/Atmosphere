import { getSettings } from "@/lib/api/settings";
import { useQuery } from "@tanstack/react-query";

export function useGetSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}
