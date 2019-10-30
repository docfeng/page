var args = WScript.Arguments;

var read=function(path,CharSet){
 var str="";
 var stm=new ActiveXObject("adodb.stream")
 stm.Type=2//以本模式读取
 stm.mode=3 
 stm.charset=CharSet
 stm.open()
 stm.loadfromfile(server.MapPath(path))
 str=stm.readtext()
 stm.Close()
 stm=null;
 return  str
End Function
'函数名称：WriteToTextFile
'作用：利用Adodb.Stream对象来写入UTF-8编码的文件
'示例：WriteToTextFile("File/FileName.htm",Content,UTF-8)
Sub WriteToTextFile(FileUrl,byval Str,CharSet)
 set stm=server.CreateObject("adodb.stream")
 stm.Type=2'以本模式读取
 stm.mode=3
 stm.charset=CharSet
 stm.open
 stm.WriteText str
 stm.SaveToFile server.MapPath(FileUrl),2 
 stm.flush
 stm.Close
 set stm=nothing
End Sub







try {
	var fso=new ActiveXObject("Scripting.FileSystemObject");
	var list=[];
	var f=fso.GetFolder(args(0));
	var path=fso.GetParentFolderName(f.path)
	var name=f.Name;
	path=path+"\\"+name
	WScript.Echo(path);
	var file=fso.CreateTextFile(path+".js", true);
	var fc = new Enumerator(f.files);  
    for (; !fc.atEnd(); fc.moveNext()) {  
        list.push(fc.item());
		//var txt=fso.GetFile(fc.item()).OpenAsTextStream(1).readAll();
		var txt=fso.openTextFile(fc.item(),true,0).readAll()
		file.write(txt);
    } 
	WScript.Echo("111");
	file.Close();
	if (args.length == 0) {
		throw "No Argument";
	} else {
		WScript.Echo(args(0));
	}
} catch (e) {
	WScript.Echo(e);
}
