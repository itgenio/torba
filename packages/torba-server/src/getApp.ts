import { Settings } from './settings';

export function getApp(appName: string) {
  return Settings.apps.find(app => app.name === appName);
}
