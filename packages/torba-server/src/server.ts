import http from 'http';
import connect from 'connect';
import bodyParser from 'body-parser';
import { Settings } from './settings';
import { inject } from './apiMiddleware';
import { sendError } from './sendResult';
import { Errors } from './errors';
import { logger } from './logger';

const app = connect();

const PORT = process.env.PORT ?? Settings.port ?? 3000;

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

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
