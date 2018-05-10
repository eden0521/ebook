////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : dBookFunctions.js
//  version : 3.4 g1120  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////

function your_StartZoom() 
{
	expand_StartZoom();
}

function your_EndZoom()
{
	expand_EndZoom();
}


function your_gotoPage( nPage ) 
{		
	HD_gotoPage( nPage );
	// TODO : Add your implementation code here.
}

function your_pressNextPage() 
{		
	HD_pressNextPage();
	// TODO : Add your implementation code here.    
}

function your_pressPreviousPage() 
{	
	HD_pressPreviousPage();
	// TODO : Add your implementation code here.    
}

function your_gotoFirstPage() 
{		
	HD_gotoFirstPage();
	// TODO : Add your implementation code here.    
}

function your_gotoEndPage() 
{			
	HD_gotoEndPage();
	// TODO : Add your implementation code here.    
}

function your_pressReload() 
{		
	HD_pressPause();
	// TODO : Add your implementation code here.    
}

function your_pressLeftZoom() 
{		
	var ZoomLevel=dBook.handle_getCurrZoomStep();
	if (ZoomLevel > 0)
		HD_pressPause();

	HD_pressLeftZoom();
	// TODO : Add your implementation code here.    
}

function your_pressRightZoom() 
{			
	var ZoomLevel=dBook.handle_getCurrZoomStep();
	if (ZoomLevel > 0)
		HD_pressPause();

	HD_pressRightZoom();
	// TODO : Add your implementation code here.    
}

function your_pressZoom() 
{			
	HD_pressZoom();
	// TODO : Add your implementation code here.    
}

function your_pressCloseUp() 
{		
	HD_pressCloseUp();
	// TODO : Add your implementation code here.    
}

function your_changePage() 
{ 
    HD_setPageNum(); 
    // TODO : Add your implementation code here.
} 

function your_endRotate() 
{ 
    // alert( "Rotating And" ); 
    
    // Related to APPLET Event 'endRotate'.      
    // TODO : Add your implementation code here.
} 

function your_notFlipPrev() 
{ 
    // alert( MSG_DBOOK_004 );
    // Related to APPLET Parameter 'eventFunctions'.
    // TODO : Add your implementation code here.
} 

function your_notFlipNext() 
{ 
    // alert( MSG_DBOOK_005 );
    // Related to APPLET Parameter 'eventFunctions'.
    // TODO : Add your implementation code here.
} 


function your_minimizeWindow()
{
	minimizeBrowser();
}

function your_openReplace( url ) 
{ 
    openReplace( url );
} 


function your_endInitLink()
{
	try{
		your_treatSlidePage();
	}catch(e){}
}


// On load defaunt1.html ***********************************************************************
function onLoadProcsss()
{	
	HD_setFlipPageButType(2);
	HD_onResize();
	setTimeout("HD_onResize()",1000);
}


// On Unload defaunt1.html ***********************************************************************
function onUnLoadProcsss()
{
	DigitalBookUnload();
}

// 
function your_onPrint(value) {
	//HD_parseNPrintWeb(value);
	HD_parseNPrintFlash(value);
}

function your_onPrintEx(value) {
	HD_printExFlash(value);
}

function your_onPrintAll() {
	HD_printAllFlash();
}

function your_showBookmarkMenu() {
	HD_showBookmarkMenu();
}

function your_showPrintMenu() {
	HD_showPrintMenu();
}

function your_showPenMenu() {
	HD_showPenMenu();
}

function your_createNewMemo() {
	HD_createNewMemo();
}

function your_startSlide(sec) {
	HD_startSlide(sec);
}


var bMouseFlip = true;
function your_enableMouseFlip() {
	if(bMouseFlip) bMouseFlip = false;
	else bMouseFlip = true;
	HD_eableMouseFlip(bMouseFlip);
}

function your_swapMouseFlipImage() {
	if(bMouseFlip) MM_swapImage('Image18','','skin/images/noa_zoom_off.gif',1);
	else MM_swapImage('Image18','','skin/images/noa_zoom_on.gif',1);
}

function your_MouseFlipMouseOver() {
	if(bMouseFlip) MM_swapImage('Image18','','skin/images/noa_zoom_on.gif',1);
	else MM_swapImage('Image18','','skin/images/noa_zoom_off.gif',1);
}

function your_leftFlipZoomEnd() {
	HD_eableMouseFlip(true);
	bMouseFlip = true;
	//ZOOMBUTTON.innerHTML = "<a href=\"javascript:your_enableMouseFlip();\" onFocus=\"blur();\" onmouseout=\"your_swapMouseFlipImage()\" onmouseover=\"your_MouseFlipMouseOver()\"><img src=\"skin/images/noa_zoom_off.gif\" name=\"Image18\" width=\"45\" height=\"40\" border=\"0\" id=\"Image18\"/></a>"
}
