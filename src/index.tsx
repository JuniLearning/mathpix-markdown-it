import MathpixLoader from './components/mathpix-loader';
import MathpixMarkdown from './components/mathpix-markdown';
import {
  mathpixMarkdownPlugin,
  initMathpixMarkdown } from './markdown/mathpix-markdown-plugins';

import {
  mdPluginMathJax,
  mdPluginHighlightCode,
  mdPluginText,
  mdPluginTOC,
  mdPluginAnchor,
  mdPluginTableTabular,
  mdPluginList,
  mdPluginChemistry, 
  mdPluginCollapsible
} from "./markdown/mdPluginConfigured";

import {
  MathpixMarkdownModel,
  TMarkdownItOptions,
  optionsMathpixMarkdown,
  TOutputMath,
  TOutputMathJax,
  THtmlSanitize,
  TTocStyle
} from "./mathpix-markdown-model";

import { ISmilesOptions } from './markdown/md-chemistry';
import { resetTheoremEnvironments } from './markdown/md-theorem/helper';
import { 
  eLabelType, 
  ILabel, 
  getLabelsList, 
  getLabelByKeyFromLabelsList, 
  clearLabelsList 
} from "./markdown/common/labels";

import { normalizeLink } from './helpers/normalize-link';

export {
  MathpixLoader, MathpixMarkdown, MathpixMarkdownModel,
  mathpixMarkdownPlugin, mdPluginCollapsible,
  initMathpixMarkdown,
  mdPluginMathJax, mdPluginHighlightCode, mdPluginText, mdPluginTOC, mdPluginAnchor, mdPluginTableTabular, mdPluginList, mdPluginChemistry,
  TMarkdownItOptions, optionsMathpixMarkdown, TOutputMath, TOutputMathJax, THtmlSanitize,
  ISmilesOptions,
  resetTheoremEnvironments,
  TTocStyle,
  eLabelType, ILabel, getLabelsList, getLabelByKeyFromLabelsList, clearLabelsList,
  normalizeLink
};

