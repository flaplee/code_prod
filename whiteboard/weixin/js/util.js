// util
'use strict';
define([], function() {
    Date.prototype.Diff = function(t, d, n) {
        var v, dt, dv;
        if (t === 'ms' || t === 'millisecond') {
            return this.valueOf() - Date.valueOf();
        } else if (t === 's' || t === 'second') {
            return Math.floor(this.valueOf() / 1000) - Math.floor(d.valueOf() / 1000);
        } else if (t === 'n' || t === 'minute') {
            return Math.floor(this.valueOf() / (60 * 1000)) - Math.floor(d.valueOf() / (60 * 1000));
        } else {
            if (typeof n === 'number') {
                if (n > 720) {
                    v = 720;
                } else if (n < -720) {
                    v = -720;
                } else {
                    v = n;
                }
            } else {
                v = this.getTimezoneOffset();
            }
            if (t === 'w' || t === 'week' || t === 'm' || t === 'month' || t === 'y' || t === 'year') {
                dt = this.Add('n', -1 * v, 0);
                dv = d.Add('n', -1 * v, 0);
                if (t === 'w' || t === 'week') {
                    dv = dv.Add('d', dt.getUTCDay() - dv.getUTCDay(), 0);
                    return dt.Diff('d', dv, 0) / 7;
                } else if (t === 'm' || t === 'month') {
                    return dt.Diff('y', dv, 0) * 12 + dt.getUTCMonth() - dv.getUTCMonth();
                } else {
                    return dt.getUTCFullYear() - dv.getUTCFullYear();
                }
            } else if (t === 'h' || t === 'hour') {
                return Math.floor((this.valueOf() - v * 60 * 1000) / (60 * 60 * 1000)) - Math.floor((d.valueOf() - v * 60 * 1000) / (60 * 60 * 1000));
            } else {
                return Math.floor((this.valueOf() - v * 60 * 1000) / (24 * 60 * 60 * 1000)) - Math.floor((d.valueOf() - v * 60 * 1000) / (24 * 60 * 60 * 1000));
            }
        }
    };
    var util = {
        config: {
            version: '20181015',
            domain: 'http://eapp-api.delicloud.xin/whiteboard/weixin',
            apiurl: 'http://eapp.delicloud.xin/whiteboard'
        },
        getQuery: function(param) {
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
        loadImage: function(o, url, callback) {
            o.nextElementSibling.style.display = 'block'
            var img = new Image();
            img.src = url;
            // 判断图片是否在缓存中
            if (img.complete) {
                callback.call(img, o);
                return;
            }
            img.onload = function() {
                callback.call(img, o);
            }
        },
        setUrlPort: function(port) {
            var protocol = location.protocol;
            var host = location.host;
            return protocol + '//' + host + ':' + port;
        },
        getTargetUrl: function(replaceUrl, targetUrl) {
            var protocol = location.protocol;
            var host = location.host;
            var pathname = location.pathname.replace(replaceUrl, targetUrl);
            return protocol + '//' + host + pathname;
        },
        formatDate: function(time, full) {
            var r;
            var t = new Date(time);
            var y = t.getFullYear();
            var m = t.getMonth() + 1;
            var d = t.getDate();
            if (full) {
                r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                if (r[1] < 10) {
                    r[1] = '0' + r[1];
                }
                if (r[2] < 10) {
                    r[2] = '0' + r[2];
                }
                r = r.join(':');
                if(!(full == 'date')){
                    r = y + '年' + m + '月' + d + '日' + ' ' + r;
                }
            } else {
                var diff = new Date().Diff('d', t);
                if (diff <= 2 && diff >= -2) {
                    r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                    if (r[1] < 10) {
                        r[1] = '0' + r[1];
                    }
                    if (r[2] < 10) {
                        r[2] = '0' + r[2];
                    }
                    r = r.join(':');
                    if (diff === 1) {
                        r = '昨天' + r;
                    } else if (diff === 2) {
                        r = '前天' + r;
                    } else if (diff === -1) {
                        r = '明天' + r;
                    } else if (diff === -2) {
                        r = '后天' + r;
                    } else {
                        r = '今天' + r;
                    }
                } else {
                    r = y + '年' + m + '月' + d + '日';
                }
            }
            return r;
        },
        showDialog: function(e, w, t, i) {
            var a = (w) ? w : '';

            function n(e) {
                var t = document.createElement("div");
                t.style.cssText = e;
                document.body.appendChild(t);
                return t
            }
            var o = n("position:fixed;top:0;width: 100%;height: 100%;background-color:rgba(0,0,0,0.56);z-index: 999;");
            var r = n("border-radius:8px;position: fixed;left: 13%;top:30%;width: 74%;z-index: 999;background-color:rgba(256,256,256,1);text-align:center;");
            r.innerHTML = '<div style="color:#000;padding-top:7.4%;font-weight:bold;font-size: 18px;text-align: center;">' + a + '</div>                            <div style="padding:7.4% 5.5%;font-size:16px;color:#000;"><span>' + e + '</span></div><div style="border-top: 1px solid rgb(212,212,212);font-size:16px;color:#666;line-height: 2.222;">                                <div class="dl-ok" style="width: 50%;float: left;color: #3979f6;">确定</div>                                <div class="dl-cancel" style="width: 49%;border-left: 1px solid rgb(212,212,212);float: right;color: #3979f6;">取消</div>                            </div>';
            r.addEventListener("click", function(e) {
                var a = e.target.className;
                var n = ["dl-ok", "dl-cancel"].indexOf(a);
                if (n == -1) {
                    return
                }
                r.style.display = o.style.display = "none";
                n ? i() : t()
            })
        },
        loadJsTicket: function(callback) {
            var timestamp = new Date().getTime() + '';
            var nonceStr = 'nonce_key_' + timestamp;
            $.ajax({
                url: util.config.apiurl + '/weixin/config', // http://boardat.delicloud.com/config
                data: {
                    url: window.location.href,
                    timestamp: timestamp + '',
                    nonceStr: nonceStr
                },
                dataType: "json",
                type: "GET",
                error: function(data) {
                    return true;
                },
                failure: function() {
                    return true;
                },
                success: function(res) {
                    if (res && res.code == 0) {
                        wx.config({
                            "debug": false,
                            "signature": res.data.sign_str,
                            "appId": res.data.app_id,
                            "nonceStr": nonceStr,
                            "timestamp": timestamp,
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQZone',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideAllNonBaseMenuItem',
                                'showAllNonBaseMenuItem',
                                'translateVoice',
                                'startRecord',
                                'stopRecord',
                                'onRecordEnd',
                                'playVoice',
                                'pauseVoice',
                                'stopVoice',
                                'uploadVoice',
                                'downloadVoice',
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage',
                                'getNetworkType',
                                'openLocation',
                                'getLocation',
                                'hideOptionMenu',
                                'showOptionMenu',
                                'closeWindow',
                                'scanQRCode',
                                'chooseWXPay',
                                'openProductSpecificView',
                                'addCard',
                                'chooseCard',
                                'openCard'
                            ]
                        });
                        if (typeof callback == "function") {
                            callback.call(this);
                        }
                    }
                }
            });
        },
        cancelEvent: function(evt) {
            evt.preventDefault();
        },
        stopEvent: function(evt) {
            evt.stopPropagation();
        },
        setCookie: function(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        },
        getCookie: function(c_name) {
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
        delCookie: function(name) {
            var self = this;
            var value = self.getCookie(name);
            if (null != value) {
                self.setCookie(name, value, -9);
            }
        },
        wxShare: function(page) {
            var shareUrl = window.location.href;
            console.log(document.title);
            var shareTitle = document.title ? document.title : "得力分享";
            var shareDesc = shareTitle;
            var shareImgUrl = "";

            window.initShare = function() {
                console.log("开始分享" + arguments);
            };

            window.afterShare = function() {
                console.log("分享完成" + arguments);
            };
            window.initWXConfig = function() {
                /*微信初始化，调此方法*/
                wx.ready(function() {
                    wx.onMenuShareAppMessage({
                        title: shareTitle,
                        desc: shareDesc,
                        link: shareUrl,
                        imgUrl: shareImgUrl,
                        type: 'link',
                        success: function() {
                            window.afterShare();
                        },
                        cancel: function() {

                        }
                    });

                    wx.onMenuShareTimeline({
                        title: shareTitle,
                        link: shareUrl,
                        imgUrl: shareImgUrl,
                        success: function() {
                            window.afterShare();
                        },
                        cancel: function() {

                        }
                    });

                    wx.onMenuShareQQ({
                        title: shareTitle,
                        desc: shareDesc,
                        link: shareUrl,
                        imgUrl: shareImgUrl,
                        success: function() {
                            window.afterShare();
                        },
                        cancel: function() {

                        }
                    });

                    wx.onMenuShareQZone({
                        title: shareTitle,
                        desc: shareDesc,
                        link: shareUrl,
                        imgUrl: shareImgUrl,
                        success: function() {
                            window.afterShare();
                        },
                        cancel: function() {

                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    });

                    wx.onMenuShareWeibo({
                        title: shareTitle,
                        link: shareUrl,
                        imgUrl: shareImgUrl,
                        success: function() {
                            window.afterShare();
                        },
                        cancel: function() {

                        }
                    });

                    window.initShare();

                    if(page && page == 'index'){
                        //隐藏右上角菜单接口
                        wx.hideOptionMenu();
                    }else{
                        //显示右上角菜单接口
                        wx.showOptionMenu();
                    }
                });
            };
        },
        wxLogin: function() {
            $.ajax({
                url: util.config.apiurl + '/weixin/url',
                dataType: "json",
                data: {},
                type: "GET",
                error: function(data) {
                    return true;
                },
                failure: function() {
                    return true;
                },
                success: function(res) {
                    if (res.code == 0) {
                        window.location.href = res.data.url + window.location.href;
                    }
                }
            });
        }
    };

    ! function() {
        //fix ios overscrolling on viewport issue
        util.fixIosScrolling = function(o) {
            if (browser.name === 'IOS') {
                o.classList.add('iosScrollFix');
                o.scrollTop = 1;
                o.addEventListener('scroll', onscroll, false);
            }
        };

        util.getScrollHeight = function(o) {
            return browser.name === 'IOS' ? o.scrollHeight - 1 : o.scrollHeight;
        };

        util.browserIOS = function() {
            if (browser.name === 'IOS') {
                window.addEventListener('touchmove', function(evt) {
                    var t = evt.target;
                    while (t != document.body) {
                        if (t.classList.contains('iosScrollFix') || t.classList.contains('hScroll')) {
                            return;
                        }
                        t = t.parentNode;
                    }
                    evt.preventDefault();
                }, false);
            }
        }

        function onscroll(evt) {
            if (this.scrollTop === 0) {
                this.scrollTop = 1;
            } else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
                this.scrollTop -= 1;
            }
        }
    }();
    window.util = util;
    return util;
});