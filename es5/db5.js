/**
 * es5
 * v1.0
 * 
 * DB{open,names,delete,close}
 * open_db(name)  打开数据库 return:false 失败;create新建;open 打开
 * open(name)  打开数据库 return:false 失败;create新建;open 打开
 * names(name) 获取数据库所以表名称;return array
 * delete(name) 删除数据库 return true false
 * close() 关闭数据库 return true;
 * 
 * Table{create,select,clear,delete}
 * create(db_name, store_name, json)创建数据表 name 名称 
 * 		json {key:"name",index:{name:true,val:false}}
 * 		return:false 失败;create新建;open 打开
 * select(db_name, store_name) 选择数据表 return true false;
 * clear(db_name, store_name) 清空数据表
 * delete(db_name, store_name) 删除数据表
 * 
 * Data{add,put,delet,count,getAll,getKey,getIndex,getIndexKeys}
 * add(db_name, store_name, json, key)修改key值
 * put(db_name, store_name, json, key?)添加修改key return true false
 * delete(db_name, store_name, key)删除key
 * count(db_name, store_name)记录数量
 * getAll(db_name, store_name)获取全部记录
 * getKey(db_name, store_name, key) return json
 * getIndex(db_name, store_name, index_name,index_value) 
 * getIndexKeys(db_name, store_name, index_name,index_value)
 * 
 * getcursor
 * update_cursor
 *       alert(await db1.update_cursor({name:777},function(cursor){
          if(cursor.value.val==9990){return {name:777,value:888};}
          return false;
        }));
 * 
 * delete_cursor
 * 
 */

