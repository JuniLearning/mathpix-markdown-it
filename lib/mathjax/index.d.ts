import 'mathjax-full/js/input/tex/AllPackages.js';
export declare const MathJax: {
    Stylesheet: () => unknown;
    TexConvert: (string: any, options?: any) => {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        speech?: string;
    } | {
        mathml?: string;
        mathml_word?: string;
        asciimath?: string;
        latex?: string;
        svg?: string;
        error?: string;
    };
    TexConvertToAscii: (string: any, options?: any) => any;
    /**
     * Typeset a TeX expression and return the SVG tree for it
     *
     * @param string {string}
     * @param display {boolean}
     * @param metric {
     *    @param {number} em      The size of 1 em in pixels
     *    @param {number} ex      The size of 1 ex in pixels
     *    @param {number} cwidth  The container width in pixels
     *    @param {number} lwidth  The line breaking width in pixels
     *    @param {number} scale   The scaling factor (unitless)
     * }
     */
    Typeset: (string: any, options?: any) => string;
    TypesetSvgAndAscii: (string: any, options?: any) => {
        html: string;
        ascii: string;
    };
    /**
     * Typeset a MathML expression and return the SVG tree for it
     *
     * @param string {string}
     * @param display {boolean}
     * @param metric {
     *    @param {number} em      The size of 1 em in pixels
     *    @param {number} ex      The size of 1 ex in pixels
     *    @param {number} cwidth  The container width in pixels
     *    @param {number} lwidth  The line breaking width in pixels
     *    @param {number} scale   The scaling factor (unitless)
     * }
     */
    TypesetMathML: (string: any, display?: boolean, metric?: any) => any;
    AsciiMathToSvg: (string: any, options?: any) => string;
    Reset: (n?: number) => void;
    GetLastEquationNumber: () => any;
};
