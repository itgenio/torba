import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Settings } from '../settings';

const { secretKey, accessKey, region } = Settings.digitalocean;

const s3Client = new S3Client({
  endpoint: `https://${region}.digitaloceanspaces.com`,
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

type Params = { bucket: string; key: string };

export const fetchFile = async ({ bucket, key }: Params) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: decodeURIComponent(key),
  });

  return s3Client.send(command);
}