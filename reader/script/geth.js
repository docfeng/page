geth=function(t, n, e) {
    //2
    function o(t) {
        var n, e = [];
        for (n in t) e.push(encodeURIComponent(String(n)) + "=" + encodeURIComponent(String(t[n])));
        alert(e.join("&"));
        return e.join("&")
    }
    function i(t) {
        var n = t || location.search.substr(1),
        e = {};
        n.split("&").forEach(function(t) {
            var n = t.split("=");
            e[n[0]] = decodeURIComponent(n[1])
        });
        return e;
    }
    function a(t, n) {
        var n = n || window.location.href.split("#")[0],
        e = "object" == typeof t ? o(t) : t;
        return n += (n.split("?")[1] ? "&": "?") + e
    }
    function r() {
        var t, n, e, o = !1,
        i = ["webkit", "Moz", "O", ""], 
        a = i.length, 
        r = document.documentElement.style
        for (; a--;) if (i[a]) {
            if (void 0 !== r[i[a] + "AnimationName"]) {
                switch (t = i[a], a) {
                case 0:
                    n = t.toLowerCase() + "AnimationStart",
                    e = t.toLowerCase() + "AnimationEnd",
                    o = !0;
                    break;
                case 1:
                    n = "animationstart",
                    e = "animationend",
                    o = !0;
                    break;
                case 2:
                    n = t.toLowerCase() + "animationstart",
                    e = t.toLowerCase() + "animationend",
                    o = !0
                }
                break
            }
        } else if (void 0 !== r.animationName) {
            t = i[a],
            n = "animationstart",
            e = "animationend",
            o = !0;
            break
        }
        return {
            supported: o,
            prefix: t,
            start: n,
            end: e
        }
    }
    function s(t, n, e, o) {
        var m=$("body");
        m.removeClass("msg-on");
        var i = $("#msg-cnt");
        i.length || ($('<div id="msg-cnt" class="msg-cnt"></div>').appendTo(m), i = $("#msg-cnt")),
        n ? i.attr("class", "msg-cnt msg-type-" + n) : i.attr("class", "msg-cnt"),
        i.html("<span>" + t + "</span>").off("animationend"),
        m.addClass("msg-on");
        var e = e,
        a = o ? 1e3 * o: 1e3;
        window.setTimeout(function() {
            m.removeClass("msg-on"),
            e && e()
        },
        a)
    }
    function c(t) {
        var g = "//m.zhulang.com/login/index.html";
        window.location = g + "?dest=" + encodeURIComponent(t || location.href)
    }
    function d() {
        return window.channelID && /^\d+$/.test(channelID) ? channelID: (window.channelID = h.cookie.get("mzl_channel") || "", channelID)
    }
    function l() {
        if (!window._hmt) {
            var t = v["default"],
            n = "";
            n = window.channelID ? channelID: h.cookie.get("mzl_channel"),
            n && v[n] && (t = v[n]);
            var e = e || []; !
            function() {
                var n = document.createElement("script");
                n.src = "//hm.baidu.com/hm.js?" + t;
                var e = document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n, e)
            } (),
            window._hmt = e
        }
    }
    function f() {
        var t = $("#app-link,.app-link");
        if (t.length) {
            var n = h.getChn(),
            e = n.match("1600"),
            o = window.location.href.match("/index/app/channel/"),
            i = "http://a.app.qq.com/o/simple.jsp?pkgname=com.zhulang.reader",
            a = "https://app2.zhulang.com/app/download/",
            r = "https://itunes.apple.com/us/app/id1128277830?l=zh&ls=1&mt=8";
            if (h.isMobile.Android() && (t.data("android") && t.attr("href", t.data("android")), t.data("apk") && t.attr("href", t.data("apk")), e)) {
                var c = t.attr("href");
                c.match("https") || (a += c.split("/app/")[1], t.attr("href", a)),
                $(".app-bar").click(function() {
                    var t = $(this).find(".app-link").attr("href");
                    window.location = t
                })
            }
            h.isMobile.iOS() && (t.data("ios") && t.attr("href", t.data("ios")), e && t.attr("href", r)),
            (h.isMobile.Weixin() || h.isMobile.QQ()) && !o && (t.attr("href", i), $(".n-app").attr("href", i)),
            h.isMobile.Weibo() && t.on("click",
            function(t) {
                s("请在浏览器中打开下载", null, null, 3)
            })
        }
    }
    function u() {
        var t = $(".verifyimg");
        t.length && t.click()
    }
    var h = {
        showMsg: s,
        goLogin: c,
        supportAnimate: r,
        supportTouch: "ontouchstart" in document.documentElement,
        io: {},
        regs: {},
        ui: {},
        chn: "",
        isMobile : {
          Android: function() {
            return navigator.userAgent.match(/Android/i)
          },
          BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i)
          },
          iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i)
          },
          Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i)
          },
          Windows: function() {
            return navigator.userAgent.match(/IEMobile/i)
          },
          Weixin: function() {
            return navigator.userAgent.match(/MicroMessenger/i)
          },
          QQ: function() {
            return navigator.userAgent.match(/QQ/)
          },
          Weibo: function() {
            return navigator.userAgent.match(/weibo/i)
          },
          any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()
          }
        },
        regs : {
            mobi: /^(?:13|14|15|16|17|18|19)[\d]{9}$/,
            username: /^[a-zA-Z0-9][\w-]{2,30}$/,
            bankcard: /^[0-9](?:[\d]{21}|[\d]{20}|[\d]{19}|[\d]{18}|[\d]{17}|[\d]{16}|[\d]{15}|[\d]{14}|[\d]{13}|[\d]{12}|[\d]{11}|)$/,
            email: /^[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/
        },
        ui:{
              cur:function(t, n, e) {
                var t = $(t) || t,
                o = n || "cur";
                t.addClass(o).siblings().removeClass(o)
              }
        }
    },
    m = $("body"),
    g = "//m.zhulang.com/login/index.html";
    h.getChn = function() {
        return h.chn ? h.chn: (h.chn = h.cookie.get("mzl_channel") || "default", h.chn)
    },
    h.ui.ena = function(t) {
        var n = "disabled";
        t && t.each(function(t) {
            $(this).removeClass(n).removeAttr(n)
        })
    },
    h.ui.dis = function(t) {
        var n = "disabled";
        t && t.each(function(t) {
            $(this).attr(n, n).addClass(n)
        })
    },
    h.ui.loadimg = function(t, n) {
        var t = $(t),
        e = "imgLoadFlag";
        if (!t.data(e)) {
            var o = t.find("img[data-src],img[data-bg]");
            o.length && (o.each(function() {
                var t = $(this),
                n = t.data("src"),
                e = t.data("bg");
                n && t.attr("src", n).removeAttr("data-src"),
                e && t.css({
                    "background-image": "url(" + e + ")"
                }).removeAttr("data-bg")
            }), t.data(e, 1))
        }
    },
    h.ui.tab = function(t, n, e, o, i) {
        var i = i || "click",
        a = $(t).find(n),
        r = $(e).find(o);
        a.on(i,
        function(t) {
            var n = $(this),
            e = n.index(),
            i = r.eq(e),
            a = h.ui.cur;
            a(this, "cur"),
            i.show().siblings(o).hide(),
            n.blur(),
            h.ui.loadimg(i),
            t.preventDefault()
        })
    },
    h.io.serialize = o,
    h.io.parseUrl = i,
    h.io.addUrlParam = a,
    h.io.xssEscape = function(t) {
        return t = String(null === t ? "": t),
        t.replace(/&(?!\w+;)|["'<>\\]/g,
        function(t) {
            switch (t) {
            case "&":
                return "&amp;";
            case "\\":
                return "\\\\";
            case '"':
                return "&quot;";
            case "'":
                return "&#39;";
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            default:
                return t
            }
        })
    },
    h.io.parseJson = function(t) {
        try {
            if ("object" == typeof t) return t;
            if ("string" == typeof t) return JSON.parse(t)
        } catch(n) {
            console.log("parseJson error \n org-data: \n " + t)
        }
    };
    r(); !
    function(t) {
        function n() {
            var t = {};
            if (document.cookie) {
                var n = document.cookie.split("; ");
                n.forEach(function(n, e, o) {
                    var i = n.split("="),
                    a = i[0],
                    r = i[1];
                    t[a] = r
                })
            }
            return t
        }
        function e(t, n, e) {
            if (t && n) {
                var o = encodeURIComponent(t) + "=" + encodeURIComponent(n);
                return e && (e.maxAge && (o += "; max-age=" + e.maxAge), e.path && (o += "; path=" + e.path), e.domain && (o += "; domain=" + e.domain), e.secure && (o += "; secure")),
                document.cookie = o,
                o
            }
            return ""
        }
        function o(t) {
            return decodeURIComponent(n()[t]) || null
        }
        function i(t) {
            n()[t] && (document.cookie = t + "=; max-age=0")
        }
        function a() {
            var t = n();
            for (var e in t) document.cookie = e + "=; max-age=0"
        }
        function r(t) {
            return n()
        }
        function s(t) {
            return t && "string" == typeof t ? t && window.cookie ? (window[t] = window.cookie, delete window.cookie, window[t]) : void 0 : window.cookie
        }
        t.cookie = {
            getCookies: r,
            set: e,
            get: o,
            remove: i,
            clear: a,
            noConflict: s
        }
    } (h);
    var v = {
        "default": "e5883283abd0285c634898e065e21499",
        200001 : "93083ac76898fe363cd44a3b9c599716",
        200002 : "59e10cf75029fe5d23a3c5b4068f18f9",
        160020 : "59ebf7a83435c374ab6f94e9c1f58f5a",
        160021 : "660c43db3a131fffa13832636259b95e",
        160023 : "3fd1ba328e6b479dda5668344189cfe9",
        160024 : "0d758ee64750c01ad7728fd460c30f0d"
    };
    $(function() {
        d(),
        $(".backicon").on("click",
        function() {
            window.history.go( - 1)
        }),
        $(".verifyimg").on("click",
        function() {
            var t = $(this),
            n = t.attr("src").split("?");
            t.attr("src", n[0] + "?__t=" + +new Date)
        });
        var t = window.weixinShareImg || "https://s.zhulang.com/images/zl320v1.png"; (h.isMobile.Weixin() || h.isMobile.QQ()) && (m.addClass("inwx"), m.prepend('<div id="zl-wx-share-img" style=" overflow:hidden; width:0px; height:0; margin:0 auto; position:absolute; top:-800px;"><img src="' + t + '"></div>')),
        $(".js-login,.js-log").on("click",
        function() {
            c()
        }),
        f(),
        l()
    }),
    h.io.refreshChar = u;
    return h;
}







