!function(a){function b(b,c,d,e){function f(a,b){var c,d,e,f;if(a.getElementsByClassName)return a.getElementsByClassName(b);for(c=[],d=a.getElementsByTagName("*"),e=0,f=d.length;f>e;e++)-1!=d[e].className.indexOf(b)&&(c[c.length]=d[e]);return c}var g,h,i,k,l=c||{},m=function(a){console.log("默认成功回调",b,a)},n=function(a){console.log("默认失败回调",b,a)};switch(d&&(m=d),e&&(n=e),g=function(a){var c=a||{},d=c.code,e=c.result;if("0"===d){switch(b){case"app.onlogout":e=c.result;break;case"common.supbrowser":e=c.result}m&&m.call(null,e)}else n&&n.call(null,e,d)},b){case"app.onlogout":g({code:"0",msg:"成功",result:{code:"0",msg:"成功"}});break;case"common.supbrowser":l&&l.ie?((l.ie<=8&&!("WebSocket"in a&&2===a.WebSocket.CLOSING)||l.ie>=9)&&(h=function(){var a=f(document,"deli-wrap-header")[0];"undefined"==typeof a?setTimeout(h,10):a.insertBefore(k,a.firstChild)},i=f(document,"deli-wrap-supbrowser")[0],i&&"undefined"!=i||(k=document.createElement("div"),k.className="deli-wrap-supbrowser",k.style.width="100%",k.style.height="40px",k.style.backgroundColor="#f8f4ce",k.innerHTML='<div style="width: 1200px;height: 40px;line-height: 40px;margin: 0 auto;background-color: #f8f4ce;text-align:center;color: #3f3f3f;font-size: 12px;"><div style="position: relative; width: 300px; margin: 0 auto;"><i class="icon-supbrowser" style="width: 14px; height: 14px; margin: 13px 0; background-image: url(http://t.static.delicloud.com/www/home/images/prompt.png?v=20180628); display: inline-block; position: absolute; left: 0; top: 0;"></i><p style="margin-left: 24px;text-align: left;">当前浏览器版本过低，推荐使用最新版<a href="https://ie.sogou.com/" target="_blank" style="color:#5d85e0;">搜狗高速浏览器</a></p></div></div>',h())),g({code:"0",msg:"成功",result:{code:"0",msg:"成功"}})):setTimeout(function(){j&&j({message:"参数错误",errorCode:"-1"})})}}function c(b){return b.__wrapper||(b.__wrapper=function(){try{return b.apply(this,arguments)}catch(c){return a.setTimeout(function(){throw c},0),!1}}),b.__wrapper}var d,e,f=["getLoginStatus","app.onlogout","common.supbrowser"],g="1.0.1",h=!1,i=null,j=null,k=null,l="test",m="www"==l?"https://www.delicloud.com":"test"==l?"http://t.delicloud.com":"202"==l?"http://192.168.0.202":"http://192.168.0.201";!function(){function b(a,b,c){return a+=-1==a.indexOf("?")?"?":"&",a+=encodeURIComponent(b)+"="+encodeURIComponent(c)}function c(a){var b,c="",d="";for(b in a)d=b+"="+a[b],c+=d+"&";return c.slice(0,c.length-1)}var d=function(a){this.config={url:"",type:"get",async:!0,dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",data:{}},this.start(a)},e=null;d.init=function(a){new d(a)},d.prototype={constructor:d,createXHR:function(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=typeof arguments.callee.activeXString){var a,b,c=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];for(a=0,b=c.length;b>a;a++)try{new ActiveXObject(c[a]),arguments.callee.activeXString=c[a];break}catch(d){}}return new ActiveXObject(arguments.callee.activeXString)}throw new Error("No XHR object available.")},start:function(d){var f,g,h,i,j;if(e=new this.createXHR,!d.url)throw new Error("url cannot be null!");if(this.config.url=d.url,d.type&&(this.config.type=d.type),d.async&&(this.config.async=d.async),d.dataType&&(this.config.dataType=d.dataType),d.data&&(this.config.data=d.data),d.success&&(this.config.success=d.success),d.fail&&(this.config.fail=d.fail),d.beforeSend&&d.beforeSend(),f=function(){if(4==e.readyState)if(e.status>=200&&e.status<300||304==e.status)d.success&&d.success(e.responseText);else{if(!d.fail)throw new Error("Request was unsucessful:"+e.status);d.fail()}},"json"==this.config.dataType||"JSON"==this.config.dataType){if("GET"==this.config.type||"get"==this.config.type){for(g in this.config.data)this.config.url=b(this.config.url,g,this.config.data[g]);e.onreadystatechange=f,e.open(this.config.type,this.config.url,this.config.async),e.send(null)}("POST"==this.config.type||"post"==this.config.type)&&(e.addEventListener("readystatechange",f),e.open(this.config.type,this.config.url,this.config.async),d.contentType&&(this.config.contentType=d.contentType),e.setRequestHeader("Content-Type",this.config.contentType),e.send(c(this.config.data)))}else{if("jsonp"!=this.config.dataType&&"JSONP"!=this.config.dataType)throw new Error("dataType is error!");if("GET"==this.config.type||"get"==this.config.type){if(!d.url||!d.callback)throw new Error("params is illegal!");this.config.callback=d.callback,h="callback",i=document.getElementsByTagName("head")[0],this.config[this.config.callback]=h,j=document.createElement("script"),i.appendChild(j),a[h]=function(b){i.removeChild(j),clearTimeout(j.timer),a[h]=null,d.success&&d.success(b)},d.time&&(j.timer=setTimeout(function(){i.removeChild(j),d.fail&&d.fail({message:"over time"}),a[h]=null},d.time)),this.config.url=this.config.url+"?callback="+h;for(g in this.config.data)this.config.url=b(this.config.url,g,this.config.data[g]);j.src=this.config.url}}}},a["deliApi"]=d}(),d={version:g,init:function(b,c){var d=this;h===!1&&(h=!0,null!==i&&i.sign?deliApi.init({url:""+m+"/web/v1.0/cd/premission/check/public",type:"get",dataType:"jsonp",data:i,callback:"callback",success:function(b){if(0==b.code)void 0===d.util.getQuery("user_id")&&"undefined"==d.util.getCookie("user_id")&&void 0===d.util.getQuery("token")&&"undefined"==d.util.getCookie("token")?(alert("用户未登录或者登录信息已经过期，请重新登录"),a.location.replace(m+"/oa/")):setTimeout(function(){d.prefixLoadTpl(d.util.getQuery("user_id")||d.util.getCookie("user_id"),d.util.getQuery("token")||d.util.getCookie("token")),"function"==typeof c&&c()},0);else{var e=b.msg?b.msg:"网络或服务器错误",f=b.msg?"-1":"-3";setTimeout(function(){j&&j({message:"权限校验失败 "+e,errorCode:f})})}},fail:function(a){var b=a.msg?a.msg:"网络或服务器错误",c=a.msg?"-1":"-3";setTimeout(function(){j&&j({message:"权限校验失败 "+b,errorCode:c})})}}):console.log("配置错误，请重新填写配置",i))},config:function(a){a&&(i={appId:a.appId||-1,timestamp:a.timestamp,noncestr:a.noncestr,sign:a.signature},a.appId&&(i.appId=a.appId))},api:function(b){var c,d,e=new XMLHttpRequest,f=b.type||"post",g=b.url;if("get"===f&&b.data){c=[];for(d in b.data)b.data.hasOwnProperty(d)&&c.push(d+"="+b.data[d]);g=g+"?"+c.join("&")}e.open(f,g,!0),b.data||(b.data={}),e.onreadystatechange=function(){var c;if(4===e.readyState){if(200===e.status){try{c=JSON.parse(e.responseText)}catch(d){}c?0==c.code?"function"==typeof b.success&&b.success(c):("function"==typeof b.error?b.error(c):b.silent||alert(c.msg),9102112==c.code&&(alert(c.msg),a.location.replace(m+"/oa/"))):"function"==typeof b.error?b.error(e,"parse_error"):b.silent||alert("数据解析失败: "+e.responseText)}else"function"==typeof b.error?b.error(e,"network_error"):b.silent||alert("网络或服务器错误: "+e.status);"function"==typeof b.complete&&b.complete(e)}},b.data instanceof FormData?(b.dauth&&(e.setRequestHeader("Dauth",b.dauth),e.setRequestHeader("Duagent","_web")),e.send(b.data)):(e.setRequestHeader("content-type","application/json"),b.dauth&&(e.setRequestHeader("Dauth",b.dauth),e.setRequestHeader("Duagent","_web")),e.send(JSON.stringify(b.data)))},apiJsonp:function(b){function c(a){var b,c=[];for(b in a)c.push(encodeURIComponent(b)+"="+encodeURIComponent(a[b]));return c.join("&")}var d,e,f,g;if(b=b||{},!b.url||!b.callback)throw new Error("参数不合法");d=("jsonp_"+Math.random()).replace(".",""),e=document.getElementsByTagName("head")[0],b.data[b.callback]=d,f=c(b.data),g=document.createElement("script"),e.appendChild(g),a[d]=function(c){e.removeChild(g),clearTimeout(g.timer),a[d]=null,b.success&&b.success(c)},g.src=b.url+"?"+f,b.time&&(g.timer=setTimeout(function(){a[d]=null,e.removeChild(g),b.fail&&b.fail({message:"超时"})},time))},error:function(a){j=a},ready:function(a){var b=this,c=function(){b.init(i,a)};c()},prefixLoadTpl:function(b,c){var d=this,e={init:function(){var e,f,g,h,i,j='<style>body,button,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,legend,li,ol,p,td,textarea,th,ul{margin:0;padding:0}                        i{font-style:normal}                        ul{list-style:none}                        table{border-collapse:collapse;border-spacing:0}                        body{font-size:12px;font-family:Microsoft YaHei UI,"微软雅黑",Heiti SC,Droid Sans;color:#666;background-color:#fff}                        .deli-wrap-header{position: fixed; z-index: 100; clear: both; height: 80px; background: #fff; font-size: 12px;box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -moz-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -webkit-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -o-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}                        .deli-wrap-header a{color:#666;text-decoration:none;hide-focus:expression(this.hideFocus=true);outline:0}                        .deli-wrap-header a:hover{text-decoration:none}                        .deli-wrap-header a img{border:none}                        .deli-wrap-header .pointer{cursor:pointer}                        .deli-wrap-header{width:100%;height:80px;background-color:#FDFDFD;box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -moz-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -webkit-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -o-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}                        .deli-wrap-deli-footer{background-color:#cfd2d7;margin:0 auto}                        .deli-wrap-header.deli-wrap-top{background:#fff}                        .deli-wrap-header.deli-wrap-top.deli-wrap-top-shadow{box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -moz-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -webkit-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5); -o-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.5);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}                        .deli-wrap-header .deli-user-head{width:100%;height:80px;margin:0 auto;background-color:#fff}                        .deli-clear:after{visibility:hidden;display:block;font-size:0;content:"";clear:both;height:0}                        .deli-clear{zoom:1}                        .deli-clearfix:after,deli-clearfix:before{content:" ";display:table}.deli-clearfix:after{clear:both}                        .deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2);-moz-box-shadow:0 2px 5px rgba(0,0,0,.2);-webkit-box-shadow:0 2px 5px rgba(0,0,0,.2);-o-box-shadow:0 2px 5px rgba(0,0,0,.2);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}                        .deli-wrap-header #deli-head{width: 1200px;height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px;margin: 0 auto;}                        .deli-wrap-header #deli-head .deli-logo-box{display: inline-block; position: absolute; bottom: 0; left: 0;}                        .deli-wrap-header #deli-head .deli-logo-box .deli-logo{display: inline-block; float: left; width: 178px; height: 50px; line-height: 50px; margin: 15px 0;background-image: url(https://static.delicloud.com/www/home/images/logo.png?v=20180317); background-repeat: no-repeat; background-size: cover;}                        .deli-wrap-header #deli-head .deli-nav-top{width: 900px; height: 40px; position: absolute; bottom: 20px; right: 20px;}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-team{display:none}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current{width:120px;padding:0 10px;color:#5d85e0;border:1px solid #5d85e0;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current.larget{width:140px;padding:0 20px}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current .deli-navlink-icon{font-size:12px;color:#5d85e0;position:absolute;right:10px}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink:hover{-background-color:#55BEBF;color:#5d85e0}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink-current{-background-color:#55BEBF;color:#5d85e0}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item.current,.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item:hover{color:#5d85e0}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-login{position: absolute; right: 0; text-align: center;}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-device{margin-left: 0;}                        deli-wrap-header #deli-head .deli-nav-top .deli-nologin{display:block;font-size:16px;margin-left:5px;width:100px}                        .deli-wrap-header #deli-head .deli-nav-top .deli-nologin a{font-size:16px;color:#5d85e0;text-decoration:none}                        .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover{position:relative}                        .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover>.deli-user-panel{display:block}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info .deli-user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info i{display:none;position:absolute;top:8px;right:8px}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info.visited i,.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info:hover i{display:block}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset{display:none;border:1px solid #d9d9d9;border-top:0}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link:hover{color:#5d85e0}                        .deli-wrap-footer{background-color:#cfd2d7}                        .deli-footer{-padding-top:25px;padding-top:50px; width:1200px;margin:0 auto}                        .deli-footer-link{-height:100px;width: 95%; padding-left: 5%;}                        .deli-footer-link dl{-width:155px; width:275px; float:left;-height:100px;-margin-right:100px;margin-bottom:0}                        .deli-footer-link dl.deli-attus{position:relative;-width:170px;width:220px;margin-right:0}                        .deli-footer-link dl.deli-attus .deli-icon-phone{display:inline-block; background:url(https://static.delicloud.com/www/home/images/telephone_icon.png) 0 0 no-repeat;width:16px;height:18px; vertical-align: top; margin-top: 3px; margin-right: 10px;}                        .deli-footer-link dl.deli-attus .deli-icon-weixin-img{-display:none; display:inline-block; -position:absolute;-top:-80px;-left:-25px;-background-image:url(https://static.delicloud.com/www/home/images/weixin.png); background-image:url(https://static.delicloud.com/www/home/images/wechat_icon.png);-width:80px;width:22px;-height:80px; height:18px; vertical-align: top; margin-top: 3px; margin-right: 6px;}                        .deli-footer-link dl.deli-attus .deli-icon-qq{-margin-right:50px;display: inline-block; background-image:url(https://static.delicloud.com/www/home/images/qq_icon.png); width: 16px;height: 18px; vertical-align: top; margin-top: 3px; margin-right: 10px;}                        .deli-footer-link dl.deli-attus .deli-icon-weixin{position:relative}                        .deli-footer-link dl.deli-attus .deli-icon-qq,.deli-footer-link dl.deli-attus .deli-icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}                        .deli-footer-link dl.deli-attus .deli-icon-qq:hover,.deli-footer-link dl.deli-attus .deli-icon-weixin:hover{color:#55bfbe}                        .deli-footer-link dl.deli-attus .deli-icon-weixin:hover .deli-icon-weixin-img{display:block}                        .deli-footer-link dl .deli-kefu-phone{font-size:16px}                        .deli-footer-link dl dt{font-size:18px; font-weight:700; -line-height:26px; color:#666; letter-spacing:5px;margin-bottom:20px;}                        .deli-footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:18px;letter-spacing:5px}                        .deli-footer-link dl dd a{font-size:16px;color:#333;letter-spacing:2px;display:inline-block;text-decoration:none}                        .deli-footer-link dl dd:hover a{color:#666;text-decoration:none}                        .deli-footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center;letter-spacing:2px;}                        .deli-footer-link dl.deli-attus dd b {font-size: 16px; color: #333; font-weight: normal;letter-spacing:2px; cursor: pointer;}                        .deli-footer-link dl.deli-attus dd:hover b {color: #666;}</style>',k=document.head||document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css",l.styleSheet?l.styleSheet.cssText=j:l.appendChild(document.createTextNode(j)),k.appendChild(l),e='<div class="deli-user-head">                        <div id="deli-head" class="deli-clear">                            <div class="deli-logo-box">                                <a href="http://t.delicloud.com/" class="deli-logo" title="得力e+"></a>                            </div>                            <div class="deli-nav-top">                                <ul class="deli-nav-top-list deli-clear">                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">首页</a>                                    </li>                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/#!contacts" class="deli-navlink">组织通讯录</a>                                    </li>                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/#!apphome" class="deli-navlink">应用</a>                                    </li>                                    <li class="deli-nav-item deli-nav-item-device"><a href="http://t.delicloud.com/oa/#!device" class="deli-navlink">设备</a>                                    </li>                                    <li class="deli-nav-item deli-nav-item-team"><a href="javascript:;" class="deli-navlink deli-nav-item-current"><span class="deli-navlink-name"></span> <span class="deli-navlink-icon"><i class="iconfont">&#xe608;</i></span></a>                                        <div class="sun-nav-list sun-nav-list-team">                                            <a class="sub-deli-nav-item current" href="javascript:;"></a>                                            <a class="sub-deli-nav-item" href="javascript:;"></a>                                            <a class="sub-deli-nav-item" href="javascript:;"></a>                                        </div>                                    </li>                                    <li class="deli-nav-item deli-nav-item-login">                                        <div class="deli-nologin"><a href="javascript:;" class="deli-nologin-btn">退出</a></div>                                        <div class="deli-login deli-user-panel">                                            <a href="javascript:;" class="deli-user-info fl" style="display:block">                                                <img class="deli-user-info-avatar" width="50" height="50" src=""><i class="iconfont"></i>                                            </a>                                            <div class="deli-user-asset fl" style="display:none"><a class="deli-user-asset-link deli-logout" href="javascript:;">退出登录</a>                                            </div>                                        </div>                                    </li>                                </ul>                            </div>                        </div>                    </div>',f='<div class="deli-footer">                        <div class="deli-footer-link deli-clear">                            <dl><dt>使用帮助</dt>                                <dd><a href="http://b2b.nbdeli.com" target="_blank">去购买智能设备</a>                                </dd>                                <dd><a href="http://download.delicloud.com/app/delispecification.pdf" target="_blank">App使用帮助</a>                                </dd>                            </dl>                            <dl><dt>应用开发商</dt>                                <dd><a href="http://doc.delicloud.com/site/" target="_blank">应用接入指南</a>                                </dd>                            </dl>                            <dl><dt>关于我们</dt>                                <dd><a href="http://www.nbdeli.com/" target="_blank">关于得力</a>                                </dd>                                <dd><a href="http://hr.nbdeli.cn/scripts/mgrqispi.dll?Appname=HRsoft2000&Prgname=REC2_RESUME_STAFF_P&ARGUMENTS=-AC" target="_blank">加入我们</a>                                </dd>                            </dl>                            <dl class="deli-attus"><dt>联系我们</dt>                                <dd class="deli-kefu-phone"><span class="deli-icon-phone"></span><b>400-185-0555</b></dd>                                <dd class="deli-kefu-qq"><span class="deli-icon-qq"></span><b>327264079</b></dd>                                <dd class="deli-kefu-wechat"><span class="deli-icon-weixin-img"></span><b>得力e+公众号</b></dd>                            </dl>                        </div>                        <div class="deli-footer-copyright">鄂ICP备17027057号  Copyright &copy;2018 武汉得力智能办公研究院有限公司 版权所有</div>                    </div>',g=document.createElement("div"),h=document.createElement("div"),g.className="deli-wrap-header",h.className="deli-wrap-footer",g.innerHTML=e,h.innerHTML=f,document.querySelector("body").appendChild(h),document.querySelector("body").insertBefore(g,document.body.firstElementChild||document.body.children[0]),i=document.querySelector(".deli-wrap-header .deli-nologin a.deli-nologin-btn"),i.addEventListener?i.addEventListener("click",function(){d.util.setCookie("userid",void 0),d.util.setCookie("token",void 0),d.logout(b,c,function(){a.location.replace(m+"/oa/")})},!1):i.attachEvent("onclick",function(){d.util.setCookie("userid",void 0),d.util.setCookie("token",void 0),d.logout(b,c,function(){a.location.replace(m+"/oa/")})})}};b&&c?deliApi.init({url:""+m+"/web/v1.0/cd/login/"+b+"/web",type:"get",dataType:"jsonp",data:{},callback:"callback",success:function(a){if(0==a.code){var f=a.data.result.token&&a.data.result.token.length>0?"connect":"noconnect";"connect"==f?(d.util.setCookie("userid",a.data.result.user_id),d.util.setCookie("token",a.data.result.token)):d.logout(b,c),e.init()}},fail:function(f){if(0==f.code){var g=f.data.result.token&&f.data.result.token.length>0?"connect":"noconnect";"connect"==g||d.logout(b,c),e.init()}else 9102112==f.code?setTimeout(function(){j&&j({message:f.msg,errorCode:-1})}):(alert("用户未登录或者登录信息已经过期，请重新登录"),a.location.replace(m+"/oa/"))}}):(alert("用户未登录或者登录信息已经过期，请重新登录"),a.location.replace(m+"/oa/"))},logout:function(a,b,c){var d=this;deliApi.init({url:""+m+"/web/v1.0/cd/logout/web",type:"get",dataType:"jsonp",data:{Dauth:a+" "+(new Date).valueOf()+" "+d.util.buildDauth(a,b,(new Date).valueOf()),Duagent:"_web"},callback:"callback",success:function(a){0==a.code?(d.util.setCookie("userid",void 0),d.util.setCookie("token",void 0),k&&k({data:a.data}),"function"==typeof c&&c()):"function"==typeof c&&c()},fail:function(a){"function"==typeof c&&c(),setTimeout(function(){j&&j({message:a.msg,errorCode:-1})})}})},util:{setCookie:function(a,b,c){var d,e=new Date;e.setDate(e.getDate()+c),d=escape(b)+"; path=/"+(null==c?"":"; expires="+e.toUTCString()),document.cookie=a+"="+d},getCookie:function(a){var b,c,d,e=document.cookie.split(";");for(b=0;b<e.length;b++)if(c=e[b].substr(0,e[b].indexOf("=")),d=e[b].substr(e[b].indexOf("=")+1),c=c.replace(/^\s+|\s+$/g,""),c==a)return unescape(d)},buildHash:function(a){var b,c;for(b in a.args)c+=void 0===a.args[b]?"&"+encodeURIComponent(b):"&"+encodeURIComponent(b)+"="+encodeURIComponent(a.args[b]);return c},parseHash:function(a){var b,c,d,e={args:{}};if(a=a.substr(1).replace(/[#\?].*$/,""),d=a.match(/[^=&]+(=[^&]*)?/g)){"!"===d[0].charAt(0)&&(c=d[0].substr(1),c in pages&&(e.id=decodeURIComponent(c)));for(b=1;b<d.length;b++)c=d[b].match(/^([^=]+)(=)?(.+)?$/),c&&(e.args[decodeURIComponent(c[1])]=c[2]?decodeURIComponent(c[3]||""):void 0)}return e},getQuery:function(b){var c,d,e,f,g;for(Function.prototype.method=function(a,b){return this.prototype[a]=b,this},String.prototype.trim||(String.method("trim",function(){return this.replace(/^\s+|\s+$/g,"")}),String.method("ltrim",function(){return this.replace(/^\s+/g,"")}),String.method("rtrim",function(){return this.replace(/\s+$/g,"")})),c=a.location.href,d=c.indexOf("?"),e=c.slice(d+1).split("&"),f=0;f<e.length;f++)if(g=e[f].split("="),g[0].trim()==b)return g[1].trim()},SHA256:function(a){function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a>>>b|a<<32-b}function d(a,b){return a>>>b}function e(a,b,c){return a&b^~a&c}function f(a,b,c){return a&b^a&c^b&c}function g(a){return c(a,2)^c(a,13)^c(a,22)}function h(a){return c(a,6)^c(a,11)^c(a,25)}function i(a){return c(a,7)^c(a,18)^d(a,3)}function j(a){return c(a,17)^c(a,19)^d(a,10)}function k(a,c){var d,k,l,m,n,o,p,q,r,s,t,u,v=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298),w=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225),x=new Array(64);for(a[c>>5]|=128<<24-c%32,a[(c+64>>9<<4)+15]=c,r=0;r<a.length;r+=16){for(d=w[0],k=w[1],l=w[2],m=w[3],n=w[4],o=w[5],p=w[6],q=w[7],s=0;64>s;s++)x[s]=16>s?a[s+r]:b(b(b(j(x[s-2]),x[s-7]),i(x[s-15])),x[s-16]),t=b(b(b(b(q,h(n)),e(n,o,p)),v[s]),x[s]),u=b(g(d),f(d,k,l)),q=p,p=o,o=n,n=b(m,t),m=l,l=k,k=d,d=b(t,u);w[0]=b(d,w[0]),w[1]=b(k,w[1]),w[2]=b(l,w[2]),w[3]=b(m,w[3]),w[4]=b(n,w[4]),w[5]=b(o,w[5]),w[6]=b(p,w[6]),w[7]=b(q,w[7])}return w}function l(a){var b,c=Array(),d=(1<<o)-1;for(b=0;b<a.length*o;b+=o)c[b>>5]|=(a.charCodeAt(b/o)&d)<<24-b%32;return c}function m(a){var b,c,d;for(a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++)d=a.charCodeAt(c),128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d));return b}function n(a){var b,c=p?"0123456789ABCDEF":"0123456789abcdef",d="";for(b=0;b<4*a.length;b++)d+=c.charAt(15&a[b>>2]>>8*(3-b%4)+4)+c.charAt(15&a[b>>2]>>8*(3-b%4));return d}var o=8,p=0;return a=m(a),n(k(l(a),a.length*o))},buildDauth:function(a,b,c){var e=(a?a:"")+(b?b:"")+c,f=d.util.SHA256(e),g=f.substr(0,32);return g}}},e=function(a,b){var c,e,f=a.split("."),g=d;for(c=0,e=f.length;e>c;c++)c===e-1&&(g[f[c]]=b),"undefined"==typeof g[f[c]]&&(g[f[c]]={}),g=g[f[c]]},Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c,d,e,f,g;if(null==this)throw new TypeError("this is null or not defined");if(e=Object(this),f=e.length>>>0,"function"!=typeof a)throw new TypeError(a+" is not a function");for(1<arguments.length&&(c=b),d=0;f>d;)d in e&&(g=e[d],a.call(c,g,d,e)),d++}),f.forEach(function(a){e(a,function(c,d,e){b(a,c,d,e)})}),a.deli=d,a.deliAsyncInit&&c(a.deliAsyncInit)(),"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=d:"function"==typeof define&&(define.amd||define.cmd)&&define(function(){return d})}(this);