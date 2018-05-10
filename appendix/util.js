/////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : util.js
//  version : 3.5 g1207  (made by Humandream, Inc.)
//
/////////////////////////////////////////////////////
var gbLiveConnect = false;
function CheckLanguage()
{
	try
	{
		languagesq = new Object;
		languagesq["un"] = "un"; //알려지지 않은 언어 .
		languagesq["cn"] = "cn"; //중국어 (simp.) .
		languagesq["cs"] = "cs"; //체코슬로바키아어  .
		languagesq["da"] = "da"; //덴마크어 .
		languagesq["de"] = "de"; //독일어 .
		languagesq["el"] = "el"; //그리스어 .
		languagesq["en"] = "en"; //영어 .
		languagesq["es"] = "es"; //스페인어 .
		languagesq["fc"] = "fc"; //프랑스(캐나다)어 .
		languagesq["fi"] = "fi"; //핀란드어 .
		languagesq["fr"] = "fr"; //프랑스어 .
		languagesq["hu"] = "hu"; //헝가리어 .
		languagesq["it"] = "it"; //이탈리아어 .
		languagesq["ja"] = "ja"; //일본어 .
		languagesq["ko"] = "ko"; //한국어 .
		languagesq["nl"] = "nl"; //네델란드어 .
		languagesq["no"] = "no"; //노르웨이어 .
		languagesq["pl"] = "pl"; //폴란드어 .
		languagesq["pt"] = "pt"; //브라질어 .
		languagesq["ru"] = "ru"; //러시아어 .
		languagesq["sv"] = "sv"; //스웨덴어 .
		languagesq["tr"] = "tr"; //터키어 .
		languagesq["uk"] = "uk"; //영어 (UK) .
		languagesq["tw"] = "tw"; //중국어 (trad.) .
		languagesq["de-de"] = "de-de"; //독일어 .
		languagesq["en-gb"] = "en-gb"; //영어 (UK)  .
		languagesq["en-us"] = "en-us"; //영어 (US) .
		languagesq["es-es"] = "es-es"; //스페인어 .
		languagesq["fr-fr"] = "fr-fr"; //프랑스어 .
		languagesq["ja-jp"] = "ja-jp"; //일본어 .

		lang = "un"; 
		Component = "Unknown browser"; 
		platform = "Unknown platform"; 

		OS = "";
		version = parseFloat(navigator.appVersion); 
		UA = navigator.userAgent; 
		ua = navigator.userAgent.toLowerCase(); 

		if (((start = ua.indexOf("[")) > 0) && ((end = ua.indexOf("]")) == (ua.indexOf("[") + 3))) 
		{ 
			language = ua.substring(start+1, end); 
		} 
		else if (navigator.language) 
		{ 
			language = navigator.language.toLowerCase(); 
		} 
		else if (navigator.userLanguage) 
		{ 
			language = navigator.userLanguage.toLowerCase(); 
		} 

		if (languagesq[language]) 
		{ 
			lang = language; 
		} 
		
		var strLang=languagesq[lang];
	
		return strLang;
	} catch(e) {}
}

var g_isInternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var g_isSafari = navigator.appName.indexOf("Netscape") != -1;
var g_isOpera = navigator.appName.indexOf("Opera") != -1;

function isIE() {
	return g_isInternetExplorer;
}
function isSafari() {
	return g_isSafari;
}
function isOpera() {
	return g_isOpera;
}

function getOs(){
	var isMac = false;
	var m_arrUserAgent = window.navigator.userAgent.split(" ");
	var OSVersion = m_arrUserAgent[4] + m_arrUserAgent[5] + m_arrUserAgent[6];
	if ( OSVersion.indexOf( "Mac" ) == 0){
		isMac = true;
	}else{
		isMac = false;
	}
	return isMac;
}

/////////// Viewer Plug-in 설치 확인 //////////////
var bHDNotInstalled = false;
function checkInstall(){
	var objInstall = document.dBook;	
	try {		
		if (null == objInstall) {bHDNotInstalled = true;}
		if(isIE()) {
			if (null == objInstall.object)
				bHDNotInstalled = true;
		}	
	} catch (HDNototInstalledE) {
		bHDNotInstalled = true;
	}	

	/*
	if(!bHDNotInstalled)
	{

		// flash version detect
		var version = deconcept.SWFObjectUtil.getPlayerVersion();
		
		
		//alert("현재 버전은 " + version['major'] + "." + version['minor'] + "." + version['rev'] + " 입니다.");

		if(version['major'] < 8){
			alert("FlashVersion 이 낮습니다. 8 이상으로 설치하여 주십시오.")
			document.DBookflash.innerHTML = "<table width='450'><tr><td><strong>Thank you for using Zipot DigtalBook.<br/> If you can't see the Digital Book content,<br/> please go to the <font class=fh12 color=#f20000>Adobe Flash Player</b></font> download site and install it.</strong></td></tr><tr><td align='center'><a href=http://www.macromedia.com/go/getflashplayer><img src=get_flash_player.gif border=0></a></td></tr></table>";
		}

	}
	*/	
}

function CheckFlash(){	
	if(bHDNotInstalled) return;	
	try{
		var slideTot;
		var imageName = document.dBook.handle_getImageName();
		document.dBook.focus();
		gbLiveConnect = true;
		HD_onResize();
		HD_setStartPage( getStartPage() );
		HD_setStartText( getStartText() );
		HD_fireUserMinWidth();
		HD_fireUserMinHeight();
	} catch(e){
		var url;
		if(CheckLanguage() == "ja")
			url = "http://www.macromedia.com/support/documentation/jp/flashplayer/help/settings_manager04.html";
		else if(CheckLanguage() == "ko")
			url = "http://www.macromedia.com/support/documentation/kr/flashplayer/help/settings_manager04.html"
		else
			url = "http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html"
		window.open (url, "notice", "toolbar=no, menubar=no, scrollbars=yes, resizable=yes, width=820, height=630, left=50, top=50");
	}
}

function CheckLiveConnect() {

	if(isSafari()) {
		setTimeout("CheckFlash()",10);
	} else if(isOpera()) {
		setTimeout("CheckFlash()",1000);
	} else {
		CheckFlash();
	}
}