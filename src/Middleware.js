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

  addComune(citta, cap, username, password,res){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT cap FROM comune WHERE cap="+_self.connection.escape(cap), function(err, rows){
          if(err){
            res.end(JSON.stringify({status : false}))
            return;
          }
          console.log(rows);
          if(rows.length > 0){
            res.end(JSON.stringify({status : true, message:'Esiste già un comune con questo CAP inserito!'}));
            return;
          }
          _callback(null);
        });
      },
      function(_callback){
        var hash = crypto.createHash('md5').update(citta+'pandemanellotalassa').digest("hex");
        var folder = __base+'/documents/'+hash;
        if(fs.existsSync(folder)){
          res.end(JSON.stringify({status : true, message:'Esiste già un comune con questo nome inserito!'}));
          return;
        }else{
          fs.mkdirSync(folder);
          _callback(null);
        }
      },
      function(_callback){
        _self.connection.query("INSERT INTO comune (citta, cap, username, password) VALUES ("+_self.connection.escape(citta)+","+_self.connection.escape(cap)+","+_self.connection.escape(username)+","+_self.connection.escape(password)+")", function(err, rows){
          if(err){
            res.end(JSON.stringify({status : false}))
            return;
          }
          res.end(JSON.stringify({status : true, message:''}));
          _callback(null);
        });
      }
    ]);
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

  getAllegatiPratica(req, res){
    var _self = this;
    this.connection.query("SELECT pratica_ha_allegato.allegato_id, pratica_ha_allegato.pratica_id, pratica_ha_allegato.pratica_pandema_id, allegato.path, allegato.data_creazione, tipo_allegato.descrizione_com AS descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.praticaID)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pandemaPraticaID), function(err,rows){
        if(err)
          console.log(err);
        res.end(JSON.stringify({response:true, results: rows}));
    });
  }

  getAllegatiAbusi(req, res){
    var _self = this;
    console.log("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.praticaID)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pandemaPraticaID));
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.praticaID)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pandemaPraticaID), function(err,rows){
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

  viewDocumentAbuso(id, callback){
    this.connection.query("SELECT path FROM allegato_abuso WHERE id="+this.connection.escape(id), function(err, rows){
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

  deleteDocumentAbuso(path, id, res){
    var _self = this;
    this.connection.query("DELETE FROM allegato_abuso WHERE id="+this.connection.escape(id), function(err, rows){
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
        _self.connection.query("INSERT INTO pratica (comune_id, pandema_id, nome, cognome, codice_uso_scopo_id, tipo_documento_id, stato_pratica_id, cf, data, path, email, emailpec) VALUES ("+_self.connection.escape(data.comune_id)+","+_self.connection.escape(data.npratica)+","+_self.connection.escape(data.nome)+","+_self.connection.escape(data.cognome)+","+_self.connection.escape(data.uso)+","+_self.connection.escape(data.tipodocumento)+","+_self.connection.escape(stato_pratica_id)+","+_self.connection.escape(data.cf)+","+_self.connection.escape(data.data)+","+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(data.email)+","+_self.connection.escape(data.emailpec)+")", function(err, rows, fields){
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

  getgeneralinfos(req,res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 0 AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    }); //VG59TQ
  }

  getgeneralinfosArchivio(req,res){
    this.connection.query("SELECT pratica.id, pratica.pandema_id, pratica.tipo_documento_id, tipo_documento.descrizione, pratica.nome, pratica.cognome, pratica.codice_uso_scopo_id, pratica.stato_pratica_id, pratica.data, stato_pratica.descrizione AS stato_pratica_desc, stato_pratica.id AS st_pratica_id, codice_uso_scopo.descrizione_com FROM pratica LEFT JOIN tipo_documento ON tipo_documento.id = pratica.tipo_documento_id LEFT JOIN stato_pratica ON stato_pratica.id = pratica.stato_pratica_id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.isArchivio = 1 AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
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

  handlealtripareri(req,res){
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
        _self.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com, tipo_allegato.descrizione AS tipo_descrizione FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+_self.connection.escape(req.query.id)+" AND pratica_ha_allegato.pratica_pandema_id="+_self.connection.escape(req.query.pandema_id)+" AND tipo_allegato.id=41", function(err, rows){
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
          _callback(null, canoni, rows);
        });
      },
      function(canoni, imposte, _callback){
        _self.connection.query("SELECT codice_uso_scopo.descrizione FROM codice_uso_scopo LEFT JOIN pratica ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE pratica.id="+_self.connection.escape(req.query.dbid)+" AND pratica.pandema_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            console.log(err);
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
    console.log("SELECT path FROM pratica WHERE id="+this.connection.escape(req.query.id)+" AND pandema_id="+this.connection.escape(req.query.pandema_id))
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
    console.log("DELETE FROM imposta WHERE id="+this.connection.escape(req.query.id));
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

  addFileAbusi(data){
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("INSERT INTO allegato_abuso (path, tipo_allegato_abuso_id, data_creazione) VALUES("+_self.connection.escape(data.filepath)+","+_self.connection.escape(data.allegatoType)+",NOW())", function(err,rows){
          if(err){
            console.log('Err in 1 '+ err);
            return callback(err);
          }
          _callback(null, rows.insertId);
        });
      },
      function(praticaID, _callback){
        _self.connection.query("INSERT INTO abuso_ha_allegato_abuso (abuso_id, pandema_abuso_id, allegato_abuso_id) VALUES("+_self.connection.escape(data.dbid)+","+_self.connection.escape(data.pid)+","+_self.connection.escape(praticaID)+")", function(err, rows){
          if(err){
            console.log('Err in 2 '+ err);
            return callback(err);
          }
          _callback(null);
        });
      },
      function(_callback){
        if(data.allegatoType == 3 ){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 1, primo_avviso = "+_self.connection.escape(data.euroValue)+" WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              console.log('Err in 2 '+ err);
              return _callback(err);
            }
            _callback(null);
          });
        }else if(data.allegatoType == 4){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 2, secondo_avviso ="+_self.connection.escape(data.euroValue)+" WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              console.log('Err in 2 '+ err);
              return _callback(err);
            }
            _callback(null);
          });
        }else if(data.allegatoType == 5){
          _self.connection.query("UPDATE abuso SET stato_pratica_abuso_id = 4 WHERE id="+_self.connection.escape(data.dbid)+" AND pandema_abuso_id="+_self.connection.escape(data.pid), function(err, rows){
            if(err){
              console.log('Err in 2 '+ err);
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

  getAttoFinaleD5(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=43", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getAttoAutorizzazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=42", function(err, rows){
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
    var _self = this;
    async.waterfall([
      function(_callback){
        _self.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=1 AND abuso.comune_id="+_self.connection.escape(req.query.cid), function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);

        });
      },
      function(abusi, _callback){
        _self.connection.query("SELECT id,descrizione_com FROM codice_uso_scopo", function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response : false, err : err}));
          }
          res.end(JSON.stringify({response:true, results : abusi, usoscopo: rows}));
          _callback(null);
        });
      }
    ]);
  }

  getAbusiAree(req, res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com, codice_uso_scopo.descrizione FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id LEFT JOIN pratica ON abuso.pratica_id = pratica.id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE tipo_abuso_id=2 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusiCodNav(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com, codice_uso_scopo.descrizione FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id LEFT JOIN pratica ON abuso.pratica_id = pratica.id LEFT JOIN codice_uso_scopo ON pratica.codice_uso_scopo_id = codice_uso_scopo.id WHERE tipo_abuso_id=3 AND abuso.pratica_id IS NOT NULL AND abuso.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
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

  getIngiunzione(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=2", function(err, rows){
      if(err){
        console.log(err);
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
            console.log('[d1DBOperations] error: '+ err);
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
              console.log('[d1DBOperations] error: '+ err);
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
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results: rows}));
    });
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
            console.log('[d1DBOperations] error: '+ err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var abusiFolder = __base+'/documents/'+hash+'/abusi';
          var npraticaFolder = abusiFolder+'/'+rows[0].descrizione;
          var completePraticaPath = npraticaFolder+'/ABAC'+req.query.ref;
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, _callback){
        _self.connection.query("SELECT id FROM pratica WHERE pandema_id="+_self.connection.escape(req.query.ref), function(err, rows){
          if(err){
            console.log('[d1DBOperations] error: '+ err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder, rows);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, ids, _callback){
        _self.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id, path, pratica_id, pratica_pandema_id, comune_id) VALUES("+_self.connection.escape('ABAC'+req.query.ref)+", 5, 2,"+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(ids[0].id)+","+_self.connection.escape(req.query.ref)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
            if(err){
              console.log('[d1DBOperations] error: '+ err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, completePraticaPath, npraticaFolder, abusiFolder);
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
            console.log('[d1DBOperations] error: '+ err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          var abusiFolder = __base+'/documents/'+hash+'/abusi';
          var npraticaFolder = abusiFolder+'/'+rows[0].descrizione;
          var completePraticaPath = npraticaFolder+'/ABART47'+req.query.ref;
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, _callback){
        _self.connection.query("SELECT id FROM pratica WHERE pandema_id="+_self.connection.escape(req.query.ref), function(err, rows){
          if(err){
            console.log('[d1DBOperations] error: '+ err);
            res.end(JSON.stringify({response : false, err: err}))
            return;
          }
          _callback(null, completePraticaPath, npraticaFolder, abusiFolder, rows);
        });
      },
      function(completePraticaPath, npraticaFolder, abusiFolder, ids, _callback){
        _self.connection.query("INSERT INTO abuso (pandema_abuso_id, stato_pratica_abuso_id, tipo_abuso_id, path, pratica_id, pratica_pandema_id,comune_id) VALUES("+_self.connection.escape('ABART47'+req.query.ref)+", 5, 3,"+_self.connection.escape(completePraticaPath)+","+_self.connection.escape(ids[0].id)+","+_self.connection.escape(req.query.ref)+","+_self.connection.escape(req.query.comune_id)+")", function(err, rows){
            if(err){
              console.log('[d1DBOperations] error: '+ err);
              res.end(JSON.stringify({response : false, err: err}))
              return;
            }
            res.end(JSON.stringify({response : true, id: rows.insertId}))
            _callback(null, completePraticaPath, npraticaFolder, abusiFolder);
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

  getPrimoAvviso(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=3", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getSecondoAvviso(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=4", function(err, rows){
      if(err){
        console.log(err);
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
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, rows);
        });
      },
      function(path, _callback){
        _self.connection.query("SELECT pratica_id FROM abuso WHERE id="+_self.connection.escape(req.query.dbid)+" AND pandema_abuso_id="+_self.connection.escape(req.query.pid), function(err, rows){
          if(err){
            console.log(err);
            res.end(JSON.stringify({response: false, err : err}));
            return;
          }
          _callback(null, path, rows);
        });
      },
      function(path, pratica_id, _callback){
        if( pratica_id[0].pratica_id == null ){
          //signfiica che è un abuso generico
          console.log("SELECT id,descrizione_com FROM codice_uso_scopo");
          _self.connection.query("SELECT id,descrizione_com FROM codice_uso_scopo", function(err, rows){
            if(err){
              console.log(err);
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
              console.log(err);
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
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAbusoStati(req,res){
    this.connection.query("SELECT id, descrizione_com FROM stato_pratica_abuso", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  updateStatoAbuso(req,res){
    this.connection.query("UPDATE abuso SET stato_pratica_abuso_id ="+this.connection.escape(value)+" WHERE id="+this.connection.escape(data.dbid)+" AND pandema_abuso_id="+this.connection.escape(data.pid), function(err, rows){
      if(err){
        console.log('Err in 2 '+ err);
        return callback(err);
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getDecadenzaAbusi(req,res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=6", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getChiusuraPratica(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=7", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getDecadenza(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=8", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getAvvioDecadenza(req, res){
    this.connection.query("SELECT abuso_ha_allegato_abuso.allegato_abuso_id AS phaID, allegato_abuso.id, allegato_abuso.data_creazione, allegato_abuso.descrizione, allegato_abuso.path, tipo_allegato_abuso.descrizione_com FROM abuso_ha_allegato_abuso LEFT JOIN allegato_abuso ON abuso_ha_allegato_abuso.allegato_abuso_id = allegato_abuso.id LEFT JOIN tipo_allegato_abuso ON allegato_abuso.tipo_allegato_abuso_id = tipo_allegato_abuso.id WHERE abuso_ha_allegato_abuso.abuso_id ="+this.connection.escape(req.query.dbid)+" AND abuso_ha_allegato_abuso.pandema_abuso_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato_abuso.id=10", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getRegistriGenerico(req,res){
    this.connection.query("SELECT * FROM registro_generico WHERE comune_id="+this.connection.escape(req.query.comune_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewGeneralRegistry(req,res){
    console.log(req.body);
    this.connection.query("INSERT INTO registro_generico(comune_id, n_ordine, localita, superficie, data, durata_mesi, scadenza, canone, quietanza, pertinenza, annotazioni, concessionario,scopo) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.localita)+","+this.connection.escape(req.body.superficie)+","+this.connection.escape(req.body.data)+","+this.connection.escape(req.body.durata)+","+this.connection.escape(req.body.scadenza)+","+this.connection.escape(req.body.canone)+","+this.connection.escape(req.body.quietanza)+","+this.connection.escape(req.body.pertinenza)+","+this.connection.escape(req.body.annotazioni)+","+this.connection.escape(req.body.concessionario)+","+this.connection.escape(req.body.scopo)+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroGenerico(req,res){
    this.connection.query("SELECT * FROM registro_generico WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  annotazioneRegolarita(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=39", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  revoca(req,res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=40", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getRegistriArt24(req,res){
    this.connection.query("SELECT * FROM registro_art24 WHERE comune_id="+this.connection.escape(req.query.comune_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewArt24Registry(req,res){
    this.connection.query("INSERT INTO registro_art24(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, scopo, area_coperta, area_scoperta, volumetria, codice_comune, sezione, foglio, particella, subalterni, annotazioni) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.scopo)+","+this.connection.escape(req.body.area_coperta)+","+this.connection.escape(req.body.area_scoperta)+","+this.connection.escape(req.body.volumetria)+","+this.connection.escape(req.body.codice_comune)+","+this.connection.escape(req.body.sezione)+","+this.connection.escape(req.body.foglio)+","+this.connection.escape(req.body.particella)+","+this.connection.escape(req.body.subalterni)+","+this.connection.escape(req.body.annotazioni)+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroArt24(req,res){
    this.connection.query("SELECT * FROM registro_art24 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getRegistriArt55(req,res){
    this.connection.query("SELECT * FROM registro_art55 WHERE comune_id="+this.connection.escape(req.query.comune_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  getRegistroArt55(req,res){
    this.connection.query("SELECT * FROM registro_art55 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewArt55Registry(req,res){
    this.connection.query("INSERT INTO registro_art55(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, scopo, volumetria, codice_comune, sezione, foglio, particella, subalterni, annotazioni, data_rilascio, num_repertori, data_registrazione) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data_richiesta)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.scopo)+","+this.connection.escape(req.body.volumetria)+","+this.connection.escape(req.body.codice_comune)+","+this.connection.escape(req.body.sezione)+","+this.connection.escape(req.body.foglio)+","+this.connection.escape(req.body.particella)+","+this.connection.escape(req.body.subalterni)+","+this.connection.escape(req.body.annotazioni)+","+this.connection.escape(req.body.data_rilascio)+","+this.connection.escape(req.body.num_repertori)+","+this.connection.escape(req.body.data_registrazione)+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistriArt45(req,res){
    this.connection.query("SELECT * FROM registro_art45 WHERE comune_id="+this.connection.escape(req.query.comune_id), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true, results : rows}));
    });
  }

  addNewArt45Registry(req,res){
    this.connection.query("INSERT INTO registro_art45(comune_id, n_ordine, richiedente, data_richiesta, protocollo_richiesta, causale_autorizzazione, atto_concessione_subentro, num_atto_rilascio, data_atto_rilascio, pratica_concessione_riferimento) VALUES("+this.connection.escape(req.body.comune_id)+","+this.connection.escape(req.body.nordine)+","+this.connection.escape(req.body.richiedente)+","+this.connection.escape(req.body.data_richiesta)+","+this.connection.escape(req.body.protocollo_richiesta)+","+this.connection.escape(req.body.causale_autorizzazione)+","+this.connection.escape(req.body.atto_concessione_subentro)+","+this.connection.escape(req.body.num_atto_rilascio)+","+this.connection.escape(req.body.data_atto_rilascio)+","+this.connection.escape(req.body.pratica_concessione_riferimento)+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response:true}));
    });
  }

  getRegistroArt45(req,res){
    this.connection.query("SELECT * FROM registro_art45 WHERE id="+this.connection.escape(req.query.id), function(err, rows){
      if(err){
        console.log(err);
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
        console.log(err);
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
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableC(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=1 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableD(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=2 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableE(req,res){
    this.connection.query("SELECT abuso.*, stato_pratica_abuso.descrizione_com FROM abuso LEFT JOIN stato_pratica_abuso ON abuso.stato_pratica_abuso_id = stato_pratica_abuso.id WHERE tipo_abuso_id=3 AND (abuso.pandema_abuso_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR abuso.pratica_pandema_id LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR stato_pratica_abuso.descrizione_com LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND comune_id="+this.connection.query(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

  searchTableF(req,res){
    this.connection.query("SELECT * FROM registro_generico WHERE comune_id="+this.connection.escape(req.query.cid)+" AND ( n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR scadenza LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR concessionario LIKE "+this.connection.escape('%'+req.query.search+'%')+") AND registro_generico.comune_id="+this.connection.escape(req.query.cid), function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableG(req,res){
    this.connection.query("SELECT * FROM registro_art24 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR annotazioni LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableH(req,res){
    this.connection.query("SELECT * FROM registro_art55 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR annotazioni LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  searchTableI(req,res){
    this.connection.query("SELECT * FROM registro_art45 WHERE comune_id="+this.connection.escape(req.query.cid)+" AND (n_ordine LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR richiedente LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR data_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR protocollo_richiesta LIKE "+this.connection.escape('%'+req.query.search+'%')+" OR pratica_concessione_riferimento LIKE "+this.connection.escape('%'+req.query.search+'%')+")", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });

  }

  getAttiAutorizzazione(req, res){
    this.connection.query("SELECT pratica_ha_allegato.allegato_id AS phaID, allegato.id, allegato.data_creazione, allegato.descrizione, allegato.path, tipo_allegato.descrizione_com FROM pratica_ha_allegato LEFT JOIN allegato ON pratica_ha_allegato.allegato_id = allegato.id LEFT JOIN tipo_allegato ON allegato.tipo_allegato_id = tipo_allegato.id WHERE pratica_ha_allegato.pratica_id ="+this.connection.escape(req.query.dbid)+" AND pratica_ha_allegato.pratica_pandema_id="+this.connection.escape(req.query.pid)+" AND tipo_allegato.id=44", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }
      res.end(JSON.stringify({response : true, results : rows}));
    });
  }

  getD1s(req,res){
    this.connection.query("SELECT pratica.pandema_id, pratica.id FROM pratica WHERE comune_id="+this.connection.escape(req.query.cid)+" AND pratica.isArchivio=false AND pratica.tipo_documento_id='1'", function(err, rows){
      if(err){
        console.log(err);
        res.end(JSON.stringify({response: false, err : err}));
        return;
      }

      res.end(JSON.stringify({response : true, results : rows}));

    });
  }

}

export default Middleware;
