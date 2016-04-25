/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

var yaml = require('js-yaml');

/**
 * @module cli-to-docker-compose
 */

class CliToDockerCompose {
    constructor (args) {
      this.args = args
    }

    toString (args) {
      return yaml.safeDump(this.args);
    }
}

module.exports = CliToDockerCompose;
