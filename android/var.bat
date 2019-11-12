setx PATH  "%PATH%;D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51\bin"
pause
setx /M PATH  "%PATH%;D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51\bin"
pause

setx /M JAVA_HOME  "D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51"
setx /M CLASSPATH  ".;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;"
setx PATH  "%PATH%;%JAVA_HOME%\bin;"

