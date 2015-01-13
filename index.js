var ent = require('ent');
var htmlparser = require('htmlparser2');
var CSSselect = require('CSSselect');
var domutils = require('domutils');

module.exports = hyperfast;
function hyperfast (html, params) {
    var elems = htmlparser.parseDOM(html);

    Object.keys(params).forEach(function (key) {
        var val = params[key];
        if (!val) return;
        if (typeof val === 'string') val = { _text: val };
        else if (Buffer.isBuffer(val)) val = { _text: val.toString('utf8') };
        else if (typeof val !== 'object') val = { _text: String(val) };

        if (Buffer.isBuffer(val._text)) val._text = val._text.toString('utf8');
        if (key === ':first') {
            each(CSSselect.selectOne('*', elems), val);
        } else if (/:first$/.test(key)) {
            var k = key.replace(/:first$/, '');
            each(CSSselect.selectOne(k, elems), val);
        } else {
            CSSselect(key, elems).forEach(function (elem) {
                each(elem, val);
            });
        }
    });

    var body = elems.map(function (elm) {
        return domutils.getOuterHTML(elm)
    }).join('');

    return {
        outerHTML: body,
        innerHTML: body
    };
    
    function each (elem, val) {
        if (Array.isArray(val)) {
            htmlparser.parseDOM(val.map(function (x) {
                return hyperfast(domutils.getOuterHTML(elem), x).outerHTML;
            }).join('')).reverse().forEach(function (child) {
                domutils.append(elem, child);
            });
            domutils.removeElement(elem)
        }
        else {
            Object.keys(val).forEach(function (k) {
                if (k === '_text' || k === '_html') return;
                if (val[k] === undefined) {
                    delete elem.attribs[k];
                }
                else {
                    if (val[k] && val[k].prepend) {
                        elem.attribs[k] = val[k].prepend + elem.attribs[k];
                    } else if (val[k] && val[k].append) {
                        elem.attribs[k] = elem.attribs[k] + val[k].append;
                    } else {
                        elem.attribs[k] = val[k];
                    }
                }
            });
            if (val._text) {
                domutils.appendChild(elem, {
                    data: ent.encode(val._text),
                    type: 'text'
                });
            }
            else if (val._html) {
                while(elem.children && elem.children.length > 0) {
                    domutils.removeElement(elem.children[0]);
                }
                var children = htmlparser.parseDOM(val._html);
                children.forEach(function (child) {
                    domutils.appendChild(elem, child);
                });

            }
        }
    }
}
