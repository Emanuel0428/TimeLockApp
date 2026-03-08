import { registerPlugin } from '@capacitor/core';

export interface AppInfo {
  packageName: string;
  appName: string;
  usageTime: number; // milliseconds
  lastTimeUsed: number; // timestamp
}

export interface BlockedApp {
  packageName: string;
  appName: string;
}

export interface AppMonitorPlugin {
  /**
   * Request UsageStats permission
   */
  requestUsageStatsPermission(): Promise<{ granted: boolean }>;

  /**
   * Check if UsageStats permission is granted
   */
  checkUsageStatsPermission(): Promise<{ granted: boolean }>;

  /**
   * Request Overlay permission
   */
  requestOverlayPermission(): Promise<{ granted: boolean }>;

  /**
   * Check if Overlay permission is granted
   */
  checkOverlayPermission(): Promise<{ granted: boolean }>;

  /**
   * Get installed apps
   */
  getInstalledApps(): Promise<{ apps: AppInfo[] }>;

  /**
   * Get current foreground app
   */
  getCurrentApp(): Promise<{ packageName: string; appName: string }>;

  /**
   * Get app usage stats for today
   */
  getAppUsageStats(options: { startTime: number; endTime: number }): Promise<{ apps: AppInfo[] }>;

  /**
   * Set blocked apps list
   */
  setBlockedApps(options: { apps: BlockedApp[] }): Promise<{ success: boolean }>;

  /**
   * Get blocked apps list
   */
  getBlockedApps(): Promise<{ apps: BlockedApp[] }>;

  /**
   * Start monitoring service
   */
  startMonitoring(): Promise<{ success: boolean }>;

  /**
   * Stop monitoring service
   */
  stopMonitoring(): Promise<{ success: boolean }>;

  /**
   * Check if monitoring is active
   */
  isMonitoring(): Promise<{ active: boolean }>;
}

const AppMonitor = registerPlugin<AppMonitorPlugin>('AppMonitor', {
  web: () => import('./web').then(m => new m.AppMonitorWeb()),
});

export default AppMonitor;
