import mysql from 'mysql';
import async from "async";
import fs from 'fs';
import crypto from 'crypto';
require('magic-globals');

class Middleware{
  constructor(){
    this.connection = mysql.createConnection({
      host     : 'localhost',
      port : 3306,
      user     : 'root',
      password : 'root',
      database : 'pandema',
      socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
    });
  }

  connect(){
    if (this.connection == null){
      console.log('[MYSQL]Connection is null!');
      return false;
    }
    try{
      this.connection.connect();
    }catch(ex){
      console.log('[MIDDLEWARE] Connection exception');
      return;
    }
    console.log('[MIDDLEWARE] Connection ok!');
    return true;
  }

  createFakeUserInstance(){
    this.connection.query("SELECT * FROM allegato", function(err, rows, fields){
      console.log(rows);
    });
  }

  login(username, password, callback){
    this.connection.query("SELECT id,citta FROM comune WHERE username="+this.connection.escape(username)+" AND password="+this.connection.escape(password), function(err, res){
      if(err){
        callback({status : false, error : err, res : null});
        return;
      }
      callback({status : true, error : null, res : res});
    });
  }

  getAllComuni(callback){
    this.connection.query("SELECT * FROM comune", function(err, rows, fields){
        if(err){
          console.log('[getAllComuni] error: '+ err);
          callback(null);
          return;
        }
        callback(rows);
        return;
    });
  }

  /*d1DBOperations(res, fields){
    var comune_id = 1; //Nola è 1
    var pandema_id = 'n39'; //Numero pratica
    var nome = 'Nello';
    var cognome = 'Saulino';
    var codice_uso = '89978';
    var tipo_documento = 1; //D1 è 1
    var stato_pratica_id = null;
    if(fields.diniego)
      stato_pratica_id = 4;
    else stato_pratica_id = 3;
    var cf = 'NLLL';
    var compatibility = fields.compatibility === 'compatibile' ? 1 : 0;

    this.documentsFromTable = {};
    var _self = this;
    _self.fields = fields;
    _self.receivedDocumentsIDs = [];
    _self.insertedPraticaID = null;

    var firstStep = function(){
      var keys = Object.keys(fields.files);

      for(var i = 0; i < keys.length; i++){
        _self.receivedDocumentsIDs.push(keys[i]);
      }

      async.forEachOfSeries(_self.receivedDocumentsIDs, function(value, key, callback){
        _self.connection.query("SELECT id FROM tipo_allegato WHERE descrizione="+_self.connection.escape(_self.receivedDocumentsIDs[key]), function(err, rows){
          if(err){
            console.log('Err in eachof '+ err);
            return callback(err);
          }
          try {
            _self.documentsFromTable[_self.receivedDocumentsIDs[key]] = rows[0].id;
          } catch (e) {
              return callback(e);
          }
          callback();
        });
      }, function (err) {
          if (err) console.error(err.message);
          // documentsFromTable is now a map of JSON data
          secondStep(); //(documentsFromTable)
      });
    };

    var secondStep = function(){
      async.forEachOfSeries(_self.documentsFromTable, function(value, key, callback){

        async.waterfall([
          function(_callback) {
              _self.connection.query("INSERT INTO allegato (path, tipo_allegato_id, data_creazione) VALUES ("+_self.connection.escape(_self.fields.files[key])+","+_self.connection.escape(value)+",NOW())", function(err, rows){
                if(err){
                  console.log('Err in eachof2 '+ err);
                  return callback(err);
                }
                _callback(null, rows.insertId);
              });

          },
          function(lastID, _callback) {
              _self.connection.query("INSERT INTO pratica_ha_allegato (pratica_id, pratica_pandema_id, allegato_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(lastID)+")", function(err, rows){
                if(err){
                  return callback(err);
                }
              });
              _callback(null, 'three');
          }
        ], function (err, result) {
            callback();
        });
      }, function (err) {
          if (err) console.error(err.message);
          // documentsFromTable is now a map of JSON data
          thirdStep(); //(documentsFromTable)
      });
    };

    var thirdStep = function(){
      //Inserimento canone
      if(_self.fields.canone === undefined){
        res.end(JSON.stringify({response:true}));
        return;
      }


      console.log(_self.fields.canone);

      async.forEachOfSeries(_self.fields.canone, function(value, key, callback){
        console.log(value);
        if(parseFloat(value) > 0)
          async.waterfall([
            function(_callback) {
                _self.connection.query("SELECT id FROM tipo_canone WHERE descrizione="+_self.connection.escape(key), function(err, rows){
                  if(err){
                    console.log('Err in eachof2 '+ err);
                    return _callback(err);
                  }
                  console.log(rows);
                  _callback(null, rows[0].id);
                });

            },
            function(id, _callback) {
              console.log("INSERT INTO canone (valore, tipo_canone_id) VALUES("+_self.connection.escape(_self.fields.canone[key])+","+_self.connection.escape(id)+")")
                _self.connection.query("INSERT INTO canone (valore, tipo_canone_id) VALUES("+_self.connection.escape(_self.fields.canone[key])+","+_self.connection.escape(id)+")", function(err, rows){
                  if(err){
                    console.log('Err in eachof3 '+ err);
                    return _callback(err);
                  }
                  _callback(null, rows.insertId);
                });
            },
            function(canone_id, _callback) {
                var floated = parseFloat(canone_id);
                console.log("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(floated)+")")
                _self.connection.query("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(floated)+")", function(err, rows){
                  if(err){
                    console.log('Err in eachof4 '+ err);
                    return _callback(err);
                  }
                });
                _callback(null, 'three');
            }
          ], function (err, result) {
              callback();
          });

          else callback();
      }, function (err) {
          if (err) {
            console.error(err.message);
            res.end(JSON.stringify({response:false, error : err}));
          }
          res.end(JSON.stringify({response:true}));
          // documentsFromTable is now a map of JSON data
          //thirdStep(); //(documentsFromTable)
      });

    };

    //console.log("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso, tipo_documento_id, stato_pratica_id, data, cf, compatibile) VALUES ("+this.connection.escape(comune_id)+","+this.connection.escape(pandema_id)+","+this.connection.escape(nome)+","+this.connection.escape(cognome)+","+this.connection.escape(codice_uso)+","+this.connection.escape(tipo_documento)+","+this.connection.escape(stato_pratica_id)+",NOW(),"+this.connection.escape(cf)+","+this.connection.escape(compatibility)+")");
    this.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso, tipo_documento_id, stato_pratica_id, data, cf, compatibile) VALUES ("+this.connection.escape(comune_id)+","+this.connection.escape(fields.npratica)+","+this.connection.escape(fields.nome)+","+this.connection.escape(fields.cognome)+","+this.connection.escape(fields.uso)+","+this.connection.escape(fields.tipodocumento)+","+this.connection.escape(stato_pratica_id)+",NOW(),"+this.connection.escape(fields.cf)+","+this.connection.escape(compatibility)+")", function(err, rows, fields){
        if(err){
          console.log('[d1DBOperations] error: '+ err);
          res.end('Ko');
          return;
        }
        _self.insertedPraticaID = rows.insertId;
        console.log(_self.insertedPraticaID);
        firstStep();
        return;
    });

  }*/

