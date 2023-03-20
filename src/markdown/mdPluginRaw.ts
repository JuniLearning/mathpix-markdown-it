import { MathJax } from "../mathjax/";
import { inlineTabular } from "./md-inline-rule/tabular";
import { renderTabularInline } from './md-renderer-rules/render-tabular';
import { asciiMath, backtickAsAsciiMath, renderAsciiMath } from './md-ascii';
import {
  includesSimpleMathTag,
  includesMultiMathTag,
  includesMultiMathBeginTag,
  getWidthFromDocument,
  findOpenCloseTagsMathEnvironment,
  beginTag, endTag
} from './utils';
import { openTagMML, closeTagMML, tsvSeparatorsDef } from './common/consts';
import { imageWithSize, renderRuleImage } from './md-inline-rule/image';
import { setCounterSection } from './md-inline-rule/setcounter-section';
import { renderTheorems } from './md-theorem';
import { resetTheoremEnvironments } from './md-theorem/helper';
import { newTheoremBlock } from './md-theorem/block-rule';
import { 
  newTheorem, 
  theoremStyle, 
  newCommandQedSymbol, 
  labelLatex, 
  captionLatex,
  centeringLatex,
  setCounterTheorem 
} from './md-theorem/inline-rule';
import { coreInline } from './md-inline-rule/core-inline';
import { softBreak, hardBreak } from './md-renderer-rules/breaks';
import { 
  ILabel,
  eLabelType,
  clearLabelsList, 
  addIntoLabelsList, 
  getLabelByKeyFromLabelsList 
} from "./common/labels";
const isSpace = require('markdown-it/lib/common/utils').isSpace;
import { envArraysShouldBeFlattenInTSV } from '../helpers/consts';

function MathML(state, silent, pos, endMarker = '', type = "inline_mathML") {
  const markerBegin = RegExp('^</?(math)(?=(\\s|>|$))', 'i');
  let startMathPos = pos;
  let beginMathPos = pos;
  let endMathMlPos, endMarkerPos, nextPos, token, content, match;
  const endMathMl = "</math>";

  if (!markerBegin.test(state.src.slice(startMathPos))) { return false; }
  if (state.src.slice(startMathPos, state.src.indexOf('>', startMathPos)).indexOf('block') > -1) {
    type = "display_mathML"
  }

  match = state.src
    .slice(++startMathPos)
    .match(/^(?:math)/);

  if (!match) {
    return false;
  }

  startMathPos += match[0].length;

  endMathMlPos = state.src.indexOf(endMathMl, startMathPos);
  if (endMathMlPos === -1) { return false; }

  if (endMarker && endMarker !== '') {
    endMarkerPos = state.src.indexOf(endMarker, endMathMlPos);
    nextPos = endMarkerPos + endMarker.length;
    content = state.src.slice(beginMathPos, endMarkerPos);
  } else {
    nextPos = endMathMlPos + endMathMl.length;
    content = state.src.slice(beginMathPos, endMathMlPos);
  }

  if (!silent) {
    token = state.push(type, "", 0);
    token.content = content.trim();
  }
  /** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
  convertMathToHtml(state, token, state.md.options);
  state.pos = nextPos;
  return true;
}

function inlineMathML(state, silent) {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x3C /* < */) {
    return false;
  }

  return MathML(state, silent, startMathPos);
}

// BLOCK

function mathMLBlock(state, startLine/*, endLine*/) {
  const markerBegin = RegExp('^</?(math)(?=(\\s|>|$))', 'i');
  let content, terminate, i, l, token, oldParentType, lineText, mml,
    nextLine = startLine + 1,
    terminatorRules = state.md.block.ruler.getRules('paragraph'),
    endLine = state.lineMax,

    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];

  oldParentType = state.parentType;
  state.parentType = 'paragraph';

  if (!state.md.options.html) { return false; }
  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  lineText = state.src.slice(pos, max);
  mml = openTagMML.test(lineText);

  if (!markerBegin.test(lineText)) { return false; }


  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (mml) {
      if (closeTagMML.test(lineText)) { mml = false; }

    } else {
      if (state.isEmpty(nextLine)) { break }
    }

    if (openTagMML.test(lineText)) { mml = true }

    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;

  token = state.push('paragraph_open', 'div', 1);
  token.map = [startLine, state.line];

  token = state.push('inline', '', 0);
  token.content = content;
  token.map = [startLine, state.line];
  token.children = [];

  token = state.push('paragraph_close', 'div', -1);

  state.parentType = oldParentType;
  return true;
};

