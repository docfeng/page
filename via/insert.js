!function(a){
  function addJs(src){
    //document.write("");
    var newJs = document.createElement("script");
    //newJs.setAttribute("type","text/javascript");
    newJs.type = "text/javascript";
    newJs.async = false;
    newJs.charset = "utf-8";
    newJs.src = src;
    var firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(newJs, firstScript);
  }
  var url="https://cdn.jsdelivr.net/gh/docfeng/page/via/base.js?version="+Math.random();
  addJs(url);
  
}();