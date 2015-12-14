$(document).ready(function() { 
	//fonts
	WebFontConfig = {
	google: { families: [ 'Roboto:400,300:latin' ] }
	};
	(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
	})(); 
	//MENU SCROLL
	$('.buttonblock1, .logo, .button_border, .navi a').click(function(){
		var idscroll = $(this).attr('href');
		$.scrollTo(idscroll, 700,{offset:-70});
		return false;
	});
	// MENU FIXED
	var nav = $('.headblock');
	$(window).scroll(function () {
		if ($(this).scrollTop() > 10) {
			nav.addClass("fixed");
		} else {
			nav.removeClass("fixed");
		}
	});
	// navi
	$(".menu").click(function(e) {
	$(".navi").toggleClass("naviopen");
	$(".menu").toggleClass("menuopen");
	e.preventDefault();
	});
	$(".navi a").click(function(){
	$(".navi").removeClass("naviopen");
	$(".menu").removeClass("menuopen");
	});
});
// Check mobiles
function is_mobile() {return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));}
// Check OSX
function is_OSX() {return navigator.platform.match(/(Mac|iPhone|iPod|iPad|Android)/i) ? true : false;}

// HasScroll
if (!is_OSX() || !window.opera === undefined) {
	$.fn.hasScrollBar = function(){return this.get(0).scrollHeight > this.height();}
	/* SmoothScroll v0.9.9 | Licensed under the terms of the MIT license. | People involved - Balazs Galambosi: maintainer (CHANGELOG.txt) - Patrick Brunner (patrickb1991@gmail.com) - Michael Herf: ssc_pulse Algorithm*/
	function ssc_init(){if(document.body){var e=document.body,s=document.documentElement,t=window.innerHeight,c=e.scrollHeight;if(ssc_root=document.compatMode.indexOf("CSS")>=0?s:e,ssc_activeElement=e,ssc_initdone=!0,top!=self)ssc_frame=!0;else if(c>t&&(e.offsetHeight<=t||s.offsetHeight<=t)&&(ssc_root.style.height="auto",ssc_root.offsetHeight<=t)){var r=document.createElement("div");r.style.clear="both",e.appendChild(r)}ssc_fixedback||(e.style.backgroundAttachment="scroll",s.style.backgroundAttachment="scroll"),ssc_keyboardsupport&&ssc_addEvent("keydown",ssc_keydown)}}function ssc_scrollArray(e,s,t,c){if($("html").hasClass("si-lock")&&!$(".si-modals-wrapper").hasScrollBar())return!1;if(c||(c=1e3),ssc_directionCheck(s,t),ssc_que.push({x:s,y:t,lastX:0>s?.99:-.99,lastY:0>t?.99:-.99,start:+new Date}),!ssc_pending){var r=function(){for(var a=+new Date,n=0,o=0,i=0;i<ssc_que.length;i++){var l=ssc_que[i],u=a-l.start,_=u>=ssc_animtime,d=_?1:u/ssc_animtime;ssc_pulseAlgorithm&&(d=ssc_pulse(d));var p=l.x*d-l.lastX>>0,f=l.y*d-l.lastY>>0;n+=p,o+=f,l.lastX+=p,l.lastY+=f,_&&(ssc_que.splice(i,1),i--)}if(s){var h=e.scrollLeft;e.scrollLeft+=n,n&&e.scrollLeft===h&&(s=0)}if(t){var m=e.scrollTop;e.scrollTop+=o,o&&e.scrollTop===m&&(t=0)}s||t||(ssc_que=[]),ssc_que.length?setTimeout(r,c/ssc_framerate+1):ssc_pending=!1};setTimeout(r,0),ssc_pending=!0}}function ssc_wheel(e){ssc_initdone||ssc_init();var s=e.target,t=ssc_overflowingAncestor(s);if(!t||e.defaultPrevented||ssc_isNodeName(ssc_activeElement,"embed")||ssc_isNodeName(s,"embed")&&/\.pdf/i.test(s.src))return!0;var c=e.wheelDeltaX||0,r=e.wheelDeltaY||0;c||r||(r=e.wheelDelta||0),Math.abs(c)>1.2&&(c*=ssc_stepsize/120),Math.abs(r)>1.2&&(r*=ssc_stepsize/120),ssc_scrollArray(t,-c,-r),e.preventDefault()}function ssc_keydown(e){var s=e.target,t=e.ctrlKey||e.altKey||e.metaKey;if(/input|textarea|embed/i.test(s.nodeName)||s.isContentEditable||e.defaultPrevented||t)return!0;if(ssc_isNodeName(s,"button")&&e.keyCode===ssc_key.spacebar)return!0;var c,r=0,a=0,n=ssc_overflowingAncestor(ssc_activeElement),o=n.clientHeight;switch(n==document.body&&(o=window.innerHeight),e.keyCode){case ssc_key.up:a=-ssc_arrowscroll;break;case ssc_key.down:a=ssc_arrowscroll;break;case ssc_key.spacebar:c=e.shiftKey?1:-1,a=-c*o*.9;break;case ssc_key.pageup:a=.9*-o;break;case ssc_key.pagedown:a=.9*o;break;case ssc_key.home:a=-n.scrollTop;break;case ssc_key.end:var i=n.scrollHeight-n.scrollTop-o;a=i>0?i+10:0;break;case ssc_key.left:r=-ssc_arrowscroll;break;case ssc_key.right:r=ssc_arrowscroll;break;default:return!0}ssc_scrollArray(n,r,a),e.preventDefault()}function ssc_mousedown(e){ssc_activeElement=e.target}function ssc_setCache(e,s){for(var t=e.length;t--;)ssc_cache[ssc_uniqueID(e[t])]=s;return s}function ssc_overflowingAncestor(e){var s=[],t=ssc_root.scrollHeight;do{var c=ssc_cache[ssc_uniqueID(e)];if(c)return ssc_setCache(s,c);if(s.push(e),t===e.scrollHeight){if(!ssc_frame||ssc_root.clientHeight+10<t)return ssc_setCache(s,document.body)}else if(e.clientHeight+10<e.scrollHeight&&(overflow=getComputedStyle(e,"").getPropertyValue("overflow"),"scroll"===overflow||"auto"===overflow))return ssc_setCache(s,e)}while(e=e.parentNode)}function ssc_addEvent(e,s,t){window.addEventListener(e,s,t||!1)}function ssc_removeEvent(e,s,t){window.removeEventListener(e,s,t||!1)}function ssc_isNodeName(e,s){return e.nodeName.toLowerCase()===s.toLowerCase()}function ssc_directionCheck(e,s){e=e>0?1:-1,s=s>0?1:-1,(ssc_direction.x!==e||ssc_direction.y!==s)&&(ssc_direction.x=e,ssc_direction.y=s,ssc_que=[])}function ssc_pulse_(e){var s,t,c;return e*=ssc_pulseScale,1>e?s=e-(1-Math.exp(-e)):(t=Math.exp(-1),e-=1,c=1-Math.exp(-e),s=t+c*(1-t)),s*ssc_pulseNormalize}function ssc_pulse(e){return e>=1?1:0>=e?0:(1==ssc_pulseNormalize&&(ssc_pulseNormalize/=ssc_pulse_(1)),ssc_pulse_(e))}var ssc_framerate=150,ssc_animtime=500,ssc_stepsize=150,ssc_pulseAlgorithm=!0,ssc_pulseScale=6,ssc_pulseNormalize=1,ssc_keyboardsupport=!0,ssc_arrowscroll=50,ssc_frame=!1,ssc_direction={x:0,y:0},ssc_initdone=!1,ssc_fixedback=!0,ssc_root=document.documentElement,ssc_activeElement,ssc_key={left:37,up:38,right:39,down:40,spacebar:32,pageup:33,pagedown:34,end:35,home:36},ssc_que=[],ssc_pending=!1,ssc_cache={};setInterval(function(){ssc_cache={}},1e4);var ssc_uniqueID=function(){var e=0;return function(s){return s.ssc_uniqueID||(s.ssc_uniqueID=e++)}}(),ie=navigator.userAgent.toLowerCase().match(/msie|Trident/i);null==ie&&(ssc_addEvent("mousedown",ssc_mousedown),ssc_addEvent("mousewheel",ssc_wheel),ssc_addEvent("load",ssc_init)),function(e){e.fn.appear=function(s,t){var c=e.extend({one:!0},t);return this.each(function(){var t=e(this);if(t.appeared=!1,!s)return void t.trigger("appear",c.data);var r=e(window),a=function(){if(!t.is(":visible"))return void(t.appeared=!1);var e=r.scrollLeft(),s=r.scrollTop(),a=t.offset(),n=a.left,o=a.top;o+t.height()>=s&&o<=s+r.height()&&n+t.width()>=e&&n<=e+r.width()?t.appeared||t.trigger("appear",c.data):t.appeared=!1},n=function(){if(t.appeared=!0,c.one){r.unbind("scroll",a);var n=e.inArray(a,e.fn.appear.checks);n>=0&&e.fn.appear.checks.splice(n,1)}s.apply(this,arguments)};c.one?t.one("appear",c.data,n):t.bind("appear",c.data,n),r.scroll(a),e.fn.appear.checks.push(a),a()})},e.extend(e.fn.appear,{checks:[],timeout:null,checkAll:function(){var s=e.fn.appear.checks.length;if(s>0)for(;s--;)e.fn.appear.checks[s]()},run:function(){e.fn.appear.timeout&&clearTimeout(e.fn.appear.timeout),e.fn.appear.timeout=setTimeout(e.fn.appear.checkAll,20)}}),e.each(["append","prepend","after","before","attr","removeAttr","addClass","removeClass","toggleClass","remove","css","show","hide"],function(s,t){var c=e.fn[t];c&&(e.fn[t]=function(){var s=c.apply(this,arguments);return e.fn.appear.run(),s})})}(jQuery);
}