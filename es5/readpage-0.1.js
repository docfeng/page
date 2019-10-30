/*
  耳机按键:nextPage();
  跳到第i章:window.page(i);
  跳到第i页:window.section(i,t);
  上一页:window.uppage()
  下一页:window.next();
  
*/

ini=function(index){
  //alert(url+index)
  var index2=prompt("页面",0);
  window.page(parseInt(index)-1)
  setTimeout(function(){
    window.section(parseInt(index2));
  },1000);
}

function keyCode(i){
  alert(i)
}
//监听耳机按键
function nextPage(){
  //alert(next)
  
  if(window.ds){
    window.clearTimeout(ds);
  }
  var next=function(){
    window.ds=setTimeout(function(){
      window.next();
    },500);
  }
  var uppage=function(){
    window.ds=setTimeout(function(){
      window.uppage();
    },500);
  }
  if(!window.time1){
    window.time1=new Date();
    next();
  }else{
    var t2=new Date();
    var t=t2-window.time1;
    window.time1=t2
    if(t<400){
      window.uppage();
      window.uppage()
    }else{
      window.next();
    }
  }
  
}

showMsg=geth(2).showMsg;
//showMsg("fffggf");

/*
!function() {
//10
    function ini() {
        var t = !1;
        $(r).on("click", ".reward-btn,.flower-btn,.comment-btn",
        function(t) {
            var n = $(this),
            e = n.data("url") || window.location.href;
            return window.userInfo && userInfo.uid ? void(e && (window.location = e)) : i.showMsg("请先登录~", 0, i.goLogin(e))
        }).on("click", ".add-fav, .add-tag",
        function(n) {
            if (!window.userInfo || !userInfo.uid) return i.showMsg("请先登录~", 0, i.goLogin);
            var e = $(this),
            o = e.data("api");
            e.hasClass("add-fav") ? "已收藏至书架！": "书签已添加";
            t || e.hasClass("added") || (t = !0, $.ajax({
                url: o,
                type: "POST",
                success: function(t) {
                    var n = i.io.parseJson(t);
                    if (0 == n.code) i.showMsg(n.msg || "收藏成功！"),
                    e.addClass("added"),
                    e.hasClass("add-fav") && e.find("span").text("已收藏");
                    else {
                        if ( - 400 == n.code) return i.showMsg("请先登录~", 0, i.goLogin);
                        i.showMsg("添加失败，请稍后再试")
                    }
                },
                error: function(t) {
                    i.showMsg("网络不给力，稍后再试")
                },
                complete: function() {
                    t = !1
                }
            }))
        })
    }
    var i = geth(2),
    a = {
        init: ini
    },
    r = document;
    a.init();
}();
*/
//alert(geth)

show=function(str){
 e = $("#page-nav");
 e.html(str)  
}

