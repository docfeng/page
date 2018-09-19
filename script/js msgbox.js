msg=function(mtitle,mbody){
  var msgbox=window.msgbox;
  if(!msgbox){
    var oHead = document.getElementsByTagName('BODY').item(0);
    var oDiv= document.createElement("div"); 
    oDiv.id="msgbox";
    oDiv.style.cssText= "height:200px;width:200px;position:fixed;left:50px;top:50px;background-color:white;border-style:solid;"; 
    var oDivhead= document.createElement("div"); 
    oDivhead.style.cssText= "heigth:24px;width:100%;display:block;border-style:none none solid none"; 

    var oDivtitle= document.createElement("div"); 
    oDivtitle.style.cssText= "heigth:24px;width:173px;float:left;display:inline-block"; 
    oDivtitle.innerHTML=mtitle;

    var oDivclose= document.createElement("div"); 
    oDivclose.style.cssText= "heigth:24px;width:24px;float:right;display:inline-block"; 
    oDivclose.onclick=function(){oDiv.style.display="none"}
    oDivclose.innerHTML="&#8855";

    var oDivbody= document.createElement("div"); 
    oDivbody.innerHTML=mbody ;
    oDivbody.style.cssText= "height:176px;width:100%;display:block;"
    oDivhead.appendChild( oDivtitle);
    oDivhead.appendChild( oDivclose);

    oDiv.appendChild( oDivhead);
    oDiv.appendChild( oDivbody);
    oHead.appendChild( oDiv);
  }else{
    msgbox.style.display="block";
    msgbox.childNodes[0].childNodes[0].innerHTML=mtitle;
    msgbox.childNodes[1].innerHTML=mbody;
    //alert(msgbox.childNodes[0].childNodes[0].innerHTML)
  }
}
//msg("测试咕  111","测试2222")
