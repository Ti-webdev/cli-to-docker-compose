/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

let expect = require('chai').expect;
let CliToDockerCompose = require('../lib/cli-to-docker-compose');

describe('cli-to-docker-compose module', function () {
  let expectStr = function (cli) {
    return expect(CliToDockerCompose.CliParase(cli).toString());
  };
  let expectYml = function (cli) {
    return expect(CliToDockerCompose.CliParase(cli).convert());
  };

  it('exports class', function () {
    expect(CliToDockerCompose).to.be.an('function');
  });
  it('toString()', function () {
    expect(new CliToDockerCompose().toString()).to.be.an('string');
  });
  it('is object', function () {
    expect(new CliToDockerCompose().convert()).to.be.an('object');
  });
  it('image', function () {
    expectYml('docker run foo').to.be.eql({foo: {image: 'foo'}});
    expectStr('docker run foo').to.be.equal('foo:\n  image: foo\n');
    // expectYml('docker run bar').to.be.eql({bar: {image: 'bar'}});
    // expectStr('docker run bar').to.be.equal('bar:\n  image: bar\n');
    // expectYml('docker run baz').to.be.eql({baz: {image: 'baz'}});
    // expectStr('docker run baz').to.be.equal('baz:\n  image: baz\n');
  });
  it('--name', function () {
    expectYml('docker run --name my_container my_image').to.be.eql({my_container: {image: 'my_image'}});
  });
  it('--cap-add', function () {
    expectYml('docker run --cap-drop NET_ADMIN --cap-drop SYS_ADMIN my').to.be.eql({my: {image: 'my', cap_drop: ['NET_ADMIN', 'SYS_ADMIN']}});
  });
  it('-v, --volume=[host-src:]container-dest[:<options>]', function () {
    expectYml('docker run -v /proc:/host/proc:ro -v /sys:/host/sys:ro my').to.be.eql({my: {image: 'my', volumes: ['/proc:/host/proc:ro', '/sys:/host/sys:ro']}});
    expectYml('docker run --volume /proc:/host/proc:ro --volume /sys:/host/sys:ro my').to.be.eql({my: {image: 'my', volumes: ['/proc:/host/proc:ro', '/sys:/host/sys:ro']}});
  });
  it('-p, --publish=[] ', function () {
    expectYml('docker run -p 19999:19999 my').to.be.eql({my: {image: 'my', ports: ['19999:19999']}});
  });
  it('-d, --detach ', function () {
    expectYml('docker run -d my').to.be.eql({my: {image: 'my'}});
    expectYml('docker run --detach my').to.be.eql({my: {image: 'my'}});
  });
});
