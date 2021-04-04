import MarkdownIt from "markdown-it";
// @ts-ignore
import hljs from 'highlight.js/lib/core.js';
// @ts-ignore
import javascript from 'highlight.js/lib/languages/javascript';
// @ts-ignore
import golang from 'highlight.js/lib/languages/go';
// @ts-ignore
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('js', javascript);
hljs.registerLanguage('go', golang);
hljs.registerLanguage('sql', sql);

export const mdParser: MarkdownIt = new MarkdownIt({
    html: true,
    typographer: true,
    langPrefix: 'lang-',
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="my-high-light-js"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre class="my-high-light-js"><code>' + mdParser.utils.escapeHtml(str) + '</code></pre>';
    }
});