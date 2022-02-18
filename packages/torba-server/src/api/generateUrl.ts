import { Settings } from '../settings';
const { urlAlphabet, customAlphabet } = require('nanoid');
import { Errors } from '../errors';
import { parseTicket, verifyTicket } from '@itgenio/torba-client';
import { getFiles } from 'db/collections';
import { getApp } from '../getApp';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CustomError } from '../customError';

const nanoidForKey = customAlphabet(urlAlphabet, 21);
const nanoidObjectId = customAlphabet('0123456789abcdefABCDEF', 24);

const { secretKey, accessKey, region, folder, space, get } = Settings.digitalocean;
const allowedMimeTypes = Settings.allowedMimeTypes;
const allowedMimeExtensions = Settings.allowedMimeExtensions ?? [];

const s3Client = new S3Client({
  endpoint: `https://${region}.digitaloceanspaces.com`,
  region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

const UPLOAD_URL_EXPIRES_TIMEOUT = 15 * 60; //in seconds

type FileInfo = { name: string; type: string; download?: boolean };
type Params = { file: FileInfo; ticketJwt: string };

function makeKey() {
  return nanoidForKey();
}

function makeOptions(ext: string = '') {
  const key = makeKey();

  return {
    Bucket: `${space}`,
    Key: `${folder}/${key}${ext ? `.${ext}` : ''}`,
  } as const;
}

async function makePutUrl(s3: S3Client, options: ReturnType<typeof makeOptions>, file: FileInfo) {
  const params = {
    ...options,
    ACL: 'public-read',
    ContentType: file.type,
    ContentDisposition: file.download ? `attachment; filename:"${file.name}"` : undefined,
  };

  return await getSignedUrl(s3Client, new PutObjectCommand(params), { expiresIn: UPLOAD_URL_EXPIRES_TIMEOUT });
}

export async function generateUrl({ file, ticketJwt }: Params) {
  const ticket = parseTicket(ticketJwt);
  const app = getApp(ticket.app);

  if (!app) throw new CustomError(Errors.APP_NOT_FOUND);

  verifyTicket(app.secret, ticketJwt);

  if (!allowedMimeTypes.some(mimeType => file.type.startsWith(mimeType))) {
    if (!allowedMimeExtensions.includes(file.type)) {
      throw new CustomError(Errors.INVALID_PARAMETER, `extension '${file.type}' not allowed`);
    }
  }

  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts[parts.length - 1] : undefined;

  const options = makeOptions(ext);

  const putUrl = await makePutUrl(s3Client, options, file);
  const getUrl = `https://${get}/${options.Key}`;

  if (!putUrl || !getUrl) {
    throw new CustomError(Errors.FILE_CREATE_URL_FAILED);
  }

  const Files = await getFiles();

  const { insertedId } = await Files.insertOne({
    ...file,
    putUrl,
    getUrl,
    userId: ticket.userId,
    app: ticket.app,
    createdAt: new Date(),
    _id: nanoidObjectId(),
  });

  return { putUrl, getUrl, id: insertedId, file };
}
