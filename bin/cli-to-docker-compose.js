#!/usr/bin/env node

/*!
 * cli-to-docker-compose
 * https://github.com/Ti-webdev/cli-to-docker-compose
 */

'use strict';

let result = require('../').CliArgv().toString();

let optimist = require('optimist')
if ('{}\n' === result) {
  optimist.usage('cli-to-docker-compose docker run ...').showHelp();
}
else {
  process.stdout.write(result);
}