const getMathEnvironment = (str: string): string => {
  str = str.trim();
  if (!str) {
    return '';
  }
  let startPos = 0;
  // {\begin{array}{c}...
  // ^^ skipping first {
  if (str.charCodeAt(startPos) === 123 /* { */) {
    startPos++;
  }
  // {  \begin{array}{c}...
  //  ^^ skipping these spaces
  for (; startPos < str.length; startPos++) {
    const code = str.charCodeAt(startPos);
    if (!isSpace(code) && code !== 0x0A) { break; }
  }
  const match = str
    .slice(startPos)
    .match(/^\\begin\{([^}]*)\}/);
  return match && match[1] ? match[1].trim() : '';
};

function multiMath(state, silent) {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startMathPos)
    .match(/^(?:\\\[|\[|\\\(|\(|begin\{([^}]*)\}|eqref\{([^}]*)\}|ref\{([^}]*)\})/); // eslint-disable-line
  if (!match) {
    return false;
  }
  if (match[1] && (match[1] === 'itemize' || match[1] === 'enumerate')) {
    return false;
  }

  startMathPos += match[0].length;
  let type, endMarker, includeMarkers; // eslint-disable-line
  let addParentheses = false;
  let math_env = '';
  let endMarkerPos = -1;
  if (match[0] === "\\[") {
    type = "display_math";
    endMarker = "\\\\]";
  } else if (match[0] === "\[") {
    type = "display_math";
    endMarker = "\\]";
  } else if (match[0] === "\\(") {
    type = "inline_math";
    endMarker = "\\\\)";
  } else if (match[0] === "\(") {
    type = "inline_math";
    endMarker = "\\)";
  } else if (match[0].includes("eqref")) {
    type = "reference_note";
    addParentheses = true; /** add parentheses so that instead of printing a plain number as 5, it will print (5). */
    endMarker = "";
  } else if (match[0].includes("ref")) {
    type = "reference_note";
    endMarker = "";
  } else if (match[1] && match[1] !== 'abstract') {
    math_env = match[1].trim();
    if (match[1].indexOf('*') > 0) {
      type = "equation_math_not_number";
    } else {
      type = "equation_math";
    }
    endMarker = `\\end{${match[1]}}`;
    const environment = match[1].trim();
    const openTag: RegExp = beginTag(environment, true);
    const closeTag: RegExp = endTag(environment, true);
    const data = findOpenCloseTagsMathEnvironment(state.src.slice(state.pos), openTag, closeTag);
    if (data?.arrClose?.length) {
      endMarkerPos = state.pos + data.arrClose[data.arrClose.length - 1]?.posStart;
    }
    includeMarkers = true;
  }

  endMarkerPos = endMarkerPos !== -1 
    ? endMarkerPos 
    : state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;

  if (state.src.slice(startMathPos, endMarkerPos).trim().indexOf('<math') === 0) {
    if (MathML(state, silent, state.src.indexOf('<math', startMathPos), endMarker, type === 'inline_math' ? "inline_mathML" : "display_mathML")) {
      return true
    }
  }


  if (!silent) {
    const token = state.push(type, "", 0);
    if (state.md.options.forLatex) {
      if (match[1]) {
        token.markup = match[1];
      } else {
        token.markup = endMarker;
      }
    }
    if (includeMarkers) {
      token.content = state.src.slice(state.pos, nextPos);
      token.math_env = math_env;
    } else if (type === "reference_note") {
      if (state.md.options.forLatex) {
        token.markup = match[0];
      }
      token.content = match ? match[2] || match[3] : "";
      token.attrSet("data-parentheses", addParentheses.toString());
    } else {
      token.content = state.src.slice(startMathPos, endMarkerPos);
      token.math_env = getMathEnvironment(token.content);
    }
    if (state.env.tabulare) {
      token.return_asciimath = true;
    }
    if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
      token.latex = '\\' + match.input;
    }
    if (type !== "reference_note") {
      /** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
      convertMathToHtml(state, token, state.md.options);
    }
  }
  state.pos = nextPos;
  return true;
}

export const findEndMarkerPos = (str: string, endMarker: string, i: number): number => {
  let index: number;
  index = str.indexOf(endMarker, i);
  if (index > 0) {
    if (str.charCodeAt(index-1) === 0x5c /* \ */) {
      index = findEndMarkerPos(str, endMarker, index+1)
    }
  }
  return index;
};

