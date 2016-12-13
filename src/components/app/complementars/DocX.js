var fs = require('fs');
var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');
require('magic-globals');

function DocX(){}

DocX.prototype.fillDocument(data){
  var content = fs.readFileSync(__base+"/input.docx","binary");
};
