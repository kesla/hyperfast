var test = require('tape');
var hyperglue = require('../');

var html = '<div class="a"><span class="b">beep</span></div>';

test('_html', function (t) {
    t.plan(1);
    
    var res = hyperglue(html, { 'div.a': { _html: '<span class="c">boop</span>' } }).innerHTML;
    t.equal(res, '<div class="a"><span class="c">boop</span></div>')
});
