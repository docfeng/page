
if(window.opener){
    var html=document.documentElement.innerHTML;
    window.opener.postMessage(html,'*');
    window.addEventListener('message', function(e){
      alert(e.data);
      window.opener.postMessage("3",'*');
    }, false);
}else{
    window.addEventListener('message', function(e){   
      alert(e.data);
    }, false);
};
