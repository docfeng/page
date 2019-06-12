shock=function(a){
  navigator.vibrate = navigator.vibrate
               || navigator.webkitVibrate
               || navigator.mozVibrate
               || navigator.msVibrate;
  if (navigator.vibrate) {
    navigator.vibrate(a);
  } else if (navigator.webkitVibrate) {
    navigator.webkitVibrate(a);
  }
}
shock([500,500,300,500,400,500])
