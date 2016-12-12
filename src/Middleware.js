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

  d1DBOperations(res, fields){
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

  }

  d2DBOperations(res, fields){
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

  }

  getAllegatiPratica(req, res){
    var _self = this;
    this.connection.query("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pandemaPraticaID), function(err,rows){
        if(err)
          console.log(err);
        res.end(JSON.stringify(rows));
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
          var completePraticaPath = __base+'/documents/'+hash+'/'+rows[0].descrizione;
          _callback(null, completePraticaPath);
        });
      },
      function(completePraticaPath, _callback){
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path) VALUES ("+_self.connection.escape(data.comune_id)+","+_self.connection.escape(data.npratica)+","+_self.connection.escape(data.nome)+","+_self.connection.escape(data.cognome)+","+_self.connection.escape(data.uso)+","+_self.connection.escape(data.tipodocumento)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(data.cf)+","+_self.connection.escape(data.data)+","+_self.connection.escape(completePraticaPath)+")", function(err, rows, fields){
            if(err){
              console.log('[d1DBOperations] error: '+ err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, completePraticaPath);
        });
      },
      function(completePraticaPath, _callback){

        if(!fs.existsSync(completePraticaPath)){
          fs.mkdirSync(completePraticaPath);
        }
        _callback(null);
      }
    ]);
  }

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

  getgeneralinfos(res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id", function(err, rows){
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
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=3", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1alternativadiniego(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=5", function(err, rows){
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
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=8 OR tipo_allegato.id=9 OR tipo_allegato.id=10 OR tipo_allegato.id=12 OR tipo_allegato.id=13) ", function(err, rows){
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
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND tipo_allegato.id=28", function(err, rows){
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

  getPraticaFolderPath(dbid, callback){
    var _self = this;
    this.connection.query("SELECT path FROM pratica WHERE pratica.id="+this.connection.escape(dbid), function(err, rows){
      if(err){
        console.log('Err in 1 '+ err);
        return callback(err);
      }
      callback(rows[0].path);
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

}

export default Middleware;
