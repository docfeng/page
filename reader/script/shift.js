/*
Shelf | Shelf.json 书架
          | name | List.json
                       | Source.json
                       | Source | url.txt
                       | page | i.txt
  书架位置:Shelf/Shelf.json;
  书架格式:[
            {
              name:String,
              url:String,
              oldpage{
                    title:String,
                    url:String,
                    Date:String
                  },
              newpage:{
                    title: String,
                    url: String,
                    Date: String
                  },
              update:bool
            }
          ]
          
书架:Shelf
    读取书架 read() {name,url,oldpage,newpage,update}
    修改|新增 书架 set() add(json)
    更新书架 update() 
    删除第i个 delete(i);
    保存书架 save(json)
    
    显示书架 showShelf(json)
    显示第i个书架 showShelf(index);
    点击事件 click(obj,order);
*/
if(!window.MyObject)window.MyObject={}

window.MyObject.Shelf={
    hisPath:"Shelf/Shelf1.json",
    max:2,
    //获取书架信息
    read:async function(){
		if(browser.MyApp){
            var json=await fso.read(this.hisPath);
	    }else{
			var json=await store.getItem("Shelf");
		}
        if(json=="false"){
            alert("none Shelf");
            json="[]";
        }
        this.json=JSON.parse(json);
        return this.json;
    },
    //修改书本
    set:function(){
        var arr={
            name:win.name,
            url:win.url,
            olepage:{title:win.olePage,url:"",Date:new Date()},
            newpage:{title:win.newPage,url:"",Date:new Date()},
            update:false
        };
        if(confirm("添加\n"+JSON.stringify(arr))){
            this.add(arr);
        }
    },
    //新增
    add:async function(arr){
        var t=this;
        var json=this.json;
        var num=-1;
        for(var i=0;i<json.length;i++){
            if(json[i].name==arr.name){
                num=i;
            }
        }
        if(num==-1){
            json.unshift(arr);
        }else{
            json[num]=arr;
        }
        this.json=json;
        json=JSON.stringify(json);
        if(confirm("是否添加:"+arr.name)){
        var re=await fso.write(this.hisPath,json,false);
        alert(re);
        }
    },
     //显示书架
     show:async function(para={}){
         var json=para.json||this.json||await this.read();
         var str="";
         if(para&&para.index>=0){
             var i=para.index;
             console.add("显示"+i);
             var arr=json[i];
             var d=`<h1>${i}.${arr.name}</h1>
                <h2>已读:${arr.oldpage.title}</h2>
                <h3>${arr.oldpage.Date}</h3>
                <h4><span class="highlight">最新:</span>${arr.newpage.title}</h4>
                <h3>${arr.newpage.Date}</h3>
                <h6>${arr.url}</h6>`;
                str+="<tr><td>"+d+"</td></tr>";
                shelf_table.rows[i].innerHTML=str;
         }else{
             json.forEach(function(arr,i){
                var d=`<h1>${i}.${arr.name}</h1>
                <h2>已读:${arr.oldpage.title}</h2>
                <h3>${arr.oldpage.Date}</h3>
                <h4>最新:${arr.newpage.title}</h4>
                <h3>${arr.newpage.Date}</h3>
                <h6>${arr.url}</h6>`;
                str+="<tr><td>"+d+"</td></tr>";
             });
             if(shelf_table){shelf_table.innerHTML=str;}
         }
     },
	download:async function(){
		var html=await git.getFile("page","novel/Shelf.json");
		store.setItem("Shelf",html);
		alert(html);
	},
	upload:async function(){
		alert("upload");
	},
    //书架页点击处理
    click:async function(obj,order="click"){
        var obj=obj.parentNode;
        var i=obj.parentNode.rowIndex;
        if(order=="click"){
            //显示目录页
            menu_obj.shift(2);
            var json=this.json;
            var name=json[i].name;
			var url=json[i].url;
            //显示目录
            var arr=await List.read(name);
			if(!arr){
				var arr=await List.get(url);
				List.save(name,arr);
			}
            List.show(name,arr,url);
            json.unshift(json.splice(i,1)[0]);
			f3_name.value=name;
            //保存书架
			if(browser.MyApp){
				fso.write(this.hisPath,JSON.stringify(json),false);
			}else{
				store.setItem(this.hisPath,JSON.stringify(json))
			}
        }
        if(order=="delete"){
            this.delete(i);
        }
        this.show();
    },
    //删除书本
    delete:function(i){
        if(confirm("是否删除:"+i+this.json[i].name)){
            this.json=this.json.del(i);
            //alert(JSON.stringify(this.json));
            fso.write(this.hisPath,JSON.stringify(this.json),false);
        }
    },
    //更新书架信息
    update:async function(){
        var json=this.json||await this.read();
        var t=this;
        console.add("开始更新");
        var count=0;
        var update_i=async function(i){
            var arr=json[i];
            var url=arr.url;
            var name=arr.name;
            console.add(name)
            var urlArr=await List.get(url);
            if(!urlArr){
                console.add(`>>${i}.${name}List未获得;<br>-------<br>`);
            }else{
                List.save(name,urlArr)
                try{
                //最新章节
                    console.add(i)
                    urlArr=urlArr.pop();
                    arr.newpage.title=urlArr[1];
                    arr.newpage.url=urlArr[0];   
                    t.show({index:i});
                }catch(e){
                    console.add(`>>${i}.${name}出错;<br>-------<br>`);
                }
            }
            //是否保存
            count++;
            if(count==15&&confirm("save?\n"+this.json)){
                fso.write(this.hisPath,JSON.stringify(this.json),false);
            }
        }
        for(var i=0;i<14;i++){
            update_i(i);
        }
    }
}

/*form1事件
         if(window.form_1){
               win.name=name;
               win.url=json[i].url;
               win.newPage=json[i].newpage.title;
               win.oldPage=json[i].oldpage.title;
               var event = document.createEvent('HTMLEvents');
               event.initEvent("change", true, true);
               event.eventType = 'message';
               form_1.list_url.dispatchEvent(event);
         }*/