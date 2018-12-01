var html=document.documentElement.innerHTML;
list={};
list.inilist=function(html,fun){
     var t=this;
     //获取章节目录
     var reg_di=new RegExp("<a[^>]*?href=[\"|']([^\"|']*?)[\"|'].*?>(第[^\-]*?)<","g");
     var url_arr=html.matches(reg_di);
     for(var i=0;i<url_arr.length;i++){
          url_arr[i][0]=url_arr[i][0].getFullUrl(win.url);
     }
     //alert(url_arr+"\n"+html)
     if(!url_arr)return 0;
     //获取小说名称
     var reg_name=new RegExp("<title>(第[^<0-9]*?)<","g");
     var novelname=html.match(/<title>([^<]*?)</);
     novelname=novelname[1];
     var pattern1 = /[\u4e00-\u9fa5]+/g;
     novelname = novelname.match(pattern1)[0];
     if(novelname.indexOf("最新")){
       novelname=novelname.split("最新")[0];
     }
     t.novelname=novelname;
     //
     var reg=/<a[^>]*?href="([^"]*?)"[^>]*?>([^<第]*?下一页[^<]*?)</;
     var nexturl=html.match(reg);
     var reg2=/<a[^>]*?href="([^"]*?)"[^>]*?>查看完整目录[^<]*?</;
     var nexturl2=html.match(reg2);
     
     if(nexturl){
       nexturl=nexturl[1].getFullUrl(win.url);
       alert(nexturl);
       /*getHTML(nexturl,function(html){
           t.inilist(html,function(arr){
               var arr=url_arr.concat(arr)
               //alert(arr)
               arr=iniarr(arr);
               fun(arr);
           })
        });*/
     }else{
        if(nexturl2){
          nexturl2=nexturl2[1].getFullUrl(this.url);
          /*getHTML(nexturl2,function(html){
alert(url_arr)
            t.inilist(html,function(arr){
               //alert(arr)
               var arr=iniarr(arr);
               fun(arr);
            })
          });*/
        }else{
          //alert(url_arr)
          fun(url_arr);
        }
     }
  }
list.inilist(html,function(a){alert(a)})