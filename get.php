<?php
header("Access-Control-Allow-Origin:*");
header("content-type:text/html;charset=utf-8");  //设置编码
if ($_SERVER["REQUEST_METHOD"] == "POST") { 
  if($_POST["url"]){
      $string=get_html($_POST["url"]);
      echo $string; 
  }
}
else { 
  if($_GET["url"]) 
  {
      $string=get_html($_GET["url"]);
      echo $string;
  }
}

function get_html($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
    curl_setopt($ch, CURLOPT_HEADER,0);
    $string = curl_exec($ch);
    curl_close($ch);
    if(strstr($string,"gbk")||strstr($string,"gb2312")){
        //$string=mb_convert_encoding($string,'UTF-8','auto');
$string=mb_convert_encoding($string,'UTF-8','gb2312');
    }
    return $string;
}

?>