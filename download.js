var downloadFile=function(name,url) {
    var anchor = document.createElement("a");
    if('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = url;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    }else {
       window.open(url);
    }
}
downloadGithubFile=function(name,user,repos,file){
    var url=`https://raw.githubusercontent.com/${user}/${repos}/master/${file}`
    downloadFile(name,url);
}
downloadRepos=function(name,user,repos){
    //var url=`https://codeload.github.com/${user}/${repos}/legacy.zip/master`;
    var url=`https://codeload.github.com/${user}/${repos}/zip/master`;
    //downloadFile(name,url)
    window.open(url)
}
downloadBlob=function(value, type, name) {
    var blob;
    if(typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    
    var anchor = document.createElement("a");
    if('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if(navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}
function Save() {
    downloadGithubFile("hello.txt","docfeng","page","1.mp3");
    //downloadRepos("h.zip","docfeng","page");
    //downloadBlob("fgggh", "text/csv,charset=UTF-8", "hello.txt");
}
Save()