	//Author: Curt Henderson
	
	// description: calling this jquery extended funciton will dim the screen and display a modal window centered on top of the dimmed screen. Modal 
	// content and class (style) can be definied by arguments you pass to the function. By default, pressing the 'esc' key will close this modal
	// but this can be turned off
		
	//usage:
	/*
	
	1. to invoke modal:
		$.showModal({content:"<html content here>"});
	
	2. to hide modal:
		$.hideModal(); // modal ID required if there is more than one modal present
		
	3. to update modal content:
		$.updateModal({updateModalID: 'yourModalID'});
		
	4. Remove any and all Modals:
		$.killAllModals();
	
*/	
var XconfigX = {}; //global configuration object defined

var mainColor = 'DarkGray';
var startColor = 'Gray';

var XdefModalStyleX = { //default modal style if none is defined, change to whatever you like
					 
	background: '#587498'
	,background: '-webkit-linear-gradient(' + startColor + ',' + mainColor + ')'
	,background: '-o-linear-gradient(' + startColor + ',' + mainColor + ')'
	,background: '-moz-linear-gradient(' + startColor + ',' + mainColor + ')'
	,background: 'linear-gradient(' + startColor + ',' + mainColor + ')'
	//,background: 'url(/images/info-icon-64x64.png) 8px 8px no-repeat, linear-gradient(' + startColor + ',' + mainColor + ')'
	,color: 'white'
	,borderRadius: '5px'
	,boxShadow: '0px 0px 10px black'
	,display: 'none'
	,position: 'fixed'
	,padding: '50px 25px 50px 25px'
	,width: '30%'
	,maxWidth: '600px'
	,minWidth: '350px'
	,textAlign: 'center'
	,fontFamily: "'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif"
	,fontWeight: 'bold'
	,fontSize: '16px'
	,overflow: 'hidden'
	,zIndex: 500
	
};

