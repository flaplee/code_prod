"use strict";require(["/framework/config.js"],function(){var e=document.head||document.getElementsByTagName("head")[0],n=document.createElement("link"),t=document.createElement("link");n.rel=t.rel="stylesheet",n.href=require.toUrl("site/index/index.css"),t.href=require.toUrl("site/kernel/kernel.css"),require(["site/index/index"]),require(["site/ready/ready","site/kernel/kernel"],function(e,n){n.appendCss("/dev/page/news/news.css");var t={func:{init:function(){var e=this;e.bindEv()},bindEv:function(){var e=this,n=$("#news .news-box .recent-info .slide-scroll"),t=$("#news .news-box .news-recent .recent-inner-por");e.setTimeSlide(n),e.setChangeTabs(t.find(".por-head a"),t.find(".por-body ul.por-list"),"click")},setTimeSlide:function(e){var n=e,t=n.find(".slide-scroll-list"),i=t.find(".item"),r=n.find("ol li"),s=0,o=i.length-1,d=null,l={init:function(){var e=l._setInter();n.hover(function(){clearInterval(e),e=null,n.find(".slide-btn").show()},function(){e=l._setInter(),n.find(".slide-btn").hide()}),n.find(".pre-btn").click(function(){d&&clearTimeout(d),l._prev()}),n.find(".next-btn").click(function(){d&&clearTimeout(d),l._next()}),r.click(function(){d&&clearTimeout(d);var e=r.index($(this)[0]);l._go(e)})},_prev:function(){s--,s=0>s?o:s,l._go()},_next:function(){s++,s=s>o?0:s,l._go()},_go:function(e){s!=e&&(d=setTimeout(function(){d&&clearTimeout(d),s=null!=e?e:s;i.find(".cur").index();i.removeClass("cur").eq(s).addClass("cur"),r.removeClass("cur").eq(s).addClass("cur")},500))},_setInter:function(e){var n,t=e||3e3;return n=setInterval(function(){l._next()},t)}};l.init()},setChangeTabs:function(e,n,t){e.on(t,function(){var t,i,r,s=e.filter(".cur").index();n.removeClass("cur").eq(s).addClass("cur"),t=$(this),i=e.is("li")||e.is("div")?t.parent("li").length>0?t.parent("li"):t.parent("div"):t,r=t.index(),i.hasClass("cur")||(i.addClass("cur").siblings().removeClass("cur"),n.eq(r).removeClass("none").addClass("cur").siblings().removeClass("cur").addClass("none"))})}}};return t.func.init(),e(function(){document.body.className="ready",document.getElementById("loading").style.display=""}),{onload:function(){},onunload:function(){}}}),e.appendChild(n),e.appendChild(t)});