//////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : mediaLink.js
//  version : 3.4 g1120  (made by Humandream, Inc.)
//
//////////////////////////////////////////////////////

// user option about movie embed ===============================

var g_movie_autostart = true;			// whether display moive when a page changed. 	(true or false)
var g_movie_playcount = 0;			// g_movie_playcount > -1 (0 is unlimited play count)
var g_movie_showcontrols = 0;		// whether show control bar (0 or 1)
var g_movie_showloading = false;			// whether show loading animation before show movie (true or false)
var g_movie_loadingpath = "images/up_menu_01.gif";		// loading animation path
var g_movie_loadingerrorpath = "images/up_menu_06.gif";		// loading animation path

//==============================================================
var g_bViewMedia = true;
var g_TimerID,g_TimerRunning=false;

var g_ZoomLevelPrev=0;
var g_ZoomAreaLeftPrev=0;
var g_ZoomAreaTopPrev=0;

var g_maxMediaNum=21;
var g_mediaNum=0;
var g_arrMediaType = new Array("flash","movie","music","vrmall","image","html","url");
var g_arrMedia = new Array(g_maxMediaNum);
var g_mediaType = new Array(g_maxMediaNum);
var g_mediaURL = new Array(g_maxMediaNum);   //Movie,Flash,Music, Vrmall,autocad
var g_mediaPage = new Array(g_maxMediaNum);
var g_mediaLeft = new Array(g_maxMediaNum);
var g_mediaTop = new Array(g_maxMediaNum);
var g_mediaWidth = new Array(g_maxMediaNum);
var g_mediaHeight = new Array(g_maxMediaNum);

var g_isDPage, g_isVertical=0;
var g_isFullScreen = 0;

for(var i=0;i<g_maxMediaNum;i++){
	g_arrMedia[i]="mediaFrame"+i;
	g_mediaURL[i]="";
	g_mediaPage[i]="";
	g_mediaLeft[i]=0;
	g_mediaTop[i]=0;
	g_mediaWidth[i]=0;
	g_mediaHeight[i]=0;
}

	var nSkinLeft=0;
	var nSkinTop = 42;
	var nSkinRight = 5;
	var nSkinBottom = 5;
	var curPos="left_top";
	var iPosX = nSkinLeft;
	var iPosY = nSkinTop;
	var g_haveBoard="n";
	var g_bDbookExtend="n";

//var intentionEr = true;   // yjs20061102
var intentionEr = false;   // yjs20061102

// yjs20061102 start
function callErFlag()
{
	intentionEr = false;
}
// yjs20061102 end

// 미디어 관련 속성 
function HD_mediaSetAutoStart(autostart)
{
	g_movie_autostart = autostart;
}

function HD_mediaSetShowControls(showcontrol)
{
	g_movie_showcontrols = showcontrol;
}

function InitMediaVariables()
{
  try{
  	document.all["DBookflash"].style.width=document.all["dBook"].width;
  	document.all["DBookflash"].style.height=document.all["dBook"].height;

	// yjs20061102 start
	if(intentionEr){
		var temp = document.getElementsByName("DBookflash");	//intention error code
		temp.style.width = x;                               //intention error code
	}
	// yjs20061102 end - sunJRE 1.5.0_06이하 버전의 버그로서 이올라스 패치후 
	//                   applet hang이 걸려 정상적인 실행이 되지않는 경우 방지

  	//g_isDPage = parseInt(document.dBook.handle_isDoublePage());
  	if(document.dBook.handle_isDoublePage())
  		g_isDPage = 1;
  	else
  		g_isDPage = 0;
  	
  	var page;
  	if( g_isDPage == 1){
  		var pageHeight = document.dBook.handle_getPageHeight()*1;
  		var nViewerHeight = document.dBook.handle_getBookAreaBottom() -  document.dBook.handle_getBookAreaTop();
  		if(nViewerHeight == 2*pageHeight){
  			g_isVertical=1;
  		}else{
  			g_isVertical=0;
  		}
  		page=document.dBook.handle_getLeftSlidePage();
  		if((page%2)==0){
  			page=page-1;
  		}
  	}	else{
  		page = document.dBook.handle_getCurSlidePage();
  	}  	
  	//g_isFullScreen = getIsFullScreen();
  }catch(e){
  	setTimeout("InitMediaVariables()",300);
  }
}

function DestroyMediaVariables() {
	if(g_TimerRunning) {
		g_TimerRunning = false;
		clearTimeout(g_TimerID);
	}
}

function MediaTimeService()
{
	MediaRefleshView();
    
	if(g_TimerRunning) {
		g_TimerID = setTimeout("MediaTimeService()",300);
	}
	
	if(!g_bViewMedia)	{
		g_TimerRunning=false;
		clearTimeout(g_TimerID);
	}
}

function MediaRefleshView() 
{
	var ZoomLevel=dBook.handle_getCurrZoomStep();
	var ZoomAreaLeft=dBook.handle_getZoomAreaLeft();
	var ZoomAreaTop=dBook.handle_getZoomAreaTop();
	if(ZoomLevel != g_ZoomLevelPrev || ZoomAreaLeft != g_ZoomAreaLeftPrev || ZoomAreaTop!=g_ZoomAreaTopPrev){
		g_ZoomLevelPrev = ZoomLevel;
		g_ZoomAreaLeftPrev = ZoomAreaLeft;
		g_ZoomAreaTopPrev = ZoomAreaTop;
		
		for(var i=0;i<g_mediaNum;i++)
			viewMediaFrame(g_arrMedia[i]);			
	}
}

