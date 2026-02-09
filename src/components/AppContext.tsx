import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppStore } from "@/store/useAppStore";

export default function AppContext() {
  const fetchUser = useAppStore((s) => s.fetchUser);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  return null;
}
