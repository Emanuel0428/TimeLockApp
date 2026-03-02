import type { BlockedApp } from "../models";

/**
 * Interface that defines the capabilities required from the native device.
 * For true mobile integration (React Native / Capacitor), this interface
 * should be implemented using actual native plugins.
 */
export interface IDeviceControl {
  requestPermissions(): Promise<boolean>;
  listInstalledApps(): Promise<BlockedApp[]>;
  getDeviceScreenTime(): Promise<number>;
  blockApps(appIds: string[], policy?: any): Promise<void>;
  blockUrls(urls: string[], policy?: any): Promise<void>;
}

/**
 * Web Stub Implementation.
 * Simulates mobile capabilities since web browsers cannot access installed apps
 * or perform OS-level blocking.
 */
export const DeviceControlWeb: IDeviceControl = {
  async requestPermissions() {
    console.info(
      "[DeviceControlWeb] requestPermissions: Simulando permisos condedidos.",
    );
    return true;
  },
  async listInstalledApps() {
    console.info(
      "[DeviceControlWeb] listInstalledApps: Retornando lista de apps simulada.",
    );
    return [
      {
        id: "com.instagram.android",
        name: "Instagram",
        packageName: "com.instagram.android",
      },
      {
        id: "com.zhiliaoapp.musically",
        name: "TikTok",
        packageName: "com.zhiliaoapp.musically",
      },
      { id: "com.whatsapp", name: "WhatsApp", packageName: "com.whatsapp" },
      {
        id: "com.twitter.android",
        name: "X (Twitter)",
        packageName: "com.twitter.android",
      },
      {
        id: "com.google.android.youtube",
        name: "YouTube",
        packageName: "com.google.android.youtube",
      },
    ];
  },
  async getDeviceScreenTime() {
    console.info(
      "[DeviceControlWeb] getDeviceScreenTime: No disponible en web.",
    );
    return 0;
  },
  async blockApps(appIds, policy) {
    console.info(
      `[DeviceControlWeb] blockApps: Simulando bloqueo de apps:`,
      appIds,
      policy,
    );
  },
  async blockUrls(urls, policy) {
    console.info(
      `[DeviceControlWeb] blockUrls: Simulando bloqueo de URLs:`,
      urls,
      policy,
    );
  },
};

// Default export uses the Web Stub for now.
// In a real multi-platform setup, you'd check Capacitor.isNative or similar here.
export const DeviceControl = DeviceControlWeb;