//******************************************************************************************
var g_mediaPageNum=0;
function playPageMedia(bDouble,page,autostart){
	
	if(g_mediaPageNum!=page){
		if(g_bViewMedia){
			if (g_LinkDataType == "txt")
			{
				//alert("g_mediaPageNum = " +g_mediaPageNum + ", bDouble = " + bDouble + ", page = " + page + ", autostart = "  + autostart + ", g_bViewMedia = " + g_bViewMedia);
  		 		playPageMediaFunction_txt(bDouble,page,autostart);
  			}
		}
	}
	g_mediaPageNum=page;
}

function getTextParamValue(param, key)
{
  var arrParam = param.split(';');
  for (i=0; i<arrParam.length; i++)
  {
    if (arrParam[i].indexOf(key) == 0)
      return arrParam[i].substring(key.length+1);
  }
  
  return null;
}

function playPageMediaFunction_txt(bDouble,page,autostart)
{
	try
	{
		var oMediaLink, strScript, nPageValue;

		var strLinkIDs;	
		var arrLinks, arrLinks2;
		var strLinkParam = new Array();
		var nFirstLinkSize = 0;

		// left page's links
		strLinkIDs = dBook.handle_getLinkIDFromPage(page);		
		if (strLinkIDs != null && strLinkIDs.length > 0)
		{  
			arrLinks = strLinkIDs.split(';');
			nFirstLinkSize = arrLinks.length;

			for (i=0; i<arrLinks.length; i++)
			{
				strLinkParam[i] = dBook.handle_getLinkParam( parseInt(arrLinks[i]) );				
			}
		}

		// right page's links
		if(bDouble)
		{
			strLinkIDs = dBook.handle_getLinkIDFromPage(page+1);
			//alert(strLinkIDs);
			if (strLinkIDs != null && strLinkIDs.length > 0)
			{
				arrLinks2 = strLinkIDs.split(';');
				for (i=0; i<arrLinks2.length; i++)
				{
				strLinkParam[i+nFirstLinkSize] = dBook.handle_getLinkParam( parseInt(arrLinks2[i]) );
				//alert(strLinkParam[i+nFirstLinkSize]);
				}
			}
		}

		var nTmp1;
		var theURL,thePage, x1,y1,x2,y2, theArea, arrTheArea,theLink="";
		for(var i=0;i<strLinkParam.length;i++)
		{
			//alert("strLinkParam.length = " + strLinkParam.length + ", i = " + i);
			strScript = getTextParamValue(strLinkParam[i], "url");
			var isMedia = 0;
			var media;
			media = "";

			try
			{
				media = getTextParamValue(strLinkParam[i], "comment");
				isMedia = media.search("media_");
				media = media.substring("media_".length);
				if(isMedia < 0) 
					media = "";
			} catch (e1) 	{ media = ""; }
						

			if(media != "")
			{
				if(media=="music")
				{
					strScript = "musicTo('" + strScript + "');";

					eval(strScript);
				}
				else
				{
					thePage = parseInt( getTextParamValue(strLinkParam[i], "pageNum") );
					theURL = strScript;					

					arrTheArea = new Array();
					arrTheArea[0] = parseInt( getTextParamValue(strLinkParam[i], "posX") );
					arrTheArea[1] = parseInt( getTextParamValue(strLinkParam[i], "posY") );
					arrTheArea[2] = parseInt( getTextParamValue(strLinkParam[i], "pos2X") );
					arrTheArea[3] = parseInt( getTextParamValue(strLinkParam[i], "pos2Y") );

					x1 = arrTheArea[0];
					y1 = arrTheArea[1];
					x2 = arrTheArea[2];
					y2 = arrTheArea[3];
					
					mediaTo(theURL,thePage, x1,y1,x2,y2,media,theLink);
				}
			}
		}

	}catch(e){ }	
}

