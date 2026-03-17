import { Server } from 'connect';
import SimpleSchema from 'simpl-schema';
import { checkApp, fetchFile, generateUrl } from './api';
import { sendResult } from './sendResult';
import { Readable } from 'stream';
import https from 'https';
import { parseTicket, verifyTicket } from '@itgenio/torba-client';
import { getApp } from './getApp';
import { CustomError } from './customError';
import { Errors } from './errors';

const normalizeFileKey = (key: string) => {
  return key.replace(/(\.[^./%\]]+)-(?:\[|%5B)\d+x\d+(?:\]|%5D)$/i, '$1');
}

export function inject(app: Server) {
  app.use('/v1/checkApp', function (req, res) {
    const body = ((req as any).body ?? {}) as Parameters<typeof checkApp>[0];

    new SimpleSchema({
      name: String,
      secret: String,
    }).validate(body);

    const isValid = checkApp(body);

    sendResult(res, isValid);
  });

  app.use('/v1/generateUrl', async function (req, res, next) {
    const body = ((req as any).body ?? {}) as Parameters<typeof generateUrl>[0];

    new SimpleSchema({
      ticketJwt: String,
      file: new SimpleSchema({
        name: String,
        type: String,
        download: {
          optional: true,
          type: Boolean,
        },
      }),
    }).validate(body);

    try {
      const result = await generateUrl(body);

      sendResult(res, result);
    } catch (e) {
      next(e);
    }
  });

  app.use('/v1/fetchFile', async function (req, res, next) {
    const query = ((req as any).query ?? {}) as Parameters<typeof fetchFile>[0];

    new SimpleSchema({ bucket: String, key: String }).validate(query);

    try {
      const range = req.headers.range;

      const {
        Body,
        ContentType,
        ContentLength,
        ContentRange,
        CacheControl,
        ETag,
        LastModified,
        AcceptRanges,
      } = await fetchFile({ ...query, range });

      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(normalizeFileKey(query.key))}"`);
      ContentType && res.setHeader('Content-Type', ContentType);
      CacheControl && res.setHeader('Cache-Control', CacheControl);
      ContentLength && res.setHeader('Content-Length', ContentLength);
      AcceptRanges && res.setHeader('Accept-Ranges', AcceptRanges);
      ContentRange && res.setHeader('Content-Range', ContentRange);
      ETag && res.setHeader('ETag', ETag);
      LastModified && res.setHeader('Last-Modified', LastModified.toString());

      if (range) {
        res.writeHead(206);
      }

      if (Body instanceof Readable) {
        Body.pipe(res);
      } else {
        sendResult(res, Body);
      }
    } catch (e) {
      next(e);
    }
  });

  app.use('/v1/uploadFile', async function (req, res, next) {
    try {
      const query = ((req as any).query ?? {});

      new SimpleSchema({ url: String, ticketJwt: String }).validate(query);

      const ticketJwt = query.ticketJwt;
      const ticket = parseTicket(ticketJwt);
      const app = getApp(ticket.app);

      if (!app) throw new CustomError(Errors.APP_NOT_FOUND);

      verifyTicket(app.secret, ticketJwt);

      const putUrl = new URL(query.url);

      const options = {
        method: 'PUT',
        hostname: putUrl.hostname,
        path: putUrl.pathname + putUrl.search,
        headers: {
          ...req.headers,
          host: putUrl.hostname,
        },
      };

      const upstreamReq = https.request(options, upstreamRes => {
        res.writeHead(upstreamRes?.statusCode ?? 500, upstreamRes.headers);
        upstreamRes.pipe(res);
      });

      upstreamReq.on('error', next);

      req.pipe(upstreamReq);

      req.on('aborted', () => upstreamReq.destroy());
    } catch (err) {
      next(err);
    }
  });
}
