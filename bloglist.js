var user="docfeng"
var repos_name="blog4";
var blogListURL = 'https://api.github.com/repos/' + user + '/' + repos_name + '/contents/blog';
http.get(blogListURL).then(function(json){
        var json =JSON.parse(json);
        var re=[];
        for (var i = 0; i < json.length; i++) {
            var name = json[i].name; // Blog title
            var url= json[i].download_url;
            var type=json[i].type;
            re.push({name,url,type});
        }
        alert(JSON.stringify(re,null,4))
        //http.get(re[0].url).then(function(a){alert(a)})
})
