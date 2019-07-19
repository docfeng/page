var database={
  db:openDatabase('store', '1.0', 'Test DB', 2 * 1024 * 1024),
  createTable:function(name,arr){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {
              tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              resolve(1);
          });
      });
  },
  tableAdd:function(name,str){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {
              alert(name)
              var sql="ALTER TABLE ? ADD ?".fill([name,str]);
              alert(sql)
              tx.executeSql(sql,[],function(a){
                  resolve(true)
              },function(a,e){
                  alert(e.message)
                  reject("error: tableAdd:\n"+e.message)
              });
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
      var json=[json];
      //alert(keys)
      //alert(values)
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              //tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              //tx.executeSql('INSERT INTO '+name+' ('+keys.join(",")+') VALUES (?,?)',values);
              var sql="INSERT INTO ? (?) VALUES (?)".fill([name,keys.join(","),values.join(",")]);
              alert(sql)
              tx.executeSql(sql,[],function(a){
                alert(true)
              },function(a,b){
                alert(b.message)
              });
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
                  //var msg = "<p>查询记录条数: " + len + "</p>";
                  var re=[];
                   for (i = 0; i < len; i++){
                       re.push(results.rows.item(i));
                        //msg+= "<p><b>" + results.rows.item(i).log + "</b></p>";
                   }
                   resolve(re);
              }, null);
          });
      });
  },
  update:function(name,str1,str2){
      var t=this;
      return new Promise(function(resolve,reject){
          t.db.transaction(function (tx) {  
              //tx.executeSql("CREATE TABLE IF NOT EXISTS "+name+" ("+arr.join(",")+")");
              tx.executeSql('UPDATE '+name+' SET '+str1+' WHERE '+str2);
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


database.createTable("store",["id unique","log"])
.then(function(a){
    database.tableAdd("store","test1")
    return database.select("store")
})
.then(function(a){
    alert(JSON.stringify(a))
    return database.insert("store",{"id":0,"log":"\"test\""});
}).then(function(a){
    return database.select("store")
}).then(function(a){
    alert(JSON.stringify(a,null,4))
    return database.update("store","log=\"test2\"","id=0");
}).then(function(a){
    return database.select("store")
}).then(function(a){
    alert(JSON.stringify(a))
    return database.delete("store","id=0")
})
.catch(function(a){
    alert("err:\n"+a)
})

String.prototype.fill=function(arr){
    var str=this
    for(var i=0;i<arr.length;i++){
        str=str.replace("?",arr[i]);
    }
    return str;
}