import jwt from 'jsonwebtoken';
import type { Ticket } from './types';

/**
 * Parse a ticket without verification. Don't use the Ticket without verification!
 * @param ticketJwt
 */
export function parseTicket(ticketJwt: string) {
  // get the decoded payload and header
  const payload = jwt.decode(ticketJwt, { json: true });

  const { app, userId } = payload ?? {};

  if (!app || typeof app !== 'string') {
    throw new Error('app field not found');
  }

  if (!userId || typeof userId !== 'string') {
    throw new Error('userId field not found');
  }

  return { app, userId } as Ticket;
}
