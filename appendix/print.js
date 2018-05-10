/////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : print.js
//  version : 3.5 g1207  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////

function HD_printAllFlash() {
	document.dBook.handle_pagePrintAll();
}

function HD_printExFlash(strPrintPages) {	
	var arrPages = strPrintPages.split(",");
	if (arrPages.length == 1)
	{
		document.dBook.handle_pagePrintEx( arrPages[0], arrPages[0]);
	}
	else if (arrPages.length == 2)
	{
		document.dBook.handle_pagePrintEx(arrPages[0], arrPages[1]);
	}
	else {
		alret("Fail to print");
	}
}

function HD_parseNPrintFlash(strPrintPages) {
	document.dBook.handle_pagePrint(strPrintPages);
}

function HD_parseNPrintPDF(strPrintPages) {

	var strMediaURL = document.dBook.handle_getMediaURL();	 
	 
	if(strMediaURL != "null" && strMediaURL != "")
	{
		alert (MSG_PRINT_002);
		return;	 
	}	
	
	try
	{
		var strDelimeter;
		if (strPrintPages.indexOf("-") > 0)
			strDelimeter = "-";
		else 
			strDelimeter = "~";
		
		var arrPages = strPrintPages.split(strDelimeter);
	
		if (arrPages.length == 1)
		{			
			printPageRangePDF( arrPages[0], arrPages[0]);
		}
		else if (arrPages.length == 2)
		{
			var slideTot = document.dBook.handle_getSlideTotal();
			if(arrPages[0] > slideTot) arrPages[0] = slideTot;
			if(arrPages[1] > slideTot) arrPages[1] = slideTot;
			
			if(arrPages[0] < 1) arrPages[0] = 1;
			if(arrPages[1] < 1) arrPages[1] = 1;
			
			startPage = parseInt(arrPages[0], 10) -1;
			endPage = parseInt(arrPages[1], 10) -1;
			if(startPage > endPage)
			{
				var temp = arrPages[0];
				arrPages[0] = arrPages[1];
				arrPages[1] = temp;
			}

			// dckim 20051207 start ***************************************
			if((endPage - startPage) > 9) 
			{
				alert(MSG_PRINT_001);
				return;
			}
			else 
			{
				printPageRangePDF(arrPages[0], arrPages[1]);
			}

		}
		else
		{
			alret("Fail to print");
		}
	} catch(e) {}
}

function HD_parseNPrintWeb(strPrintPages)
{
	// For check HDM format... This is possible only 3Dmall format...
	var strMediaURL = document.dBook.handle_getMediaURL();	 
	 
	// If HDM format
	if(strMediaURL != "null" && strMediaURL != "")
	{
		alert (MSG_PRINT_002);
		return;	 
	}	
	
	try
	{
		var strDelimeter;
		if (strPrintPages.indexOf("-") > 0)
			strDelimeter = "-";
		else 
			strDelimeter = "~";
		
		var arrPages = strPrintPages.split(strDelimeter);
	
		if (arrPages.length == 1)
		{			
			printPageRange( arrPages[0], arrPages[0]);
		}
		else if (arrPages.length == 2)
		{
			var slideTot = document.dBook.handle_getSlideTotal();
			if(arrPages[0] > slideTot) arrPages[0] = slideTot;
			if(arrPages[1] > slideTot) arrPages[1] = slideTot;
			
			if(arrPages[0] < 1) arrPages[0] = 1;
			if(arrPages[1] < 1) arrPages[1] = 1;
			
			startPage = parseInt(arrPages[0], 10) -1;
			endPage = parseInt(arrPages[1], 10) -1;
			if(startPage > endPage)
			{
				var temp = arrPages[0];
				arrPages[0] = arrPages[1];
				arrPages[1] = temp;
			}

			// dckim 20051207 start ***************************************
			if((endPage - startPage) > 9) 
			{
				alert(MSG_PRINT_001);
				return;
			}
			else 
			{
				/* Flash 프린트 코멘드 Offset 조정 pst
				// 20061012 yjs begin
				if(gPageOffset > 0){
					var editPage1 = _printOffset(arrPages[0]);
					var editPage2 = _printOffset(arrPages[1]);
					printPageRange(editPage1, editPage2);
				}else{
				// 20061012 yjs end
					printPageRange(arrPages[0], arrPages[1]);
				}
				*/
				printPageRange(arrPages[0], arrPages[1]);
			}

		}
		else
		{
			alret("Fail to print");
		}
	} catch(e) {}

	document.dBook.focus();
}