function playPageMediaFunction(bDouble,page,autostart,media){
		try{
			var strXPath, oMediaLink, strScript, nPageValue;
			if(autostart){
				if(bDouble)
					strXPath = "LinkObject[(Location/@value='"+page+"' or Location/@value='"+(page*1+1)+"') and Target/@autostart='yes' and contains(Target/@value , 'javascript:"+media+"To')]";
				else
					strXPath = "LinkObject[Location/@value='"+page+"' and Target/@autostart='yes' and contains(Target/@value , 'javascript:"+media+"To')]";
			}else{
				if(bDouble)
					strXPath = "LinkObject[(Location/@value='"+page+"' or Location/@value='"+(page*1+1)+"') and contains(Target/@value , 'javascript:"+media+"To')]";
				else
					strXPath = "LinkObject[Location/@value='"+page+"' and contains(Target/@value , 'javascript:"+media+"To')]";				
			}
			oMediaLink = g_objLinkList.selectNodes(strXPath);
			
			var nTmp1;
			var theURL,thePage, x1,y1,x2,y2, theArea, arrTheArea,theLink="";
			for(var i=0;i<oMediaLink.length;i++){
				strScript = oMediaLink.item(i).selectSingleNode("Target").attributes.getNamedItem("value").value;
				if(media=="music"){
					eval(strScript);
				}else{
					thePage = oMediaLink.item(i).selectSingleNode("Location").attributes.getNamedItem("value").value;
					nTmp1 = strScript.indexOf("'");
					theURL = strScript.substring(nTmp1+1,strScript.indexOf("'", nTmp1+1));					
					theArea = 	oMediaLink.item(i).selectSingleNode("Source").attributes.getNamedItem("value").value;	
					arrTheArea = theArea.split(";");
					x1 = arrTheArea[0];
					y1 = arrTheArea[1];
					x2 = arrTheArea[2];
					y2 = arrTheArea[3];
					
					if(media=="html"){
						var re = /:t_divide:/g;
						theURL = theURL.replace(re,";");
						
						re =new RegExp("&lt;","g");
						theURL = theURL.replace(re,"<");
						
						re =new RegExp("&gt;","g");
						theURL = theURL.replace(re,">");
					
						re =new RegExp("&gt;","g");
						theURL = theURL.replace(re,">");
						
						re = /:rest:/g;
						theURL = theURL.replace(re,",");
						re = /:s_quotation:/g;
						theURL = theURL.replace(re,"'");
						re = /:d_quotation:/g;
						theURL = theURL.replace(re,"\"");
					}else if(media=="image"){
						arrTheArea = strScript.split(",");
						theLink = arrTheArea[6];
						nTmp1 = theLink.indexOf("'");
						theLink = theLink.substring(nTmp1+1,theLink.indexOf("'", nTmp1+1));
					}
		
					mediaTo(theURL,thePage, x1,y1,x2,y2,media,theLink);
				}
			}

		}catch(e){}	
}

function stopAllMediaFrame(){
	mediaStop();
	try{
		for(var i=0;i<g_arrMedia.length;i++){
			hideMediaFrame(g_arrMedia[i]);			
		}
	}catch(e){}
	g_mediaNum=0;
	g_mediaPageNum=0;
}

var g_objLinkParam, g_objLinkList;

function getFrameGap(curZoomStep,pos){
	if(pos=="left"){
		if(curZoomStep==0) return 3;
		else if(curZoomStep==1) return 5;
		else if(curZoomStep==2) return 5;
		else if(curZoomStep==3) return 5;
	}else if(pos=="top"){
		if(curZoomStep==0) return 3;
		else if(curZoomStep==1) return 3;
		else if(curZoomStep==2) return 4;
		else if(curZoomStep==3) return 4;		
	}else if(pos=="width"){
		if(curZoomStep==0) return 6;
		else if(curZoomStep==1) return 4;
		else if(curZoomStep==2) return 3;
		else if(curZoomStep==3) return 3;			
	}	else if(pos=="height"){
		if(curZoomStep==0) return 6;
		else if(curZoomStep==1) return 6;
		else if(curZoomStep==2) return 5;
		else if(curZoomStep==3) return 5;			
	}
}

function getMediaArrayNum(media){
	var m=0;
	for(var i=0;i<g_arrMedia.length;i++){
		if(g_arrMedia[i]==media){
			m=i;
			break;
		}
	}
	return m;
}

function musicTo(theURL){
	var m=g_mediaNum;
	for(var i=0;i<g_mediaNum;i++){
		if(g_mediaURL[i]==theURL){
			m=i;
			break;
		}else{
			m=g_mediaNum;			
		}
	}
	if(document.frames("mediaFrame"+m).document.body.innerHTML==""){
		var oMusic="<embed type=\"application/x-mplayer2\" src=\""+ theURL + "\" autostart=\"1\"></embed>";
		document.frames("mediaFrame"+m).document.body.innerHTML = oMusic;
		g_mediaType[m]="music";
		g_mediaURL[m]=theURL;
		g_mediaNum++;
	}else{
		document.frames("mediaFrame"+m).document.body.innerHTML = "";
	}
}

function mediaStop(){
	/* 페이지를 넘기면 즉시, 예전 페이지의 영상을 정지시킨다.*/
	try{
		mediaFrame0.document.MoviePlayer.Stop();
		mediaFrame0.document.MoviePlayer.CurrentPosition = 0;
	}catch(e){
	}
}

