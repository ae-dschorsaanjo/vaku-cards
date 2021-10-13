/*
minUp.js
Copyright (c) 2021, B. Zoltán Gorza (ae-dschorsaanjo)

This code is under the BSD 2-clause (or "Simplified BSD") license.
For further information see the LICENSE file or visit
https://opensource.org/licenses/BSD-2-Clause.
*/

/**
 * Parser for the minUp markup language.
 * This language is very simple and only offers basic formatting, but it's not
 * the slowest thing in the world (even with this code, it's at least comparable
 * with or just outperforms faster markdown parsers in real-world-ish, intended
 * usecases).
 */
var minUp = {
    testtext: "so, *this* is some text in bold and you write it like this: `*bold*`. simple, eh\n\nsimilarly to this, you can write _italic_ and this|https://google.com is a link to google.\non, and also you can write lists as well (hopefully). [feature not yet implemented].\noh, and link|can|be|multiwords|https://dschorsaanjo.hu too!\n\nSo, what you get is `*bold*`, `_italic_`, `\\`mono\\``, `{comment}`, `[note]`, `link|some.website` and `link|with|more|words|some.other.website`.\n[you CANNOT ember <div class='awesome'>HTML</div> elements!]\n\nDid I mentioned codeblocks are possible? Just like this:",
    prefilters: {
        "<": "&lt;",
        ">": "&gt;",
        "\\*": "&#42;",
        "\\_": "&#95;",
        "\\-": "&#45;",
        "\\`": "&#96;",
        "\\{": "&#123;",
        "\\}": "&#125",
        "\\[": "&#91",
        "\\]": "&#93",
        "\\\\": "&#92",
        "\\|": "&#124",
        "\n\r": "\n"
    },
    codefilters: {
        "*": "&#42;",
        "_": "&#95;",
        "-": "&#45;",
        "{": "&#123;",
        "}": "&#125",
        "[": "&#91",
        "]": "&#93",
        "\\": "&#92",
        "|": "&#124",
        "\n": "\\\\"
    },
    preparse: function (text, filters) {
        if (!filters) filters = this.prefilters;
        if (text.indexOf("\\") == -1) {
            text = text.replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n\r", "\n");
        }
        else {
            for (k in filters) {
                text = text.replaceAll(k, filters[k]);
            }
        }
        return text;
    },
    innerparse2: function (text) {
        text = ` ${text} `
        if (text.indexOf('`&lt;') != -1)
            text = text.replace(/`&lt;([^]+)&gt;`/g, (_, m) => `<pre><code>${this.preparse(m, this.codefilters)}</code></pre>`)
        if (text.indexOf('`') != -1)
            text = text.replace(/`([^\n`]+)`/g, (_, m) => `<code>${this.preparse(m, this.codefilters)}</code>`)
        if (text.indexOf('{') != -1)
            text = text.replace(/{.*}/g, "")
        if (text.indexOf('|') != -1)
            text = text.replace(/[\s\n]([\w*_`.\|]+)\|((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}(:[0-9]{1,5})?(\/.*)?)[\s\n]/g, (_, m1, m2) => ` <a href="${encodeURI(m2).replaceAll("'", "%27")}" target="_blank">${m1.replaceAll("|", " ")}</a> `)
        if (text.indexOf('*') != -1)
            text = text.replace(/\*(\S[^\*\n]+\S)\*/g, "<b>$1</b>")
        if (text.indexOf('_') != -1)
            text = text.replace(/_(\S[^_\n]+\S)_/g, "<i>$1</i>")
        if (text.indexOf('[') != -1)
            text = text.replace(/\[([^\n\]]+)\]/g, "<span class='note'>NOTE:&nbsp;$1</span>")
        return `<p>${text.trim()}</p>`;
    },
    postparse: function (text) {
        return text.replaceAll(/\n\n+/g, "</p><p>")
            .replaceAll(/\n/g, "<br>")
            .replaceAll("\\\\", "\n");
    },
    parse: function (text) {
        return this.postparse(this.innerparse2(this.preparse(text)));
    },
    test: function () {
        return this.parse(this.testtext + "\n\n`<" + this.testtext + ">`");
    }
}