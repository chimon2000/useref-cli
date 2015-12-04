var test = require('ava');
var child = require('child_process');
var fs = require('fs');
var path = require('path');

test.cb('basic', t => {
  t.plan(1);

  child.exec('node ' + __dirname + '/../bin/useref.js testfiles/01.html output', function(err) {

    if (err) t.fail();
    var file = fs.readFileSync(path.join('output', '01.html'), 'utf8');
    var expectedFile = fs.readFileSync(path.join('testfiles', '01-expected.html'), 'utf8');

    t.is(file.replace(/ /g,''), expectedFile.replace(/ /g,''));
    t.end();
  });
});

test.cb('no args', t => {
  t.plan(1);

  child.exec('node ' + __dirname + '/../bin/useref.js', function(err, stdout) {
    t.true(stdout.indexOf('Usage') > -1);
    t.end();

  });
});

test.cb('no dest', t => {
  t.plan(1);

  child.exec('node ' + __dirname + '/../bin/useref.js testdir', function(err, stdout, stderr) {
    t.true(stderr.indexOf('missing required argument') > -1);
    t.end();
  });
});
