#!/usr/bin/env node

const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

// BEGIN USER-DEFINED CONSTANTS
const TMPDIR = 'tmp'
const OUT_PATH = 'dist/index.js'

const HTERM_REPO = `https://chromium.googlesource.com/apps/libapps`
const HTERM_REV = 'master'
const HTERM_GIT_ARGS = `--work-tree="${TMPDIR}" --git-dir="${TMPDIR}/.git"`
const HTERM_CHANGELOG_PATH = `${TMPDIR}/hterm/doc/ChangeLog.md`

const PACKAGE_JSON = 'package.json'
// END USER-DEFINED CONSTANTS

execSync(`mkdir -p ${TMPDIR}`)
execSync(`git clone ${HTERM_REPO} ${TMPDIR}`)
execSync(`git ${HTERM_GIT_ARGS} checkout ${HTERM_REV}`)
execSync(`${TMPDIR}/hterm/bin/mkdist.sh`)

fs.writeFileSync(path.join(__dirname, OUT_PATH), `
    ${fs.readFileSync(`${TMPDIR}/hterm/dist/js/hterm_all.js`) /* libdot */}
    ${fs.readFileSync(`${TMPDIR}/hterm/dist/js/hterm.js`)     /* hterm */}

    module.exports.lib = window.lib = lib;
    module.exports.hterm = window.hterm = hterm;
`)

let htermRev = execSync(`git ${HTERM_GIT_ARGS} rev-parse HEAD`).toString().trim()
let [_, htermVersion] = fs.readFileSync(HTERM_CHANGELOG_PATH).toString().match(/([\d.]+)/) || []

let pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON))
pkg.version = `${pkg.version.replace(/\+.*$/, '')}+${htermVersion ? `${htermVersion}.sha.` : ''}${htermRev.slice(0, 7)}`
fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, '  ')}\n`)

execSync(`rm -rf ${TMPDIR}`)
console.log(`built ${OUT_PATH}`)
