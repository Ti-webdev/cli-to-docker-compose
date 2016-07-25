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
    expectStr('docker run --name baz foo/bar').to.be.equal('baz:\n  image: foo/bar\n');
    // expectYml('docker run bar').to.be.eql({bar: {image: 'bar'}});
    // expectStr('docker run bar').to.be.equal('bar:\n  image: bar\n');
    // expectYml('docker run baz').to.be.eql({baz: {image: 'baz'}});
    // expectStr('docker run baz').to.be.equal('baz:\n  image: baz\n');
  });
  it('--name', function () {
    expectYml('docker run --name my_container my_image').to.be.eql({my_container: {image: 'my_image'}});
    expectYml('docker run user_name/my_image').to.be.eql({my_image: {image: 'user_name/my_image'}});
  });
  it('--add-host=[]', function () {
    expectYml('docker run --add-host db-static:86.75.30.9 my').to.be.eql({my: {image: 'my', extra_hosts: ['db-static:86.75.30.9']}});
  });
  it('--cap-add', function () {
    expectYml('docker run --cap-drop NET_ADMIN --cap-drop SYS_ADMIN my').to.be.eql({my: {image: 'my', cap_drop: ['NET_ADMIN', 'SYS_ADMIN']}});
  });
  it('--device=[]', function () {
    expectYml('docker run --device=/dev/snd:/dev/snd my').to.be.eql({my: {image: 'my', devices: ['/dev/snd:/dev/snd']}});
  });
  it('--dns=[]', function () {
    expectYml('docker run --dns 8.8.8.8 --dns 9.9.9.9 my').to.be.eql({my: {image: 'my', dns: ['8.8.8.8', '9.9.9.9']}});
  });
  it('--dns-search=[]', function () {
    expectYml('docker run --dns-search dc1.example.com --dns-search dc2.example.com my').to.be.eql({my: {image: 'my', dns_search: ['dc1.example.com', 'dc2.example.com']}});
  });
  it('-l, --label=[]', function () {
    expectYml('docker run --label "com.example.description=Accounting webapp" my').to.be.eql({my: {image: 'my', labels: ['com.example.description=Accounting webapp']}});
    expectYml('docker run --label "com.example.description=Accounting webapp" --label com.example.department=Finance --label com.example.label-with-empty-value my').to.be.eql({my: {image: 'my', labels: ['com.example.description=Accounting webapp', 'com.example.department=Finance', 'com.example.label-with-empty-value']}});
  });
  it('--link=[]', function () {
    expectYml('docker run --link baz my').to.be.eql({my: {image: 'my', links: ['baz']}});
    expectYml('docker run --link=foo --link "bar" my').to.be.eql({my: {image: 'my', links: ['foo', 'bar']}});
  });
  it('-v, --volume=[host-src:]container-dest[:<options>]', function () {
    expectYml('docker run -v /proc:/host/proc:ro -v /sys:/host/sys:ro my').to.be.eql({my: {image: 'my', volumes: ['/proc:/host/proc:ro', '/sys:/host/sys:ro']}});
    expectYml('docker run --volume /proc:/host/proc:ro --volume /sys:/host/sys:ro my').to.be.eql({my: {image: 'my', volumes: ['/proc:/host/proc:ro', '/sys:/host/sys:ro']}});
  });
  it('-p, --publish=[] ', function () {
    expectYml('docker run -p 19999:19999 my').to.be.eql({my: {image: 'my', ports: ['19999:19999']}});
  });
  it('-P, --publish-all ', function () {
    expectYml('docker run -P my').to.be.eql({my: {image: 'my'}});
    expectYml('docker run --publish-all my').to.be.eql({my: {image: 'my'}});
  });
  it('-d, --detach ', function () {
    expectYml('docker run -d my').to.be.eql({my: {image: 'my'}});
    expectYml('docker run --detach my').to.be.eql({my: {image: 'my'}});
  });
  it('-t, --tty=false', function () {
    expectYml('docker run -t my').to.be.eql({my: {image: 'my', tty: true}});
    expectYml('docker run --tty=true my').to.be.eql({my: {image: 'my', tty: true}});
  });
  it('-i, --interactive=false', function () {
    expectYml('docker run -ti my').to.be.eql({my: {image: 'my', tty: true}});
    expectYml('docker run --interactive=true my').to.be.eql({my: {image: 'my'}});
    expectYml('docker run --interactive=false my').to.be.eql({my: {image: 'my'}});
  });
  it('-e, --env=[]', function () {
    expectYml('docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres').to.be.eql({'some-postgres': {image: 'postgres', environment: {POSTGRES_PASSWORD: 'mysecretpassword'}}});
    expectStr('docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres').to.be.equal('some-postgres:\n  image: postgres\n  environment:\n    POSTGRES_PASSWORD: mysecretpassword\n');
  });
  it('--env-file=[]', function () {
    expectYml('docker run --env-file foo --env-file bar my').to.be.eql({my: {image: 'my', env_file: ['foo', 'bar']}});
    expectYml('docker run --env-file baz my').to.be.eql({my: {image: 'my', env_file: 'baz'}});
  });
  it('--expose=[]', function () {
    expectYml('docker run --expose 80 my').to.be.eql({my: {image: 'my', expose: [80]}});
      expectYml('docker run --expose 80 --expose 8080 my').to.be.eql({my: {image: 'my', expose: [80, 8080]}});
  });
  it('-p, --publish=[] ', function () {
    expectYml('docker run -p 19999:19999 my').to.be.eql({my: {image: 'my', ports: ['19999:19999']}});
  });
});
