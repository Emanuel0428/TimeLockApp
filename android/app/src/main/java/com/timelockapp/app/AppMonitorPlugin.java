package com.timelockapp.app;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;

@CapacitorPlugin(name = "AppMonitor")
public class AppMonitorPlugin extends Plugin {

    private static final String PREFS_NAME = "AppMonitorPrefs";
    private static final String BLOCKED_APPS_KEY = "blocked_apps";

    @Override
    public void load() {
        super.load();
    }

    @PluginMethod
    public void requestUsageStatsPermission(PluginCall call) {
        try {
            if (checkUsageStatsPermissionInternal()) {
                JSObject ret = new JSObject();
                ret.put("granted", true);
                call.resolve(ret);
                return;
            }

            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            JSObject ret = new JSObject();
            ret.put("granted", false);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error opening settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkUsageStatsPermission(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("granted", checkUsageStatsPermissionInternal());
        call.resolve(ret);
    }

    @PluginMethod
    public void requestOverlayPermission(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (Settings.canDrawOverlays(getContext())) {
                    JSObject ret = new JSObject();
                    ret.put("granted", true);
                    call.resolve(ret);
                    return;
                }

                android.util.Log.d("AppMonitor", "Opening Overlay settings");
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                
                JSObject ret = new JSObject();
                ret.put("granted", false);
                call.resolve(ret);
            } else {
                JSObject ret = new JSObject();
                ret.put("granted", true);
                call.resolve(ret);
            }
        } catch (Exception e) {
            call.reject("Error opening settings: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        JSObject ret = new JSObject();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ret.put("granted", Settings.canDrawOverlays(getContext()));
        } else {
            ret.put("granted", true);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            PackageManager pm = getContext().getPackageManager();
            
            // Get all apps with LAUNCHER category (all apps visible in launcher)
            Intent mainIntent = new Intent(Intent.ACTION_MAIN, null);
            mainIntent.addCategory(Intent.CATEGORY_LAUNCHER);
            List<ResolveInfo> launcherApps = pm.queryIntentActivities(mainIntent, 0);
            
            JSArray appsArray = new JSArray();
            Set<String> addedPackages = new HashSet<>();
            int count = 0;
            
            for (ResolveInfo resolveInfo : launcherApps) {
                String packageName = resolveInfo.activityInfo.packageName;
                
                // Skip our own app and duplicates
                if (packageName.equals(getContext().getPackageName()) || addedPackages.contains(packageName)) {
                    continue;
                }
                
                addedPackages.add(packageName);
                JSObject app = new JSObject();
                app.put("packageName", packageName);
                
                try {
                    String appName = resolveInfo.loadLabel(pm).toString();
                    app.put("appName", appName);
                    count++;
                    
                    // Log some popular apps for debugging
                    if (appName.toLowerCase().contains("youtube") || 
                        appName.toLowerCase().contains("chrome") ||
                        packageName.contains("youtube")) {
                    }
                } catch (Exception e) {
                    app.put("appName", packageName);
                }
                
                app.put("usageTime", 0);
                app.put("lastTimeUsed", 0);
                appsArray.put(app);
            }
            
            Log.d("AppMonitor", "Total apps with launcher: " + count);
            JSObject ret = new JSObject();
            ret.put("apps", appsArray);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error getting installed apps: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getCurrentApp(PluginCall call) {
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) getContext()
                .getSystemService(Context.USAGE_STATS_SERVICE);
            
            long currentTime = System.currentTimeMillis();
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                currentTime - 1000 * 10, // last 10 seconds
                currentTime
            );

            if (stats != null && !stats.isEmpty()) {
                SortedMap<Long, UsageStats> sortedStats = new TreeMap<>();
                for (UsageStats usageStat : stats) {
                    sortedStats.put(usageStat.getLastTimeUsed(), usageStat);
                }

                if (!sortedStats.isEmpty()) {
                    UsageStats currentStat = sortedStats.get(sortedStats.lastKey());
                    PackageManager pm = getContext().getPackageManager();
                    
                    JSObject ret = new JSObject();
                    ret.put("packageName", currentStat.getPackageName());
                    try {
                        ApplicationInfo appInfo = pm.getApplicationInfo(currentStat.getPackageName(), 0);
                        ret.put("appName", pm.getApplicationLabel(appInfo).toString());
                    } catch (PackageManager.NameNotFoundException e) {
                        ret.put("appName", currentStat.getPackageName());
                    }
                    call.resolve(ret);
                    return;
                }
            }

            JSObject ret = new JSObject();
            ret.put("packageName", "unknown");
            ret.put("appName", "Unknown");
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error getting current app: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getAppUsageStats(PluginCall call) {
        try {
            long startTime = call.getLong("startTime", 0L);
            long endTime = call.getLong("endTime", System.currentTimeMillis());

            UsageStatsManager usageStatsManager = (UsageStatsManager) getContext()
                .getSystemService(Context.USAGE_STATS_SERVICE);
            
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            );

            PackageManager pm = getContext().getPackageManager();
            JSArray appsArray = new JSArray();

            if (stats != null) {
                for (UsageStats usageStat : stats) {
                    if (usageStat.getTotalTimeInForeground() > 0) {
                        JSObject app = new JSObject();
                        app.put("packageName", usageStat.getPackageName());
                        try {
                            ApplicationInfo appInfo = pm.getApplicationInfo(usageStat.getPackageName(), 0);
                            app.put("appName", pm.getApplicationLabel(appInfo).toString());
                        } catch (PackageManager.NameNotFoundException e) {
                            app.put("appName", usageStat.getPackageName());
                        }
                        app.put("usageTime", usageStat.getTotalTimeInForeground());
                        app.put("lastTimeUsed", usageStat.getLastTimeUsed());
                        appsArray.put(app);
                    }
                }
            }

            JSObject ret = new JSObject();
            ret.put("apps", appsArray);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error getting usage stats: " + e.getMessage());
        }
    }

    @PluginMethod
    public void setBlockedApps(PluginCall call) {
        try {
            JSArray appsArray = call.getArray("apps");
            JSONArray jsonArray = new JSONArray();

            for (int i = 0; i < appsArray.length(); i++) {
                jsonArray.put(appsArray.getJSONObject(i));
            }

            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().putString(BLOCKED_APPS_KEY, jsonArray.toString()).apply();

            // Update monitoring service with new blocked apps
            Intent intent = new Intent(getContext(), MonitoringService.class);
            intent.setAction("UPDATE_BLOCKED_APPS");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(intent);
            } else {
                getContext().startService(intent);
            }

            JSObject ret = new JSObject();
            ret.put("exito", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error setting blocked apps: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getBlockedApps(PluginCall call) {
        try {
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String blockedAppsJson = prefs.getString(BLOCKED_APPS_KEY, "[]");
            
            JSONArray jsonArray = new JSONArray(blockedAppsJson);
            JSArray appsArray = new JSArray();
            
            for (int i = 0; i < jsonArray.length(); i++) {
                appsArray.put(jsonArray.getJSONObject(i));
            }

            JSObject ret = new JSObject();
            ret.put("apps", appsArray);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error getting blocked apps: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startMonitoring(PluginCall call) {
        try {
            Intent intent = new Intent(getContext(), MonitoringService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                getContext().startForegroundService(intent);
            } else {
                getContext().startService(intent);
            }

            JSObject ret = new JSObject();
            ret.put("exito", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error starting monitoring: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopMonitoring(PluginCall call) {
        try {
            Intent intent = new Intent(getContext(), MonitoringService.class);
            getContext().stopService(intent);

            JSObject ret = new JSObject();
            ret.put("exito", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Error stopping monitoring: " + e.getMessage());
        }
    }

    @PluginMethod
    public void isMonitoring(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("activado", MonitoringService.isRunning());
        call.resolve(ret);
    }

    private boolean checkUsageStatsPermissionInternal() {
        try {
            AppOpsManager appOps = (AppOpsManager) getContext().getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                getContext().getPackageName()
            );
            return mode == AppOpsManager.MODE_ALLOWED;
        } catch (Exception e) {
            return false;
        }
    }
}
