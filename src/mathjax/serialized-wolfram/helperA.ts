var CONST = 0, UNARY = 1, BINARY = 2, INFIX = 3, LEFTBRACKET = 4,
  RIGHTBRACKET = 5, SPACE = 6, UNDEROVER = 7, DEFINITION = 8,
  LEFTRIGHT = 9 /*TEXT = 10, BIG = 11, LONG = 12, STRETCHY = 13,
    MATRIX = 14 UNARYUNDEROVER = 15*/; // token types

var fixphi = true;

// character lists for Mozilla/Netscape fonts
var AMcal = ["\uD835\uDC9C","\u212C","\uD835\uDC9E","\uD835\uDC9F","\u2130","\u2131","\uD835\uDCA2","\u210B","\u2110","\uD835\uDCA5","\uD835\uDCA6","\u2112","\u2133","\uD835\uDCA9","\uD835\uDCAA","\uD835\uDCAB","\uD835\uDCAC","\u211B","\uD835\uDCAE","\uD835\uDCAF","\uD835\uDCB0","\uD835\uDCB1","\uD835\uDCB2","\uD835\uDCB3","\uD835\uDCB4","\uD835\uDCB5","\uD835\uDCB6","\uD835\uDCB7","\uD835\uDCB8","\uD835\uDCB9","\u212F","\uD835\uDCBB","\u210A","\uD835\uDCBD","\uD835\uDCBE","\uD835\uDCBF","\uD835\uDCC0","\uD835\uDCC1","\uD835\uDCC2","\uD835\uDCC3","\u2134","\uD835\uDCC5","\uD835\uDCC6","\uD835\uDCC7","\uD835\uDCC8","\uD835\uDCC9","\uD835\uDCCA","\uD835\uDCCB","\uD835\uDCCC","\uD835\uDCCD","\uD835\uDCCE","\uD835\uDCCF"];

var AMfrk = ["\uD835\uDD04","\uD835\uDD05","\u212D","\uD835\uDD07","\uD835\uDD08","\uD835\uDD09","\uD835\uDD0A","\u210C","\u2111","\uD835\uDD0D","\uD835\uDD0E","\uD835\uDD0F","\uD835\uDD10","\uD835\uDD11","\uD835\uDD12","\uD835\uDD13","\uD835\uDD14","\u211C","\uD835\uDD16","\uD835\uDD17","\uD835\uDD18","\uD835\uDD19","\uD835\uDD1A","\uD835\uDD1B","\uD835\uDD1C","\u2128","\uD835\uDD1E","\uD835\uDD1F","\uD835\uDD20","\uD835\uDD21","\uD835\uDD22","\uD835\uDD23","\uD835\uDD24","\uD835\uDD25","\uD835\uDD26","\uD835\uDD27","\uD835\uDD28","\uD835\uDD29","\uD835\uDD2A","\uD835\uDD2B","\uD835\uDD2C","\uD835\uDD2D","\uD835\uDD2E","\uD835\uDD2F","\uD835\uDD30","\uD835\uDD31","\uD835\uDD32","\uD835\uDD33","\uD835\uDD34","\uD835\uDD35","\uD835\uDD36","\uD835\uDD37"];

var AMbbb = ["\uD835\uDD38","\uD835\uDD39","\u2102","\uD835\uDD3B","\uD835\uDD3C","\uD835\uDD3D","\uD835\uDD3E","\u210D","\uD835\uDD40","\uD835\uDD41","\uD835\uDD42","\uD835\uDD43","\uD835\uDD44","\u2115","\uD835\uDD46","\u2119","\u211A","\u211D","\uD835\uDD4A","\uD835\uDD4B","\uD835\uDD4C","\uD835\uDD4D","\uD835\uDD4E","\uD835\uDD4F","\uD835\uDD50","\u2124","\uD835\uDD52","\uD835\uDD53","\uD835\uDD54","\uD835\uDD55","\uD835\uDD56","\uD835\uDD57","\uD835\uDD58","\uD835\uDD59","\uD835\uDD5A","\uD835\uDD5B","\uD835\uDD5C","\uD835\uDD5D","\uD835\uDD5E","\uD835\uDD5F","\uD835\uDD60","\uD835\uDD61","\uD835\uDD62","\uD835\uDD63","\uD835\uDD64","\uD835\uDD65","\uD835\uDD66","\uD835\uDD67","\uD835\uDD68","\uD835\uDD69","\uD835\uDD6A","\uD835\uDD6B"];