getn=function(t, n, e) {
  //7
    function o(t, n) {
        "use strict";
        return Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
            var n = this.length >>> 0,
            e = Number(arguments[1]) || 0;
            for (e = 0 > e ? Math.ceil(e) : Math.floor(e), 0 > e && (e += n); n > e; e++) if (e in this && this[e] === t) return e;
            return - 1
        }),
        n.prefix = "",
        n._getPrefixedKey = function(t, n) {
            return n = n || {},
            n.noPrefix ? t: this.prefix + t
        },
        n.set = function(t, n, e) {
            var o = this._getPrefixedKey(t, e);
            try {
                localStorage.setItem(o, JSON.stringify({
                    data: n
                }))
            } catch(i) {
                console && console.warn("Lockr didn't successfully save the '{" + t + ": " + n + "}' pair, because the localStorage is full.")
            }
        },
        n.get = function(t, n, e) {
            var o, i = this._getPrefixedKey(t, e);
            try {
                o = JSON.parse(localStorage.getItem(i))
            } catch(a) {
                o = localStorage[i] ? {
                    data: localStorage.getItem(i)
                }: null
            }
            return null === o ? n: "object" == typeof o && "undefined" != typeof o.data ? o.data: n
        },
        n.sadd = function(t, e, o) {
            var i, a = this._getPrefixedKey(t, o),
            r = n.smembers(t);
            if (r.indexOf(e) > -1) return null;
            try {
                r.push(e),
                i = JSON.stringify({
                    data: r
                }),
                localStorage.setItem(a, i)
            } catch(s) {
                console.log(s),
                console && console.warn("Lockr didn't successfully add the " + e + " to " + t + " set, because the localStorage is full.")
            }
        },
        n.smembers = function(t, n) {
            var e, o = this._getPrefixedKey(t, n);
            try {
                e = JSON.parse(localStorage.getItem(o))
            } catch(i) {
                e = null
            }
            return null === e ? [] : e.data || []
        },
        n.sismember = function(t, e, o) {
            this._getPrefixedKey(t, o);
            return n.smembers(t).indexOf(e) > -1
        },
        n.getAll = function() {
            var t = Object.keys(localStorage);
            return t = t.filter(function(t) {
                return - 1 !== t.indexOf(n.prefix)
            }),
            t.map(function(t) {
                return n.get(t.substr(n.prefix.length))
            })
        },
        n.srem = function(t, e, o) {
            var i, a, r = this._getPrefixedKey(t, o),
            s = n.smembers(t, e);
            a = s.indexOf(e),
            a > -1 && s.splice(a, 1),
            i = JSON.stringify({
                data: s
            });
            try {
                localStorage.setItem(r, i)
            } catch(c) {
                console && console.warn("Lockr couldn't remove the " + e + " from the set " + t)
            }
        },
        n.rm = function(t) {
            localStorage.removeItem(t)
        },
        n.flush = function() {
            localStorage.clear()
        },
        n;
    }
    return o({},{});
}