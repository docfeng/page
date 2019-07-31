fj = (function() {
	if (!document.querySelector("#msg_box")) {
		/* var style = document.createElement("style");
		style.id = "msg_box"
		style.type = "text/css";
		style.innerHTML =``;
		document.getElementsByTagName("HEAD").item(0).appendChild(style); */
	}
	var createBox = function(code, fun, cancelFun) {
		var win = document.createElement("div");
		win.classList.add("alert_box");
		win.style.display = "block";
		document.body.appendChild(win);
		let s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			win = null;
			cancelFun && cancelFun();
			return true;
		});
		win.innerHTML = code;
		fun && fun(win, s);
	}
	var obj = [];
	var createWin = function() {
		var obj = {};
		var win = document.createElement("div");
		var box = document.createElement("div");
		var header = document.createElement("div");
		var section = document.createElement("div")
		var footer = document.createElement("div");
		var certain = document.createElement("input");
		var cancel = document.createElement("input");

		win.classList.add("setting_m_box");
		box.classList.add("setting_box");
		header.classList.add("setting_header_box");
		section.classList.add("setting_body_box");
		footer.classList.add("setting_footer_box");

		certain.type = "button";
		cancel.type = "button";
		certain.value = "确定";
		cancel.value = "取消";

		box.addEventListener("click", function(e) {
			var event = e || window.event;
			event.stopPropagation();
		}, false);

		let s = evt.addEvent(function(a) {
			document.body.removeChild(win);
			obj.cancel();
			obj = null;
			win = null;
			return true;
		});

		certain.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.certain()
			obj = null;
		}

		cancel.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		}

		win.onclick = function(a) {
			evt.removeEvent(s);
			document.body.removeChild(win);
			win = null;
			obj.cancel();
			obj = null;
		};
		footer.append(cancel, certain);
		box.append(header, section, footer);
		win.appendChild(box);
		win.style.display = "block";
		//alert(name)
		document.body.appendChild(win);

		obj.win = win;
		obj.section = section;
		obj.header = header;

		box = null;
		section = null;
		header = null;
		footer = null;
		certain = null;
		cancel = null;

		return obj;
	}


	var $ = {}
	$.createBox = createBox;
	$.createWin = async function(name, html, fun) {
		var code =
			`
          <div class="setting_box" onclick="window.event.stopPropagation();">
              <div class="setting_header_box">${name}</div>
              <div class="setting_body_box">
                  ${html}
              </div>
              <div class="setting_footer_box">
                  <input type="button" value="确定" id="certain" />
                  <input type="button" value="取消" id="cancel" />
              <div>
          </div>
              `;
		var iniFun = function(obj, s) {
			obj.onclick = obj.querySelector("#cancel").onclick = function() {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				obj = null;
				fun.cancel()
			}
			obj.querySelector("#certain").onclick = function(a) {
				evt.removeEvent(s);
				obj.parentNode.removeChild(obj);
				obj = null;
				fun.certain();
			}
			fun.ini(obj)
		}
		var cancelFun = function() {
			fun.cancel();
		}
		$.createBox(code, iniFun, cancelFun);
	}

	$.iframe = function(url) {
		var win = document.createElement("div");
		var iframe = document.createElement("iframe");

		win.classList.add("setting_m_box");
		//iframe.classList.add("setting_box");
		iframe.style = "width:100%;height:100%;background:white;"
		iframe.src = url;
		let s = evt.addEvent(function(a) {
			win.removeChild(iframe);
			//exitScreen()
			document.body.removeChild(win);
			iframe = null;
			win = null;
			return true;
		});

		win.appendChild(iframe);
		win.style.display = "block";
		document.body.appendChild(win);
		fullScreen(win);
	}
	$.iframe = function(url) {
		var code = `<iframe style="width:100%;height:100%;background:white;" url="${url}"></iframe>`
		var iniFun = function(obj) {
			obj.querySelector("iframe").contentWindow.location.href = url;
			fullScreen(obj);
		}
		this.createBox(code, iniFun);
	}
	$.select = async function(name, data, index) {
		var obj = createWin()
		var section = obj.section;
		var win = obj.win;
		var re = index ? data[index] : data[0];
		var d = document.createElement("div");
		d.classList.add("select_box");
		obj.header.innerHTML = name;
		d.onclick = function(e) {
			var ele = e.srcElement;
			if (ele == d) return;
			re = ele.innerHTML;
		}
		for (var i = 0; i < data.length; i++) {
			var a = data[i];
			var s = document.createElement("div")
			s.innerHTML = a;
			d.appendChild(s);
		}
		section.appendChild(d);

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}
	/**
	 * @param {String} name
	 * @param {Array} data
	 * @param {Number} index
	 */
	$.select = function(name, data, index) {
		return new Promise(function(resolve) {
			var re = index ? data[index] : data[0];
			var html = ""
			for (var i = 0; i < data.length; i++) {
				var a = data[i];
				html += `<div>${a}</div>`;
			}
			var code = `<div class="select_box" id="select1">${html}</div>`;
			var fun = {};
			fun.cancel = function() {
				resolve(false);
			}
			fun.certain = function() {
				resolve(re);
			}
			fun.ini = function(obj) {
				obj.querySelector("#select1").onclick = function(e) {
					var ele = e.srcElement;
					if (ele == this) return;
					re = ele.innerHTML;
					ele.classList.toggle("select_item_selected");
				}
			}
			$.createWin(name, code, fun);
		});
	}
	/**
	 * @param {String} title
	 * @param {Array} arr
	 */
	$.input = async function(title,arr) {
		var re = {};
		var obj = createWin()
		var section = obj.section;
		var header=obj.header;
		header.innerHTML=title||"";
		var win = obj.win;
		for (var i = 0; i < arr.length; i++) {
			let a = arr[i];
			let name = a[0];
			let data = a[1];
			let value = "";
			let dataList = ""; //a[2];
			if (data) {
				if (data instanceof Array) {
					if (a[2] && typeof a[2] == "number") {
						value = data[a[2]];
					} else {
						value = data[0];
					}
					dataList = data;
				} else {
					value = data;
				}
			}
			var d = document.createElement("div")
			d.innerHTML = name;
			re[name] = value || "";
			let text = document.createElement("input");
			text.type = "text";
			text.value = value || "";
			text.oninput = function(e) {
				re[name] = text.value;
			}
			d.appendChild(text);
			if (dataList) {
				let s = document.createElement("input");
				s.type = "button";
				s.value = "选择";
				s.onclick = async function(e) {
					var r = await $.select(name, dataList, 0);
					//alert(r)
					text.value = r;
					re[name] = r;
				}
				d.appendChild(s);
			}
			section.appendChild(d);
		}

		return new Promise(function(resolve) {
			obj.certain = function(a) {
				resolve(re);
			}

			obj.cancel = function(a) {
				resolve(false);
			}
		});
	}

	$.addBottomEvent = (function() {
		var fun;
		var Y = 0;
		var Y2 = 0;
		var time;
		var u = {
			//切换事件
			handleEvent: function(e) {
				switch (e.type) {
					case "touchstart":
						this.start(e);
						break;
					case "touchmove":
						this.move(e);
						break;
					case "touchend":
						this.end(e);
						break;
					case "webkitTransitionEnd":
					case "msTransitionEnd":
					case "oTransitionEnd":
					case "otransitionend":
					case "transitionend":
						this.transitionEnd(e);
				}
				e.stopPropagation && e.stopPropagation();
			},
			start: function(e) {
				var o = e.touches[0];
				var y = o.pageY;
				var h = window.innerHeight;
				if (h - y < 20) {
					time = new Date();
					Y = Y2 = y;
					document.addEventListener("touchmove", this, !1),
						document.addEventListener("touchend", this, !1)
				}
			},
			move: function(e) {
				var o = e.touches[0];
				Y2 = o.pageY;
				if (!(e.touches.length > 1)) {
					e.disableScroll && e.preventDefault();
					//var o = e.touches[0];
				}
			},
			end: function(e) {
				var o = e.touches[0];
				var t = new Date - time;
				if (t < 500 && (Y - Y2) > 60 && fun) {
					fun(e)
				}
				Y = 0;
				Y2 = 0;
				document.removeEventListener("touchmove", this, !1);
				document.removeEventListener("touchend", this, !1);
			}
		};
		document.addEventListener("touchstart", u, !1);
		return function(f) {
			fun = f;
		}
	})()
	
	var timeout1;
	$.tip=function(str,time,bool,fun){
			var time = time ? 1000* time: 1000;
		    var m=document.querySelector("body");
			if(timeout1)window.clearTimeout(timeout1);
		    m.classList.remove("msg-on");
		    var msg = document.querySelector("#msg-cnt");
			if(!msg){
				var msg = document.createElement("div");
				msg.classList.add("msg-cnt");
				msg.id="msg-cnt";
				document.body.appendChild(msg);
			}
		    //index ? i.attr("class", "msg-cnt msg-type-" + index) : 
			msg.classList.add("msg-cnt");
		    msg.innerHTML="<span>" + str + "</span>";//.off("animationend"),
		    m.classList.add("msg-on");
		    var fun = fun;
		    timeout1=window.setTimeout(function() {
		        m.classList.remove("msg-on"),
		        fun && fun()
		    },
		    time)
	}
	return $;
})()

var tt=function(){
	fj.input("login",[["name","docfeng"],["psw"],["author"]]).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.select("test",["test1","test2","test3"],2).then(function(a){
		alert(JSON.stringify(a))
	})
	fj.tip("test",3)
}

