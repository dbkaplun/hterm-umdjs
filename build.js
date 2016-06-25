#!/usr/bin/env node

const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')

const HTERM_REPO = 'https://chromium.googlesource.com/apps/libapps'
const HTERM_BRANCH = 'master'
const OUTFILE = 'dist/index.js'
const TMPDIR = path.join(__dirname, 'tmp')

function buildHterm (repo, branch, outfile, tmpdir) {
  if (!tmpdir) tmpdir = TMPDIR
  const gitargs = `--work-tree="${tmpdir}" --git-dir="${tmpdir}/.git"`
  execSync(`mkdir -p ${tmpdir}`)
  execSync(`git clone ${repo} ${tmpdir}`)
  execSync(`git ${gitargs} checkout ${branch}`)
  execSync(`${tmpdir}/hterm/bin/mkdist.sh`)

  fs.writeFileSync(path.join(__dirname, outfile), `
${fs.readFileSync(`${tmpdir}/hterm/dist/js/hterm_all.js`) /* libdot */}
${fs.readFileSync(`${tmpdir}/hterm/dist/js/hterm.js`)   /* hterm */}
module.exports.lib = window.lib = lib;
module.exports.hterm = window.hterm = hterm;
  `.replace(/^\s+/, '').replace(/\s+$/, '\n'))

  let [_, htermVersion] = fs.readFileSync(`${tmpdir}/hterm/doc/ChangeLog.md`).toString().match(/([\d.]+)/) || []
  let htermRev = execSync(`git ${gitargs} rev-parse HEAD`).toString().trim()
  execSync(`rm -rf ${tmpdir}`)
  return {
    version: htermVersion,
    rev: htermRev
  }
}

function updateVersion (path, htermVersion, htermRev) {
  let pkg = JSON.parse(fs.readFileSync(path))
  pkg.version = `${pkg.version.replace(/\+.*$/, '')}+${htermVersion ? `${htermVersion}.sha.` : ''}${htermRev.slice(0, 7)}`
  fs.writeFileSync(path, `${JSON.stringify(pkg, null, '  ')}\n`)
  return pkg.version
}

if (require.main === module) {
  let hterm = buildHterm(HTERM_REPO, HTERM_BRANCH, OUTFILE)
  console.log(`built ${OUTFILE}`)
  let version = updateVersion('package.json', hterm.version, hterm.rev)
  console.log(version)
}

// this is a build script but let's be a good citizen anyway
module.exports.buildHterm = buildHterm
module.exports.updateVersion = updateVersion