//初始化界面
!function() {
//12
    //设置cookie
    function o() {
        setTimeout(function() {
            var t = ["fstep-" + at.cur, tt.cur, "page-" + F, "rd-" + X];
            var R = (/BlackBerry|Windows Phone/i.test(navigator.userAgent), "__zwReadCfg");
            U.set(R, t.join(","), {
                path: "/",
                maxAge: 31104e3
            })
        },
        100)
    }
    /*function i(t) {
        function r() {
            for (var t in localStorage) t.match(J) && j.rm(t)
        }
        j.set(J + K.bid, {
            bid: K.bid,
            chid: K.chid,
            url: window.location.href.split("?")[0].split("#")[0],
            pos: t || 0,
            chname: K.chname,
            time: 1 * new Date
        }),
        localStorage.length >= Q && r()
    }
    */
    function c(t) {
        $(t).addClass("cur").siblings().removeClass("cur")
    }
    
    
    
    
    //屏幕幕布
    function l() {
        /*$("#tip-bg").length || et.append('<div class="tip-bg" id="tip-bg"></div>');
        var t = U.get(rt);
        "undefined" == t && (et.removeClass("tip-off").addClass("tip-on"), H = !0);
        var n = "ontouchstart" in document.documentElement ? "touchstart": "click";
        ot.on(n,function(t) {
            if (H) {
                et.removeClass("tip-on").addClass("tip-off");
                var n = U.get(rt),
                e = F;
                e = "undefined" == n ? e: e + n,
                U.set(rt, e, {
                    path: "/",
                    maxAge: 31104e3
                }),
                H = !1
            }
        })*/
    }
    //点击面板 点击
    function f() {
        ot.on("click", ".fn-div",function(t) {
            H || (t.preventDefault(), et.toggleClass("fn-on").removeClass("cfg-on").removeClass("idx-on"), V = !1)
        }).on("touchmove",function(t) {
            et.removeClass("cfg-on").removeClass("fn-on")
        })
        //上一页、下一页
        ot.on("click", "div",function(t) {
            if (!H) {
                var n = $(this);
                return n.hasClass("pg-lft") && !z() && nextPage(),//upPage(),
                n.hasClass("pg-rit") && !z() && nextPage(),
                !1
            }
        })
        
        ot.on("click", ".pg-up", function(t) {
            return ! z() && D(),//全部修改成下一章P(),
            !1
        }).on("click", ".pg-dn",function(t) {
            return ! z() && D(),
            !1
        })
    }
    function P(t) {
        //et:body;n:body高度;
        var n = et.scrollTop(),
        e = $(window).height(),
        o = it.height();
        et.height();
        n > 0 ? et.scrollTop(n - (e - o)) : upChapter()
    }
    function D(t) {
        var n = et.scrollTop(),
        e = $(window).height(),
        o = it.height(),
        i = et.height();
        i > n + e ? et.scrollTop(n + (e - o)) : nextChapter()
    }
    
    //设置页面底部
    function u() {
        $(".fb-icon").on("click", "li>a, li>div",function() {
            var t = $(this),
            n = t.find(".icon");
            n.addClass("icon-taped"),
            setTimeout(function() {
                n.removeClass("icon-taped")
            },
            500)
        }),

        $(window).on("resize orientationchange",function(t) {
			et.removeClass("cfg-on").removeClass("fn-on");
            "lr" == F && cacl(Z)
        })
    }
    
    function h() {
        //alert("h")
        /*
      function v(t) {
        B.showMsg(t || "网络不给力，稍后重试~"),
        et.removeClass("idx-on"),
        V = !1,
        ct = !1,
        dt = !1
      }
      var m=function() {
        $("#idx-cnt li a").off("touchstart touchmove touchend").on("touchstart",
        function(t) {
            lt = $(this).data("href")
        }).on("touchmove",
        function(t) {
            lt = null
        }).on("touchend",
        function(t) {
            var n = $(this),
            e = n.data("href");
            alert()
            return e ? void(e == lt ? window.location = e: lt = null) : void(lt = null)
        })
      }
      var p=function(t) {
        function n(t) {
            return "<li" + (t.ch_id == window.bookInfo.chid ? ' class="cur"': "") + '><a data-href="' + ("/" + window.bookInfo.bid + "/" + t.ch_id + ".html") + '"><span>' + t.ch_name + "</span>" + (1 * t.ch_vip ? '<i class="icon icon-chag">VIP</i>': '<i class="icon icon-free">免费</i>') + "</a></li>"
        }
        t || v();
        for (var e = $("#idx-cnt"), o = e.find("ul.ul-odr"), i = e.find("ul.ul-rvt"), a = [], r = [], s = (window.location.href, 0); s < t.asc.length; s++) a.push(n(t.asc[s]));
        for (var c = 0; c < t.desc.length; c++) r.push(n(t.desc[c]));
        o.prepend(a.join("")),
        i.prepend(r.join("")),
        e.data("idxloaded", !0),
        m()
      }
      var g=function() {
        if (!ct && !dt) {
            dt = !0;
            var t = "/read/getList/book_id/" + window.bookInfo.bid + "/ch_id/" + window.bookInfo.chid + ".html";
            $.ajax({
                url: t,
                type: "GET",
                dataType: "json",
                success: function(t) {
                    p(t),
                    ct = !0,
                    dt = !1
                },
                error: function(t) {
                    v(),
                    ct = !0,
                    dt = !1
                }
            })
        }
      }
      var k=function() {
        function t(t) {
            var n = B.isMobile.iOS();
            return t ? void(n && N ? $(s).off("transitionend").on("transitionend",
            function(t) {
                et.removeClass("idx-on"),
                $(s).removeAttr("style").off("transitionend"),
                V = !1
            }) : setTimeout(function() {
                et.removeClass("idx-on"),
                $(s).removeAttr("style"),
                V = !1
            },
            i)) : void(n && N ? $(s).off("transitionend").on("transitionend",
            function(t) {
                et.addClass("idx-on"),
                $(s).removeAttr("style").off("transitionend"),
                V = !0
            }) : setTimeout(function() {
                et.addClass("idx-on"),
                $(s).removeAttr("style"),
                V = !0
            },
            i))
        }
        var n = {},
        e = {},
        o = {
            stopPropagation: !0
        },
        i = 200,
        a = !1,
        r = $("#idx-cnt").find(".idx-div").get(0),
        s = document.getElementById("idx-cnt"),
        c = s.getBoundingClientRect().width || s.offsetWidth,
        d = function() {},
        l = function(t) {
            setTimeout(t || d, 0)
        },
        f = {
            handleEvent: function(t) {
                switch (t.type) {
                case "touchstart":
                    this.start(t);
                    break;
                case "touchmove":
                    this.move(t);
                    break;
                case "touchend":
                    l(this.end(t));
                    break;
                case "webkitTransitionEnd":
                case "msTransitionEnd":
                case "oTransitionEnd":
                case "otransitionend":
                case "transitionend":
                    l(this.transitionEnd(t))
                }
                o.stopPropagation && t.stopPropagation()
            },
            start: function(t) {
                alert("开始移动")
                if (V) {
                    var o = t.touches[0];
                    n = {
                        x: o.pageX,
                        y: o.pageY,
                        time: +new Date
                    },
                    a = void 0,
                    e = {},
                    r.addEventListener("touchmove", this, !1),
                    r.addEventListener("touchend", this, !1)
                }
                
            },
            move: function(t) {
                alert("正在移动")
                if (! (t.touches.length > 1 || t.scale && 1 !== t.scale)) {
                    o.disableScroll && t.preventDefault();
                    var i = t.touches[0];
                    if (e = {
                        x: i.pageX - n.x,
                        y: i.pageY - n.y
                    },
                    "undefined" == typeof a && (a = !!(a || Math.abs(e.x) < Math.abs(e.y))), !a && V) {
                        if (t.preventDefault(), e.x > 0) {
                            var r = Math.round(100 * Math.min(e.x / c, 0));
                            move(s, 0, r + "%", 0)
                        }
                        if (e.x < 0) {
                            var r = Math.round(100 * Math.max(e.x / c, -.89));
                            move(s, 0, r + "%", 0)
                        }
                    }
                }
                
            },
            end: function(o) {
            alert("结束移动")
                var d = +new Date - n.time,
                l = Number(d) < 250 && Math.abs(e.x) > 20 || Math.abs(e.x) > c / 4,
                u = V && e.x > 0 || !V && e.x < 0;
                if (!a) {
                    if (u) {
                        if (V && e.x > 0) return;
                        return void(!V && e.x < 0)
                    }
                    l ? (e.x > 0 && move(s, 0, 0, 0), e.x < 0 && (move(s, i, "-89%", 0), t(!0))) : (move(s, i, 0, 0), t(!1))
                }
                r.removeEventListener("touchmove", f, !1),
                r.removeEventListener("touchend", f, !1);
                
            }
            
        };
        r.addEventListener("touchstart", f, !1)
        alert()
      }
      
      
        $("#idx-hdl").one("click",
        function() {
            g(),
            k(),
            m()
        }).on("click",
        function(t) {
            $("#idx-cnt").removeAttr("style"),
            et.toggleClass("idx-on").removeClass("cfg-on"),
            V = !V,
            !V || ct || dt || g(),
            t.stopPropagation()
        }),
        $("#idx-cnt").on("click", "h2 .icon",
        function() {
            var t = $("#idx-cnt").find(".idx-div");
            t.toggleClass("idx-rvt")
        })*/
    }
    //字体控制
    function fontset() {
        $("#cfg-font").on("click", "menuitem",function(t) {
            t.preventDefault();
            var n = $(this),
            e = at.cur,
            o = at.dft;
            n.hasClass("disabled") || n.hasClass("cur") || (n.hasClass("fs-add") && w(e + 1), n.hasClass("fs-rdu") && w(e - 1), n.hasClass("fs-dft") && w(o))
        });
    }
    //字体设置
    function w(t, n) {
		    var ft = $("#cfg-font"),
		    ut = ft.find(".fs-add"),
		    ht = ft.find(".fs-rdu"),
		    mt = ft.find(".fs-dft");
        var e = at.range,
        t = 1 * t;
        if ("number" == typeof t && (0 > t && (t = 0), t > e && (t = e), 0 == t ? ht.addClass("disabled") : ht.removeClass("disabled"), t == e ? ut.addClass("disabled") : ut.removeClass("disabled"), t == at.dft ? mt.addClass("cur") : mt.removeClass("cur"), at.cur = t, !n)) {
            var o = $("body"),
            i = o.attr("class"),
            a = i.replace(/\s*fstep-\d\s*/g, " fstep-" + t + " ");
            o.attr("class", a),
            cacl(Z)
        }
    }
    //设置背景色
    function C() {
        var t = $("#cfg-bg");
        t.on("click", "menuitem",function(t) {
            t.preventDefault();
            var n = $(this);
            if (!n.hasClass("cur")) {
                tt.cur = n.data("cls");
                var e = " " + tt.cur + " ",
                o = $("body"),
                i = o.attr("class"),
                a = i.replace(/\s*bg-\d\s*/g, e);
                o.attr("class", a),
                n.addClass("cur").siblings("menuitem").removeClass("cur")
            }
        });
        //设置底部
        $("#fn-btm").on("click", "li.night div",function(t) {
            t.preventDefault(),
            $("body").removeClass("rd-day").addClass("rd-night"),
            X = "night",
            o()
        }).on("click", "li.day div",function(t) {
            t.preventDefault(),
            $("body").removeClass("rd-night").addClass("rd-day"),
            X = "day",
            o()
        })
        
        $("#fn-btm").on("click", "li.li-down",function(t) {
            t.preventDefault();
            var n = navigator.userAgent,
            e = "目前支持iOS和安卓系统",
            o = $(this);
            return /Windows Phone|webOS|BlackBerry/i.test(n) ? void B.showMsg(e) : /MicroMessenger/i.test(n) ? void B.showMsg("请在浏览器中打开本页") : /windows|win32|Android/i.test(n) ? void(window.location = o.data("apk")) : /AppleWebKit.*Mobile/i.test(n) || /macintosh|mac os x/i.test(n) ? void(window.location = o.data("ipa")) : void B.showMsg(e)
        })
        
        $("#fn-btm").on("click", "li.li-cfg div",function(t) {
            return t.preventDefault(),
            et.toggleClass("cfg-on"),
            !1
        })
    }

    //设置滑动模式：左右、上下
    function x() {
        $("#cfg-mode").on("click", "menuitem",function(t) {
            var n = $(this);
            if (!n.hasClass("cur")) {
                var e = n.hasClass("mode-lr"),
                o = nt;
                c(n),
                et.removeClass("fn-on cfg-on");
                var i = U.get(rt);
                e ? (F = "lr", et.addClass("page-lr"), cacl(), i.indexOf(F) < 0 && (et.removeClass("tip-off").addClass("tip-on"), H = !0)) : (F = "ud", pageIndex = 1, et.removeClass("page-lr"), o.removeAttr("style"), i.indexOf(F) < 0 && (et.removeClass("tip-off").addClass("tip-on"), H = !0))
            }
        })
    }
    //页面点击、窗口关闭时设置cookie
    function y() {
        window.onbeforeunload = function() {
            o();
        },
        $("#cfg-pnl menuitem").on("click",function() {
            o()
        })
    }
    
    function z() {
        var t = et.hasClass("cfg-on");
        return t && et.removeClass("cfg-on").removeClass("fn-on"),
        t
    }

    
    var B = geth(2),
    j = getn(7),
    N = B.supportAnimate().supported,
    W = B.io.parseUrl,
    
    U = B.cookie,
    J = "zreadPos_",
    K = window.bookInfo,
    Q = 100,
    pageCount = 1,
    F = "",
    X = "",
    pageIndex = 1,
    Z = 0,
    pageLeft = -342,
    H = !1,
    V = !1,
    tt = {
        cur: "bg-2"
    },
    nt = (window.location.href.split("?")[0].split("#")[0], $("#rd-txt")),
    et = $("body"),
    ot = $("#tap-hdl"),
    it = $("#rd-top"),
    at = {
        range: 6,
        cur: 3,
        dft: 3
    },
    rt = "__zwTS",
    st = {
        init: function() {
            //初始化阅读界面
            this.formatPage();
            //初始化控制界面
            this.reactCtls();
        },
        formatPage: function() {
            var t = "#__zrposed",
            et = $("body"),
            e = et.attr("class"),
            o = W();
            o && "prev" == o.zref;
            if (window.location.hash!=t) {
                var a = W(window.location.href.split("#")[1]),
                r = a && a.zrpos;
                1 * r && (r = Math.abs(1 * r), Z = Math.max(Math.min(1, r), 0), history.pushState(null, null, t))
            }
            et.hasClass("page-lr") ? (F = "lr", cacl(Z), c($("#cfg-mode").find(".mode-lr"))) : (F = "ud", c($("#cfg-mode").find(".mode-ud")), Z && et.scrollTop(et.height() * Z - 32)),
            X = "day";//et.hasClass("rd-night") ? "night": "day";
            var s = e.match(/fstep-\d/);
            //设置字体大小
            w(s ? s[0].split("-")[1] : 3, "noset");
            var d = e.match(/bg-\d/);
            d = d ? d[0].split("-")[1] : 2,
            tt.cur = "bg-" + d,
            c($("#cfg-bg").find(".bg-" + d));
            var l = B.cookie,
            f = "mzl_channel",
            u = l.get(f);
            u && $("html").addClass("chn-" + u)
        },
        clearRead: function() {
            et.removeClass("fn-on").removeClass("cfg-on").removeClass("idx-on"),
            V = !1
        },
        reactCtls: function() {
            //屏幕幕布 l(),
            u(),//设置页面底部
            f(),//设置面板点击
            //未知h(),
            fontset(),
            C(),//设置底部、设置背景色
            x()//设置滑动模式：左右、上下
            //y()//页面点击、窗口关闭时设置cookie
        }
    },
    ct = $("#idx-cnt").data("idxloaded") || !1,
    dt = !1,
    lt = null; 
    st.init();
    
    
    
    
   
    //屏幕换页动画
    function move(obj, t, x, y, fun) {
        //动画持续n秒;
        var obj=$(obj);
        obj.css("-webkit-transition", "-webkit-transform " + t + "ms ease"),
        obj.css("-o-transition", "-o-transform " + t + "ms ease"),
        obj.css("-moz-transition", "-moz-transform " + t + "ms ease"),
        obj.css("-ms-transition", "-ms-transform " + t + "ms ease"),
        obj.css("transition", "transform " + t + "ms ease");
        
        //沿x轴滚动x,沿y轴滚动y;
        var x = "number" == typeof x ? x + "px": x;
        var y = "number" == typeof y ? y + "px": y;
        obj.css("-webkit-transform", "translate3d(" + x + ", " + y + ",0)"),
        obj.css("-moz-transform", "translate3d(" + x + ", " + y + ",0)"),
        obj.css("-o-transform", "translate3d(" + x + ", " + y + ",0)"),
        obj.css("-ms-transform", "translate3d(" + x + ", " + y + ",0)"),
        obj.css("transform", "translate3d(" + x + ", " + y + ",0)"),
        //如果fun为function,t秒后执行fun;
        "function" == typeof fun && setTimeout(fun, t)
    }
     Page.move=function(obj, t, x, y, fun){
		 move(obj, t, x, y, fun)
	 }
	 //rd-txt在t秒内沿x轴移动-x个屏幕距离;
    function scroll(x, t) {
        var width = $(window).width();
        var obj = "#rd-txt";
        var x = x || pageIndex;
        var t = t || 0;
        var X = -width * (x - 1);
        pageLeft=X
        //obj对象t毫秒内沿x轴移动X长度，y轴移动0长度;
        move(obj, t, X, 0);
    }
    	//计算界面,移动到第(t*总页数)页;
    function cacl(t) {
		document.title=F
        if ("lr" == F) {
            var n = nt,
            win_width = $(window).width(),
            win_height = B.isMobile.iOS() ? window.innerHeight: $(window).height();
            n.css({
                height: win_height,
                width: win_width
            });
            //rd-txt长度;
            var txt_width=document.getElementById("rd-txt").scrollWidth;
            //计算页数
            pageCount = Math.ceil( txt_width/ win_width),
            t && (pageIndex = Math.max(Math.floor(t * pageCount), 1), scroll(pageIndex, 0)),
            //显示页码
            $("#page-nav").html(pageIndex + "/" + pageCount),
            //alert(e.html())
            window.scrollTo(0, 1)
        }
    }
    	//上一章
    function upChapter() {
       window.page(Page.index1-1);
    }
    	//下一章
    function nextChapter() {
        window.page(Page.index1+1);
    }
    window.page=function(i){
		//页数等于第1页;
        pageIndex=1;
        if(i<0)i=0;
		//alert(i)
        Page.multiIndex(i).then(function(txt){
			//alert(txt);
			if(!txt)return Promise.reject("err:window.page:\nno txt"+txt);
        	txt=Page.formatUI(txt);
        	//alert(txt)
        	Page.index1=i;
        	var nextindex=i+1;
        	if(nextindex<Page.arr.length){
        		Page.multiIndex(nextindex);
        	}else{
        		fj.tip("已阅读到书本末尾")
        	}
        	$("#rd-txt").html(txt);
        	$("#page-name").html(Page.arr[i][1]+":    "+Page.name);
        	$("#novelName").html(Page.name);
        	Z = (pageIndex / pageCount).toFixed(2);
        	scroll(pageIndex, 0);
        	void cacl();
        }).catch(function(e){
        	alert(e)
        });
    }
    	//上一页
    function upPage(t) {
        pageIndex--;
        window.section(pageIndex,t);
    }
    	//下一页
    function nextPage(t) {
      pageIndex++;
      window.section(pageIndex,t);
    }
    window.next=nextPage;	
    window.uppage=function(){
      pageIndex--;
      window.section(pageIndex,200);
    }
    window.section=async function(i,t){
      et.removeClass("fn-on cfg-on");
        pageIndex=i;
        if(0 >= pageIndex){
        //如果页面<=0,上一章;
          //pageIndex = 1;
          //upChapter();
          await window.page(Page.index1-1);
          window.section(pageCount,0)
          
        }else if(pageIndex > pageCount){
        //如果页码>页数,下一章;
          pageIndex = pageCount;
          nextChapter()
        }else{
          Z = (pageIndex / pageCount).toFixed(2);
          scroll(pageIndex, t || 400)
          void cacl();
        }
        Page.index2=pageIndex;
        return ;
    };
    Page.resize=function(){
    	et.removeClass("cfg-on").removeClass("fn-on"),
    	"lr" == F && cacl(Z)
    };
    (function() {
        var t = {},
        n = {},
        e = {
            stopPropagation: !0
        },
        o = !1,
        i = document.getElementById("tap-hdl"),
        a = document.getElementById("rd-txt"),
        r = i.getBoundingClientRect().width || i.offsetWidth,
        s = $(i).height(),
        c = function() {},
        d = function(t) {
            setTimeout(t || c, 0)
        },
        l = 0,
        f = 0,
		isMobile=navigator.userAgent.indexOf("Mobile")>-1,
        u = {
            //切换事件
            handleEvent: function(t) {
                switch (t.type) {
				case "mousedown":
                case "touchstart":
                    this.start(t);
                    //show("start");
                    break;
				case "mousemove":
                case "touchmove":
                    this.move(t);
                    //show("move");
                    break;
				case "mouseup":
				case "losecapture":
                case "touchend":
                    d(this.end(t));
                    break;
                case "webkitTransitionEnd":
                case "msTransitionEnd":
                case "oTransitionEnd":
                case "otransitionend":
                case "transitionend":
                    d(this.transitionEnd(t))
                }
                e.stopPropagation && t.stopPropagation()
            },
            start: function(e) {
                if (!V && !H) {
					if(e.touches){
						var a = e.touches[0];
					}else{
						var a = e;
					}
                    t = {
                        x: a.pageX,
                        y: a.pageY,
                        time: +new Date
                    },
                    o = void 0,
                    n = {}
					if(e.touches){
						i.addEventListener("touchmove", this, !1);
						i.addEventListener("touchend", this, !1);
					}else{
						i.addEventListener("mousemove", this, !1);
						i.addEventListener("mouseup", this, !1);
					}
                }
            },
            move: function(i) {
				if(i.touches){
					var r = i.touches[0];
					var bool = ! (i.touches.length > 1 || i.scale && 1 !== i.scale)
				}else{
					var r = i;
					var bool = ! (i.scale && 1 !== i.scale);
				}
                if (bool) {
					e.disableScroll && i.preventDefault();
                    if (n = {
                        x: r.pageX - t.x,
                        y: r.pageY - t.y
                    },
                    "undefined" == typeof o && (o = !!(o || Math.abs(n.x) < Math.abs(n.y))), !o && "lr" == F) {
                        if (i.preventDefault(), 1 == pageIndex && n.x > 0) return;
                        if (pageIndex == pageCount && n.x < 0) return;
                        move(a, 0, pageLeft + n.x, 0)
                    }
                }
            },
            end: function(e) {
                var a = +new Date - t.time,
                c = !1;
                if ("lr" == F && (c = Number(a) < 250 && Math.abs(n.x) > 20 || Math.abs(n.x) > r / 4), "ud" == F && (c = Number(a) < 250 && Math.abs(n.y) > 20 || Math.abs(n.y) > s / 4), !o && "lr" == F) {
                    var d = 1 == pageIndex && n.x > 0 || pageIndex == pageCount && n.x < 0;
                    if (d) return void(1 == pageIndex && n.x > 0 ? upPage(200)/* upChapter() */ : pageIndex == pageCount && n.x < 0 && nextChapter());
                    c ? (n.x > 0 && upPage(200), n.x < 0 && nextPage(200)) : scroll(pageIndex, 200)
                }
                if (o && "ud" == F) {
                    var h = $(window);
                    n.y < 0 && (f--, f = Math.max(f, 0)),
                    n.y > 0 && (l--, l = Math.max(l, 0)),
                    n.y < 0 && et.scrollTop() + h.height() >= et.height() && (l++, l >= 2 && nextChapter()),
                    n.y > 0 && et.scrollTop() <= 0 && (f++, f >= 2 && upPage(200)/* upChapter() */)
                }
				if(e.touches){
					i.removeEventListener("touchmove", u, !1);
					i.removeEventListener("touchend", u, !1);
				}else{
					i.removeEventListener("mousemove", u, !1);
					i.removeEventListener("mouseup", u, !1);
				}
            }
        };
		//if(isMobile){
			i.addEventListener("touchstart", u, !1)
		//}else{
			i.addEventListener("mousedown", u, !1);
		//}
    })();
    //console.log("readCtl inited @ " + +new Date),
    //t.exports = st
    
    //初始化
    window.addEventListener("load",async function(){
		  //点击显示目录
		  document.getElementById("idx-zd").onclick = function() {
		        Page.showList();
		        return;
		  }
    },false);
}();