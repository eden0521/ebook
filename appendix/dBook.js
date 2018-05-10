/////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : dBook.js
//  version : 3.5 g1207  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////

var bInitFinished = false;	// the variable called by applet when the applet load finishing.
var bLoaded = false;		// the variable called by html document when the html document load finishing.

bInitFinished = false;
bOnLoaded = false;

function DigitalBookUnload()
{ 
    try
    {
    	//document.dBook.handle_addCRMData( getCRMData() );
    	document.dBook.handle_addCRMData();
    }
    catch (e)
    {
	/*
        try
        {
            document.dBook.handle_setURL( getMailingParam() );      // for old version viewer
        }
        catch (e2) {}
	*/
    }

    try
    {
       	document.dBook.handle_unload();
    }
    catch (e3)  {}
    // Please append 'onUnload=DigitalBookUnload()' at BODY open tag.
    // Please check that 'Port' number is 80 or not.
}

function doKey(e)
{
	whichASC = event.keyCode;

	if (whichASC == 13){
		HD_inputGotoPage();		
	}
}

function getCookie(name)
{
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie )
		{
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

//***********************************************************************************************
// page Customize
var gPageOffset = 0;
var gHtmlHeight = 0;

function _getRealPageNo(nPage)
{    
   return gPageOffset + nPage;
}

function HD_setHtmlSkinHeight(htmlHeight)
{
	gHtmlHeight = htmlHeight;
}

function HD_getHtmkSkinHeight()
{
	return gHtmlHeight;
}

function HD_getSkinPageOffset()
{
	try{
		gPageOffset = document.dBook.handle_getPageOffset();
	}catch(e){}
	return gPageOffset;
}

function _printOffset(tStr)
{
	var strValue = "";

	if(tStr == "0"){
		strValue = tStr; 
	}
	else{
		var intValue = parseInt(tStr) + gPageOffset;
		strValue = intValue.toString();
	}
	return strValue;
}

//Check dbook.jar's page view mode
function HD_isDoublePage() {
	return document.dBook.handle_isDoublePage();
}

//get current left page no. applicable only if dobule page view mode
function HD_getLeftPage() {
	return document.dBook.handle_getLeftSlidePage();
}

//get current right page no. applicable only if dobule page view mode
function HD_getRightPage() {
	return document.dBook.handle_getRightSlidePage();
}

//get current page no. applicable only if single page view mode
function HD_getCurrentPage() {
	return document.dBook.handle_getCurSlidePage();     // for single-page DBook.
}

function HD_getSlideTotal() {
	return document.dBook.handle_getSlideTotal();
}

function HD_getSlidePage() 
{	
	
	if (!bInitFinished)
		return;
	
	if (!bOnLoaded)
		return;

	var LPage = HD_getLeftPage();
	var RPage = HD_getRightPage();
	var SinglePage = HD_getCurrentPage();     // for single-page DBook.
	var slideTot = HD_getSlideTotal();
	
	/** customize page Number****/ 
	HD_getSkinPageOffset();
	LPage = LPage - gPageOffset;
	RPage = RPage - gPageOffset;
	slideTot = slideTot - gPageOffset;

	if (LPage < 0)	{	LPage = 0;	}
	if (RPage < 0)	{	RPage = 0;	}
	/** to here ****************/
	var totalIn=document.getElementById("total_page");
	try{
		if(totalIn != null)
		{
			totalIn.innerHTML = " / " + slideTot;
			var pageIn=document.getElementById("cur_page");
			try{
				if (pageIn != null)
				{
					if ( HD_isDoublePage() )
						your_rePagenumber(pageIn, LPage);
					else
						your_rePagenumber(pageIn, SinglePage);
				}
			}
			catch(e){}
		}else{
				var pageIn=document.getElementById("cur_page");
				try{
					if (pageIn != null)	
					{
						if ( HD_isDoublePage() )
						{
							pageIn.innerHTML = LPage + "-" +RPage + " / " + slideTot;
							
							if(RPage < LPage){
								document.pageSlideBar.setCurrPos(slideTot, RPage);
							}else{
								document.pageSlideBar.setCurrPos(slideTot, LPage);
							}
						}
						else
						{
							pageIn.innerHTML = SinglePage + " / " + slideTot;    // for single-page DBook.
							
							document.pageSlideBar.setCurrPos(slideTot, SinglePage);
						}
					}
				}catch(e){}
		}
	}catch(e){}
}

function HD_setPageNum() 
{
	//HTML이 없는 Skin 에서 오류가 나기때문에
	//return;
	// call by applet when the applet load finishing.
	bInitFinished = true;

	HD_getSlidePage();
	
	try{
		your_treatSlidePage();
	}catch(e){}
}

function HD_inputGotoPage() 
{		// goto some page
	var slideTot = document.dBook.handle_getSlideTotal();
	var page = document.getElementById("page_num");
	try{
		if(page != null){
			nPage = _getRealPageNo(parseInt(page.value));
			if(nPage <= slideTot && nPage > 0 )
				document.dBook.handle_inputGotoPage(nPage);
			page_num.value="";
			document.dBook.focus();
		}else{
			var page = document.getElementById("cur_page");
			data = page.innerHTML;
			var index = data.indexOf("value");
			var index2 = data.indexOf(" name"); 
			data = data.substring(index, index2);
			index = data.indexOf("=");
			var cpage = data.substring(index+1, data.length);
			nPage = _getRealPageNo(parseInt(cpage));
			if(nPage <= slideTot && nPage > 0 )
				document.dBook.handle_inputGotoPage(nPage);
			document.dBook.focus();			
		}
	}catch(e){}
}

function HD_gotoPage(nPage) 
{		// goto some page
	var slideTot = document.dBook.handle_getSlideTotal();

	if(nPage <= slideTot && nPage > 0 )
		document.dBook.handle_inputGotoPage(nPage);
	document.dBook.focus();
}

function openReplace(win_url) 
{ 
    var screen_width = 1024 - 10; 
    var screen_height = 768 - 30; 
    strFeatures = "left=0,top=0,width=" + screen_width + ",height=" + screen_height + ","; 
    strFeatures += "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes"; 
    
    windowname=window.open( win_url, "NoticeJavaVM", strFeatures ); 
    windowname.focus(); 
    return; 
} 


function HD_pressCloseUp() {		
	document.dBook.handle_pressCloseUp();
	document.dBook.focus();
}
function HD_pressZoom() {			
	document.dBook.handle_pressZoom();
	document.dBook.focus();
}
function HD_pressLeftZoom() {		
	document.dBook.handle_pressZoomPage(document.dBook.handle_getLeftSlidePage());
	document.dBook.focus();
}
function HD_pressRightZoom() {			
	document.dBook.handle_pressZoomPage(document.dBook.handle_getRightSlidePage());
	document.dBook.focus();
}
function HD_pressPause() {			
	document.dBook.handle_pressPause();
	document.dBook.focus();
}

function HD_pressNextPage() {		
	document.dBook.handle_pressNextPage();
	document.dBook.focus();
}
function HD_pressPreviousPage() {	
	document.dBook.handle_pressPreviousPage();
	document.dBook.focus();
}
function HD_gotoFirstPage() {		
	document.dBook.handle_gotoFirstPage();
	document.dBook.focus();
}
function HD_gotoEndPage() {			
	document.dBook.handle_gotoEndPage();
	document.dBook.focus();
}

function HD_pressBackwardRotate() {	// auto sliding (backward)
	document.dBook.handle_pressBackwardRotate();
	document.dBook.focus();
}
function HD_pressForwardRotate() {	// auto sliding (forward)
	document.dBook.handle_pressForwardRotate();
	document.dBook.focus();
}
function HD_pressSpeedUp() {		// turn speed up when sliding
	document.dBook.handle_pressSpeedUp();
	document.dBook.focus();
}
function HD_pressSpeedDown() {		// turn speed down when sliding
	document.dBook.handle_pressSpeedDown();
	document.dBook.focus();
}
////////////////////////////////////////////////////////////////////////////////

function HD_openBrWindow(theURL,winName,features) 
{
	winName = theURL.replace(/[^a-zA-Z0-9]+/g,''); 
		
	if (features == "")
	{
		features = "toolbar=yes,width=800,height=600,location=yes,directories=no,status=yes,menubar=yes,scrollbars=yes,resizable=yes";
	}

  HD_popup = window.open(theURL,winName,features);
  
  if (HD_popup != null)
  {
	  HD_popup.focus();
	}
}

var printTarget = ""

function HD_setPrintTarget(tempTarget) {
	printTarget = tempTarget
}

function _blur(obj,num){
	obj.options[ num ].selected = true;
}

function downSelect(obj, num) {
	if( obj.options[ num ] != null && obj.options[ num ].text=="PRINTING" ) {
		obj.options[ num ].text = "NONE PRINTING";
	}
	else if( obj.options[ num ].text == "NONE PRINTING" ) {
		obj.options[ num ].text = "NONE PRINTING"
	}
}
// -------------------------------------------


function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

////////////////////////////////////////////////////////////////////////////////

//***********************************************************************************************
// ActiveX 
function HD_OCX_changePage()
{
	try {
		your_changePage();
	}
	catch (e_ocx_01)
	{}
}

function HD_OCX_endRotate()
{
	try {
		your_endRotate();
	}
	catch (e_ocx_02)
	{}
}

function HD_OCX_notFlipPrev()
{
	try {
		your_notFlipPrev();
	}
	catch (e_ocx_03)
	{}
}

function HD_OCX_notFlipNext()
{
	try {
		your_notFlipNext();
	}
	catch (e_ocx_03)
	{}
}
//***********************************************************************************************
// Start Range Print Function
var SourcePathFlag=0;
function GetFileFullPath(){
	var docupath = document.location.href;
	var mediapath = docupath.substring(0,5);

	if (mediapath == "file:" || mediapath == "FILE") {
		docupath = location.pathname;
		splitString = docupath.split("\\");
		
		if(splitString.length > 1) {
			mediapath = splitString[0].substring(1, 2);
			mediapath = mediapath + ":";		
			for (i = 1; i < (splitString.length-1);i++)
				mediapath = mediapath + "/" + splitString[i];	
		} else {
			splitString = docupath.split("/");
			mediapath = splitString[1];		
			for (i = 2; i < (splitString.length-1);i++) {
				if(splitString[i].length > 0)
					mediapath = mediapath + "/" + splitString[i];
			}
		}			
		mediapath = mediapath + "/";		
		SourcePathFlag=0;
	}
	else {
		splitString = docupath.split("/");
		mediapath = "";
		SourcePathFlag=1;
		for (i=2;i<(splitString.length-1);i++) mediapath+=splitString[i] + "/"
	}
	return mediapath
}

//***********************************************************************************************
function doKey_search(e){
	whichASC = event.keyCode;
	if (whichASC == 13){
		SearchResults.DoSearch();
	}	
}

function clearRange()
{
 	selectPrint.value = "";
}
//End Range Print Function
//***********************************************************************************************
function HD_showSearch()
{	
	document.dBook.handle_showSearch();
	document.dBook.focus();
}

// Handle all the FSCommand messages in a Flash movie.
function dBook_DoFSCommand(command, args) {
	var dBookObj = isIE() ? document.all.dBook : document.dBook;
	//
	// Place your code here.
	//
	//alert("fscommond");
	if(command == "changePage")
		your_changePage();
	if(command == "notFlipPrev")
		your_notFlipPrev();
	if(command == "notFlipNext")
		your_notFlipNext();
	if(command == "stateChangeHandler")
		frame_TextSearchResults.srch_stateChangeHandler();
	if(command == "linkto") {
		var idx = args.lastIndexOf(";");
		var target = args.substring(idx+1, args.length);
		var url = args.substring(0, idx);
		idx = target.lastIndexOf("&");
		var popup = target.substring(idx+1, target.length);
		var targets = target.substring(0, idx);
		idx = popup.lastIndexOf("$");
		var height = popup.substring(idx+1, popup.length);
		var width = popup.substring(0, idx);
    
    if(height != "undefined" && width != "undefined"){
		  var spec = "width=" + width + "," + "height=" + height;
		  window.open(url, targets, spec);		 
		}
		else{
		  window.open(url, targets);
		}
	}
	if(command == "linktoEx"){
	  try{
	    your_linkPressed(args);
	  }catch(e){}
	}
	if(command == "onPrintPage"){
		your_onPrint(args);
	}
	if(command == "onPrintPageEx"){;
		your_onPrintEx(args);
	}
	if(command == "onPagePrintAll"){		
		your_onPrintAll();
	}	
	if(command == "onAlert") {
		alert(args);
	}
	if(command == "onToogleBookmark") {
		toggleBookmark(args);
	}
	if(command == "onClearAllBookmark") {
		ClearAllBookmark();
	}
	if(command == "onResize") {
		HD_onResize();
	}
	if(command == "initBookmark") {
		loadBookmark();
	}
	if(command == "initPageOffset") {
		dBookObj.handle_setPageOffset(gPageOffset);
	}
	if(command =="quit") {
		window.close();
	}
	if(command == "documentBase") {
		dBookObj.handle_setDocumentBase(window.location.href);	
	}
	if(command == "slideEnd") {
		your_endRotate();
	}
	if(command == "leftFlipZoomEnd") {
		your_leftFlipZoomEnd();
	}
	if(command == "notStartPage") {
		try{
			your_notStartPage();
		}catch(e){}
	}
	
	if(command == "bookmarklimit") {
	  try{
	    your_bookMarkLimit();
	  }catch(e){}
	}
}
// Hook for Internet Explorer.
if (navigator.appName && navigator.appName.indexOf("Microsoft") != -1 && navigator.userAgent.indexOf("Windows") != -1 && navigator.userAgent.indexOf("Windows 3.1") == -1) {
	document.write('<script language=\"VBScript\"\>\n');
	document.write('On Error Resume Next\n');
	document.write('Sub dBook_FSCommand(ByVal command, ByVal args)\n');
	document.write('	Call dBook_DoFSCommand(command, args)\n');
	document.write('End Sub\n');
	document.write('</script\>\n');
}


var gWhiteMarginWidth = 19;  
var gWhiteMarginHeight = 19;

function HD_setWhiteMarginWidth(margin) {
	gWhiteMarginWidth = margin;
}
function HD_setWhiteMarginHeight(margin) {
	gWhiteMarginHeight = margin;
}

function HD_onResize() {
	if(!gbLiveConnect) return;
	var dBookObj = document.dBook;

	var w = dBookObj.handle_getDBookWidth();
	var h = dBookObj.handle_getDBookHeight();

	if(isIE()) {		
		var newW = document.body.clientWidth;
		var newH = document.body.clientHeight - HD_getHtmkSkinHeight();
			
		if(newW < w) newW = w;
		if(newH < h) newH = h;

		if(newW + 16 >= window.screen.availWidth && newH +16 >= window.screen.availHeight) {
			dBookObj.setAttribute("width", newW + gWhiteMarginWidth);
			dBookObj.setAttribute("height", newH + gWhiteMarginHeight);
		} else {
			dBookObj.setAttribute("width", newW + gWhiteMarginWidth);
			dBookObj.setAttribute("height", newH + gWhiteMarginHeight);
		}
		dBookObj.handle_onResize(newW, newH);		
	} else {
		var newW = w;
		var newH = h;
		if(window.screen.availWidth > 	w) {
			newW = window.screen.availWidth;
		} 
		if(window.screen.availHeight > h) {
			newH = window.screen.availHeight;
		}
		dBookObj.setAttribute("width", newW);
		dBookObj.setAttribute("height", newH);
		dBookObj.handle_onResize(w, h);
	}
	HD_getRealBrowserHeight();
	HD_getRealBrowserWidth();
}

function HD_onResizeEx() {	
	if(isIE()) {

		var dBookObj = document["dBook"];
		var w = dBookObj.GetVariable("m_minCavasWidth");
		var h = dBookObj.GetVariable("m_minCavasHeight");

		var newW = document.body.clientWidth;
		var newH = document.body.clientHeight;	
		
		dBookObj.setAttribute("width", newW);
		dBookObj.setAttribute("height", newH);
		
		var news = newW + "" + "," + newH + "";
		dBookObj.SetVariable("setWidthHeight", news);
		return;		
	}
}

function HD_setStartPage(pageNo) {
	if(!gbLiveConnect) return;
	var flag = getIsStartPageName();
	document.dBook.handle_setStartPage(pageNo , flag);
}

function HD_setStartText(keyword) {
  if(!gbLiveConnect) return;
  document.dBook.handle_setStartText(keyword);
}

function HD_setHtmlSkinPageNumber(flag) {
	bOnLoaded = flag;
}

function HD_showBookmarkMenu() {
	document.dBook.handle_showBookMarkMenu();
	document.dBook.focus();
}

function HD_showPrintMenu() {
	document.dBook.handle_showPrintMenu();
	document.dBook.focus();
}

function HD_showPenMenu() {
	document.dBook.handle_showPenMenu();
	document.dBook.focus();
}

function HD_showDicMenu() {
	document.dBook.handle_showDicMenu();
	document.dBook.focus();
}

function HD_showHelpMenu() {
	document.dBook.handle_showHelpMenu();
	document.dBook.focus();
}

function HD_createNewMemo() {
	document.dBook.handle_createNewMemo();
	document.dBook.focus();
}

function HD_showSlideMenu() {
	document.dBook.handle_showSlideMenu();
	document.dBook.focus();
}

function HD_showFlippageMenu() {
	document.dBook.handle_showFlippageMenu();
	document.dBook.focus();
}

function HD_showSearchMenu() {
	document.dBook.handle_showSearchMenu();
	document.dBook.focus();
}

function HD_showZoomMenu() {
	document.dBook.handle_showZoomMenu();
	document.dBook.focus();
}

function HD_showIndexMenu() {
	document.dBook.handle_showIndexMenu();
	document.dBook.focus();
}

function HD_showMemoListMenu() {
	document.dBook.handle_showMemoListMenu();
	document.dBook.focus();
}

function HD_showMusicMenu() {
	document.dBook.handle_showMusicMenu();
	document.dBook.focus();
}

function HD_startSlide(sec) {
	document.dBook.handle_startSlide(sec);
	document.dBook.focus();
}

function HD_eableMouseFlip(bFlip) {
	document.dBook.handle_enableMouseFlip(bFlip);
	document.dBook.focus();
}

var minwidth;
var minheight;

function HD_setUserMinWidth(num) {
	var os = getOs();
	var type = isIE();

	if(os==true && type==false){
		minwidth = num;
		HD_fireUserMinWidth();
	}
}
function HD_fireUserMinWidth() {
	document.dBook.handle_setMinWidthforMac(minwidth);
}

function HD_setUserMinHeight(num) {
	minheight = num;
	HD_fireUserMinHeight();
}
function HD_fireUserMinHeight() {
	document.dBook.handle_setMinHeightforMac(minheight);
}

function HD_setFlipPageButType(type){
	document.dBook.handle_setFlipPageButType(type);
}

function HD_setIgoreShadePage(flag, pages){
	document.dBook.handle_setIgoreShadePage(flag, pages)
}

function HD_setFullZoomMode(flag){
	document.dBook.handle_setFullZoomMode(flag);
}

function HD_getRealBrowserHeight(){
	var height = document.body.clientHeight;
	document.dBook.handle_setRealBrowserHeight(height);
}

function HD_getRealBrowserWidth() {
  var width = document.body.clientWidth;
  document.dBook.handle_setRealBrowserWidth(width);
}


function HD_setUserHtmlheight(width){
	document.dBook.handle_setUserHtmlWidth(width);
}