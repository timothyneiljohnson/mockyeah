'use strict';

const TestHelper = require('../TestHelper');
const mockyeah = TestHelper.mockyeah;
const request = TestHelper.request;
const expect = require('chai').expect;

describe('Route Patterns', () => {
  it('should work with path parameter', done => {
    mockyeah.get('/service/:key');

    request.get('/service/exists').expect(200, done);
  });

  it('should expose path parameters to custom middleware as keyed object', done => {
    let report = true;
    mockyeah.get('/service/:one/:two/other/:three', (req, res) => {
      try {
        expect(req.params).to.deep.equal({
          one: 'exists',
          two: 'ok',
          three: 'yes',
          0: 'exists',
          1: 'ok',
          2: 'yes'
        });
      } catch (err) {
        done(err);
        report = false;
      }
      res.send();
    });

    request.get('/service/exists/ok/other/yes').expect(200, () => {
      if (report) done();
    });
  });

  it('should expose path parameters to custom middleware as indexed array', done => {
    let report = true;
    mockyeah.get('/service/:one/:two/other/:three', (req, res) => {
      try {
        expect(req.params[1]).to.equal('ok');
      } catch (err) {
        done(err);
        report = false;
      }
      res.send();
    });

    request.get('/service/exists/ok/other/yes').expect(200, () => {
      if (report) done();
    });
  });

  it('should work with regular expression slash any count', done => {
    mockyeah.get('/service/(.{0,})');

    request.get('/service/exists').expect(200, done);
  });

  it('should work with regular expression slash any star', done => {
    mockyeah.get('/(.*)');

    request.get('/service/exists').expect(200, done);
  });

  it('should work with regular expression any star', done => {
    mockyeah.get('(.*)');

    request.get('/service/exists').expect(200, done);
  });

  it('should work with star', done => {
    mockyeah.get('*');

    request.get('/service/exists').expect(200, done);
  });
});
