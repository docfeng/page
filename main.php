<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = $_POST["name"];
  $txt = $_POST["txt"];
  if($txt==""){
    $myfile = fopen($name, "r") or die("Unable to open file!");
    echo fread($myfile,filesize($name)); 
    fclose($myfile);
  }else{
    $myfile = fopen($name, "w") or die("Unable to open file!");
    fwrite($myfile, $txt);
    fclose($myfile);
    echo "ture";
  }
  die();
}
?>
<!DOCTYPE html>
<html>
<head>
<meta name="apple-mobile-web-app-title" content="github文件读写" />
<META HTTP-EQUIV="pragma" CONTENT="no-cache" /> 
<meta name="apple-mobile-web-app-capable" content="yes" /> 
<meta name="apple-touch-fullscreen" content="yes" />
<meta http-equiv="Content-Type" content="application/xhtml+xml;charset=utf-8" />
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate"> 
<META HTTP-EQUIV="expires" CONTENT="0">
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<style type="text/css">
*{margin:0px;padding:0px;}
html,body{
  width:100%;
  height:100%;
  overflow-y:hidden;
}
body{
  //font-size:14px; 
  //line-height:24px;
} 
textarea{
  width:100%;
  height:90%;
  font: 2em Arial, Helvetica, sans-serif;
  //white-space:nowrap;
}
body:focus input
{
background-color:yellow;
}
input[onclick^="ins"] {
  margin:0px;
  padding:0px;
  width:25px;
  height:25px;
}
input[onclick^="shift"] {
  margin:0px;
  padding:0px;
  width:60px;
}
input[value^="page"] {
  margin:0px;
  padding:0px;
  width:40px;
}
.ins_box{
  width:100%;
  overflow-x:scroll;
  white-space:nowrap;
  position:fixed;
  bottom:0px;
  display:none;
}
.control_box{
  width:100%;
  overflow-x:scroll;
white-space:nowrap;
  //position:fixed;
  //top:0px;
}
.page_box{
  width:100%;
  //height:23px;
  //position:fixed;//absolute;
  //top:20px;
  //margin-top:20px;
  	//Word-break: break-all;
  	overflow-x: auto;
  	white-space:nowrap;
}
.edit_box{
  width:100%;
  //margin-top:50px;
}
/**
所有 iPad Media Queries
**/
@media only screen
and (min-device-width : 768px)
and (max-device-width : 1024px) {
//body{background-color:orange;}
  .ins{display:none;}
  body{
    font-size: 2em;
  }
  textarea{
    //font-size: 2em;
  }
  input{
    font-size:1em;
  }
  input[onclick^="shift"] {
    width:260px;
  }
}
/**
iPad 横屏
**/
@media only screen
and (min-device-width : 768px)
and (max-device-width : 1024px)
and (orientation : landscape) {
}
/**
**  iPad 竖屏
**/
@media only screen
and (min-device-width : 768px)
and (max-device-width : 1024px)
and (orientation : portrait) {
}
/* 手机 */
@media all and (max-width: 768px) {
  textarea{
    font: 1em Arial, Helvetica, sans-serif;
    white-space:pre;//nowrap;
    overflow-x:scroll;
   }
}
@media (max-height: 700px) {
  //body{background-color:orange;}
  .ins{display:none;}
}
@media (max-height: 400px) {
  //body{background-color:OrangeRed;}
  .edit_box{
    margin-bottom:30px;
  }
  .ins_box{display:block;}
}
</style>
<script src="//git.docfeng.top/script/http.js"></script>
</head>
<body>
<div class="top_box1" id="top_box">
    <div class="control_box" id="control_box">
        <input type="button" value='eval' onclick="eval(page.txt.value)" />
        <input type="button" value='reload' onclick='location.reload()'/>
        <input type="button" value='file' onclick='/*alert(fso.createFile("1.js"))*/'/>
        <input type="button" value="write" onclick="phpFSO.write()"/>
        <input type="button" value="read" onclick="phpFSO.read()"/>
        <input type="button" value="add" onclick="phpFSO.add()"/>
        <input type="button" value="del" onclick="phpFSO.delete()"/>
        <input type="button" value="open" onclick='var obj = window.open("about:blank");obj.document.write(page.txt.value);'/>
        <input type="button" value="打开" onclick='window.open(page.name.value);'/>
    </div>
    <div class="page_box" id="page_box" oncontextmenu="alert()" ondblclick="alert(event.srcElement.value)">
        <input id="button1" type="button" value="page1" 	style="color:red;"		onclick="shift(1)">
        <input id="button2" type="button" value="page2" onclick="shift(2);">
        <input id="button3" type="button" value="page3" onclick="shift(3);">
        <input id="button4" type="button" value="page4" onclick="shift(4);">
        <input id="button5" type="button" value="page5" onclick="shift(5);">
        <input id="button6" type="button" value="page6" onclick="shift(6);">
    </div>
</div>
<div class="ins_box" id="ins_box" >
    <input type="button" value='.' onclick="ins('.')" />
    <input type="button" value="a" onclick="ins('alert()')"/>
    <input type="button" value='""' onclick="ins('&quot;&quot;')"/>
    <input type="button" value='=' onclick="ins('=')" />
    <input type="button" value='f' onclick="ins('function(){}')" />
    <input type="button" value='[]' onclick="ins('[]')" />
    <input type="button" value='{}' onclick="ins('{}')" />
    <input type="button" value='{' onclick="ins('{')" />
    <input type="button" value='}' onclick="ins('}')" />
    <input type="button" value='\' onclick="ins('\\')" />
    <input type="button" value='+' onclick="ins('+')" />
    <input type="button" value='<<<' onclick="del()" />
