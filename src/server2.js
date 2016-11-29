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
      folder = __base+'/documents/'+city+'/'+value+'/d1';
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
    }
  });

  form.on('end', function(){
    //console.log(toDB);
    middleware.d1DBOperations(res, toDB);
    //res.end('Ok!');
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
