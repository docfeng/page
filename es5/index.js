window.onload = function() {
	if (browser.MyApp) chrome.computer();
	Shelf.showAll();
	
	addDownFlush(shelf_div, function(x) {
		//var re=parseInt(window.innerWidth/x);
		//alert(re)
		var re=window.innerWidth/x
		switch (true){
			case re>3:
			
				break;
			case re>3/2:
			alert(2)
				break;
			default:
			alert(3)
			UI.showSetting();
				break;
		}
	});
}

window.onresize = function() {}
//window.addeventlistener("resize",function(){alert()},false);
document.oncontextmenu = function() {
	event.returnValue = false;
	UI.show("#contextmenu");
}

addDownFlush = function(obj, fun) {
	var refreshText = obj.querySelector(".refreshText");
	var Y = 0;
	var M = 0;
	var X = 0;
	var isMobile=navigator.userAgent.indexOf("Mobile")>-1;
	var u = {
	    //切换事件
	    handleEvent: function(e) {
	        switch (e.type) {
			case "mousedown":
	        case "touchstart":
	            this.start(e);
	            //show("start");
	            break;
			case "mousemove":
	        case "touchmove":
	            this.move(e);
	            //show("move");
	            break;
			case "mouseup":
	        case "touchend":
	            this.end(e);
	            break;
	        case "webkitTransitionEnd":
	        case "msTransitionEnd":
	        case "oTransitionEnd":
	        case "otransitionend":
	        case "transitionend":
	            //d(this.transitionEnd(t))
	        }
			//
	        e.stopPropagation && e.stopPropagation();
	    },
	    start: function(e) {
			if(e.touches){
				Y = e.touches[0].pageY;
				X =  e.touches[0].pageX;
				obj.addEventListener("touchmove", this, !1),
				obj.addEventListener("touchend", this, !1);
			}else{
				Y = e.pageY;
				X=e.pageX;
				obj.addEventListener("mousemove", this, !1),
				obj.addEventListener("mouseup", this, !1);
			}
	    },
	    move: function(e) {
			if(e.touches){
				M = event.touches[0].pageY - Y;
			}else{
				M = event.pageY - Y;
			}
			if (isTop() && M > 0) {
				if (M > 60) {
					//refreshText.style.height = "20px";
					obj.style.transform = "translateY(20px)";
					obj.style.transition = "all ease 0.5s";
					refreshText.innerHTML = "释放立即刷新...";
				} else {
					refreshText.innerHTML = "下拉刷新...";
				}
			} else {

				obj.style.transform = "translateY(0)";
				refreshText.style.height = "0px";
				refreshText.innerHTML = "";
			}
	    },
	    end: function(e) {
			if (isTop() && M > 0) {
				if (M > 60) {
					fun(X);
					e.stopPropagation||e.stopPropagation()
					e.preventDefault&&e.preventDefault();
				} else {
					document.title = "end"
				}
				obj.style.transform = "translateY(0)";
				refreshText.style.height = "0px";
				refreshText.innerHTML = "";
			}
			M = 0;
			if(e.touches){
				obj.removeEventListener("touchmove", u, !1),
				obj.removeEventListener("touchend", u, !1)
			}else{
				obj.removeEventListener("mousemove", u, !1),
				obj.removeEventListener("mouseup", u, !1)
			}
	    }
	};
		obj.addEventListener("touchstart", u, !1)
		obj.addEventListener("mousedown", u, !1)
	document.onselectstart=function(e){
		return false;
	};
	var isTop = function() {
		var t = obj.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
		//alert("t:"+t)
		return t === 0 ? true : false;
	}
}

get_radio = function(obj) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].checked) {
			return obj[i].value;
		}
	}
	return false;
}

shiftDiv = function(div) {
	if (_reg.style.display == "" || _reg.style.display == "block") {
		div.style.display = "none";
	} else {
		div.style.display = "block";
	}
}

window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
     window.applicationCache .swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

UI = {
	show: function(id) {
		document.querySelector(id).style.display = "flex";
		evt.addEvent(function() {
			document.querySelector(id).style.display = "none";
		});
	},
	showSetting:function(){
		this.show('#contextmenu')
	},
	showList:function(){
		this.show('#listDiv')
	},
	showPage:function(){
		document.querySelector("#main_contain").style.display="block";
	},
	hidePage:function(){
		document.querySelector("#main_contain").style.display = "none";
		evt.addEvent(function() {
			document.querySelector("#main_contain").style.display = "block";
		});
		//document.querySelector("#main_contain").style.display="none";
	},
	showSearch:function(){
		this.show('#searchDiv')
	},
	showMain:function(){
		document.querySelector("#main_contain").style.display="block"
	},

	toast: function() {
		var task = [];
		var bool = true;

		function toast(msg) {
			task[task.length] = msg;
			var show = function() {
				bool = false;
				var msg = task.shift();
				setTimeout(function() {
					document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML = msg;
					var toastTag = document.getElementsByClassName('toast-wrap')[0];
					toastTag.className = toastTag.className.replace('toastAnimate', '');
					setTimeout(function() {
						toastTag.className = toastTag.className + ' toastAnimate';
						if (task.length > 0) {
							show();
						} else {
							bool = true;
						}
					}, 1000);
				}, 1500);
			}
			if (bool) {
				show();
			}
		}
		return toast;
	}()
}

