import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.njacp.studentcompanion',
  appName: 'NJACP',
  webDir: 'public',
  server: {
    url: 'https://njacp.vercel.app',
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