function printPageRangePDF(startPage, endPage) 
{
	if(isNaN(startPage)){
		if ( document.dBook.handle_isDoublePage() ){
			startPage = document.dBook.handle_getLeftSlidePage() - 1;
			endPage = startPage + 1;
		}else{
			startPage = document.dBook.handle_getCurSlidePage() - 1;
			endPage = startPage;
		}
	}
	// dckim 20051207 end ***************************************
	
	var startPageTemp = 0;
	var endPageTemp = document.dBook.handle_getSlideTotal();
	if (startPage < startPageTemp)
	  startPage = startPageTemp;
	if (endPage > endPageTemp)
	  endPage = endPageTemp;
	if (startPage > endPage)
	  return;
	
	// fitstpage offset
	/////////////////////////////////////////
	var start = parseInt(startPage) - 1;
	var end = parseInt(endPage) - 1;
	startPage = start + "";
	endPage = end + "";
	/////////////////////////////////////////

	var totalPage = HD_getSlideTotal();
	totalPage = String(totalPage);
	
	if (totalPage.length == 1) // totalpage : 1~9, 1.pdf~9.pdf
	{
		startPage = startPage;
	}else if(totalPage.length == 2){ // totalpage : 10~99, 01.pdf~99.pdf
		if(startPage.length == 1){
			startPage = "0"+startPage;
		}
	}else if(totalPage.length == 3){ // totalpage : 100~999, 001.pdf~999.pdf
		if(startPage.length == 1){
			startPage = "00"+startPage;
		}else if(startPage.length == 2){
			startPage = "0"+startPage;
		}
	}else if(totalPage.length == 4){  // totalpage : 1000~9999, 0001.pdf~9999.pdf
		if(startPage.length == 1){
			startPage = "000"+startPage;
		}else if(startPage.length == 2){
			startPage = "00"+startPage;
		}else if(startPage.length == 3){
			startPage = "0"+startPage;
		}
	}

	var tempWindow = "";

	var pdfServerUrl = "http://catalog.ykkap.co.jp/webcatalog/data/"; // PDF File Location Server MAin URL
	var dBookCode = document.dBook.handle_getImageName(); // dBook 3dmall name(Catalog Code)
	var delmi = dBookCode.lastIndexOf("__3dmall");
	dBookCode = dBookCode.substring(0, delmi);
	var printPDFUrl= pdfServerUrl + dBookCode + "/" + startPage + ".pdf";  // PDF File Location (Server)
	
	// same domain use - all page exception process 
	/*
	var xmlHTTP; 
	xmlHTTP = new ActiveXObject("Microsoft.XMLHTTP"); // Check the PDF File.
	xmlHTTP.open("GET", printPDFUrl, false);
	xmlHTTP.send();
	xResult = xmlHTTP.status;
	if (xResult == 404){
		alert(startPage + ".pdf が見つかりません。");
	}else{
		printWindow=window.open(printPDFUrl,tempWindow,'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=0, top=0, width=700,height=600');
		printWindow.focus();
	}
	*/
	/////////////////////////////////////////////////////////////////////////////////////

	// not same domain use - first page exception process
	
	if (startPage == 0 || startPage == 00 || startPage == 000 || startPage == 0000){
		alert(startPage + " が見つかりません。");
	}else{
		printWindow=window.open(printPDFUrl,tempWindow,'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=0, top=0, width=700,height=600');
		printWindow.focus();
	}
	
	//////////////////////////////////////////////////////////////////////////////////////
}

