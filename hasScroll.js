(function(){
    var Event={
        handle:function(event){
            
        }
    }
    document.addEventListener("touchstart",function(event){
          var srcElement=event.srcElement;
          document.title=hasScroll(srcElement)
    },false);
   var hasScroll=function(element){
       var clientWidth =element.clientWidth;                                                                           
       var scrollWidth= element.scrollWidth;
       var scrollLeft= element.scrollLeft;
       if(clientWidth<scrollWidth)return true
       return false
  }
  
})()

      