</div>

<div class="edit_box" id="edit_box">
    <form id="page0" style="height:100%;width:100%">
        Name: <input type="text" name="name" size=20 />
	<br>
	<textarea name="txt" ></textarea>
	<!--onfocus="show_ins()" onblur="hide_ins()"-->
    </form>
</div>
<script>
var page;
var index=1;
var button=button1;
var name_=Array()
var txt_=Array()
		
shift=function(i){
    eval("button" + index).style.color="black";
    if(page.name.value!=""){
        eval("button" + index).value=page.name.value;
        set_sto("name"+index,page.name.value);
        if(page.txt.value!=""){
            set_sto("txt"+index,page.txt.value);
        }
    }
    page.style.display="none";
    page=eval("page"+i);
    page.style.display="block";
    index=i;
    eval("button" + index).style.color="red";
    page.name.value=get_sto("name"+index)||"";
    page.txt.value=get_sto("txt"+index)||"";
}  

phpFSO={
    async read(){
        var path="";//"main.php";
        var str="name="+page.name.value;
        var re=await http.post(path,str);
        page.txt.value=re;
    },
    async write(){
        var path="";//"main.php";
        var str='name='+page.name.value+'&txt=' +encodeURIComponent(page.txt.value);
        var re=await http.post(path,str);
        alert(a);
    },
    async add(){
        var name=page.name.value;
        var txt=page.txt.value;
        git.add(name,txt);
    },
    async delete(){
        var name=page.name.value;
        git.del(name);
    }
}
del=function() {
    var textObj=page.txt;
    if (textObj.setSelectionRange) { 
        var rangeStart = textObj.selectionStart; 
        var rangeEnd = textObj.selectionEnd; 
        var tempStr1 = textObj.value.substring(0, rangeStart-1); 
        var tempStr2 = textObj.value.substring(rangeEnd); 
        textObj.value = tempStr1+tempStr2; 
        var length=rangeStart-1;
        textObj.setSelectionRange(length,length);
        //textObj.focus();
    } 
    textObj.focus();
}

ins=function(string) {
    var textObj=page.txt;
    if (textObj.setSelectionRange) { 
        var rangeStart = textObj.selectionStart; 
        var rangeEnd = textObj.selectionEnd; 
        var tempStr1 = textObj.value.substring(0, rangeStart); 
        //textObj.focus();
        var tempStr2 = textObj.value.substring(rangeEnd); 
        textObj.value = tempStr1 + string + tempStr2;
        // textObj.focus();
        var s_len=string.length;
        var length=rangeStart+s_len;
        // textObj.setSelectionRange(length,length);
        textObj.selectionStart= textObj.selectionEnd=length;
    }
    textObj.focus();
}

document.oninput=function(a){
  var obj=event.srcElement;//this.getSelection().focusNode.txt;
  var str1="";
    if(obj.len>obj.value.length){
        str1="删除";
    }else if(obj.value.length-obj.len>1){
        str1="粘贴";
    }else{
        var i1=obj.selectionStart
        str1=obj.value.substring(i1-1, i1);
        switch(str1){
            case "\n":
                str1="回车"
                var len=obj.value.substring(0, i1-1).match(/(\u0020*)[^\n]*$/);
                str1=len[1].length;
                ins(len[1]);
                break;
            case " ":
                str1="空格";
                //ins("  ");
                break;
        }
    }
} 

window.onkeydown=function(a){
    var obj=event.srcElement;//this.getSelection().focusNode.txt;
    obj.len=obj.value.length;
}

window.onload=function(){
    eval(get_sto("js"));
    page=page0;
    addForm(1);addForm(2);
    addForm(3);addForm(4);
    addForm(5);addForm(6);
    shift(1);
    window.onresize();
}
window.onresize=function(){
  //window.innerHeight<400?show_ins():hide_ins();
  var wh=window.innerHeight;
  var ctr_h=parseInt(window.getComputedStyle(control_box).height);
  var page_h=parseInt(window.getComputedStyle(page_box).height);
  var ins_h=parseInt(window.getComputedStyle(ins_box).height)||0;
  //var edit_h=parseInt(window.getComputedStyle(edit_box).height);
  //alert(window.getComputedStyle(ins_box).height);
  
  edit_box.style.height=(wh-ctr_h-page_h-ins_h)+"px";
  var style = document.createElement('style');             
  style.innerHTML = "textarea{height:"+ (wh-ctr_h-page_h-ins_h-26)+"px;}";
  document.head.appendChild(style);
 
  /*//动态添加外置样式表    
  var  link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'index.css');  //已经存在这个index.css文件
  document.head.appendChild(link);
  */
  //edit_box.style.marginBottom=ctr_h+"px;
  //page.txt.value=window.innerHeight+"\n"+ctr_h+"\n"+page_h+"\n"+ins_h
  
}

window.onerror = function(sMessage, sUrl, sLine) {
     alert("发生错误！\n" + sMessage + "\nURL:" + sUrl + "\nLine Number:" + sLine);
     return true;
}
addForm=function(i){
  var clonedNode = page0.cloneNode(true);
  clonedNode.setAttribute("id", "page" + i); 
  page0.parentNode.appendChild(clonedNode);
  eval("page"+i).style.display="none";
}
	
set_sto=function(a,b){
     localStorage.setItem(a,b);
}
get_sto=function(a){
     return localStorage.getItem(a)
}

show_ins=function(){
  ins_box.style.display="block";
}
hide_ins=function(){
  ins_box.style.display="none";
}
/*window.addEventListener('load',function(){
  myStorage=new myStorage(function(){git=new git();});
}, false);
*/
</script>
</body>
</html>