
Search=(function(a){
	var _Search=Book.Search;
	var Arr,Json;
	var Search ={
		multi: function(name) {
			return _Search.multi(name);
		},
		remote: function(name) {
			return _Search.remote(name);
		},
		read: function(name) {
			return _Search.read(name);
		},
		write: function(name, arr) {
			return _Search.write(name, arr);
		},
		show: function(arr) {
			var txt=this.formatUI(arr);
			f6_table.innerHTML = txt;
			//document.querySelector("#txt").innerHTML = txt;
		},
		formatUI: function(arr) {
			var txt = ""
			for (var i = 0; i < arr.length; i++) {
				txt += "<tr><td><h4>" + arr[i][0] + "</h4><h3>" + arr[i][1] + "</h3></td></tr>";
			}
			return txt;
		},
		search:function(name){
			var t=this;
			fj.tip("开始获取数据")
			Search.multi(name).then(function(re){
				//alert(re)
				fj.tip("已获取数据<br ><pre>"+re+"</pre>",3)
				//alert(JSON.stringify(re,null,4));
				t.arr=re;
				t.name=name;
				Search.write(name,re)
				Search.show(re);
			}).catch(function(e){
				alert("Search.search:\n"+e)
			})
		},
		update:function(name){
			var t=this;
			fj.tip("开始更新数据")
			Search.remote(name).then(function(re){
				fj.tip("已获取数据<br ><pre>"+JSON.stringify(re,null,4)+"</pre>",3)
				alert(JSON.stringify(re,null,4))
				t.arr=re;
				Search.write(name,re)
				Search.show(re);
			}).catch(function(e){
				alert("search.update:\nname"+name+"\nerr:"+e)
			})
		},
		click: function(obj){
		    var obj=obj.parentNode;
		    var i=obj.parentNode.rowIndex;
			if(!i||!this.name||!this.arr){
				alert("search.click参数错误：\ni=%s;\nname=%s;\narr=%s".fill([i,this.name,this.arr]));
			}
		    var name=this.name;
		    var arr=this.arr[i];
		    var url=arr[0];
			fj.tip("开始获取目录数据")
			//显示目录页
			_Search.getRealPath(url).then(function(re){
				fj.tip("已获取目录数据，开始显示",1)
				var url=re[0];
				var arr=re[1];
				List.show(name,url,arr);
				Shelf.add(name,url,arr).then(function(re){
					fj.tip("添加书本成功",2)
				}).catch(function(e){
					fj.tip("添加书本失败",2)
				})
				//UI.showList()
				List.write(name,arr);
				alert("name="+name+"\nurl="+url+"\narr:"+JSON.stringify(arr,null,4))
				window.history.go(-1);	
			}).catch(function(e){
				alert("search.click:err:\n"+e)
			});
			
		    //f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
		}
	}
	return Search;
})();


