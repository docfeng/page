<?php
header("Access-Control-Allow-Origin:*");
header("content-type:text/html;charset=utf-8");  //设置编码
header('Access-Control-Expose-Headers:url');
//header('X-Powered-By:daixiaorui.com');
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
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); // https请求 不验证证书和hosts
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    curl_setopt($ch, CURLOPT_ACCEPT_ENCODING, "gzip,deflate");
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/114.80.166.230 Safari/536.11");
    $string = curl_exec($ch);
    //header("url:utt");
    header("url:".curl_getinfo($ch,CURLINFO_EFFECTIVE_URL));
    //echo curl_getinfo($ch,CURLINFO_EFFECTIVE_URL)."<br/>";
    curl_close($ch);
    if(strstr($string,"gbk")||strstr($string,"gb2312")){
        //$string=mb_convert_encoding($string,'UTF-8','auto');
        $string=mb_convert_encoding($string,'UTF-8','gb2312,GBK,UTF-8,ASCII');
    }
    return $string;
}

?>