function refs(state, silent) {
  let startMathPos = state.pos;
  if (state.src.charCodeAt(startMathPos) !== 0x5c /* \ */) {
    return false;
  }
  const match = state.src
    .slice(++startMathPos)
    .match(/^(?:\\\[|\[|\\\(|\(|$|$$)/); // eslint-disable-line
  if (!match) {
    return false;
  }
  startMathPos += match[0].length;
  let type, endMarker; // eslint-disable-line
  if (match[0] === "\\[") {
    type = "display_math";
    endMarker = "\\\\]";
  } else if (match[0] === "\[") {
    type = "display_math";
    endMarker = "\\]";
  } else if (match[0] === "$$") {
    type = "display_math";
    endMarker = "$$";
  } else if (match[0] === "\\(") {
    type = "inline_math";
    endMarker = "\\\\)";
  } else if (match[0] === "\(") {
    type = "inline_math";
    endMarker = "\\)";
  } else if (match[0] === "$") {
    type = "inline_math";
    endMarker = "$";
  }

  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }

  const nextPos = endMarkerPos + endMarker.length;

  const matchRef = state.src.slice(startMathPos + 1, endMarkerPos)
    .match(/^(?:ref\{([^}]*)\})/);

  if (!matchRef) {
    return false;
  }

  if (!silent) {
    if (type === "display_math") {
      type = "reference_note_block";
    } else {
      type = "reference_note";
    }

    const token = state.push(type, "", 0);
    token.content = matchRef ? matchRef[1] : "";
    let children = [];
    state.md.inline.parse(token.content.trim(), state.md, state.env, children);
    token.children = children;
  }

  state.pos = nextPos;
  return true;
}

function simpleMath(state, silent) {
  let pos, afterStartMarker,
    startMathPos = state.pos;
  let endMarker = "$";
  if (state.src.charCodeAt(startMathPos) !== 0x24 /* $ */) {
    return false;
  }

  // Parse tex math according to http://pandoc.org/README.html#math

  pos = ++startMathPos;
  afterStartMarker = state.src.charCodeAt(pos); // eslint-disable-line

  if (afterStartMarker === 0x24 /* $ */) {
    endMarker = "$$";
    if (state.src.charCodeAt(++startMathPos) === 0x24 /* $ */) {
      // eslint-disable-line
      return false;
    }
  } else {
    // Skip if opening $ is succeeded by a space character
    if (
      afterStartMarker === 0x20 /* space */ ||
      afterStartMarker === 0x09 /* \t */ ||
      afterStartMarker === 0x0a /* \n */
    ) {
      // eslint-disable-line
      return false;
    }
  }
  const endMarkerPos = findEndMarkerPos(state.src, endMarker, startMathPos);
  if (endMarkerPos === -1) {
    return false;
  }
  if (state.src.charCodeAt(endMarkerPos - 1) === 0x5c /* \ */) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;

  if (endMarker.length === 1) {
    // Skip if $ is preceded by a space character
    const beforeEndMarker = state.src.charCodeAt(endMarkerPos - 1);
    if (
      beforeEndMarker === 0x20 /* space */ ||
      beforeEndMarker === 0x09 /* \t */ ||
      beforeEndMarker === 0x0a /* \n */
    ) {
      return false;
    }
    // Skip if closing $ is succeeded by a digit (eg $5 $10 ...)
    const suffix = state.src.charCodeAt(nextPos);
    if (suffix >= 0x30 && suffix < 0x3a) {
      return false;
    }
  }

  if (state.src.slice(startMathPos, endMarkerPos).trim().indexOf('<math') === 0) {
    if (MathML(state, silent, state.src.indexOf('<math', startMathPos), endMarker, endMarker.length === 1 ? "inline_mathML" : "display_mathML")) {
      return true
    }
  }

  if (!silent) {
    const token = state.push(
      endMarker.length === 1 ? "inline_math" : "display_math",
      "",
      0
    );
    token.content = state.src.slice(startMathPos, endMarkerPos);
    token.math_env = getMathEnvironment(token.content);
    if (state.env.tabulare) {
      token.return_asciimath = true;
    }
    if (state.md.options.forLatex) {
      token.markup = endMarker;
    }
    if (state.md.options.outMath && state.md.options.outMath.include_table_markdown) {
      token.latex = endMarker + token.content + endMarker;
    }
    /** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
    convertMathToHtml(state, token, state.md.options);
  }
  state.pos = nextPos;
  return true;
}

function usepackage(state, silent) {
  const str_usepackage = "usepackage";
  const str_geometry = "geometry";

  let beginMathPos = state.pos;
  if (state.src.charCodeAt(beginMathPos) !== 0x5c /* \ */) {
    return false;
  }

  let startMathPos = state.src.indexOf(str_usepackage, beginMathPos);


  if (startMathPos < 0) {
    return false;
  } else {
    state.src = state.src.replace(/\s/g, '');
  }
  startMathPos += str_usepackage.length;

  let match = state.src
    .slice(startMathPos)
    .match(/^(?:\[)/); // eslint-disable-line

  if (!match) {
    return false;
  }

  startMathPos += match[0].length;
  let endMarker;
  if (match[0] === "[") { endMarker = "]"; }

  const endContentPos = state.src.indexOf(endMarker, startMathPos);

  if (endContentPos === -1) {
    return false;
  }


  const content = state.src.slice(startMathPos, endContentPos);

  if (!content) {
    return false;
  }

  startMathPos = endContentPos + 1;
  match = state.src
    .slice(startMathPos)
    .match(/^(?:{)/); // eslint-disable-line

  if (!match) {
    return false;
  }

  startMathPos += match[0].length;
  endMarker = "}";
  const endMarkerPos = state.src.indexOf(endMarker, startMathPos);
  const usepackageName = state.src.slice(startMathPos, endMarkerPos);
  let type;
  if (usepackageName === str_geometry) {
    type = 'usepackage_geometry'
  }
  if (!type) {
    return false;
  }
  const nextPos = endMarkerPos + endMarker.length;
  if (!silent) {
    const token = state.push(type, "geometry", 0);
    token.content = content;
    token.hidden = true;
  }

  state.pos = nextPos;
  return true;
}

function extend(options, defaults) {
  return Object.keys(defaults).reduce((result, key) => {
    if (result[key] === undefined) {
      result[key] = defaults[key];
    }
    return result;
  }, options);
}

/** Perform math to conversion to html and get additional data from MathJax to pass it to render rules */
const convertMathToHtml = (state, token, options) => {
  const math = token.content;
  let isBlock = token.type !== 'inline_math';
  const begin_number = MathJax.GetLastEquationNumber() + 1;
  try {
    let cwidth = 1200;
    if (options && options.width && options.width > 0) {
      cwidth = options.width;
    } else {
      cwidth = getWidthFromDocument(cwidth);
    }

    if (token.type === 'display_mathML' || token.type === 'inline_mathML') {
      token.mathEquation = MathJax.TypesetMathML(math, {
        display: true,
        metric: {cwidth: cwidth},
        outMath: options.outMath,
        accessibility: options.accessibility
      });
    } else {
      if (token.return_asciimath) {
        MathJax.Reset(begin_number);
        const data = MathJax.TypesetSvgAndAscii(math, {
          display: isBlock,
          metric: {cwidth: cwidth},
          outMath: Object.assign({}, options.outMath, {
            optionAscii: {
              showStyle: false,
              extraBrackets: true,
              tableToTsv: envArraysShouldBeFlattenInTSV.includes(token.math_env),
              isSubTable: token.isSubTable,
              tsv_separators: {...tsvSeparatorsDef}
            },
          }),
          mathJax: options.mathJax,
          accessibility: options.accessibility
        });
        token.mathEquation = data.html;
        token.ascii = data.ascii;
        token.ascii_tsv = data.ascii_tsv;
        token.labels = data.labels;
      } else {
        MathJax.Reset(begin_number);
        const data = MathJax.Typeset(math, {display: isBlock, metric: { cwidth: cwidth },
          outMath: options.outMath, mathJax: options.mathJax, forDocx: options.forDocx,
          accessibility: options.accessibility,
          nonumbers: options.nonumbers
        });
        token.mathEquation = data.html;
        token.labels = data.labels;
      }
    }
    
    const number = MathJax.GetLastEquationNumber();
    let idLabels = '';
    if (token.labels) {
      /** generate parenID - needs to multiple labels */
      let labelsKeys = token.labels ? Object.keys(token.labels) : [];
      idLabels = labelsKeys?.length ? encodeURIComponent(labelsKeys.join('_')) : '';
      for (const key in token.labels) {
        const tagContent = token.labels[key].tag;
        const tagChildrenTokens = [];
        state.md.inline.parse(tagContent, state.md, state.env, tagChildrenTokens);
        addIntoLabelsList({
          key: key,
          id: idLabels,
          tag: tagContent,
          tagId: token.labels[key].id,
          tagChildrenTokens: tagChildrenTokens,
          type: eLabelType.equation
        });
      }
    }
    token.idLabels = idLabels;
    token.number= number;
    token.begin_number= begin_number;
    token.attrNumber = begin_number >= number
      ? number.toString()
      : begin_number.toString() + ',' + number.toString();
    return token;
  } catch (e) {
    console.error('ERROR MathJax =>', e.message, e);
    token.error = {
      message: e.message,
      error: e
    };
    return token;
  }
};

const renderMath = (a, token, options) => {
  const mathEquation = token.mathEquation;
  const attrNumber = token.attrNumber;
  const idLabels = token.idLabels;
  if (token.type === "equation_math") {
    return idLabels 
      ? `<span id="${idLabels}" class="math-block equation-number id=${idLabels}" number="${attrNumber}">${mathEquation}</span>`
      : `<span  class="math-block equation-number " number="${attrNumber}">${mathEquation}</span>`
  } else {
    return token.type === "inline_math" || token.type === "inline_mathML"
      ? idLabels
        ? `<span id="${idLabels}" class="math-inline id=${idLabels}">${mathEquation}</span>`
        : `<span class="math-inline ${idLabels}">${mathEquation}</span>`
      : idLabels
        ? `<span id="${idLabels}" class="math-block id=${idLabels}">${mathEquation}</span>`
        : `<span class="math-block ${idLabels}">${mathEquation}</span>`;
  }
};

const setStyle = (str) => {
  let arrStyle = str.replace('=', ':').replace(/\s/g, '').split(",");
  let newArr = [];

  arrStyle.map(item => {
    let newStr = '';
    //margin-bottom
    if (item.indexOf('top') >= 0) {
      newStr = item.replace('top', 'padding-top').replace('=', ':');
    }
    if (item.indexOf('bottom') >= 0) {
      newStr = item.replace('bottom', 'padding-bottom').replace('=', ':');
    }
    if (item.indexOf('left') >= 0) {
      newStr = item.replace('left', 'padding-left').replace('=', ':')
    }
    if (item.indexOf('right') >= 0) {
      newStr = item.replace('right', 'padding-right').replace('=', ':')
    }
    if (newStr) {
      newArr.push(newStr);
    }
    return newStr;
  });
  return newArr.join('; ');
};


const renderUsepackage = (token, options) => {
  if (token.type === "usepackage_geometry") {
    try {
      if (!document) {
        return ''
      }
    } catch (e) {
      return ''
    }
    let preview = document.getElementById('preview');
    if (options && options.renderElement && options.renderElement.preview) {
      preview = options.renderElement.preview
    }
    if (!preview) {
      return ''
    }
    const content = token.content;
    let strStyle = setStyle(content);
    preview.removeAttribute("style");
    preview.setAttribute("style", strStyle);
    return `<span class="hidden">${strStyle}</span>`
  } else {
    return ''
  }
};

const renderReference = (token, options, env, slf) => {
  let id: string = '';
  let reference = '';
  /** This attribute indicates that the reference should be enclosed in parentheses (the reference was declared as \eqref{}) */
  const dataParentheses = token.attrGet("data-parentheses");
  const label: ILabel = getLabelByKeyFromLabelsList(token.content);
  if (label) {
    id = label.id;
    reference = label.tagChildrenTokens?.length 
      ? slf.renderInline(label.tagChildrenTokens, options)
      : label.tag;
  }
  if (dataParentheses === "true" &&  reference) {
    reference = '(' + reference + ')'
  }
  if (!reference) {
    /** If the label could not be found in the list, then we display the content of this label */
    reference = '[' + token.content + ']';
  }
  let html = token.type === "reference_note_block" 
    ? `<div class="math-block">`
    : '';
  html += `<a href="#${id}" style="cursor: pointer; text-decoration: none;" class="clickable-link" value="${id}" data-parentheses="${dataParentheses}">`;
  html += reference;
  html += '</a>';
  html += token.type === "reference_note_block" ? '</div>' : '';
  return html;
};

const getCoutOpenCloseBranches = (str: string, beginMarker: string = '{', endMarker: string = '}') => {
  let openBrackets = 0;
  let openCode = 0;

  for (let i = 0; i < str.length; i++) {
    let chr = str[i];
    if ( chr === '`') {
      if (openCode > 0) {
        openCode--;
      } else {
        openCode++;
      }
    }

    if ( chr !== beginMarker && chr !== endMarker ) {
      continue;
    }
    if ( chr === beginMarker && openCode === 0) {
      openBrackets++;
      continue
    }
    if ( chr === endMarker && openCode === 0) {
      openBrackets--;
    }
  }
  return openBrackets;
};

function paragraphDiv(state, startLine/*, endLine*/) {
 // resetCounter();
  let isMathOpen = false;
  let openedAuthorBlock = false;
  let openBrackets = 0;
  // const pickStartTag: RegExp = /\\begin{(abstract|equation|equation\*|center|left|right|table|figure|tabular)}|\\\[/;
  // const pickEndTag: RegExp = /\\end{(abstract|equation|equation\*|center|left|right|table|figure|tabular)}|\\\]/;
  const pickStartTag: RegExp = /\\begin{(abstract|center|left|right|table|figure|tabular)}/;
  const pickEndTag: RegExp = /\\end{(abstract|center|left|right|table|figure|tabular)}/;
  const pickMathStartTag: RegExp = /\\begin{(equation|equation\*)}|\\\[/;
  const pickMathEndTag: RegExp = /\\end{(equation|equation\*)}|\\\]/;
  const mathStartTag: RegExp = /\\begin{([^}]*)}|\\\[|\\\(/;

  const pickTag: RegExp = /^\\(?:title|section|subsection)/;
  const listStartTag: RegExp = /\\begin{(enumerate|itemize)}/;

  let content, terminate, i, l, token, oldParentType, lineText, mml,
    nextLine = startLine + 1,
    terminatorRules = state.md.block.ruler.getRules('paragraph'),
    endLine = state.lineMax,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];



  oldParentType = state.parentType;
  state.parentType = 'paragraph';
  lineText = state.src.slice(pos, max);
  mml = openTagMML.test(lineText);

  if (lineText === '\\maketitle') {
    state.line = nextLine++;
    return true;
  }

  if (includesSimpleMathTag(lineText)) {
    isMathOpen = true;
  }

  let listOpen = false;
  let isMath = false;
  let mathEndTag: RegExp | null = null;
  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine; nextLine++) {
    if (!isMathOpen && !isMath && mathStartTag.test(lineText) //&& !pickStartTag.test(lineText)
    ) {
      mathEndTag = includesMultiMathBeginTag(lineText, mathStartTag);
      isMath = Boolean(mathEndTag);
    }
    if (isMath && mathEndTag && mathEndTag.test(lineText) //&& !pickEndTag.test(lineText)
    ) {
      if (includesMultiMathTag(lineText, mathEndTag)) {
        isMath = false
      }
    }

    const prewPos = state.bMarks[nextLine - 1] + state.tShift[nextLine - 1];
    const prewMax = state.eMarks[nextLine - 1];
    let prewLineText = state.src.slice(prewPos, prewMax);

    if (openedAuthorBlock
      && (prewLineText.indexOf('}') !== -1 || prewLineText.indexOf('{') !== -1)) {
      openBrackets += getCoutOpenCloseBranches(prewLineText);

      if (openBrackets === 0) {
        openedAuthorBlock = false;
        break;
      }
    }

    if (prewLineText.indexOf('\\author') !== -1) {
      openedAuthorBlock = true;
      openBrackets += getCoutOpenCloseBranches(prewLineText);
    }

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (listStartTag.test(prewLineText)) {
      listOpen = true;
    }

    if (includesSimpleMathTag(lineText)) {
      isMathOpen = !isMathOpen
    }

    if (mml) {
      if (closeTagMML.test(lineText)) { mml = false; }
    } else {
      if (pickTag.test(prewLineText) || pickTag.test(lineText)) {
        break;
      }
      if (state.isEmpty(nextLine)
        || pickStartTag.test(lineText) || pickEndTag.test(prewLineText)
        || (!isMath && !openedAuthorBlock && (pickMathStartTag.test(lineText) || pickMathEndTag.test(prewLineText)))) {
        break;
      }

      if (listStartTag.test(lineText) && (prewLineText.indexOf('\\item') === -1 || !listOpen)) {
        break;
      }

      if (includesSimpleMathTag(lineText) && isMathOpen || includesSimpleMathTag(prewLineText) && !isMathOpen) {
        break;
      }
    }

    if (openTagMML.test(lineText)) { mml = true }

    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    if (!isMath && !isMathOpen) {
      // Some tags can terminate paragraph without empty line.
      terminate = false;
      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true;
          break;
        }
      }
      if (terminate) { break; }
    }
  }
  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;
  token = state.push('paragraph_open', 'div', 1);
  if (state.md.options?.forDocx) {
    token.attrSet('style', 'margin-top: 0; margin-bottom: 1em;');
  }

  token.map = [startLine, state.line];
  token = state.push('inline', '', 0);
  token.content = content;
  token.map = [startLine, state.line];
  token.children = [];

  token = state.push('paragraph_close', 'div', -1);

  state.parentType = oldParentType;
  return true;
};

const latexCommands = [
  '\\title',
  '\\begin',
  '\\author',
  '\\section',
  '\\subsection',
  '\\url',
  '\\textit',
  '\\[',
  '\\abstract',
  '$$'
];

const codeBlock = (state, startLine, endLine/*, silent*/) => {
  var  last;

  let  token,  lineText,
    nextLine = startLine + 1,
    pos = state.bMarks[startLine] + state.tShift[startLine],
    max = state.eMarks[startLine];

  if (state.sCount[startLine] - state.blkIndent < 4) { return false; }

  lineText = state.src.slice(pos, max);

  const findNotCodeTag = latexCommands.findIndex((item) => {
    return (lineText.indexOf(item) === 0 ) || openTagMML.test(lineText)
  });

  if (findNotCodeTag >= 0) {
    return false
  }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  state.line = last;

  token         = state.push('code_block', 'code', 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
  token.map     = [ startLine, state.line ];

  return true;
};

const mapping = {
  math: "Math",
  inline_math: "InlineMath",
  display_math: "DisplayMath",
  equation_math: "EquationMath",
  equation_math_not_number: "EquationMathNotNumber",
  reference_note: "Reference_note",
  reference_note_block: "Reference_note block",
  tabular: "Tabular",
  tabular_inline: "Tabular_inline",
  // tsv: "TSV",
  usepackage_geometry: "Usepackage_geometry",
  display_mathML: "DisplayMathML",
  inline_mathML: "InlineMathML",
  ascii_math: "ascii_math"
};

export default options => {
  const defaults = {
    beforeMath: "",
    afterMath: "",
    beforeInlineMath: "\\(",
    afterInlineMath: "\\)",
    beforeDisplayMath: "\\[",
    afterDisplayMath: "\\]"
  };
  options = extend(options || {}, defaults);

  return md => {
    Object.assign(md.options, options);
    const isRenderElement = md.options.renderElement && md.options.renderElement.hasOwnProperty('startLine');
    /** Do not clear global lists for theorems if only one element is being rendered 
     * and not all content is being rerendered */
    if (!isRenderElement) {
      resetTheoremEnvironments();
      /** TODO: check it in vscode */
      clearLabelsList(); /** Clean up the global list of all labels */
    }
    md.block.ruler.before("paragraph", "paragraphDiv", paragraphDiv);
    if (!md.options.enableCodeBlockRuleForLatexCommands) {
      md.block.ruler.at("code", codeBlock);
    }
    md.block.ruler.before("ReNewCommand", "newTheoremBlock", newTheoremBlock)
    md.inline.ruler.before("escape", "usepackage", usepackage);
    md.block.ruler.before("html_block", "mathMLBlock", mathMLBlock);
    md.inline.ruler.before("html_inline", "mathML", inlineMathML);
    md.inline.ruler.before("escape", "refs", refs);
    md.inline.ruler.before("escape", "multiMath", multiMath);
    md.inline.ruler.before("multiMath", "inlineTabular", inlineTabular);
    md.inline.ruler.before("multiMath", "labelLatex", labelLatex);
    md.inline.ruler.before("multiMath", "captionLatex", captionLatex);
    md.inline.ruler.before("multiMath", "centeringLatex", centeringLatex);
    md.inline.ruler.before("multiMath", "theoremStyle", theoremStyle); /** Parse \theoremstyle */
    md.inline.ruler.before("multiMath", "newTheorem", newTheorem); /** Parse \newtheorem */
    md.inline.ruler.before("multiMath", "setCounterTheorem", setCounterTheorem); /** Parse \newtheorem */
    md.inline.ruler.before("setCounterTheorem", "setCounterSection", setCounterSection); /** Parse \setcounter{section} */
    md.inline.ruler.before("renewcommand_inline", "newCommandQedSymbol", newCommandQedSymbol); /** Parse \\renewcommand\qedsymbol{$\blacksquare$} */
    md.inline.ruler.push("simpleMath", simpleMath);
    md.inline.ruler.before("multiMath", "asciiMath", asciiMath);
    md.inline.ruler.before("asciiMath", "backtickAsAsciiMath", backtickAsAsciiMath);
    /** Replace image inline rule */
    md.inline.ruler.at('image', imageWithSize);
    /** Replace inline core rule */
    md.core.ruler.at('inline', coreInline);

    Object.keys(mapping).forEach(key => {
      md.renderer.rules[key] = (tokens, idx, options, env, slf) => {
        switch (tokens[idx].type) {
          case "tabular":
            return renderTabularInline(tokens, tokens[idx], options, env, slf);
          case "tabular_inline":
            return renderTabularInline(tokens, tokens[idx], options, env, slf);
          // case "tsv":
          //   return renderTSV(tokens, tokens[idx], options);
          case "reference_note":
            return renderReference(tokens[idx], options, env, slf);
          case "reference_note_block":
            return renderReference(tokens[idx], options, env, slf);
          case "usepackage_geometry":
            return renderUsepackage(tokens[idx], options);
          case "ascii_math":
            return renderAsciiMath(tokens, idx, options);
          default:
            return renderMath(tokens, tokens[idx], options);
        }
      }
    });
    /**
     * Replacing the default renderer rules(softbreak and hardbreak) to ignore insertion of line breaks after hidden tokens.
     * Hidden tokens do not participate in rendering
     * */
    md.renderer.rules.softbreak = softBreak;    
    md.renderer.rules.hardbreak = hardBreak;
    md.renderer.rules.image = (tokens, idx, options, env, slf) => renderRuleImage(tokens, idx, options, env, slf);
    renderTheorems(md);
  };
};
