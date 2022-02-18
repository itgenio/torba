import { checkConnected } from './mongo';

interface FileDocument {
  _id?: string;
  name: string;
  type: string;
  createdAt: Date;
  removedAt?: Date;
  userId: string;
  app: string;
  putUrl: string;
  getUrl: string;
}

async function getDatabase() {
  return await checkConnected();
}

export async function getFiles() {
  const db = await getDatabase();

  return db.collection<FileDocument>('files');
}
