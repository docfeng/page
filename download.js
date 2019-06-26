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
function Save() {
    //downloadGithubFile("hello.txt","docfeng","page","git.txt");
    //downloadRepos("h.zip","docfeng","page")
}
Save()