import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'currency-converter',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
