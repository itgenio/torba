import { CustomError } from './customError';
import { Errors } from './errors';
import { Settings } from './settings';

export function getApp(appName: string) {
  const app = Settings.apps.find(app => app.name === appName);
  if (!app) throw new CustomError(Errors.APP_NOT_FOUND);

  return app;
}
