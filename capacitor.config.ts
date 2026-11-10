import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.glasscoin.makeitcute',
  appName: 'Make It Cute',
  webDir: 'web',
  backgroundColor: '#fffbea',
  ios: { backgroundColor: '#fffbea', contentInset: 'never' },
  android: { backgroundColor: '#fffbea' }
};

export default config;
