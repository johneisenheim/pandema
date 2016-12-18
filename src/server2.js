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
    file.path = folder+'/'+name+'_'+npratica+'.pdf';
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
    file.path = folder+'/'+name+'_'+npratica+'.pdf';
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

app2.get('/viewDocument', function(req,res){
  var callback = function(path){
    res.end(path)
  };
  middleware.viewDocument(req.query.allegatoID, callback);
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

app2.get('/addExternalAllegato', function(req, res){
  var form = new formidable.IncomingForm();
  var city = null;
  var folder = null;
  var npratica = null;

  form.multiple = true;
  form.on('fileBegin', function(name, file){
    file.path = folder+'/'+name+'_'+npratica+'.pdf';
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

app2.get('/handled1s1', function(req, res){
    console.log('here');
    middleware.handled1s1(req, res);
});

app2.get('/getgeneralinfos', function(req, res){
  middleware.getgeneralinfos(res);
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

app2.get('/handled1s3', function(req,res){
  middleware.handled1s3(req, res);
});

app2.get('/handled1s4', function(req,res){
  middleware.handled1s4(req, res);
});

app2.get('/handled1s6', function(req,res){
  middleware.handled1s6(req, res);
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
    console.log('path is '+_path);
    var filename = path.basename(_path);
    var mimetype = mime.lookup(_path);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    res.download(_path);
  };
  middleware.downloadFile(req, res, callback);
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
          toMiddleware.filepath = praticaPath+'/avvisopubblicazione.docx';
          toMiddleware.allegatoType = 1;
      break;
      case 2:
        //Domanda Concorrenza
        var domandeConcorrenzaPath = praticaPath+'/domandeconcorrenza';

        if(!fs.existsSync(domandeConcorrenzaPath)){
          fs.mkdirSync(domandeConcorrenzaPath);
        }

        file.path = domandeConcorrenzaPath+'/domandaconcorrenza_'+new Date()+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 2;
      break;
      case 3:
        //Opposizioni
        var opposizioniPath = praticaPath+'/opposizioni';

        if(!fs.existsSync(opposizioniPath)){
          fs.mkdirSync(opposizioniPath);
        }

        file.path = opposizioniPath+'/opposizione_'+new Date()+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 3;
      break;
      case 4:
        toMiddleware.filepath = praticaPath+'/d1_avviso_istruttoria.docx';
        toMiddleware.allegatoType = 4;
      break;
      case 5:
        //AlternativaDiniego
        var alternativadiniegoPath = praticaPath+'/alternativadiniego';

        if(!fs.existsSync(alternativadiniegoPath)){
          fs.mkdirSync(alternativadiniegoPath);
        }

        file.path = alternativadiniegoPath+'/alternativadiniegoPath_'+new Date()+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 5;
      break;
      case 6:
        toMiddleware.filepath = praticaPath+'/avviso_diniego.docx';
        toMiddleware.allegatoType = 6;
      break;
      case 7:
        toMiddleware.filepath = praticaPath+'/avviso_diniego_definitivo.docx';
        toMiddleware.allegatoType = 7;
      break;
      case 8:
        file.path = praticaPath+'/visuracamerale.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 8;
      break;
      case 9:
        file.path = praticaPath+'/carichipenali.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 9;
      break;
      case 10:
        file.path = praticaPath+'/casellariogiudiziale.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 10;
      break;
      case 11:
        file.path = praticaPath+'/durc.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 11;
      break;
      case 12:
        file.path = praticaPath+'/certificatofallimentare.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 12;
      break;
      case 13:
        file.path = praticaPath+'/certificatoantimafia.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 13;
      break;
      case 14:
        file.path = praticaPath+'/agenziadogana.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 14;
      break;
      case 15:
        file.path = praticaPath+'/agenziademanio.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 15;
      break;
      case 16:
        file.path = praticaPath+'/pareretecnico.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 16;
      break;
      case 17:
        file.path = praticaPath+'/parereurbanistico.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 17;
      break;
      case 18:
        file.path = praticaPath+'/pareresopraintendenzabeniculturali.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 18;
      break;
      case 19:
        file.path = praticaPath+'/pareresic.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 19;
      break;
      case 20:
        file.path = praticaPath+'/parereautoritamarittima.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 20;
      break;
      case 21:
        file.path = praticaPath+'/pareresopraintendenzaarcheologica.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 21;
      break;
      case 22:
        file.path = praticaPath+'/parereautoritabacino.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 22;
      break;
      case 23:
        file.path = praticaPath+'/determina.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 23;
      break;
      case 24:
        file.path = praticaPath+'/delibera.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 24;
      break;
      case 25:
        file.path = praticaPath+'/visto.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 25;
      break;
      case 28:
        var requisitiFacPath = praticaPath+'/reqfac';
        var filesCount = 0;
        if(!fs.existsSync(requisitiFacPath)){
          fs.mkdirSync(requisitiFacPath);
        }

        file.path = requisitiFacPath+'/reqfac_'+new Date()+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 28;
      break;
      case 29:
        file.path = praticaPath+'/verificadocumentazionetecnica.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 29;
      break;
    }

  });

  form.on('end', function(){
    middleware.addFile(toMiddleware);
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

app2.listen(8001, ()=> {
  console.info("Second server is listening to 8001");

  middleware = new Middleware();
  if(middleware.connect()){
    console.log('Base: '+__base);
    if( !fs.existsSync(__base+'/documents'))
        fs.mkdirSync(__base+'/documents');

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
