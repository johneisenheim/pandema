import express from 'express';
import Middleware from './Middleware';
import PDFs from '../pdfs/PDFs.js';
import fs from 'fs-extra';
import crypto from 'crypto';
require('magic-globals');
var pdfs = new PDFs();
var bodyParser = require('body-parser');
var formidable = require('formidable');
var util = require('util');

var path = require('path');
var mime = require('mime');

var archiver = require('archiver');


var app2 = express();

var middleware;

app2.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://139.162.162.26:8000');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();



});

app2.use(bodyParser.json());// to support JSON-encoded bodies
app2.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app2.get('/avvisopubblicazione', (req, res)=>{
  console.log(req.query.data);
  var cllb = function(){
    console.log('PDF done!');
    res.download('test_complete.pdf');
  };
  pdfs.fillAvvisoPubblicazione(JSON.parse(req.query.data), cllb);
});

app2.get('/', (req, res)=>{
  //res.download('test_complete.pdf');
});

app2.post('/login', function(req, res){
  var callback = function(obj){
    console.log('callback from middleware '+ JSON.stringify(obj));
    res.end(JSON.stringify(obj));
  }
  middleware.login(req.body.username, req.body.password, callback);
});

app2.post('/addComune', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = true;
  var cap = undefined;

  form.parse(req);

  form.on('fileBegin', function(name, file){
    if(fs.existsSync(__base+'/comuniImages/'+cap+'.png'))
      res.end(JSON.stringify({status : true, message:'Esiste già un comune con questo CAP inserito!'}));
      return;
    file.path = __base+'/comuniImages/'+cap+'.png';
  });

  form.on('file', function(name, file) {});

  form.on('field', function(name, value){
    if(name === 'cap')
      cap = value;
  });

  form.on('end', function(){
    //console.log(toDB);
    middleware.addComune(req.body.citta, req.body.cap, req.body.username, req.body.password, res);
    //res.end('Ok!');
  });

});

app2.post('/provafile', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = true;

  form.parse(req);
  form.on('file', function(name, file) {
    console.log('received a file '+ JSON.stringify(file));
    console.log('received name '+ name);
  });

});

app2.post('/handled1', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = true;
  var city = null;
  var folder = null;
  var npratica = null;
  var toDB = {};

  form.parse(req);

  form.on('fileBegin', function(name, file){
    file.path = folder+'/'+name+'_'+npratica+'.docx';
    console.log('new file path is : '+file.path);
    if(toDB['files'] !== undefined)
      toDB['files'][name] = file.path;
    else{
      toDB['files'] = {};
      toDB['files'][name] = file.path;
    }
  });

  form.on('file', function(name, file) {});

  form.on('field', function(name, value){
    console.log('Received a field with name '+name+' and value '+value);
    if( name === 'city'){
      city = crypto.createHash('md5').update(value+'pandemanellotalassa').digest("hex");
      toDB['citta'] = value;
    }else if(name == 'npratica'){
      folder = __base+'/documents/'+city+'/'+value+'/D1';
      npratica = value;
      toDB['npratica'] = value;
      if(!fs.existsSync(__base+'/documents/'+city+'/'+value))
        fs.mkdirSync(__base+'/documents/'+city+'/'+value);
      if(!fs.existsSync(folder))
        fs.mkdirSync(folder);
    }else{
      if( name == 'avvisopubblicazione'){
        console.log('Handle PDF '+name);
        var cllb = function(){
          console.log('PDF done!');
        };
        pdfs.fillAvvisoPubblicazione(name, folder, npratica, 'D1', JSON.parse(value), cllb);
      }
      //if per i vari pdf
      if( name === 'canone'){
          toDB['canone'] = JSON.parse(value);
      }
      if( name === 'diniego'){
        toDB['diniego'] = value;
      }
      if( name === 'compatibility'){
        toDB['compatibility'] = value;
      }
      if( name === 'nome' ){
        toDB['nome'] = value;
      }
      if(name === 'cognome'){
        toDB['cognome'] = value;
      }
      if( name === 'cf'){
        toDB['cf'] = value;
      }
      if(name === 'npratica'){
        toDB['npratica'] = value;
      }
      if(name === 'uso'){
        toDB['uso'] = value;
      }
      if(name === 'tipodocumento'){
        toDB['tipodocumento'] = parseInt(value);
      }
    }
  });

  form.on('end', function(){
    //console.log(toDB);
    middleware.d1DBOperations(res, toDB);
    //res.end('Ok!');
  })

});

