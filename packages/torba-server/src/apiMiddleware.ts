import { Server } from 'connect';
import SimpleSchema from 'simpl-schema';
import { checkApp, generateUrl } from './api';
import { sendResult } from './sendResult';

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
}
