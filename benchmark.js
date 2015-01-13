var hyperfast = require('./');
var html = require('./test/article/html');
var hyperglue = require('hyperglue');

var src = '';
console.time('hyperfast')
for(var i = 0; i < 500; ++i) {
    src += createArticle(hyperfast, {
        file: 'grobot.markdown',
        author: 'James Halliday',
        date: 'Mon Dec 24 15:31:27 2012 -0800',
        title: 'robots are pretty great',
        commit: '81c62aa62b6770a2f6bdf6865d393daf05930b4a',
        body: '<h1>robots!</h1>\n\n<p>Pretty great basically.</p>'
    }).innerHTML;
}
console.timeEnd('hyperfast')

src = '';
console.time('hyperglue')
for(var i = 0; i < 500; ++i) {
    src += createArticle(hyperglue, {
        file: 'grobot.markdown',
        author: 'James Halliday',
        date: 'Mon Dec 24 15:31:27 2012 -0800',
        title: 'robots are pretty great',
        commit: '81c62aa62b6770a2f6bdf6865d393daf05930b4a',
        body: '<h1>robots!</h1>\n\n<p>Pretty great basically.</p>'
    }).innerHTML;
}
console.timeEnd('hyperglue')

function createArticle (glue, doc) {
    var name = doc.title.replace(/[^A-Za-z0-9]+/g,'_');
    return glue(html, {
        '.title a': {
            name: name,
            href: '#' + name,
            _text: doc.title
        },
        '.commit': doc.commit,
        '.author': doc.author,
        '.date': doc.date,
        '.body': { _html: doc.body }
    });
}