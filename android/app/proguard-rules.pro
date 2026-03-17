# TimeLockApp ProGuard Rules

# Keep custom Capacitor plugin and native service classes
-keep class com.timelockapp.app.** { *; }

# Capacitor framework (keep all public APIs intact)
-keep class com.getcapacitor.** { *; }
-keepclassmembers class com.getcapacitor.** { *; }

# WebView JavaScript bridge — keep annotated @JavascriptInterface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Preserve line numbers in stack traces for crash reporting
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