  /*d2DBOperations(res, fields){
    var comune_id = 1; //Nola è 1
    var pandema_id = 'n39'; //Numero pratica
    var nome = 'Nello';
    var cognome = 'Saulino';
    var codice_uso = '89978';
    var tipo_documento = 2; //D1 è 1
    var stato_pratica_id = null;
    var stato_pratica_id = 3;
    var cf = 'NLLL';
    var compatibility = fields.compatibility === 'compatibile' ? 1 : 0;

    this.documentsFromTable = {};
    var _self = this;
    _self.fields = fields;
    _self.receivedDocumentsIDs = [];
    _self.insertedPraticaID = null;

    var firstStep = function(){
      var keys = Object.keys(fields.files);

      for(var i = 0; i < keys.length; i++){
        _self.receivedDocumentsIDs.push(keys[i]);
      }

      async.forEachOfSeries(_self.receivedDocumentsIDs, function(value, key, callback){
        _self.connection.query("SELECT id FROM tipo_allegato WHERE descrizione="+_self.connection.escape(_self.receivedDocumentsIDs[key]), function(err, rows){
          if(err){
            console.log('Err in eachof '+ err);
            return callback(err);
          }
          try {
            _self.documentsFromTable[_self.receivedDocumentsIDs[key]] = rows[0].id;
          } catch (e) {
              return callback(e);
          }
          callback();
        });
      }, function (err) {
          if (err) console.error(err.message);
          // documentsFromTable is now a map of JSON data
          secondStep(); //(documentsFromTable)
      });
    };

    var secondStep = function(){
      async.forEachOfSeries(_self.documentsFromTable, function(value, key, callback){

        async.waterfall([
          function(_callback) {
              _self.connection.query("INSERT INTO allegato (path, tipo_allegato_id, data_creazione) VALUES ("+_self.connection.escape(_self.fields.files[key])+","+_self.connection.escape(value)+",NOW())", function(err, rows){
                if(err){
                  console.log('Err in eachof2 '+ err);
                  return callback(err);
                }
                _callback(null, rows.insertId);
              });

          },
          function(lastID, _callback) {
              _self.connection.query("INSERT INTO pratica_ha_allegato (pratica_id, pratica_pandema_id, allegato_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(lastID)+")", function(err, rows){
                if(err){
                  return callback(err);
                }
              });
              _callback(null, 'three');
          }
        ], function (err, result) {
            callback();
        });
      }, function (err) {
          if (err) console.error(err.message);
          // documentsFromTable is now a map of JSON data
          thirdStep(); //(documentsFromTable)
      });
    };

    var thirdStep = function(){
      //Inserimento canone
      if(_self.fields.canone === undefined){
        res.end(JSON.stringify({response:true}));
        return;
      }


      console.log(_self.fields.canone);

      async.forEachOfSeries(_self.fields.canone, function(value, key, callback){
        console.log(value);
        if(parseFloat(value) > 0)
          async.waterfall([
            function(_callback) {
                _self.connection.query("SELECT id FROM tipo_canone WHERE descrizione="+_self.connection.escape(key), function(err, rows){
                  if(err){
                    console.log('Err in eachof2 '+ err);
                    return _callback(err);
                  }
                  console.log(rows);
                  _callback(null, rows[0].id);
                });

            },
            function(id, _callback) {
              console.log("INSERT INTO canone (valore, tipo_canone_id) VALUES("+_self.connection.escape(_self.fields.canone[key])+","+_self.connection.escape(id)+")")
                _self.connection.query("INSERT INTO canone (valore, tipo_canone_id) VALUES("+_self.connection.escape(_self.fields.canone[key])+","+_self.connection.escape(id)+")", function(err, rows){
                  if(err){
                    console.log('Err in eachof3 '+ err);
                    return _callback(err);
                  }
                  _callback(null, rows.insertId);
                });
            },
            function(canone_id, _callback) {
                var floated = parseFloat(canone_id);
                console.log("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(floated)+")")
                _self.connection.query("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(_self.insertedPraticaID)+","+_self.connection.escape(_self.fields['npratica'])+","+_self.connection.escape(floated)+")", function(err, rows){
                  if(err){
                    console.log('Err in eachof4 '+ err);
                    return _callback(err);
                  }
                });
                _callback(null, 'three');
            }
          ], function (err, result) {
              callback();
          });

          else callback();
      }, function (err) {
          if (err) {
            console.error(err.message);
            res.end(JSON.stringify({response:false, error : err}));
          }
          res.end(JSON.stringify({response:true}));
          // documentsFromTable is now a map of JSON data
          //thirdStep(); //(documentsFromTable)
      });

    };

    //console.log("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso, tipo_documento_id, stato_pratica_id, data, cf, compatibile) VALUES ("+this.connection.escape(comune_id)+","+this.connection.escape(pandema_id)+","+this.connection.escape(nome)+","+this.connection.escape(cognome)+","+this.connection.escape(codice_uso)+","+this.connection.escape(tipo_documento)+","+this.connection.escape(stato_pratica_id)+",NOW(),"+this.connection.escape(cf)+","+this.connection.escape(compatibility)+")");
    this.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso, tipo_documento_id, stato_pratica_id, data, cf, compatibile) VALUES ("+this.connection.escape(comune_id)+","+this.connection.escape(fields.npratica)+","+this.connection.escape(fields.nome)+","+this.connection.escape(fields.cognome)+","+this.connection.escape(fields.uso)+","+this.connection.escape(fields.tipodocumento)+","+this.connection.escape(stato_pratica_id)+",NOW(),"+this.connection.escape(fields.cf)+","+this.connection.escape(compatibility)+")", function(err, rows, fields){
        if(err){
          console.log('[d1DBOperations] error: '+ err);
          res.end('Ko');
          return;
        }
        _self.insertedPraticaID = rows.insertId;
        console.log(_self.insertedPraticaID);
        firstStep();
        return;
    });

  }*/