function mediaTo(theURL,thePage, x1,y1,x2,y2, media,theLink){
	//alert("mediaTo media = " + media + ", g_bViewMedia = " + g_bViewMedia);
	if(g_bViewMedia)
	{
		if(media==null)
			return;
		if(media=="music"){
			musicTo(theURL);
		}
		var m=g_mediaNum;
		g_mediaType[m]= media;
		g_mediaLeft[m] = x1;
		g_mediaTop[m] = y1;
		g_mediaWidth[m] = x2-x1;
		g_mediaHeight[m] = y2-y1;
		g_mediaPage[m] = thePage;
		g_mediaURL[m] = theURL;
		var oHTML="";

		/*
		if(media=="flash"){
			oHTML="<OBJECT id=\"FlashPlayer\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\" WIDTH=\"100%\" HEIGHT=\"100%\">";
			oHTML = oHTML + "<PARAM NAME=\"Movie\" VALUE=\""+theURL+"\">";
			oHTML = oHTML + "<param NAME=\"Play\" VALUE=\"True\">";
			oHTML = oHTML + "<param NAME=\"Loop\" VALUE=\"False\">";
			oHTML = oHTML + "<param NAME=\"Quality\" VALUE=\"High\">";
			oHTML = oHTML + "<param NAME=\"Scale\" VALUE=\"ExactFit\">";
			oHTML = oHTML + "</OBJECT>"	
			//alert(oHTML);
		}
		else */
		if(media=="movie")
		{
			/* 동영상 링크가 없는 페이지로 이동할시에는 여기로 들어오지 않는다.
			   그렇기 때문에, 음성이 겹쳐들리는 문제가 발생하지 않는다 */
			var baseCol, strBaseURL;
			baseCol = document.all.tags('BASE');
			if(baseCol.length>0)	strBaseURL=baseCol[0].href;
			else strBaseURL="";
			
			oHTML="";
			if (g_movie_showloading)
			{
				oHTML="<table id=\"LoadingTable\" width=\"100%\" height=\"100%\" border=0 cellpadding=0 cellspacing=0 bgcolor=#000000>";
				oHTML = oHTML + "<tr><td align=center valign=middle>";
				oHTML = oHTML + "<img id=\"LoadingImage\" src=\"" + strBaseURL + g_movie_loadingpath + "\" width=205 height=64>"
				oHTML = oHTML + "</td></tr></table>"
			}
			
			oHTML = oHTML + "<embed id=\"MoviePlayer\" name=\"MoviePlayer\" type=\"application/x-mplayer2\" src=\""+ theURL + "\" WIDTH=\"100%\" HEIGHT=\"100%\" autoSize=\"1\" EnableTracker=\"0\" autostart=\"1\" ";
			oHTML = oHTML + " ShowControls=\"" + g_movie_showcontrols + "\" ";
			oHTML = oHTML + " playcount=\"" + g_movie_playcount + "\" ";
			oHTML = oHTML + " AnimationAtStart=\"true\" ";
			oHTML = oHTML + " ></embed>";			
			
			if (g_movie_showloading)
			{
				oHTML = oHTML + "<SCRIPT FOR=\"MoviePlayer\" EVENT=\"Buffering(bStart)\" LANGUAGE=\"JScript\">";
				oHTML = oHTML + "if(!bStart){";
				oHTML = oHTML + "LoadingImage.style.width=0;";
				oHTML = oHTML + "LoadingImage.style.height=0;";	
				oHTML = oHTML + "LoadingTable.style.width=0;";
				oHTML = oHTML + "LoadingTable.style.height=0;";
				oHTML = oHTML + "LoadingTable.style.position=\"absolute\";";
				oHTML = oHTML + "}";
				oHTML = oHTML + "</SCRIPT>";
				oHTML = oHTML + "<SCRIPT FOR=\"MoviePlayer\" EVENT=\"ReadyStateChange(lReadyState)\" LANGUAGE=\"JScript\">";
				oHTML = oHTML + "if(lReadyState==4){";
				oHTML = oHTML + "LoadingImage.style.width=0;";
				oHTML = oHTML + "LoadingImage.style.height=0;";	
				oHTML = oHTML + "LoadingTable.style.width=0;";
				oHTML = oHTML + "LoadingTable.style.height=0;";
				oHTML = oHTML + "LoadingTable.style.position=\"absolute\";";
				oHTML = oHTML + "}";		
				oHTML = oHTML + "</SCRIPT>";
				oHTML = oHTML + "<SCRIPT FOR=\"MoviePlayer\" EVENT=\"Error(bStart)\" LANGUAGE=\"JScript\">";
				oHTML = oHTML + "LoadingImage.src=\"" + strBaseURL + g_movie_loadingerrorpath + "\";";
				oHTML = oHTML + "LoadingImage.style.width=205;";
				oHTML = oHTML + "LoadingImage.style.height=64;";	
				oHTML = oHTML + "LoadingTable.style.width=\"100%\";";
				oHTML = oHTML + "LoadingTable.style.height=\"100%\";";
				oHTML = oHTML + "LoadingTable.style.position=\"relative\";";
				oHTML = oHTML + "</SCRIPT>";
			}
		}else if(media=="vrmall"){
			oHTML = "<OBJECT ID=\"VRmallViewer\" WIDTH=\"100%\" HEIGHT=\"100%\" CLASSID=\"CLSID:D7959311-BFA5-11D4-AC33-0050DA92CB80\" CODEBASE=\"http://www.humandream.com/VRmall/Release/VRmall.cab#version=2,9,0,0\">";
			oHTML = oHTML + "<PARAM NAME=\"SOURCE\" VALUE=\""+theURL+"\">";
			oHTML = oHTML + "<PARAM NAME=\"WIDTH\"  VALUE=\"100%\">";
			oHTML = oHTML + "<PARAM NAME=\"HEIGHT\" VALUE=\"100%\">";
			oHTML = oHTML + "</OBJECT>";
		}else if(media=="image"){
			oHTML="<table width=\"100%\" height=\"100%\" border=0 cellpadding=0 cellspacing=0 bgcolor=#FFFFFF>";
			oHTML = oHTML + "<tr><td align=center valign=middle>";
			oHTML = oHTML + "<img src=\"" + theURL + "\" width=\"100%\" height=\"100%\" ";
			if( theLink!="http://" )
				oHTML = oHTML + "style=\"cursor:hand;\" onClick=\"javascript:window.open('" + theLink + "','','scrollbars=no,scrolling=no,menubar=no,resizable=yes')\">";
			else
				oHTML = oHTML + ">"
			oHTML = oHTML + "</td></tr></table>";				
		}else if(media=="html"){
			oHTML=oHTML +"<table width=\"100%\" height=\"100%\" border=0 cellpadding=0 cellspacing=0 bgcolor=#FFFFFF>";
			oHTML = oHTML + "<tr><td align=center valign=middle style=\"font-size:12px; font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;  color: #666666;\">";
			oHTML= oHTML + theURL;
			oHTML = oHTML + "</td></tr></table>";	
		}		
		
		var frameName = "mediaFrame" + (g_mediaNum);
		
		document.frames(frameName).document.body.leftMargin=0;
		document.frames(frameName).document.body.topMargin=0;
		document.frames(frameName).document.body.rightMargin=0;
		document.frames(frameName).document.body.bottomMargin=0;
		//alert("mediaTo oHTML = " + oHTML);
		document.frames(frameName).document.body.innerHTML = oHTML;
		
		/*
		document.all["DBookflash"].document.frames(frameName).document.body.leftMargin=0;
		document.all["DBookflash"].document.frames(frameName).document.body.topMargin=0;
		document.all["DBookflash"].document.frames(frameName).document.body.rightMargin=0;
		document.all["DBookflash"].document.frames(frameName).document.body.bottomMargin=0;
		alert("mediaTo oHTML = " + oHTML);
		document.all["DBookflash"].document.frames(frameName).document.body.innerHTML = oHTML;
		*/
		////////////////////////////////////////////////////////////////////////
		viewMediaFrame(frameName);
		
		g_mediaNum++;
	}
}

