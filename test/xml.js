var test = require('tape');
var hyperglue = require('../');

var xml = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom">',
  '<title>Example Feed</title>',
  '</feed>'
].join('\n');

var expected = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<feed xmlns="http://www.w3.org/2005/Atom">',
  '<title>boop</title>',
  '</feed>'
].join('\n');

test('_text', function (t) {
  t.plan(1);

  var res = hyperglue(xml, {
    'feed > title': 'boop'
  }, { xmlMode: true }).outerHTML;

  t.equal(res, expected)
});
