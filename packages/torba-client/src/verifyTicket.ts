import jwt from 'jsonwebtoken';
import { parseTicket } from './parseTicket';

/**
 * Verify a ticket.
 * @param secret
 * @param ticketJwt
 */
export function verifyTicket(secret: string, ticketJwt: string) {
  // get the decoded payload and header
  const ticket = parseTicket(ticketJwt);

  //do check
  jwt.verify(ticketJwt, secret);

  return ticket;
}