function viewMediaFrame(mediaFrame){
	//alert(mediaFrame);
	try{
		var m=getMediaArrayNum(mediaFrame);	
		if(g_mediaWidth[m]!=0){
			var maxZoomStep = document.dBook.handle_getTotalZoomStep();
			var curZoomStep = document.dBook.handle_getCurrZoomStep();
			var ratio1 = Math.pow(2,curZoomStep);
			var ratio2 = Math.pow(2,maxZoomStep);
			var pageWidth = 0, pageHeight=0;
			var nViewerHeight=0;
			var ZoomAreaLeft=document.dBook.handle_getZoomAreaLeft();
			var ZoomAreaTop=document.dBook.handle_getZoomAreaTop();
			
			if( g_isDPage == 1){
				if(document.dBook.handle_getLeftSlidePage()%2==0){
					if(g_mediaPage[m]%2 == 1){
						pageWidth = document.dBook.handle_getPageWidth()*1;
						pageHeight = document.dBook.handle_getPageHeight()*1;
					}
				}else{
					if(g_mediaPage[m]%2 == 0){
						pageWidth = document.dBook.handle_getPageWidth()*1;
						pageHeight = document.dBook.handle_getPageHeight()*1;
					}					
				}
				if(g_isVertical == 1){
					pageWidth = 0;
				}else{
					pageHeight =0;
				}			
			}
			var left = parseInt( g_mediaLeft[m]*ratio1 / ratio2) + pageWidth*ratio1-ZoomAreaLeft;
			var top = parseInt( g_mediaTop[m]*ratio1 / ratio2) + pageHeight*ratio1-ZoomAreaTop;
			var width = parseInt( g_mediaWidth[m]*ratio1 / ratio2);
			var height = parseInt( g_mediaHeight[m]*ratio1 / ratio2);
			
			document.all[mediaFrame].style.pixelLeft=left - getFrameGap(curZoomStep,"left");
			document.all[mediaFrame].style.pixelTop=top - getFrameGap(curZoomStep,"top");
			document.all[mediaFrame].style.pixelWidth=width + getFrameGap(curZoomStep,"width");
			document.all[mediaFrame].style.pixelHeight=height + getFrameGap(curZoomStep,"height");		

			setTimeout("document.all['"+mediaFrame+"'].style.visibility='visible';",150);
				
			if(!g_TimerRunning){
				g_TimerRunning = true;
				MediaTimeService();
			}
		}
	}catch(e){ 
		//alert("viewMediaFrame error");
	}
}

function hideMediaFrame(mediaFrame){
	document.all[mediaFrame].style.pixelLeft=0;
	document.all[mediaFrame].style.pixelTop=0;
	document.all[mediaFrame].style.pixelWidth=0;
	document.all[mediaFrame].style.pixelHeight=0;
	document.all[mediaFrame].style.visibility="hidden";
	initMediaVar(mediaFrame);
	document.frames(mediaFrame).document.body.innerHTML="";
}

function initMediaVar(mediaFrame){
		var m=getMediaArrayNum(mediaFrame);
		g_mediaType[m]="";
		g_mediaURL[m]="";
		g_mediaPage[m]="";
		g_mediaLeft[m]=0;
		g_mediaTop[m]=0;
		g_mediaWidth[m]=0;
		g_mediaHeight[m]=0;
}

