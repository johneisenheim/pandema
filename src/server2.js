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
  console.log('getAllegatiPratica')
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

app2.get('/d1opposizioni', function(req, res){
  middleware.d1opposizioni(req,res);
});

app2.get('/d1alternativadiniego', function(req, res){
  middleware.d1alternativadiniego(req,res);
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

app2.get('/getStatoPratica', function(req,res){
  middleware.getStatoPratica(req, res);
});

app2.get('/updateStatoPratica', function(req, res){
  middleware.updateStatoPratica(req,res);
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
      break;
      case 2:
        //Domanda Concorrenza
        var domandeConcorrenzaPath = praticaPath+'/domandeconcorrenza';

        if(!fs.existsSync(domandeConcorrenzaPath)){
          fs.mkdirSync(domandeConcorrenzaPath);
        }

        var files = fs.readdirSync(domandeConcorrenzaPath);
        for( var i = 0; i < files.length; i++){
          filesCount++;
        }

        file.path = domandeConcorrenzaPath+'/domandaconcorrenza_'+filesCount+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 2;
      break;
      case 3:
        //Opposizioni
        var opposizioniPath = praticaPath+'/opposizioni';

        if(!fs.existsSync(opposizioniPath)){
          fs.mkdirSync(opposizioniPath);
        }

        var files = fs.readdirSync(opposizioniPath);
        for( var i = 0; i < files.length; i++){
          filesCount++;
        }

        file.path = opposizioniPath+'/opposizione_'+filesCount+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 3;
      break;
      case 5:
        //AlternativaDiniego
        var alternativadiniegoPath = praticaPath+'/alternativadiniego';

        if(!fs.existsSync(alternativadiniegoPath)){
          fs.mkdirSync(alternativadiniegoPath);
        }

        var files = fs.readdirSync(alternativadiniegoPath);
        for( var i = 0; i < files.length; i++){
          filesCount++;
        }

        file.path = alternativadiniegoPath+'/alternativadiniegoPath_'+filesCount+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 5;
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
        var files = fs.readdirSync(requisitiFacPath);
        for( var i = 0; i < files.length; i++){
          filesCount++;
        }
        file.path = praticaPath+'/reqfac_'+filesCount+'.pdf';
        toMiddleware.filepath = file.path;
        toMiddleware.allegatoType = 28;
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
