#!/usr/bin/env node

'use strict';

var fs = require('fs-extra');
var path = require('path');

var glob = require('glob');
var globParent = require('glob-parent');
var $ = require('clor');
var useref = require('useref');
var program = require('commander');
var version = require('./package.json').version;

program
  .version(version)
  .arguments('<source> <dest>')
  .usage($.cyan('<source file, directory, or pattern> <destination directory> [options]').string)
  .action((source, dest) => {
    read(source).then(files => {
      var base = globParent(source);
      transform(files, dest, base)
        .catch(err => console.log($.red(`an issue occurred: ${err.message}`).string))
    })
  })
  .parse(process.argv);

if (!program.args.length) program.help();

function transform(files, dest, base) {
  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) throw err;

      var outputPath = path.join(process.cwd(), dest, file.replace(base, ''));
      var output = useref(data)[0];

      fs.outputFile(outputPath, output, err => {
        if (err) throw err;

        console.log($.green(`${file} transformed successfully`).string)
      });
    })
  })
}

function read(source) {
  return new Promise(function(resolve) {
    glob(source, (err, files) => {
      if (err) {
        console.log($.red(`${err.message}`).string);
        throw err;
      }

      resolve(files);

    });
  });
}
