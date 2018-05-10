// functions of Cookies ===========================================

function toggleBookmark(LeftOrRight){
	var nPageNum;
	if ( document.dBook.handle_isDoublePage() )	{
		if ( LeftOrRight == 0 ) nPageNum = document.dBook.handle_getLeftSlidePage();
		else nPageNum = document.dBook.handle_getRightSlidePage();
	}else nPageNum = document.dBook.handle_getCurSlidePage();
	
	if ( AddBookmarks( nPageNum ) )	{
		var strCmd = "type=bookmark;command=togglePage;param=" + nPageNum;
		document.dBook.handle_ExecuteScript(strCmd);
	}else{
		RemoveBookmark( nPageNum );

		var strCmd = "type=bookmark;command=togglePage;param=" + nPageNum;
		document.dBook.handle_ExecuteScript(strCmd);
	}
}
	
function loadBookmark(){
	var dBookObj = isIE() ? document.all.dBook : document.dBook;
	var strBookmarks = GetBookmarkString();
	if (strBookmarks == null)
		return;

	var strCmd = "type=bookmark;command=addPage;param=" + strBookmarks;
	dBookObj.handle_ExecuteScript(strCmd);
}

function SetCookie(cookieName,cookieValue,nDays) 
{
	var today = new Date();
	var expire = new Date();
	if (nDays==null || nDays==0) nDays=1;
	expire.setTime(today.getTime() + 3600000*24*nDays);
	document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString();
}

function GetCookie(cookieName) 
{
	var theCookie= "" + document.cookie;
	var ind = theCookie.indexOf(cookieName);
	if (ind==-1 || cookieName=="") return ""; 
	var ind1=theCookie.indexOf(';',ind);
	if (ind1==-1) ind1=theCookie.length; 
	return unescape(theCookie.substring(ind+cookieName.length+1,ind1));
}

// functions of Bookmarks ===========================================

var g_strBookmarkName = "dBookmark";
var g_strBookmarkDelimeter = ",";
function GetBookmarkArray()
{
	var strCookie = GetCookie(g_strBookmarkName);

	var arrBookmark = strCookie.split(g_strBookmarkDelimeter);
	
	if (arrBookmark == null || arrBookmark.length == 0 || arrBookmark[0].length == 0)
		return null;
	else
		return arrBookmark;
}

function GetBookmarkString()
{
	var strBookmark = GetBookmarkArray();
	if (strBookmark == null)
		return null;
	
	strBookmark.join(g_strBookmarkDelimeter);
	
	return strBookmark;
}

function SaveBookmarkArray(arrBookmarkParam)
{
	var strBookmarkData = arrBookmarkParam;
	strBookmarkData.sort();

	SaveBookmarkString( strBookmarkData.join(g_strBookmarkDelimeter) );
}

function SaveBookmarkString(strBookmarkParam)
{
	var nDays = 365;
	SetCookie(g_strBookmarkName, strBookmarkParam, nDays);
}

function AddBookmarks(strPageIds)
{
	strPageIds = strPageIds + "";
	var arrParam = strPageIds.split(",");
	for (var i=0; i<arrParam.length; i++)
	{
		if ( !sub_AddBookmark(arrParam[i]) )
			return false;
	}
	
	return true;
}

function sub_AddBookmark(strPageId)
{
	if (strPageId == null || strPageId.length == 0)
		return false;

	var arrBookmark = GetBookmarkArray();
	if (arrBookmark == null)
		arrBookmark = new Array();
		
	var count = arrBookmark.length;
	for (var i=0; i<count; i++)
	{
		if (arrBookmark[i] == strPageId)
		{
			return false;
		}
	}
	
	if (arrBookmark.length == 0)
		arrBookmark[0] = strPageId + "";
	else if (arrBookmark[arrBookmark.length -1] != null && arrBookmark[arrBookmark.length -1].length > 0)
		arrBookmark[arrBookmark.length] = strPageId + "";
	else
		arrBookmark[arrBookmark.length -1] = strPageId + "";
			
	SaveBookmarkArray(arrBookmark);
	
	return true;
}

function ResetBookmark()
{
	SaveBookmarkString("");
}

function RemoveBookmark(strPageId)
{
	strPageId = strPageId + "";
	
	var strTemp = "";
	var strData = "";
	var arrBookmark = GetBookmarkArray();
	var nCount = arrBookmark.length;
	for (var i=0; i<nCount; i++)
	{
		if (arrBookmark[i] == strPageId)
		{
			var strRemove = "999999";
			arrBookmark[i] = strRemove;
			arrBookmark.sort();
			
			if (arrBookmark.length == 1)
				strData = "";
			else
			{
				strTemp = arrBookmark.join(g_strBookmarkDelimeter);
				strData = strTemp.substr(0, strTemp.length - (strRemove.length + 1) );
			}
				
			break;
		}
		
		if (i == nCount-1)
		{
			strData = arrBookmark.join(g_strBookmarkDelimeter);
		}
	}

	SaveBookmarkString(strData);
}

function ClearAllBookmark(){

	var strData = "";
	var arrBookmark = GetBookmarkArray();
	var nCount;
	try{
		nCount = arrBookmark.length;
	}catch(e){
		return;
	}
	
	for (var i=0; i<nCount; i++)
	{
		arrBookmark.pop();
	}
	SaveBookmarkString(strData);
	document.dBook.handle_ExecuteScript("type=clearbookmark;");
}