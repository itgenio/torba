import http from 'http';
import connect from 'connect';
import bodyParser from 'body-parser';
import cors from 'cors';
import { parse } from 'url';
import { Settings } from './settings';
import { inject } from './apiMiddleware';
import { sendError } from './sendResult';
import { Errors } from './errors';
import { logger } from './logger';

const app = connect();

const PORT = process.env.PORT ?? Settings.port ?? 3000;
const LIMIT = '100mb';

app.use(cors());

app.use((req, res, next) => {
  const parsedUrl = parse(req.url ?? '', true);
  (req as any).query = parsedUrl.query;
  next();
});

app.use(bodyParser.urlencoded({ extended: false, limit: LIMIT }));
app.use(bodyParser.json({ limit: LIMIT }));

inject(app);

// respond to all requests
app.use(function (req, res) {
  sendError(res, Errors.HANDLER_NOT_FOUND);
});

app.use(function (err: any, _: any, res: http.ServerResponse, next: any) {
  if (err && err instanceof Error) {
    sendError(res, err.name, err.message ? err.message : undefined);
  } else {
    next(err);
  }
});

//create node.js http server and listen on port
http.createServer(app).listen(PORT);

logger.info(`Start HTTP server on port: ${PORT}`);