export const functions = [
  "cos", "sin", "tan", "cot", 
  "sinh", "cosh", "tanh", "coth",
  "sec", "csc"
];
export const openBranches = ["(", "["];

export const getFunction = (str: string) => {
  const f = AMsymbols.find(item => item.output === str && item.func && item.wolfram);
  return f ? f.input : "";
};

export const AMsymbols = [
//some greek symbols
  {input:"alpha", symbol: "\u03B1", wolfram: "\\[Alpha]", tag:"mi", output:"\u03B1", tex: "alpha", ttype:CONST},
  {input:"beta", symbol: "\u03B2", wolfram: "\\[Beta]",  tag:"mi", output:"\u03B2", tex: "beta", ttype:CONST},
  {input:"gamma", symbol: "\u03B3", wolfram: "\\[Gamma]", tag:"mi", output:"\u03B3", tex: "gamma", ttype:CONST},
  {input:"\u0393", wolfram: "\\[CapitalGamma]", tag:"mo", output:"\u0393", tex:"Gamma", ttype:CONST},
  {input:"chi", symbol: "\u03C7", wolfram: "\\[Chi]",   tag:"mi", output:"\u03C7", tex: "chi", ttype:CONST},
  {input:"delta", symbol: "\u03B4", tag:"mi", output:"\u03B4", tex: "delta", ttype:CONST},
  {input:"\u0394", symbol: "\u0394", tag:"mo", output:"\u0394", tex: "Delta", ttype:CONST},
  {input:"\u0394", symbol: "\u0394", tag:"mi", output:"\u0394", tex: "Delta", ttype:CONST},
  {input:"epsilon", symbol: "\u03B5", tag:"mi", output:"\u03B5", tex:"epsilon", ttype:CONST},
  {input:"epsilon", symbol: "\u03F5", tag:"mi", output:"\u03F5", tex:"epsilon", ttype:CONST},
  {input:"epsilon",symbol: "\u025B", tag:"mi", output:"\u025B", tex: "varepsilon", ttype:CONST},
  {input:"eta", symbol: "\u03B7",   tag:"mi", output:"\u03B7", tex: "eta", ttype:CONST},
  {input:"iota", symbol: "\u03B9",  tag:"mi", output:"\u03B9", tex: "iota", ttype:CONST},
  {input:"kappa", symbol: "\u03BA", tag:"mi", output:"\u03BA", tex: "kappa", ttype:CONST},
  {input:"lambda", symbol: "\u03BB", tag:"mi", output:"\u03BB", tex: "lambda", ttype:CONST},
  {input:"\u039B", tag:"mo", output:"\u039B", tex: "Lambda", ttype:CONST},
  {input:"\u03BC",    tag:"mi", output:"\u03BC", tex: "mu", ttype:CONST},
  {input:"nu", symbol: "\u03BD",    tag:"mi", output:"\u03BD", tex:"nu", ttype:CONST},
  {input:"omega", symbol: "\u03C9",  tag:"mi", output:"\u03C9", tex:"omega", ttype:CONST},
  {input:"\u03A9",  tag:"mo", output:"\u03A9", tex:"Omega", ttype:CONST},
  {input:"phi", symbol: "\u03C6",   tag:"mi", output:fixphi?"\u03D5":"\u03C6", tex:"phi", ttype:CONST},
  {input:"phi", symbol: "\u03C6", tag:"mi", output:fixphi?"\u03C6":"\u03D5", tex: "varphi", ttype:CONST},
  {input:"\u03A6",    tag:"mo", output:"\u03A6", tex: "Phi", ttype:CONST},
  {input:"\u03A6",    tag:"mi", output:"\u03A6", tex: "Phi", ttype:CONST},
  {input:"pi", symbol: "\u03C0", wolfram: "Pi",    tag:"mi", output:"\u03C0", tex: "pi", ttype:CONST},
  {input:"\u03A0",     tag:"mo", output:"\u03A0", tex: "Pi", ttype:CONST},
  {input:"psi", symbol: "\u03C8",   tag:"mi", output:"\u03C8", tex:"psi", ttype:CONST},
  {input:"\u03A8",    tag:"mi", output:"\u03A8", tex: "Psi", ttype:CONST},
  {input:"\u03C1",    tag:"mi", output:"\u03C1", tex: "rho", ttype:CONST},
  {input:"\u03C3",  tag:"mi", output:"\u03C3", tex: "sigma", ttype:CONST},
  {input:"\u03A3",  tag:"mo", output:"\u03A3", tex: "Sigma", ttype:CONST},
  {input:"tau",    tag:"mi", output:"\u03C4", tex:null, ttype:CONST},
  {input:"theta", symbol: "\u03B8", wolfram: "\\[Theta]", tag:"mi", output:"\u03B8", tex:"theta", ttype:CONST},
  {input:"theta", symbol: "\u03D1", tag:"mi", output:"\u03D1", tex: "vartheta", ttype:CONST},
  {input:"\u0398",  tag:"mo", output:"\u0398", tex: "Theta", ttype:CONST},
  {input:"upsilon", tag:"mi", output:"\u03C5", tex:null, ttype:CONST},
  {input:"\u03BE",  wolfram: "\\[Xi]", tag:"mi", output:"\u03BE", tex: "xi", ttype:CONST},
  {input:"\u039E",     tag:"mo", output:"\u039E", tex:"Xi", ttype:CONST},
  {input:"zeta", symbol: "\u03B6",  tag:"mi", output:"\u03B6", tex:null, ttype:CONST},
  
//binary operation symbols
  {input:"-",  tag:"mo", output:"\u2212", tex:null, ttype:CONST},
  {input:"×",  tag:"mo", output:"\u22C5", tex:"cdot", ttype:CONST},
  {input:"*", tag:"mo", output:"\u2217", tex:"ast", ttype:CONST},
  {input:"*", tag:"mo", output:"\u22C6", tex:"star", ttype:CONST},
  {input:"/", tag:"mo", output:"/",      tex:null, ttype:CONST},
  {input:"\u00D7", tag:"mo", output:"\u00D7", tex:"times", ttype:CONST},
  {input:"/", tag:"mo", output:"\u00F7", tex:"div", ttype:CONST}, //+
  {input:"divide",   tag:"mo", output:"-:", tex:null, ttype:DEFINITION},
  {input:"\u2218",  tag:"mo", output:"\u2218", tex:"circ", ttype:CONST},
  {input:"sum", tag:"mo", output:"\u2211", tex:null, ttype:UNDEROVER},
  {input:"prod", tag:"mo", output:"\u220F", tex:null, ttype:UNDEROVER},

//binary relation symbols
  {input:"!=",   tag:"mo", output:"\u2260", tex:"ne", ttype:CONST}, //+
  {input:":=",   tag:"mo", output:":=",     tex:null, ttype:CONST}, //+
  {input:" < ",  tag:"mo", output:"<",      tex:null, ttype:CONST}, //+
  {input:" < ",  tag:"mo", output:"\u003C", tex: "textless", ttype:CONST}, //+
  {input:" > ",  tag:"mo", output:"\u003E", tex: "textgreater", ttype:CONST}, //+
  {input:" < ",  tag:"mo", output:"\u226A", tex: "ll", ttype:CONST}, //+
  {input:" > ",  tag:"mo", output:"\u226B", tex: "gg", ttype:CONST}, //+
  {input:" <= ", tag:"mo", output:"\u2264", tex:"le", ttype:CONST}, //+
  {input:" <= ", tag:"mo", output:"\u2264", tex:"leq", ttype:CONST}, //+
  {input:" > ",  tag:"mo", output:">",      tex:null, ttype:CONST}, //+
  {input:" >= ", tag:"mo", output:"\u2265", tex:"ge", ttype:CONST}, //+
  {input:" >= ", tag:"mo", output:"\u2265", tex:"geq", ttype:CONST}, //+
  {input:" >= ", tag:"mo", output:"\u2267", tex:"geqq", ttype:CONST}, //+
  {input:" >= ", tag:"mo", output:"\u2A7E", tex:"geqslant", ttype:CONST}, //+
  {input:" <= ", tag:"mo", output:"\u2266", tex:"leqq", ttype:CONST}, //+
  {input:" <= ", tag:"mo", output:"\u2A7D", tex:"leqslant", ttype:CONST}, //+
  {input:" < ",  tag:"mo", output:"\u227A", tex:"prec", ttype:CONST}, //+
  {input:" > ",  tag:"mo", output:"\u227B", tex:"succ", ttype:CONST}, //+
  {input:" <= ", tag:"mo", output:"\u2AAF", tex:"preceq", ttype:CONST}, //+
  {input:" >= ", tag:"mo", output:"\u2AB0", tex:"succeq", ttype:CONST}, //+
  
  {input:"element", symbol: "\u2208", text: "element",  tag:"mo", output:"\u2208", tex: "in", ttype:CONST}, //+
  {input:"not element", symbol: "\u2209", text: "not element", tag:"mo", output:"\u2209", tex:"notin", ttype:CONST}, //+
  {input:"\u2282", text: "subset", tag:"mo", output:"\u2282", tex:"subset", ttype:CONST},
  {input:"\u2283", text: "supset", tag:"mo", output:"\u2283", tex:"supset", ttype:CONST},
  {input:"\u2286", text: "subset", tag:"mo", output:"\u2286", tex:"subseteq", ttype:CONST},
  {input:"\u2287", text: "supset", tag:"mo", output:"\u2287", tex:"supseteq", ttype:CONST},
  {input:"<=>",  tag:"mo", output:"\u2261", tex:"equiv", ttype:CONST}, //Equivalence ≡
  
  /** logical symbols */
  {input:"\u2227", text: "and",  tag:"mo", output:"\u2227", tex:"wedge", ttype:CONST}, //+
  {input:"\u2227", text: "and", tag:"mo", output:"\u22C0", tex:"bigwedge", ttype:UNDEROVER}, //+
  {input:"\u2228", text: "or", tag:"mo", output:"\u2228", tex:"vee", ttype:CONST}, //+
  {input:"\u2228", text: "or", tag:"mo", output:"\u22C1", tex:"bigvee", ttype:UNDEROVER}, //+
  {input:"\u2229", text: "intersection", tag:"mo", output:"\u2229", tex:"cap", ttype:CONST},//+
  {input:"\u222A", text: "union", tag:"mo", output:"\u222A", tex:"cup", ttype:CONST}, //+
  {input:"\u00AC", text: "not", tag:"mo", output:"\u00AC", tex:"neg", ttype:CONST},
  {input:"\u00AC", text: "not", tag:"mo", output:"\u223C", tex:"sim", ttype:CONST},
  {input:"\u00AC", text: "not", tag:"mo", output:"\u02DC", tex:"sim", ttype:CONST},
  {input:"\u22BD", text: "nor", tag:"mo", output:"\u22BD", tex: null, ttype:CONST},
  {input:"\u22BC", text: "nand", tag:"mo", output:"\u22BC", tex: null, ttype:CONST},
  {input:"\u22BB", text: "xor", tag:"mo", output:"\u22BB", tex: null, ttype:CONST},
  {input:"implies", text: "implies", tag:"mo", output:"\u21D2", tex:"implies", ttype:CONST},
  {input:"if",  tag:"mo", output:"if",     tex:null, ttype:SPACE},
  {input:"<=>", tag:"mo", output:"\u21D4", tex:"iff", ttype:CONST},
  {input:"\u2200",  tag:"mo", output:"\u2200", tex:"forall", ttype:CONST},

//grouping brackets
  {input:"(", tag:"mo", output:"(", tex:null, ttype:LEFTBRACKET},
  {input:")", tag:"mo", output:")", tex:null, ttype:RIGHTBRACKET},
  {input:"[", tag:"mo", output:"[", tex:null, ttype:LEFTBRACKET},
  {input:"]", tag:"mo", output:"]", tex:null, ttype:RIGHTBRACKET},
  {input:"{", tag:"mo", output:"{", tex:null, ttype:LEFTBRACKET},
  {input:"}", tag:"mo", output:"}", tex:null, ttype:RIGHTBRACKET},
  {input:"|", tag:"mo", output:"|", tex:null, ttype:LEFTRIGHT},
  // {input:"||", tag:"mo", output:"∥", tex:null, ttype:LEFTRIGHT},
  // {input:"|", tag:"mo", output:"\u2225", tex:null, ttype:LEFTRIGHT},
  {input:"||", tag:"mo", output:"||", tex:null, ttype:LEFTRIGHT},
  // {input:"(:", tag:"mo", output:"\u2329", tex:"langle", ttype:LEFTBRACKET},
  // {input:"(:", tag:"mo", output:"\u27E8", tex:"langle", ttype:LEFTBRACKET},
  // {input:":)", tag:"mo", output:"\u232A", tex:"rangle", ttype:RIGHTBRACKET},
  // {input:":)", tag:"mo", output:"\u27E9", tex:"rangle", ttype:RIGHTBRACKET},
  // {input:"<<", tag:"mo", output:"\u2329", tex:null, ttype:LEFTBRACKET},
  // {input:">>", tag:"mo", output:"\u232A", tex:null, ttype:RIGHTBRACKET},
  // {input:"{:", tag:"mo", output:"{:", tex:null, ttype:LEFTBRACKET, invisible:true},
  // {input:":}", tag:"mo", output:":}", tex:null, ttype:RIGHTBRACKET, invisible:true},

//miscellaneous symbols
  {input:"int", text: "integral", tag:"mo", output:"\u222B", tex: "int", ttype:CONST},
  {input:"dx",   tag:"mi", output:"{:d x:}", tex:null, ttype:DEFINITION},
  {input:"dy",   tag:"mi", output:"{:d y:}", tex:null, ttype:DEFINITION},
  {input:"dz",   tag:"mi", output:"{:d z:}", tex:null, ttype:DEFINITION},
  {input:"dt",   tag:"mi", output:"{:d t:}", tex:null, ttype:DEFINITION},
  {input:"oint", tag:"mo", output:"\u222E", tex:null, ttype:CONST},
  {input:"oint", tag:"mtext", output:"\u222E", tex:null, ttype:CONST},
  {input:"\u2202",  tag:"mo", output:"\u2202", tex:"partial", ttype:CONST},
  {input:"\u2202",  tag:"mi", output:"\u2202", tex:"partial", ttype:CONST},
  {input:"del", symbol: "\u2207", tag:"mo", output:"\u2207", tex:"nabla", ttype:CONST},
  {input:"inf", symbol: "\u221E",  tag:"mo", output:"\u221E", tex:"infty", ttype:CONST}, //∞
  {input:"aleph", symbol: "\u2135", tag:"mo", output:"\u2135", tex: "aleph", ttype:CONST},
  {input:"...",  tag:"mo", output:"...",    tex:"ldots", ttype:CONST},
  
  {input: "'",   tag:"mo", output:"\u2032",  tex:"prime", ttype:CONST},
  {input: "''",   tag:"mo", output:"\u2033",  tex:"prime", ttype:CONST}, //double prime
  {input: "'''",   tag:"mo", output:"\u2034",  tex:"prime", ttype:CONST}, //triple prime
  {input: "''''",   tag:"mo", output:"\u2057",  tex:"prime", ttype:CONST}, //quadruple prime
  
  // {input:"tilde", tag:"mover", output:"~", tex:null, ttype:UNARY, acc:true, stretchy: false},
  // {input:"widetilde", tag:"mover", output:"\u007E", tex:null, ttype:UNARY, acc:true, stretchy: true},
  {input:"\\ ",  tag:"mo", output:"\u00A0", tex:null, ttype:CONST},
  // {input:"frown",  tag:"mo", output:"\u2322", tex:null, ttype:CONST},
  {input:",", tag:"mo", output:"\u00A0\u00A0", tex: "quad", ttype:CONST},
  
  {input:", ,", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", tex: "qquad", ttype:CONST},//ignore
  {input:"", tag:"mo", output:"qquad", tex:"qquad", ttype: CONST}, //ignore
  
  {input:"...", tag:"mo", output:"\u22EF", tex: "cdots", ttype:CONST},
  // {input:"vdots", tag:"mo", output:"\u22EE", tex:null, ttype:CONST},
  // {input:"ddots", tag:"mo", output:"\u22F1", tex:null, ttype:CONST},
  {input:"...", tag:"mo", output:"\u2026", tex: "dots", ttype:CONST},
  {input:"f",   tag:"mi", output:"f",      tex:null, ttype:UNARY, func:true},
  {input:"g",   tag:"mi", output:"g",      tex:null, ttype:UNARY, func:true},

//standard functions
  {input:"lim",  tag:"mo", output:"lim", tex:null, ttype:UNDEROVER},
  {input:"Lim",  tag:"mo", output:"Lim", tex:null, ttype:UNDEROVER},
  {input:"sin",  wolfram: "Sin", tag:"mo", output:"sin", tex:null, ttype:UNARY, func:true}, //+
  {input:"cos",  wolfram: "Cos", tag:"mo", output:"cos", tex:null, ttype:UNARY, func:true}, //+
  {input:"tan",  wolfram: "Tan", tag:"mo", output:"tan", tex:null, ttype:UNARY, func:true}, //+
  {input:"cot",  wolfram: "Cot", tag:"mo", output:"cot", tex:null, ttype:UNARY, func:true}, //+
  {input:"sinh", wolfram: "Sinh", tag:"mo", output:"sinh", tex:null, ttype:UNARY, func:true}, //+
  {input:"cosh", wolfram: "Cosh", tag:"mo", output:"cosh", tex:null, ttype:UNARY, func:true}, //+
  {input:"tanh", wolfram: "Tanh", tag:"mo", output:"tanh", tex:null, ttype:UNARY, func:true}, //+
  {input:"coth", wolfram: "Coth", tag:"mo", output:"coth", tex:null, ttype:UNARY, func:true}, //+
  {input:"sec",  wolfram: "Sec", tag:"mo", output:"sec", tex:null, ttype:UNARY, func:true}, //+
  {input:"csc",  wolfram: "Csc", tag:"mo", output:"csc", tex:null, ttype:UNARY, func:true}, //+
  {input:"arcsin", wolfram: "ArcSin", tag:"mo", output:"arcsin", tex:null, ttype:UNARY, func:true}, //+
  {input:"arccos", wolfram: "ArcCos", tag:"mo", output:"arccos", tex:null, ttype:UNARY, func:true}, //+
  {input:"arctan", wolfram: "ArcTan", tag:"mo", output:"arctan", tex:null, ttype:UNARY, func:true}, //+
  {input:"arccot", wolfram: "ArcCot", tag:"mo", output:"arctan", tex:null, ttype:UNARY, func:true}, //+
  {input:"arcsec", wolfram: "ArcSec", tag:"mo", output:"arcsec", tex:null, ttype:UNARY, func:true}, //+
  {input:"arccsc", wolfram: "ArcCsc", tag:"mo", output:"arccsc", tex:null, ttype:UNARY, func:true}, //+
  {input:"sech", wolfram: "Sech", tag:"mo", output:"sech", tex:null, ttype:UNARY, func:true},
  {input:"csch", wolfram: "Csch", tag:"mo", output:"csch", tex:null, ttype:UNARY, func:true},
  {input:"exp", wolfram: "Cos", tag:"mo", output:"exp", tex:null, ttype:UNARY, func:true},
  {input:"abs", tag:"mo", output:"abs",  tex:null, ttype:UNARY, rewriteleftright:["|","|"]},
  {input:"norm",tag:"mo", output:"norm",  tex:null, ttype:UNARY, rewriteleftright:["\u2225","\u2225"]},
  
  {input:"log",  wolfram: "Log", tag:"mo", output:"log", tex:null, ttype:UNARY, func:true},//+
  {input:"log",  wolfram: "Log", tag:"mo", output:"ln",  tex:null, ttype:UNARY, func:true},
  {input:"det",  tag:"mo", output:"det", tex:null, ttype:UNARY, func:true},
  
  {input:"dim",  tag:"mo", output:"dim", tex:null, ttype:CONST},
  {input:"mod",  tag:"mo", output:"mod", tex:null, ttype:CONST},
  {input:"gcd",  tag:"mo", output:"gcd", tex:null, ttype:UNARY, func:true},
  {input:"lcm",  tag:"mo", output:"lcm", tex:null, ttype:UNARY, func:true},
  {input:"lub",  tag:"mo", output:"lub", tex:null, ttype:CONST},
  {input:"glb",  tag:"mo", output:"glb", tex:null, ttype:CONST},
  {input:"min",  tag:"mo", output:"min", tex:null, ttype:UNDEROVER},
  {input:"max",  tag:"mo", output:"max", tex:null, ttype:UNDEROVER},

//arrows
  {input:"uarr", tag:"mo", output:"\u2191", tex:"uparrow", ttype:CONST},
  {input:"darr", tag:"mo", output:"\u2193", tex:"downarrow", ttype:CONST},
  {input:"rightarrow", text: "implies", tag:"mo", output:"\u2192", tex:"rightarrow", ttype:CONST},
  {input:"->",   tag:"mo", output:"\u2192", tex:"to", ttype:CONST},
  {input:"\u2194", text: "<=>", tag:"mo", output:"\u2194", tex:"leftrightarrow", ttype:CONST}, //⧦ //29E6
  {input:"implies", tag:"mo", output:"\u21D2", tex:"Rightarrow", ttype:CONST},
  // {input:"lArr", tag:"mo", output:"\u21D0", tex:"Leftarrow", ttype:CONST},
  {input:"\u21D4", text: "<=>", tag:"mo", output:"\u21D4", tex:"Leftrightarrow", ttype:CONST}, //⧦ //29E6
//commands with argument
  {input:"sqrt", tag:"msqrt", output:"sqrt", tex:null, ttype:UNARY},
  {input:"root", tag:"mroot", output:"root", tex:null, ttype:BINARY},
  {input:"frac", tag:"mfrac", output:"/",    tex:null, ttype:BINARY},
  {input:"/",    tag:"mfrac", output:"/",    tex:null, ttype:INFIX},
  // {input:"stackrel", tag:"mover", output:"stackrel", tex:null, ttype:BINARY},
  // {input:"overset", tag:"mover", output:"stackrel", tex:null, ttype:BINARY},
  // {input:"underset", tag:"munder", output:"stackrel", tex:null, ttype:BINARY},
  {input:"_",    tag:"msub",  output:"_",    tex:null, ttype:INFIX},
  {input:"^",    tag:"msup",  output:"^",    tex:null, ttype:INFIX},
  /** TODO: need to do it */
  // {input:"hat", tag:"mover", output:"\u005E", tex:null, ttype:UNARY, acc:true},
  {input:"widehat", tag:"mover", output:"\u005E", tex:null, ttype:UNARY, acc:true, stretchy: true},
  // {input:"bar", tag:"mover", output:"\u00AF", tex:"overline", ttype:UNARY, acc:true},
  // {input:"bar", tag:"mover", output:"macr", tex:"bar", ttype:CONST},
  // {input:"vec", tag:"mover", output:"\u2192", tex:null, ttype:UNARY, acc:true},
  // {input:"vec", tag:"mover", output:"rarr", tex:"vec", ttype:CONST},
  
  {input:".", tag:"mover", output:".",      tex: "dot", ttype:UNARY, acc:true},
  {input:".", tag:"mover", output:"\u0307", tex: "dot", ttype:UNARY, acc:true},
  {input:".", tag:"mover", output:"˙",      tex: "dot", ttype:UNARY, acc:true},
  {input:"..", tag:"mover", output:"..",    tex: "ddot", ttype:UNARY, acc:true},
  {input:"..", tag:"mover", output:"\u0308",    tex: "ddot", ttype:UNARY, acc:true},
  {input:"..", tag:"mover", output:"\u00A8",    tex: "ddot", ttype:UNARY, acc:true},
  {input:"...", tag:"mover", output:"\u20DB",    tex: "dddot", ttype:UNARY, acc:true},
  {input:"....", tag:"mover", output:"\u20DC",    tex: "ddddot", ttype:UNARY, acc:true},
  
  // {input:"ul", tag:"munder", output:"\u0332", tex:"underline", ttype:UNARY, acc:true},
  // {input:"ubrace", tag:"munder", output:"\u23DF", tex:"underbrace", ttype:UNARYUNDEROVER, acc:true},
  // {input:"obrace", tag:"mover", output:"\u23DE", tex:"overbrace", ttype:UNARYUNDEROVER, acc:true},
  {input:"color", tag:"mstyle", ttype:BINARY},
  {input:"cancel", tag:"menclose", output:"cancel", tex:null, ttype:UNARY},
 // AMquote,
  {input:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"bb", tex:null, ttype:UNARY},
  {input:"mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"mathbf", tex:null, ttype:UNARY},
  {input:"sf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"sf", tex:null, ttype:UNARY},
  {input:"mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"mathsf", tex:null, ttype:UNARY},
  {input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", tex:null, ttype:UNARY, codes:AMbbb},
  {input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", tex:null, ttype:UNARY, codes:AMbbb},
  {input:"cc",  tag:"mstyle", atname:"mathvariant", atval:"script", output:"cc", tex:null, ttype:UNARY, codes:AMcal},
  {input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", tex:null, ttype:UNARY, codes:AMcal},
  {input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"-tex-calligraphic", output:"mathcal", tex:null, ttype:UNARY, codes:AMcal},
 // {input:"text", tag:"mstyle", atname:"mathvariant", atval:"normal", output:"mathcal", tex:null, ttype:UNARY, codes:AMcal},
  
  {input:"tt",  tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"tt", tex:null, ttype:UNARY},
  {input:"mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"mathtt", tex:null, ttype:UNARY},
  {input:"fr",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"fr", tex:null, ttype:UNARY, codes:AMfrk},
  {input:"mathfrak",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"mathfrak", tex:null, ttype:UNARY, codes:AMfrk}
];
