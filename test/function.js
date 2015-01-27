var test = require('tape');
var hyperglue = require('../');

var html = '<div id="beep"><span class="a">hello</span><span class="a">world</span></div>';

test('querySelectorAll', function (t) {
    t.plan(1);
    
    var params = { '#beep span.a': function (html) { return html.toUpperCase() } };
    var res = hyperglue(html, params).innerHTML;
    t.equal(res, '<div id="beep">'
      + '<span class="a">HELLO</span>'
      + '<span class="a">WORLD</span>'
      + '</div>'
    );
});
