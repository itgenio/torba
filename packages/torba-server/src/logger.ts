import { Settings } from './settings';

const LOG_LEVEL = String(process.env.LOG ?? Settings.log ?? '');

const LOG_DEBUG = LOG_LEVEL === '1';
const LOG_INFO = LOG_LEVEL === '2';
const LOG_ERROR = LOG_LEVEL === '3';

const makeLogger = (name?: string) => {
  const PREFIX = `[torba]${name ? `[${name}]` : ''}`;

  const debug: typeof console.log = (...args: any[]) => {
    LOG_DEBUG && console.log(`${PREFIX}[DEBUG]`, ...args);
  };

  const info: typeof console.info = (...args: any[]) => {
    (LOG_DEBUG || LOG_INFO) && console.log(`${PREFIX}[INFO]`, ...args);
  };

  const warn: typeof console.warn = (...args: any[]) => {
    (LOG_DEBUG || LOG_INFO) && console.log(`${PREFIX}[WARN]`, ...args);
  };

  const error: typeof console.error = (...args: any[]) => {
    (LOG_DEBUG || LOG_INFO || LOG_ERROR) && console.error(`${PREFIX}[ERROR]`, ...args);
  };

  return { debug, info, warn, error } as const;
};

const defaultLogger = makeLogger();

export const logger = { ...defaultLogger, makeLogger };
