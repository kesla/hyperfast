var test = require('tape');
var hyperglue = require('../');

var html = '<div class="a"><i class="b">beep</i></div>';

test('_text', function (t) {
  t.plan(1);

  var res = hyperglue(html, { 'div.a': { _text: 'boop' } }).innerHTML;
  t.equal(res, '<div class="a">boop</div>');
});

test('_html', function (t) {
  t.plan(1);

  var res = hyperglue(html, { 'div.a': { _html: '<i class="c">boop</i>' } }).innerHTML;
  t.equal(res, '<div class="a"><i class="c">boop</i></div>');
});

test('_appendHtml', function (t) {
  t.plan(1);

  var opts = { 'div.a': { _appendHtml: '<i class="c">boop</i><i class="d"></i>' } };
  var res = hyperglue(html, opts).innerHTML;
  t.equal(res, '<div class="a"><i class="b">beep</i><i class="c">boop</i><i class="d"></i></div>');
});

test('_prependHtml', function (t) {
  t.plan(2);

  var opts = { 'div.a': { _prependHtml: '<i class="c">boop</i><i class="d"></i>' } };
  var res = hyperglue(html, opts).innerHTML;
  t.equal(res, '<div class="a"><i class="c">boop</i><i class="d"></i><i class="b">beep</i></div>');
  var res2 = hyperglue('<div class="a"></div>', opts).innerHTML;
  t.equal(res2, '<div class="a"><i class="c">boop</i><i class="d"></i></div>');
});
