var test = require('tape');
var hyperfast = require('../');

var html = [
  '<div class="header-item">',
  '<div class="icon"></div>',
  '<ul class="menu user-menu">',
  '<li><a></a></li>',
  '</ul>',
  '</div>'
].join('\n');

var expected = [
  '<div class="header-item">',
  '<div class="icon icon-pencil"></div>',
  '<ul class="menu user-menu">',
  '<li class="menu-header">Compose</li><li><a href="article/create">New Article</a></li>',
  '</ul>',
  '</div>'
].join('\n');

test('menu', function (t) {
  t.plan(1);

  var opts = {
    '.header-item': [ {
      '.icon': { class: 'icon icon-pencil' },
      '.menu li': [
        { 'li': { _text: 'Compose', class: 'menu-header' } },
        { 'li a': { _text: 'New Article', href: 'article/create' } }
      ]
    } ]
  };

  t.equal(hyperfast(html, opts).outerHTML, expected);
});
