import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifeos.app',
  appName: '人生地图',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#fafaf9'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#fafaf9',
      showSpinner: false
    }
  }
};

export default config;