function HD_mediaLinkTo(args)
{
	try	{
 		var strMSG;
 		linkData=args;
		
		var theLink;    // dummy 
		
		media = getTextParamValue(linkData, "comment");
		media = media.substring("media_".length);
		theURL = getTextParamValue(linkData, "url");
		thePage = parseInt( getTextParamValue(linkData, "pageNum") );
		x1 = parseInt( getTextParamValue(linkData, "posX") );
		y1 = parseInt( getTextParamValue(linkData, "posY") );
		x2 = parseInt( getTextParamValue(linkData, "pos2X") );
		y2 = parseInt( getTextParamValue(linkData, "pos2Y") );

		if(media=="music"){
		  strScript = "musicTo('" + theURL + "');";

			eval(strScript);
		}
		else
		  mediaTo(theURL,thePage, x1,y1,x2,y2,media,theLink);
	} catch(e) { }
}

/*
function linkPressed_txt(index_param, args)
{
	var index = parseInt(index_param);
	//alert("index_param = " + index_param + ", args= " + args + ", index= " + index);
	try	{
 		var strMSG;
 		linkData=document.dBook.handle_getLinkParam(index);
 		linkDataPosX=document.dBook.handle_getLinkValue(index, "posX");
 		linkDataPosY=document.dBook.handle_getLinkValue(index, "posY");
 		linkDataPos2X=document.dBook.handle_getLinkValue(index, "pos2X");
 		linkDataPos2Y=document.dBook.handle_getLinkValue(index, "pos2Y");
 		linkDataTarget=document.dBook.handle_getLinkValue(index, "target");
 		linkDataURL=document.dBook.handle_getLinkValue(index,"url");
 		linkDataPageNum=document.dBook.handle_getLinkValue(index, "pageNum");
 		linkDataTestParamA=document.dBook.handle_getLinkValue(index, "ValA");
 		linkDataComment=document.dBook.handle_getLinkValue(index, "comment");
		
		var media,nTmp1, theURL,thePage, x1,x2,x3,x4,theLink="", arrTheArea;
		
		media = linkDataComment;
		theURL = linkDataURL;
		thePage = linkDataPageNum;
		x1 = linkDataPosX;
		y1 = linkDataPosY;
		x2 = linkDataPos2X;
		y2 = linkDataPos2Y;
		
		alert("linkPressed_txt media = " + media);

		if(media=="music")
		{
			strScript = "musicTo('" + theURL + "');";
			eval(strScript);
		}
		else
		{
			alert("linkPressed_txt theURL = " + theURL);
			mediaTo(theURL,thePage, x1,y1,x2,y2,media,theLink);
		}

	} catch(e) { }
}

function your_linkPressed(index, args)
{
	//alert("your_linkPressed");
	if (g_LinkDataType == "txt")
	{
	  linkPressed_txt(index, args);
	}
}
*/

function your_pressBGM(){
	try{
		var bgm = document.all.albumSound;
		var nState = bgm.PlayState;
		if(nState==2){
			bgm.stop();
		}else if(nState==0){
			bgm.play();
		}
	}catch(e){}
	if(g_bViewMedia){
		stopAllMediaFrame();
		g_bViewMedia=false;
		try{
			document.all.mediaTableOn.style.visibility="hidden";
			document.all.mediaTableOn.style.position="absolute";			
			document.all.mediaTableOff.style.visibility="visible";
			document.all.mediaTableOff.style.position="relative";	
		}catch(e){}
	}else{
		g_bViewMedia=true;
		var page;
		if( g_isDPage == 1){
			page=document.dBook.handle_getLeftSlidePage();
			if((page%2)==0){
				page=page-1;
			}
			playPageMedia(true,page,false);
		}else{
			page = document.dBook.handle_getCurSlidePage();
			playPageMedia(false,page,false);
		}	
		try{
			document.all.mediaTableOff.style.visibility="hidden";
			document.all.mediaTableOff.style.position="absolute";			
			document.all.mediaTableOn.style.visibility="visible";
			document.all.mediaTableOn.style.position="relative";	
		}catch(e){}
	}
}

function your_StartZoom() {
	if(g_isFullScreen != 2 && g_bDbookExtend=="y"){
		resizeWindowOrDbook(Math.pow(2,1));
	}
}

function your_EndZoom(){
	if(g_isFullScreen != 2 && g_bDbookExtend=="y"){
		resizeWindowOrDbook(Math.pow(2,0));
	}
}

