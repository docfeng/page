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
        names(){
            var names=this.db.objectStoreNames;
            var re=[];
            for(var i=0;i<names.length;i++){
                re[re.length]=names.item(i);
            }
            return re;
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
        async create_store(store_name,json){
            var version=this.db.version+1;
            this.db.close();
            var request = indexedDB.open(this.db_name,version);
            var t=this;
            return new Promise((resolve)=>{
                var status="";
                request.onerror = function(event) { 
                    alert("不能打开数据库,错误代码: " + event.target.errorCode);
                    resolve(false);
                };
                request.onsuccess = function(event) {
                    t.db = this.result;
                    if(status){
                         resolve("create");
                    }
                    resolve("open");
                };
                request.onupgradeneeded=function(a){
                    status=true;
                    var db = this.result; 
                    if(!db.objectStoreNames.contains(store_name)){
                        var store=db.createObjectStore(store_name,{keyPath: json.key});
                        if(json.index){
                            for(var key in json.index){
                                if(!store.indexNames.contains(key)){
                                    store.createIndex(key, key, {unique: json.index[key]});
                                }
                            }
                        }
                        if(json.value){
                            for(var i=0;i<json.value.length;i++){
                               store.put(json.value[i]);
                            }
                        }
                     }
                }
            });
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
            var request = this.store.clear();
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    alert('清除成功');
                }
            });
        }
        async delete_store(){
            var request = this.db.deleteObjectStore(this.store_name);
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(true);
                }
            });
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
        async getAll(){//return json;
            var store = this.store;
            var request = store.getAll();
            return new Promise((resolve)=>{
                request.onsuccess = function(){
                    resolve(request.result);
                };
                request.onerror = function(event){
                    resolve(false);
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
                    var request = index.getAll(json[key]);
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
       async getindexkeys(json){//{name:888}
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
       async update_cursor(json,fun){
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
                var i=0;
                request.onsuccess = function () {
                    var cursor = request.result;
                    if(cursor) {
                        var data=fun(cursor);
                        if(data){
                             const request = cursor.update(data);
                             i++;
                        }
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
                var i=0;
                request.onsuccess = function () {
                    var cursor = request.result;
                    if(cursor) {
                        const request=cursor.delete();
                        request.onsuccess = function() {
                           // i++;
                        };
                        ++i;
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
       // db1.select_store("test");
        //await db1.delete_store();
       alert(await db1.create_store("test3",{key:"name",index:{name:true,val:false}}));
        db1.select_store("test1");
        //alert(db1.store)
       alert(db1.names())
        await db1.put({name:777,value:999});
        await db1.put({name:777,val:9990});
        await db1.put({name:980,value:999});
        await db1.put({name:77776,val:9990});
        //alert(await db1.delete_cursor({name:777}));
       alert(await db1.update_cursor({name:777},function(cursor){
          if(cursor.value.val==9990){return {name:777,value:888};}
          return false;
        }));
        //alert(await db1.delete(777))
        //alert(await db1.count())
        //alert("getkeyall"+JSON.stringify(await db1.getkey()))
        alert("getindex"+JSON.stringify(await db1.getindex({name:777})))
        alert("getindex"+JSON.stringify(await db1.getcursor({val:9990})))
        //alert("getkey"+JSON.stringify(await db1.getkey(777)))
        await db1.close_db()
        alert(await db1.delete_db())
       //alert("r444")
    }
})();