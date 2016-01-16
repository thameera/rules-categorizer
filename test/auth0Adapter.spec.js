'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const rewire = require('rewire');
const sinon = require('sinon');
const dotenv = require('dotenv');

dotenv.load();

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

  describe('#getApplications', function() {

    const getApplications = adapter.__get__('getApplications');

    it('should call makeAuth0Request with correct parameters', function() {
      const mockFn = sinon.stub().returns(1);
      const revert = adapter.__set__('makeAuth0Request', mockFn);

      const res = getApplications();

      const expectedQuery = { fields: 'name,client_id,global', include_fields: true };
      mockFn.calledWith('https://thameera.auth0.com/api/v2/clients', expectedQuery).should.be.true;

      revert();
    });
  });

  describe('#getRules', function() {

    const getRules = adapter.__get__('getRules');

    it('should call makeAuth0Request with correct parameters', function() {
      const mockFn = sinon.stub().returns(1);
      const revert = adapter.__set__('makeAuth0Request', mockFn);

      const res = getRules();

      const expectedQuery = { fields: 'id,name,script', include_fields: true };
      mockFn.calledWith('https://thameera.auth0.com/api/v2/rules', expectedQuery).should.be.true;

      revert();
    });
  });
});