var g_nWidthGap = 0, g_nHeightGap=0;
function resizeWindowOrDbook(nRatio){
	var nMinWinWidth = 0, nMinWinHeight=0;
	var nWidthGap = 0, nHeightGap=0;
	var nAvailWidth = screen.availWidth;
	var nAvailHeight = screen.availHeight;
	var nViewerWidth, nViewerHeight;
	var nPageWidth = document.dBook.handle_getPageWidth();
	var nPageHeight = document.dBook.handle_getPageHeight();

	if (g_nWidthGap==0 && g_nHeightGap==0 && g_isFullScreen==0){
		try{
			window.moveTo(0,0);	
			 g_nWidthGap = window.screenLeft;
			 g_nHeightGap = window.screenTop;
			 if(g_nHeightGap>40) g_nHeightGap=g_nHeightGap+20;
		}catch(e){
			g_nWidthGap=4;
			g_nHeightGap=30;
		}			
	}

	if( g_isDPage == 1){		
		if(g_isVertical == 1){
			nViewerWidth = nPageWidth;
			nViewerHeight = 2*nPageHeight;
		}else{
			nViewerWidth = 2*nPageWidth;
			nViewerHeight = nPageHeight;
		}
	}else{
			nViewerWidth = nPageWidth;
			nViewerHeight = nPageHeight;			
	}

	if( (nSkinTop==42 && nSkinRight==5) || (nSkinTop==0 && nSkinBottom==47) ){
		g_nMinWinWidth = 730;
		g_nMinWinHeight = 290;
		nWidthGap = 61 + g_nWidthGap;
		nHeightGap = 110 + g_nHeightGap;
	}else if( (nSkinTop==0 && nSkinRight==5) || (nSkinTop==0 && nSkinRight==74) ){
		g_nMinWinWidth = 320;
		g_nMinWinHeight = 620;
		nWidthGap = 116 + g_nWidthGap;
		nHeightGap = 30 + g_nHeightGap;
	}
	if(g_haveBoard=="y"){
		nHeightGap = nHeightGap+320;		
	}

	var nDBookWidth= nViewerWidth * nRatio;
	var nDBookHeight= nViewerHeight * nRatio;
	var nWinWidth =0, nWinHeight=0 ;
	var isOverFlowX = true, isOverFlowY = true;
	if(nViewerWidth>(nAvailWidth-nWidthGap)){
		nDBookWidth = nViewerWidth;
		nWinWidth = nAvailWidth;
	}else if(nDBookWidth>(nAvailWidth-nWidthGap)){
		nDBookWidth = nAvailWidth-nWidthGap;
		nWinWidth = (nDBookWidth+nWidthGap);
	}else{
		nWinWidth = (nDBookWidth+nWidthGap);
		isOverFlowX = false;
	}
	if(nViewerHeight>(nAvailHeight-nHeightGap)){
		nDBookHeight = nViewerHeight;
		nWinHeight = nAvailHeight;
	}else if(nDBookHeight>(nAvailHeight-nHeightGap)){
		nDBookHeight = nAvailHeight-nHeightGap;
		nWinHeight = (nDBookHeight+nHeightGap);
	}else{
		nWinHeight = (nDBookHeight+nHeightGap);
		isOverFlowY = false;
	}
	
	if(nRatio==1){
		nDBookWidth=nViewerWidth;
		nDBookHeight= nViewerHeight;
	}
	
	if(isOverFlowX && !isOverFlowY){
		nWinHeight = nWinHeight+20;
	}
	if(isOverFlowY && !isOverFlowX){
		nWinWidth = nWinWidth+20;
	}	
	document.all["DBookflash"].style.width = nDBookWidth;
	document.all["DBookflash"].style.height = nDBookHeight;
	document.all["dBook"].width = nDBookWidth;
	document.all["dBook"].height = nDBookHeight;
	document.dBook.handle_resize(nDBookWidth,nDBookHeight);
	
	if(nWinWidth<g_nMinWinWidth) nWinWidth=g_nMinWinWidth;
	if(nWinHeight<g_nMinWinHeight) nWinHeight=g_nMinWinHeight;
	var nWinX = parseInt((nAvailWidth-nWinWidth)/2);
	var nWinY = parseInt((nAvailHeight-nWinHeight)/2);

	if(g_isFullScreen==0){
		try{
			window.resizeTo(nWinWidth,nWinHeight);
			window.moveTo(nWinX,nWinY);
		}catch(e){}
	}
}

var g_LinkDataType;
/*
function getLinkParamXml(reload){
	if(reload){
		var str3DmallPath = get3DmallPath();
		var strXmlName = getLinkParamsXmlName();
		g_objLinkParam = LoadDOM(str3DmallPath + strXmlName);
		g_objLinkList = g_objLinkParam.documentElement.selectSingleNode("LinkList[@type='link']");	
	}else{
		try{
			var strXml = g_objLinkList.xml;
		}catch(e){
			var str3DmallPath = get3DmallPath();
			var strXmlName = getLinkParamsXmlName();
			g_objLinkParam = LoadDOM(str3DmallPath + strXmlName);
			g_objLinkList = g_objLinkParam.documentElement.selectSingleNode("LinkList[@type='link']");	
		}		
	}
}
*/
function your_treatSlidePage(){
	//try{document.frames("editLink").onPageTurn();}catch(e){}
	//getLinkParamXml(false);
	
	g_LinkDataType = "txt";
  
	stopAllMediaFrame();

	if ( !g_movie_autostart )
		return;

	var page;

	if( g_isDPage == 1)
	{
		page=document.dBook.handle_getLeftSlidePage();
		if((page%2)==0){
			page=page-1;
		}
		playPageMedia(true,page,true);
	}
	else
	{
		page = document.dBook.handle_getCurSlidePage();
		playPageMedia(false,page,true);
	}
}

function your_showHelp( delayMilliSec )
{
    if ( delayMilliSec < 0 )          ;
    else if ( delayMilliSec == 0 )  	showHelp();
    else setTimeout( 'showHelp();', delayMilliSec );
}

function your_notZoom(iPage) {
	 //var msg = iPage + MSG_DBOOK_006;
	 //alert(msg);
}

