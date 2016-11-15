var PDFFormFiller = require('./PDFFormFiller');
require('magic-globals');
var pdfFormFiller = new PDFFormFiller();

function PDFs(){

  /*var data = {
      "prot1" : "32",
      "prot2" : "3233A",
      "demanio1" : "Jan 1",
      "demanio2" : "Off"
  };*/
}

PDFs.prototype.fillAvvisoPubblicazione = function(document_name, destination, npratica, document_type, data, callback){
  var sourcePDF = null;
  var destinationPDF = null;

  switch(document_name){
    case 'avvisopubblicazione':
      sourcePDF = __base+"/nav_pdfs/"+document_type+"/avvisopubblicazione.pdf";
      destinationPDF = destination+'/avvisopubblicazione_'+npratica+'.pdf';
    break;
    default :
      destinationPDF = destination+'/noname.pdf';
  }
  var shouldFlatten = true;
  pdfFormFiller.fillPDF(sourcePDF, destinationPDF, data, true, callback);
}

module.exports = PDFs;
