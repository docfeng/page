/*fso_jsonp=function(){
  this.write=function(name,value,bool,fun){
      var cmd="cmd=write&name="+
         encodeURIComponent(name)+
         "&value="+encodeURIComponent(value)+
         "&bool="+bool+
         "&callback=?";
      var url="http://fujianyixue.host3v.vip/fso.asp?";
      $.getJSON(url+cmd,function(txt){
         fun(txt.txt);
      });
  }
  this.read=function(name,fun){
      var cmd="cmd=read&name="+
        encodeURIComponent(name)+
        "&callback=?";
      var url="http://fujianyixue.host3v.vip/fso.asp?";
      $.getJSON(url+cmd,function(txt){
          fun(decodeURIComponent(txt.txt));
      });
  }
  this.getpage=function(url,fun){
    var url="http://fujianyixue.host3v.vip/page.asp?url="
        +url+"&callback=?";
    $.getJSON(url,function(txt){
      fun(decodeURIComponent(txt.txt));
    });
  }
}
*/
var Fso={
    fso:{},
    write:async function(name,value,bool=false){
		var a=name.split("/");
		var d="";
		for(var i=0;i<a.length-1;i++){
			d+=a[i];
			if(!this.fso.exist(d)){
			   this.fso.createFolder(d);
			}
			d+="/";
		}
        var re=await this.fso.write(name,value,bool);
        return re;
    },
    read:async function(name){
        toast(name)
         var re=await this.fso.read(name);
         return re;
    },
    createFolder:async function(name){
        this.fso.createFolder(name);
    },
    copy:async function(name1,name2){
         this.fso.copy(name1,name2);
    },
    getList:async function(name){
        var re=this.fso.getList(name);
        return re;
    },
    writeZip:async function(name1,name2){
         alert(this.fso.writeZip(name1,name2))
    }
}
var Fso2={
    write:async function(name,value,bool=false){
         var re=await store.setItem(name,value);
         return re;
    },
    read:async function(name){
         var re=await store.getItem(name);
         return re;
    }
}
/*if(!window.fso){
  window.fso=new Fso(new fso_jsonp(),"online");
}else{
  window.fso=new Fso(fso,"local");
}*/

if(window.browser&&browser.MyApp){
    Fso.fso=fso;
    window.fso=Fso;
}else{
	window.fso=Fso2;
}

/*pfso.write("1.txt","测试dfc方法腹股沟工嘎嘎嘎嘎行",true,function(x){alert(x.txt)});
pfso.read("1.txt",function(txt){alert(txt.txt)});
alert()*/