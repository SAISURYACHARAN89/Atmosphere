import { create } from "zustand";
import Cookies from "js-cookie";
import { fetchAndStoreUser } from "@/lib/api/user";
import { ZUserSchema } from "@/types/auth";
import { toast } from "sonner";

type AppStoreTypes = {
  user: ZUserSchema | null;
  setUser: (user: ZUserSchema | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
};

export const useAppStore = create<AppStoreTypes>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    if (get().user) return;

    const token = Cookies.get("token");
    if (!token) return;

    try {
      const data = await fetchAndStoreUser();
      set({ user: data });
    } catch (err) {
      toast.error(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  },

  logout: () => {
    Cookies.remove("token");
    set({ user: null });
  },
}));
