download=function(name,url){
    var a = document.createElement('a');
    var content="alert()"
    //var url =url;// window.URL.createObjectURL(content);
    a.href = url;
    a.download = name;
    a.click();
    //window.URL.revokeObjectURL(url);
} 
download("1.txt","https://raw.githubusercontent.com/docfeng/page/master/git.txt")