setx PATH  "%PATH%;D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51\bin"
pause
setx /M PATH  "%PATH%;D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51\bin"
pause

setx /M JAVA_HOME  "D:\software\adt-bundle-windows-x86_64-20130729\jdk1.7.0_51"
setx /M CLASSPATH  ".;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;"
setx PATH  "%PATH%;%JAVA_HOME%\bin;"

echo %JAVA_HOME% 
echo %CLASSPATH%
echo %PATH%


rem javac %1

"%JAVA_HOME%/bin/javac" %1

cd %~d1%~p1
"%JAVA_HOME%/bin/java"  %~n1
pause


(1)"JAVA_HOME"，变量值是你的电脑JDK的安装路径，我的是"D:\java\tool\java1.8\JDK"

(2)"Path"，在原变量值的最后面加上”;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin”

(3)”CLASSPATH”，变量值”.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar”

特别注意变量值开头是”.;”（点分号），这个地方需要特别注意




xcopy.exe f:\windows\a.txt d:\
这里面的
%0就是xcopy.exe本身
%1就是f:\windows\a.txt
%2就是d:\
还有扩展。
%~f1就是f:\windows\a.txt
%~d1就是“f:”
%~p1就是“\windows\”
%~n1就是“a”
%~x1就是“.txt”
%~s1就是没有空格的路径
%~a1文件属性
%~t1文件创建时间
%~z1文件大小
扩展的用法
~I - 删除任何引号(")，扩充 %I
%~fI - 将 %I 扩充到一个完全合格的路径名
%~dI - 仅将 %I 扩充到一个驱动器号
%~pI - 仅将 %I 扩充到一个路径
%~nI - 仅将 %I 扩充到一个文件名
%~xI - 仅将 %I 扩充到一个文件扩展名
%~sI - 扩充的路径只含有短名
%~aI - 将 %I 扩充到文件的文件属性
%~tI - 将 %I 扩充到文件的日期/时间
%~zI - 将 %I 扩充到文件的大小


