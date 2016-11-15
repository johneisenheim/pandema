import mysql from 'mysql';

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

}

export default Middleware;