DB = (function() {
	var P = function(request) {
		return new Promise(function(resolve, reject) {
			request.onsuccess = function() {
				resolve(request.result);
			};
			request.onerror = function(event) {
				reject(event);
			}
		});
	}
	var DB = {
		open_db: function(db_name) {
			this.db_name = db_name;
			if (!window.indexedDB) {
				window.alert("你的浏览器不支持IndexDB,请更换浏览器");
				return Promise.reject("你的浏览器不支持IndexDB,请更换浏览器");;
			}
			var request = indexedDB.open(db_name);
			var t = this;
			return new Promise(function(resolve, reject) {
				var status = false;
				//打开数据失败
				request.onerror = function(event) {
					alert("不能打开数据库,错误代码: " + event.target.errorCode);
					reject("不能打开数据库,错误代码: " + event.target.errorCode);
				};
				//打开数据库
				request.onsuccess = function(event) {
					//此处采用异步通知. 在使用curd的时候请通过事件触发
					var db=t.db = this.result;
					resolve(db)
					/* if (status) {
						resolve("create");
					} else {
						resolve("open");
					} */
				};
				request.onupgradeneeded = function(a) {
					status = true;
					/* var db = this.result;
					if (!db.objectStoreNames.contains("test")) {
						var store = db.createObjectStore("test", {
							keyPath: "name"
						});
						store.createIndex("name", "name", {
							unique: true
						});
						store.createIndex("val", "val");
						//store.put({name: "Quarry Memories", val: "Fred", isbn: 123456});
						//store.put({name: "Water Buffaloes", val: "Fred", isbn: 234567});
						// store.put({name: "Bedrock Nights", val: "Barney", isbn: 345678});
					} */
				}
			});
		},
		open: function(name) {
			return this.open_db(name).then(function(db) {
				return db;
			});
		},
		names: function(db_name) {
			return this.open(db_name).then(function(db) {
				var names = db.objectStoreNames;
				var re = [];
				for (var i = 0; i < names.length; i++) {
					re.push(names.item(i));
				}
				return re;
			});
		},
		delete: function(name) {
			var request = indexedDB.deleteDatabase(name);
			return new Promise(function(resolve, reject) {
				//删除数据失败
				request.onerror = function(event) {
					alert("不能删除数据库,错误代码: " + event.target.errorCode);
					reject(false);
				};
				//删除数据库
				request.onsuccess = function(event) {
					resolve(true);
				};
			});
		},
		close: function() {
			this.db.close();
			return true;
		},
	}
	var Table={
		create: function(db_name, store_name, json) {//json:{key:string,index:{name:bool,...}}
			return DB.open(db_name).then(function(db) {
				var version = db.version + 1;
				db.close();
				return version;
			}).then(function(version) {
				var request = indexedDB.open(db_name, version);
				return new Promise(function(resolve, reject) {
					var status = "";
					request.onerror = function(event) {
						reject("不能打开数据库,错误代码: " + event.target.errorCode);
					};
					request.onsuccess = function(event) {
						this.result.close();
						if (status) {
							resolve("create");
						}
						resolve("open");
					};
					request.onupgradeneeded = function(a) {
						status = true;
						var db = this.result;
						if (!db.objectStoreNames.contains(store_name)) {
							var store = db.createObjectStore(store_name, {
								keyPath: json.key
							});
							if (json.index) {
								for (var key in json.index) {
									if (!store.indexNames.contains(key)) {
										store.createIndex(key, key, {
											unique: json.index[key]
										});
									}
								}
							}
						}
					}
				});
			});
		},
		select: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				if (db.objectStoreNames.contains(store_name)) {
					var store = db.transaction(store_name, "readwrite").objectStore(store_name);
					return store;
				} else {
					return Promise.reject(false);
				}
			});
		},
		clear: function(db_name, store_name) {
			return this.select(db_name, store_name).then(function(store) {
				var request = store.clear();
				DB.close();
				return P(request);
			});
		},
		delete: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				var version = db.version + 1;
				db.close();
				return version;
			}).then(function(version) {
				var request = indexedDB.open(db_name, version);
				return new Promise(function(resolve, reject) {
					request.onupgradeneeded = function(a) {
						var db = this.result;
						var request = db.deleteObjectStore(store_name);
						this.result.close();
						resolve(true);
					}
				});
			});
		},
		has: function(db_name, store_name) {
			return DB.open(db_name).then(function(db) {
				if (db.objectStoreNames.contains(store_name)) {
					db.close();
					return true;
				} else {
					db.close();
					return Promise.reject(false);
				}
			});
		},
		
	}
	var Data={
		add: function(db_name, store_name, json, key) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.add(json, key);
				return P(request);
			});
		},
		put: function(db_name, store_name, json, key) {
			return Table.select(db_name, store_name).then(function(store) {
				if (key) {
					var request = store.put(json, key);
				} else {
					var request = store.put(json);
				};
				return P(request);
			});
		},
		delete: function(db_name, store_name, key) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.delete(key);
				return P(request);
			});
		},
		count: function(db_name, store_name) {
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.count();
				return P(request);
			});
		},
		getAll: function(db_name, store_name) { //return json;
			return Table.select(db_name, store_name).then(function(store) {
				var request = store.getAll();
				return P(request);
			});
		},
		getKey: function(db_name, store_name, key) { //return item=>json;
			return Table.select(db_name, store_name).then(function(store) {
				if (key) {
					var request = store.get(key);
				} else {
					var request = store.getAll();
				}
				return P(request);
			});
		},
		getIndex: function(db_name, store_name, index_name,index_value) { //return items=>array[{key:value}]
			return Table.select(db_name, store_name).then(function(store) {
				var index = store.index(index_name);
				var request = index.getAll(index_value);
				return P(request);
			});
		},
		getIndexKeys: function(db_name, store_name, index_name,index_value) { //return items=>array[key]
			return Table.select(db_name, store_name).then(function(store) {
				var index = store.index(index_name);
				var request = index.getAllKeys(index_value);
				return P(request);
			});
		},
	}
	
	var Cursor={
		get: function(db_name, store_name, json) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise((resolve) => {
					var re = [];
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							//alert(cursor.primaryKey)//key
							//cursor.delete();
							//request = cursor.update(updateData);
							re[re.length] = cursor.value;
							cursor.continue();
						} else {
							resolve(re);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		},
		update: function(db_name, store_name, json, fun) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise((resolve) => {
					var i = 0;
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							var data = fun(cursor);
							if (data) {
								const request = cursor.update(data);
								i++;
							}
							cursor.continue();
						} else {
							resolve(i);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		},
		delete: function(db_name, store_name, json) {
			return Table.select(db_name, store_name).then(function(store) {
				if (json) {
					for (var key in json) {
						var index = store.index(key);
						var request = index.openCursor(IDBKeyRange.only(json[key]));
					}
				} else {
					var request = store.getAll(); //getAllKeys
				}
				return new Promise((resolve) => {
					var i = 0;
					request.onsuccess = function() {
						var cursor = request.result;
						if (cursor) {
							const request = cursor.delete();
							request.onsuccess = function() {
								// i++;
							};
							++i;
							cursor.continue();
						} else {
							resolve(i);
						}
					}
					request.onerror = function(event) {
						resolve(event);
					}
				});
			});
		}
	}
	
	return {"DB":DB,"Data":Data,"Cursor":Cursor,"Table":Table};
})();

var tttttt = function() {
	DB.Data.getAll("store", "store").then(function(json) {
		alert(json)
		alert(JSON.stringify(json[3]))
		DB.close();
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getKey("store", "store", "Shelf/小额灵魂交易所/page11.txt").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.delete("store", "store", "Shelf/小额灵魂交易所/page11.txt").then(function(json) {
		alert(true)
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	var data={name:"ttt",val:"test"}
	DB.Data.put("store", "store", data).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getIndex("store", "store", "val","test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Data.getIndex("store", "store", "val",null).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.delete("store", "test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.clear("store", "test2").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.delete("store", "用户").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	var data={
		key:name,
		index:{name:true,id:true}
	}
	DB.Table.create("store", "test",data).then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	DB.Table.select("store", "test").then(function(json) {
		alert(json)
		alert(JSON.stringify(json))
		DB.DB.close();
		return true;
	}).catch(function(e) {
		alert(e)
		DB.DB.close();
	});
	 
}
