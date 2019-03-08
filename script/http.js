//chrome.openFile("../git/noveldownload/noveldownload.html");
http={
    xmlhttp:function(){
        var xmlHttp=null; 
        try { // Firefox, Opera 8.0+, Safari 
            xmlHttp=new XMLHttpRequest();
        }catch (e) { // Internet Explorer 
            try { 
                xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); 
            }catch (e) { 
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
           } 
        } 
        if (xmlHttp==null) { 
            alert ("您的浏览器不支持AJAX！"); 
            return; 
        }
        return xmlHttp;
    },
    async get(url,json={}){
        var json=json;
        json.url=url;
        json.method="get";
        var re=await this.ajax(json);
        return re;
    },
    async cors(url,json={cors:true}){
        var json=json;
        json.url=url;
        json.method="get";
        var re=await this.ajax(json);
        return re;
    },
    async getJSON(url,json={}){
        var json=json;
        json.url=url;
        json.method="get";
        var re=await this.ajax(json);
        return JSON.parse(re);
    },
    async post(url,str,json={}){
        var json=json;
        json.str=str;
        json.url=url;
        json.method="post";
        var re=await this.ajax(json);
        return re;
    },
    async ajax(json){
        var  json=json;
        var method=json.method;
        var cors=json.cors||false;
        var url=json.url;
        var str=json.str;
        if(cors){
          url="http://gear.docfeng.top/get.php?url="+url
        }
        var str=json.str||"";
        var xml=json.xml||false;
        var xmlHttp=this.xmlhttp();
        xmlHttp.timeout=20000;
        return new Promise(function(resolve){
            xmlHttp.onreadystatechange=function(){
                if(xmlHttp.readyState==4) { 
                    var re="";
                    if(xml){
                        var re={
                            html:xmlHttp.responseText,
                            url:xmlHttp.responseURL,
                            xml:xmlHttp
                        };
                    }else{
                        re=xmlHttp.responseText;
                    }
                   //alert(url)
                    resolve(re)
                }
             }
            xmlHttp.ontimeout = function(e) {
                prompt(url,url);
                var err=new Error()
                xmlHttp.abort();
                resolve("");
                throw setError("ajax超时20s","url:"+url);
            };
            xmlHttp.open(method,url,true); 
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlHttp.send(str); 
        });
    }
}
/*var get=async function(){
var re=await http.cors("http://www.baidu.com");
alert(re)
}
get()*/