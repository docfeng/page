alert()
(function(){
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
alert()


