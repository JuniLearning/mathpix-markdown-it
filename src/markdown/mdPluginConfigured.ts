import MathJaxPlugin from "./mdPluginRaw";
import TextPlugin from './mdPluginText';
import tocPlugin from './mdPluginTOC';
import anchorPlugin from './mdPluginAnchor';
import tableTabularPlugin from './mdPluginTableTabular';
import listsPlugin from './mdPluginLists';
import collapsiblePlugin from './mdPluginCollapsible';
import SvgToBase64Plugin from './md-svg-to-base64';

/**
 * configured custom mathjax plugin
 */
export const mdPluginMathJax = MathJaxPlugin;

/**
 * configured custom tag plugin
 */
export const mdPluginText = TextPlugin;
export const mdPluginTOC = tocPlugin;
export const mdPluginAnchor = anchorPlugin;
export const mdPluginTableTabular = tableTabularPlugin;
export const mdPluginList = listsPlugin;
export const mdPluginSvgToBase64 = SvgToBase64Plugin;

export const mdPluginCollapsible = collapsiblePlugin;