app2.post('/handled2', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = true;
  var city = null;
  var folder = null;
  var npratica = null;
  var toDB = {};

  form.parse(req);

  form.on('fileBegin', function(name, file){
    file.path = folder+'/'+name+'_'+npratica+'.docx';
    console.log('new file path is : '+file.path);
    if(toDB['files'] !== undefined)
      toDB['files'][name] = file.path;
    else{
      toDB['files'] = {};
      toDB['files'][name] = file.path;
    }
  });

  form.on('file', function(name, file) {});

  form.on('field', function(name, value){
    console.log('Received a field with name '+name+' and value '+value);
    if( name === 'city'){
      city = crypto.createHash('md5').update(value+'pandemanellotalassa').digest("hex");
      toDB['citta'] = value;
    }else if(name == 'npratica'){
      folder = __base+'/documents/'+city+'/'+value+'/D2';
      npratica = value;
      toDB['npratica'] = value;
      if(!fs.existsSync(__base+'/documents/'+city+'/'+value))
        fs.mkdirSync(__base+'/documents/'+city+'/'+value);
      if(!fs.existsSync(folder))
        fs.mkdirSync(folder);
    }else{
      if( name == 'avvisopubblicazione'){
        console.log('Handle PDF '+name);
        var cllb = function(){
          console.log('PDF done!');
        };
        pdfs.fillAvvisoPubblicazione(name, folder, npratica, 'D2', JSON.parse(value), cllb);
      }
      //if per i vari pdf
      if( name === 'canone'){
          toDB['canone'] = JSON.parse(value);
      }
      if( name === 'diniego'){
        toDB['diniego'] = value;
      }
      if( name === 'compatibility'){
        toDB['compatibility'] = value;
      }
      if( name === 'nome' ){
        toDB['nome'] = value;
      }
      if(name === 'cognome'){
        toDB['cognome'] = value;
      }
      if( name === 'cf'){
        toDB['cf'] = value;
      }
      if(name === 'npratica'){
        toDB['npratica'] = value;
      }
      if(name === 'uso'){
        toDB['uso'] = value;
      }
      if(name === 'tipodocumento'){
        toDB['tipodocumento'] = parseInt(value);
      }
    }
  });

  form.on('end', function(){
    //console.log(toDB);
    middleware.d2DBOperations(res, toDB);
    //res.end('Ok!');
  })

});

app2.get('/getAllegatiPratica', function(req,res){
  middleware.getAllegatiPratica(req,res);
});

app2.get('/getAllegatiAbusi', function(req,res){
  middleware.getAllegatiAbusi(req,res);
});

app2.get('/viewDocument', function(req,res){
  var callback = function(path){
    res.end(path)
  };
  middleware.viewDocument(req.query.allegatoID, callback);
});

app2.get('/viewDocumentAbuso', function(req,res){
  var callback = function(path){
    res.end(path)
  };
  middleware.viewDocumentAbuso(req.query.allegatoID, callback);
});

