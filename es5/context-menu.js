(()=>{var e={640:(e,t,n)=>{"use strict";var a=n(742),r={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,o,i,l,s,c,u=!1;t||(t={}),n=t.debug||!1;try{if(i=a(),l=document.createRange(),s=document.getSelection(),(c=document.createElement("span")).textContent=e,c.style.all="unset",c.style.position="fixed",c.style.top=0,c.style.clip="rect(0, 0, 0, 0)",c.style.whiteSpace="pre",c.style.webkitUserSelect="text",c.style.MozUserSelect="text",c.style.msUserSelect="text",c.style.userSelect="text",c.addEventListener("copy",(function(a){if(a.stopPropagation(),t.format)if(a.preventDefault(),void 0===a.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var o=r[t.format]||r.default;window.clipboardData.setData(o,e)}else a.clipboardData.clearData(),a.clipboardData.setData(t.format,e);t.onCopy&&(a.preventDefault(),t.onCopy(a.clipboardData))})),document.body.appendChild(c),l.selectNodeContents(c),s.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(a){n&&console.error("unable to copy using execCommand: ",a),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(a){n&&console.error("unable to copy using clipboardData: ",a),n&&console.error("falling back to prompt"),o=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"⌘":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(o,e)}}finally{s&&("function"==typeof s.removeRange?s.removeRange(l):s.removeAllRanges()),c&&document.body.removeChild(c),i()}return u}},742:e=>{e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],a=0;a<e.rangeCount;a++)n.push(e.getRangeAt(a));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}},21:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.removeListenerContextMenuEvents=t.addListenerContextMenuEvents=t.removeTouchStartListener=t.addTouchStartListener=t.removeResizeListener=t.addResizeListener=t.removeKeyUpListener=t.addKeyUpListener=t.removeClickListener=t.addClickListener=t.removeContextMenuListener=t.addContextMenuListener=t.handleResize=t.handleKeyUp=t.handleClick=t.handleTouchStart=void 0;var a=n(639),r=n(166),o=n(92),i=n(692),l=!1,s=function(e){var t=r.clickInsideElement(e,"MathJax");t&&t.parentElement?(e.preventDefault(),a.toggleMenuOn(t.parentElement,e)):a.toggleMenuOff()};t.handleTouchStart=function(e){var t=r.clickInsideElement(e,o.classNameMenuItem);l=!1,a.isOpenContextMenu()&&!t&&(e.stopPropagation(),a.toggleMenuOff(),l=!0)},t.handleClick=function(e){if("ontouchstart"in document.documentElement){var t=r.clickInsideElement(e,"MathJax");if(t)return l?void(l=!1):(e.stopPropagation(),void(a.isOpenContextMenu()?a.toggleMenuOff():a.toggleMenuOn(t.parentElement,e)))}var n=r.clickInsideElement(e,o.classNameMenuItem);n?(e.stopPropagation(),i.clearActiveItem(),i.chooseItem(n)):a.toggleMenuOff()},t.handleKeyUp=function(e){"Escape"===e.key&&a.toggleMenuOff()},t.handleResize=function(){a.toggleMenuOff()},t.addContextMenuListener=function(){document.addEventListener("contextmenu",s)},t.removeContextMenuListener=function(){document.removeEventListener("contextmenu",s)},t.addClickListener=function(){document.addEventListener("click",t.handleClick)},t.removeClickListener=function(){document.removeEventListener("click",t.handleClick)},t.addKeyUpListener=function(){document.addEventListener("keyup",t.handleKeyUp)},t.removeKeyUpListener=function(){document.removeEventListener("keyup",t.handleKeyUp)},t.addResizeListener=function(){document.addEventListener("resize",t.handleResize)},t.removeResizeListener=function(){document.removeEventListener("resize",t.handleResize)},t.addTouchStartListener=function(){document.addEventListener("touchstart",t.handleTouchStart)},t.removeTouchStartListener=function(){document.removeEventListener("touchstart",t.handleTouchStart)},t.addListenerContextMenuEvents=function(){t.addContextMenuListener(),t.addClickListener(),t.addKeyUpListener(),t.addResizeListener(),t.addTouchStartListener()},t.removeListenerContextMenuEvents=function(){t.removeContextMenuListener(),t.removeClickListener(),t.removeKeyUpListener(),t.removeResizeListener(),t.removeTouchStartListener()}},92:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.eMathType=t.mathExportTypes=t.maxWidthMenu=t.paddingMenuBottomSmall=t.paddingMenu=t.heightMenuItem=t.SMALL_SCREEN_BREAKPOINT=t.classNameMenuItemSource=t.classNameMenuItem=t.classNameMenu=t.classNameContextMenu=void 0,t.classNameContextMenu="mmd-context-menu",t.classNameMenu="mmd-menu",t.classNameMenuItem="mmd-menu-item",t.classNameMenuItemSource="mmd-menu-item-source",t.SMALL_SCREEN_BREAKPOINT=580,t.heightMenuItem=52,t.paddingMenu=5,t.paddingMenuBottomSmall=34,t.maxWidthMenu=320,t.mathExportTypes=["latex","asciimath","mathml","mathmlword"],function(e){e.latex="latex",e.asciimath="asciimath",e.mathml="mathml",e.mathmlword="mathmlword"}(t.eMathType||(t.eMathType={}))},166:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.clickInsideElement=t.getPositionMenuByClick=t.positionMenu=t.getContextMenuElement=t.getMenuElement=t.getPosition=void 0;var a=n(92);t.getPosition=function(e){var t=0,n=0;return e||(e=window.event),e.pageX||e.pageY?(t=e.pageX,n=e.pageY):(e.clientX||e.clientY)&&(t=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,n=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),{x:t,y:n}},t.getMenuElement=function(){return document.querySelector("."+a.classNameMenu)},t.getContextMenuElement=function(){return document.querySelector("."+a.classNameContextMenu)},t.positionMenu=function(e){var n=t.getMenuElement();if(n){var r=t.getPosition(e),o=r.x,i=r.y,l=n.offsetWidth+4,s=n.offsetHeight+4,c=window.innerWidth,u=window.innerHeight;if(c<=a.SMALL_SCREEN_BREAKPOINT){n.style.left=0,n.style.bottom=0,n.style.maxWidth="100vw",n.classList.add("mmd-menu-sm");var m=t.getContextMenuElement();m&&!m.classList.contains(a.classNameContextMenu+"-overlay")&&m.classList.add(a.classNameContextMenu+"-overlay")}else n.style.left=c-o<l?c-l+"px":o+"px",n.style.top=u-i<s?u-s+"px":i+"px"}},t.getPositionMenuByClick=function(e,n){var r=t.getPosition(e),o=r.x,i=r.y,l=a.heightMenuItem*n+a.paddingMenu+2,s=a.maxWidthMenu+4,c=window.innerWidth,u=window.innerHeight,m=document.body.scrollTop+document.documentElement.scrollTop,d={};return c<=a.SMALL_SCREEN_BREAKPOINT?(l+=a.paddingMenuBottomSmall,d.left="0px",d.top=u+m-l+"px",d.maxWidth="100vw",d.className="mmd-menu-sm",d):(l+=a.paddingMenu,d.left=c-o<s?c-s+"px":o+"px",d.top=u+m-i<l?u+m-l+"px":i+"px",d)},t.clickInsideElement=function(e,t){var n=e.target;if(n.classList.contains(t))return n;for(;n=n.parentNode;)if(n.classList&&n.classList.contains(t))return n;return null}},639:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.toggleMenuOff=t.toggleMenuOn=t.isOpenContextMenu=t.dropContextMenu=t.createContextMenu=void 0;var a=n(253),r=n(692),o=n(92),i=n(166),l=function(e){switch(e.key){case"ArrowDown":case"ArrowRight":r.chooseNextItem();break;case"ArrowUp":case"ArrowLeft":r.choosePreviousItem()}},s=function(){return document.querySelector("."+o.classNameContextMenu)};t.createContextMenu=function(e,t){try{var n=a.mathMenuItems(e);if(!n||!n.length)return;var r=document.createElement("div");r.setAttribute("class",o.classNameContextMenu),r.setAttribute("style","position: absolute; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;");var s=document.createElement("div");s.setAttribute("style","position: fixed; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;"),r.appendChild(s);var c=document.createElement("div");c.setAttribute("class",o.classNameMenu),c.setAttribute("role","menu"),c.setAttribute("aria-label","Copy to Clipboard"),c.setAttribute("tabindex","0");for(var u=0;u<n.length;u++)c.appendChild(n[u]);var m=i.getPositionMenuByClick(t,n.length);"mmd-menu-sm"===m.className?(c.style.left=m.left,c.style.bottom="0",c.style.position="fixed",c.style.maxWidth=m.maxWidth,c.classList.add(m.className),s.classList.add(o.classNameContextMenu+"-overlay")):(c.style.left=m.left,c.style.top=m.top),function(e){e.addEventListener("keydown",l)}(c),r.appendChild(c),document.body.appendChild(r),c.focus()}catch(e){console.error(e)}},t.dropContextMenu=function(e){try{e||(e=s()),e&&((t=document.querySelector("."+o.classNameMenu))&&t.removeEventListener("keydown",l),document.body.removeChild(e))}catch(e){console.error(e)}var t},t.isOpenContextMenu=function(){var e=s();return Boolean(e)},t.toggleMenuOn=function(e,n){var a=s();a?(t.dropContextMenu(a),t.createContextMenu(e,n)):t.createContextMenu(e,n)},t.toggleMenuOff=function(){t.dropContextMenu()}},692:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.choosePreviousItem=t.chooseNextItem=t.chooseItem=t.clearActiveItem=t.findIndexActiveItem=t.getMenuItemActive=t.getMenuItems=void 0;var a=n(640),r=n(92),o=n(104);t.getMenuItems=function(){return document.querySelectorAll("."+r.classNameMenuItem)},t.getMenuItemActive=function(){return document.querySelector("."+r.classNameMenuItem+".active")},t.findIndexActiveItem=function(e,t){if(!e||!t||!t.length)return-1;for(var n=0;n<t.length;n++)if(t[n]===e)return n;return-1},t.clearActiveItem=function(){var e=document.querySelectorAll("."+r.classNameMenuItem+".active");if(e&&e.length)for(var t=0;t<e.length;t++)e[t].classList.remove("active")},t.chooseItem=function(e){try{if(!e)return;var t=e.querySelector("."+r.classNameMenuItemSource);if(t){e.focus();var n=t.innerHTML,i=t.getAttribute("data-type");n=i===r.eMathType.mathmlword?o.formatSourceHtmlWord(n):i===r.eMathType.mathml?n:o.formatSourceHtml(n),a(n,{format:"text/plain",debug:!0})}e.classList.contains("active")||e.classList.add("active")}catch(e){console.error(e)}},t.chooseNextItem=function(){var e=t.getMenuItems();if(e&&e.length){var n=t.getMenuItemActive(),a=t.findIndexActiveItem(n,e),r=e&&e.length?e.length-1:0;if(n){a++,n.classList.remove("active");var o=e[a];n=void 0!==typeof o&&a<=r?o:e[0],t.chooseItem(n)}else t.chooseItem(e[0])}},t.choosePreviousItem=function(){var e=t.getMenuItems();if(e&&e.length){var n=t.getMenuItemActive(),a=t.findIndexActiveItem(n,e),r=e&&e.length?e.length-1:0;if(n){a--,n.classList.remove("active");var o=e[a];n=void 0!==typeof o&&a>=0?o:e[r],t.chooseItem(n)}else t.chooseItem(e[r])}}},610:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createMathMenuItem=void 0;var a=n(92),r=n(104);t.createMathMenuItem=function(e,t){try{var n="",o="";switch(e){case a.eMathType.latex:n="LaTeX",o=r.formatSource(t);break;case a.eMathType.asciimath:n="Asciimath",o=r.formatSource(t);break;case a.eMathType.mathml:n="Mathml",o=r.formatSourceMML(t);break;case a.eMathType.mathmlword:n="Mathml (MS Word)",o=t}if(!n)return null;var i=document.createElement("div");i.setAttribute("class",a.classNameMenuItem),i.setAttribute("role","menuitem"),i.setAttribute("aria-label",n+" has been copied to Clipboard"),i.setAttribute("aria-disabled","false"),i.setAttribute("tabindex","-1");var l=document.createElement("div");l.setAttribute("class",a.classNameMenuItem+"-container");var s=document.createElement("div");s.setAttribute("class",a.classNameMenuItem+"-title"),s.innerText=n,l.appendChild(s);var c=document.createElement("div");c.setAttribute("class",a.classNameMenuItem+"-value"),c.innerText=t.replace(/\n/g,""),l.appendChild(c);var u=document.createElement("div");u.setAttribute("class",a.classNameMenuItem+"-source"),u.setAttribute("data-type",e),u.style.display="none",u.innerHTML=o,l.appendChild(u);var m=document.createElement("div");return m.setAttribute("class",a.classNameMenuItem+"-icon"),m.setAttribute("aria-disabled","true"),m.innerHTML='<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.625 5.125H8.875V3.875H17.625C18.6605 3.875 19.5 4.71447 19.5 5.75V16.375H18.25V5.75C18.25 5.40482 17.9702 5.125 17.625 5.125Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.125 8.25C5.125 7.21447 5.96447 6.375 7 6.375H15.125C16.1605 6.375 17 7.21447 17 8.25V18.25C17 19.2855 16.1605 20.125 15.125 20.125H7C5.96447 20.125 5.125 19.2855 5.125 18.25V8.25ZM7 7.625H15.125C15.4702 7.625 15.75 7.90482 15.75 8.25V18.25C15.75 18.5952 15.4702 18.875 15.125 18.875H7C6.65482 18.875 6.375 18.5952 6.375 18.25V8.25C6.375 7.90482 6.65482 7.625 7 7.625Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M20 13.5C16.4101 13.5 13.5 16.4101 13.5 20C13.5 23.5899 16.4101 26.5 20 26.5C23.5899 26.5 26.5 23.5899 26.5 20C26.5 16.4101 23.5899 13.5 20 13.5ZM19 22.7071L23.3536 18.3536L22.6465 17.6465L19 21.2929L17.3536 19.6465L16.6465 20.3536L19 22.7071Z" fill="#4DA660"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M23.3536 18.3536L19 22.7071L16.6465 20.3536L17.3536 19.6464L19 21.2929L22.6465 17.6464L23.3536 18.3536Z" fill="white"></path></svg>',i.appendChild(l),i.appendChild(m),i}catch(e){return console.error(e),null}}},253:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mathMenuItems=void 0;var a=n(92),r=n(610),o=n(104);t.mathMenuItems=function(e){var t=[];try{var n=o.parseMmdElement(e);if(!n||!n.length)return t;for(var i=function(e){var o=n.find((function(t){return t.type===a.mathExportTypes[e]}));if(!o)return"continue";var i=r.createMathMenuItem(o.type,o.value);i&&t.push(i)},l=0;l<a.mathExportTypes.length;l++)i(l);return t}catch(e){return console.error(e),t}}},669:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.exportMethods=void 0;var a=n(21);t.exportMethods=function(){window.addListenerContextMenuEvents=a.addListenerContextMenuEvents,window.removeListenerContextMenuEvents=a.removeListenerContextMenuEvents},t.exportMethods()},104:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseMarkdownByElement=t.parseMmdElement=t.formatSourceMML=t.formatSource=t.formatSourceHtmlWord=t.formatSourceHtml=void 0,t.formatSourceHtml=function(e,t){return void 0===t&&(t=!1),(e=t?e:e.trim()).replace(/&amp;/g,"&").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">")},t.formatSourceHtmlWord=function(e,t){return void 0===t&&(t=!1),(e=t?e:e.trim()).replace(/<maligngroup><\/maligngroup>/g,"<maligngroup/>").replace(/<malignmark><\/malignmark>/g,"<malignmark/>").replace(/&nbsp;/g,"&#xA0;")},t.formatSource=function(e){return e.trim().replace(/\u2062/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},t.formatSourceMML=function(e){return e.trim().replace(/&#xA0;/g," ").replace(/\u00A0/g," ").replace(/&nbsp;/g," ")},t.parseMmdElement=function(e,n){if(void 0===n&&(n=[]),!e||!e.children||!e.children.length)return n;for(var a=0;a<e.children.length;a++){var r=e.children[a];["smiles","smiles-inline"].includes(e.className)&&"SVG"===r.tagName.toUpperCase()?n.push({type:"svg",value:r.outerHTML}):-1!==["MATHML","MATHMLWORD","ASCIIMATH","LATEX","MJX-CONTAINER","TABLE","TSV","SMILES","TABLE-MARKDOWN","ERROR"].indexOf(r.tagName)&&("MJX-CONTAINER"===r.tagName||"TABLE"===r.tagName?"TABLE"===r.tagName?n.push({type:"html",value:r.outerHTML}):n.push({type:"svg",value:r.innerHTML}):n.push({type:r.tagName.toLowerCase(),value:"LATEX"===r.tagName||"ASCIIMATH"===r.tagName||"ERROR"===r.tagName||"TSV"===r.tagName||"TABLE-MARKDOWN"===r.tagName||"SMILES"===r.tagName?t.formatSourceHtml(r.innerHTML,"TSV"===r.tagName||"TABLE-MARKDOWN"===r.tagName):"MATHMLWORD"===r.tagName?t.formatSourceHtmlWord(r.innerHTML):r.innerHTML}))}return n},t.parseMarkdownByElement=function(e,n){void 0===n&&(n=!0);var a=[];if(!e)return null;var r=n?e.querySelectorAll(".math-inline, .math-block, .table_tabular, .inline-tabular, .smiles, .smiles-inline"):e.querySelectorAll("div > .math-inline, div > .math-block, .table_tabular, div > .inline-tabular, div > .smiles, div > .smiles-inline");if(!r)return null;for(var o=0;o<r.length;o++)a=t.parseMmdElement(r[o],a);return a}}},t={};(function n(a){var r=t[a];if(void 0!==r)return r.exports;var o=t[a]={exports:{}};return e[a](o,o.exports,n),o.exports})(669)})();