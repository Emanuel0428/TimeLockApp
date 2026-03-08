import { WebPlugin } from '@capacitor/core';
import type { AppMonitorPlugin, AppInfo, BlockedApp } from './AppMonitor';

export class AppMonitorWeb extends WebPlugin implements AppMonitorPlugin {
  async requestUsageStatsPermission(): Promise<{ granted: boolean }> {
    console.log('UsageStats permission not available on web');
    return { granted: false };
  }

  async checkUsageStatsPermission(): Promise<{ granted: boolean }> {
    return { granted: false };
  }

  async requestOverlayPermission(): Promise<{ granted: boolean }> {
    console.log('Overlay permission not available on web');
    return { granted: false };
  }

  async checkOverlayPermission(): Promise<{ granted: boolean }> {
    return { granted: false };
  }

  async getInstalledApps(): Promise<{ apps: AppInfo[] }> {
    return { apps: [] };
  }

  async getCurrentApp(): Promise<{ packageName: string; appName: string }> {
    return { packageName: 'web', appName: 'Web Browser' };
  }

  async getAppUsageStats(): Promise<{ apps: AppInfo[] }> {
    return { apps: [] };
  }

  async setBlockedApps(): Promise<{ success: boolean }> {
    return { success: true };
  }

  async getBlockedApps(): Promise<{ apps: BlockedApp[] }> {
    return { apps: [] };
  }

  async startMonitoring(): Promise<{ success: boolean }> {
    return { success: true };
  }

  async stopMonitoring(): Promise<{ success: boolean }> {
    return { success: true };
  }

  async isMonitoring(): Promise<{ active: boolean }> {
    return { active: false };
  }
}
