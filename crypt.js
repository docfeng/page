/*var oStr = "中国人";
var obj = encrypt(oStr,88);
alert(obj);
var objStr = decrypt(obj,88);
alert(objStr);
*/
//对字符串进行加密   
function encrypt(code,i){
    var c=String.fromCharCode(code.charCodeAt(0)+i);  
    for(var i=1;i<code.length;i++){        
        c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
    }     
    return escape(c);
}
//字符串进行解密   
function decrypt(code,i){
    code = unescape(code);        
    var c=String.fromCharCode(code.charCodeAt(0)-i);        
    for(var i=1;i<code.length;i++){        
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
    }        
    return c;
}