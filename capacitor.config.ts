import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timelockapp.app',
  appName: 'TimeLockApp',
  webDir: 'dist',
  android: {
    allowMixedContent: true
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
