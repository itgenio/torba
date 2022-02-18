import jwt from 'jsonwebtoken';
import type { Ticket } from './types';

/**
 * Create ticket
 * @param secret
 * @param ticket
 */
export function createTicket(secret: string, ticket: Ticket) {
  return jwt.sign(ticket, secret, { expiresIn: '100d' });
}
