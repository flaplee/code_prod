/**
    create delicloud-web-sdk.js for js_sdk api
    @author tianlun
    @param deli is a object, deli.method to use in the page
*/
(function (window) {
    'use strict';
    //方法列表
    var regMethods = [
        'getLoginStatus',
        'app.onlogout'
    ];
    var JSSDK_VERSION = '1.0.1';
    var version = '1.0.1';
    var already = false; //是否已初始化
    var config = null; //缓存config参数
    var errorHandle = null; //缓存error 回调
    var readyHandle = null; //缓存ready 回调
    var domReady = false;
    var environment = 'test';
    var httpApi = (environment == 'www') ? 'https://www.delicloud.com' : ((environment == 'test') ? 'http://t.delicloud.com' : ((environment == '202') ? 'http://192.168.0.202' : 'http://192.168.0.201'));
    /**
     *    deli.config 配置签名对象
     *    deli.ready 初始化完成
     *    deli.error 权限校验失败时
     */

    ;
    (function () {
        var deliApi = function (params) {
            this.config = {
                url: "",
                type: "get",
                async: true,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                data: {}
            };
            this.start(params);
        };
        var xhr = null;
        deliApi.init = function (params) {
            new deliApi(params);
        };
        deliApi.prototype = {
            constructor: deliApi,
            createXHR: function () {
                if (typeof XMLHttpRequest != 'undefined') {
                    return new XMLHttpRequest();
                } else if (typeof ActiveXObject != 'undefined') {
                    if (typeof arguments.callee.activeXString != 'string') {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                            i, len;
                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {

                            }
                        }
                    }
                    return new ActiveXObject(arguments.callee.activeXString);
                } else {
                    throw new Error("No XHR object available.");
                }
            },
            start: function (params) {
                xhr = new this.createXHR();
                if (params.url) {
                    this.config.url = params.url;
                } else {
                    throw new Error("url cannot be null!");
                }
                if (params.type) {
                    this.config.type = params.type;
                }
                if (params.async) {
                    this.config.async = params.async;
                }
                if (params.dataType) {
                    this.config.dataType = params.dataType;
                }
                if (params.data) {
                    this.config.data = params.data;
                }
                if (params.success) {
                    this.config.success = params.success;
                }
                if (params.fail) {
                    this.config.fail = params.fail;
                }
                if (params.beforeSend) {
                    params.beforeSend();
                }

                var complete = function () {
                    if (xhr.readyState == 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                            if (params.success) {
                                params.success(xhr.responseText);
                            }
                        } else {
                            if (params.fail) {
                                params.fail();
                            } else {
                                throw new Error("Request was unsucessful:" + xhr.status);
                            }
                        }
                    }
                }

                if (this.config.dataType == "json" || this.config.dataType == "JSON") { //非跨域
                    if ((this.config.type == "GET") || (this.config.type == "get")) {
                        for (var item in this.config.data) {
                            this.config.url = addURLParam(this.config.url, item, this.config.data[item]);
                        }
                        xhr.onreadystatechange = complete;
                        xhr.open(this.config.type, this.config.url, this.config.async);
                        xhr.send(null);
                    }
                    if (this.config.type == "POST" || this.config.type == "post") {
                        xhr.addEventListener('readystatechange', complete);
                        xhr.open(this.config.type, this.config.url, this.config.async);
                        if (params.contentType) {
                            this.config.contentType = params.contentType;
                        }
                        xhr.setRequestHeader("Content-Type", this.config.contentType);
                        xhr.send(serialize(this.config.data));
                    }
                } else if ((this.config.dataType == "jsonp") || (this.config.dataType == "JSONP")) { //跨域
                    if ((this.config.type == "GET") || (this.config.type == "get")) { //jsonp只能进行get请求跨域
                        if (!params.url || !params.callback) {
                            throw new Error("params is illegal!");
                        } else {
                            this.config.callback = params.callback;
                        }
                        //创建script标签
                        var cbName = 'callback';
                        var head = document.getElementsByTagName('head')[0];
                        this.config[this.config.callback] = cbName;
                        var scriptTag = document.createElement('script');
                        head.appendChild(scriptTag);

                        //创建jsonp的回调函数
                        window[cbName] = function (json) {
                            head.removeChild(scriptTag);
                            clearTimeout(scriptTag.timer);
                            window[cbName] = null;
                            params.success && params.success(json);
                        };
                        //超时处理
                        if (params.time) {
                            scriptTag.timer = setTimeout(function () {
                                head.removeChild(scriptTag);
                                params.fail && params.fail({
                                    message: "over time"
                                });
                                window[cbName] = null;
                            }, params.time);
                        }
                        this.config.url = this.config.url + "?callback=" + cbName;
                        for (var item in this.config.data) {
                            this.config.url = addURLParam(this.config.url, item, this.config.data[item]);
                        }
                        scriptTag.src = this.config.url;
                    }
                } else {
                    throw new Error("dataType is error!");
                }
            }
        }
        function addURLParam(url, name, value) {
            url += (url.indexOf("?") == -1 ? "?" : "&");
            url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
            return url;
        }
        //序列化函数
        function serialize(data) {
            var val = "";
            var str = "";
            for (var item in data) {
                str = item + "=" + data[item];
                val += str + '&';
            }
            return val.slice(0, val.length - 1);
        }
        window["deliApi"] = deliApi;
    })();
    var deli = {
        version: version,
        init: function (obj) {
            var self = this;
            //第一次初始化后要做的事情
            if (already === false) {
                already = true;
                //to do: 判断config，处理PC端权限验证
                if (config === null || !config.sign) {
                    console.log("配置错误，请重新填写配置", config);
                } else {
                    deliApi.init({
                        url: "" + httpApi + "/web/v1.0/cd/premission/check/public",
                        type: "get",
                        dataType: "jsonp",
                        data: config,
                        callback: "callback",
                        //time:"1000",
                        success: function (res) {
                            if (res.code == 0) {
                                if (self.util.getQuery('user_id') === undefined && self.util.getCookie('app_user_id') == 'undefined' && self.util.getQuery('org_id') === undefined && self.util.getQuery('token') === undefined && self.util.getCookie('app_token') == 'undefined') {
                                    // 未登录
                                    alert('用户未登录或者登录信息已经过期，请重新登录');
                                    window.location.replace(httpApi + '/oa/');
                                } else {
                                    setTimeout(function(){
                                        self.prefixLoadTpl(self.util.getQuery('user_id') || self.util.getCookie('app_user_id'), self.util.getQuery('token') || self.util.getCookie('app_token'));
                                        if(typeof callback === 'function'){
                                            callback();
                                        }
                                    }, 0);
                                }
                            } else {
                                var msg = (res.msg) ? res.msg : '网络或服务器错误',
                                    code = (res.msg) ? '-1' : '-3';
                                //alert('配置错误，请重新填写配置:' + msg);
                                setTimeout(function () {
                                    errorHandle && errorHandle({
                                        message: '权限校验失败 ' + msg,
                                        errorCode: code
                                    });
                                });
                            }
                        },
                        fail: function (res) {
                            var msg = (res.msg) ? res.msg : '网络或服务器错误',
                                code = (res.msg) ? '-1' : '-3';
                            //alert('配置错误，请重新填写配置:' + msg);
                            setTimeout(function () {
                                errorHandle && errorHandle({
                                    message: '权限校验失败 ' + msg,
                                    errorCode: code
                                });
                            });
                        }
                    });
                }
            }
        },
        config: function (obj) {
            var self = this;
            //这里对用户传进来的参数进行过滤
            if (!obj) {
                return;
            }
            //to do: 参数名待统一
            config = {
                appId: obj.appId || -1,
                timestamp: obj.timestamp,
                noncestr: obj.noncestr,
                sign: obj.signature
            };
            if (obj.appId) {
                config.appId = obj.appId;
            }
        },
        api: function (param) {
            var xhr = new XMLHttpRequest(),
                type = param.type || 'post',
                url = param.url;
            if (type === 'get' && param.data) {
                var strArr = []
                for (var key in param.data) {
                    if (param.data.hasOwnProperty(key)) {
                        strArr.push(key + '=' + param.data[key])
                    }
                }
                url = url + '?' + strArr.join('&')
            }
            xhr.open(type, url, true);
            if (!param.data) {
                param.data = {};
            }
            xhr.onreadystatechange = function () {
                var s;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            s = JSON.parse(xhr.responseText);
                        } catch (e) {}
                        if (s) {
                            if (s.code == 0) {
                                if (typeof param.success === 'function') {
                                    param.success(s);
                                }
                            } else {
                                if (typeof param.error === 'function') {
                                    param.error(s);
                                } else if (!param.silent) {
                                    alert(s.msg);
                                }
                                if (s.code == 9102112) {
                                    // 未登录
                                    alert(s.msg);
                                    window.location.replace(httpApi + '/oa/');
                                }
                            }
                        } else {
                            if (typeof param.error === 'function') {
                                param.error(xhr, 'parse_error');
                            } else if (!param.silent) {
                                alert('数据解析失败: ' + xhr.responseText);
                            }
                        }
                    } else {
                        if (typeof param.error === 'function') {
                            param.error(xhr, 'network_error');
                        } else if (!param.silent) {
                            alert('网络或服务器错误: ' + xhr.status);
                        }
                    }
                    if (typeof param.complete === 'function') {
                        param.complete(xhr);
                    }
                }
            };
            if (param.data instanceof FormData) {
                //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                if (param.dauth) {
                    xhr.setRequestHeader('Dauth', param.dauth),
                    xhr.setRequestHeader('Duagent', '_web');
                }
                xhr.send(param.data);
            } else {
                xhr.setRequestHeader('content-type', 'application/json');
                if (param.dauth) {
                    xhr.setRequestHeader('Dauth', param.dauth),
                    xhr.setRequestHeader('Duagent', '_web');
                }
                xhr.send(JSON.stringify(param.data));
            }
        },
        apiJsonp: function (options) {
            options = options || {};
            if (!options.url || !options.callback) {
                throw new Error("参数不合法");
            }

            //创建 script 标签并加入到页面中
            var callbackName = ('jsonp_' + Math.random()).replace(".", "");
            var oHead = document.getElementsByTagName('head')[0];
            options.data[options.callback] = callbackName;
            var params = formatParams(options.data);
            var oS = document.createElement('script');
            oHead.appendChild(oS);

            //创建jsonp回调函数
            window[callbackName] = function (json) {
                oHead.removeChild(oS);
                clearTimeout(oS.timer);
                window[callbackName] = null;
                options.success && options.success(json);
            };

            //发送请求
            oS.src = options.url + '?' + params;

            //超时处理
            if (options.time) {
                oS.timer = setTimeout(function () {
                    window[callbackName] = null;
                    oHead.removeChild(oS);
                    options.fail && options.fail({
                        message: "超时"
                    });
                }, time);
            }
            //格式化参数
            function formatParams(data) {
                var arr = [];
                for (var name in data) {
                    arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
                }
                return arr.join('&');
            }
        },
        error: function (fn) {
            errorHandle = fn;
        },
        ready: function (callback) {
            var self = this;
            //readyHandle = callback;
            var fn = function(data){
                self.init(config, callback);
            }
            fn();
        },
        prefixLoadTpl: function (userid, token) {
            var self = this;
            var _WrapPrivate = {
                //初始化
                init: function () {
                    //插入 header、footer 
                    var elementStyle = '<style>body,button,dd,div,dl,dt,fieldset,form,h1,h2,h3,h4,h5,h6,input,legend,li,ol,p,td,textarea,th,ul{margin:0;padding:0}\
                        i{font-style:normal}\
                        ul{list-style:none}\
                        table{border-collapse:collapse;border-spacing:0}\
                        body{font-size:12px;font-family:Microsoft YaHei UI,"微软雅黑",Heiti SC,Droid Sans;color:#666;background-color:#fff}\
                        .deli-wrap-header a{color:#666;text-decoration:none;hide-focus:expression(this.hideFocus=true);outline:0}\
                        .deli-wrap-header a:hover{text-decoration:none}\
                        .deli-wrap-header a img{border:none}\
                        .deli-wrap-header .pointer{cursor:pointer}\
                        .deli-wrap-header{width:100%;height:80px;background-color:#FDFDFD;box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -moz-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -webkit-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -o-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}\
                        .deli-wrap-deli-footer{background-color:#cfd2d7;margin:0 auto}\
                        .deli-wrap-header.deli-wrap-top{background:#fff}\
                        .deli-wrap-header.deli-wrap-top.deli-wrap-top-shadow{box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -moz-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -webkit-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1); -o-box-shadow: 0 1px 10px 0 rgba(3, 18, 18, 0.1);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}\
                        .deli-wrap-header .deli-user-head{width:1200px;height:80px;margin:0 auto;background-color:#fff}\
                        .deli-clear:after{visibility:hidden;display:block;font-size:0;content:"";clear:both;height:0}\
                        .deli-clear{zoom:1}\
                        .deli-wrap-header .user-float{background-color:#fff;position:fixed;width:100%;min-width:1200px;margin:auto;top:0;left:0;z-index:3;box-shadow:0 2px 5px rgba(0,0,0,.2);-moz-box-shadow:0 2px 5px rgba(0,0,0,.2);-webkit-box-shadow:0 2px 5px rgba(0,0,0,.2);-o-box-shadow:0 2px 5px rgba(0,0,0,.2);filter: progid:DXImageTransform.Microsoft.Shadow(color=#cccccc, Direction=125, Strength=4);}\
                        .deli-wrap-header #deli-head{height:100%;z-index:1;position:relative;z-index:100;clear:both;height:80px;background:#fff;font-size:12px}\
                        .deli-wrap-header #deli-head .deli-logo-box{display: inline-block; position: absolute; bottom: 0; left: 0;}\
                        .deli-wrap-header #deli-head .deli-logo-box .deli-logo{display: inline-block; float: left; width: 178px; height: 50px; line-height: 50px; margin: 15px 0;background-image: url(https://static.delicloud.com/www/home/images/logo.png?v=20180317); background-repeat: no-repeat; background-size: cover;}\
                        .deli-wrap-header #deli-head .deli-nav-top{width: 900px; height: 40px; position: absolute; bottom: 20px; right: 20px;}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item{display:inline-block;-width:85px;height:40px;line-height:40px;margin-left:25px;float:left;position:relative}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-team{display:none}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink{display:inline-block;width:85px;height:40px;line-height:40px;text-align:center;font-size:16px;color:#666;text-decoration:none;position:relative;border-radius:5px}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current{width:120px;padding:0 10px;color:#5d85e0;border:1px solid #5d85e0;border-radius:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current.larget{width:140px;padding:0 20px}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink.deli-nav-item-current .deli-navlink-icon{font-size:12px;color:#5d85e0;position:absolute;right:10px}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink:hover{-background-color:#55BEBF;color:#5d85e0}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item a.deli-navlink-current{-background-color:#55BEBF;color:#5d85e0}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list{width:150px;position:absolute;z-index:1;background-color:#fff;top:60px;display:none;left:-15px;border:1px solid #d9d9d9;border-top:0}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item{display:block;width:150px;padding:0 10px;height:40px;line-height:40px;font-size:14px;text-align:center;color:#333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item.current,.deli-wrap-header #deli-head .deli-nav-top .deli-nav-item .son-nav-list a.sub-deli-nav-item:hover{color:#5d85e0}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-login{position: absolute; right: 0; text-align: center;}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nav-item.deli-nav-item-device{margin-left: 0;}\
                        deli-wrap-header #deli-head .deli-nav-top .deli-nologin{display:block;font-size:16px;margin-left:5px;width:100px}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-nologin a{font-size:16px;color:#5d85e0;text-decoration:none}\
                        .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover{position:relative}\
                        .deli-wrap-header #deli-head .deli-nav-top .userBtn.hasLogin:hover>.deli-user-panel{display:block}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel{display:none;position:relative;top:-20px;right:0;background-color:#fff;z-index:1;width:80px;height:80px;overflow:visible}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info{position:relative;display:inline-block;width:80px;height:50px;overflow:hidden;margin:15px auto}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info .deli-user-info-avatar{width:50px;height:50px;border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;-o-border-radius:50%;display:inline-block}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info i{display:none;position:absolute;top:8px;right:8px}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info.visited i,.deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-info:hover i{display:block}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset{display:none;border:1px solid #d9d9d9;border-top:0}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link{display:inline-block;width:80px;height:40px;line-height:40px;text-align:center;font-size:14px;color:#666;background-color:#fff}\
                        .deli-wrap-header #deli-head .deli-nav-top .deli-user-panel .deli-user-asset .deli-user-asset-link:hover{color:#5d85e0}\
                        .deli-wrap-footer{background-color:#cfd2d7}\
                        .deli-footer{-padding-top:25px;padding-top:50px; width:1200px;margin:0 auto}\
                        .deli-footer-link{-height:100px;width: 95%; padding-left: 5%;}\
                        .deli-footer-link dl{-width:155px; width:275px; float:left;-height:100px;-margin-right:100px;margin-bottom:0}\
                        .deli-footer-link dl.deli-attus{position:relative;-width:170px;width:220px;margin-right:0}\
                        .deli-footer-link dl.deli-attus .deli-icon-phone{display:inline-block; background:url(https://static.delicloud.com/www/home/images/telephone_icon.png) 0 0 no-repeat;width:16px;height:18px; vertical-align: top; margin-top: 3px; margin-right: 10px;}\
                        .deli-footer-link dl.deli-attus .deli-icon-weixin-img{-display:none; display:inline-block; -position:absolute;-top:-80px;-left:-25px;-background-image:url(https://static.delicloud.com/www/home/images/weixin.png); background-image:url(https://static.delicloud.com/www/home/images/wechat_icon.png);-width:80px;width:22px;-height:80px; height:18px; vertical-align: top; margin-top: 3px; margin-right: 6px;}\
                        .deli-footer-link dl.deli-attus .deli-icon-qq{-margin-right:50px;display: inline-block; background-image:url(https://static.delicloud.com/www/home/images/qq_icon.png); width: 16px;height: 18px; vertical-align: top; margin-top: 3px; margin-right: 10px;}\
                        .deli-footer-link dl.deli-attus .deli-icon-weixin{position:relative}\
                        .deli-footer-link dl.deli-attus .deli-icon-qq,.deli-footer-link dl.deli-attus .deli-icon-weixin{font-size:30px;color:#333;cursor:pointer;text-decoration:none}\
                        .deli-footer-link dl.deli-attus .deli-icon-qq:hover,.deli-footer-link dl.deli-attus .deli-icon-weixin:hover{color:#55bfbe}\
                        .deli-footer-link dl.deli-attus .deli-icon-weixin:hover .deli-icon-weixin-img{display:block}\
                        .deli-footer-link dl .deli-kefu-phone{font-size:16px}\
                        .deli-footer-link dl dt{font-size:18px; font-weight:700; -line-height:26px; color:#666; letter-spacing:5px;margin-bottom:20px;}\
                        .deli-footer-link dl dd{line-height:24px;font-size:14px;color:#959799;margin-bottom:18px;letter-spacing:5px}\
                        .deli-footer-link dl dd a{font-size:16px;color:#333;letter-spacing:2px;display:inline-block;text-decoration:none}\
                        .deli-footer-link dl dd:hover a{color:#666;text-decoration:none}\
                        .deli-footer-copyright{font-size:14px;color:#666;height:50px;padding-top:20px;text-align:center;letter-spacing:2px;}\
                        .deli-footer-link dl.deli-attus dd b {font-size: 16px; color: #333; font-weight: normal;letter-spacing:2px; cursor: pointer;}\
                        .deli-footer-link dl.deli-attus dd:hover b {color: #666;}</style>';
                    var delihead = document.head || document.getElementsByTagName('head')[0];
                    var styleTag = document.createElement('style');
                        styleTag.type = 'text/css';
                        if (styleTag.styleSheet){
                            styleTag.styleSheet.cssText = elementStyle;
                        } else {
                            styleTag.appendChild(document.createTextNode(elementStyle));
                        }
                        delihead.appendChild(styleTag);
                    var elementHeader = '<div class="deli-user-head">\
                        <div id="deli-head" class="deli-clear">\
                            <div class="deli-logo-box">\
                                <a href="https://www.delicloud.com/" class="deli-logo" title="得力e+"></a>\
                            </div>\
                            <div class="deli-nav-top">\
                                <ul class="deli-nav-top-list deli-clear">\
                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/" class="deli-navlink">首页</a>\
                                    </li>\
                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/#!contacts" class="deli-navlink">组织通讯录</a>\
                                    </li>\
                                    <li class="deli-nav-item"><a href="https://www.delicloud.com/oa/#!apphome" class="deli-navlink">应用</a>\
                                    </li>\
                                    <li class="deli-nav-item deli-nav-item-device"><a href="https://www.delicloud.com/oa/#!device" class="deli-navlink">设备</a>\
                                    </li>\
                                    <li class="deli-nav-item deli-nav-item-team"><a href="javascript:;" class="deli-navlink deli-nav-item-current"><span class="deli-navlink-name"></span> <span class="deli-navlink-icon"><i class="iconfont">&#xe608;</i></span></a>\
                                        <div class="sun-nav-list sun-nav-list-team">\
                                            <a class="sub-deli-nav-item current" href="javascript:;"></a>\
                                            <a class="sub-deli-nav-item" href="javascript:;"></a>\
                                            <a class="sub-deli-nav-item" href="javascript:;"></a>\
                                        </div>\
                                    </li>\
                                    <li class="deli-nav-item deli-nav-item-login">\
                                        <div class="deli-nologin"><a href="javascript:;" class="deli-nologin-btn">退出</a></div>\
                                        <div class="deli-login deli-user-panel">\
                                            <a href="javascript:;" class="deli-user-info fl" style="display:block">\
                                                <img class="deli-user-info-avatar" width="50" height="50" src=""><i class="iconfont"></i>\
                                            </a>\
                                            <div class="deli-user-asset fl" style="display:none"><a class="deli-user-asset-link deli-logout" href="javascript:;">退出登录</a>\
                                            </div>\
                                        </div>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>';
                    var elementFooter = '<div class="deli-footer">\
                        <div class="deli-footer-link deli-clear">\
                            <dl><dt>使用帮助</dt>\
                                <dd><a href="http://b2b.nbdeli.com" target="_blank">去购买智能设备</a>\
                                </dd>\
                                <dd><a href="http://download.delicloud.com/app/delispecification.pdf" target="_blank">App使用帮助</a>\
                                </dd>\
                            </dl>\
                            <dl><dt>应用开发商</dt>\
                                <dd><a href="http://doc.delicloud.com/site/" target="_blank">应用接入指南</a>\
                                </dd>\
                            </dl>\
                            <dl><dt>关于我们</dt>\
                                <dd><a href="http://www.nbdeli.com/" target="_blank">关于得力</a>\
                                </dd>\
                                <dd><a href="http://hr.nbdeli.cn/scripts/mgrqispi.dll?Appname=HRsoft2000&Prgname=REC2_RESUME_STAFF_P&ARGUMENTS=-AC" target="_blank">加入我们</a>\
                                </dd>\
                            </dl>\
                            <dl class="deli-attus"><dt>联系我们</dt>\
                                <dd class="deli-kefu-phone"><span class="deli-icon-phone"></span><b>400-185-0555</b></dd>\
                                <dd class="deli-kefu-qq"><span class="deli-icon-qq"></span><b>327264079</b></dd>\
                                <dd class="deli-kefu-wechat"><span class="deli-icon-weixin-img"></span><b>得力e+公众号</b></dd>\
                            </dl>\
                        </div>\
                        <div class="deli-footer-copyright">鄂ICP备17027057号  Copyright &copy;2018 武汉得力智能办公研究院有限公司 版权所有</div>\
                    </div>';
                    var wrapHeader = document.createElement('div'),
                        wrapFooter = document.createElement('div');
                    wrapHeader.className = 'deli-wrap-header', wrapFooter.className = 'deli-wrap-footer';
                    wrapHeader.innerHTML = elementHeader, wrapFooter.innerHTML = elementFooter;
                    document.querySelector("body").appendChild(wrapFooter);
                    document.querySelector("body").insertBefore(wrapHeader, document.querySelector("body").firstElementChild);
                    var wrapNologinBtn = document.querySelector('.deli-wrap-header .deli-nologin a.deli-nologin-btn');
                    if (wrapNologinBtn.addEventListener) {
                        wrapNologinBtn.addEventListener("click", function(){
                            self.util.setCookie('app_user_id', undefined);
                            self.util.setCookie('app_org_id', undefined);
                            self.util.setCookie('app_token', undefined);
                            self.logout(userid, token, function(){
                                window.location.replace(httpApi + '/oa/');
                            });
                        }, false);
                    }else {
                        wrapNologinBtn.attachEvent("onclick", function(){
                            self.util.setCookie('app_user_id', undefined);
                            self.util.setCookie('app_org_id', undefined);
                            self.util.setCookie('app_token', undefined);
                            self.logout(userid, token, function(){
                                window.location.replace(httpApi + '/oa/');
                            });
                        });
                    }
                }
            };
            if (userid && token) {
                deliApi.init({
                    url: "" + httpApi + "/web/v1.0/cd/login/" + userid + "/web",
                    type: "get",
                    dataType: "jsonp",
                    data: {},
                    callback: "callback",
                    //time:"1000",
                    success: function (res) {
                        if (res.code == 0) {
                            var connect = (res.data.result.token && res.data.result.token.length > 0) ? 'connect' : 'noconnect';
                            if (connect == 'connect') {
                                //self.util.buildHash({args:{user_id:"",org_id:"",token:"",uuid:""}});
                                self.util.setCookie('app_user_id', res.data.result.user_id);
                                self.util.setCookie('app_org_id', self.util.getQuery('org_id'));
                                self.util.setCookie('app_token', res.data.result.token);
                            } else {
                                self.logout(userid, token);
                            }

                            //初始化
                            _WrapPrivate.init();
                        }
                    },
                    fail: function (res) {
                        if (res.code == 0) {
                            var connect = (res.data.result.token && res.data.result.token.length > 0) ? 'connect' : 'noconnect';
                            if (connect == 'connect') {
                                //self.util.buildHash({args:{user_id:"",org_id:"",token:"",uuid:""}});
                            } else {
                                self.logout(userid, token);
                            }
                            //初始化
                            _WrapPrivate.init();
                        } else if (res.code == 9102112) {
                            setTimeout(function () {
                                errorHandle && errorHandle({
                                    message: res.msg,
                                    errorCode: -1
                                });
                            });
                        } else {
                            alert('用户未登录或者登录信息已经过期，请重新登录');
                            window.location.replace(httpApi + '/oa/');
                        }
                    }
                });
            } else {
                // 未登录
                alert('用户未登录或者登录信息已经过期，请重新登录');
                window.location.replace(httpApi + '/oa/');
            }
            var updateURLParameter = function (url, param, paramVal) {
                var TheAnchor = null;
                var newAdditionalURL = "";
                var tempArray = url.split("?");
                var baseURL = tempArray[0];
                var additionalURL = tempArray[1];
                var temp = "";
                if (additionalURL) {
                    var tmpAnchor = additionalURL.split("#");
                    var TheParams = tmpAnchor[0];
                    TheAnchor = tmpAnchor[1];
                    if (TheAnchor)
                        additionalURL = TheParams;

                    tempArray = additionalURL.split("&");

                    for (i = 0; i < tempArray.length; i++) {
                        if (tempArray[i].split('=')[0] != param) {
                            newAdditionalURL += temp + tempArray[i];
                            temp = "&";
                        }
                    }
                } else {
                    var tmpAnchor = baseURL.split("#");
                    var TheParams = tmpAnchor[0];
                    TheAnchor = tmpAnchor[1];
                    if (TheParams)
                        baseURL = TheParams;
                }
                if (TheAnchor)
                    paramVal += "#" + TheAnchor;
                var rows_txt = temp + "" + param + "=" + paramVal;
                return baseURL + "?" + newAdditionalURL + rows_txt;
            };
        },
        logout: function (userid, token, callback){
            var self = this;
            deliApi.init({
                url: "" + httpApi + "/web/v1.0/cd/logout/web",
                type: "get",
                dataType: "jsonp",
                data: {
                    Dauth: userid + ' ' + (new Date().valueOf()) + ' ' + self.util.buildDauth(userid, token, (new Date().valueOf())),
                    Duagent: '_web'
                },
                callback: "callback",
                //time:"1000",
                success: function (res) {
                    if (res.code == 0) {
                        self.util.setCookie('app_user_id', undefined);
                        self.util.setCookie('app_org_id', undefined);
                        self.util.setCookie('app_token', undefined);
                        // onlogout
                        readyHandle && readyHandle({
                            data: res.data
                        });
                        if(typeof callback === 'function'){
                            callback();
                        }
                    } else {
                        if(typeof callback === 'function'){
                            callback();
                        }
                    }
                },
                fail: function (res) {
                    if(typeof callback === 'function'){
                        callback();
                    }
                    setTimeout(function () {
                        errorHandle && errorHandle({
                            message: res.msg,
                            errorCode: -1
                        });
                    });
                }
            });
        },
        util: {
            setCookie: function (c_name, value, exdays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + exdays);
                var c_value = escape(value) + '; path=/' + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
                document.cookie = c_name + "=" + c_value;
            },
            getCookie: function (c_name) {
                var i, x, y, ARRcookies = document.cookie.split(";");
                for (i = 0; i < ARRcookies.length; i++) {
                    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == c_name) {
                        return unescape(y);
                    }
                }
            },
            buildHash: function (loc) {
                var n, hash;
                for (n in loc.args) {
                    hash += loc.args[n] === undefined ? '&' + encodeURIComponent(n) : '&' + encodeURIComponent(n) + '=' + encodeURIComponent(loc.args[n]);
                }
                return hash;
            },
            parseHash: function (hash) {
                var i, a, s, nl = {
                    args: {}
                };
                hash = hash.substr(1).replace(/[#\?].*$/, '');
                s = hash.match(/[^=&]+(=[^&]*)?/g);
                if (s) {
                    if (s[0].charAt(0) === '!') {
                        a = s[0].substr(1);
                        if (a in pages) {
                            nl.id = decodeURIComponent(a);
                        }
                    }
                    for (i = 1; i < s.length; i++) {
                        a = s[i].match(/^([^=]+)(=)?(.+)?$/);
                        if (a) {
                            nl.args[decodeURIComponent(a[1])] = a[2] ? decodeURIComponent(a[3] || '') : undefined;
                        }
                    }
                }
                return nl;
            },
            getQuery: function (param) {
                var url = window.location.href;
                var searchIndex = url.indexOf('?');
                var searchParams = url.slice(searchIndex + 1).split('&');
                for (var i = 0; i < searchParams.length; i++) {
                    var items = searchParams[i].split('=');
                    if (items[0].trim() == param) {
                        return items[1].trim();
                    }
                }
            },
            SHA256: function (s) {
                var chrsz = 8;
                var hexcase = 0;

                function safe_add(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                    return (msw << 16) | (lsw & 0xFFFF);
                }

                function S(X, n) {
                    return (X >>> n) | (X << (32 - n));
                }

                function R(X, n) {
                    return (X >>> n);
                }

                function Ch(x, y, z) {
                    return ((x & y) ^ ((~x) & z));
                }

                function Maj(x, y, z) {
                    return ((x & y) ^ (x & z) ^ (y & z));
                }

                function Sigma0256(x) {
                    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
                }

                function Sigma1256(x) {
                    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
                }

                function Gamma0256(x) {
                    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
                }

                function Gamma1256(x) {
                    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
                }

                function core_sha256(m, l) {
                    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                    var W = new Array(64);
                    var a, b, c, d, e, f, g, h, i, j;
                    var T1, T2;
                    m[l >> 5] |= 0x80 << (24 - l % 32);
                    m[((l + 64 >> 9) << 4) + 15] = l;
                    for (var i = 0; i < m.length; i += 16) {
                        a = HASH[0];
                        b = HASH[1];
                        c = HASH[2];
                        d = HASH[3];
                        e = HASH[4];
                        f = HASH[5];
                        g = HASH[6];
                        h = HASH[7];
                        for (var j = 0; j < 64; j++) {
                            if (j < 16) W[j] = m[j + i];
                            else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                            T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                            T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                            h = g;
                            g = f;
                            f = e;
                            e = safe_add(d, T1);
                            d = c;
                            c = b;
                            b = a;
                            a = safe_add(T1, T2);
                        }
                        HASH[0] = safe_add(a, HASH[0]);
                        HASH[1] = safe_add(b, HASH[1]);
                        HASH[2] = safe_add(c, HASH[2]);
                        HASH[3] = safe_add(d, HASH[3]);
                        HASH[4] = safe_add(e, HASH[4]);
                        HASH[5] = safe_add(f, HASH[5]);
                        HASH[6] = safe_add(g, HASH[6]);
                        HASH[7] = safe_add(h, HASH[7]);
                    }
                    return HASH;
                }

                function str2binb(str) {
                    var bin = Array();
                    var mask = (1 << chrsz) - 1;
                    for (var i = 0; i < str.length * chrsz; i += chrsz) {
                        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                    }
                    return bin;
                }

                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                }

                function binb2hex(binarray) {
                    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                    var str = "";
                    for (var i = 0; i < binarray.length * 4; i++) {
                        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                            hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                    }
                    return str;
                }
                s = Utf8Encode(s);
                return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
            },
            buildDauth: function(userid, token, timestamp) {
                var hashLoc = (userid ? userid : '' ) + (token ? token : '') + timestamp;
                var sha256 = deli.util.SHA256(hashLoc);
                var hash = sha256.substr(0, 32);
                return hash;
            }
        }
    };

    //注册命名空间,"app.getLoginStatus"生成deli.app.getLoginStatus
    var regNameSpace = function (method, fn) {
        var arr = method.split('.');
        var namespace = deli;
        for (var i = 0, k = arr.length; i < k; i++) {
            if (i === k - 1) {
                namespace[arr[i]] = fn;
            }
            if (typeof namespace[arr[i]] === 'undefined') {
                namespace[arr[i]] = {};
            }
            namespace = namespace[arr[i]];
        }
    };
    //设置默认属性
    function setDefaultValue(obj, defaults, flag) {
        for (var i in defaults) {
            if (flag) {
                obj[i] = defaults[i];
            } else {
                obj[i] = obj[i] !== undefined ? obj[i] : defaults[i];
            }
        }
    }
    //生成器，处理传参、回调以及对特定方法特殊处理
    function generator(method, param, callbackSuccess, callbackFail) {
        //to do
        //console.log('调用方法：', method, '传参：', param);
        var p = param || {};
        var successCallback = function (res) {
            console.log('默认成功回调', method, res);
        };
        var failCallback = function (err) {
            console.log('默认失败回调', method, err)
        };
        if (callbackSuccess) {
            successCallback = callbackSuccess;
        }
        if (callbackFail) {
            failCallback = callbackFail;
        }
        //统一回调处理
        var callback = function (response) {
            //console.log('统一响应：', response);
            var data = response || {};
            var code = data.code;
            var result = data.result;
            //code 0 表示成功, 其它表示失败
            if (code === '0') {
                //数据处理
                switch (method) {
                case 'app.onlogout':
                    result = data.result;
                    break;
                }
                successCallback && successCallback.call(null, result);
            } else {
                failCallback && failCallback.call(null, result, code);
            }
        };
        //前端内容处理, 消息接入
        switch (method) {
        case 'app.onlogout':
            callback({
                code: '0',
                msg: '成功',
                result: {
                    'app.onlogout': 'app.onlogout'
                }
            });
            break;
        }
    }
    //forEach兼容ie8
    Array.prototype.forEach||(Array.prototype.forEach=function(c,e){var d,a;if(null==this)throw new TypeError("this is null or not defined");var b=Object(this),f=b.length>>>0;if("function"!==typeof c)throw new TypeError(c+" is not a function");1<arguments.length&&(d=e);for(a=0;a<f;){if(a in b){var g=b[a];c.call(d,g,a,b)}a++}});

    //注册方法生成api
    regMethods.forEach(function (method) {
        regNameSpace(method, function (param, callbackSuccess, callbackFail) {
            generator(method, param, callbackSuccess, callbackFail);
        });
    });

    window.deli = deli;

    if (window.deliAsyncInit) {
        unguard(window.deliAsyncInit)();
        function unguard(o) {
            if (!o.__wrapper) o.__wrapper = function () {
                try {
                    return o.apply(this, arguments)
                } catch (u) {
                    window.setTimeout(function () {
                        throw u
                    }, 0);
                    return false
                }
            };
            return o.__wrapper
        }
    }

    //支持amd && cmd
    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        module.exports = deli;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return deli;
        })
    }
}(this));