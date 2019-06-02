menu_obj={
  ini(){
    var ul=this.ul=document.querySelector("#menu>ul");
    var t=this;
    var index=ul.dataset.index;
    t.shift(index);
    ul.onclick=function(e){
        var e = e || window.event;
        var target = e.target || e.srcElement;
        var index=target.dataset.index||t.getindex(target);
        t.shift(index);
    }
  },
  shift(index){
    var li=document.querySelectorAll("#menu>ul>li");
    var div=document.querySelectorAll("#menu>div");
    var ul=document.querySelector("#menu>ul");
    var _index=ul.dataset.index;
    li[_index].className="off";
    div[_index].className="hide";
    li[index].className="on";
    div[index].className="show";
    ul.dataset.index=index;
  },
  getindex(obj){
      var ul=obj.parentNode;
      var li=ul.getElementsByTagName("li");
      for(var s in li){
        if(obj == li[s]){
          s = parseInt(s);
          return s;
        }
      }
  }
}
window.addEventListener("load",function(){
  menu_obj.ini();
},false);






