"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mdPluginCollapsible = exports.mdPluginSvgToBase64 = exports.mdPluginList = exports.mdPluginTableTabular = exports.mdPluginAnchor = exports.mdPluginTOC = exports.mdPluginText = exports.mdPluginMathJax = void 0;
var mdPluginRaw_1 = require("./mdPluginRaw");
var mdPluginText_1 = require("./mdPluginText");
var mdPluginTOC_1 = require("./mdPluginTOC");
var mdPluginAnchor_1 = require("./mdPluginAnchor");
var mdPluginTableTabular_1 = require("./mdPluginTableTabular");
var mdPluginLists_1 = require("./mdPluginLists");
var mdPluginCollapsible_1 = require("./mdPluginCollapsible");
var md_svg_to_base64_1 = require("./md-svg-to-base64");
/**
 * configured custom mathjax plugin
 */
exports.mdPluginMathJax = mdPluginRaw_1.default;
/**
 * configured custom tag plugin
 */
exports.mdPluginText = mdPluginText_1.default;
exports.mdPluginTOC = mdPluginTOC_1.default;
exports.mdPluginAnchor = mdPluginAnchor_1.default;
exports.mdPluginTableTabular = mdPluginTableTabular_1.default;
exports.mdPluginList = mdPluginLists_1.default;
exports.mdPluginSvgToBase64 = md_svg_to_base64_1.default;
exports.mdPluginCollapsible = mdPluginCollapsible_1.default;
//# sourceMappingURL=mdPluginConfigured.js.map