function your_pressAutoFlip(onOrOff){
	var isRotate = document.dBook.handle_getRotateEnable();
	if(isRotate==0) {
		try{
			var num = parseInt(document.all.delay_num.value);
			if(num<1) num=1;
			if(num>50) num=50;
			document.dBook.handle_pressForwardRotate();
			document.dBook.handle_setDelayTime(num*1000);

			document.all.autoFlipTableOn.style.visibility="hidden";
			document.all.autoFlipTableOn.style.position="absolute";			
			document.all.autoFlipTableOff.style.visibility="visible";
			document.all.autoFlipTableOff.style.position="relative";
		}catch(e){
			document.dBook.handle_setDelayTime(1000);
			document.dBook.handle_pressPause();
			alert("Please, input number !!");
			document.all.delay_num.focus();
			document.all.delay_num.select();
			return;			
		}
		
	}	else {
		document.dBook.handle_pressPause();
	}
}

function InsertMediaFrame()
{
  var mediaFrameCodes = "";
  mediaFrameCodes += "<iFrame id=\"mediaFrame0\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame1\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame2\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame3\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame4\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame5\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame6\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame7\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame8\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame9\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame10\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame11\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame12\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame13\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame14\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame15\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame16\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame17\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame18\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame19\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  mediaFrameCodes += "<iFrame id=\"mediaFrame20\"  name=\"mediaFrame0\" src=\"about:blank\" style=\"visibility:visible;position:absolute;top:0px;left:0px;width:0px;height:0px;\" FRAMEBORDER=\"0\" SCROLLING=\"no\" ></iFrame>";
  
  dBook.insertAdjacentHTML("afterBegin",mediaFrameCodes);
}

function your_initFinished()
{
  callErFlag();
  // alert( "your_initFinished" );
  setTimeout("your_treatSlidePage()",1000); //<- 20060331 dckim
}

/*
function hideOtherFrame(frameID){
	var oFrame;
	var arrFrame = new Array("indexList","editLink","search");
	for(var i=0; i<arrFrame.length; i++){
		oFrame = document.all[arrFrame[i]];
		if(arrFrame[i] != frameID &&  oFrame.style.visibility=="visible"){
			oFrame.style.left = 0;
			oFrame.style.top = 0;
			oFrame.style.width = 10;
			oFrame.style.height = 10;		
			oFrame.style.visibility="hidden";						
		}
	}
}

function showFrame(frameID){
	hideOtherFrame(frameID);
	var oFrame = document.all[frameID];
	if(oFrame.style.visibility=="hidden"){
		if(frameID=="editLink"){
			var url = document.location.href;		
		}else{
			if(oFrame.src==""){
				oFrame.src = frameID+".htm";
			}
		}
		
		oFrame.style.left = iPosX;
		oFrame.style.top = iPosY;
		oFrame.style.visibility="visible";
		try{
			document.frames(frameID).moveAndResizeFrame("init");
		}catch(e){}
	}else{
		oFrame.style.left = 0;
		oFrame.style.top = 0;
		oFrame.style.width = 10;
		oFrame.style.height = 10;		
		oFrame.style.visibility="hidden";	
		if(frameID=="editLink"){
			oFrame.src="";
			document.dBook.handle_removeLink();
			document.dBook.handle_editLink(false);
		}
	}
}

function moveAndResizeFrame(frameID, pos, w, h){
	var oFrame = document.all[frameID];	
	var oBndRct = document.body.getBoundingClientRect();
	var limitHeight = oBndRct.bottom-oBndRct.top-(nSkinTop+nSkinBottom);
	var fw, fh;
	
	if(limitHeight<100)	limitHeight=100;
	
	if(pos=="init")
		pos = curPos;
	else
		curPos = pos;	
		
	if( limitHeight <= h){
		fw = w+18;
		fh = limitHeight;
	}else{
		fw = w;
		fh = h;
	}

	if(pos=="left_top"){
		iPosX = nSkinLeft;
		iPosY = nSkinTop;
		oFrame.style.left = iPosX;
		oFrame.style.top = iPosY;
	}else if(pos=="right_top"){
		iPosX = oBndRct.right - oBndRct.left - fw - nSkinRight;
		iPosY = nSkinTop;			
		oFrame.style.left = iPosX;
		oFrame.style.top = iPosY;			
	}else if(pos=="left_bottom"){
		iPosX = nSkinLeft;
		iPosY = oBndRct.bottom - oBndRct.top - fh- nSkinBottom;
		if(iPosY<nSkinTop){
			iPosY = nSkinTop;
			fh = nSkinTop - oBndRct.bottom+oBndRct.top+nSkinBottom;
		}
		oFrame.style.left = iPosX;
		oFrame.style.top = iPosY;		
	}else if(pos=="right_bottom"){
		iPosX = oBndRct.right - oBndRct.left - fw - nSkinRight;
		iPosY = oBndRct.bottom - oBndRct.top - fh - nSkinBottom;
		if(iPosY<nSkinTop){
			iPosY = nSkinTop;
			fh = nSkinTop - oBndRct.bottom+oBndRct.top+nSkinBottom;
		}
		oFrame.style.left = iPosX;
		oFrame.style.top = iPosY;			
	}
	
		oFrame.style.pixelWidth = fw;
		oFrame.style.pixelHeight = fh;
}

function HD_eidtLink(mode, linkID, left, top, right, bottom,page){
	try{
		document.frames("editLink").eidtLink(mode, linkID, left, top, right, bottom,page);
	}catch(e){
//			alert("error editLink");
	}
}
*/