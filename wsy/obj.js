obj=function(){
};
obj.prototype.excel=new ActiveXObject("excel.application");
obj.prototype.data="";
obj.prototype.json={};
obj.prototype.index=4;

obj.prototype.open=function(i){
	this.excel.workbooks.open("D:\\fengjie\\电脑\\易联众\\药房\\出入库.xls");
}
obj.prototype.show=function(){
	this.excel.visible=true;
}
obj.prototype.getData=function(i){
	if(!i){
		this.index=this.index+1;
		var i=this.index;
	}else{this.index=i;};
	var excel=this.excel;
	var workbooks=this.excel.workbooks;
	if(workbooks(1)){
		var workbook=workbooks(1)		
	}else{
		var workbook=this.excel.workbooks[0];
	}

	var sheet=workbook.sheets(2);
	var re="序号："+ sheet.cells(i,1).text +
		"名称："+ sheet.cells(i,2).text + "\t" +
		"规格："+ sheet.cells(i,3).text + "\t" +
		"数量："+ sheet.cells(i,4).text + "\t" +
		"单位："+ sheet.cells(i,5).text + "\t" +
		"购入单价："+ sheet.cells(i,6).text + "\t" +
		"购入金额："+ sheet.cells(i,7).text + "\t" +
		"零售单价："+ sheet.cells(i,8).text + "\t" +
		"零售金额："+ sheet.cells(i,9).text + "\t" +
		"批号："+ sheet.cells(i,10).text + "\t" +
		"有效期："+ sheet.cells(i,11).text + "\t" +
		"发票号："+ sheet.cells(i,12).text + "\t" +
		"生产厂家："+ sheet.cells(i,13).text + "\t" +
		"供货单位："+ sheet.cells(i,14).text + "\t" +
		"到货日期："+ sheet.cells(i,15).text ;
	this.data=re;
}

obj.prototype.showData=function(){
	var i=this.index;	
	var excel=this.excel;
	var workbooks=this.excel.workbooks;
	if(workbooks(1)){
		var workbook=workbooks(1)		
	}else{
		var workbook=this.excel.workbooks[0];
	}
	var sheet=workbook.sheets(2);
        var form1=frames[0].frames["mainFrame"].frames[0].from1;
	//发票号
	form1.fph000.value=sheet.cells(i,12).text
	//药品名称
	form1.ypmc00.value=sheet.cells(i,2).text
	//进货日期
	form1.jhrq00.value=sheet.cells(i,15).text
	//批号
	form1.ypph00.value=sheet.cells(i,10).text
	//购进单价
	form1.gjj000.value=sheet.cells(i,6).text
	//零售单价
	form1.lsdj00.value=sheet.cells(i,8).text
	//数量
	form1.ypsl00.value=sheet.cells(i,4).text
	//有效期
	form1.ypsxrq.value=sheet.cells(i,11).text

}

obj.prototype.hide=function(){
	this.excel.visible=false;
}
obj.prototype.close=function(){
	var excel=this.excel;
	var workbooks=this.excel.workbooks;
	if(workbooks(1)){
		var workbook=workbooks(1)		
	}else{
		var workbook=this.excel.workbooks[0];
	}
	workbook.close();
}
obj.prototype.quit=function(){
	var excel=this.excel;
	excel.quit();
}

yaofang=new obj();
