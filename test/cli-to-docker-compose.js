/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

let expect = require('chai').expect;
let CliToDockerCompose = require('../lib/cli-to-docker-compose');

describe('cli-to-docker-compose module', function () {
  it('exports class', function () {
    expect(CliToDockerCompose).to.be.an('function');
  });
  it('result is string', function () {
    expect(new CliToDockerCompose().toString()).to.be.an('string');
  });
});
