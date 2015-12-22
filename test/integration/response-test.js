'use strict';

const TestHelper = require('../TestHelper');
const request = TestHelper.request;
const mockyeah = TestHelper.mockyeah;

describe('Response', () => {
  afterEach(() => mockyeah.reset());

  describe('Status', () => {
    it('should return 404 for undeclared services', (done) => {
      request
        .get('/some/non/existent/service/end/point')
        .expect(404, done);
    });

    it('should return a default status code of 200', (done) => {
      mockyeah.get('/service/exists');

      request
        .get('/service/exists')
        .expect(200, done);
    });

    it('should support declarative status code 301', (done) => {
      mockyeah.get('/some/service/end/point', { status: 301 });

      request
        .get('/some/service/end/point')
        .expect(301, done);
    });

    it('should support declarative status code 500', (done) => {
      mockyeah.get('/some/service/end/point', { status: 500 });

      request
        .get('/some/service/end/point')
        .expect(500, done);
    });
  });

  describe('HTML', () => {
    it('should respond HTML Content-Type for HTML', (done) => {
      mockyeah.get('/service/exists', { html: '<p>Hello</p>' });

      request
        .get('/service/exists')
        .expect('Content-Type', /text\/html/)
        .expect(200, /Hello/, done);
    });

    it('should allow Content-Type override', (done) => {
      mockyeah.get('/service/exists', { html: '<p>Hello</p>', type: 'text' });

      request
        .get('/service/exists')
        .expect('Content-Type', /text\/plain/)
        .expect(200, /Hello/, done);
    });
  });

  describe('JSON', () => {
    it('should respond with JSON Content-Type for JSON', (done) => {
      mockyeah.get('/service/exists', { json: { foo: 'bar' } });

      request
        .get('/service/exists')
        .expect('Content-Type', /application\/json/)
        .expect(200, { foo: 'bar' }, done);
    });

    it('should allow Content-Type override', (done) => {
      mockyeah.get('/service/exists', { json: { foo: 'bar' }, type: 'text' });

      request
        .get('/service/exists')
        .expect('Content-Type', /text\/plain/)
        .expect(200, '{"foo":"bar"}', done);
    });
  });

  describe('Text', () => {
    it('should respond with text Content-Type for text', (done) => {
      mockyeah.get('/service/exists', { text: 'Hello' });

      request
        .get('/service/exists')
        .expect('Content-Type', /text\/plain/)
        .expect(200, 'Hello', done);
    });

    it('should allow Content-Type override', (done) => {
      mockyeah.get('/service/exists', { text: 'Hello', type: 'html' });

      request
        .get('/service/exists')
        .expect('Content-Type', /text\/html/)
        .expect(200, 'Hello', done);
    });
  });
});