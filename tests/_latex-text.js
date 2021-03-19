let chai = require('chai');
let should = chai.should();

let MM = require('../lib/mathpix-markdown-model/index').MathpixMarkdownModel;

const options = {
  cwidth: 800,
  lineNumbering: false,
  htmlTags: true,
};

const Window = require('window');
const window = new Window();
global.window = window;
global.document = window.document;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

describe('Check Latex Text Styles:', () => {
  const tests = require('./_data/_latex-text/_data');
  tests.forEach(function(test) {
    const html = MM.markdownToHTML(test.latex, options).trim();
    describe('Latex => ' + test.latex, () => {
      it('Checking result html', (done) => {
        html.should.equal(test.html);
        done();
      });
    });
  });
});
