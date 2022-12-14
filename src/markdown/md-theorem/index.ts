import { MarkdownIt } from 'markdown-it';
import { theoremEnvironments, getTheoremEnvironmentIndex } from "./helper";

const renderTheoremOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envName = token.environment;
  const envDescription = token.envDescription;
  const envLabel = token.envLabel;
  const envNumber = token.envNumber;
  const envStyle = token.envStyle;
  const envIndex = envName 
    ? getTheoremEnvironmentIndex(envName) 
    : -1;
  
  /**
   * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
   * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
   * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
   * */
  let styleTile = "";
  let styleDescription = "";
  let styleBody = "";
  switch (envStyle) {
    case "definition":
      styleTile = "font-weight: 600; font-style: normal;";
      styleDescription = "font-style: normal; margin-right: 10px";
      styleBody = "font-style: normal;";
      break;    
    case "plain":
      styleTile = "font-weight: 600; font-style: normal;";
      styleDescription = "font-weight: 600; font-style: normal; margin-right: 10px";
      styleBody = "font-style: italic;";
      break;    
    case "remark":
      styleTile = "font-style: italic;";
      styleDescription = "font-style: normal; margin-right: 10px";
      styleBody = "font-style: normal;";
      break;
  }
  styleTile += envDescription ? " margin-right: 6px" : " margin-right: 10px";
  styleBody += " padding: 10px 0;";
  
  if (envIndex !== -1) {
    const envItem = theoremEnvironments[envIndex];
    const labelRef = envLabel ? encodeURIComponent(envLabel) : '';
    let textTitle = envItem.isNumbered 
      ? envItem.print + ' ' + envNumber
      : envItem.print;
    let textDescription = envDescription 
      ? `(${envDescription})` 
      : '';
    textTitle += envStyle === "plain" ? '.' : textDescription ? '' : '.';
    textDescription += textDescription && envStyle === "plain" ? '' : '.';
    
    const htmlDescription = envDescription ? `<span style="${styleDescription}">${textDescription}</span>` : '';
    const htmlPrint = `<span style="${styleTile}">${textTitle}</span>`;
    const htmlTitle = htmlPrint + htmlDescription;
    
    return labelRef 
      ? `<div id="${labelRef}" class="theorem" style="${styleBody}">` + htmlTitle
      : '<div class="theorem" style="${styleBody}">' + htmlTitle;
  }
  return `<div class="theorem" style="${styleBody}">`;
};

const renderProofOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envLabel = token.envLabel;

  const labelRef = envLabel ? encodeURIComponent(envLabel) : '';
  const styleTile = "font-style: italic; margin-right: 10px";
  const styleBody = "font-style: normal; padding: 10px 0;";
  const htmlTitle = `<span style="${styleTile}">Proof.</span>`;

  return labelRef
    ? `<div id="${labelRef}" class="proof" style="${styleBody}">` + htmlTitle
    : '<div class="proof" style="${styleBody}">' + htmlTitle;
};

// const renderQEDSymbol = (tokens, idx, options, env, slf) => {
//   const token = tokens[idx];
//   let qedHtml = '';
//   for (let i = 0; i < token.children.length; i++) {
//     qedHtml += slf.renderToken(token.children, i, options, env, slf);
//   }
//   return `<span>${qedHtml}</span>`;
// };

export const mappingTheorems = {
  newtheorem: "newtheorem",
  theoremstyle: "theoremstyle",
  theorem_open: "theorem_open",
  theorem_close: "theorem_close",
  proof_open: "proof_open",
  proof_close: "proof_close",
  qedsymbol: "qedsymbol",
  qedsymbol_open: "qedsymbol_open",
  qedsymbol_close: "qedsymbol_close",
  renewcommand_qedsymbol: "renewcommand_qedsymbol",
};

export const renderTheorems = (md: MarkdownIt) => {
  Object.keys(mappingTheorems).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env = {}, slf) => {
      switch (tokens[idx].type) {
        case "newtheorem":
        case "theoremstyle":
        case "renewcommand_qedsymbol":
          return '';
        case "theorem_open":
          return renderTheoremOpen(tokens, idx, options, env, slf);         
        case "proof_open":
          return renderProofOpen(tokens, idx, options, env, slf);         
        // case "qedsymbol":
        //   return renderQEDSymbol(tokens, idx, options, env, slf);        
        case "theorem_close":
        case "proof_close":
          return "</div>";        
        case "qedsymbol_open":
          return `<span style="float: right">`;        
        case "qedsymbol_close":
          return "</span>";
        default:
          return '';
      }
    }
  })
};
