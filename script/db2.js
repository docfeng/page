(async function(){
    class _db{
        constructor(){
        }
        async open_db(db_name){
            this.db_name=db_name;
            if (!window.indexedDB) {
                window.alert("你的浏览器不支持IndexDB,请更换浏览器");
            }
            var request = indexedDB.open(db_name);
            var t=this;
            return new Promise((resolve)=>{
                var status="";
                //打开数据失败
                request.onerror = function(event) { 
                    alert("不能打开数据库,错误代码: " + event.target.errorCode);
                    resolve(false);
                };
                //打开数据库
                request.onsuccess = function(event) {
                    //此处采用异步通知. 在使用curd的时候请通过事件触发
                    t.db = this.result;
                    if(status){
                    resolve("create");
                    }
                        resolve("open");
                };
                request.onupgradeneeded=function(a){
                    status=true;
                    var db = this.result; 
                    if(!db.objectStoreNames.contains("test")){
                        var store=db.createObjectStore("test",{keyPath: "name"});
                        store.createIndex("name", "name", {unique: true});
                        store.createIndex("val", "val");
                         //store.put({name: "Quarry Memories", val: "Fred", isbn: 123456});
                         //store.put({name: "Water Buffaloes", val: "Fred", isbn: 234567});
                        // store.put({name: "Bedrock Nights", val: "Barney", isbn: 345678});
                     }
                }
            });
        }
        async delete_db(){
            var request=indexedDB.deleteDatabase(this.db_name);
            return new Promise((resolve)=>{
                //打开数据失败
                request.onerror = function(event) { 
                    alert("不能打开数据库,错误代码: " + event.target.errorCode);
                    resolve(false);
                };
                //打开数据库
                request.onsuccess = function(event) {
                    resolve(true);
                };
            });
        }
        async close_db(){
             this.db.close();
             return true;
        }
        async create_db(store_name,json){
            
        }
        select_store(store_name){
            this.store_name=store_name;
            if(this.db.objectStoreNames.contains(store_name)){
              this.store=this.db.transaction(this.store_name,"readwrite").objectStore(this.store_name);
              return true;
            }else{
                 return false;
            }
        }   
        async clear_store(){
            var request = this.db.transaction(this.store_name,"readwrite").objectStore(this.store_name).clear();
            request.onsuccess = function(){
                alert('清除成功');
            }
        }
        delete_store(){
            var request = this.db.deleteObjectStore(dbObject.db_store_name);
            request.onsuccess = function(){
                alert('删除表成功');
            }
        }
        /**
             * 增加和编辑操作 
        */
        async add(json,key){
        //此处须显式声明事物
            var transaction = this.db.transaction(this.store_name, "readwrite");
            var store = transaction.objectStore(this.store_name);
            var request = store.add(json,key);
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(true);
                };
                request.onerror = function(event){
                    resolve(false);
                }
            });
        }
        async put(json,key){
            var store =this.store;
            if(key){
                var request = store.put(json,key);
            }else{
                var request = store.put(json);
            };
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(true);
                };
                request.onerror = function(event){
                    resolve(false);
                }
            });
        }
        /**
         * 删除数据:key
         */
      async delete(key){
            var request = this.store.delete(key);
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(true);
                };
                request.onerror = function(event){
                    resolve(false);
                }
            });
        }
 
        /**
         * 查询操作 
         */
        async count(){
            var request = this.store.count();
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(this.result);
                };
                request.onerror = function(event){
                    resolve(-1);
                }
            });
        }
        async getkey(key){//return json;
            var store = this.store;
            if(key){
                var request = store.get(key);
            }else{
                var request = store.getAll();
            }
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(request.result);
                };
                request.onerror = function(event){
                    resolve(false);
                }
            });
        }
        async getindex(json){//{name:888}
            var store = this.store;
            if(json){
                for(var key in json){
                    var index = store.index(key);
                    var request = index.getAllKeys(json[key]);
                }
            }else{
                var request = store.getAll();
            }
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                        resolve(this.result);
                };
                request.onerror = function(event){
                    resolve(false);
                }
            });
        }
        async getcursor(json){
            var store = this.store;
            if(json){
                for(var key in json){
                    var index = store.index(key);
                    var request = index.openCursor(IDBKeyRange.only(json[key]));
                }
            }else{
                var request = store.getAll();//getAllKeys
            }
            return new Promise((resolve)=>{
                var re=[];
                request.onsuccess = function () {
                    var cursor = request.result;
                    if(cursor) {
   //alert(cursor.primaryKey)//key
//cursor.delete();
//request = cursor.update(updateData);
                        re[re.length]=cursor.value;
                        cursor.continue();
                   }else{
                       resolve(re);
                   }
                }
               request.onerror = function(event){
                    resolve(event);
               }
            });
        }
        async delete_cursor(json){
            var store = this.store;
            if(json){
                for(var key in json){
                    var index = store.index(key);
                    var request = index.openCursor(IDBKeyRange.only(json[key]));
                }
            }else{
                var request = store.getAll();//getAllKeys
            }
            return new Promise((resolve)=>{
                const i=0;
                request.onsuccess = function () {
                    var cursor = request.result;
                    if(cursor) {
                        const request=cursor.delete();
                        request.onsuccess = function() {
                           // i++;
                        };//alert(++i)
                        cursor.continue();
                   }else{
                       resolve(i);
                   }
                }
               request.onerror = function(event){
                    resolve(event);
               }
            });
        }
    }
    var db1=new _db();
    if(await db1.open_db("test1")){
        db1.select_store("test");
        //alert(db1.store)
        await db1.put({name:777,value:999});
        await db1.put({name:777,val:9990});
       await db1.put({name:980,value:999});
await db1.put({name:77776,val:9990});
      await db1.delete_cursor({name:777});
      //alert(await db1.delete(777))
       //alert(await db1.count())
        //alert("getkeyall"+JSON.stringify(await db1.getkey()))
       //alert("getindex"+JSON.stringify(await db1.getindex({name:777})))
       alert("getindex"+JSON.stringify(await db1.getcursor({val:9990})))
       //alert("getkey"+JSON.stringify(await db1.getkey(777)))
        await db1.close_db()
       alert(await db1.delete_db())
       //alert("r444")
    }






    var dbObject = {}; 
    dbObject.init = function(params,fun){
        this.fun=fun;
        this.db_name = params.db_name;
        this.db_version = params.db_version;
        this.db_store_name = params.db_store_name;
        if (!window.indexedDB) 
        {
            window.alert("你的浏览器不支持IndexDB,请更换浏览器");
        }
 
        var request = indexedDB.open(this.db_name,this.db_version);
        //打开数据失败
        request.onerror = function(event) 
        { 
            alert("不能打开数据库,错误代码: " + event.target.errorCode);
        };
        request.onupgradeneeded = function(event) 
        {
            this.db = event.target.result; 
          //  if(!this.db.objectStoreNames.contains(dbObject.db_store_name)){
                var store=this.db.createObjectStore(dbObject.db_store_name,{keyPath: "name"});
                var nameIndex = store.createIndex("name", "name", {unique: true});
                var valIndex = store.createIndex("val", "val");
                //store.put({name: "Quarry Memories", val: "Fred", isbn: 123456});
                //store.put({name: "Water Buffaloes", val: "Fred", isbn: 234567});
                //store.put({name: "Bedrock Nights", val: "Barney", isbn: 345678});
          //  }
         alert(this.db)
        };
        //打开数据库
        request.onsuccess = function(event) 
        {
            //此处采用异步通知. 在使用curd的时候请通过事件触发
            dbObject.db = event.target.result;
            if(dbObject.fun){dbObject.fun();}
        };
    };
    /**
     * 增加和编辑操作 
     */
    dbObject.add = function(json)
    {
        //此处须显式声明事物
        var transaction = dbObject.db.transaction(dbObject.db_store_name, "readwrite");
        var store = transaction.objectStore(dbObject.db_store_name);
        var request = store.add(json.data,json.key);
        request.onsuccess = function(){
            json.success('添加成功');
        };
        request.onerror = function(event){
            json.error(event);
        }
    };
    dbObject.put = function(json)
    {
        //此处须显式声明事物
        var transaction = dbObject.db.transaction(dbObject.db_store_name, "readwrite");
        var store = transaction.objectStore(dbObject.db_store_name);
        if(json.key){
              var request = store.put(json.data,json.key);
        }else{
              var request = store.put(json.data);
        }
        request.onsuccess = function(){
            json.success('添加成功');
        };
        request.onerror = function(event){
            json.error(event);
        }
    };
    /**
     * 删除数据 
     */
    dbObject.delete = function(id)
    {
        // dbObject.db.transaction.objectStore is not a function
        request = dbObject.db.transaction(dbObject.db_store_name, "readwrite").objectStore(dbObject.db_store_name).delete(id);
        request.onsuccess = function(){
            alert('删除成功');
        }
        request.onerror = function(event){
            alert("未删除");
        }
    };
 
    /**
     * 查询操作 
     */
    dbObject.getkey = function(json)
    {
        //第二个参数可以省略
        var transaction = dbObject.db.transaction(dbObject.db_store_name,"readwrite");
        var store = transaction.objectStore(dbObject.db_store_name);
        if(json&&json.key){
            var request = store.get(json.key);
        }else{
            var request = store.getAll();
        }
        request.onsuccess = function () {
            json.success(request.result);
        }
        request.onerror = function(event){
            json.error(event);
        }
    };
    dbObject.getindex = function(json)
    {
        //第二个参数可以省略
        var transaction = dbObject.db.transaction(dbObject.db_store_name,"readwrite");
        var store = transaction.objectStore(dbObject.db_store_name);
        if(json&&json.data&&json.data.name){
            var index = store.index(json.data.name);
            var request = index.get(json.data.value);
        }else{
            var request = store.getAll();
        }
        request.onsuccess = function (eval) {
           if(this.result){
                json.success(this.result)
           }else{
                json.error("");
          }
        }
        request.onerror = function(event){
            json.error("");
        }
    };
    dbObject.getcursor = function(json)
    {
        //第二个参数可以省略
        var transaction = dbObject.db.transaction(dbObject.db_store_name,"readwrite");
        var store = transaction.objectStore(dbObject.db_store_name);
        if(json){
            var index = store.index(json.name);
            var request = index.openCursor(IDBKeyRange.only(json.value));
        }else{
            var request = store.getAll();
        }
        request.onsuccess = function () {
            var cursor = request.result;
            if (cursor) {
                // Called for each matching record.
                //console.log(cursor.value.isbn, cursor.value.title, cursor.value.author);
                json.success(cursor.value);
                cursor.continue();
            } else {
                // No more matching records.
                json.error(false);
                console.log(null);
            }
        }
        request.onerror = function(event){
            json.error(event);
        }
    };
    /**
     * 清除整个对象存储(表)
     */
    dbObject.clear = function()
    {
        var request = dbObject.db.transaction(dbObject.db_store_name,"readwrite").objectStore(dbObject.db_store_name).clear();
        request.onsuccess = function(){
            alert('清除成功');
        }
    }; 
    /**
     * 删除整表;
     */
    dbObject.delstore = function()
    {
        var request = dbObject.db.deleteObjectStore(dbObject.db_store_name);
        request.onsuccess = function(){
            alert('删除表成功');
        }
    }; 
    /**
     * 删除数据库
     */
    dbObject.deldb = function()
    {
        var request = Window.indexedDB.deleteDatabase(dbObject.db_name);
        request.onsuccess = function(){
            alert('清除成功');
        }
    }; 
    window.dbObject = dbObject;
})();