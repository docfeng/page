var user="docfeng"
var repos_name="blog4";

var getlist=async function(path){
    var path=path||"";
    var blogListURL = 'https://api.github.com/repos/' + user + '/' + repos_name + '/contents/blog';
    var json=await http.get(blogListURL+path);
    json =JSON.parse(json);
        var file=[];
        var dir=[];
        for (var i = 0; i < json.length; i++) {
            var name = json[i].name; // Blog title
            var url= json[i].download_url;
            var type=json[i].type;
            if(type=="dir"){
                var r=await getlist(path+"/"+name);
                dir.push({name,dir:r.dir,file:r.file});
            }else{
                file.push({name,url,type});
            }
        }
        return {dir,file}
}
getlist().then(function(re){
        alert(JSON.stringify(re,null,4))
        //http.get(re[0].url).then(function(a){alert(a)})
});
