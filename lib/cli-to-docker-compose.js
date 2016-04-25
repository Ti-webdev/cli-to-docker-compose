/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

var yaml = require('js-yaml');

/**
 * @module cli-to-docker-compose
 */

module.exports = class CliToDockerCompose {
    constructor (args) {
      this.args = args;
    }

    toString () {
      return this.args ? yaml.safeDump(this.args) : '';
    }
};
