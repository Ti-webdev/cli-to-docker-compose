/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

var yaml = require('js-yaml');
var stringArgv = require('string-argv');
let optimist = require('optimist')
  .alias('d', 'detach').boolean('detach')
  .alias('t', 'tty').boolean('tty')
  .alias('i', 'interactive').boolean('interactive')
  .alias('v', 'volume')
  .alias('p', 'publish')
  .alias('P', 'publish-all').boolean('publish-all')
  .alias('e', 'env')
;


/**
 * @module cli-to-docker-compose
 */

module.exports = class CliToDockerCompose {
  static CliParase(args) {
    var argv = optimist.parse(stringArgv(args));
    return new this(argv);
  }

  static CliArgv() {
    return new this(optimist.argv);
  }

  constructor (argv) {
    this.argv = argv;
    this.keyMap = {
      volume: 'volumes',  v: 'volumes',
      publish: 'ports',   p: 'ports',
      env: 'environment', e: 'environment',
      tty: 'tty', t: 'tty',
      add_host: 'extra_hosts',
      device: 'devices',
      label: 'labels',
      link: 'links',
      ulimit: 'ulimits'
    };
  }

  applyArgs(result) {
    let nextName = false;
    this.argv._.forEach((arg) => {
      if ('docker' === arg) {
        return;
      }
      if ('run' === arg) {
        nextName = true;
        return;
      }
      if (nextName) {
        result.properties.image = arg;
        if (!result.name) {
          result.name = String(arg).replace(/^[^\/]*\//, '')
        }
        nextName = false;
      }
    });
  }

  convertKeyName(key) {
    let result = String(key).replace(/-/, '_');
    return this.keyMap[result] || result;
  }

  convertEnvironments(envs) {
    let result = {}
    envs.forEach(env => {
      let [key, value] = env.split('=', 2)
      result[key] = value
    })
    return result
  }

  applyKey(key, result) {
    let ymlkey = this.convertKeyName(key);
    let value = this.argv[key];
    if ('true' === String(value).toLowerCase()) {
      value = true;
    }
    if ('false' === String(value).toLowerCase()) {
      value = false;
    }
    switch(ymlkey) {
      case '$0':
        break;

      case '_':
        this.applyArgs(result);
        break;

      case 'name':
        result[ymlkey] = this.argv.name;
        break;

      /* skip */
      case 'd':
      case 'detach':
      case 'help':
      case 'h':
      case 'i':
      case 'interactive':
      case 'P':
      case 'publish_all':
        break;

      /* arrays */
      case 'cap_add':
      case 'cap_drop':
      case 'volumes':
      case 'volumes_from':
      case 'ports':
      case 'extra_hosts':
      case 'devices':
      case 'dns':
      case 'dns_search':
      case 'expose':
      case 'labels':
      case 'links':
      case 'security_opt':
        result.properties[ymlkey] = Array.isArray(value) ? value : [value];
        break;

      case 'environment':
        result.properties[ymlkey] = this.convertEnvironments(Array.isArray(value) ? value : [value]);
        break;

      /* boolean */
      case 'tty':
        if (value) {
          result.properties[ymlkey] = value;
        }
        break;

      default:
        result.properties[ymlkey] = value;
    }
  }

  convert() {
    let result = {
      name: '',
      properties: {}
    };
    if (this.argv && this.argv._) {
      Object.keys(this.argv).forEach((key) => this.applyKey(key, result));
    }
    if (result.name) {
      return {[result.name]: result.properties};
    }
    else {
      return {};
    }
  }

  toString() {
    let result = this.convert();
    return yaml.safeDump(result);
  }
};
