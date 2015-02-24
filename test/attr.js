var test = require('tape');
var hyperglue = require('../');

var html = '<img class="a">';

test('add attr', function (t) {
    t.plan(1);

    var res = hyperglue(html, { 'img.a': { src: '/a.png' } }).innerHTML;

    t.ok(
        res === '<img class="a" src="/a.png">'
        || res === '<img src="/a.png" class="a">',
        'has both class and src: ' + res
    );
});

test('preprend attr', function (t) {
    t.plan(1);

    var res = hyperglue(html, { 'img.a': { class: { prepend: 'b '} } }).innerHTML;
    t.equal(res, '<img class="b a">');
});

test('append attr', function (t) {
    t.plan(1);

    var res = hyperglue(html, { 'img.a': { class: { append: ' b'} } }).innerHTML;
    t.equal(res, '<img class="a b">');
});

test('append and prepend attr', function (t) {
    t.plan(1);

    var res = hyperglue(html, { 'img.a': { class: { prepend: 'pre ', append: ' post' } } }).innerHTML;
    t.equal(res, '<img class="pre a post">');
});

test('append and prepend attr', function (t) {
    t.plan(1);

    var res = hyperglue('<img>', { 'img': { class: { prepend: 'pre ', append: ' post' } } }).innerHTML;
    t.equal(res, '<img class="pre  post">');
});

test('append and prepend empty property', function (t) {
    t.plan(1);

    var res = hyperglue('<div>so </div>', {
        'div': { 'class': { prepend: 'pre ', append: ' post' } }
    }).innerHTML;
    t.equal(res, '<div class="pre  post">so </div>');
});

test('append property with empty string', function (t) {
    t.plan(1);

    var res = hyperglue('<div class="row">so </div>', {
        'div': { 'class': { append: '' } }
    }).innerHTML;
    t.equal(res, '<div class="row">so </div>');
});

test('remove attr', function (t) {
    t.plan(1);
    var res = hyperglue(html, { 'img.a': { src: undefined } }).innerHTML;
    t.equal(res, '<img class="a">');
});
