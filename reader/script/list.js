//v1.01
/*
目录:List 
  目录位置:Shelf/{name}.json;
  目录格式:[
            [url,title]
          ]
    读取目录 read(name);
    获取目录 get(url); return arr
             获取目录html http.get(url) return html
             格式化目录   format({html,url}) return arr
    更新目录 update(name)
             获取目录 get(url);
             保存目录 save();
             显示目录 show();
    保存目录 save(name,arr);
    
    
    显示目录 show(name,arr,url);
    显示目录2 showarr(arr);
    滚动到i scroll(i);
    点击事件 click()
*/
/*Regs=[
    [
		"https://m.qu.la",
		{
			"name":'<title>(.*?)<',
			"links":'<a[^>]*?href="([^"]*?)".*?>(第[^<]*?)<'
		},
		{
			"reg1":"",
			"reg2":""
		} 
	]
]
*/

if(!window.MyObject)window.MyObject={}

window.MyObject.List={
    path:"Shelf/",
    arr:[],
    html:"",
    reg:[],
    getReg:async function(){
        var json=await fso.read("regs.reg");
        if(json=="false"){alert("none regs");return false;}
        this.Regs=JSON.parse(json);
    },
    //读取目录
    read:async function(name){
        var name=name||win.name;
        if(!name){alert("List.read参数name错误");return 0;}
		if(browser.MyApp){
			var path=`Shelf/${name}.json`;
            var txt=await fso.read(path);
            if(txt=="false"){return false;}
	    }else{
			var txt=await store.getItem(`Shelf/${name}.json`);
			if(!txt){return false;}
		}
        this.arr=JSON.parse(txt);
        return this.arr;
    },
    //保存目录
    save:function(name,arr){
        var name=name||this.name||win.name;
        var arr=arr||this.arr;
        if(!name||!arr){
            alert("参数错误")
        }
		if(browser.MyApp){
            fso.write(`Shelf/${name}.json`,JSON.stringify(arr),false);
		}else{
			store.setItem(`Shelf/${name}.json`,JSON.stringify(arr));
		}
    },
    //显示目录
    show:function(name,arr,url){
        var url_arr=arr||this.arr;
        this.arr=url_arr;
        var name=name||this.name;
        this.name=name;
        var url=url||win.url;
        this.showarr(arr);
        f4_name.value=name;
        f4_count.value=url_arr.length;
        f4_url.value=url;
        if(window.form_1)win.end=this.arr.length;
    },
    showarr:function(arr){
        var url_arr=arr||this.arr;
        var str="";
        var err=[];
        for(var i=0;i<url_arr.length;i++){
            if(!url_arr[i]||!url_arr[i][1]){
                err[err.length]=i+":"+url_arr[i];
            }else{
                var d="<h4>"+url_arr[i][1]+"</h4>";
                d+="<h5>"+url_arr[i][0]+"</h5>";
                str+="<tr><td>"+d+"</td></tr>";
            }
        }
        list_table.innerHTML=str;
    },
    //目录滚动到第i个
    scroll:function(i){
        var h=list_table.rows[i].offsetTop
        list_table.parentNode.scrollTop=h
    },
    //获取目录
    get:async function(url){
        var url=url||win.url
        if(!url){
            console.add("没有url");
            return false;
        }
        var html=await http.get(url,{cors:true,corsUrl:"http://gear.docfeng.top/get2.php"});
		if(!html){console.add("没有html");return false;}
        console.add("开始格式化目录");
        var arr=await this.format({html,url});
        console.add("目录格式化完成");
        if(!arr){console.add("没有arr");return false;}
        this.arr=arr;
        return arr;
    },
    format:async function(json){
        var html=json.html;
        var url=json.url;
        var arr=[];
        var fun=async function(html){
            var reg_di=new RegExp("<a[^>]*?href[ ]?=[\"']([^\"'>]*?)[\"'][^>]*?>(第[^\-<]*?)<","g");
            let arr=html.matches(reg_di);
            for(var i=0;i<arr.length;i++){
                arr[i][0]=arr[i][0].getFullUrl(url);
            }
            //下一页地址
            var reg=/<a[^>]*?href=["|']([^"']*?)["|][^>]*?>([^<第]*?下一页[^<]*?)</;
            var nexturl=html.match(reg);
            if(nexturl){
               nexturl=nexturl[1].getFullUrl(url);
            }
            return {arr:arr,url:nexturl};
        }
        console.add("开始获取html");
        var json=await fun(html);
        arr[arr.length]=json.arr
        while(json.url){
               var html=await http.get(json.url);
               json=await fun(html);
               arr[arr.length]=json.arr
         }
         console.add("开始分析arr");
         var index=0;
         if(arr.length>1){
              for(var i=0;i<arr[0].length;i++){
                    if(arr[0][i][0]==arr[1][i][0]){
                        index++;
                    }
              }
              let myarr=[];
              for(var i=0;i<arr.length;i++){
                  for(var i2=0;i2<index;i2++){
                      arr[i].shift();
                  }
                  myarr=myarr.concat(arr[i]);
              }
              arr=myarr;
          }
          if(arr.length==1){arr=arr[0]}
          return arr;
    },
    //下载
    download:async function(){
        var t=this;
        zipFile.ini(this.arr);
        warn("开始下载")
        var start=parseInt(form_1.start.value);
        var end=parseInt(form_1.end.value);
        var arr=[start,List.arr.slice(start,end)];
        page.setData(arr,function(data){
            var i=data[2];
            list_table.rows[parseInt(i)].cells[0].style.backgroundColor="#ff0000";
            zipFile.copyPage(data[1],data[2]);
            t.scroll(i);
        });
    },
    //检查正则
    checkReg:async function(obj){
        var t=this;
        if(typeof(obj)=="string"){
            t.reg=t.Regs[0];
            t.Regs.forEach(function(e,i){
                var url=obj;
                if(url!=""&&e[0]==url.getBaseUrl()){
                    t.reg=e;
                }
            });
        }else{
            obj.style.backgroundColor="red";
            obj.style.border="2px solid red";
            t.reg=t.Regs[0];
            t.Regs.forEach(function(e,i){
                var url=obj.value;
                if(url!=""&&e[0]==url.getBaseUrl()){
                    obj.style.backgroundColor="green";
                    obj.style.border="2px solid green";
                    t.reg=e;
                }
            });
            showData({"name_reg":t.reg[1].name,"links":t.reg[1].links});
        }
    },
    //更改正则
    setReg:function(){
        var t=this;
        var reg=this.reg=[
        form_1.list_url.value.getBaseUrl(),
      {
      "name":form_1.name_reg.value,
      "links":form_1.link_reg.value
      }
    ];
    var bool=false;
    var index;
    var Regs=this.Regs;
    Regs.forEach(function(value,i){
      if(value[0]==reg[0]){
     	    bool=true;
     	    index=i;
     	 }
    });
    if(bool){
      if(confirm("已存在，是否修改")){
        Regs[index]=reg;
      }
      alert(JSON.stringify(reg));
    }else{
      Regs[Regs.length]=reg;
      alert(JSON.stringify(Regs))  ;
    }
  },
    //保存正则
    writeReg:function(){
        fso.write("regs.reg",JSON.stringify(this.Regs),false);
    },
    click:function(obj){
         var obj=obj.parentNode;
         var i=obj.parentNode.rowIndex;//*this.max+obj.cellIndex;
         var arr=this.arr[i];
         var title=arr[1];
         var url=arr[0];
         var his=localStorage.getItem("his");
         if(his){
             his=JSON.parse(his);
         }else{
             his={name:"",index:[1,0]};
         }    
		 if(this.name){
             his.name=this.name
         }
         his.index=[i+1,0];
         var his=JSON.stringify(his,null,2);
         localStorage.setItem("his",his)
         location.href="page.html";
    },
    update:async function(url){
        var json=await this.get(url);
        var arr=this.arr=json;
        this.showarr(arr);
        var newpage=arr[arr.length-1];
        this.save();
        alert(newpage)
        f4_new.value=newpage[1];
    },
    changeSource:async function(name){
        alert("换源")
        f6_name.value=name;
        menu_obj.shift(3);
        search.get2(name);
    },
    addBook(name,arr,url,i){
        var name=name||this.name;
        var arr=arr||this.arr;
        var i=i||0;
        var json={
        name:name,
        url:url,
        index:0,
        oldpage:{title:arr[i][1],url:arr[i][0],Date:new Date()},
        newpage:{title:arr[arr.length-1][1],url:arr[arr.length-1][0],Date:new Date()},
        update:false
        };
        Shelf.add(json);
    }
}