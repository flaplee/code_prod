(function(g){function B(a,b,d,e){var c=function(c){console.log("\u9ed8\u8ba4\u6210\u529f\u56de\u8c03",a,c)},t=function(c){console.log("\u9ed8\u8ba4\u5931\u8d25\u56de\u8c03",a,c)};d&&(c=d);e&&(t=e);b=function(b){b=b||{};var e=b.code,d=b.result;if("0"===e){switch(a){case "app.onlogout":d=b.result}c&&c.call(null,d)}else t&&t.call(null,d,e)};switch(a){case "app.onlogout":b({code:"0",msg:"\u6210\u529f",result:{"app.onlogout":"app.onlogout"}})}}var A=!1,m=null,h=null,z=null;(function(){function a(c,a,b){c+=
-1==c.indexOf("?")?"?":"&";return c+=encodeURIComponent(a)+"="+encodeURIComponent(b)}function b(c){var a="",b,d;for(d in c)b=d+"="+c[d],a+=b+"&";return a.slice(0,a.length-1)}var d=function(c){this.config={url:"",type:"get",async:!0,dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",data:{}};this.start(c)},e=null;d.init=function(c){new d(c)};d.prototype={constructor:d,createXHR:function(){if("undefined"!=typeof XMLHttpRequest)return new XMLHttpRequest;if("undefined"!=typeof ActiveXObject){if("string"!=
typeof arguments.callee.activeXString){var c=["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],a,b;a=0;for(b=c.length;a<b;a++)try{new ActiveXObject(c[a]);arguments.callee.activeXString=c[a];break}catch(w){}}return new ActiveXObject(arguments.callee.activeXString)}throw Error("No XHR object available.");},start:function(c){e=new this.createXHR;if(c.url)this.config.url=c.url;else throw Error("url cannot be null!");c.type&&(this.config.type=c.type);c.async&&(this.config.async=c.async);c.dataType&&
(this.config.dataType=c.dataType);c.data&&(this.config.data=c.data);c.success&&(this.config.success=c.success);c.fail&&(this.config.fail=c.fail);c.beforeSend&&c.beforeSend();var d=function(){if(4==e.readyState)if(200<=e.status&&300>e.status||304==e.status)c.success&&c.success(e.responseText);else if(c.fail)c.fail();else throw Error("Request was unsucessful:"+e.status);};if("json"==this.config.dataType||"JSON"==this.config.dataType){if("GET"==this.config.type||"get"==this.config.type){for(var f in this.config.data)this.config.url=
a(this.config.url,f,this.config.data[f]);e.onreadystatechange=d;e.open(this.config.type,this.config.url,this.config.async);e.send(null)}if("POST"==this.config.type||"post"==this.config.type)e.addEventListener("readystatechange",d),e.open(this.config.type,this.config.url,this.config.async),c.contentType&&(this.config.contentType=c.contentType),e.setRequestHeader("Content-Type",this.config.contentType),e.send(b(this.config.data))}else if("jsonp"==this.config.dataType||"JSONP"==this.config.dataType){if("GET"==
this.config.type||"get"==this.config.type){if(c.url&&c.callback)this.config.callback=c.callback;else throw Error("params is illegal!");var w=document.getElementsByTagName("head")[0];this.config[this.config.callback]="callback";var k=document.createElement("script");w.appendChild(k);g.callback=function(a){w.removeChild(k);clearTimeout(k.timer);g.callback=null;c.success&&c.success(a)};c.time&&(k.timer=setTimeout(function(){w.removeChild(k);c.fail&&c.fail({message:"over time"});g.callback=null},c.time));
this.config.url+="?callback=callback";for(f in this.config.data)this.config.url=a(this.config.url,f,this.config.data[f]);k.src=this.config.url}}else throw Error("dataType is error!");}};g.deliApi=d})();var p={version:"1.0.1",init:function(a){var b=this;!1===A&&(A=!0,null!==m&&m.sign?deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/premission/check/public",type:"get",dataType:"jsonp",data:m,callback:"callback",success:function(a){if(0==a.code)void 0===b.util.getQuery("user_id")&&"undefined"==
b.util.getCookie("user_id")&&void 0===b.util.getQuery("token")&&"undefined"==b.util.getCookie("token")?(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"),g.location.replace("http://t.delicloud.com/oa/")):b.prefixLoadTpl(b.util.getQuery("user_id")||b.util.getCookie("user_id"),b.util.getQuery("token")||b.util.getCookie("token"));else{var d=a.msg?a.msg:"\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef",c=a.msg?"-1":
"-3";setTimeout(function(){h&&h({message:"\u6743\u9650\u6821\u9a8c\u5931\u8d25 "+d,errorCode:c})})}},fail:function(a){var b=a.msg?a.msg:"\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef",c=a.msg?"-1":"-3";setTimeout(function(){h&&h({message:"\u6743\u9650\u6821\u9a8c\u5931\u8d25 "+b,errorCode:c})})}}):console.log("\u914d\u7f6e\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u586b\u5199\u914d\u7f6e",m))},config:function(a){a&&(m={appId:a.appId||-1,timestamp:a.timestamp,noncestr:a.noncestr,sign:a.signature},a.appId&&
(m.appId=a.appId),this.init(a))},api:function(a){var b=new XMLHttpRequest,d=a.type||"post",e=a.url;if("get"===d&&a.data){var c=[],t;for(t in a.data)a.data.hasOwnProperty(t)&&c.push(t+"="+a.data[t]);e=e+"?"+c.join("&")}b.open(d,e,!0);a.data||(a.data={});b.onreadystatechange=function(){var c;if(4===b.readyState){if(200===b.status){try{c=JSON.parse(b.responseText)}catch(w){}c?0==c.code?"function"===typeof a.success&&a.success(c):("function"===typeof a.error?a.error(c):a.silent||alert(c.msg),9102112==
c.code&&(alert(c.msg),g.location.replace("http://t.delicloud.com/oa/"))):"function"===typeof a.error?a.error(b,"parse_error"):a.silent||alert("\u6570\u636e\u89e3\u6790\u5931\u8d25: "+b.responseText)}else"function"===typeof a.error?a.error(b,"network_error"):a.silent||alert("\u7f51\u7edc\u6216\u670d\u52a1\u5668\u9519\u8bef: "+b.status);"function"===typeof a.complete&&a.complete(b)}};a.data instanceof FormData?(a.dauth&&(b.setRequestHeader("Dauth",a.dauth),b.setRequestHeader("Duagent","_web")),b.send(a.data)):
(b.setRequestHeader("content-type","application/json"),a.dauth&&(b.setRequestHeader("Dauth",a.dauth),b.setRequestHeader("Duagent","_web")),b.send(JSON.stringify(a.data)))},apiJsonp:function(a){a=a||{};if(!a.url||!a.callback)throw Error("\u53c2\u6570\u4e0d\u5408\u6cd5");var b=("jsonp_"+Math.random()).replace(".",""),d=document.getElementsByTagName("head")[0];a.data[a.callback]=b;var e=function(c){var a=[],b;for(b in c)a.push(encodeURIComponent(b)+"="+encodeURIComponent(c[b]));return a.join("&")}(a.data),
c=document.createElement("script");d.appendChild(c);g[b]=function(e){d.removeChild(c);clearTimeout(c.timer);g[b]=null;a.success&&a.success(e)};c.src=a.url+"?"+e;a.time&&(c.timer=setTimeout(function(){g[b]=null;d.removeChild(c);a.fail&&a.fail({message:"\u8d85\u65f6"})},time))},error:function(a){h=a},ready:function(a){z=a},prefixLoadTpl:function(a,b){var d=this,e={init:function(){document.head.innerHTML+='\r\n                    <style>body,button,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,legend,li,ol,p,td,textarea,th,ul{margin:0;padding:0}\r\n                    i{font-style:normal}\r\n                    ul{list-style:none}\r\n                    table{border-collapse:collapse;border-spacing:0}\r\n                    body{font-size:12px;font-family:Microsoft YaHei UI,"\u5fae\u8f6f\u96c5\u9ed1",Heiti SC,Droid Sans;color:#666;background-color:#fff}\r\n                    .deli-wrap-header a{color:#666;text-decoration:none;hide-focus:expression(this.hideFocus=true);outline:0}\r\n                    .deli-wrap-header a:hover{text-decoration:none}\r\n                    .deli-wrap-header a img{border:none}\r\n                    .deli-wrap-header .pointer{cursor:pointer}\r\n                    .deli-wrap-header{width:100%;height:80px;background-color:#FDFDFD;box-shadow:0 2px 4px 0 rgba(0,0,0,.04)}\r\n                    .deli-wrap-deli-footer{background-color:#cfd2d7;margin:0 auto}\r\n                    .deli-wrap-header.deli-wrap-top{background:#fff}\r\n                    .deli-wrap-header.deli-wrap-top.deli-wrap-top-shadow{-webkit-box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}\r\n                    .deli-wrap-header .deli-user-head{width:1200px;height:80px;margin:0 auto;background-color:#fff}\r\n                    .deli-clear:after{visibility:hidden;display:block;font-size:0;content:"";clear:both;height:0}\r\n                    .deli-clear{zoom:1}\r\n                    .deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2)}\r\n                    .deli-wrap-header #deli-head{height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px}\r\n                    .deli-wrap-header #deli-head .deli-logo-box{display: inline-block; position: absolute; bottom: 0; left: 0;}\r\n                    .deli-wrap-header #deli-head .deli-logo-box .deli-logo{display: inline-block; float: left; width: 178px; height: 50px; line-height: 50px; margin: 15px 0;background-image: url(https://static.delicloud.com/www/home/images/logo.png?v=20180317); background-repeat: no-repeat; background-size: cover;}\r\n                    .deli-wrap-header #deli-head .deli-nav-top{width: 900px; height: 40px; position: absolute; bottom: 20px; right: 20px;}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-team{display:none}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current{width:120px;padding:0 10px;color:#5d85e0;border:1px solid #5d85e0;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current.larget{width:140px;padding:0 20px}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current .deli-navlink-icon{font-size:12px;color:#5d85e0;position:absolute;right:10px}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink:hover{-background-color:#55BEBF;color:#5d85e0}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink-current{-background-color:#55BEBF;color:#5d85e0}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item.current,.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item:hover{color:#5d85e0}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-login{position: absolute; right: 0; text-align: center;}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-device{margin-left: 0;}\r\n                    deli-wrap-header #deli-head .deli-nav-top .deli-nologin{display:block;font-size:16px;margin-left:5px;width:100px}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-nologin a{font-size:16px;color:#5d85e0;text-decoration:none}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover{position:relative}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover>.deli-user-panel{display:block}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info .deli-user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info i{display:none;position:absolute;top:8px;right:8px}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info.visited i,.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info:hover i{display:block}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset{display:none;border:1px solid #d9d9d9;border-top:0}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}\r\n                    .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link:hover{color:#5d85e0}\r\n                    .deli-wrap-footer{background-color:#cfd2d7}\r\n                    .deli-footer{padding-top:25px;width:1200px;margin:0 auto}\r\n                    .deli-footer-link{-height:100px}\r\n                    .deli-footer-link dl{width:155px;float:left;-height:100px;margin-right:100px;margin-bottom:0}\r\n                    .deli-footer-link dl.deli-attus{position:relative;width:170px;margin-right:0}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-weixin-img{display:none;position:absolute;top:-80px;left:-25px;background-image:url(https://static.delicloud.com/www/home/images/weixin.png);width:80px;height:80px}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-qq{margin-right:50px}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-weixin{position:relative}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-qq,.deli-footer-link dl.deli-attus .deli-icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-qq:hover,.deli-footer-link dl.deli-attus .deli-icon-weixin:hover{color:#55bfbe}\r\n                    .deli-footer-link dl.deli-attus .deli-icon-weixin:hover .deli-icon-weixin-img{display:block}\r\n                    .deli-footer-link dl .deli-kefu-phone{font-size:16px}\r\n                    .deli-footer-link dl dt{font-size:16px;font-weight:700;line-height:26px;color:#666;letter-spacing:5px;margin-bottom:20px;opacity:.6;-moz-opacity:.6;-webkit-opacity:.6;-o-opacity:.6}\r\n                    .deli-footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:15px;letter-spacing:5px}\r\n                    .deli-footer-link dl dd a{font-size:16px;color:#333;letter-spacing:5px;display:inline-block;text-decoration:none}\r\n                    .deli-footer-link dl dd:hover a{color:#fff;text-decoration:none}\r\n                    .deli-footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center}</style>';
var c=document.createElement("div"),e=document.createElement("div");c.className="deli-wrap-header";e.className="deli-wrap-footer";c.innerHTML='<div class="deli-user-head">\r\n                        <div id="deli-head" class="deli-clear">\r\n                            <div class="deli-logo-box">\r\n                                <a href="http://t.delicloud.com/" class="deli-logo" title="\u5f97\u529be+"></a>\r\n                            </div>\r\n                            <div class="deli-nav-top">\r\n                                <ul class="deli-nav-top-list deli-clear">\r\n                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/" class="deli-navlink">\u9996\u9875</a>\r\n                                    </li>\r\n                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/#!contacts" class="deli-navlink">\u7ec4\u7ec7\u901a\u8baf\u5f55</a>\r\n                                    </li>\r\n                                    <li class="deli-nav-item"><a href="http://t.delicloud.com/oa/#!apphome" class="deli-navlink">\u5e94\u7528</a>\r\n                                    </li>\r\n                                    <li class="deli-nav-item deli-nav-item-device"><a href="http://t.delicloud.com/oa/#!device" class="deli-navlink">\u8bbe\u5907</a>\r\n                                    </li>\r\n                                    <li class="deli-nav-item deli-nav-item-team"><a href="javascript:;" class="deli-navlink deli-nav-item-current"><span class="deli-navlink-name"></span> <span class="deli-navlink-icon"><i class="iconfont">&#xe608;</i></span></a>\r\n                                        <div class="sun-nav-list sun-nav-list-team">\r\n                                            <a class="sub-deli-nav-item current" href="javascript:;"></a>\r\n                                            <a class="sub-deli-nav-item" href="javascript:;"></a>\r\n                                            <a class="sub-deli-nav-item" href="javascript:;"></a>\r\n                                        </div>\r\n                                    </li>\r\n                                    <li class="deli-nav-item deli-nav-item-login">\r\n                                        <div class="deli-nologin"><a href="javascript:;" class="deli-nologin-btn">\u9000\u51fa</a></div>\r\n                                        <div class="deli-login deli-user-panel">\r\n                                            <a href="javascript:;" class="deli-user-info fl" style="display:block">\r\n                                                <img class="deli-user-info-avatar" width="50" height="50" src=""><i class="iconfont">\ue608</i>\r\n                                            </a>\r\n                                            <div class="deli-user-asset fl" style="display:none"><a class="deli-user-asset-link deli-logout" href="javascript:;">\u9000\u51fa\u767b\u5f55</a>\r\n                                            </div>\r\n                                        </div>\r\n                                    </li>\r\n                                </ul>\r\n                            </div>\r\n                        </div>\r\n                    </div>';
e.innerHTML='<div class="deli-footer">\r\n                        <div class="deli-footer-link deli-clear">\r\n                            <dl><dt>\u4f7f\u7528\u5e2e\u52a9</dt>\r\n                                <dd><a href="javascript:;">\u53bb\u8d2d\u4e70\u667a\u80fd\u8bbe\u5907</a>\r\n                                </dd>\r\n                                <dd><a href="javascript:;">App\u4f7f\u7528\u5e2e\u52a9</a>\r\n                                </dd>\r\n                                <dd><a href="javascript:;">\u7f51\u9875\u4f7f\u7528\u5e2e\u52a9</a>\r\n                                </dd>\r\n                            </dl>\r\n                            <dl><dt>\u5e94\u7528\u5f00\u53d1\u5546</dt>\r\n                                <dd><a href="javascript:;">\u5e94\u7528\u63a5\u5165\u6307\u5357</a>\r\n                                </dd>\r\n                            </dl>\r\n                            <dl><dt>\u5173\u4e8e\u6211\u4eec</dt>\r\n                                <dd><a href="javascript:;">\u52a0\u5165\u6211\u4eec</a>\r\n                                </dd>\r\n                                <dd><a href="javascript:;">\u8054\u7cfb\u6211\u4eec</a>\r\n                                </dd>\r\n                            </dl>\r\n                            <dl class="deli-attus"><dt>\u8054\u7cfb\u6211\u4eec</dt>\r\n                                <dd class="deli-kefu-phone">400-185-0555</dd>\r\n                            </dl>\r\n                        </div>\r\n                        <div class="deli-footer-copyright">\u9102ICP\u590717027057\u53f7  Copyright &copy;2018 \u6b66\u6c49\u5f97\u529b\u667a\u80fd\u529e\u516c\u7814\u7a76\u9662\u6709\u9650\u516c\u53f8 \u7248\u6743\u6240\u6709</div>\r\n                    </div>';
document.body.appendChild(e);document.body.insertBefore(c,document.body.firstElementChild);document.querySelector(".deli-wrap-header .deli-nologin a.deli-nologin-btn").addEventListener("click",function(){d.util.setCookie("userid",void 0);d.util.setCookie("token",void 0);d.logout(a,b,function(){g.location.replace("http://t.delicloud.com/oa/")})},!1)}};a&&b?deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/login/"+a+"/web",type:"get",dataType:"jsonp",data:{},callback:"callback",success:function(c){0==
c.code&&("connect"==(c.data.result.token&&0<c.data.result.token.length?"connect":"noconnect")?(d.util.setCookie("userid",c.data.result.user_id),d.util.setCookie("token",c.data.result.token)):d.logout(a,b),e.init())},fail:function(c){0==c.code?("connect"!=(c.data.result.token&&0<c.data.result.token.length?"connect":"noconnect")&&d.logout(a,b),e.init()):9102112==c.code?setTimeout(function(){h&&h({message:c.msg,errorCode:-1})}):(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"),
g.location.replace("http://t.delicloud.com/oa/"))}}):(alert("\u7528\u6237\u672a\u767b\u5f55\u6216\u8005\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f\uff0c\u8bf7\u91cd\u65b0\u767b\u5f55"),g.location.replace("http://t.delicloud.com/oa/"))},logout:function(a,b,d){var e=this;deliApi.init({url:"http://t.delicloud.com/web/v1.0/cd/logout/web",type:"get",dataType:"jsonp",data:{Dauth:a+" "+(new Date).valueOf()+" "+e.util.buildDauth(a,b,(new Date).valueOf()),Duagent:"_web"},callback:"callback",success:function(c){0==
c.code&&(e.util.setCookie("userid",void 0),e.util.setCookie("token",void 0),z&&z({data:c.data}));"function"===typeof d&&d()},fail:function(c){"function"===typeof d&&d();setTimeout(function(){h&&h({message:c.msg,errorCode:-1})})}})},util:{setCookie:function(a,b,d){var e=new Date;e.setDate(e.getDate()+d);b=escape(b)+"; path=/"+(null==d?"":"; expires="+e.toUTCString());document.cookie=a+"="+b},getCookie:function(a){var b,d,e,c=document.cookie.split(";");for(b=0;b<c.length;b++)if(d=c[b].substr(0,c[b].indexOf("=")),
e=c[b].substr(c[b].indexOf("=")+1),d=d.replace(/^\s+|\s+$/g,""),d==a)return unescape(e)},buildHash:function(a){var b,d;for(b in a.args)d+=void 0===a.args[b]?"&"+encodeURIComponent(b):"&"+encodeURIComponent(b)+"="+encodeURIComponent(a.args[b]);return d},parseHash:function(a){var b,d,e={args:{}};a=a.substr(1).replace(/[#\?].*$/,"");if(d=a.match(/[^=&]+(=[^&]*)?/g))for("!"===d[0].charAt(0)&&(b=d[0].substr(1),b in pages&&(e.id=decodeURIComponent(b))),a=1;a<d.length;a++)(b=d[a].match(/^([^=]+)(=)?(.+)?$/))&&
(e.args[decodeURIComponent(b[1])]=b[2]?decodeURIComponent(b[3]||""):void 0);return e},getQuery:function(a){for(var b=g.location.href,d=b.indexOf("?"),b=b.slice(d+1).split("&"),d=0;d<b.length;d++){var e=b[d].split("=");if(e[0].trim()==a)return e[1].trim()}},SHA256:function(a){function b(a,c){var b=(a&65535)+(c&65535);return(a>>16)+(c>>16)+(b>>16)<<16|b&65535}function d(a,c){return a>>>c|a<<32-c}a=function(a){a=a.replace(/\r\n/g,"\n");for(var c="",b=0;b<a.length;b++){var d=a.charCodeAt(b);128>d?c+=
String.fromCharCode(d):(127<d&&2048>d?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(a);return function(a){for(var c="",b=0;b<4*a.length;b++)c+="0123456789abcdef".charAt(a[b>>2]>>8*(3-b%4)+4&15)+"0123456789abcdef".charAt(a[b>>2]>>8*(3-b%4)&15);return c}(function(a,c){var e=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,
1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,
2361852424,2428436474,2756734187,3204031479,3329325298],f=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],g=Array(64),k,h,m,u,p,x,q,y,l,n,r;a[c>>5]|=128<<24-c%32;a[(c+64>>9<<4)+15]=c;for(y=0;y<a.length;y+=16){c=f[0];k=f[1];h=f[2];m=f[3];u=f[4];p=f[5];x=f[6];q=f[7];for(l=0;64>l;l++){if(16>l)g[l]=a[l+y];else{n=l;r=g[l-2];r=d(r,17)^d(r,19)^r>>>10;r=b(r,g[l-7]);var v;v=g[l-15];v=d(v,7)^d(v,18)^v>>>3;g[n]=b(b(r,v),g[l-16])}n=u;n=d(n,6)^d(n,11)^d(n,25);n=b(b(b(b(q,
n),u&p^~u&x),e[l]),g[l]);q=c;q=d(q,2)^d(q,13)^d(q,22);r=b(q,c&k^c&h^k&h);q=x;x=p;p=u;u=b(m,n);m=h;h=k;k=c;c=b(n,r)}f[0]=b(c,f[0]);f[1]=b(k,f[1]);f[2]=b(h,f[2]);f[3]=b(m,f[3]);f[4]=b(u,f[4]);f[5]=b(p,f[5]);f[6]=b(x,f[6]);f[7]=b(q,f[7])}return f}(function(a){for(var c=[],b=0;b<8*a.length;b+=8)c[b>>5]|=(a.charCodeAt(b/8)&255)<<24-b%32;return c}(a),8*a.length))},buildDauth:function(a,b,d){return p.util.SHA256((a?a:"")+(b?b:"")+d).substr(0,32)}}},C=function(a,b){a=a.split(".");for(var d=p,e=0,c=a.length;e<
c;e++)e===c-1&&(d[a[e]]=b),"undefined"===typeof d[a[e]]&&(d[a[e]]={}),d=d[a[e]]};["getLoginStatus","app.onlogout"].forEach(function(a){C(a,function(b,d,e){B(a,b,d,e)})});g.deli=p;g.deliAsyncInit&&function(a){a.__wrapper||(a.__wrapper=function(){try{return a.apply(this,arguments)}catch(b){return g.setTimeout(function(){throw b;},0),!1}});return a.__wrapper}(g.deliAsyncInit)();"object"===typeof module&&module&&"object"===typeof module.exports?module.exports=p:"function"===typeof define&&(define.amd||
define.cmd)&&define(function(){return p})})(this);