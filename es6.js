es6_support=function(){
    var str="";
    try{
        eval("let a=0");
        str+="let is support\n"
    }catch(e){
        str+="let is'nt support\n"
    }
    try{
        eval("const a=0");
        str+="const is support\n"
    }catch(e){
        str+="const is'nt support\n"
    }
    try{
        eval("var a=async function(a){}");
        str+="async is support\n"
    }catch(e){
        str+="async is'nt support\n"
    }
    
    return str;
}
alert(es6_support())