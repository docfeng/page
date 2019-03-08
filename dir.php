<?php
header("Access-Control-Allow-Origin:*");
$path= dirname(__FILE__);
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $order=$_POST["order"];
    $name = $_POST["name"];
    switch($order){
        case "getDir":
            echo json_encode(getDir($name));
            break;
        case "createDir":
            return mkdir($name);
            break;
        case "deleteDir":
            return rmdir($name);
            break;
        case "getFile":
            return getFile($name);
            break;
        case "writeFile":
            $txt = $_POST["txt"];
            return writeFile($name,$txt);
            break;
        case "deleteFile":
            return unlink($name);
            break;
        case "downloadFile":
            return downloadFile($name);
            break;
    }
    function getFile($name){
          $myfile = fopen($name, "r") or die("Unable to open file!");
          echo fread($myfile,filesize($name)); 
          fclose($myfile);
    }
    function writeFile($name,$txt){
          $myfile = fopen($name, "w") or die("Unable to open file!");
          fwrite($myfile, $txt);
          fclose($myfile);
          echo "ture";
    }
}else{

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
<script src="http://git.docfeng.top/script/http.js?2"></script>
<style type="text/css">
*{
    margin:0px;
    padding:0px;
}
html,body{
  width:100%;
  height:100%;
  overflow-y:hidden;
}
body{
  //font-size:2em; 
  //line-height:24px;
}
dialog{
    height:100%;width:100%;background-color:green;
}
.contain{
    display: flex;
    height:100%;width:100%;
    flex-direction: column;
}
.contain>header{
  flex-basis:30px;width:100%;background-color:green;
}
.contain>.main{
    flex-grow:1;width:100%;background-color:white;
    overflow-y:scroll;
    //padding-top: 20px;
    //padding-bottom: 20px;
}
.contain>footer{
    flex-basis:30px;width:100%;background-color:red;
}
.dir,.file{
  width:100%;
  background-color:gray;
}
.dir>li{
  width:100%;
  list-style: none;
  border:1px solid black;
  background-color:red;
}
.file>li{
  width:100%;
  list-style: none;
  border:1px solid black;
  background-color:green;
}


dialog{
    height:100%;width:100%;background-color:green;
}
.dialog{
    display: flex;
    height:100%;width:100%;
    flex-direction: column;
}
.dialog>header{
  flex-basis:20px;width:100%;background-color:green;
}
.dialog>footer{
    flex-basis:20px;width:100%;background-color:red;
}
.dialog>section{
    flex-grow:100;width:100%;background-color:white;
    //padding-top: 20px;
    //padding-bottom: 20px;
}
</style>
</head>
<body>
<div class="contain">
    <header>
        <input type="button" value='eval' onclick="eval(page.txt.value)" />
        <input type="button" value='reload' onclick='location.reload()'/>
        <input type="button" value='file' onclick='/*alert(fso.createFile("1.js"))*/'/>
        <input type="button" value="open" onclick='var obj = window.open("about:blank");obj.document.write(page.txt.value);'/>
        <input type="button" value="打开" onclick='window.open(page.name.value);'/>
    </header>
    <div class="main" oncontextmenu="alert()">
    <ul class="dir" ondblclick="msg.dir(event.srcElement.innerHTML)">
      <?php
          $files=getDir("");
          foreach($files["dir"] as $file){
                echo "<li>".$file."</li>";
          }
      ?>
    </ul>
    <div class="file" ondblclick="msg.file(event.srcElement.innerHTML)">
        <?php
          foreach($files["file"] as $file){
                echo "<li>".$file."</li>";
           }
           //echo json_encode($files);
      ?>
    </div>
    </div>
    <footer>
    </footer>
</div>

<dialog id="dialog_dir" onclick="if(this.open){this.close()}">
    <div class="dialog">
    <header>文件夹操作</header>
    <section  onclick="event.stopPropagation();">
        <label for="dir_name">名称:</label>
        <input type="text" id="dir_name" /><br/>
        <input type="button" value="getDir" onclick="fso.getDir(dir_name.value)"/>
        <input type="button" value="createDir" onclick="fso.createDir(dir_name.value)"/>
        <input type="button" value="deleteDir" onclick="fso.deleteDir(dir_name.value)"/>
    </section>
    <footer>
        <menu>
            <button type="button" onclick="">取消</button>
        </menu>
    </footer>
    </div>
</dialog>
<dialog id="dialog_file" onclick="if(this.open){this.close()}">
    <div class="dialog">
    <header>文件操作</header>
    <section  onclick="event.stopPropagation();">
        <label>name:</label>
        <input type="text" id="file_name" /><br/>
        <textarea id="file_txt"></textarea>
        <input type="button" value="getFile" onclick="fso.getFile(file_name.value)"/>
        <input type="button" value="writeFile" onclick="fso.writeFile(file_name.value,file_txt.value)"/>
        <input type="button" value="deleteFile" onclick="fso.deleteFile(file_name.value)"/>
        <input type="button" value="downloadFile" onclick="fso.downloadFile(file_name.value)"/>
    </section>
    <footer>
        <menu>
            <button type="button">取消</button>
        </menu>
    </footer>
    </div>
</dialog>
<script>
    fso={
        async getDir(name){
            alert(name)
            var re=await http.post("","order=getDir&name="+name);
            alert(re);
        },
        async createDir(name){
            if(!confirm("是否创建文件夹:"+name)){return false;}
            var re=await http.post("","order=createDir&name="+name);
            alert(re);
        },
        async deleteDir(name){
            if(!confirm("是否删除文件夹:"+name)){return false;}
            var re=await http.post("","order=deleteDir&name="+name);
            alert(re);
        },
        async getFile(name){
            var re=await http.post("","order=getFile&name="+name);
            alert(re);
        },
        async deleteFile(name){
            if(!confirm("是否删除文件:"+name)){return false;}
            var re=await http.post("","order=deleteFile&name="+name);
            alert(re);
        },
        async writeFile(name,txt){
            if(!confirm("是否写入文件:"+name)){return false;}
            var txt=encodeURIComponent(txt);
            var re=await http.post("","order=getFile&name="+name+"&txt="+txt);
            alert(re);
        },
        async downloadFile(name){
            var re=await http.post("","order=downloadFile&name="+name);
            alert(re);
        }
    }
    msg={
        dir(name){
            dialog_dir.showModal();
            dialog_dir.querySelector("#dir_name").value=name;
        },
        file(name){
            dialog_file.showModal();
            dialog_file.querySelector("#file_name").value=name;
        }
    }
</script>
</body>
</html>
<?php
}
    function getDir($name){
        $path= dirname(__FILE__);
        if($name!=""){
            $path=$path."/".$name;
            $name=$name."/";
        }
        $files=array();
        $files["dir"]=array();
        $files["file"]=array();
        $dir=opendir($path); 
        while(($filename=readdir($dir))!==false){
            if($filename!="." && $filename != ".."){
                //文件夹文件名字为'.'和‘..’，不要对他们进行操作
                if(is_dir($path."/".$filename)){
                    // 如果读取的某个对象是文件夹，则递归
                    $files["dir"][]= $name.$filename;
                }else{
                        $files["file"][]= $name.$filename;
                }
            }
        }
        @closedir($path);
        return $files;
    }

    function getDirAll($name){
        $path= dirname(__FILE__);
        if($name!=""){
            $path=$path."/".$name;
            $name=$name."/";
        }
        $files=array();
        $dir=opendir($path); 
        while(($filename=readdir($dir))!==false){
            if($filename!="." && $filename != ".."){
                //文件夹文件名字为'.'和‘..’，不要对他们进行操作
                if(is_dir($path."/".$filename)){
                    // 如果读取的某个对象是文件夹，则递归
                    $files[]= $name.$filename;
                    $_files=getDivAll($name.$filename);
                    $files=array_merge($files,$_files);
                }else{
                        $files[]= $name.$filename;
                }
            }
        }
        @closedir($path);
        return $files;
    }
    function deleteFile($name){
        return unlink($name);
    }

?>