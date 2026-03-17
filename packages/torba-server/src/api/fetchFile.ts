import https from 'https';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { Settings } from '../settings';

const { secretKey, accessKey, region } = Settings.digitalocean;

const agent = new https.Agent({
  maxSockets: 200,
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxTotalSockets: 1000,
});

const s3Client = new S3Client({
  endpoint: `https://${region}.digitaloceanspaces.com`,
  region,
  requestHandler: new NodeHttpHandler({
    httpsAgent: agent,
    connectionTimeout: 3000,
    socketTimeout: 30000,
    socketAcquisitionWarningTimeout: 10000,
  }),
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

type Params = { bucket: string; key: string; range?: string };

export const fetchFile = async ({ bucket, key, range }: Params) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    Range: range,
  });

  return s3Client.send(command);
};
