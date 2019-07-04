<?php
$files = ["zip.php","main.php"];
$filename = "test.zip";
function createZip($files,$filename){
    $zip = new ZipArchive();
    if ($zip->open($filename, ZIPARCHIVE::CREATE) !== TRUE) {
        exit ('无法打开文件，或者文件创建失败');
    }
    $zip->open($filename,ZipArchive::CREATE);   //打开压缩包
    foreach ($files as $file) {
        $zip->addFile($file,basename($path));
        //向压缩包中添加文件
    }
    $zip->close();  //关闭压缩包
}
createZip($files,$filename);
?>