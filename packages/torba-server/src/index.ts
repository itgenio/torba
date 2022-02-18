import './server';
import { run } from './db/mongo';

run().catch(console.dir);
