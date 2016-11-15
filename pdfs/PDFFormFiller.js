var fs = require('fs');
var fdf = require('fdf');
var child_process = require('child_process'),
    exec = require('child_process').exec;

function PDFFormFiller(callback){

    this.fillPDF = function(sourceFile, destinationFile, fieldValues, shouldFlatten,  callback ){
        var tempFDF = "data" + (new Date().getTime()) + ".fdf";
        var data = fdf.generate(fieldValues);
        fs.writeFileSync(tempFDF, data);

        child_process.exec( "pdftk " + sourceFile + " fill_form " + tempFDF + " output " + destinationFile , function (error, stdout, stderr) {
            if ( error ) {
                console.log('exec error: ' + error);
                return callback(error);
            }
            fs.unlink( tempFDF, function( err ) {
                if ( err ) {
                    console.log(err);
                    return callback(err);
                }
                return callback();
            });
        } );
    };

}

module.exports = PDFFormFiller;
