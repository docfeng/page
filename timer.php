<?php 
echo "1";
ignore_user_abort(true); //即使Client断开(如关掉浏览器)，PHP脚本也可以继续执行. 
set_time_limit(0); // 执行时间为无限制，php默认的执行时间是30秒，通过set_time_limit(0)可以让程序无限制的执行下去 
$interval=60*1; // 每隔1分钟运行
$f = 'lock.txt';
echo "2";

if(file_exists($f)){ //判断标记文件是否存在，存在就退出，防止重复运行
  echo "hash file";
  exit();
}

echo "3";
$i=0;
do{
    echo $i;
    @file_put_contents($f,'run');
    echo "4";
    //重复写入一个文件，标志已经运行计划任务
    $string=get_html("http://www.baidu.com");
    $i=$i+1;
    @file_put_contents("i.txt",$i."\n\n\n".$string);
    echo "5";
    sleep($interval);//程序暂停n分钟
    if(read($f) == 'stop'){
        echo "stop";
        //设置停止条件, 停止的时候只要向 lock.txt 写入 stop
        @unlink($f); //删除标记文件
        exit();
        break;
    }
}while(true);


function read($path){
    $myfile = fopen($path, "r") or die("Unable to open file!");
    $str=fread($myfile,filesize($path)); 
    fclose($myfile);
    return $str;
}
function get_html($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_HEADER,0);
    $string = curl_exec($ch);
    curl_close($ch);
    //if(strstr($string,"gbk")||strstr($string,"gb2312")){
        $encode = mb_detect_encoding($string, array("ASCII",'UTF-8',"GB2312","GBK",'BIG5'));
     
  $string=mb_convert_encoding($string,'UTF-8',$encode);
    //}
    return $string;
}


?>