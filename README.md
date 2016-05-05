### Important!
Implemented some docker options only.

# cli-to-docker-compose [![Build Status](http://img.shields.io/travis/Ti-webdev/cli-to-docker-compose.svg?style=flat)](http://travis-ci.org/Ti-webdev/cli-to-docker-compose) [![Code Coverage](http://img.shields.io/coveralls/Ti-webdev/cli-to-docker-compose.svg?style=flat)](https://coveralls.io/r/Ti-webdev/cli-to-docker-compose) [![NPM version](http://img.shields.io/npm/v/cli-to-docker-compose.svg?style=flat)](https://www.npmjs.org/package/cli-to-docker-compose) [![Dependency Status](http://img.shields.io/david/Ti-webdev/cli-to-docker-compose.svg?style=flat)](https://david-dm.org/Ti-webdev/cli-to-docker-compose)

> Conver docker cli to docker-compose.yml format

## Installation


Install using [npm](https://www.npmjs.org/):

```sh
npm install -g cli-to-docker-compose
```

## Usage
for example:
```bash
cli-to-docker-compose docker run -d --cap-add SYS_PTRACE --name netdata -v /proc:/host/proc:ro -v /sys:/host/sys:ro -p 19999:19999 titpetric/netda
```

output:
```yml
netdata:
  image: titpetric/netda
  cap_add:
    - SYS_PTRACE
  volumes:
    - '/proc:/host/proc:ro'
    - '/sys:/host/sys:ro'
  ports:
    - '19999:19999'
```

## Contributing

Please submit all issues and pull requests to the [Ti-webdev/cli-to-docker-compose](http://github.com/Ti-webdev/cli-to-docker-compose) repository!

## Tasks

List available tasks using `gulp help`.

## Tests

Run tests using `npm test` or `gulp test`.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/Ti-webdev/cli-to-docker-compose/issues).