app2.get('/see', function(req,res){
  var filepath = req.query.a;

    fs.readFile(filepath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});

app2.get('/deleteDocument', function(req, res){
  middleware.deleteDocument(req.query.path, req.query.allegatoID, res);
});

app2.get('/deleteDocumentAbuso', function(req, res){
  middleware.deleteDocumentAbuso(req.query.path, req.query.allegatoID, res);
});

app2.get('/addExternalAllegato', function(req, res){
  var form = new formidable.IncomingForm();
  var city = null;
  var folder = null;
  var npratica = null;

  form.multiple = true;
  form.on('fileBegin', function(name, file){
    file.path = folder+'/'+name+'_'+npratica+'.docx';
    console.log('new file path is : '+file.path);
    if(toDB['files'] !== undefined)
      toDB['files'][name] = file.path;
    else{
      toDB['files'] = {};
      toDB['files'][name] = file.path;
    }
  });

  form.on('field', function(name, value){
    if( name === 'city'){
      city = crypto.createHash('md5').update(value+'pandemanellotalassa').digest("hex");
    }else if(name == 'npratica'){
      folder = __base+'/documents/'+city+'/'+value+'/D1';
      npratica = value;
      if(!fs.existsSync(__base+'/documents/'+city+'/'+value))
        fs.mkdirSync(__base+'/documents/'+city+'/'+value);
      if(!fs.existsSync(folder))
        fs.mkdirSync(folder);
    }
  });
});

////////NUOVO

app2.get('/getusoscopo', function(req, res){
    middleware.getusoscopo(res);
});

app2.post('/insertnewpratica', function(req, res){
  //console.log(req.body);
  middleware.insertnewpratica(req.body,res);
});

app2.post('/insertnewpraticaarchivio', function(req, res){
  //console.log(req.body);
  middleware.insertnewpraticaarchivio(req.body,res);
});

app2.get('/handled1s1', function(req, res){
    console.log('here');
    middleware.handled1s1(req, res);
});

app2.get('/getgeneralinfos', function(req, res){
  middleware.getgeneralinfos(req,res);
});

app2.get('/getgeneralinfosArchivio', function(req, res){
  middleware.getgeneralinfosArchivio(req,res);
});

app2.get('/d1domandeconcorrenza', function(req, res){
  middleware.d1domandeconcorrenza(req,res);
});

app2.get('/d1avvisoistruttoria', function(req, res){
  middleware.d1avvisoistruttoria(req,res);
});

app2.get('/d1avvisopubblicazione', function(req, res){
  middleware.d1avvisopubblicazione(req,res);
});

app2.get('/d1opposizioni', function(req, res){
  middleware.d1opposizioni(req,res);
});

app2.get('/d1avvisodiniego', function(req, res){
  middleware.d1avvisodiniego(req, res);
});

app2.get('/d1alternativadiniego', function(req, res){
  middleware.d1alternativadiniego(req,res);
});

app2.get('/d1diniegodefinitivo', function(req, res){
  middleware.d1diniegodefinitivo(req,res);
});

app2.get('/handled1s2reqmin', function(req, res){
  middleware.handled1s2reqmin(req, res);
});

app2.get('/handled1s2reqfac', function(req, res){
  middleware.handled1s2reqfac(req, res);
});

app2.get('/handlealtripareri', function(req,res){
  middleware.handlealtripareri(req,res);
});

app2.get('/handled1s3', function(req,res){
  middleware.handled1s3(req, res);
});

app2.get('/handled1s4', function(req,res){
  middleware.handled1s4(req, res);
});

app2.get('/handled1s7', function(req,res){
  middleware.handled1s7(req, res);
});

app2.get('/handled4s4', function(req, res){
  middleware.handled4s4(req, res);
});

app2.get('/handled1s6', function(req,res){
  middleware.handled1s6(req, res);
});

app2.get('/handled4s5', function(req, res){
  middleware.handled4s5(req, res);
});

app2.get('/handled4s7', function(req, res){
  middleware.handled4s7(req, res);
});

app2.get('/handled3Ss2', function(req, res){
  middleware.handled3Ss2(req, res);
});

app2.get('/d3sapprovazione', function(req,res){
  middleware.d3sapprovazione(req,res);
});

app2.get('/d4atticessionefitto', function(req, res){
  middleware.d4atticessionefitto(req, res);
});

app2.get('/d4certificatomorte', function(req,res){
  middleware.d4certificatomorte(req, res);
})

app2.get('/d4documentazione', function(req, res){
  middleware.d4documentazione(req, res);
});

app2.get('/d4variazioneassetto', function(req,res){
  middleware.d4variazioneassetto(req, res);
});

app2.get('/d4venditaaggiudicazione', function(req, res){
  middleware.d4venditaaggiudicazione(req, res);
});

app2.get('/getStatoPratica', function(req,res){
  middleware.getStatoPratica(req, res);
});

app2.get('/updateStatoPratica', function(req, res){
  middleware.updateStatoPratica(req,res);
});

app2.get('/addCanone', function(req, res){
  middleware.addCanone(req, res);
});

app2.get('/modifycanone', function(req, res){
  middleware.modifyCanone(req, res);
});

app2.get('/deletecanone', function(req, res){
  middleware.deleteCanone(req, res);
});

app2.get('/addImposta', function(req, res){
  middleware.addImposta(req, res);
});

app2.get('/modifyimposta', function(req, res){
  middleware.modifyImposta(req, res);
});

app2.get('/deleteimposta', function(req, res){
  middleware.deleteImposta(req, res);
});

app2.get('/downloadFile', function(req, res){

  var callback = function(_path){
    var filename = path.basename(_path);
    var mimetype = mime.lookup(_path);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    res.download(_path);
  };
  middleware.downloadFile(req, res, callback);
});

app2.get('/downloadFileAbuso', function(req, res){

  var callback = function(_path){
    console.log('path is '+_path);
    var filename = path.basename(_path);
    var mimetype = mime.lookup(_path);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    res.download(_path);
  };
  middleware.downloadFileAbuso(req, res, callback);
});

app2.get('/downloadAvvisoPubblicazione', function(req, res){
  var file = __base+'/docs_template/avviso_pubblicazione.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/downloadD1AvvisoIstruttoria', function(req, res){
  var file = __base+'/docs_template/d1_avviso_istruttoria.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/downloadAvvisoDiniego', function(req, res){
  var file = __base+'/docs_template/avviso_diniego.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/downloadAvvisoDiniegoDefinitivo', function(req, res){
  var file = __base+'/docs_template/diniego_definitivo.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/downloadZip', function(req, res){
  var callback = function(data){
    var output = fs.createWriteStream(__base + '/'+req.query.pid+'.zip');
    var archive = archiver('zip', {
      store: true // Sets the compression method to STORE.
    });

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      console.log(err);
    });

    archive.pipe(output);

    archive.directory(__base+'/documents/83e7186204bc7c4ab350c815b7dfe805','./');
    archive.finalize();
    res.end('ok');
  }
  middleware.downloadZip(req, callback);
});

app2.post('/addFile', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = false;

  var praticaPath = null;
  var currentPraticaID = null;
  var allegatoTypeID = null;
  var toMiddleware = {};

  form.parse(req);

  form.on('field', function(name, value){

    switch(name){
      case 'dbid':
        toMiddleware.dbid = value;
      break;
      case 'pid':
        currentPraticaID = value;
        toMiddleware.pid = value;
      break;
      case 'path':
        praticaPath = value;
      break;
      case 'atype':
        allegatoTypeID = parseInt(value);
      break;
    }

  });

  form.on('fileBegin', function(name, file){
    var filesCount = 0;
    switch(allegatoTypeID){
      case 1:
          file.path = praticaPath+'/avvisopubblicazione.docx';
          toMiddleware.filepath = praticaPath+'/avvisopubblicazione.docx';
          toMiddleware.allegatoType = 1;
      break;
      case 2:
        //Domanda Concorrenza
        var domandeConcorrenzaPath = praticaPath+'/domandeconcorrenza';

        if(!fs.existsSync(domandeConcorrenzaPath)){
          fs.mkdirSync(domandeConcorrenzaPath);
        }

        file.path = domandeConcorrenzaPath+'/domandaconcorrenza_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 2;
      break;
      case 3:
        //Opposizioni
        var opposizioniPath = praticaPath+'/opposizioni';

        if(!fs.existsSync(opposizioniPath)){
          fs.mkdirSync(opposizioniPath);
        }

        file.path = opposizioniPath+'/opposizione_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 3;
      break;
      case 4:
        file.path = praticaPath+'/d1_avvio_istruttoria.docx';
        toMiddleware.filepath = praticaPath+'/d1_avvio_istruttoria.docx';
        toMiddleware.allegatoType = 4;
      break;
      case 5:
        //AlternativaDiniego
        var alternativadiniegoPath = praticaPath+'/alternativadiniego';

        if(!fs.existsSync(alternativadiniegoPath)){
          fs.mkdirSync(alternativadiniegoPath);
        }

        file.path = alternativadiniegoPath+'/alternativadiniegoPath_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 5;
      break;
      case 6:
        file.path = praticaPath+'/avviso_diniego.docx';
        toMiddleware.filepath = praticaPath+'/avviso_diniego.docx';
        toMiddleware.allegatoType = 6;
      break;
      case 7:
        file.path = praticaPath+'/avviso_diniego_definitivo.docx';
        toMiddleware.filepath = praticaPath+'/avviso_diniego_definitivo.docx';
        toMiddleware.allegatoType = 7;
      break;
      case 8:
        file.path = praticaPath+'/visuracamerale.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 8;
      break;
      case 9:
        file.path = praticaPath+'/carichipenali.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 9;
      break;
      case 10:
        file.path = praticaPath+'/casellariogiudiziale.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 10;
      break;
      case 11:
        file.path = praticaPath+'/durc.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 11;
      break;
      case 12:
        file.path = praticaPath+'/certificatofallimentare.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 12;
      break;
      case 13:
        file.path = praticaPath+'/certificatoantimafia.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 13;
      break;
      case 14:
        file.path = praticaPath+'/agenziadogana.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 14;
      break;
      case 15:
        file.path = praticaPath+'/agenziademanio.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 15;
      break;
      case 16:
        file.path = praticaPath+'/pareretecnico.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 16;
      break;
      case 17:
        file.path = praticaPath+'/parereurbanistico.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 17;
      break;
      case 18:
        file.path = praticaPath+'/pareresopraintendenzabeniculturali.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 18;
      break;
      case 19:
        file.path = praticaPath+'/pareresic.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 19;
      break;
      case 20:
        file.path = praticaPath+'/parereautoritamarittima.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 20;
      break;
      case 21:
        file.path = praticaPath+'/pareresopraintendenzaarcheologica.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 21;
      break;
      case 22:
        file.path = praticaPath+'/parereautoritabacino.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 22;
      break;
      case 23:
        file.path = praticaPath+'/determina.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 23;
      break;
      case 24:
        file.path = praticaPath+'/delibera.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 24;
      break;
      case 25:
        file.path = praticaPath+'/visto.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 25;
      break;
      case 28:
        var requisitiFacPath = praticaPath+'/reqfac';
        var filesCount = 0;
        if(!fs.existsSync(requisitiFacPath)){
          fs.mkdirSync(requisitiFacPath);
        }

        file.path = requisitiFacPath+'/reqfac_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 28;
      break;
      case 29:
        file.path = praticaPath+'/verificadocumentazionetecnica.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 29;
      break;
      case 30:
        var adempimentiPath = praticaPath+'/adempimenti';
        if(!fs.existsSync(adempimentiPath)){
          fs.mkdirSync(adempimentiPath);
        }
        file.path = adempimentiPath+'/adempimento_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 30;
      break;
      case 31:
        var concessionePath = praticaPath+'/concessioni';
        if(!fs.existsSync(concessionePath)){
          fs.mkdirSync(concessionePath);
        }
        file.path = concessionePath+'/atto_concessione'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 31;
      break;
      case 32:
        var attiConcessioneFittoPath = praticaPath+'/concessione_fitto';
        if(!fs.existsSync(attiConcessioneFittoPath)){
          fs.mkdirSync(attiConcessioneFittoPath);
        }
        file.path = attiConcessioneFittoPath+'/concessione_fitto_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 32;
      break;
      case 33:
        var attiVariazioneAssettoPath = praticaPath+'/variazione_assetto';
        if(!fs.existsSync(attiVariazioneAssettoPath)){
          fs.mkdirSync(attiVariazioneAssettoPath);
        }
        file.path = attiVariazioneAssettoPath+'/variazione_assetto_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 33;
      break;
      case 34:
        var attiVenditaAggiudicazionePath = praticaPath+'/variazione_aggiudicazione';
        if(!fs.existsSync(attiVenditaAggiudicazionePath)){
          fs.mkdirSync(attiVenditaAggiudicazionePath);
        }
        file.path = attiVenditaAggiudicazionePath+'/variazione_aggiudicazione_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 34;
      break;
      case 35:
        var attiCertificazioneMortePath = praticaPath+'/certificazione_morte';
        if(!fs.existsSync(attiCertificazioneMortePath)){
          fs.mkdirSync(attiCertificazioneMortePath);
        }
        file.path = attiCertificazioneMortePath+'/certificazione_morte_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 35;
      break;
      case 36:
        var documentazioneEvincePath = praticaPath+'/documentazione';
        if(!fs.existsSync(documentazioneEvincePath)){
          fs.mkdirSync(documentazioneEvincePath);
        }
        file.path = documentazioneEvincePath+'/documentazione_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 36;
      break;
      case 37:
        file.path = praticaPath+'/richiestaanticipata.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 37;
      break;
      case 38:
        file.path = praticaPath+'/attoapprovazione.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 38;
      break;
      case 39:
        var annotazioneRegolaritaPath = praticaPath+'/annotazione_regolarita';
        if(!fs.existsSync(annotazioneRegolaritaPath)){
          fs.mkdirSync(annotazioneRegolaritaPath);
        }
        file.path = annotazioneRegolaritaPath+'/regolarita_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 39;
      break;
      case 40:
        var attoRevocaPath = praticaPath+'/atto_revoca';
        if(!fs.existsSync(attoRevocaPath)){
          fs.mkdirSync(attoRevocaPath);
        }
        file.path = attoRevocaPath+'/revoca_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 40;
      break;
      case 41:
        var altriPareriPath = praticaPath+'/altri_prareri';
        if(!fs.existsSync(altriPareriPath)){
          fs.mkdirSync(altriPareriPath);
        }
        file.path = altriPareriPath+'/altro_parere_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 41;
      break;
      case 42:
        var attoAutorizzazioniPath = praticaPath+'/atto_autorizzazione';
        if(!fs.existsSync(attoAutorizzazioniPath)){
          fs.mkdirSync(attoAutorizzazioniPath);
        }
        file.path = attoAutorizzazioniPath+'/atto_autorizzazione_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 42;
      break;
      case 43:
        var attoFinaleD5Path = praticaPath+'/atto_finale_d5';
        if(!fs.existsSync(attoFinaleD5Path)){
          fs.mkdirSync(attoFinaleD5Path);
        }
        file.path = attoFinaleD5Path+'/atto_finale_d5_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 43;
      break;
      case 44:
        var attiAutorizzazionePath = praticaPath+'/atti_autorizzazione';
        if(!fs.existsSync(attiAutorizzazionePath)){
          fs.mkdirSync(attiAutorizzazionePath);
        }
        file.path = attiAutorizzazionePath+'/atto_autorizzazione_'+Math.floor(new Date() / 1000)+'.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 44;
      break;
      case 45:
        file.path = praticaPath+'/avvio_decadenza.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 45;
      break;
      case 46:
        file.path = praticaPath+'/atto_decadenza.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 46;
      break;

    }

  });

  form.on('end', function(){
    middleware.addFile(toMiddleware);
    res.end(JSON.stringify({response:true}));
  })

});


app2.post('/addFileAbusi', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = false;

  var praticaPath = null;
  var currentPraticaID = null;
  var allegatoTypeID = null;
  var euroValue = null;
  var toMiddleware = {};

  form.parse(req);

  form.on('field', function(name, value){

    switch(name){
      case 'dbid':
        toMiddleware.dbid = value;
      break;
      case 'pid':
        currentPraticaID = value;
        toMiddleware.pid = value;
      break;
      case 'path':
        praticaPath = value;
      break;
      case 'atype':
        allegatoTypeID = parseInt(value);
      break;
      case 'euroValue':
        toMiddleware.euroValue = parseFloat(value);
      break;
    }

  });

  form.on('fileBegin', function(name, file){
    var filesCount = 0;
    switch(allegatoTypeID){
      case 1:
        file.path = praticaPath+'/avviso_ingiunzione.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 1;
      break;
      case 2:
        file.path = praticaPath+'/ingiunzione.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 2;
      break;
      case 3:
        file.path = praticaPath+'/primo_avviso.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.euroValue = euroValue;
        toMiddleware.allegatoType = 3;
      break;
      case 4:
        file.path = praticaPath+'/secondo_avviso.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 4;
      break;
      case 5:
        file.path = praticaPath+'/trasmissione.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 5;
      break;
      case 6:
        file.path = praticaPath+'/avvio_decadenza.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 6;
      break;
      case 7:
        file.path = praticaPath+'/chiusura_pratica.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 7;
      break;
      case 8:
        file.path = praticaPath+'/atto_definitivo_decadenza.docx';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 8;
      break;
    }
  });

  form.on('end', function(){
    middleware.addFileAbusi(toMiddleware);
    res.end(JSON.stringify({response:true}));
  })

});

app2.get('/changeCompatibility', function(req, res){
  middleware.changeCompatibility(req, res);
});

app2.get('/getBolloAndPagine', function(req, res){
  middleware.getBolloAndPagine(req,res);
});

app2.get('/addBollo', function(req, res){
  middleware.addBollo(req,res);
});

app2.get('/updateBollo', function(req, res){
  middleware.updateBollo(req,res);
});

app2.get('/addNumeroPagine', function(req, res){
  middleware.addNumeroPagine(req,res);
});

app2.get('/updateNumeroPagine', function(req, res){
  middleware.updateNumeroPagine(req,res);
});

app2.get('/getRichiestaAdempimenti', function(req, res){
  middleware.getRichiestaAdempimenti(req,res);
});

app2.get('/getDecadenzaAbusi', function(req,res){
  middleware.getDecadenzaAbusi(req, res);
});

app2.get('/downloadRichiestaAdempimenti', function(req, res){
  var file = __base+'/docs_template/richiesta_adempimenti.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/getAttoConcessione', function(req, res){
  middleware.getAttoConcessione(req, res);
});

app2.get('/getAttoFinaleD5', function(req, res){
  middleware.getAttoFinaleD5(req, res);
});

app2.get('/getAttoAutorizzazione', function(req, res){
  middleware.getAttoAutorizzazione(req, res);
});

app2.get('/getRichiestaAnticipata', function(req, res){
  middleware.getRichiestaAnticipata(req,res);
});

app2.get('/getAllAbusi', function(req, res){
  middleware.getAllAbusi(req,res);
});

app2.get('/downloadAttoConcessione', function(req, res){
  var file = __base+'/docs_template/atto_concessione.docx';
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  res.download(file);
});

app2.get('/getAbusiGenerici', function(req,res){
  middleware.getAbusiGenerici(req,res);
});

app2.get('/getAbusiAree', function(req, res){
  middleware.getAbusiAree(req,res);
});

app2.get('/getAbusiCodNav', function(req,res){
  middleware.getAbusiCodNav(req,res);
});

app2.get('/getAvvisoIngiunzione', function(req,res){
  middleware.getAvvisoIngiunzione(req,res);
});

app2.get('/addNewAbusoGenerico', function(req,res){
  middleware.addNewAbusoGenerico(req,res);
});

app2.get('/getDInfosForAbusi', function(req,res){
  middleware.getDInfosForAbusi(req,res);
});

app2.get('/addNewAbusoAree', function(req,res){
  middleware.addNewAbusoAree(req,res);
});

app2.get('/addNewAbusoCodNav', function(req,res){
  middleware.addNewAbusoCodNav(req,res);
});

app2.get('/getIngiunzione', function(req,res){
  middleware.getIngiunzione(req,res);
});

app2.get('/getPrimoAvviso', function(req,res){
  middleware.getPrimoAvviso(req,res);
});

app2.get('/getSecondoAvviso', function(req,res){
  middleware.getSecondoAvviso(req,res);
});

app2.get('/getAbusoPath', function(req,res){
  middleware.getAbusoPath(req,res);
});

app2.get('/getTrasmissione', function(req,res){
  middleware.getTrasmissione(req,res);
});

app2.get('/getAbusoStati', function(req,res){
  middleware.getAbusoStati(req,res);
});

app2.get('/updateStatoAbuso', function(req,res){
  middleware.updateStatoAbuso(req,res);
});

app2.get('/getChiusuraPratica', function(req,res){
  middleware.getChiusuraPratica(req,res);
});

app2.get('/getDecadenza', function(req,res){
  middleware.getDecadenza(req,res);
});

app2.get('/getRegistriGenerico', function(req,res){
  middleware.getRegistriGenerico(req,res);
});

app2.get('/getRegistroGenerico', function(req,res){
  middleware.getRegistroGenerico(req,res);
});

app2.post('/addNewGeneralRegistry', function(req,res){
  middleware.addNewGeneralRegistry(req,res);
});

app2.get('/annotazioneRegolarita', function(req,res){
  middleware.annotazioneRegolarita(req,res);
});

app2.get('/revoca', function(req,res){
  middleware.revoca(req,res);
});

app2.get('/getRegistriArt24', function(req,res){
  middleware.getRegistriArt24(req,res);
});

app2.post('/addNewArt24Registry', function(req,res){
  middleware.addNewArt24Registry(req,res);
});

app2.get('/getRegistroArt24', function(req,res){
  middleware.getRegistroArt24(req,res);
});

app2.get('/getRegistriArt55', function(req,res){
  middleware.getRegistriArt55(req,res);
})

app2.get('/getRegistroArt55', function(req,res){
  middleware.getRegistroArt55(req, res);
});

app2.post('/addNewArt55Registry', function(req,res){
  middleware.addNewArt55Registry(req,res);
});

app2.get('/getRegistriArt45', function(req,res){
  middleware.getRegistriArt45(req,res);
});

//SEARCH

app2.get('/searchTableA', function(req,res){
  middleware.searchTableA(req,res);
});

app2.get('/searchTableB', function(req,res){
  middleware.searchTableB(req,res);
});

app2.get('/searchTableC', function(req,res){
  middleware.searchTableC(req,res);
});

app2.get('/searchTableD', function(req,res){
  middleware.searchTableD(req,res);
});

app2.get('/searchTableE', function(req,res){
  middleware.searchTableE(req,res);
});

app2.get('/searchTableF', function(req,res){
  middleware.searchTableF(req,res);
});

app2.get('/searchTableG', function(req,res){
  middleware.searchTableG(req,res);
});

app2.get('/searchTableH', function(req,res){
  middleware.searchTableH(req,res);
});

app2.get('/searchTableI', function(req,res){
  middleware.searchTableI(req,res);
});

app2.post('/addNewArt45Registry', function(req,res){
  middleware.addNewArt45Registry(req,res);
});

app2.get('/getRegistroArt45', function(req,res){
  middleware.getRegistroArt45(req,res);
});

app2.get('/getAttiAutorizzazione', function(req, res){
  middleware.getAttiAutorizzazione(req,res);
});

app2.get('/getD1s', function(req, res){
  middleware.getD1s(req,res);
});

app2.get('/getAvvioDecadenza', function(req,res){
  middleware.getAvvioDecadenza(req, res);
});

app2.get('/getAvvioDecadenzaPratica', function(req,res){
  middleware.getAvvioDecadenzaPratica(req,res);
})

app2.get('/getAttoDecadenza', function(req,res){
  middleware.getAttoDecadenza(req,res);
});

app2.listen(8001, ()=> {
  console.info("Second server is listening to 8001");

  middleware = new Middleware();
  if(middleware.connect()){
    if( !fs.existsSync(__base+'/documents'))
        fs.mkdirSync(__base+'/documents');

    if( !fs.existsSync(__base+'/comuniImages'))
      fs.mkdirSync(__base+'/comuniImages');

    console.log(__base);

    middleware.getAllComuni(function(data){
        if( data == null )
          return;
        //console.log(data[0].id);
        //setup cartelle comuni
        for( var i = 0; i < data.length; i++ ){
          var hash = crypto.createHash('md5').update(data[i].citta+'pandemanellotalassa').digest("hex");
          if( !fs.existsSync(__base+'/documents/'+hash)){
            fs.mkdirSync(__base+'/documents/'+hash);
          }
        }
    });

  }
  //global._middleware = middleware;
});
