package com.timelockapp.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import androidx.core.app.NotificationCompat;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

public class MonitoringService extends Service {
    
    private static final String CHANNEL_ID = "AppMonitorChannel";
    private static final int NOTIFICATION_ID = 1;
    private static final String PREFS_NAME = "AppMonitorPrefs";
    private static final String BLOCKED_APPS_KEY = "blocked_apps";
    private static final int CHECK_INTERVAL = 1000; // Check every second
    
    private static boolean isServiceRunning = false;
    private Handler handler;
    private Runnable monitoringRunnable;
    private WindowManager windowManager;
    private View overlayView;
    private List<String> blockedPackages = new ArrayList<>();
    private String currentBlockedApp = null;

    public static boolean isRunning() {
        return isServiceRunning;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        isServiceRunning = true;
        loadBlockedApps();
        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());
        
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        handler = new Handler(Looper.getMainLooper());
        
        startMonitoring();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && "UPDATE_BLOCKED_APPS".equals(intent.getAction())) {
            loadBlockedApps();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isServiceRunning = false;
        stopMonitoring();
        removeOverlay();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "App Monitor Service",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Monitoring app usage");
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("TimeLock Active")
            .setContentText("App monitoring is running")
            .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build();
    }

    private void loadBlockedApps() {
        try {
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String blockedAppsJson = prefs.getString(BLOCKED_APPS_KEY, "[]");
            JSONArray jsonArray = new JSONArray(blockedAppsJson);
            
            blockedPackages.clear();
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject app = jsonArray.getJSONObject(i);
                blockedPackages.add(app.getString("packageName"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void startMonitoring() {
        monitoringRunnable = new Runnable() {
            @Override
            public void run() {
                checkCurrentApp();
                handler.postDelayed(this, CHECK_INTERVAL);
            }
        };
        handler.post(monitoringRunnable);
    }

    private void stopMonitoring() {
        if (handler != null && monitoringRunnable != null) {
            handler.removeCallbacks(monitoringRunnable);
        }
    }

    private void checkCurrentApp() {
        String currentApp = getCurrentForegroundApp();
        
        if (currentApp != null && blockedPackages.contains(currentApp)) {
            if (!currentApp.equals(currentBlockedApp)) {
                currentBlockedApp = currentApp;
                showBlockOverlay(currentApp);
            }
        } else {
            if (currentBlockedApp != null) {
                currentBlockedApp = null;
                removeOverlay();
            }
        }
    }

    private String getCurrentForegroundApp() {
        try {
            UsageStatsManager usageStatsManager = (UsageStatsManager) getSystemService(Context.USAGE_STATS_SERVICE);
            long currentTime = System.currentTimeMillis();
            
            List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                currentTime - 1000 * 5, // last 5 seconds
                currentTime
            );

            if (stats != null && !stats.isEmpty()) {
                SortedMap<Long, UsageStats> sortedStats = new TreeMap<>();
                for (UsageStats usageStat : stats) {
                    sortedStats.put(usageStat.getLastTimeUsed(), usageStat);
                }

                if (!sortedStats.isEmpty()) {
                    return sortedStats.get(sortedStats.lastKey()).getPackageName();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void showBlockOverlay(String packageName) {
        if (overlayView != null) {
            return; // Overlay already showing
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!android.provider.Settings.canDrawOverlays(this)) {
                return; // No permission
            }
        }

        try {
            int layoutType;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                layoutType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
            } else {
                layoutType = WindowManager.LayoutParams.TYPE_PHONE;
            }

            WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                PixelFormat.TRANSLUCENT
            );

            params.gravity = Gravity.CENTER;

            // Create a simple blocking view
            overlayView = createBlockView(packageName);
            windowManager.addView(overlayView, params);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private View createBlockView(String packageName) {
        // Create a simple blocking layout programmatically
        android.widget.LinearLayout layout = new android.widget.LinearLayout(this);
        layout.setOrientation(android.widget.LinearLayout.VERTICAL);
        layout.setBackgroundColor(0xF0000000); // Semi-transparent black
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(50, 50, 50, 50);

        TextView titleText = new TextView(this);
        titleText.setText("⏱️ Aplicación Bloqueada");
        titleText.setTextSize(28);
        titleText.setTextColor(0xFFFFFFFF);
        titleText.setGravity(Gravity.CENTER);
        titleText.setPadding(0, 0, 0, 30);
        layout.addView(titleText);

        TextView messageText = new TextView(this);
        messageText.setText("Esta aplicación está bloqueada por TimeLock.\n\nPor favor, regresa a la aplicación principal para desbloquearla.");
        messageText.setTextSize(18);
        messageText.setTextColor(0xFFCCCCCC);
        messageText.setGravity(Gravity.CENTER);
        messageText.setPadding(0, 0, 0, 40);
        layout.addView(messageText);

        Button returnButton = new Button(this);
        returnButton.setText("Regresar a TimeLock");
        returnButton.setTextSize(16);
        returnButton.setPadding(40, 20, 40, 20);
        returnButton.setOnClickListener(v -> {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            startActivity(intent);
        });
        layout.addView(returnButton);

        return layout;
    }

    private void removeOverlay() {
        if (overlayView != null && windowManager != null) {
            try {
                windowManager.removeView(overlayView);
            } catch (Exception e) {
                e.printStackTrace();
            }
            overlayView = null;
        }
    }
}
