import { ZSettingsUser } from "@/types/Profile";
import axiosClient from "./axiosClient";
import { SETTINGS_ENDPOINTS } from "./endpoints";

interface SettingsApiRes {
  settings: ZSettingsUser;
}

async function getSettings() {
  const res: SettingsApiRes = await axiosClient.get(SETTINGS_ENDPOINTS.SETTINGS);
  return res?.settings as ZSettingsUser;
}

async function updateSettings(payload: {
  displayName?: string;
  username?: string;
  phone?: string;
}) {
  return axiosClient.put(SETTINGS_ENDPOINTS.SETTINGS, payload);
}

async function changePassword(currentPassword: string, newPassword: string) {
  return axiosClient.put(SETTINGS_ENDPOINTS.PASSWORD, {
    currentPassword,
    newPassword,
  });
}

export { getSettings, updateSettings, changePassword };
