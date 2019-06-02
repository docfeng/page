if(!-[1,]){
 warn=function(txt){alert(txt)}
}else{
  warn=function(txt){
  	  if(txt){chrome.speak(txt);}
  	  else{chrome.shock();}
  	}
} 
