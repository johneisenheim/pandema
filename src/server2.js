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
  console.log(req.query.allegatoID);
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

app2.post('/addDomandeConcorrenza', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiple = true;
  var currentCityName = null;
  var currentPratica = null;
  var callback = function(city){
    currentCityName = city;
  };

  var toMiddleware={};

  form.on('field', function(name, value){
    if(name=='dbid'){
      middleware.getComuneFromID(value, callback);
      toMiddleware.dbid = value;
    }
    if(name=='pid'){
      currentPratica = value;
      toMiddleware.pid = value;
    }
  });

  form.on('fileBegin', function(name, file){
    var hash = crypto.createHash('md5').update(currentCityName+'pandemanellotalassa').digest("hex");
    var praticaFolder = __base+'/documents/'+hash+'/'+currentPratica;
    var documentFolder = praticaFolder+'/D1';
    var concorrenzaFolder = documentFolder+'/domandeconcorrenza';
    var filesCount = 0;
    if(!fs.existsSync(praticaFolder)){
      fs.mkdirSync(praticaFolder);
    }
    if(!fs.existsSync(documentFolder)){
      fs.mkdirSync(documentFolder);
    }
    if(!fs.existsSync(concorrenzaFolder)){
      fs.mkdirSync(concorrenzaFolder);
    }
    fs.readdirSync(concorrenzaFolder, function(err, files){
      files.forEach(file => {
        filesCount++;
      });
    });
    file.path = concorrenzaFolder+'file_'+filesCount+'.pdf';
    toMiddleware.path = file.path;
    console.log('new file path is : '+file.path);
  });

  form.on('end', function(){
    //res.end(JSON.stringify({response:true}));
  })

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
