import { expect } from 'chai';
import { createTicket, parseTicket, verifyTicket } from '../src';

describe('createTicket/checkTicket', function () {
  it('create ticket', function () {
    const secret = 'secret';
    const ticketJwt = createTicket(secret, { userId: 'user', app: 'test' });

    const ticket = verifyTicket(secret, ticketJwt);

    expect(ticket).deep.eq({ userId: 'user', app: 'test' });
    expect(ticket).deep.eq(parseTicket(ticketJwt));
  });

  it('throws error if ticketJwt is invalid', function () {
    expect(() => verifyTicket('1', 'abc')).throw;
    expect(() => parseTicket('abc')).throw;
  });
});
