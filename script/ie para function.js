var obj=RuntimeObject();
var re="";
for(var item in obj){
  if(typeof obj[item]==="function"){
    re+=item + "\t" + (typeof(obj[item])==="object") + "\t" +obj[item]+"\n\n"
  }
}
alert(re)
