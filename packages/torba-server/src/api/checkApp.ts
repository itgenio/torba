import { getApp } from '../getApp';

export function checkApp({ name, secret }: { name: string; secret: string }) {
  const app = getApp(name);

  return !!app && app.secret === secret;
}
