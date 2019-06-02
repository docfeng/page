fso_jsonp=function(){
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
var Fso=function(fso,model){
     this.fso=fso;
     if(model=="online"){
       this.write=this.fso.write;
       this.read=this.fso.read;
     }else{
       this.write=function(name,value,bool,fun){
         var re=this.fso.write(name,value,bool);
         if(fun)fun(re);
       }
       this.read=function(name,fun){
         var re=this.fso.read(name);
         if(fun)fun(re);
       }
       this.createFolder=function(name){
         this.fso.createFolder(name);
       }
       this.copy=function(name1,name2){
         this.fso.copy(name1,name2);
       }
       this.writeZip=function(name1,name2){
         alert(this.fso.writeZip(name1,name2))
       }
     }
     
}

if(!window.fso){
  window.fso=new Fso(new fso_jsonp(),"online");
}else{
  window.fso=new Fso(fso,"local");
}


/*pfso.write("1.txt","测试dfc方法腹股沟工嘎嘎嘎嘎行",true,function(x){alert(x.txt)});
pfso.read("1.txt",function(txt){alert(txt.txt)});
alert()*/