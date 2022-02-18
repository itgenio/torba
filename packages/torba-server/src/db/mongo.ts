import { MongoClient, Db } from 'mongodb';
import { wait } from '../utils';
import { Settings } from '../settings';
import { logger } from '../logger';

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_URL ?? Settings.mongo?.url;

if (!uri) throw new Error(`no mongo url! Please, set it via ENV or settings file!`);

const client = new MongoClient(uri);

const Mongo: { client: MongoClient; database?: Db } = { client };

async function run() {
  try {
    await client.connect();
    logger.info(`connected to MongoDB`);
    Mongo.database = client.db('torba');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const checkCount = 10;
const checkInterval = 500;

async function checkConnected() {
  return new Promise<Db>(async (res, rej) => {
    if (Mongo.database) return res(Mongo.database);

    for (let i = 0; i < checkCount; i++) {
      await wait(checkInterval);
      logger.info(`check db ${i}`);
      if (Mongo.database) return res(Mongo.database);
    }

    rej('timeout');
  });
}

export { Mongo, run, checkConnected };
