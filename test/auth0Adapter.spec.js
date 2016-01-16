'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const sinon = require('sinon');

const should = chai.should();
chai.use(chaiAsPromised);

const adapter = rewire('../auth0Adapter');

describe('auth0Adapter spec', function() {

  describe('#makeAuth0Request', function() {

    let revert;

    beforeEach(() => {
      revert = null;
    });

    afterEach(() => {
      if (revert) {
        revert();
      }
    });

    const makeAuth0Request = adapter.__get__('makeAuth0Request');
    const mockRest = {};
    mockRest.get = function() { return this; };

    it('should reject if restler call returns an error', function() {
      mockRest.on = (e, cb) => cb(new Error(), { statusCode: 200 });
      revert = adapter.__set__('rest', mockRest);

      return makeAuth0Request('https://example.com/sample', {}).should.be.rejectedWith(Error);
    });

    it('should reject for non-200 status code', function() {
      mockRest.on = (e, cb) => cb({}, { statusCode: 403 });
      revert = adapter.__set__('rest', mockRest);

      return makeAuth0Request('https://example.com/sample', {}).should.be.rejectedWith(Error);
    });

    it('should reject for empty response', function() {
      mockRest.on = (e, cb) => cb('', { statusCode: 200 });
      revert = adapter.__set__('rest', mockRest);

      return makeAuth0Request('https://example.com/sample', {}).should.be.rejectedWith(Error);
    });

    it('should resolve for valid response', function() {
      const res = { a: 2 };
      mockRest.on = (e, cb) => cb(res, { statusCode: 200 });
      revert = adapter.__set__('rest', mockRest);

      return makeAuth0Request('https://example.com/sample', {}).should.eventually.equal(res);
    });
  });

});
