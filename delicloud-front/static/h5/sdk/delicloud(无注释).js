(function(win) {
    "use strict";
    var clientEvents = [ "backbutton" ];
    var regMethods = [ "common.navigation.setTitle", "common.navigation.setRight", "common.navigation.close", "common.navigation.setColors","common.image.choose", "common.image.upload", "common.image.preview","common.file.choose","app.disk.choose", "common.file.upload", "common.location.open", "common.location.get", "common.message.share", "common.phone.vibrate", "common.connection.getNetworkType", "common.phone.getUUID", "common.phone.getInterface", "common.screen.keepAwake", "common.screen.breakAwake", "app.device.bind", "app.user.telephoneCall", "app.user.chatOpen", "app.user.select", "app.department.select", "common.notification.showPreloader", "common.notification.hidePreloader", "common.notification.toast", "common.notification.prompt", "app.organization.create", "app.organization.select", "app.config.init", "app.method.transit", "app.method.orgCreate", "app.method.checkJsApis", "app.session.get", "app.user.get", "app.organization.get", "app.code.scan", "common.navigation.hide", "common.navigation.show", "common.navigation.goBack", "common.webview.close", "common.modal.show", "app.storage.get", "app.storage.getInfo", "app.storage.set", "app.storage.remove", "app.storage.clear", "device.sdk.init", "device.sdk.api", "device.sdk.destory" ];
    var JSSDK_VERSION = "1.0.6";
    var ua = win.navigator.userAgent;
    var matches = ua.match(/DeliAppv+[a-zA-Z0-9.-]+/);
    if (matches === null) {
        matches = ua.match(/DeliAppv+[a-zA-Z0-9.-]+/);
    }
    var version = matches;
    var already = false;
    var config = null;
    var appMethod = "app.method.checkJsApis";
    var errorHandle = null;
    var bridgeReady = false;
    var deli = {
        ios:/iPhone|iPad|iPod/i.test(ua),
        android:/Android/i.test(ua),
        version:version,
        isDeliApp:function() {
            return this.version && this.version.length > 0 ? true :false;
        },
        type:function(obj) {
            return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
        },
        config:function(obj) {
            if (!obj) {
                return;
            }
            config = {
                appId:obj.appId || -1,
                timestamp:obj.timestamp,
                noncestr:obj.noncestr,
                sign:obj.signature
            };
        },
        error:function(fn) {
            errorHandle = fn;
        },
        ready:function(callback) {
            var fn = function(bridge) {
                if (!bridge) {
                    return console.log("bridge初始化失败");
                }
                if (config === null || !config.sign) {
                    setTimeout(function() {
                        errorHandle && errorHandle({
                            code:-1,
                            msg:"权限校验失败 配置签名对象错误"
                        });
                    });
                } else {
                    if (deli.ios) {
                        bridge.callHandler(appMethod, config, function(res) {
                            var data = res || {};
                            var code = data.code;
                            var msg = data.msg || "";
                            var result = data.data.result;
                            if (code == 0 && result == true) {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        code:-1,
                                        msg:"权限校验失败 " + msg
                                    });
                                });
                            }
                        });
                    } else if (deli.android) {
                        var dataConfig = {
                            path:"/app/premission/check/public",
                            type:"get",
                            params:config
                        };
                        bridge.callHandler(appMethod, dataConfig, function(res) {
                            var data = JSON.parse(res) || {};
                            var code = data.code;
                            var msg = data.msg || "";
                            var result = data.data.data.result;
                            if (code == 0 && result == true) {
                                callback(bridge);
                            } else {
                                setTimeout(function() {
                                    errorHandle && errorHandle({
                                        code:-1,
                                        msg:"权限校验失败 " + msg
                                    });
                                });
                            }
                        });
                    }
                }
                if (already === false) {
                    already = true;
                    clientEvents.forEach(function(evt) {
                        bridge.registerHandler(evt, function(data, responseCallback) {
                            var e = document.createEvent("HTMLEvents");
                            e.data = data;
                            e.initEvent(evt);
                            document.dispatchEvent(e);
                            responseCallback && responseCallback({
                                code:"0",
                                msg:"成功"
                            });
                        });
                    });
                    if (config === null) {
                        var conf = {
                            url:encodeURIComponent(window.location.href),
                            js:JSSDK_VERSION
                        };
                    }
                }
            };
            var setupWebViewJavascriptBridge = function(callback) {
                if (window.WebViewJavascriptBridge) {
                    return callback(WebViewJavascriptBridge);
                }
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [ callback ];
                var WVJBIframe = document.createElement("iframe");
                WVJBIframe.style.display = "none";
                WVJBIframe.src = "wvjbscheme://__BRIDGE_LOADED__";
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() {
                    document.documentElement.removeChild(WVJBIframe);
                }, 0);
            };
            if (deli.ios && win.WebViewJavascriptBridge) {
                try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        console.log("WebViewJavascriptBridge init: ", data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.msg);
                }
                return fn(WebViewJavascriptBridge);
            } else if (deli.android && win.WebViewJavascriptBridge) {
                try {
                    WebViewJavascriptBridge.init(function(data, responseCallback) {
                        console.log("WebViewJavascriptBridge init: ", data, responseCallback);
                    });
                } catch (e) {
                    console.log(e.msg);
                }
                return fn(WebViewJavascriptBridge);
            }
            if (deli.ios) {
                console.log("开始监听WebViewJavascriptBridgeReady事件");
                setupWebViewJavascriptBridge(function(bridge) {
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                });
            } else if (deli.android) {
                console.log("开始监听WebViewJavascriptBridgeReady事件");
                document.addEventListener("WebViewJavascriptBridgeReady", function() {
                    if (typeof WebViewJavascriptBridge === "undefined") {
                        return console.log("WebViewJavascriptBridge 未定义");
                    }
                    try {
                        WebViewJavascriptBridge.init(function(data, responseCallback) {});
                    } catch (e) {
                        console.log(e.msg);
                    }
                    bridgeReady = true;
                    fn(WebViewJavascriptBridge);
                }, false);
            } else {
                return console.log("很抱歉，尚未支持您所持设备");
            }
        }
    };
    var regNameSpace = function(method, fn) {
        var arr = method.split(".");
        var namespace = deli;
        for (var i = 0, k = arr.length; i < k; i++) {
            if (i === k - 1) {
                namespace[arr[i]] = fn;
            }
            if (typeof namespace[arr[i]] === "undefined") {
                namespace[arr[i]] = {};
            }
            namespace = namespace[arr[i]];
        }
    };
    function setDefaultValue(obj, defaults, flag) {
        for (var i in defaults) {
            if (flag) {
                obj[i] = defaults[i];
            } else {
                obj[i] = obj[i] !== undefined ? obj[i] :defaults[i];
            }
        }
    }
    function generator(method, param, callbackSuccess, callbackFail) {
        if (typeof WebViewJavascriptBridge === "undefined") {
            return console.log("未定义WebViewJavascriptBridge");
        }
        var p = param || {};
        var successCallback = function(res) {
            console.log("默认成功回调", method, res);
        };
        var failCallback = function(err) {
            console.log("默认失败回调", method, err);
        };
        if (callbackSuccess) {
            successCallback = callbackSuccess;
        }
        if (callbackFail) {
            failCallback = callbackFail;
        }
        var callback = function(response) {
            console.log("统一响应：", response);
            if (deli.ios) {
                var data = response || {};
                var code = data.code;
                var result = JSON.parse(data.result).data;
                if (code === "0") {
                    successCallback && successCallback.call(null, result);
                } else {
                    failCallback && failCallback.call(null, result, code);
                }
            } else if (deli.android) {
                var data, code, result;
                if (typeof response == "string") {
                    data = JSON.parse(response) || {};
                    code = data.code;
                    result = data.data;
                } else {
                    data = data = response || {};
                    code = data.code;
                    result = data.type && data.type == "callback" ? JSON.parse(data.result).data :data.data;
                }
                if (code === "0") {
                    successCallback && successCallback.call(null, result);
                } else {
                    failCallback && failCallback.call(null, result, code);
                }
            }
        };
        var watch = true;
        if (deli.android) {
            switch (method) {
              case "common.image.preview":
                for (var data = [], i = 0; i < p.urls.length; i++) data.push("http" == p.urls[i].split("://")[0] ? p.urls[i] :p.urls[i].split(",")[1] ? p.urls[i].split(",")[1] :p.urls[i]);
                p.urls = data;
                break;

              default:            }
        }
        if (deli.android) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    callback({
                        code:"0",
                        msg:"成功",
                        result:data,
                        type:"callback"
                    });
                    responseCallback && responseCallback({
                        code:"0",
                        msg:"成功"
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p, callback);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callback);
            }
        } else if (deli.ios) {
            if (watch) {
                WebViewJavascriptBridge.registerHandler(method, function(data, responseCallback) {
                    callback({
                        code:"0",
                        msg:"成功",
                        result:data,
                        type:"callback"
                    });
                    responseCallback && responseCallback({
                        code:"0",
                        msg:"成功"
                    });
                });
                WebViewJavascriptBridge.callHandler(method, p, callback);
            } else {
                WebViewJavascriptBridge.callHandler(method, p, callback);
            }
        }
    }
    regMethods.forEach(function(method) {
        regNameSpace(method, function(param, callbackSuccess, callbackFail) {
            generator(method, param, callbackSuccess, callbackFail);
        });
    });
    win.deli = deli;
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = deli;
    } else if (typeof define === "function" && (define.amd || define.cmd)) {
        define(function() {
            return deli;
        });
    }
})(this);