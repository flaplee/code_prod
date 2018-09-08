// util
'use strict';
define(['svgicons'], function(svgicons) {
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
            version: '20180612',
            domain: 'http://eapp.delicloud.xin/boardat/app',
            apiurl: 'http://eapp-api.delicloud.xin/boardat'
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
            if(o.nextElementSibling){
                o.nextElementSibling.style.display = 'block'
            }else{
                o.parentNode.nextElementSibling.style.display = 'block'
            }
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
        formatDate: function(time, full, date) {
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
                r = y + '年' + m + '月' + d + '日' + ' ' + r;
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
                    if (date) {
                        if (diff === 1) {
                            r = '昨天';
                        } else if (diff === 2) {
                            r = '前天';
                        } else if (diff === -1) {
                            r = '明天';
                        } else if (diff === -2) {
                            r = '后天';
                        } else {
                            r = '今天';
                        }
                    } else {
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
                    }
                } else {
                    r = y + '年' + m + '月' + d + '日';
                }
            }
            return r;
        },
        // 创建 svg dom;
        makeSvg: function(name, square) {
            var svgns = 'http://www.w3.org/2000/svg';
            var svg = document.createElementNS(svgns, 'svg');
            svg.appendChild(document.createElementNS(svgns, 'path'));
            if (name) {
                util.setSvgPath(svg, name, square);
            }
            return svg;
        },
        // 设置svg 内容
        setSvgPath: function(svg, name, square) {
            var box, tmp = util.makeSvg();
            if (svgicons.hasOwnProperty(name)) {
                name = svgicons[name];
            }
            svg.firstChild.setAttribute('d', name);
            tmp.style.position = 'absolute';
            tmp.style.bottom = tmp.style.right = '100%';
            tmp.firstChild.setAttribute('d', name);
            document.body.appendChild(tmp);
            box = tmp.firstChild.getBBox();
            document.body.removeChild(tmp);
            if (square) {
                if (box.width > box.height) {
                    box.y -= (box.width - box.height) / 2;
                    box.height = box.width;
                } else {
                    box.x -= (box.height - box.width) / 2;
                    box.width = box.height;
                }
            }
            svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
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
        cancelEvent: function(evt) {
            evt.preventDefault();
        },
        stopEvent: function(evt) {
            evt.stopPropagation();
        },
        getSignature: function(sign, url, timestamp, nonceStr, callback) {
            if (!sign) {
                $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "json",
                    data: {
                        'timestamp': timestamp,
                        'nonceStr': nonceStr
                    },
                    error: function(data) {
                        $.toast('网络错误，请稍后再试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                    },
                    success: function(res) {
                        if (res.code == 0) {
                            if (typeof callback === 'function') {
                                callback(res.data);
                            }
                        } else {
                            $.toast('获取签名出错，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    }
                });
            } else {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        },
        setLeaveMeet: function(data, callback) {
            if(data && data.token){
                $.ajax({
                    url: util.config.apiurl + "/api/meeting/leave",
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        "token": data.token
                    },
                    dataType: "json",
                    data: {},
                    success: function(resp) {
                        if (resp.code == 0) {
                            if (callback && typeof callback == "function") {
                                callback();
                            }
                        } else {
                            $.toast(resp.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        };
                    }
                });
                $.ajax({
                    url: util.config.apiurl + "/auth/logout/" + data.token,
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        "token": data.token
                    },
                    dataType: "json",
                    data:{},
                    success: function(json) {
                        if (json.code == 0) {
                            //console.log("json", json);
                        }
                    }
                });

            }
        }
    };

    ! function(){
        util.localStorage = {
            get: function(key) {
                var value = localStorage.getItem(key);
                if (value) {
                    try {
                        var value_json = JSON.parse(value);
                        if (typeof value_json === 'object') {
                            return value_json;
                        } else if (typeof value_json === 'number') {
                            return value_json;
                        }
                    } catch(e) {
                        return value;
                    }
                } else {
                    return false;
                }
            },
            set: function(key, value) {
                localStorage.setItem(key, value);
            },
            remove: function(key) {
                localStorage.removeItem(key);
            },
            clear: function() {
                localStorage.clear();
            }
        };

        util.localStorage.setList = function(data) {
            for (var i in data) {
                localStorage.setItem(i, data[i]);
            }
        };

        util.localStorage.removeList = function(list) {
            for (var i = 0, len = list.length; i < len; i++) {
                localStorage.removeItem(list[i]);
            }
        };
    }();

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
        };

        function onscroll(evt) {
            if (this.scrollTop === 0) {
                this.scrollTop = 1;
            } else if (this.scrollTop + this.clientHeight === this.scrollHeight) {
                this.scrollTop -= 1;
            }
        }
    }();

    ! function() {
        util.names = {};
        if ('animation' in document.documentElement.style) {
            util.names.aniEvt = 'animationend';
            util.names.aniStyle = 'animation';
        } else {
            util.names.aniEvt = 'webkitAnimationEnd';
            util.names.aniStyle = 'webkitAnimation';
        }
        if ('transition' in document.documentElement.style) {
            util.names.transEvt = 'transitionend';
            util.names.transStyle = 'transition';
        } else {
            util.names.transEvt = 'webkitTransitionEnd';
            util.names.transStyle = 'webkitTransition';
        }
        if ('transform' in document.documentElement.style) {
            util.names.transform = 'transform';
        } else {
            util.names.transform = 'webkitTransform';
        }
    }();

    ! function() {
        util.changeScroll = function(force) {
                if (force) {
                    util.browserIOS();
                    window.addEventListener('scroll', noscroll, false);
                    document.documentElement.addEventListener('scroll', noscroll, false);
                    document.body.addEventListener('scroll', noscroll, false);
                    document.getElementById('page').addEventListener('scroll', noscroll, false);
                    window.addEventListener('contextmenu', browser.name === 'Firefox' ? util.stopEvent : util.cancelEvent, false);
                    window.addEventListener('dragstart', util.cancelEvent, false);
                }
            }
            // 重置scroll
        function noscroll(evt) {
            if (evt.target === this) {
                if (this.scrollTo) {
                    this.scrollTo(0, 0);
                } else {
                    this.scrollLeft = this.scrollTop = 0;
                }
            }
        }
    }();

    window.util = util;
    return util;
});