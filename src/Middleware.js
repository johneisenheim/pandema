import mysql from 'mysql';
import async from "async";

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

}

export default Middleware;
