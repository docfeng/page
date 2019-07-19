var database={
  db:openDatabase('store', '1.0', 'Test DB', 2 * 1024 * 1024),
  createTable:function(name,arr){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              resolve(true);
          });
      });
  },
  insert:function(name,json){
      var t=this;
      var keys=[];
      var values=[];
      for(var key in json){
         keys.push(key);
         values.push(json[key]);
      }
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              tx.executeSql('INSERT INTO '+name+' ('+keys.join(",")+') VALUES (?, ?)', values);
              resolve(true);
          });
      });
  },
  select:function(name){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              //tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              tx.executeSql('SELECT * FROM '+name, [], function (tx, results) {
                  var len = results.rows.length, i;
                  var msg = "<p>查询记录条数: " + len + "</p>";
                   for (i = 0; i < len; i++){
                        msg+= "<p><b>" + results.rows.item(i).log + "</b></p>";
                   }
                   alert(msg)
              }, null);
              resolve(true);
          });
      });
  },
  update:function(a){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              //tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              tx.executeSql('UPDATE LOGS SET log=\'www.w3cschool.cc\' WHERE id=2');
              resolve(true);
          });
      });
  },
  delete:function(name,str){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              //tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              tx.executeSql('DELETE FROM '+name+'  WHERE '+str);
              resolve(true);
          });
      });
  }
}
alert(database)