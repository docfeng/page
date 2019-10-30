Page = (function(a) {
	var _Page = Book.Page;
	var Arr, Json;
	var Page = {
		multi: function(name, url) {
			return _Page.multi(name, url);
		},
		multiIndex: function(i) {
			var name = this.name;
			var arr = this.arr;
			if(!name||!arr||!i){
				alert("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr+"\ni:"+i)
				return Promise.reject("Page.multiIndex参数错误：\nname:"+name+"\narr:"+arr+"\ni:"+i);
			}
			if(i>arr.length-1||i<0){
				return Promise.reject("Page.multiIndex参数i超出范围：\nname:"+name+"\ni:"+i);
			}
			var title = arr[i][1];
			var url = arr[i][0];
			return _Page.multi(name, url).then(function(txt) {
				
				Page.write(name, title, url, txt).then(function(re) {
					//alert(re)
				}).catch(function(e) {
					alert("err:Page.write:\n" + e)
				});
				return txt;
			})
		},
		remote: function(url) {
			return _Page.remote(url);
		},
		read: function(name, url) {
			return _Page.read(name, url);
		},
		write: function(name, title, url, txt) {
			return _Page.write(name, title, url, txt);
		},
		show: function(txt) {
			var txt = this.formatUI(txt);
			//document.querySelector("#txt").innerHTML = txt;
		},
		formatUI: function(txt) {
			var txt = "<p>" + txt.replace(/\n/g, '</p>\n<p>') + "</p>"
			//document.querySelector("#txt").innerHTML = txt;
			return txt;
		},
		clear: function() {
			DB.Table.clear('book', 'page').then(function(a) {
				alert('清除page数据表\n成功')
			}).catch(function() {
				alert('清除page数据表\n失败')
			})
		},
		showList: function(name, arr) {
			var arr = arr || this.arr;
			var name = name || this.name;
			if (!name || !arr) {
				alert("err:Page.showList\n参数错误;\nname:" + name + "\narr:" + arr)
				return "err:Page.showList\n参数错误";
			}

			var config = {
				"height": (document.body.clientHeight - 8) + "px",
				"width": "60%",
				"left": "0px",
				"top": "0px"
			}
			var url_arr = arr;
			var str = "";
			var err = [];
			for (var i = 0; i < url_arr.length; i++) {
				if (!url_arr[i] || !url_arr[i][1]) {
					err[err.length] = i + ":" + url_arr[i];
				} else {
					var d = "<h4>" + url_arr[i][1] + "</h4>";
					d += "<h5>" + url_arr[i][0] + "</h5>";
					//h+="<td>"+d+"</td>";
					str += "<tr><td>" + d + "</td></tr>";
				}
			}

			//str ='<div style="height:580px;overflow-x:hidden;overflow-y:scroll;"><table style="width:100%;height:100%" onclick="Page.closeList(event.srcElement)">' +
			//	str + "</table></div>";
			str='' +
				str + "";
			//msg(name, str, config);
			document.querySelector("#listName2").innerHTML=name;
			var table1=document.querySelector("#list_table2")
			table1.innerHTML=str;
			document.querySelector("#listDiv2").style.display="flex";
			//目录滚动到第i个
			var i = this.index1||this.json.readIndex;
			var o = table1.rows[i]
			if(!o){
				alert("index1"+this.index1)
				return "";
			}
			var h=o.offsetTop;
			table1.parentNode.scrollTop = h;
		},
		//关闭目录,显示文章
		closeList: function(obj) {
			var obj = obj.parentNode;
			var i = obj.parentNode.rowIndex;
			window.page(i);
			/* $(".msg").css("display", "none");
			looseBody(); */
		}
	}
	return Page;
})();
