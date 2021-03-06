import mysql from 'mysql';
import async from "async";
import fs from 'fs';
import crypto from 'crypto';
require('magic-globals');

var log = undefined;

class Middleware{
  constructor(_log){
    this.connection = mysql.createConnection({
      host     : 'localhost',
      port : 3306,
      user     : 'root',
      password : 'root',
      database : 'pandema',
      //socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
    });
    log = _log;
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

  login(username, password, callback, res){

    var _self = this;

    async.waterfall([

      function(_callback){
        //console.log("SELECT comune_id FROM utente WHERE username="+_self.connection.escape(username)+" AND password="+_self.connection.escape(password))
        _self.connection.query("SELECT comune_id FROM utente WHERE username="+_self.connection.escape(username)+" AND password="+_self.connection.escape(password), function(err, rows){
          if(err){
            log.error('[login]Error: %s',err);
            res.end(JSON.stringify({status : false, error : err, res : null}));
            return;
          }
          if( rows.length == 0 ){
            res.end(JSON.stringify({status:true, error:'Username e/o password non trovati!', res: []}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(id, _callback){
        console.log("SELECT id, citta FROM comune WHERE id="+id[0].comune_id);
        _self.connection.query("SELECT id, citta FROM comune WHERE id="+id[0].comune_id, function(err, rows){
          if(err){
            log.error('[login]Error: %s',err);
            res.end(JSON.stringify({status : false, error : err, res : null}));
            return;
          }
          res.end(JSON.stringify({status : true, error : null, res : rows}));
          _callback(null);
        });
      }
    ]);

  }

  addComune(citta, cap, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT cap FROM comune WHERE cap="+_self.connection.escape(cap), function(err, rows){
          if(err){
            log.error('[addComune]Error: %s',err);
            res.end(JSON.stringify({status : false}))
            return;
          }
          if(rows.length > 0){
            res.end(JSON.stringify({status : true, message:'Esiste già un comune con questo CAP inserito!'}));
            return;
          }
          _callback(null,'a');
        });
      },
      function(fake,_callback){
        var hash = crypto.createHash('md5').update(citta+'pandemanellotalassa').digest("hex");
        var folder = __base+'/documents/'+hash;
        if(fs.existsSync(folder)){
          res.end(JSON.stringify({status : true, message:'Esiste già un comune con questo nome inserito!'}));
          return;
        }else{
          fs.mkdirSync(folder);
          _callback(null,hash);
        }
      },
      function(hash,_callback){
        var path = 'comuniImages/'+cap+'.png';
        _self.connection.query("INSERT INTO comune (citta, cap ,path) VALUES ("+_self.connection.escape(citta)+","+_self.connection.escape(cap)+","+_self.connection.escape(path)+")", function(err, rows){
          if(err){
            log.error('[addComune]Error: %s',err);
            res.end(JSON.stringify({status : false, message:err}))
            return;
          }
          res.end(JSON.stringify({status : true, message:''}));
          _callback(null);
        });
      }
    ]);
  }

  addUser(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT username FROM utente WHERE username="+_self.connection.escape(req.query.username), function(err, rows){
          if(err){
            log.error('[addUser]Error: %s',err);
            res.end(JSON.stringify({status : false}));
            return;
          }
          if(rows.length > 0){
            //utente già esistente
            res.end(JSON.stringify({status : true, message:'Esiste già un utente con questo username'}));
            return;
          }
          _callback(null, 'a');
        });
      },
      function(fake, _callback){
        _self.connection.query("INSERT INTO utente (nome, cognome, username, password, comune_id) VALUES("+_self.connection.escape(req.query.nome)+","+_self.connection.escape(req.query.cognome)+","+_self.connection.escape(req.query.username)+","+_self.connection.escape(req.query.password)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
          if(err){
            log.error('[addUser2]Error: %s',err);
            res.end(JSON.stringify({status : false}));
            return;
          }
          res.end(JSON.stringify({status : true, message:'Utente inserito'}));
          _callback(null);
        });
      }
    ])
  }

  getAllComuniIDs(req,res){
    this.connection.query("SELECT id FROM comune", function(err, rows){
      if(err){
        log.error('[getAllComuniIDs]Error: %s',err);
        res.end(JSON.stringify({status : false}));
        return;
      }
      res.end(JSON.stringify({status : true, res: rows}));
      _callback(null);
    });
  }

  getAllComuni(callback){
    this.connection.query("SELECT * FROM comune", function(err, rows, fields){
        if(err){
          log.error('[getAllComuni]Error: %s',err);
          console.log('[getAllComuni] error: '+ err);
          callback(null);
          return;
        }
        callback(rows);
        return;
    });
  }

  getAllegatiPratica(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id LEFT JOIN pratica ON pratica_ha_allegato.pratica_id = pratica.id AND pratica_ha_allegato.pratica_pandema_id = pratica.pandema_id  WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandemaPraticaID), function(err,rows){
            if(err){
              log.error('[getAllegatiPratica]Error: %s',err);
              res.end(JSON.stringify({status : false, message:err}));
            }
            _callback(null, rows);
            //res.end(JSON.stringify({response:true, results: rows}));
        });
      },
      function(allegati, _callback){
        _self.connection.query("SELECT id, pandema_abuso_id FROM abuso WHERE pratica_id="+_self.connection.escape(req.query.praticaID)+" AND pratica_pandema_id="+_self.connection.escape(req.query.pandemaPraticaID), function(err, rows){
          if(err){
            log.error('[getAllegatiPratica callback 2]Error: %s',err);
            res.end(JSON.stringify({status : false, message:err}));
          }
          res.end(JSON.stringify({response:true, results: allegati, abusi:rows}));
          _callback(null)
        })
      }
    ])
  }

  /*getAllegatiPratica(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT id,pandema_abuso_id FROM abuso WHERE pratica_id="+_self.connection.escape(req.query.praticaID)+" AND pratica_pandema_id="+_self.connection.escape(req.query.pandemaPraticaID), function(err, rows){
          if(err){
            res.end(JSON.stringify({status : false, message:err}));
          }
          if(rows.length > 0){
            _callback(null, rows);
          }else _callback(null, undefined);
        });
      },
      function(abusi,_callback){
        var query;
        if(abusi !== undefined){
          query = "SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com, abuso.tipo_abuso_id FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id LEFT JOIN abuso ON abuso_ha_allegato_abuso.abuso_id = abuso.id AND abuso_ha_allegato_abuso.pandema_abuso_id = abuso.pandema_abuso_id WHERE ";
          for(var i = 0; i < abusi.length; i++){
            if( i > 0 && i <= abusi.length-1){
              query += " OR ";
            }
            query += "(abuso_ha_allegato_abuso.abuso_id ="+_self.connection.escape(abusi[i].id)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+_self.connection.escape(abusi[i].pandema_abuso_id)+")";
          }
          _callback(null, query);
        }else _callback(null, undefined);
      },
      function(query,_callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandemaPraticaID), function(err,rows){
            if(err){
              res.end(JSON.stringify({status : false, message:err}));
            }
            _callback(null, rows, query);
            //res.end(JSON.stringify({response:true, results: rows}));
        });
      },
      function(allegati, query,_callback){
        if(query !== undefined){
          _self.connection.query(query, function(err,rows){
            if(err){
              res.end(JSON.stringify({status : false, message:err}));
            }
            res.end(JSON.stringify({response:true, results: allegati, abusi : rows}));

          });
        }else{
          res.end(JSON.stringify({response:true, results: allegati, abusi : null}));
        }
        _callback(null);
      }
    ]);
  }*/

  getAllegatiAbusi(req, res){
    var _self = this;
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.praticaID)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pandemaPraticaID), function(err,rows){
        if(err)
          ;
        res.end(JSON.stringify({response:true, results: rows}));
    });
  }

  viewDocument(id, callback){
    this.connection.query("SELECT path FROM allegato WHERE id="+this.connection.escape(id), function(err, rows){
      if(err)
        ;
      callback(rows[0].path);
    });
  }

  viewDocumentAbuso(id, callback){
    this.connection.query("SELECT path FROM allegato_abuso WHERE id="+this.connection.escape(id), function(err, rows){
      if(err)
        ;
      callback(rows[0].path);
    });
  }

  deleteDocument(path, id, res){
    var _self = this;
    this.connection.query("DELETE FROM allegato WHERE id="+this.connection.escape(id), function(err, rows){
      if(err){
        log.error('[deleteDocument]Error: %s',err);
        res.end(JSON.stringify({response : false, error : err}));
      }
      res.end(JSON.stringify({response : true}));
      fs.unlinkSync(path);
    });
  }

  deleteDocumentAbuso(path, id, res){
    var _self = this;
    this.connection.query("DELETE FROM allegato_abuso WHERE id="+this.connection.escape(id), function(err, rows){
      if(err){
        log.error('[deleteDocumentAbuso]Error: %s',err);
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
        log.error('[getusoscopo]Error: %s',err);
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
            log.error('[insertnewpratica callback 2]Error: %s',err);
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
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path, email) VALUES ("+_self.connection.escape(data.comune_id)+","+_self.connection.escape(data.npratica)+","+_self.connection.escape(data.nome)+","+_self.connection.escape(data.cognome)+","+_self.connection.escape(data.uso)+","+_self.connection.escape(data.tipodocumento)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(data.cf)+","+_self.connection.escape(data.data)+","+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(data.email)+")", function(err, rows, fields){
            if(err){
              log.error('[insertnewpratica callback 3]Error: %s',err);
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

  insertnewpraticadropdown(req,res){
    var _self = this;
    var stato_pratica_id = 1;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT citta FROM comune WHERE comune.id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          var hash = crypto.createHash('md5').update(rows[0].citta+'pandemanellotalassa').digest("hex");
          _callback(null, hash);
        })
      },
      function(hash, _callback){
        var npraticaFolder = __base+'/documents/'+hash+'/'+req.query.npratica;
        var completePraticaPath = npraticaFolder+'/'+req.query.tipodocumento;
        _self.connection.query("SELECT * FROM pratica WHERE pratica.pandema_id="+_self.connection.escape(req.query.npratica)+" AND pratica.id="+escape(req.query.pid), function(err,rows){
          if(err){
            log.error('[insertnewpraticadropdown callback 2]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, rows, completePraticaPath, npraticaFolder);
        });
      },
      function(d1results, completePraticaPath, npraticaFolder, _callback){
        var tipo_documento_id = undefined;
        switch(req.query.tipodocumento){
          case 'D2':
            tipo_documento_id = 2;
          break;
          case 'D3':
            tipo_documento_id = 3;
          break;
          case 'D4':
            tipo_documento_id = 4;
          break;
          case 'D3S':
            tipo_documento_id = 6;
          break;
          case 'D6':
            tipo_documento_id = 7;
          break;
        }
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path, email, pratica_ref_id) VALUES ("+_self.connection.escape(d1results[0].comune_id)+","+_self.connection.escape(req.query.npratica)+","+_self.connection.escape(d1results[0].nome)+","+_self.connection.escape(d1results[0].cognome)+","+_self.connection.escape(d1results[0].codice_uso_scopo_id)+","+_self.connection.escape(tipo_documento_id)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(d1results[0].cf)+","+_self.connection.escape(d1results[0].data)+","+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(d1results[0].email)+","+_self.connection.escape(d1results[0].id)+")", function(err,rows){
          if(err){
            log.error('[insertnewpraticadropdown callback 3]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null,completePraticaPath,npraticaFolder, rows.insertId);
        });
      },
      function(completePraticaPath, npraticaFolder, lastID, _callback){
        _self.connection.query("UPDATE pratica SET pandema_id="+_self.connection.escape(req.query.npratica+"_"+lastID+req.query.tipodocumento)+" WHERE id="+_self.connection.escape(lastID), function(err, rows){
          if(err){
            log.error('[insertnewpraticadropdown callback 4]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null,completePraticaPath, npraticaFolder, lastID);
        });
      },
      function(completePraticaPath, npraticaFolder, lastID, _callback){
        if(!fs.existsSync(npraticaFolder)){
          fs.mkdirSync(npraticaFolder);
        }

        if(!fs.existsSync(completePraticaPath)){
          fs.mkdirSync(completePraticaPath);
        }
        res.end(JSON.stringify({response : true, lastID : lastID , lastIDcom: lastID+req.query.tipodocumento}));
        _callback(null);
      }
    ]);
  }

  insertnewpraticaarchivio(data,res){
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
            log.error('[insertnewpraticaarchivio callback 1]Error: %s',err);
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
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path, isArchivio) VALUES ("+_self.connection.escape(data.comune_id)+","+_self.connection.escape(data.npratica)+","+_self.connection.escape(data.nome)+","+_self.connection.escape(data.cognome)+","+_self.connection.escape(data.uso)+","+_self.connection.escape(data.tipodocumento)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(data.cf)+","+_self.connection.escape(data.data)+","+_self.connection.escape(completePraticaPath)+", 1)", function(err, rows, fields){
            if(err){
              log.error('[insertnewpraticaarchivio callback 3]Error: %s',err);
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
        log.error('[handled1s1]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  handled3Ss2(req,res){
    this.connection.query("SELECT stato_pratica_id, path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        log.error('[handled3Ss2]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  getgeneralinfos(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        //console.log("SELECT COUNT(pratica.id) AS ccount FROM pratica WHERE comune_id="+_self.connection.escape(req.query.cid)+" AND pratica.isArchivio = 0")
        _self.connection.query("SELECT COUNT(pratica.id) AS ccount FROM pratica WHERE comune_id="+_self.connection.escape(req.query.cid)+" AND pratica.isArchivio = 0", function(err, rows){
          if(err){
            log.error('[getgeneralinfos callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(count, _callback){
        var offset = 10 * parseInt(req.query.offset);
        _self.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, pratica.email, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 0 AND comune_id="+_self.connection.escape(req.query.cid)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getgeneralinfos callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, results : rows, count : count}));
          _callback(null);
        });
      }
    ]);
    //VG59TQ
  }

  getgeneralinfosArchivio(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT COUNT(pratica.id) AS ccount FROM pratica WHERE comune_id="+_self.connection.escape(req.query.cid)+" AND pratica.isArchivio = 1", function(err, rows){
          if(err){
            log.error('[getgeneralinfosArchivio callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(count, _callback){
        var offset = 10 * parseInt(req.query.offset);
        _self.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, pratica.email, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 1 AND comune_id="+_self.connection.escape(req.query.cid)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getgeneralinfosArchivio callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, results : rows, count : count}));
          _callback(null);
        });
      }
    ])
  }

  d1domandeconcorrenza(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=2", function(err, rows){
      if(err){
        log.error('[d1domandeconcorrenza]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1opposizioni(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=3", function(err, rows){
      if(err){
        log.error('[d1opposizioni]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1alternativadiniego(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=5", function(err, rows){
      if(err){
        log.error('[d1alternativadiniego]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisopubblicazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=1", function(err, rows){
      if(err){
        log.error('[d1avvisopubblicazione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisoistruttoria(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=4", function(err, rows){
      if(err){
        log.error('[d1avvisoistruttoria]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1avvisodiniego(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=6", function(err, rows){
      if(err){
        log.error('[d1avvisodiniego]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d1diniegodefinitivo(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=7", function(err, rows){
      if(err){
        log.error('[d1diniegodefinitivo]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d3sapprovazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=38", function(err, rows){
      if(err){
        log.error('[d3sapprovazione]Error: %s',err);
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
            log.error('[handled1s2reqmin callback 1]Error: %s',err);
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=8 OR tipo_allegato.id=9 OR tipo_allegato.id=10 OR tipo_allegato.id=12 OR tipo_allegato.id=13 OR tipo_allegato.id=29) ", function(err, rows){
          if(err){
            log.error('[handled1s2reqmin callback 2]Error: %s',err);
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
            log.error('[handled1s2reqfac callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND tipo_allegato.id=28", function(err, rows){
          if(err){
            log.error('[handled1s2reqfac callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true, path:path, results : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handlealtripareri(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM pratica WHERE id="+_self.connection.escape(req.query.id)+" AND pandema_id="+_self.connection.escape(req.query.pandema_id), function(err,rows){
          if(err){
            log.error('[handlealtripareri callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND tipo_allegato.id=41", function(err, rows){
          if(err){
            log.error('[handlealtripareri callback 2]Error: %s',err);
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
            log.error('[handled1s3 callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=14 OR tipo_allegato.id=15 OR tipo_allegato.id=16 OR tipo_allegato.id=17 OR tipo_allegato.id=18 OR tipo_allegato.id=19 OR tipo_allegato.id=20 OR tipo_allegato.id=21 OR tipo_allegato.id=22 ) ", function(err, rows){
          if(err){
            log.error('[handled1s3 callback 2]Error: %s',err);
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
            log.error('[handled1s4 callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=23 OR tipo_allegato.id=24 OR tipo_allegato.id=25) ", function(err, rows){
          if(err){
            log.error('[handled1s4 callback 2]Error: %s',err);
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
            log.error('[handled1s6 callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(canoni, _callback){
        _self.connection.query("SELECT imposta.id, imposta.valore, imposta.tipo_imposta_id, tipo_imposta.descrizione FROM pratica_ha_imposta LEFT JOIN imposta ON pratica_ha_imposta.imposta_id=imposta.id LEFT JOIN tipo_imposta ON imposta.tipo_imposta_id=tipo_imposta.id WHERE pratica_ha_imposta.pratica_id="+_self.connection.escape(req.query.dbid)+" AND pratica_ha_imposta.pratica_pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            log.error('[handled1s6 callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, canoni, rows);
        });
      },
      function(canoni, imposte, _callback){
        _self.connection.query("SELECT codice_uso_scopo.descrizione FROM codice_uso_scopo LEFT JOIN pratica ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.id="+_self.connection.escape(req.query.dbid)+" AND pratica.pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            log.error('[handled1s6 callback 3]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({canone:canoni,imposta:imposte, codice : rows}));
          _callback(null);
        });
      }
    ]);
  }

  handled1s7(req, res){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        log.error('[handled1s7]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  handled4s4(req, res){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id), function(err, rows){
      if(err){
        log.error('[handled4s4]Error: %s',err);
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
            log.error('[handled4s5 callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows[0].path);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_caricamento, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND (tipo_allegato.id=23 OR tipo_allegato.id=24) ", function(err, rows){
          if(err){
            log.error('[handled4s5 callback 2]Error: %s',err);
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
        log.error('[handled4s7]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({imposta:rows}))
    });
  }

  d4atticessionefitto(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=32", function(err, rows){
      if(err){
        log.error('[d4atticessionefitto]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4documentazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=36", function(err, rows){
      if(err){
        log.error('[d4documentazione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4variazioneassetto(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=33", function(err, rows){
      if(err){
        log.error('[d4variazioneassetto]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4venditaaggiudicazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=34", function(err, rows){
      if(err){
        log.error('[d4venditaaggiudicazione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  d4certificatomorte(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=35", function(err, rows){
      if(err){
        log.error('[d4certificatomorte]Error: %s',err);
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
            log.error('[addCanone callback 1]Error: %s',err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows[0].id);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO canone (valore, tipo_canone_id) VALUES ("+_self.connection.escape(req.query.value)+','+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            log.error('[addCanone callback 2]Error: %s',err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_has_canone (pratica_id, pratica_pandema_id, canone_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            log.error('[addCanone callback 3]Error: %s',err);
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
        log.error('[modifyCanone]Error: %s',err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  deleteCanone(req, res){
    this.connection.query("DELETE FROM canone WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[deleteCanone]Error: %s',err);
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
            log.error('[addImposta callback 1]Error: %s',err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows[0].id);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO imposta (valore, tipo_imposta_id) VALUES ("+_self.connection.escape(req.query.value)+','+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            log.error('[addImposta callback 2]Error: %s',err);
            res.end(JSON.stringify({response:false, err: err}));
            _callback(null);
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id, pratica_pandema_id, imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err, rows){
          if(err){
            log.error('[addImposta callback 3]Error: %s',err);
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
        log.error('[modifyImposta]Error: %s',err);
        res.end(JSON.stringify({response:false, err: err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  deleteImposta(req, res){
    this.connection.query("DELETE FROM imposta WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[deleteImposta]Error: %s',err);
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
            log.error('[addFile callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows.insertId);
        });
      },
      function(praticaID, _callback){
        _self.connection.query("INSERT INTO pratica_ha_allegato (pratica_id, pratica_pandema_id, allegato_id) VALUES("+_self.connection.escape(data.dbid)+","+_self.connection.escape(data.pid)+","+_self.connection.escape(praticaID)+")", function(err, rows){
          if(err){
            log.error('[addFile callback 2]Error: %s',err);
            return callback(err);
          }
          _callback(null);
        });
      }
    ])
  }

  addFileAbusi(data){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("INSERT INTO allegato_abuso (path, tipo_allegato_abuso_id, data_creazione) VALUES("+_self.connection.escape(data.filepath)+","+_self.connection.escape(data.allegatoType)+",NOW())", function(err,rows){
          if(err){
            log.error('[addFileAbusi callback 1]Error: %s',err);
            return callback(err);
          }
          _callback(null, rows.insertId);
        });
      },
      function(praticaID, _callback){
        _self.connection.query("INSERT INTO abuso_ha_allegato_abuso (abuso_id, pandema_abuso_id, allegato_abuso_id) VALUES("+_self.connection.escape(data.dbid)+","+_self.connection.escape(data.pid)+","+_self.connection.escape(praticaID)+")", function(err, rows){
          if(err){
            log.error('[addFileAbusi callback 2]Error: %s',err);
            return callback(err);
          }
          _callback(null);
        });
      },
      function(_callback){
        if(data.allegatoType == 3 ){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 1, primo_avviso = "+_self.connection.escape(data.euroValue)+" WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              log.error('[addFileAbusi callback 3]Error: %s',err);
              return _callback(err);
            }
            _callback(null);
          });
        }else if(data.allegatoType == 4){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 2, secondo_avviso ="+_self.connection.escape(data.euroValue)+" WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              log.error('[addFileAbusi callback 4]Error: %s',err);
              return _callback(err);
            }
            _callback(null);
          });
        }else if(data.allegatoType == 5){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 4 WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              log.error('[addFileAbusi callback 5]Error: %s',err);
              return callback(err);
            }
            _callback(null);
          });
        }else _callback(null);
      }
    ])
  }

  changeCompatibility(req, res){
    this.connection.query("UPDATE pratica SET compatibile="+this.connection.escape(req.query.compatibility)+" WHERE id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        log.error('[changeCompatibility]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true}));
    });
  }

  getStatoPratica(req, res){
    this.connection.query("SELECT pratica.stato_pratica_id, pratica.path, stato_pratica.descrizione FROM pratica LEFT JOIN stato_pratica ON pratica.stato_pratica_id = stato_pratica.id WHERE pratica.id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        log.error('[getStatoPratica]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  updateStatoPratica(req, res){
    var query = "";
    if(parseInt(req.query.value) == 2){
      //archiviata
      query = "UPDATE pratica SET stato_pratica_id="+this.connection.escape(req.query.value)+", isArchivio=true WHERE pratica.id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid);
    }else query = "UPDATE pratica SET stato_pratica_id="+this.connection.escape(req.query.value)+" WHERE pratica.id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid);

    this.connection.query(query, function(err,rows){
      if(err){
        log.error('[updateStatoPratica]Error: %s',err);
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

  downloadFileAbuso(req, res, callback){
    this.connection.query("SELECT path FROM allegato_abuso WHERE id="+this.connection.escape(req.query.id), function(err, rows){
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
        log.error('[getBolloAndPagine]Error: %s',err);
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
          value = req.query.tot;
        }else if(req.query.value == Number(3)){
          tipo_imposta_id = 3;
          value = req.query.tot;
        }
        _self.connection.query("INSERT INTO imposta (valore,tipo_imposta_id) VALUES("+_self.connection.escape(value)+","+_self.connection.escape(tipo_imposta_id)+")", function(err,rows){
          if(err){
            log.error('[addBollo callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id,pratica_pandema_id,imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err,rows){
          if(err){
            log.error('[addBollo callback 2]Error: %s',err);
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
    var _self = this;
    this.connection.query("UPDATE imposta SET valore="+this.connection.escape(req.query.value)+" WHERE id="+this.connection.escape(req.query.iid), function(err, rows){
      if(err){
        log.error('[updateBollo]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true}));
    });
  }

  deleteBollo(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("DELETE FROM imposta WHERE id="+_self.connection.escape(req.query.iid), function(err, rows){
          if(err){
            log.error('[deleteBollo]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true}));
        });
      },
      function(_callback){
        _self.connection.query("DELETE FROM pratica_ha_imposta WHERE imposta_id="+_self.connection.escape(req.query.iid), function(err, rows){
          if(err){
            log.error('[deleteBollo]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response : true}));
        });
      }
    ]);
  }

  addNumeroPagine(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var tipo_imposta_id = 1;
        var value = 0;
        _self.connection.query("INSERT INTO imposta (valore,tipo_imposta_id) VALUES("+_self.connection.escape(req.query.value)+","+_self.connection.escape(tipo_imposta_id)+")", function(err,rows){
          if(err){
            log.error('[addNumeroPagine callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows.insertId);
        });
      },
      function(id, _callback){
        _self.connection.query("INSERT INTO pratica_ha_imposta (pratica_id,pratica_pandema_id,imposta_id) VALUES("+_self.connection.escape(req.query.dbid)+","+_self.connection.escape(req.query.pid)+","+_self.connection.escape(id)+")", function(err,rows){
          if(err){
            log.error('[addNumeroPagine callback 2]Error: %s',err);
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
        log.error('[updateNumeroPagine]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRichiestaAdempimenti(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=30", function(err, rows){
      if(err){
        log.error('[getRichiestaAdempimenti]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoDecadenza(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=46", function(err, rows){
      if(err){
        log.error('[getAttoDecadenza]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRichiestaAnticipata(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=37", function(err, rows){
      if(err){
        log.error('[getRichiestaAnticipata]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoConcessione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=31", function(err, rows){
      if(err){
        log.error('[getAttoConcessione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoFinaleD5(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=43", function(err, rows){
      if(err){
        log.error('[getAttoFinaleD5]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoAutorizzazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=42", function(err, rows){
      if(err){
        log.error('[getAttoAutorizzazione]Error: %s',err);
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
            log.error('[getAllAbusi callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(abusi_generici, _callback){
        _self.connection.query("SELECT * FROM abuso WHERE tipo_abuso_id=2", function(err,rows){
          if(err){
            log.error('[getAllAbusi callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, abusi_generici, rows);
        });
      },
      function(abusi_generici, aree_concessione, _callback){
        _self.connection.query("SELECT * FROM abuso WHERE tipo_abuso_id=3", function(err,rows){
          if(err){
            log.error('[getAllAbusi callback 3]Error: %s',err);
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
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=1 AND abuso.comune_id="+_self.connection.escape(req.query.cid)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getAbusiGenerici callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);

        });
      },
      function(abusi, _callback){
        _self.connection.query("SELECT id, descrizione, descrizione_com FROM codice_uso_scopo", function(err, rows){
          if(err){
            log.error('[getAbusiGenerici callback 2]Error: %s',err);
            res.end(JSON.stringify({response : false, err : err}));
          }
          //
          _callback(null,abusi,rows);
        });
      },
      function(abusi,usoscopo,_callback){
        _self.connection.query("SELECT COUNT(abuso.id) AS ccount FROM abuso WHERE tipo_abuso_id=1 AND abuso.comune_id="+_self.connection.escape(req.query.cid), function(err, rows){
          if(err){
            log.error('[getAbusiGenerici callback 3]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : abusi, usoscopo: usoscopo, count : rows}));
          _callback(null);
        });
      }
    ]);
  }

  getAbusiAree(req, res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com, codice_uso_scopo.descrizione FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id LEFT JOIN pratica ON abuso.pratica_id = pratica.id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE tipo_abuso_id=2 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+_self.connection.escape(req.query.cid)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getAbusiAree callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
          //res.end(JSON.stringify({response:true, results : rows}));
        });
      },
      function(abusi, _callback){
        _self.connection.query("SELECT COUNT(abuso.id) AS ccount FROM abuso WHERE tipo_abuso_id=2 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+_self.connection.escape(req.query.cid), function(err, rows){
          if(err){
            log.error('[getAbusiAree callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : abusi, count : rows}));
          _callback(null);
        });
      }
    ]);

  }

  getAbusiCodNav(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com, codice_uso_scopo.descrizione FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id LEFT JOIN pratica ON abuso.pratica_id = pratica.id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE tipo_abuso_id=3 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+_self.connection.escape(req.query.cid)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getAbusiCodNav callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null,rows);
          //res.end(JSON.stringify({response:true, results : rows}));
        });
      },
      function(abusi,_callback){
        _self.connection.query("SELECT COUNT(abuso.id) AS ccount FROM abuso WHERE tipo_abuso_id=3 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+_self.connection.escape(req.query.cid), function(err, rows){
          if(err){
            log.error('[getAbusiCodNav callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : abusi, count : rows}));
          _callback(null);
          //
        });
      }
    ])

  }

  getAvvisoIngiunzione(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=1", function(err, rows){
      if(err){
        log.error('[getAvvisoIngiunzione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getIngiunzione(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=2", function(err, rows){
      if(err){
        log.error('[getIngiunzione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewAbusoGenerico(req,res){
    var _self = this;

    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT citta FROM comune WHERE comune.id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          var hash = crypto.createHash('md5').update(rows[0].citta+'pandemanellotalassa').digest("hex");
          _callback(null, hash);
        })
      },
      function(hash, _callback){
        _self.connection.query("SELECT descrizione FROM tipo_abuso WHERE id="+_self.connection.escape(1), function(err, rows){
          if(err){
            log.error('[addNewAbusoGenerico callback 1]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var abusiFolder = __base+'/documents/'+hash+'/abusi';
          var npraticaFolder = abusiFolder+'/'+req.query.pid;
          var completePraticaPath = npraticaFolder+'/'+rows[0].descrizione;
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, _callback){
        _self.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id, path, comune_id) VALUES("+_self.connection.escape(req.query.pid)+", 5, 1,"+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
            if(err){
              log.error('[addNewAbusoGenerico callback 2]Error: %s',err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, completePraticaPath, npraticaFolder,abusiFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, _callback){

        if(!fs.existsSync(abusiFolder)){
          fs.mkdirSync(abusiFolder);
        }

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

  getDInfosForAbusi(req,res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id AND pratica.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[getDInfosForAbusi]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results: rows}));
    });
    /*var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT pratica_id, pratica_pandema_id FROM abuso WHERE pratica_id IS NOT NULL AND pratica_pandema_id IS NOT NULL", function(err,rows){
          if(err){
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(abusi, _callback){
        var query = "SELECT id FROM pratica WHERE ";
        if( abusi.length == 0 ){
          _callback(null, undefined);
        }
        for(var i = 0; i < abusi.length; i++){
          if( i > 0 && i <= abusi.length-1){
            query += " OR ";
          }
          query += "(id="+_self.connection.escape(abusi[i].id)+" AND pandema_id="+_self.connection.escape(abusi[i].pandema_id)+")";
        }
        _self.connection.query(query, function(err, rows){
          if(err){
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(ids, _callback){
        if( ids === undefined){
          _self.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id AND pratica.comune_id="+_self.connection.escape(req.query.cid)+" AND pratica.isArchivio = 0", function(err, rows){
            if(err){
              res.end(JSON.stringify({response: false, err : err}));
              return;
            }
            res.end(JSON.stringify({response:true, results: rows}));
            _callback(null);
          });
        }else{
          _self.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id AND pratica.comune_id="+_self.connection.escape(req.query.cid)+" AND pratica.isArchivio = 0", function(err, rows){
            if(err){
              res.end(JSON.stringify({response: false, err : err}));
              return;
            }
            var toReturn = [];
            for( var j = 0; j < rows.length; j++){
              var insertMe = false;
              for( var k = 0 ; k < ids.length; k++ ){
                if(rows[j].id === ids[k].id){
                  insertMe = true;
                  break;
                }
              }
              if(insertMe)
                toReturn.push(rows[j]);
            }
            res.end(JSON.stringify({response:true, results: toReturn}));
            _callback(null);
          });
        }

      }
    ])*/

  }

  addNewAbusoAree(req,res){
    var _self = this;

    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT citta FROM comune WHERE comune.id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          var hash = crypto.createHash('md5').update(rows[0].citta+'pandemanellotalassa').digest("hex");
          _callback(null, hash);
        })
      },
      function(hash, _callback){
        _self.connection.query("SELECT descrizione FROM tipo_abuso WHERE id="+_self.connection.escape(2), function(err, rows){
          if(err){
            log.error('[addNewAbusoAree callback 1]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var abusiFolder = __base+'/documents/'+hash+'/abusi';
          var npraticaFolder = abusiFolder+'/'+rows[0].descrizione;
          _callback(null, npraticaFolder, abusiFolder);
        });
      },
      function(npraticaFolder, abusiFolder, _callback){
        _self.connection.query("SELECT id FROM pratica WHERE pandema_id="+_self.connection.escape(req.query.ref), function(err, rows){
          if(err){
            log.error('[addNewAbusoAree callback 2]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, npraticaFolder, abusiFolder, rows);
        });
      },
      function(npraticaFolder, abusiFolder, ids, _callback){
        _self.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id, pratica_id, pratica_pandema_id, comune_id) VALUES("+_self.connection.escape(req.query.ref+Date.now())+", 5, 2,"+_self.connection.escape(ids[0].id)+","+_self.connection.escape(req.query.ref)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
            if(err){
              log.error('[addNewAbusoAree callback 3]Error: %s',err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            //res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, npraticaFolder, abusiFolder, rows.insertId);
        });
      },
      function(npraticaFolder, abusiFolder, lastID, _callback){
        var completePraticaPath = npraticaFolder+'/'+req.query.ref+'_'+lastID;
        _self.connection.query("UPDATE abuso SET pandema_abuso_id = "+_self.connection.escape(req.query.ref+"_"+lastID+"AB")+", path="+_self.connection.escape(completePraticaPath)+" WHERE id="+_self.connection.escape(lastID), function(err,rows){
          if(err){
            log.error('[addNewAbusoAree callback 4]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var newid =
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder, lastID);
        })
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, lastID, _callback){

        if(!fs.existsSync(abusiFolder)){
          fs.mkdirSync(abusiFolder);
        }

        if(!fs.existsSync(npraticaFolder)){
          fs.mkdirSync(npraticaFolder);
        }

        if(!fs.existsSync(completePraticaPath)){
          fs.mkdirSync(completePraticaPath);
        }
        res.end(JSON.stringify({response : true, id: lastID}))
        _callback(null);
      }
    ]);
  }

  addNewAbusoCodNav(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT citta FROM comune WHERE comune.id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          var hash = crypto.createHash('md5').update(rows[0].citta+'pandemanellotalassa').digest("hex");
          _callback(null, hash);
        })
      },
      function(hash, _callback){
        _self.connection.query("SELECT descrizione FROM tipo_abuso WHERE id="+_self.connection.escape(3), function(err, rows){
          if(err){
            log.error('[addNewAbusoCodNav callback 1]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var abusiFolder = __base+'/documents/'+hash+'/abusi';
          var npraticaFolder = abusiFolder+'/'+rows[0].descrizione;
          _callback(null, npraticaFolder, abusiFolder);
        });
      },
      function(npraticaFolder, abusiFolder, _callback){
        _self.connection.query("SELECT id FROM pratica WHERE pandema_id="+_self.connection.escape(req.query.ref), function(err, rows){
          if(err){
            log.error('[addNewAbusoCodNav callback 2]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, npraticaFolder, abusiFolder, rows);
        });
      },
      function(npraticaFolder, abusiFolder, ids, _callback){
        _self.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id, pratica_id, pratica_pandema_id, comune_id) VALUES("+_self.connection.escape(req.query.ref+Date.now())+", 5, 3,"+_self.connection.escape(ids[0].id)+","+_self.connection.escape(req.query.ref)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
            if(err){
              log.error('[addNewAbusoCodNav callback 3]Error: %s',err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            //res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, npraticaFolder, abusiFolder, rows.insertId);
        });
      },
      function(npraticaFolder, abusiFolder, lastID, _callback){
        var completePraticaPath = npraticaFolder+'/'+req.query.ref+'_'+lastID;
        _self.connection.query("UPDATE abuso SET pandema_abuso_id = "+_self.connection.escape(req.query.ref+'_'+lastID+"AB")+", path="+_self.connection.escape(completePraticaPath)+" WHERE id="+_self.connection.escape(lastID), function(err,rows){
          if(err){
            log.error('[addNewAbusoCodNav callback 4]Error: %s',err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder, lastID);
        })
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, lastID, _callback){

        if(!fs.existsSync(abusiFolder)){
          fs.mkdirSync(abusiFolder);
        }

        if(!fs.existsSync(npraticaFolder)){
          fs.mkdirSync(npraticaFolder);
        }

        if(!fs.existsSync(completePraticaPath)){
          fs.mkdirSync(completePraticaPath);
        }
        res.end(JSON.stringify({response : true, id:lastID}))
        _callback(null);
      }
    ]);
  }

  getPrimoAvviso(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=3", function(err, rows){
      if(err){
        log.error('[getPrimoAvviso]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getSecondoAvviso(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=4", function(err, rows){
      if(err){
        log.error('[getSecondoAvviso]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusoPath(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT path FROM abuso WHERE id="+_self.connection.escape(req.query.dbid)+" AND pandema_abuso_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            log.error('[getAbusoPath callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_id FROM abuso WHERE id="+_self.connection.escape(req.query.dbid)+" AND pandema_abuso_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            log.error('[getAbusoPath callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, path, rows);
        });
      },
      function(path, pratica_id, _callback){
        if( pratica_id[0].pratica_id == null ){
          //signfiica che è un abuso generico
          _self.connection.query("SELECT id,descrizione_com FROM codice_uso_scopo", function(err, rows){
            if(err){
              log.error('[getAbusoPath callback 3]Error: %s',err);
              res.end(JSON.stringify({response: false, err : err}));
              return;
            }
            res.end(JSON.stringify({response:true, results : path, usoscopo : rows}));
            _callback(null);
          });
        }else{
          //significa che è codnav o aree in concessione
          _self.connection.query("SELECT codice_uso_scopo.descrizione FROM pratica LEFT JOIN abuso ON abuso.pratica_id = pratica.id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE abuso.id="+_self.connection.escape(req.query.dbid)+" AND abuso.pandema_abuso_id="+_self.connection.escape(req.query.pid), function(err, rows){
            if(err){
              log.error('[getAbusoPath callback 4]Error: %s',err);
              res.end(JSON.stringify({response: false, err : err}));
              return;
            }
            res.end(JSON.stringify({response:true, results : path, usoscopo : rows}));
            _callback(null);
          });
        }
      }
    ]);
  }

  getTrasmissione(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=5", function(err, rows){
      if(err){
        log.error('[getTrasmissione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusoStati(req,res){
    this.connection.query("SELECT id, descrizione_com FROM stato_pratica_abuso", function(err, rows){
      if(err){
        log.error('[getAbusoStati]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  updateStatoAbuso(req,res){
    this.connection.query("UPDATE abuso SET stato_pratica_abuso_id ="+this.connection.escape(value)+" WHERE id="+this.connection.escape(data.dbid)+" AND pandema_abuso_id="+this.connection.escape(data.pid), function(err, rows){
      if(err){
        log.error('[updateStatoAbuso]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getDecadenzaAbusi(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=6", function(err, rows){
      if(err){
        log.error('[getDecadenzaAbusi]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getChiusuraPratica(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=7", function(err, rows){
      if(err){
        log.error('[getChiusuraPratica]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getDecadenza(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=8", function(err, rows){
      if(err){
        log.error('[getDecadenza]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAvvioDecadenza(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=10", function(err, rows){
      if(err){
        log.error('[getAvvioDecadenza]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAvvioDecadenzaPratica(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=45", function(err, rows){
      if(err){
        log.error('[getAvvioDecadenzaPratica]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRegistriGenerico(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT * FROM registro_generico WHERE comune_id="+_self.connection.escape(req.query.comune_id)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getRegistriGenerico callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
          //res.end(JSON.stringify({response:true, results : rows}));
        });
      },
      function(registri, _callback){
        _self.connection.query("SELECT COUNT(id) AS ccount FROM registro_generico WHERE comune_id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          if(err){
            log.error('[getRegistriGenerico callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : registri, count : rows}));
          _callback(null);
        });
      }
    ])

  }

  addNewGeneralRegistry(req,res){
    this.connection.query("INSERT INTO registro_generico(comune_id, n_ordine, localita, superficie, data, durata_mesi, scadenza, canone, quietanza, pertinenza, annotazioni, concessionario,scopo) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.localita)+","+this.connection.escape(req.body.superficie)+","+this.connection.escape(req.body.data)+","+this.connection.escape(req.body.durata)+","+this.connection.escape(req.body.scadenza)+","+this.connection.escape(req.body.canone)+","+this.connection.escape(req.body.quietanza)+","+this.connection.escape(req.body.pertinenza)+","+this.connection.escape(req.body.annotazioni)+","+this.connection.escape(req.body.concessionario)+","+this.connection.escape(req.body.scopo)+")", function(err, rows){
      if(err){
        log.error('[addNewGeneralRegistry]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroGenerico(req,res){
    this.connection.query("SELECT * FROM registro_generico WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[getRegistroGenerico]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  annotazioneRegolarita(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=39", function(err, rows){
      if(err){
        log.error('[annotazioneRegolarita]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  annotazioneIrregolaritaAbusi(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=9", function(err, rows){
      if(err){
        log.error('[annotazioneIrregolaritaAbusi]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  revoca(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=40", function(err, rows){
      if(err){
        log.error('[revoca]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRegistriArt24(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT * FROM registro_art24 WHERE comune_id="+_self.connection.escape(req.query.comune_id)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getRegistriArt24 callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
          //res.end(JSON.stringify({response:true, results : rows}));
        });
      },
      function(registri, _callback){
        _self.connection.query("SELECT COUNT(id) AS ccount FROM registro_art24 WHERE comune_id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          if(err){
            log.error('[getRegistriArt24 callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }

          res.end(JSON.stringify({response:true, results : registri, count : rows}));
          _callback(null);
        });
      }
    ])

  }

  addNewArt24Registry(req,res){
    this.connection.query("INSERT INTO registro_art24(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, scopo, area_coperta, area_scoperta, volumetria, codice_comune, sezione, foglio, particella, subalterni, annotazioni) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.scopo)+","+this.connection.escape(req.body.area_coperta)+","+this.connection.escape(req.body.area_scoperta)+","+this.connection.escape(req.body.volumetria)+","+this.connection.escape(req.body.codice_comune)+","+this.connection.escape(req.body.sezione)+","+this.connection.escape(req.body.foglio)+","+this.connection.escape(req.body.particella)+","+this.connection.escape(req.body.subalterni)+","+this.connection.escape(req.body.annotazioni)+")", function(err, rows){
      if(err){
        log.error('[addNewArt24Registry]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroArt24(req,res){
    this.connection.query("SELECT * FROM registro_art24 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[getRegistroArt24]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getRegistriArt55(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT * FROM registro_art55 WHERE comune_id="+_self.connection.escape(req.query.comune_id)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getRegistriArt55 callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(registri, _callback){
        _self.connection.query("SELECT count(id) AS ccount FROM registro_art55 WHERE comune_id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          if(err){
            log.error('[getRegistriArt55 callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : registri, count:rows}));
          _callback(null);
        });
      }
    ]);
  }

  getRegistroArt55(req,res){
    this.connection.query("SELECT * FROM registro_art55 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[getRegistroArt55]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewArt55Registry(req,res){
    this.connection.query("INSERT INTO registro_art55(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, scopo, volumetria, codice_comune, sezione, foglio, particella, subalterni, annotazioni, data_rilascio, num_repertori, data_registrazione) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data_richiesta)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.scopo)+","+this.connection.escape(req.body.volumetria)+","+this.connection.escape(req.body.codice_comune)+","+this.connection.escape(req.body.sezione)+","+this.connection.escape(req.body.foglio)+","+this.connection.escape(req.body.particella)+","+this.connection.escape(req.body.subalterni)+","+this.connection.escape(req.body.annotazioni)+","+this.connection.escape(req.body.data_rilascio)+","+this.connection.escape(req.body.num_repertori)+","+this.connection.escape(req.body.data_registrazione)+")", function(err, rows){
      if(err){
        log.error('[addNewArt55Registry]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistriArt45(req,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        var offset = 10 * req.query.offset;
        _self.connection.query("SELECT * FROM registro_art45 WHERE comune_id="+_self.connection.escape(req.query.comune_id)+" LIMIT 10 OFFSET "+offset, function(err, rows){
          if(err){
            log.error('[getRegistriArt45 callback 1]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows)
          //res.end(JSON.stringify({response:true, results : rows}));
        });
      },
      function(registri,_callback){
        _self.connection.query("SELECT COUNT(id) AS ccount FROM registro_art45 WHERE comune_id="+_self.connection.escape(req.query.comune_id), function(err, rows){
          if(err){
            log.error('[getRegistriArt45 callback 2]Error: %s',err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          res.end(JSON.stringify({response:true, results : registri, count : rows}));
          _callback(null);
        });
      }
    ])
  }

  addNewArt45Registry(req,res){
    this.connection.query("INSERT INTO registro_art45(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, causale_autorizzazione, atto_concessione_subentro, num_atto_rilascio, data_atto_rilascio, pratica_concessione_riferimento) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data_richiesta)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.causale_autorizzazione)+","+this.connection.escape(req.body.atto_concessione_subentro)+","+this.connection.escape(req.body.num_atto_rilascio)+","+this.connection.escape(req.body.data_atto_rilascio)+","+this.connection.escape(req.body.pratica_concessione_riferimento)+")", function(err, rows){
      if(err){
        log.error('[addNewArt45Registry]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroArt45(req,res){
    this.connection.query("SELECT * FROM registro_art45 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        log.error('[getRegistroArt45]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  searchTableA(req,res){
    //SELECT title FROM pages WHERE my_col LIKE %$param1% OR another_col LIKE %$param2%;
    //console.log("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 0 AND (pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR tipo_documento.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.nome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.cognome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.data LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR codice_uso_scopo.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+')');
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 0 AND (pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR tipo_documento.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.nome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.cognome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.data LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR codice_uso_scopo.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+') AND pratica.comune_id='+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableA]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableB(req,res){
    //SELECT title FROM pages WHERE my_col LIKE %$param1% OR another_col LIKE %$param2%;
    //console.log("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 1 AND (pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.tipo_documento_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR tipo_documento.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.nome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.cognome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.codice_uso_scopo_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.stato_pratica_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.data LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR codice_uso_scopo.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+")");
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 1 AND (pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.tipo_documento_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR tipo_documento.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.nome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.cognome LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.codice_uso_scopo_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.stato_pratica_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica.data LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.descrizione LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica.id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR codice_uso_scopo.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND pratica.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableB]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableC(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=1 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableC]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableD(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=2 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableD]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableE(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=3 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableE]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableF(req,res){
    this.connection.query("SELECT * FROM registro_generico WHERE comune_id="+this.connection.escape(req.query.cid)+" AND ( n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR scadenza LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR concessionario LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND registro_generico.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        log.error('[searchTableF]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableG(req,res){
    this.connection.query("SELECT * FROM registro_art24 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR annotazioni LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        log.error('[searchTableG]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableH(req,res){
    this.connection.query("SELECT * FROM registro_art55 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR annotazioni LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        log.error('[searchTableH]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableI(req,res){
    this.connection.query("SELECT * FROM registro_art45 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica_concessione_riferimento LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        log.error('[searchTableI]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  getAttiAutorizzazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=44", function(err, rows){
      if(err){
        log.error('[getAttiAutorizzazione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getD1s(req,res){
    this.connection.query("SELECT pratica.pandema_id, pratica.id FROM pratica WHERE comune_id="+this.connection.escape(req.query.cid)+" AND pratica.tipo_documento_id='1'", function(err, rows){
      if(err){
        log.error('[getD1s]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  getComuneImage(req,res){
    this.connection.query("SELECT path FROM comune WHERE comune.id="+this.connection.escape(req.query.cid), function(err,rows){
      if(err){
        res.end(__base+'/comuniImages/admin.png');
        return;
      }
      res.end(rows[0].path);
    })
  }

  getRefAbuso(req,res){
    this.connection.query("SELECT id, pandema_abuso_id FROM abuso WHERE pratica_id="+this.connection.escape(req.query.dbid)+" AND pratica_pandema_id="+this.connection.escape(req.query.pid), function(err,rows){
      if(err){
        log.error('[getRefAbuso]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAvvisoDiniegoFinale(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=47", function(err, rows){
      if(err){
        log.error('[getAvvisoDiniegoFinale]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getDiniegoDefinivoFinale(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=48", function(err, rows){
      if(err){
        log.error('[getDiniegoDefinivoFinale]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAdempimentiAnnuali(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=49", function(err, rows){
      if(err){
        log.error('[getAdempimentiAnnuali]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRicevuteCanone(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=50", function(err, rows){
      if(err){
        log.error('[getRicevuteCanone]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRicevuteSpese(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=51", function(err, rows){
      if(err){
        log.error('[getRicevuteSpese]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttestatoCauzione(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=52", function(err, rows){
      if(err){
        log.error('[getAttestatoCauzione]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAnnualiPath(req,res){
    this.connection.query("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.dbid)+" AND pandema_id="+this.connection.escape(req.query.pid), function(err, rows){
      if(err){
        log.error('[getAnnualiPath]Error: %s',err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    })
  }

}

export default Middleware;
