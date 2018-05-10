////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : browserHandler.js
//  version : 3.4 g1120  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////

var m_nScreenWidth = 1024;
var m_nScreenHeight = 768;
var m_arrUserAgent = window.navigator.userAgent.split(" ");
var m_arrAppMinorVersion = window.navigator.appMinorVersion.split(";");

function getScreenWidth()
{
	//	alert( "w=" + window.screen.width );
	if ( window.screen.width != null )	m_nScreenWidth = window.screen.width;
	return m_nScreenWidth;
}

function getScreenHeight()
{
	//	alert( "h=" + window.screen.height );
	if ( window.screen.height != null )	m_nScreenHeight = window.screen.height;
	return m_nScreenHeight;
}

function getAppName()
{
	 return window.navigator.appName;
	 // ex : appName = Microsoft Internet Explorer
}

function getUserAgent()
{
	 return window.navigator.userAgent;
	 // ex : userAgent = Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; Q312461)
}

function getAppMinorVersion()
{
	 return window.navigator.appMinorVersion;
	 // ex : appMinorVersion = ;SP1;Q328970;Q324929;Q810847;Q813951;
}

function getBrowserVersion()
{
	//	return m_arrUserAgent[2] + m_arrUserAgent[3] + m_arrAppMinorVersion[1];
	return m_arrUserAgent[2] + m_arrUserAgent[3];
	// ex : MSIE6.0; -> Notice : semicolon(;) is attached.
}

function getOSVersion()
{
	return m_arrUserAgent[4] + m_arrUserAgent[5] + m_arrUserAgent[6];
	// Notice : result is WindowsNT5.0; or WindowsNT5.0)
}


  var bDoNotMaximize;
	var winDBook;
	
	// Minimum Screen Resolution Check
	if ( getScreenWidth() < 1024 || getScreenHeight() < 768 )
	{
     	winDBook = window.open( "appendix/warning_smallResolution.htm", "DBookWarningWin","top=160,left=240,width=300,height=250");
	   	//	moveTo() occure "Access Denied Problem" sometimes.
     	//	winDBook.moveTo( 200, 200 );
     	//	winDBook.resizeTo( 300, 250 );
			//	return false;
			bDoNotMaximize = true;
	}
	
	// Browser Type Check : IE only available
	if ( getAppName() != "Microsoft Internet Explorer" )
	{
     	winDBook = window.open( "appendix/warning_IEonly.htm", "DBookWarningWin2","top=160,left=240,width=300,height=250");
	   	//	moveTo() occure "Access Denied Problem" sometimes.
     	//	winDBook.moveTo( 200, 200 );
     	//	winDBook.resizeTo( 300, 250 );
			//	return false;
			bDoNotMaximize = true;
	}



// NOTICE! NOTICE! : This javascript have to be included at JavaScript 1.2!
// NOTICE! NOTICE! : Example - SCRIPT LANGUAGE="Javascript1.2"
function maximizeBrowser()
{
		if ( bDoNotMaximize )		return;
    window.moveTo( -4, -4 );
    window.resizeTo( getScreenWidth(), getScreenHeight() );
    var nDiffHeight = window.screenTop;
    window.moveTo( -6, -nDiffHeight - 5 );
    window.resizeTo( getScreenWidth() + 12, getScreenHeight() + nDiffHeight + 35 );
    
    return false;
}

function minimizeBrowser()
{
	if (!document.hhctrl)
	{
       	var htmlHHCtrlTag = "";
		htmlHHCtrlTag = '<OBJECT id="hhctrl" type="application/x-oleobject" classid="clsid:adb880a6-d8ff-11cf-9377-00aa003b7a11"> ';
		htmlHHCtrlTag += ' <PARAM NAME="Width" VALUE="1"> ';
		htmlHHCtrlTag += ' <PARAM NAME="Height" VALUE="1"> ';
		htmlHHCtrlTag += ' <PARAM NAME="Command" VALUE="minimize"> ';
		htmlHHCtrlTag += '</OBJECT> ';
		document.body.insertAdjacentHTML("beforeEnd",htmlHHCtrlTag);
	}

	try
	{
		hhctrl.Click();
	} catch(e) {
		if( confirm("You need Microsoft Windows Help Control.\n\nInstall Microsoft Windows Help Control?") ) 
		{
			window.open("http://msdn.microsoft.com/library/default.asp?url=/library/en-us/htmlhelp/html/hwMicrosoftHTMLHelpDownloads.asp");
		}
	}
}