jQuery.extend({ 
	
	 showModal: function(settings) {
		 
		 "use strict";
		 
         XconfigX = {
			
			/*options*/
            content: null
			,modalClass: null
			,allModalClass: "XmodalX" //class given to all Modals (use to remove all modals if needed)
			,noClose: 0 //vaues are 0 or 1. 1 removes the close link from the top right of the modal and prevents hitting 'esc' to close it either
			,closeText: 'CLOSE' //text for the close link
			,modalPosition: 'fixed' // 'fixed' will maintain the dimmer over the screen content even upon scrolling
			,onLoadCallBack: null //optional callback function to run after modal is fully loaded
			,onCloseCallBack: null //optional callback function to run after modal is closed
			,theModalID: 'XtheModalX' // create your own Modal ID here if you wish
			,dimScreen: 1 //wether or not to dim screen. NOTE: if set to 0 the content behind the modal will be clickable
			,screenDimmerIndex: 500 //z-index of the dimmer
			,screenDimmerID: 'XscreenDimmerX' // create your own screenDimmer ID if you wish
			,screenDimmerOpacity: '.70' // how translucent you want the dimmer to be
			,screenDimmerColor: 'black' // what color you want the dimmer to be
			,fadeSpeed: 150 // how fast the modal fades in and out (milliseconds)
			,topPosition: 3 // divisor of screen height to get the top position of the modal. example: 3 would be screenHeight/3. so the top of the modal would be a 3rd of the way down the screen. Increase this number to make the modal appear higher on the screen, decrease to move lower
			,draggable: 1 // 1 = make this modal draggable, 0 = it is not draggable
			,fullScreen: 0
			
         };
		
		 if(settings){$.extend(XconfigX, settings);}
				 
		 if(XconfigX.content === null) { return; } //modal content must be passed
		 
		 var $body = $("body"); 
		 
		 XconfigX.modalIndex = XconfigX.screenDimmerIndex + 500; 
		 
		 var modfunc = function() {
			 
			 var $theModal = $("<div>", {id: XconfigX.theModalID});
			 
			 if(!XconfigX.modalClass) {
			 
				 $theModal.css(XdefModalStyleX).addClass(XconfigX.allModalClass);
				 
			 } else {
				 
				 $theModal.addClass(XconfigX.modalClass).css({"position":XconfigX.modalPosition,"z-index":XconfigX.modalIndex});
				 $theModal.addClass(XconfigX.allModalClass);
				 
			 }
			 
			//$theModal.
				 
			$theModal.html(XconfigX.content);
			
			$body.append($theModal);
			 
			if(XconfigX.fullScreen === 0) {
			 
				$theModal.css("top", ($(window).height() - $theModal.height())/XconfigX.topPosition + "px");
				$theModal.css("left", (($(window).width() - $theModal.outerWidth())/2) + $(document).scrollLeft() + "px");

				if(XconfigX.draggable) {

					$theModal.mousedown(make_draggable);

				}
				
			} else {
				
				$theModal.css({
					
					  "position":"absolute"
					  ,"top":"0px"
					  ,left:"0px"
					  ,"height":"100%"
					  ,"width":"100%"
					  ,"max-width":"3000px"
					  ,"border-radius":"0px"
							  
			     }).addClass("XfullScreenModalX");
				
			}
			
			if(!XconfigX.noClose) { //if allowing 'escape' to kill the modal window and showing a 'close' link in the box
			
				var $thisModalID = XconfigX.theModalID;
				
				 XconfigX.closeButton = $("<div>", {id: 'XcloseModalX-'+XconfigX.theModalID}).html(XconfigX.closeText);
				
				 $theModal.append(XconfigX.closeButton);
				
				 var $xclose = $("#XcloseModalX-"+$thisModalID);
				
				 $xclose.css({
					 
					  "position":"absolute"
					 ,"top":"8px"
					 ,"right":"8px"
					 ,"font-size":"12px"
					 ,"font-style":"italic"
					 ,"font-weight":"bold"
					 ,"font-family":"arial"
					 ,"cursor":"pointer"
					 
				 }).show();
				 
				 $xclose.on({
					 
					 click: function() {
						 
						 $.hideModal({
							 
							hideModID: $thisModalID	
													 
						 });
						 
					 },
					 mouseenter: function() {
						 
						 $(this).css("text-decoration","underline");
						 
					 },
					 mouseleave: function() {
						 
						 $(this).css("text-decoration","none");
						 
					 }
					 
				 });
				 
			}
			
			if(XconfigX.onLoadCallBack && typeof XconfigX.onLoadCallBack === 'function') {
			
				$theModal.fadeIn(XconfigX.fadeSpeed).promise().done(function() {
					
    				XconfigX.onLoadCallBack();
					
				});
				
			} else {
				
				$theModal.fadeIn(XconfigX.fadeSpeed);
				
			}
			
			$(window).on('resize',function() {
				
				$.modalResize();
				
			});
			 
		 }
		 
		 if(XconfigX.dimScreen && !$("#" + XconfigX.screenDimmerID).length && !XconfigX.fullScreen) {
			 
			 var $screenDimmer = $("<div>", {id: XconfigX.screenDimmerID});
			 
			 $screenDimmer.addClass("XalreadyDimmedX");

			 $screenDimmer.css({

				 display: 'none'
				,height: '100%'
				,width: '100%'
				,left: '0px'
				,top: '0px'
				,position: 'fixed'
				,opacity: XconfigX.screenDimmerOpacity
				,background: XconfigX.screenDimmerColor
				,zIndex: XconfigX.screenDimmerIndex

			 });

			 $body.append($screenDimmer);

			 $screenDimmer.fadeIn(XconfigX.fadeSpeed,modfunc);
			 
		 } else {
			 
			modfunc();
			 
		 }
		 
	 },
	 
	 modalResize: function() {
		 
		"use strict";
		 
		 $("." + XconfigX.allModalClass).each(function() {
			 
			 if(XconfigX.fullScreen === 0) {
            
				$(this).css("top", ($(window).height() - $(this).height())/XconfigX.topPosition + "px");
				$(this).css("left", (($(window).width() - $(this).outerWidth())/2) + $(document).scrollLeft() + "px");
				 
			 } else {
				 
				 $(this).css({
					 
					  "top":"0px"
					  ,left:"0px"
					  ,"height":"100%"
					  ,"width":"100%"
					 
				 });
				 
			 }
			
        });
		 
		
	 },
	 
	 updateModal: function(settings) {
		 
		 "use strict";
	 
          var updateConfig = {
			
			/*options*/
            updateModalID: XconfigX.theModalID
			,newClass: XconfigX.modalClass
			,newContent: null
			 
		 };
		  
		 if (settings){$.extend(updateConfig, settings);}
		 
		 $("#" + updateConfig.updateModalID).html(updateConfig.newContent).attr({"class":updateConfig.newClass}).addClass(XconfigX.allModalClass);
		 
		 $.modalResize();
		 
	 },
	 
	 isModal: function() {
		 
		 "use strict";
		 
		 if($("." + XconfigX.allModalClass).length) {
			 
			 return true;
			 
		 } else {
			 
			 return false;
			 
		 }
		 
	 },
	 
	 hideModal: function(settings) {
		 
		 "use strict";
	 
          var hideConfig = {
			
			/*options*/
            hideModID: XconfigX.theModalID
			 
		 };
		  
		 if (settings){$.extend(hideConfig, settings);}
		 
		 var $theModal = $("#" + hideConfig.hideModID);
		 var $screenDimmer = $("#" + XconfigX.screenDimmerID);
		 
		 $theModal.fadeOut(XconfigX.fadeSpeed,function() {
			 
			 $theModal.remove();
			 
			 if(!$("." + XconfigX.allModalClass).length) {
			 
				 $screenDimmer.fadeOut(XconfigX.fadeSpeed,function() {
					 
					 $(window).unbind("resize");
					 $screenDimmer.remove();
					 
					 if(XconfigX.onCloseCallBack && typeof XconfigX.onCloseCallBack === 'function') {
						 
						 XconfigX.onCloseCallBack();
						 
					 } 
					 
				 });
				 
			 }
			 
		 });
		 
	 },
	 
	 killAllModals: function(settings) {
		 
		 "use strict";
	 
          var hideConfig = {
			
			/*options*/
            hideModID: XconfigX.theModalID
			 
		 };
		  
		 if (settings){$.extend(hideConfig, settings);}
		 
		 var $screenDimmer = $("#" + XconfigX.screenDimmerID);

		 $("." + XconfigX.allModalClass).remove();
		 $($screenDimmer).remove();
		 
	 }
	
});

function make_draggable(e){
	
	if( !$(e.target).is('input') && 
	    !$(e.target).is('textarea') && 
	    !$(e.target).is('button') &&
	    !$(e.target).is('select') &&
	    !$(e.target).is('canvas') &&
	   	!$(e.target).hasClass('NoDrag')	     
		
		) { //don't drag mousedown is on one of the above exlusions
	
		window.my_dragging = {};
		my_dragging.pageX0 = e.pageX;
		my_dragging.pageY0 = e.pageY;
		my_dragging.elem = this;
		my_dragging.offset0 = $(this).offset();
		function handle_dragging(e){

			var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);

			var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);

			$(my_dragging.elem).offset({top: top, left: left});

		}

		function handle_mouseup(e){

			$('body')
			.off('mousemove', handle_dragging)
			.off('mouseup', handle_mouseup);

		}

		$('body')
		.on('mouseup', handle_mouseup)
		.on('mousemove', handle_dragging);
		
	}
	
}