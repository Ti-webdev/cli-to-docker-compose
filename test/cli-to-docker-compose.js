/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

var expect = require('chai').expect;
var lib = process.env.JSCOV ? require('../lib-cov/cli-to-docker-compose') : require('../lib/cli-to-docker-compose');

describe('cli-to-docker-compose module', function () {
  it('exports object', function () {
    expect(lib).to.be.an('object');
  });
  it('result is string', function () {
    expect(lib.toString).to.be.an('object');
  });
});
