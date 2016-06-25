#!/usr/bin/env node

const execSync = require('child_process').execSync
const fs = require('fs')

const TMP = 'tmp'
const DIST_PATH = 'dist/index.js'
const HTERM_REPO = 'https://chromium.googlesource.com/apps/libapps'
const HTERM_PATH = `${TMP}/libapps/hterm`

execSync(`mkdir -p ${TMP}`)
execSync(`cd ${TMP} && (git clone -q ${HTERM_REPO}; cd ..)`)
execSync(`${HTERM_PATH}/bin/mkdist.sh`)

fs.writeFileSync(DIST_PATH, `
    ${fs.readFileSync(`${HTERM_PATH}/dist/js/hterm_all.js`) /* libdot */}
    ${fs.readFileSync(`${HTERM_PATH}/dist/js/hterm.js`)     /* hterm */}

    module.exports.lib = lib;
    module.exports.hterm = hterm;
`)

execSync(`rm -rf ${TMP}`)
console.log(`built ${DIST_PATH}`)
