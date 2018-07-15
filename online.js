(function(){
	alert(2)
    var onlineurl="http://git.docfeng.top/";
    var base=[
	          //"novel.js",
			  "base.js"
			 ];
	for(var i in base){
		getJs(onlineurl + base[i]);
	}
})()
