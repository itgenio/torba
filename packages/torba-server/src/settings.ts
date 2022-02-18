const fromEnv = String(process.env.SECRETS ?? '').trim();

const settings = fromEnv ? JSON.parse(fromEnv) : require('../secrets.dev.json');

const { default: _, ...secrets } = settings;

type SecretsType = {
  log?: '1' | '2' | '3';
  port?: number;
  mongo?: { url: string };
  apps: { name: string; secret: string }[];
  allowedMimeTypes: string[];
  allowedMimeExtensions?: string[];
  digitalocean: {
    secretKey: string;
    accessKey: string;
    region: string;
    space: string;
    folder: string;
    get: string;
  };
};

export const Settings = secrets as SecretsType;
