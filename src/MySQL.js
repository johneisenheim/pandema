import mysql from 'mysql';


class MySQL{

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
      return null;
    }
    this.connection.connect();
    return true;
  }

  getMySQLObject(){
    return this.connection;
  }

}

export default MySQL;