function printPageRange(startPage, endPage) 
{
	// Renewal Page
	startPage = parseInt(startPage, 10) -1;
	endPage = parseInt(endPage, 10) -1;

	// dckim 20051207 start ***************************************
	if(isNaN(startPage))
	{
		if ( document.dBook.handle_isDoublePage() )
		{
			startPage = document.dBook.handle_getLeftSlidePage() - 1;
			endPage = startPage + 1;
		}
		else
		{
			startPage = document.dBook.handle_getCurSlidePage() - 1;
			endPage = startPage;
		}
	}
	// dckim 20051207 end ***************************************
	
	var startPageTemp = 0;
	var endPageTemp = document.dBook.handle_getSlideTotal() -1;
	if (startPage < startPageTemp)
	  startPage = startPageTemp;
	if (endPage > endPageTemp)
	  endPage = endPageTemp;
	if (startPage > endPage)
	  return;
	  
	var tempFile= "";
	var tempWindow = "";
	
	var urlBase = document.dBook.BaseHref;
	var urlCodeBade = document.dBook.codeBase;
	var imageFilePathBase=GetFileFullPath();

	if(SourcePathFlag==1) imageFilePathBase = "http://" + imageFilePathBase
	var strImageNamePref = document.dBook.image_name;

	//Check this point
	strImageNamePref = document.dBook.handle_getImageName();

	var baseWidth = 650;
	var baseHeight = 970;
		
	var zoomLevel=1;
	var imageWidth=baseWidth; 
	var imageHeight=baseHeight;
	
	var printWidth; 
	var printHeight;
	
	try
	{
		zoomLevel = parseInt(document.dBook.handle_getTotalZoomStep());
		imageWidth = parseInt(document.dBook.handle_getPageWidth());
		imageHeight= parseInt(document.dBook.handle_getPageHeight());
	} catch(e) { zoomLevel=1; imageWidth=baseWidth; imageHeight=baseHeight;}
	
	// dckim 20051207 start ***************************************
	// If all zoom level=0 image print.....
	// Then only zoomLevel=1 
	// dckim 20051207 end ***************************************
	
	var tempRatio;
	tempRatio = imageWidth/imageHeight;
	baseRatio = baseWidth/baseHeight;
	
	var printWidth; 
	var printHeight;
	var vertMargin;
	
	if(baseRatio > tempRatio )
	{
		printHeight = baseHeight;
		printWidth = printHeight * tempRatio; 
	}
	else
	{
		printWidth = baseWidth;
		printHeight = printWidth / tempRatio; 
	}
	vertMargin = baseHeight - printHeight;

	// dckim 20051207 start ***************************************
	if(zoomLevel == 1)
	{
		printWidth = printWidth/2;
		printHeight = printHeight/2; 
	}
	else
	{
		if(zoomLevel > 1)
		{
			printWidth = printWidth/4;
			printHeight = printHeight/4; 
		}
	}
	// dckim 20051207 end ***************************************
		
	var strSize = "width=" + parseInt(printWidth) + " height=" + parseInt(printHeight);
	
	urlCodeBade = strImageNamePref.substring(0, strImageNamePref.length-2);	
	
	var imageFilePath = imageFilePathBase + urlCodeBade + "/"+ strImageNamePref;
	imageFilePath = unescape(imageFilePath);

    printWindow=window.open(tempFile,tempWindow,'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,left=0, top=0, width=700,height=600');

	printWindow.document.writeln("<HTML>");
	printWindow.document.writeln("<head>");
	printWindow.document.writeln("<scr"+"ipt lang" + "uage=jav"+"ascript>");
	printWindow.document.writeln("    funct" + "ion printPage() {");
	
	printWindow.document.writeln("    window.print()");
			
	printWindow.document.writeln("		setTimeout('window.close()', 1000);");
	printWindow.document.writeln("    } ");
	printWindow.document.writeln("</scr"+"ipt>");
	printWindow.document.writeln("</head>");
	printWindow.document.writeln("<BODY onLoad = \"Javascript:printPage();\">");

	printWindow.document.writeln("<center>");
	
	
	// dckim 20051207 start ***************************************
	var nPage;
	for(nPage=startPage; nPage<=endPage; nPage++){
		if(zoomLevel == 0)
		{
			printWindow.document.writeln("<table border='0' cellspacing='0' cellpadding='0' topmargin='0' marginwidth='0' marginheight='0' page-break-inside='avoid' page-break-after='always'>");
			printWindow.document.writeln("<tr>");
			printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + ".jpg\" "+strSize+"></td>");
			printWindow.document.writeln("</tr>");
			printWindow.document.writeln("</table>");
		}
		else
		{
			if(zoomLevel == 1)
			{
				printWindow.document.writeln("<table border='0' cellspacing='0' cellpadding='0' topmargin='0' marginwidth='0' marginheight='0' page-break-inside='avoid' page-break-after='always'>");
					printWindow.document.writeln("<tr><tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__2by2__0.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__2by2__1.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr>");
				
					printWindow.document.writeln("<tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__2by2__2.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__2by2__3.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr></tr>");
				printWindow.document.writeln("</table>");
			}
			else
			{
				printWindow.document.writeln("<table border='0' cellspacing='0' cellpadding='0' topmargin='0' marginwidth='0' marginheight='0' page-break-inside='avoid' page-break-after='always'>");
					printWindow.document.writeln("<tr><tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__0.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__1.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__2.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__3.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr>");
				
					printWindow.document.writeln("<tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__4.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__5.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__6.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__7.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr>");
					
					printWindow.document.writeln("<tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__8.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__9.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__10.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__11.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr>");
					
					printWindow.document.writeln("<tr>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__12.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__13.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__14.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("<td><img src=\"" + imageFilePath + nPage + "__4by4__15.jpg\" " + strSize + "></td>");
					printWindow.document.writeln("</tr></tr>");
				printWindow.document.writeln("</table>");
			}
		}
		// Print Margin
		if(vertMargin > 10) {
			printWindow.document.writeln("<td><img src=appendix/printMargin.JPG " + "width=" + parseInt(baseWidth) + " height=" + parseInt(vertMargin) + "></td>");
		}	
	}
	// dckim 20051207 end ***************************************
	
	
	printWindow.document.writeln("</center>");

	printWindow.document.writeln("</BODY>");
	printWindow.document.writeln("</HTML>");
	printWindow.location.reload();

	//printWindow.setTimeout("printPage()", 1000);
	//printWindow.setTimeout("window.close()",1000);
}