  getAllegatiPratica(req, res){
    var _self = this;
    console.log("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pandemaPraticaID));
    this.connection.query("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pandemaPraticaID), function(err,rows){
        if(err)
          console.log(err);
        res.end(JSON.stringify({response:true, results: rows}));
    });
  }

  viewDocument(id, callback){
    this.connection.query("SELECT path FROM allegato WHERE id="+this.connection.escape(id), function(err, rows){
      if(err)
        console.log(err);
      callback(rows[0].path);
    });
  }

  deleteDocument(path, id, res){
    var _self = this;
    this.connection.query("DELETE FROM allegato WHERE id="+this.connection.escape(id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response : false, error : err}));
      }
      res.end(JSON.stringify({response : true}));
      fs.unlinkSync(path);
    });
  }

  addExternalAllegato(){
    async.waterfall([
      function(){
        this.connection.query("INSERT INTO ")
      },
      function(){

      }
    ]);
  }

  //////NUOVO

  getusoscopo(res){
    this.connection.query("SELECT id,descrizione_com FROM codice_uso_scopo", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response : false, err : err}));
      }
      res.end(JSON.stringify(rows));
    });
  }

  insertnewpratica(data,res){
    var stato_pratica_id = 1;
    var _self = this;

    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT citta FROM comune WHERE comune.id="+_self.connection.escape(data.comune_id), function(err, rows){
          var hash = crypto.createHash('md5').update(rows[0].citta+'pandemanellotalassa').digest("hex");
          _callback(null, hash);
        })
      },
      function(hash, _callback){
        _self.connection.query("SELECT descrizione FROM tipo_documento WHERE id="+_self.connection.escape(data.tipodocumento), function(err, rows){
          if(err){
            console.log('[d1DBOperations] error: '+ err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var npraticaFolder = __base+'/documents/'+hash+'/'+data.npratica;
          var completePraticaPath = npraticaFolder+'/'+rows[0].descrizione;
          _callback(null, completePraticaPath, npraticaFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, _callback){
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path) VALUES ("+_self.connection.escape(data.comune_id)+","+_self.connection.escape(data.npratica)+","+_self.connection.escape(data.nome)+","+_self.connection.escape(data.cognome)+","+_self.connection.escape(data.uso)+","+_self.connection.escape(data.tipodocumento)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(data.cf)+","+_self.connection.escape(data.data)+","+_self.connection.escape(completePraticaPath)+")", function(err, rows, fields){
            if(err){
              console.log('[d1DBOperations] error: '+ err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, completePraticaPath, npraticaFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, _callback){

        if(!fs.existsSync(npraticaFolder)){
          fs.mkdirSync(npraticaFolder);
        }

        if(!fs.existsSync(completePraticaPath)){
          fs.mkdirSync(completePraticaPath);
        }
        _callback(null);
      }
    ]);
  }

  //d2s1
  handled1s1(req,res){
    console.log()
    this.connection.query("SELECT compatibile, path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  handled3Ss2(req,res){
    console.log()
    this.connection.query("SELECT stato_pratica_id, path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  getgeneralinfos(res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  d1domandeconcorrenza(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=2", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1opposizioni(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=3", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1alternativadiniego(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=5", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisopubblicazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=1", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisoistruttoria(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=4", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisodiniego(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=6", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1diniegodefinitivo(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=7", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d3sapprovazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=38", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  handled1s2reqmin(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=8 OR tipo_allegato.id=9 OR tipo_allegato.id=10 OR tipo_allegato.id=12 OR tipo_allegato.id=13 OR tipo_allegato.id=29) ", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled1s2reqfac(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND tipo_allegato.id=28", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled1s3(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=14 OR tipo_allegato.id=15 OR tipo_allegato.id=16 OR tipo_allegato.id=17 OR tipo_allegato.id=18 OR tipo_allegato.id=19 OR tipo_allegato.id=20 OR tipo_allegato.id=21 OR tipo_allegato.id=22 ) ", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled1s4(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=23 OR tipo_allegato.id=24 OR tipo_allegato.id=25) ", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled1s6(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT canone.id, canone.valore, canone.tipo_canone_id, tipo_canone.descrizione FROM pratica_has_canone LEFT JOIN canone ON pratica_has_canone.canone_id=canone.id LEFT JOIN tipo_canone ON canone.tipo_canone_id=tipo_canone.id WHERE pratica_has_canone.pratica_id="+_self.connection.escape(req.query.dbid)+" AND pratica_has_canone.pratica_pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(canoni, _callback){
        _self.connection.query("SELECT imposta.id, imposta.valore, imposta.tipo_imposta_id, tipo_imposta.descrizione FROM pratica_ha_imposta LEFT JOIN imposta ON pratica_ha_imposta.imposta_id=imposta.id LEFT JOIN tipo_imposta ON imposta.tipo_imposta_id=tipo_imposta.id WHERE pratica_ha_imposta.pratica_id="+_self.connection.escape(req.query.dbid)+" AND pratica_ha_imposta.pratica_pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({canone:canoni,imposta:rows}))
          _callback(null);
        });
      }
    ]);
  }

  handled1s7(req, res){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  handled4s4(req, res){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  handled4s5(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=23 OR tipo_allegato.id=24) ", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled4s7(req, res){
    var _self = this;
    _self.connection.query("SELECT imposta.id, imposta.valore, imposta.tipo_imposta_id, tipo_imposta.descrizione FROM pratica_ha_imposta LEFT JOIN imposta ON pratica_ha_imposta.imposta_id=imposta.id LEFT JOIN tipo_imposta ON imposta.tipo_imposta_id=tipo_imposta.id WHERE pratica_ha_imposta.pratica_id="+_self.connection.escape(req.query.dbid)+" AND pratica_ha_imposta.pratica_pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({imposta:rows}))
    });
  }

  d4atticessionefitto(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=32", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4documentazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=36", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4variazioneassetto(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=33", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4venditaaggiudicazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=34", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4certificatomorte(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=35", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  addCanone(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT id FROM tipo_canone WHERE descrizione="+_self.connection.escape(req.query.who), function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows[0].id);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO canone (valore, tipo_canone_id) VALUES ("+_self.connection.escape(req.query.value)+','+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          res.end(JSON.stringify({response:true}))
          _callback(null);
        });
      }
    ])
  }

  modifyCanone(req, res){
    this.connection.query("UPDATE canone SET valore="+this.connection.escape(req.query.value)+" WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log('Err in 1 '+ err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  deleteCanone(req, res){
    this.connection.query("DELETE FROM canone WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log('Err in 1 '+ err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  addImposta(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT id FROM tipo_imposta WHERE descrizione="+_self.connection.escape(req.query.who), function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows[0].id);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO imposta (valore, tipo_imposta_id) VALUES ("+_self.connection.escape(req.query.value)+','+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id, pratica_pandema_id, imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            console.log('Err in 1 '+ err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          res.end(JSON.stringify({response:true}))
          _callback(null);
        });
      }
    ])
  }

  modifyImposta(req, res){
    this.connection.query("UPDATE imposta SET valore="+this.connection.escape(req.query.value)+" WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log('Err in 1 '+ err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  deleteImposta(req, res){
    this.connection.query("DELETE FROM imposta WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log('Err in 1 '+ err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  addFile(data){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("INSERT INTO allegato (path, tipo_allegato_id, data_creazione) VALUES("+_self.connection.escape(data.filepath)+","+_self.connection.escape(data.allegatoType)+",NOW())", function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows.insertId);
        });
      },
      function(praticaID, _callback){
        _self.connection.query("INSERT INTO pratica_ha_allegato (pratica_id, pratica_pandema_id, allegato_id) VALUES("+_self.connection.escape(data.dbid)+","+_self.connection.escape(data.pid)+","+_self.connection.escape(praticaID)+")", function(err, rows){
          if(err){
            console.log('Err in 2 '+ err);
            return callback(err);
          }
          _callback(null);
        });
      }
    ])
  }

  changeCompatibility(req, res){
    this.connection.query("UPDATE pratica SET compatibile="+this.connection.escape(req.query.compatibility)+" WHERE id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        console.log('Err in changeCompatibility '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true}));
    });
  }

  getStatoPratica(req, res){
    this.connection.query("SELECT pratica.stato_pratica_id, stato_pratica.descrizione FROM pratica LEFT JOIN stato_pratica ON pratica.stato_pratica_id = stato_pratica.id WHERE pratica.id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        console.log('Err in changeCompatibility '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  updateStatoPratica(req, res){
    this.connection.query("UPDATE pratica SET stato_pratica_id="+this.connection.escape(req.query.value)+" WHERE pratica.id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        console.log('Err in changeCompatibility '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  downloadFile(req, res, callback){
    this.connection.query("SELECT path FROM allegato WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      callback(rows[0].path);
    });
  }

  downloadZip(req, callback){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.body.dbid), function(err, rows){
      callback(rows[0].path);
    });
  }

  getBolloAndPagine(req, res){
    this.connection.query("SELECT imposta.id AS imposta_id, tipo_imposta.descrizione_com, tipo_imposta.id AS tipo_imposta_id, imposta.valore FROM pratica_ha_imposta LEFT JOIN imposta ON pratica_ha_imposta.imposta_id = imposta.id LEFT JOIN tipo_imposta ON tipo_imposta.id = imposta.tipo_imposta_id WHERE pratica_ha_imposta.pratica_id="+this.connection.escape(req.query.dbid)+" AND pratica_ha_imposta.pratica_pandema_id="+this.connection.escape(req.query.pid)+"  AND (imposta.tipo_imposta_id =2 OR imposta.tipo_imposta_id = 3 OR imposta.tipo_imposta_id =1)", function(err, rows){
      if(err){
        console.log('Err in getBolloAndPagine '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  addBollo(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var tipo_imposta_id = 0;
        var value = 0;
        if( req.query.value == Number(2) ){
          tipo_imposta_id = 2;
          value = 2.0;
        }else if(req.query.value == Number(3)){
          tipo_imposta_id = 3;
          value = 16.0;
        }
        _self.connection.query("INSERT INTO imposta (valore,tipo_imposta_id) VALUES("+_self.connection.escape(tipo_imposta_id)+","+_self.connection.escape(value)+")", function(err,rows){
          if(err){
            console.log('Err in addBollo1 '+ err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id,pratica_pandema_id,imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err,rows){
          if(err){
            console.log('Err in addBollo2 '+ err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, results : rows}));
          _callback(null);
        });
      }
    ])
  }

  updateBollo(req, res){
    this.connection.query("UPDATE imposta SET tipo_imposta_id="+this.connection.escape(req.query.value)+" WHERE id="+this.connection.escape(req.query.iid), function(err, rows){
      if(err){
        console.log('Err in updateBollo '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  addNumeroPagine(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var tipo_imposta_id = 1;
        var value = 0;
        _self.connection.query("INSERT INTO imposta (valore,tipo_imposta_id) VALUES("+_self.connection.escape(req.query.value)+","+_self.connection.escape(tipo_imposta_id)+")", function(err,rows){
          if(err){
            console.log('Err in addNumeroPagine1 '+ err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id,pratica_pandema_id,imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err,rows){
          if(err){
            console.log('Err in addNumeroPagine2 '+ err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, results : rows}));
          _callback(null);
        });
      }
    ])
  }

  updateNumeroPagine(req, res){
    this.connection.query("UPDATE imposta SET valore="+this.connection.escape(req.query.value)+" WHERE id="+this.connection.escape(req.query.iid), function(err, rows){
      if(err){
        console.log('Err in updateNumeroPagine '+ err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRichiestaAdempimenti(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=30", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRichiestaAnticipata(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=37", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoConcessione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=31", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAllAbusi(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        //abuso generico
        _self.connection.query("SELECT * FROM abuso WHERE tipo_abuso_id=1", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(abusi_generici, _callback){
        _self.connection.query("SELECT * FROM abuso WHERE tipo_abuso_id=2", function(err,rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, abusi_generici, rows);
        });
      },
      function(abusi_generici, aree_concessione, _callback){
        _self.connection.query("SELECT * FROM abuso WHERE tipo_abuso_id=3", function(err,rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : [generico: abusi_generici, aree_con: aree_concessione, cod_nav: rows]}));
          _callback(null);
        });
      }
    ]);
  }

  getAbusiGenerici(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=1", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusiAree(req, res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=2", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusiCodNav(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=3", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAvvisoIngiunzione(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=1", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewAbusoGenerico(req,res){
    this.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id) VALUES("+this.connection.escape(req.query.pid)+", 5, 1)", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getDInfosForAbusi(req,res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results: rows}));
    });
  }

}

export default Middleware;
