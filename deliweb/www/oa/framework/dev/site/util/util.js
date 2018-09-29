'use strict';
define(['common/kernel/kernel'], function(kernel) {
    var util = {
        ajaxSubmit: function(param) {
            var xhr;
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else if(window.ActiveXObject){
                try{
                    xhr = new ActiveXObject("MSXML2.XMLHTTP");
                }catch(e) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            var type = param.type || 'post',
                url = (param.force ? param.url : ('/web' + param.url))
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
            xhr.onreadystatechange = function() {
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
                                    kernel.hint(s.msg, 'error');
                                }
                                if (s.code == 501) {
                                    util.setUserData(undefined);
                                    kernel.replaceLocation({'args': {},'id': 'loginhome'});
                                }
                            }
                        } else {
                            if (typeof param.error === 'function') {
                                param.error(xhr, 'parse_error');
                            } else if (!param.silent) {
                                kernel.hint('数据解析失败: ' + xhr.responseText, 'error');
                            }
                        }
                    } else {
                        if (typeof param.error === 'function') {
                            param.error(xhr, 'network_error');
                        } else if (!param.silent) {
                            kernel.hint('网络异常，请稍后再试', 'error');
                        }
                    }
                    if (typeof param.complete === 'function') {
                        param.complete(xhr);
                    }
                    if (!param.silent) {
                        kernel.hideLoading();
                    }
                }
            };
            if ((window.FormData) ? (param.data instanceof FormData) : false) {
                //xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                if(param.dauth){
                    xhr.setRequestHeader('Duagent', '_web');
                    xhr.setRequestHeader('Dauth', param.dauth);
                    xhr.setRequestHeader('Duagent', '_web');
                }
                xhr.send(param.data);
            } else {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader("If-Modified-Since","0");
                xhr.setRequestHeader("Cache-Control","no-cache");
                if(param.dauth){
                    xhr.setRequestHeader('Dauth', param.dauth);
                    xhr.setRequestHeader('Duagent', '_web');
                }
                xhr.send(JSON.stringify(param.data));
            }
            if (!param.silent) {
                kernel.showLoading();
            }
        },
        formatDate: function(time) {
            if (time <= 0) return '';
            var t, y, m, d, h, i, s;
            t = new Date(time * 1000);
            y = t.getFullYear();
            m = t.getMonth() + 1;
            if (m < 10) m = '0' + m;
            d = t.getDate();
            if (d < 10) d = '0' + d;
            return y + '-' + m + '-' + d;
        },
        formatTime: function(time) {
            if (time <= 0) return '';
            var t, y, m, d, h, i, s;
            t = new Date(time * 1000);
            y = t.getFullYear();
            m = t.getMonth() + 1;
            if (m < 10) m = '0' + m;
            d = t.getDate();
            if (d < 10) d = '0' + d;
            h = t.getHours();
            if (h < 10) h = '0' + h;
            i = t.getMinutes();
            if (i < 10) i = '0' + i;
            s = t.getSeconds();
            if (s < 10) s = '0' + s;
            return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
        },
        setImgCat: function(r, attr) {
            /**
             * r: 数据
             * attr: 数据对应标签信息
             * 返回对象：src: 图片地址, title: 图片标题
             */
            var _imgList = [],
                images = [],
                imgName = []
            for (var key in r) {
                if (r.hasOwnProperty(key)) {
                    if (/_img$/.test(key) && attr[key]['get'] == 1) {
                        _imgList.push(r[key])
                        imgName.push(attr[key]['title'])
                    }
                }
            }
            for (var i = 0; i < _imgList.length; i++) {
                var _arr = _imgList[i].split(',')
                for (var j = 0; j < _arr.length; j++) {
                    images.push({
                        src: _arr[j],
                        title: imgName[i]
                    })
                }
            }
            return images
        },
        setFormData: function(dom, a, r) {
            /**
             *
             * 用于格式化表单，并赋值
             * dom, 需要操作的form节点
             * a, 对象, 接口返回的attributes
             * r, 接口返回的数据（可不传）
             *
             */
            var k, t
            for (k in a) {
                if (a.hasOwnProperty(k)) {
                    dom.find('.' + k + ' input, .' + k + ' select').prop('required', !!a[k].required)
                    if (a[k].stype.toString() === '[object Object]') {
                        dom.find('.' + k + ' .select').html('')
                        for (t in a[k].stype) {
                            dom.find('.' + k + ' .select').append('<option value="' + t + '">' + a[k].stype[t] + '</option>')
                        }
                    }
                }
            }
            if (r) {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        dom.find('.' + k + ' input, .' + k + ' select, .' + k + ' textarea').val(r[k])
                            //                      if (a[k].stype.toString() === '[object Object]') {
                            //                          dom.find('.' + k + ' .select').val(a[k].stype[r[k]])
                            //                      }
                    }
                }
            }
        },
        getFormData: function(dom, a) {
            /**
             *
             * dom, 获取数据form的节点
             * a, 对象, 接口返回的attributes
             *
             * @return 传入dom值的对象
             *
             */
            var k, t, val, data = {}
            for (k in a) {
                if (a.hasOwnProperty(k) && !dom.find('.' + k + ' input, .' + k + ' textarea, .' + k + ' select').is(':hidden')) {
                    val = dom.find('.' + k + ' input, .' + k + ' textarea').val()
                    data[k] = (val === undefined ? '' : val)
                    if (a[k].stype.toString() === '[object Object]') {
                        for (t in a[k].stype) {
                            data[k] = dom.find('.' + k + ' input, .' + k + ' select').val()
                        }
                    }
                }
            }
            return data
        },
        formatTimeDiff: function(time, min) {
            var i, a, u,
                s = [Math.floor(time / (3600 * 24)), Math.floor(time / 3600) % 24, Math.floor(time / 60) % 60, Math.floor(time) % 60];
            if (min) {
                u = ['天', '小时', '分钟', '秒'];
                for (i = 0; i < s.length; i++) {
                    if (s[i] > 0) {
                        return s[i] + u[i];
                    }
                }
                return '刚才';
            } else {
                u = ['天', '时', '分', '秒'];
                a = false;
                for (i = 0; i < s.length; i++) {
                    if (!a) {
                        if (s[i] > 0) {
                            s[i] = s[i] + u[i];
                            a = true;
                        } else {
                            s[i] = '';
                        }
                    } else {
                        s[i] += u[i];
                    }
                }
                return s.join('');
            }
        },
        isNullObj: function(obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            }
            return true;
        },
        setDisabledClass: function(o, disable) {
            if (disable) {
                o.addClass('disabled');
            } else {
                o.removeClass('disabled');
            }
        },
        setCookie: function(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + '; path=/' + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
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
            var value = this.getCookie(name);
            if (null != value) {
                this.setCookie(name,value, -9);
            }
        },
        clone: function(d) {
            var result;
            var s = $.type(d);
            if (s === 'date') {
                result = new Date(d.valueOf());
            } else if (s === 'regexp') {
                s = '';
                if (d.ignoreCase) {
                    s += 'i';
                }
                if (d.multiline) {
                    s += 'm';
                }
                if (d.global) {
                    s += 'g';
                }
                if (d.sticky) {
                    s += 'y';
                }
                if (d.unicode) {
                    s += 'u';
                }
                result = RegExp(d.source, s);
            } else if (s === 'error') {
                if (d.name === 'RangeError') {
                    result = RangeError(d.message);
                } else if (d.name === 'ReferenceError') {
                    result = ReferenceError(d.message);
                } else if (d.name === 'SyntaxError') {
                    result = SyntaxError(d.message);
                } else if (d.name === 'TypeError') {
                    result = TypeError(d.message);
                } else if (d.name === 'URIError') {
                    result = URIError(d.message);
                } else {
                    result = Error(d.message);
                }
            } else if (s === 'array') {
                result = [];
                for (s = 0; s < d.length; s++) {
                    result[s] = util.clone(d[s]);
                }
            } else if (s === 'object') {
                result = {};
                for (s in d) {
                    result[s] = util.clone(d[s]);
                }
            } else {
                result = d;
            }
            return result;
        },
        isEqual: function(o1, o2) {
            var t = $.type(o1),
                n;
            if (t === $.type(o2)) {
                if (t === 'object') {
                    if (Object.keys(o1).length === Object.keys(o2).length) {
                        for (n in o1) {
                            if (!(n in o2) || !util.isEqual(o1[n], o2[n])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (t === 'array') {
                    if (o1.length === o2.length) {
                        for (n = 0; n < o1.length; n++) {
                            if (!util.isEqual(o1[n], o2[n])) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else if (t === 'regexp') {
                    return o1.source === o2.source && o1.global === o2.global && o1.ignoreCase === o2.ignoreCase && o1.multiline === o2.multiline && o1.sticky === o2.sticky && o1.unicode === o2.unicode;
                } else if (t === 'error') {
                    return o1.message = o2.message && o1.name === o2.name;
                } else if (t === 'date') {
                    return o1.valueOf() === o2.valueOf();
                } else {
                    return o1 === o2;
                }
            } else {
                return false;
            }
        },
        paging: function(dom, currentpage, listnum, pagenum) {
            var total, first, last, previous, next, i, k, j, item;
            if (listnum > pagenum) {
                dom.find('.item').remove();
                dom.find('a').off('click');
                dom.find('.listnum').text(listnum)
                total = Math.ceil(listnum / pagenum);
                first = dom.find('.first');
                last = dom.find('.last');
                previous = dom.find('.previous');
                next = dom.find('.next');
                if (currentpage == 1) {
                    first.addClass('disabled');
                    previous.addClass('disabled');
                } else {
                    first.removeClass('disabled');
                    first.on('click', function() {
                        var loc = util.clone(kernel.location);
                        loc.args.p = 1;
                        location.assign(kernel.buildHash(loc));
                    });
                    previous.removeClass('disabled');
                    previous.on('click', function() {
                        var loc = util.clone(kernel.location);
                        loc.args.p = currentpage - 1;
                        location.assign(kernel.buildHash(loc));
                    });
                }
                if (currentpage == total) {
                    last.addClass('disabled');
                    next.addClass('disabled');
                } else {
                    last.removeClass('disabled');
                    last.on('click', function() {
                        var loc = util.clone(kernel.location);
                        loc.args.p = total;
                        location.assign(kernel.buildHash(loc));
                    });
                    next.removeClass('disabled');
                    next.on('click', function() {
                        var loc = util.clone(kernel.location);
                        loc.args.p = currentpage + 1;
                        location.assign(kernel.buildHash(loc));
                    });
                }
                j = Math.max(currentpage - 5, 1);
                k = Math.min(currentpage + 4, total);
                while (k - j < 9 && (j > 1 || k < total)) {
                    if (j > 1) {
                        j--;
                    } else {
                        k++;
                    }
                }
                for (i = j; i <= k; i++) {
                    item = $('<a href="javascript:;" class="item">' + i + '</a>');
                    if (i == currentpage) {
                        item.addClass('active');
                    }
                    item.on('click', pageItemClick);
                    next.before(item);
                }
                dom.css('display', '');
            } else {
                dom.css('display', 'none');
            }
        }
    };
    ! function() {
        var userData;
        //当账号数据发生变化时请使用此接口传入新的数据
        //传入undefined表示账号已退出登录
        util.setUserData = function(data, initiative) {
            if (data !== userData) {
                if(((data && userData)?((userData.data)?(userData.data.id ? true : false) : false) : false)){
                    if (!util.isEqual(userData, data)) {
                        if(data.orgindex == userData.orgindex){
                            userData = data;
                            if (util.userEvents.ondatachange instanceof Function) {
                                util.userEvents.ondatachange({
                                    type: 'datachange',
                                    initiative: initiative,
                                    data: util.clone(data)
                                });
                            }
                        }else{
                            userData = data;
                            if (util.userEvents.onpagechange instanceof Function) {
                                util.userEvents.onpagechange({
                                    type: 'pagechange',
                                    initiative: initiative,
                                    data: util.clone(data)
                                });
                            }
                        }
                    }
                }else{
                    userData = data;
                    if (util.userEvents.onstatechange instanceof Function) {
                        util.userEvents.onstatechange({
                            type: 'statechange',
                            initiative: initiative,
                            data: util.clone(data)
                        });
                    }
                }
            }
        };
        util.getUserData = function() {
            return util.clone(userData);
        };
        //当用户数据发生变化时请使用此接口传入新的token
        util.setToken = function(newtoken) {
            if (util.token !== newtoken) {
                util.token = newtoken;
                util.setCookie('token', newtoken);
                if (typeof util.userEvents.onstatechange === 'function') {
                    util.userEvents.onstatechange({
                        type: 'statechange'
                    });
                }
            }
        };
        //从服务器获取最新的账号数据 api 需要跟setToken 保持同步
        util.updateUserData = function(uid, token, callback) {
            if(uid != 'undefined'){
                var userTimestamp = (new Date().valueOf()).toString();
                util.ajaxSubmit({
                    type: 'get',
                    url: '/v1.0/user/me',
                    dauth: uid + ' ' + userTimestamp + ' ' + kernel.buildDauth(uid, token, userTimestamp),
                    silent: true,
                    complete: function(xhr, msg) {
                        var json, i;
                        try {
                            json = $.parseJSON(xhr.responseText);
                            if (json.data) {
                                //util.setUserData(json.data); 由于接口 /v1.0/user/me 返回组织数据格式与接口 /v1.0/admin/auth/my 返回数据格式不一致，因此组装此2个接口
                                //屏蔽掉个人组织 
                                var targetData = [], dataInfo = {
                                    'data': json.data.result,
                                    'organization': targetData
                                };
                                var adminTimestamp = (new Date().valueOf()).toString();
                                util.ajaxSubmit({
                                    type: 'get',
                                    url: '/v1.0/admin/auth/my',
                                    dauth: uid + ' ' + adminTimestamp + ' ' + kernel.buildDauth(uid, token, adminTimestamp),
                                    data: {
                                        type: 'group'
                                    },
                                    silent: true,
                                    success: function(json) {
                                        if (json.code == 0) {
                                            $.each(json.data.result,function(i, item){
                                                if((item.is_admin && item.is_admin == true) || item.department_ids || item.app_ids || item.device_ids){
                                                    targetData.push(item);
                                                }
                                            });
                                            dataInfo.organization = targetData;
                                            dataInfo.orgindex = 0;
                                            dataInfo.orgindexid = targetData[dataInfo.orgindex].org_id;
                                            // change 2017-12-01
                                            util.setUserData(dataInfo);
                                        }
                                    },
                                    error: function(){
                                        //util.setUserData(undefined);
                                        //kernel.replaceLocation({'args': {},'id': 'loginhome'});
                                    }
                                });
                            }
                        } catch (e) {
                            //kernel.hint('网络错误，请稍后重试~');
                        }
                        if (typeof callback === 'function') {
                            callback(util.clone(userData));
                        }
                    }
                });
            }
        };
        util.token = util.getCookie('token');
        //用于监视账号登录状态或者属性变化
        //此接口中的事件需要用 kernel.listeners.add来监控
        // kernel.listeners.add(util.userEvents,'statechange',yourlistener);
        util.userEvents = {};
    }();
    ! function() {
        util.setDefaultValue = function(data) {
            var n, i;
            if (data.attributes) {
                if (!data.list) {
                    data.list = {};
                }
                for (n in data.attributes) {
                    if (!data.list[n]) {
                        data.list[n] = {};
                    }
                    if ($.type(data.list[n]) === 'array') {
                        for (i = 0; i < data.list[n].length; i++) {
                            setDef(data.attributes[n], data.list[n][i]);
                        }
                    } else {
                        setDef(data.attributes[n], data.list[n]);
                    }
                }
            }
        };
        util.getCheckboxValue = function(ctn, sel) {
            var i, v = [],
                l = ctn.find('input[type=checkbox]' + (sel ? sel : '') + ':enabled:checked');
            for (i = 0; i < l.length; i++) {
                v.push(l[i].value);
            }
            return v.join(',');
        };
        util.setCheckboxValue = function(ctn, sel, v) {
            var i,
                l = ctn.find('input[type=checkbox]' + (sel ? sel : ''));
            for (i = 0; i < l.length; i++) {
                l[i].checked = v.indexOf(l[i].value) >= 0;
            }
        };
        util.getRadioValue = function(ctn, name) {
            return ctn.find('input[type=radio][name=' + name + ']:enabled:checked').val();
        };
        util.setRadioValue = function(ctn, name, v) {
            ctn.find('input[type=radio][name=' + name + '][value=' + v + ']').prop('checked', true);
        };
        util.getInputValue = function(ctn, sel) {
            return ctn.find(sel + ':enabled').val();
        };
        util.makeOptions = function(stype) {
            var n, r = '';
            for (n in stype) {
                r += '<option value="' + n + '">' + stype[n] + '</option>';
            }
            return r;
        };
        util.setUrlPort = function(port) {
            var protocol = location.protocol;
            var host = location.host;
            return protocol + '//' + host + ':' + port;
        };
        function setDef(attr, data) {
            var n;
            for (n in attr) {
                if (attr[n].type === 'checkbox') {
                    if (data[n]) {
                        data[n] = data[n].split(',');
                    } else if (attr[n].des) {
                        data[n] = attr[n].des.split(',');
                    } else {
                        data[n] = [];
                    }
                } else if (attr[n].type === 'select') {
                    if (!(data[n] in attr[n].stype)) {
                        data[n] = attr[n].des || Object.keys(attr[n].stype)[0];
                    }
                } else {
                    if (data[n] === undefined || data[n] === null) {
                        data[n] = attr[n].des;
                    }
                }
            }
        }
    }();
    return util;

    function pageItemClick() {
        var loc = util.clone(kernel.location);
        loc.args.p = this.firstChild.data;
        location.assign(kernel.buildHash(loc));
    }
});