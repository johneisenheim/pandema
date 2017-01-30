var pdfFiller = require('pdffiller');
var sourcePDF = "./test.pdf";
var destinationPDF =  "./test_complete.pdf";

var data = {
    "prot1" : "32",
    "prot2" : "3233A",
    "demanio1" : "Jan 1",
    "demanio2" : "Off"
};

export default function fill(){
  pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) {
    if (err) ;
    console.log("In callback (we're done).");
  });
};
