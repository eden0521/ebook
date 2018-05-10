//////////////////////////////////////////////////////
//
//  Since 1998 Copyright(c)
//  Humandream, Inc.
//  All rights reserved
//  file name : expandHandler.js
//  version : 3.4 g1120  (made by Humandream, Inc.)
//
//////////////////////////////////////////////////////

//***************************
var wheelScrollDone;		
var wheelEventCount;
var wheelEventDoneCount;

var dBookWidth;
var dBookHeight;


//***************************
var offsetTop;
var offsetLeft;
var offsetParentTop;
var offsetParentLeft;

function initDBookExpand()
{

	wheelScrollDone = 0;
	wheelEventCount = 0;
	wheelEventDoneCount = 0;


	offsetTop=0;
	offsetLeft=0;
	offsetParentTop=0;
	offsetParentLeft=0;

	var tempStartPage;

	if (document.layers) 
	{
	//	 window.dBook.onmousewheel = WheelScrollEventService;
	}
	else if (document.all)
	{
	//	 document.dBook.onmousewheel = WheelScrollEventService;
	}

	try {
		dBookWidth = document.dBook.width;
		dBookHeight = document.dBook.height;
	} catch (sieze_e) {}
}

function WheelScrollEventService(e)
{
	wheelEventCount = wheelEventCount + 1;
	try
	{
		if(wheelScrollDone == 0)
		{
			wheelScrollDone = 1;
			if (document.all)
		    {
				window.event.returnValue = false;
			}
			else if (document.layers)
		    {
			    window.event.returnValue = false;
			}

			var LPage = document.dBook.handle_getLeftSlidePage();
			
			
			FullZoomLevel = document.dBook.handle_getTotalZoomStep();
			
			CurrentZoomLevel = document.dBook.handle_getCurrZoomStep();
			
			ZoomAreaTop = document.dBook.handle_getZoomAreaTop();
			
			ZoomAreaRight = document.dBook.handle_getZoomAreaRight();
			ZoomAreaBottom = document.dBook.handle_getZoomAreaBottom();
			
			msg = "Full = " + FullZoomLevel + "\n";
			msg = msg + "Current = " + CurrentZoomLevel + "\n";
			
			if(CurrentZoomLevel != 0)
			{
				ZoomLevel=(document.dBook.handle_getCurrZoomStep());
				
				ZoomAreaLeft=(document.dBook.handle_getZoomAreaLeft());
				ZoomAreaTop=(document.dBook.handle_getZoomAreaTop());
				
				var ZoomAreaRight=(document.dBook.handle_getZoomAreaRight());
				var ZoomAreaBottom=(document.dBook.handle_getZoomAreaBottom());
				
				var PageOffset, ZoomOffset;
	
				var moveX, moveY;
/*				
				if(firstZoomWhell == 1)
				{
					
					dBookFullZoomLevel=(document.dBook.handle_getTotalZoomStep());
					var ZoomOffset = Math.pow(2,dBookFullZoomLevel-ZoomLevel);
	
					PageOffset=dBook.width*Math.pow(2,ZoomLevel);
					
					if( document.dBook.handle_isDoublePage() )
					{
						if( (ZoomAreaLeft+ZoomAreaRight)/2 < PageOffset/2 ) document.dBook.handle_moveZoom(-dBookWidth, 0);
						else document.dBook.handle_moveZoom(dBookWidth, 0);
					}

					firstZoomWhell = 0;
				}
*/
					
				if(window.event.wheelDelta > 0) 
				{
					document.dBook.handle_moveZoom(0, -window.event.wheelDelta);
				}
				else if (window.event.wheelDelta < 0) 
				{
					document.dBook.handle_moveZoom(0, -window.event.wheelDelta);
				}
				
				wheelScrollDone = 0;
			}
			else
			{
				wheelEventDoneCount = wheelEventDoneCount + 1;
				
				if(window.event.wheelDelta < 0)
				{
					your_pressNextPage();
				}
				else if (window.event.wheelDelta > 0)
				{
					your_pressPreviousPage();
				}
				wheelScrollDone = 0;
			}
		}
	} catch(e1) { }
}

	
//***************************
function getOffsetLeft(oBjectID)
{
    offsetLeft = 0;
    offsetTop = 0;
    offsetParentTop=0;
    offsetParentLeft=0;
        
    getFullLocation(oBjectID);
    
    return offsetLeft;
}

function getOffsetTop(oBjectID)
{
    offsetLeft = 0;
    offsetTop = 0;
    offsetParentTop=0;
    offsetParentLeft=0;
      
    getFullLocation(oBjectID);
    
    return offsetTop;
}


function getFullLocation(oBject)
{
   if(oBject.nodeName != 'BODY')
   {
     if( (oBject.offsetTop == offsetParentTop) && (oBject.offsetLeft == offsetParentLeft ))
     {
          offsetTop = offsetTop + oBject.offsetTop;
          offsetLeft = offsetLeft + oBject.offsetLeft;
     }

     offsetParentTop = oBject.offsetParent.offsetTop;
     offsetParentLeft = oBject.offsetParent.offsetLeft;
            
     oBject = oBject.parentNode;
     getFullLocation(oBject);		
   }
}


function expand_StartZoom()
{	

	ZoomLevel=(document.dBook.handle_getCurrZoomStep());
	
	ZoomAreaLeft=(document.dBook.handle_getZoomAreaLeft());
	ZoomAreaTop=(document.dBook.handle_getZoomAreaTop());
	
	var ZoomAreaRight=(document.dBook.handle_getZoomAreaRight());
	var ZoomAreaBottom=(document.dBook.handle_getZoomAreaBottom());
	


	//your_pressLeftZoom();
	
	var dBookTableTop=getOffsetTop(dBookTable);
	
	browserWidth = parseInt(document.body.clientWidth) - 35;
	browserHeight = parseInt(document.body.clientHeight) - parseInt(dBookTableTop) - 35;

	dBook.width = browserWidth;
	dBook.height = browserHeight;
	document.dBook.handle_resize(browserWidth, browserHeight);

	// alert("your_StartZoom");
}

function expand_EndZoom()
{
	// alert("your_EndZoom");
	//wheelScrollDone = 0;

	var resizeWidth = parseInt(dBookWidth);
	var resizeHeight = parseInt(dBookHeight);
	
	document.dBook.handle_resize(resizeWidth, resizeHeight);

	dBook.width = resizeWidth;
	dBook.height = resizeHeight;
}

