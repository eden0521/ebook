/////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file Name : parameterHandler.js
//  version : 3.4 g1120  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////


// Please do not input the 2bytes characters for foreign web-agent.

// To open with the "startpage" parameter, insert the below strings at the BODY onLoad tag.
// onLoad="setStartPage( getStartPage() );"

/***
	[How to set up for the startpage]
	1. default1.html : <script language="JavaScript" src="appendix/parameterHandler.js"></script>
	2. default1.html : <BODY onLoad="JavaScript:setStartPage( getStartPage() )">
***/
	// public method for url decoding   

function URLDecode(string) {   
	return utf8_decode(unescape(string));   
}


function utf8_decode(utftext){
	var string = "";        
	var i = 0;        
	var c = c1 = c2 = 0;        
	
	while ( i < utftext.length ) {            
		c = utftext.charCodeAt(i);            
		if (c < 128) {                
			string += String.fromCharCode(c);                
			i++;            
		}else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);                
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));                	
			i += 2;            
		}else {                
			c2 = utftext.charCodeAt(i+1);                
			c3 = utftext.charCodeAt(i+2);                
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));                
			i += 3;            
		}        
	}        
	return string;
}


function getParameter( strParamName )				
{
	//  input : String, Parameter name from HTTP GET Paramemeter.
	// output : String, Parameter value which is parsed.
	
	var strParamValue = "[null]";
    var objWin = this;
    
    try 
    {
        while ( objWin != null )
        {
    		//  var strThisURL = objWin.location.href.toLowerCase();
    		var strThisURL = objWin.location.href + "";
    		
            if( -1 != strThisURL.indexOf( strParamName + "=",0 ) )
            {
        		var strParam = strThisURL.substring( strThisURL.indexOf(strParamName + "=",0), strThisURL.length );
        		if ( strParam == null || strParam == "" )		break;
        		var arrParam = strParam.split( "&" );
        		strParamValue = arrParam[0].substring( arrParam[0].indexOf(strParamName + "=",0)+strParamName.length+1, arrParam[0].length );
                break;        		
    	    }
      	    if ( objWin.parent==null || objWin==window.top ) 	break;
    	    else objWin = objWin.parent;
        }
    } 
    catch (e) 
    {
    	//	alert( "Parameter parsing failure.\nPlease check the frameset of HTML." );
    }
    
    return strParamValue;
}

//	for debug : alert( "Extracted Parameter Value = '" + getParameter( 'abc' ) + "'" );
//  USAGE : <script language="JavaScript" src="getParameter.js"></script>
var isStartPageName = false;

function getStartPage()				
{
	var strStartPage = "1";			// default start page = 1
	
	strStartPage = getParameter( "startpage" );

	if(strStartPage == "[null]"){
		strStartPage = getParameter( "startpagename");
		if(strStartPage == "[null]") isStartPageName = false;
		else isStartPageName = true;
	}else{ isStartPageName = false;}

    //if ( isNaN( strStartPage ) )	strStartPage = "1";		// exception handler for non-digit type string.
    
    return strStartPage;
}

function getStartText()
{
  var strStartText = "";
	  strStartText = getParameter( "stext" );
	  strStartText = URLDecode(strStartText);
  return strStartText;
}

function getIsStartPageName(){
	return isStartPageName;
}

//	for debug : alert( "Extracted StartPage = '" + getStartPage() + "'" );
function setStartPage( strStartPage ) 
{
	
}

function setAutoFlip( ) 
{	
	var isRotate = document.dBook.handle_getRotateEnable();
	try{
		if(isRotate==1) {
			document.all.autoFlipTableOn.style.visibility="hidden";
			document.all.autoFlipTableOn.style.position="absolute";			
			document.all.autoFlipTableOff.style.visibility="visible";
			document.all.autoFlipTableOff.style.position="relative";
		}	else {
			document.all.autoFlipTableOff.style.visibility="hidden";
			document.all.autoFlipTableOff.style.position="absolute";			
			document.all.autoFlipTableOn.style.visibility="visible";
			document.all.autoFlipTableOn.style.position="relative";
		}
	}catch(e_set){}
}
function getAutoPage()				
{
	var strAutoPage = "0";			// default auto page = 0
	
	strAutoPage = getParameter( "autopage" );
    
    if ( isNaN( strAutoPage ) )	strAutoPage = "0";		// exception handler for non-digit type string.
    
    return strAutoPage;
}

//	for debug : alert( "Extracted StartPage = '" + getStartPage() + "'" );


function setAutoPage( strAutoPage ) 
{	
	if ( strAutoPage == null || strAutoPage == "" || strAutoPage <= "0")  
			return;			
	
	if ( document.dBook == null )	return;		

	your_pressAutoFlip('on',strAutoPage);
}
function getMailingParam()		// get params for 3DDM
{
	var objWin = this;
	var strThisHREF = "";

	try
	{
		while ( objWin != null )
		{
			strThisHREF = objWin.location.href;    			
			// In case of MSN Mail, the exception occurred at objWin.location.href exception.

			if( -1 != strThisHREF.indexOf("RcptEmail=",0) )		break;
			if ( objWin.parent==null || objWin==window.top ) 	break;
			else objWin = objWin.parent;
		}
	}
	catch (e)	
	{
		// In case of MSN Mail, an exception occurred at objWin.location.href exception.
	}
    
    return strThisHREF;
}
//	alert( "Extracted StartPage = '" + getStartPage() + "'" );
//	alert( "getMailingParam() = " + getMailingParam() );


function getCRMData()
{
	var strData;
	strData = getURLData();
	if (strData != "" && getCookieData() != "")
	{
		strData = strData + "&"
	}
	strData = strData + getCookieData();
	return strData;
}


function getURLData( )				
{
	//  input : String, Parameter name from HTTP GET Paramemeter.
	// output : String, Parameter value which is parsed.
	var strParamName = "dbookdata";
	var strResult = "";
    var objWin = this;
	var strThisURL = "";
    
    try 
    {
        while ( objWin != null )
        {
			strThisURL = objWin.location.href + "";		
			// In case of MSN Mail, an exception occurred at objWin.location.href exception.
    		
            if( -1 != strThisURL.indexOf( strParamName + "=",0 ) )
            {
//				alert("strParamName : " + strParamName);
        		strResult = strThisURL.substring( strThisURL.indexOf("?",0) + 1, strThisURL.length );
//				alert("strResult : " + strResult);
        		if ( strResult != null && strResult != "" )		break;
    	    }
      	    if ( objWin.parent==null || objWin==window.top ) 	break;
    	    else objWin = objWin.parent;
        }
    } 
    catch (e)	
    {
		// In case of MSN Mail, an exception occurred at objWin.location.href exception.
    }
//	alert("strParamName : " + strParamName);
//	alert("strParamValue : " + strParamValue);
    return strResult;
}


function getCookieData()
{
	var strCookie = "" + document.cookie;
	re = /\;\s+/gi;
	strCookie = strCookie.replace(re, "&");
//	alert("cookie : " + strCookie);
	return strCookie;
}
