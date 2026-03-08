package com.timelockapp.app;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Register plugin BEFORE calling super.onCreate
        registerPlugin(AppMonitorPlugin.class);
        super.onCreate(savedInstanceState);
        Log.d("MainActivity", "✅ MainActivity onCreate - Plugin registered");
        
        // Enable edge-to-edge display
        setupEdgeToEdge();
    }
    
    private void setupEdgeToEdge() {
        // Enable edge-to-edge layout
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        
        // Make status bar and navigation bar transparent
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            );
        }
        
        // Set status bar and navigation bar colors to transparent
        getWindow().setStatusBarColor(android.graphics.Color.TRANSPARENT);
        getWindow().setNavigationBarColor(android.graphics.Color.TRANSPARENT);
        
        // Make status bar icons dark or light based on content
        WindowInsetsControllerCompat windowInsetsController = 
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        if (windowInsetsController != null) {
            // Set to false for light icons (for dark background), true for dark icons (for light background)
            windowInsetsController.setAppearanceLightStatusBars(false);
            windowInsetsController.setAppearanceLightNavigationBars(false);
        }
    }
}
