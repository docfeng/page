/*
搜索结果:bds/{}/{}.json
目录:bds/{}/list.json;
    Shelf/{}.json
章节:bds/{}/page/page{}.txt;
书架:Shelf/Shelf.json;

本地储存:Shelf/
   书架:Shelf/Shelf.json
   目录:Shelf/{}.json
   搜索|源:Shelf/{}_search.json
   章节:Shelf/{}/page/page{}.txt
   
操作:
  搜索:search [[title,url]]
    获取搜索 get(name) return arr
                                format(html)
    格式化     format(html) return arr
    获取真实搜索结果 getsearchreal(arr) return [title,url]
    保存搜索结果 save(name,arr[title,url])
    读取搜索结果 read(name) return [title,url]
    
    显示搜索 show(arr);
    搜索并显示 get2(name)
                       get(name) show(arr)
*/

search={
    get:async function(name){
        //搜索
		this.name=name;
		var url="http://www.baidu.com/s?q1="+name+
			"&q2=&q3=&q4=&rn=20&lm=0&ct=0"+
			"&ft=&q5=1&q6=&tn=baiduadv";
		if(browser.MyApp){
			var html=await http.get(url);
		}else{
			var html=await http.get(url,{cors:true,corsUrl:"http://gear.docfeng.top/get2.php"});
		}
		this.json= this.format(html);
		return this.json;
  },
  format(html){
    var arr=[];
    var el = document.createElement( 'html' );
    el.innerHTML =html;
    var d=el.getElementsByTagName("div");
    for(var i=0;i<d.length;i++){
        if(d[i].id && d[i].id<21){
            var a=[];
             a[0]=d[i].querySelector("a").innerHTML;
             a[1]=d[i].querySelector("a").href;
            arr[arr.length]=a;
        }
    }
   return arr
  },
  save(name,arr){
    //保存搜索结果
	fso.write(`Shelf/${name}/Source.json`,JSON.stringify(arr),false);
	return true;
  },
  async read(name){
    //获取本地保存的搜索结果
    var json=await fso.read(`Shelf/${name}/Source.json`);
    if(json=="false"||!json){
        json="[]";
    }
    json=this.json=JSON.parse(json);
    return json;
  },
  //搜索并显示
  async get3(name){
      var arr=await this.get(name);
      this.show(arr);
      this.save(name,arr);
  },
  async get2(name){
      var arr=await this.read(name);
      if(arr.length==0){
          this.get3(name);
      }else{
          this.show(arr);
      }
  },
  //显示结果
  show(arr){
    var txt=""
    for(var i=0;i<arr.length;i++){
      txt+="<tr><td><h4>"+arr[i][0]+"</h4><h3>"+arr[i][1]+"</h3></td></tr>";
    }
    f6_table.innerHTML=txt;
  },
  
  //搜索页点击事件,显示目录
  async click(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      var name=this.name;
      var json=this.json;
      var url=json[i][1];
      var o=await http.get(url,{xml:true});
      var url=o.url;
      var html=o.html
      json[i][1]=url;
      this.save(name,json);
      f6_table.rows[i].innerHTML=`<tr><td><h4>${json[i][0]}</h4><h3>${json[i][1]}</h3></td></tr>`;
      var arr=await List.format({html,url})
      List.show(name,arr,url);
      //var base="Shelf/"+name+"/"+json.url.match(/https?:\/\/([^\/]*?)\//)[1];
      List.save(name,arr);
  },
  //搜索页双击事件,重载目录
  async dblclick(obj){
      var obj=obj.parentNode;
      var i=obj.parentNode.rowIndex;
      
      //var basepath="bds/"+str+"/"+json.url.match(/https?:\/\/([^\/]*?)\//)[1];
      //fso.write(basepath+".txt",json.html,false,function(a){alert(true)});
  },
  set name(str) {
      f6_name.value=str
  },
  get name() {
      return f6_name.value;
  }
}
//搜狗
  //var html=await http.get(`https://so.m.sm.cn/s?q=${name}&uc_param_str=dnntnwvepffrgibijbprsvdsme&from=ucframe&uc_sm=1`);