import { expect } from 'chai';
import { checkApp, generateUrl } from '../src/api';
import { Errors } from '../src/errors';
import { makeRequest } from './utils';

const TEST_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyIiwiYXBwIjoidGVzdCIsImlhdCI6MTY0NTQ0ODc1MCwiZXhwIjoxNjU0MDg4NzUwfQ.aA8_SRRzcS-_Ivs080W1CXaya8D0Gvqy2LmxqDDD-UA`;

describe('API', function () {
  describe('checkApp', function () {
    it('check app from settings', function () {
      expect(checkApp({ name: 'test', secret: '123' })).to.be.true;
      expect(checkApp({ name: 'no app', secret: '123' })).to.be.false;
    });
  });

  describe('generateUrl', function () {
    it('throws error if invalid ticket', function () {
      expect(() =>
        generateUrl({
          ticketJwt: 'abc',
          file: { name: 'file1', type: 'text/text' },
        })
      ).throw;
    });
  });

  describe('test api', function () {
    it('take response for not found url', async function () {
      const res = await makeRequest();

      expect(res).deep.eq({ success: false, error: Errors.HANDLER_NOT_FOUND });
    });

    it('take error for now allowed extensions', async function () {
      const res = await makeRequest('v1/generateUrl', {
        file: { name: 'file1', type: 'not' },
        ticketJwt: TEST_JWT,
      });

      expect(res).includes({ success: false, error: Errors.INVALID_PARAMETER });
    });

    it('generateUrl', async function () {
      const { success, result } = (await makeRequest('v1/generateUrl', {
        file: { name: 'file1', type: 'image/png' },
        ticketJwt: TEST_JWT,
      })) as { success: true; result: Awaited<ReturnType<typeof generateUrl>> };

      expect(success).true;
      expect(result.putUrl).not.empty;
      expect(result.getUrl).not.empty;
      expect(result.id).not.empty;
    });
  });
});
