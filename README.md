# hterm-umdjs [![Build Status](https://travis-ci.org/dbkaplun/hterm-umdjs.svg?branch=master)](https://travis-ci.org/dbkaplun/hterm-umdjs)
Chromium's hterm, automatically packaged as a UMD module (CommonJS/AMD/globals)

## Installation

```sh
$ npm install hterm-umdjs
```

## Usage

```js
import { hterm, lib } from 'hterm-umdjs';
// or
const { hterm, lib } = require('hterm-umdjs');

hterm.defaultStorage = new lib.Storage.Memory();
const term = new hterm.Terminal();
```

## See also

* Chromium's [hterm](https://chromium.googlesource.com/apps/libapps/+/HEAD/hterm)
* [hterm-umd](https://www.npmjs.com/package/hterm-umd), another wrapper
