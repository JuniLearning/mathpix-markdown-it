import { mdPluginCollapsible } from "./mdPluginConfigured";

import { mathpixMarkdownPlugin } from './mathpix-markdown-plugins';

import { injectRenderRules } from "./rules";
import {MathpixMarkdownModel as MM, TMarkdownItOptions} from '../mathpix-markdown-model'

/** md renderer */
const mdInit = (options: TMarkdownItOptions) => {
  const {htmlTags = false, xhtmlOut = false, width = 1200, breaks = true, typographer = true, linkify = true,
          outMath = {}, mathJax = {}, renderElement = {},
          lineNumbering = false, startLine = 0, htmlSanitize = true, smiles = {}, forDocx = false, openLinkInNewWindow =  true,
    isDisableEmoji=false,
    isDisableEmojiShortcuts=false,
    maxWidth = '',
    enableFileLinks = false, validateLink = null,
    toc = {},
    accessibility = null,
    nonumbers = false,
    showPageBreaks = false,
    centerImages = true,
    centerTables = true,
    enableCodeBlockRuleForLatexCommands = false
  } = options;
  const mmdOptions = {
    width: width,
    outMath: outMath,
    mathJax: mathJax,
    renderElement: renderElement,
    smiles: smiles,
    forDocx: forDocx,
    maxWidth: maxWidth,
    enableFileLinks: enableFileLinks,
    validateLink: validateLink,
    toc: toc,
    accessibility: accessibility,
    nonumbers: nonumbers,
    showPageBreaks: showPageBreaks,
    centerImages: centerImages,
    centerTables: centerTables,
    enableCodeBlockRuleForLatexCommands: enableCodeBlockRuleForLatexCommands
  };
  let md = require("markdown-it")({
    html: htmlTags,
    xhtmlOut: xhtmlOut,
    breaks: breaks,
    langPrefix: "language-",
    linkify: linkify,
    typographer: typographer,
    quotes: "“”‘’",
    lineNumbering: lineNumbering,
    startLine: startLine,
    htmlSanitize: htmlSanitize,
    openLinkInNewWindow: openLinkInNewWindow
  });

  md.use(mathpixMarkdownPlugin, mmdOptions)
    .use(require('markdown-it-multimd-table'), {enableRowspan: true, enableMultilineRows: true})
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-deflist"))
    .use(require("markdown-it-mark"))
    .use(mdPluginCollapsible)
    .use(require("markdown-it-ins"));

  if (!isDisableEmoji) {
    if (isDisableEmojiShortcuts) {
      md.use(require("markdown-it-emoji"), { shortcuts: {} })
    } else {
      md.use(require("markdown-it-emoji"))
    }
  }

  /**
   * ParserBlock.parse(str, md, env, outTokens)
   *
   * Process input string and push block tokens into `outTokens`
   **/
  md.block.parse = function (src, md, env, outTokens) {
    var state;
    if (!src) { return; }
    state = new this.State(src, md, env, outTokens);
    if (!env.lines) {
      /** Copy block state lines */
      env.lines = {
        bMarks: [...state.bMarks],
        eMarks: [...state.eMarks],
        line: [...state.line],
        lineMax: [...state.lineMax],
        sCount: [...state.sCount],
        tShift: [...state.tShift],
      }
    }
    this.tokenize(state, state.line, state.lineMax);
  };
  return md;
};

/** String transformtion pipeline */
// @ts-ignore
export const markdownToHtmlPipeline = (content: string, options: TMarkdownItOptions = {}) => {
  let md = mdInit(options);

  // inject rules override
  md = injectRenderRules(md);

  if (MM.disableRules && MM.disableRules.length > 0) {
      md.disable(MM.disableRules);
  }
  if (options.renderElement && options.renderElement.inLine) {
    return md.renderInline(content);
  } else {
    return md.render(content);
  }
};

/**
 * convert a markdown text to html
 */
export function markdownToHTML(markdown: string, options: TMarkdownItOptions = {}): string {
  return markdownToHtmlPipeline(markdown, options);
}
