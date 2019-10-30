
Shelf=(function(a){
	var _Shelf=Book.Shelf;
	var Arr,Json;
	var Shelf = {
		get:function(name){
			return _Shelf.get(name);
		},
		getAll:function(){
			return _Shelf.getAll();
		},
		read:function(name) {
			return _Shelf.read(name) ;
		},
		readAll:function() {
			if(this.arr){
				return Promise.resolve(this.arr);
			}else{
				return _Shelf.readAll().then(function(arr){
					Shelf.arr=arr;
					return arr;
				});
			}
		},
		write:function(json) {
			return _Shelf.write(json) ;
		},
		writeAll:function(arr) {
			return _Shelf.writeAll(arr) ;
		},
		put:function(json) {
			return _Shelf.put(json) ;
		},
		putAll:function(arr) {
			return _Shelf.putAll(arr) ;
		},
		add: function(name, url, arr) {
			var t = this;
			var json = this.arr;
			var json1 = {};
			var num = -1;
			for (var i = 0; i < json.length; i++) {
				if (json[i].name == name) {
					num = i;
				}
			}
			if (num == -1) {
				json1 = {
					name: name,
					url: url,
					creatAt: formatDate(new Date()),
					readIndex: 0,
					readTitle: arr[0][1],
					readAt: formatDate(new Date()),
					readURL: arr[0][0],
					updateIndex: arr.length - 1,
					updateTitle: arr[arr.length - 1][1],
					updateAt: formatDate(new Date()),
					updateURL: arr[arr.length - 1][0]
				}
			} else {
				json1 = json.splice(num, 1)[0]; //json[num];
				json1.url = url;
				json1.updateIndex = arr.length - 1,
					json1.updateTitle = arr[arr.length - 1][1],
					json1.updateAt = formatDate(new Date()),
					json1.updateURL = arr[arr.length - 1][0];
				//this.show({index:num})
			}
			json.unshift(json1);
			this.showAll()
			return this.write(json1);
		},
		delete: function(i) {
			var name = this.arr[i].name;
			if (confirm("是否删除:" + i + name)) {
				_Shelf.delete(name).then(function(){
					Shelf.arr.splice(i,1);
					var obj=shelf_table.rows[i];
					obj.parentNode.removeChild(obj)
				});
			}
		},
		formatUI:function(json) {
			var span1="";
			var span2="";
			if(new Date(json.readAt)<new Date(json.updateAt)){
				span2="<span class='update'>更新:</span>";
			}
			if(json.readIndex<json.updateIndex){
				span1="<span class='alert'>未读:</span>";
			}
			var d ="<h1>%s</h1>\
			    <h2>已读:%s</h2>\
			    <h3>%s</h3>\
			    <h4>%s%s%s</h4>\
			    <h3>%s</h3>\
			    <h6>%s</h6>".fill([json.name,
				json.readTitle,
				json.readAt,
				span1,
				span2,
				json.updateTitle,
				json.updateAt,
				json.url]);
			var str = "<tr><td>" + d + "</td></tr>";
			return str;	
		},
		ini:function(){
			return _Shelf.ini();
		},
		show:function(i) {
			this.readAll().then(function(arr){
				var json=arr[i];
				arr.splice(i,1);
				arr.unshift(json);
				var str =Shelf.formatUI(json);
				//alert(str)
				//var str=shelf_table.rows[i].innerHTML
				for(;i>0;i--){
					shelf_table.rows[i].innerHTML=shelf_table.rows[i-1].innerHTML
				}
				shelf_table.rows[0].innerHTML = str;
			});
		},
		showAll:function() {
			this.readAll().then(function(arr){
				Shelf.arr=arr;
				var str="";
				for (var i=0;i<arr.length;i++) {
					str+=Shelf.formatUI(arr[i],i)
				}
				if (shelf_table) {
					shelf_table.innerHTML = str;
				}
			}).catch(function(e){
				alert("Shelf.showAll:\n"+e)
			});
		},
		checkChange:function(){
			var arr1,arr2;
			var t=this;
			this.getAll().then(function(arr){
				arr1=arr;
				return t.readAll();
			}).then(function(arr){
				arr2=arr;
				for (var i = 0; i < arr1.length; i++) {
					for (var i = 0; i < arr1.length; i++) {
						
					}
				}
			});
		},
		moveData:function() {
			var t=this;
			var arr1,arr2;
			var re=[];
			DB.Table.has("book","shelf").catch(function(e){
				alert(e)
				return t.ini();
			}).then(function(){
				return Git.File.get("docfeng","page", "novel/data/Shelf.json").then(function(text){
					var p=[];
					arr1 = JSON.parse(text);
					return t.readAll();
				}).then(function(arr){
					arr2=arr;
				}).then(function(){
					var err=[]
					for(var i=0;i<arr1.length;i++){
						for(var i2=0;i2<arr2.length;i2++){
							if(arr1[i]&&arr1[i].name){
								if(arr2[i2]&&arr2[i2].name){
									if(arr1[i].name==arr2[i2].name){
										if(new Date(arr1[i].updateAt)>new Date(arr2[i2].updateAt)){
											re.push(arr1[i]);
										}else{
											re.push(arr2[i2]);
										}
										arr1.splice(i,1);
										arr2.splice(i2,1);
										i--;i2--;
									}
								}else{
									err.push(["i2",i2])
								}
							}else{
								err.push(["i",i])
							}
						} 
					} 
					re=re.concat(arr1,arr2)
					t.writeAll(re).then(function(e){
						alert(e)
					}).catch(function(e){
						alert(e)
					});;
				});
			}).then(function(){
				alert(true)
			}).catch(function(e){
				alert(e)
			});
		},
		upload: async function() {
			var json = await this.getAllIndexData("readAt");
			json = json.reverse();
			json = JSON.stringify(json, null, 4);
	
			await git.getFile("page", "novel/data/Shelf.json");
			var re = await git.createFile({
				owner: "docfeng",
				repos: "page",
				name: "novel/data/Shelf.json",
				txt: json
			});
			alert(re);
		},
		
		click:function(obj, order) {
			var order = order ||"click"
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex;
			if (order == "click") {
				UI.showList()
				Shelf.show(i);
				var json = this.arr[i];
				var name = json.name;
				var url = json.url;
				var readIndex=json.readIndex;
				//显示目录
				List.json=json;
				List.name=name;
				List.url=url;
				
				List.show(name, url, []);
				
				List.read(name).then(function(list_arr){
					if (!list_arr) {
						return List.remote(url).then(function(list_arr){
							List.write(name, list_arr);
							return list_arr;
						});
					}else{
						return list_arr;
					}
				}).then(function(list_arr){
					List.arr=list_arr;
					List.shelfIndex=i;
					List.listIndex=readIndex
					List.show(name, url, list_arr);
					List.scroll(readIndex); 
				});
			}
			if (order == "delete") {
				this.delete(i);
			}
		},
		
		updateTop10:function() {
			var arr = this.arr;
			if(!arr){
				alert("shelf 没有 arr数据");
				return false;
			}
			fj.tip("开始更新前10个");
			var p=[];
			for (var i = 0; i < 10; i++) {
				p.push(this.update(i));
			}
			Promise.all(p).then(function(re){
				alert(JSON.stringify(re,null,4))
			});
		},
		update:function(i) {
			var arr=this.arr;
			if(!arr){
				return Promise.resolve(i+"shelf 没有 arr数据");
			}
			var json = arr[i];
			if(!json){
				return Promise.resolve(i+"shelf 没有 json数据");
			}
			var url = json.url;
			var name = json.name;
			//Shelf.get(name).then(function(json){
			return List.remote(url).then(function(arr){
				var _arr=arr;
				if(!arr){
					return i+name+"List.remote 没有arr";
				}
				fj.tip("完成第"+i+"个；name="+name);
				if(json.updateIndex!=arr.length){
						//alert(JSON.stringify(arr))
						
						arr = arr[arr.length-1];
						json.updateTitle = arr[1];
						json.updateURL = arr[0];
						json.updateAt = formatDate(new Date());
						json.updateIndex = arr.length;
						Shelf.write(json);
						var str =Shelf.formatUI(json);
						shelf_table.rows[i].innerHTML=str;
						
						List.write(name,_arr)
						.then(function(re){
							fj.tip("List写入成功:"+name)
						}).catch(function(e){
							fj.tip("List写入失败:"+name+e)
						})
						
						return i+name+"更新完成";
				}else{
					return i+name+"没有更新";
				}
			}).catch(function(e){
				return i+"List.remote 错误\n\t"+e;
			});
		}
	}
	return Shelf;
})();
//