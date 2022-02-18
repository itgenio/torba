import http from 'http';
import { logger } from './logger';

const l = logger.makeLogger('sendResult');

export function sendResult(res: http.ServerResponse, result: any) {
  l.debug(`result:`, result);
  res.end(JSON.stringify({ success: true, result }));
}

export function sendError(res: http.ServerResponse, name: string, message?: string) {
  l.debug(`error:`, { error: name, message });
  res.end(JSON.stringify({ success: false, error: name, message }));
}
