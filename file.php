<?php
$filename=$_GET["filename"];
//echo $filename;
if($filename){
    $cmd=$_GET["cmd"];
    switch($cmd){
        case "download":
            Header('content-disposition:attachment;filename='.basename($filename));//告诉网页是以附件方式下载
            Header('content-length:'.filesize($filename));//告诉网页文件大小
            readfile($filename);
            break;
        case "zip":
            echo "zip";
            break;
        default:
        echo "default";
        
    }
    die();
}else if ($_FILES["file"]){
    if ($_FILES["file"]["error"] > 0){
        echo "Error: " . $_FILES["file"]["error"] . "<br />";
    }else{
        echo "Upload: " . $_FILES["file"]["name"] . "<br />";
        echo "Type: " . $_FILES["file"]["type"] . "<br />";
        echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
        echo "Stored in: " . $_FILES["file"]["tmp_name"]."<br />";
        $name= $_POST["filename"];
        if(!$name){
            $name=$_FILES["file"]["name"];
        }
        if (file_exists($name)){
            echo $name . " already exists. ";
        }else{
            move_uploaded_file($_FILES["file"]["tmp_name"],$name);
            echo "Stored in: " . $name;
        }
    }
    die();
}
?>
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
</head>
<body>
<input type=text id="filename" />
<button onclick="window.open('?cmd=download&filename='+filename.value)">下载</button><br />
<button onclick="window.open('?cmd=zip&filename='+filename.value)">压缩</button><br />
<button onclick="window.open('?cmd=download&filename='+filename.value)">解压</button><br />
<form action="" method="post" enctype="multipart/form-data">
    <label for="file">Filename:</label>
    <input type="file" name="file" id="file" /> 
    <input type="text" name="filename" />
    <br />
    <input type="submit" name="submit" value="Submit" />
</form>

</body>
</html>
