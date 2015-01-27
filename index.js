var ent = require('ent');
var htmlparser = require('htmlparser2');
var CSSselect = require('CSSselect');
var domutils = require('domutils');

module.exports = hyperfast;
function hyperfast (html, params) {
    // wrap elements so that there's always a root element
    // available, e.g. node.parent is never null
    var wrapped = htmlparser.parseDOM('<wrap>' + html + '</wrap>');
    var elems = wrapped[0].children;

    Object.keys(params).forEach(function (key) {
        var val = params[key];
        if (!val) return;
        if (typeof val === 'string') val = { _html: val };
        else if (Buffer.isBuffer(val)) val = { _html: val.toString('utf8') };
        else if (typeof val === 'function') val = { _iterator: val }
        else if (typeof val !== 'object') val = { _html: String(val) };

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
                if (
                    k === '_text' ||
                    k === '_html' ||
                    k === '_append' ||
                    k === '_appendText' ||
                    k === '_appendHtml' ||
                    k === '_prepend' ||
                    k === '_prependText' ||
                    k === '_prependHtml' ||
                    k === '_iterator') return;
                if (val[k] === undefined) {
                    delete elem.attribs[k];
                }
                else {
                    if (val[k] && val[k].append !== undefined || val[k].prepend !== undefined) {

                    if (val[k] && val[k].prepend) {
                        elem.attribs[k] = val[k].prepend + (elem.attribs[k] || '');
                    }

                    if (val[k] && val[k].append) {
                        elem.attribs[k] = (elem.attribs[k] || '') + val[k].append;
                    }

                    } else {
                        elem.attribs[k] = val[k];
                    }
                }
            });
            if (val._text) {
                while(elem.children && elem.children.length > 0) {
                    domutils.removeElement(elem.children[0]);
                }
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
            else if (val._appendHtml) {
                var children = htmlparser.parseDOM(val._appendHtml);
                children.forEach(function (child) {
                    domutils.appendChild(elem, child);
                });

            }
            else if (val._appendText || val._append) {
                var children = htmlparser.parseDOM(ent.encode(val._appendText || val._append));
                children.forEach(function (child) {
                    domutils.appendChild(elem, child);
                })
            }
            else if (val._prependHtml) {
                var children = htmlparser.parseDOM(val._prependHtml);
                children.reverse().forEach(function (child) {
                    if (!elem.children || elem.children.length === 0) {
                        domutils.appendChild(elem, child);
                    } else {
                        domutils.prepend(elem.children[0], child);
                    }
                });
            }
            else if (val._prependText || val._prepend) {
                var children = htmlparser.parseDOM(ent.encode(val._prependText || val._prepend));
                children.reverse().forEach(function (child) {
                    if (!elem.children || elem.children.length === 0) {
                        domutils.appendChild(elem, child);
                    } else {
                        domutils.prepend(elem.children[0], child);
                    }
                });
            }
            else if (val._iterator) {
                var newHtml = val._iterator(elem.children.map(function (child) {
                    return domutils.getOuterHTML(child)
                }).join(''))
                var newChildren = htmlparser.parseDOM(newHtml);
                while(elem.children && elem.children.length > 0) {
                    domutils.removeElement(elem.children[0]);
                }
                newChildren.forEach(function (child) {
                    domutils.appendChild(elem, child);
                });
            }
        }
    }
}
