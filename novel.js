load=function(){
    this.fun();
    	this.newworker();
}
load.prototype.fun=function(){
    var t=this;
    	t.newworker=function(){
    	    this.worker =new Worker("worker2.js"); 
    	    this.worker.onmessage =function (e){
            var data=e.data;
            if(data.fun){
                var fun=eval("("+data.fun+")");
                fun(data.para);
            }
            else{alert()}
         }
        	this.worker.onerror=function(e){
             alert("这是异常是：" + e.filename + e.message); 
         }
    }
    	t.stop=function(){
    	    this.worker.terminate();
    	}
    t.download2=function(){
        var data={}
        data.name=form_1.novel_name.value;
        data.url=form_1.list_url.value;
        data.index=0;
        data.num=[parseInt(form_1.start.value),
                             parseInt(form_1.end.value)];
        data.download=true;
        this.worker.postMessage(data); 
    }
}	
load=new load();

    var createworker=function(js){
        var blob = new Blob([js]);
	     var blobURL = window.URL.createObjectURL(blob);
	     var worker = new Worker(blobURL);
	     worker.onmessage = function(e) {
		      alert(e.data);
	     };
        return worker;
    }
    //var js="onmessage = function(e) { postMessage('msg from worker'); }"
    //var worker=createworker(js)
	 //worker.postMessage(1);

alert(1)      
