store = {
	create: function() {
		var data = {
			key: "name",
			index: {
				name: true,
				val: false
			}
		};
		return DB.Table.create("store", "store", data).then(function(json) {
			DB.DB.close();
			return true;
		}).catch(function(e) {
			DB.DB.close();
			return Promise.reject(false);;
		});
	},
	setItem: function(name, value) {
		var json = {
			"name": name,
			"val": value
		};
		return DB.Data.put("store", "store", json).catch(function(e) {
			return store.create().then(function() {
				return DB.Data.put("store", "store", json)
			})
		}).then(function(foo1) {
			DB.DB.close();
			return true;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	},
	getItem: function(name) {
		return DB.Data.getKey("store", "store", name).catch(function(e) {
			return store.create().then(function() {
				return DB.Data.getKey("store", "store", name);
			})
		}).then(function(json){
			DB.DB.close();
			return json.val;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	},
	clear: function() {
		return DB.Table.clear("store", "store").catch(function(e) {
			return store.create().then(function() {
				return DB.Table.clear("store", "store")
			})
		}).then(function(json) {
			DB.DB.close();
			return json.val;
		}).catch(function(e) {
			DB.DB.close();
			return false;
		});
	}
}
