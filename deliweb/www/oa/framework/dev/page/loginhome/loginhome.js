'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var $login = $('#loginhome'),
        $loginBox = $login.find('.login-box'),
        $loginQr = $loginBox.find('#loginQr'),
        $loginDoing = $loginQr.find('.login-doing'),
        $loginSuccess = $loginQr.find('.login-success'),
        $successBtn = $loginSuccess.find('.success-btn'),
        $loginFail = $loginQr.find('.login-fail'),
        $failBtn = $loginFail.find('.fail-btn'),
        $orgBox = $login.find('.org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list'),
        $navTeam = $('#header .nav-top .nav-top-list .nav-item-team'),
        $orgNavList = $navTeam.find('.son-nav-list-team');;
    var stomp = null, userInfo = {}, tempInfo = {'data':{}, 'organization':{}};
    // init qrcode
    var initQrcode = function(o){
        o.addClass('login-loading');
        util.ajaxSubmit({
            url: '/v1.0/barcode_login/public?v=' + (new Date().getTime()),
            silent: false,
            type:'get',
            success: function(json) {
                o.removeClass('login-loading');
                if(json.code == 0){
                    var res = json.data['result'],
                        cid = res.cid,
                        url = res.data,
                        session = res.session;
                    if (url) {
                        o.html('');
                        new QRCode(document.getElementById('qrcode'), {
                            text: url,
                            width: 234,
                            height: 234,
                            correctLevel: QRCode.CorrectLevel.L
                        });
                        webSocketInit(session);
                        //connect(cid, 'disconnect');
                    } else {
                        o.html('');
                    }
                }else{
                    kernel.hint(json.msg);
                }
            },
            error: function(json){
                o.removeClass('login-loading');
                kernel.hint('网络异常，请稍后再试', 'error');
            }
        });
    };

    initQrcode($loginBox.find('.loginQr'));

    $(document).on('click', '.loginQr', function() {
        var self = this,
            loginQr = $loginBox.find('.loginQr'),
            that = loginQr[this === loginQr[0] ? 1 : 0];
        if (this.childNodes.length === 0) {
            if (that && that.childNodes.length > 0) {
                this.innerHTML = that.innerHTML;
            } else {
                initQrcode($loginBox.find('.loginQr'));
            }
        }else{
            initQrcode($loginBox.find('.loginQr'));
        }
    });

    $successBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });

    $failBtn.on('click',function(){
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });
    
    // webSocket
    function webSocketInit(session){
        if (typeof WebSocket != 'undefined'){
            // 打开一个 web socket
            var ws = new WebSocket(session.ws_url);
            ws.onopen = function(){
                //console.log("已连接上");
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send('{"cmd": "register","data": "'+ session.session_id +'"}');
            };
            ws.onmessage = function(evt){
                var json = JSON.parse(evt.data);
                if(json){
                    if(json.id){
                        tempInfo.data = json;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                        $loginSuccess.show();
                    }
                    if(json.user_id){
                        userInfo = json;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token,type: 'websocket'}, ws);
                    }
                }
            };
            ws.onclose = function() {
                // 关闭 websocket
                //console.log("连接已关闭...")
            };
            ws.onerror = function (e) {
                //console.log('发生异常:', e);
            };
        }else{
            // 浏览器不支持 WebSocket
            var timer = setInterval(function(){pollInit(session.http_url, timer)}, 3000);//'/ws/'+session.session_id
        }
    }
    // polling
    function pollInit(url, timer) {
        $.getJSON(url).done(function(res) {
            var response = res;
            if(response.length > 1){
                var jsonUser = response[0], jsonInfo = response[1];
                if(jsonUser && jsonInfo){
                    if(jsonUser.id){
                        tempInfo.data = jsonUser;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ jsonUser.avatar_url +'" title="'+ jsonUser.name +'">');
                        $loginSuccess.show();
                    }
                    if(jsonInfo.user_id){
                        userInfo = jsonInfo;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token, type: 'polling'}, function(){
                            clearInterval(timer);
                        });
                    }
                }
            }else if(response.length == 1){
                var json = response[0];
                if(json){
                    if(json.id){
                        tempInfo.data = json;
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                        $loginSuccess.show();
                    }
                    if(json.user_id){
                        userInfo = json;
                        if(userInfo.type == 'web'){
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList ,{userid: userInfo.user_id,token: userInfo.token, type: 'polling'}, function(){
                            clearInterval(timer);
                        });
                    }
                }
            }
        });
    }

    // select orgs
    function orgsCalls(o, data, ws){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/auth/my',
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    o.find('>').remove('');
                    var orgInfo = json.data.result;
                    if(orgInfo && orgInfo.length && orgInfo.length > 0){
                        var targetData = [], targetLength = orgInfo.length, targetCurrent = 0;
                        $.each(orgInfo, function(i, item) {
                            if((item.is_admin && item.is_admin == true) || item.department_ids || item.app_ids || item.device_ids){
                                targetCurrent = i;
                                var $tempOrg = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" title="' + item.org_name + '" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a></li>');
                                targetData.push(item);
                                o.append($tempOrg);
                                return function(){
                                    // 选择组织
                                    var data = {
                                        name: item.org_name,
                                        orgid: item.org_id,
                                        parentid: item.top_department_id,
                                        app_ids: (item.app_ids ? item.app_ids.length : 0),
                                        device_ids: (item.device_ids ? item.device_ids.length : 0),
                                        employee_count: item.employee_count
                                    };
                                    $tempOrg.find('a.list-item-inner').on('click', function(e) {
                                        e.stopPropagation();
                                        // 全局数据
                                        util.setCookie('orgid', data.orgid),
                                        util.setCookie('parentid', data.parentid),
                                        util.setCookie('orgname', data.name),
                                        util.setCookie('device_ids', data.device_ids),
                                        util.setCookie('app_ids', data.app_ids),
                                        util.setCookie('employee_count', data.employee_count),
                                        // update 20180306
                                        tempInfo.orgindex = $(this).parent('li.list-item').index();
                                        tempInfo.orgindexid = tempInfo.organization[tempInfo.orgindex].org_id;
                                        util.setCookie('orgindex', tempInfo.orgindex);
                                        util.setCookie('orgindexid', tempInfo.orgindexid);
                                        util.setUserData(tempInfo);
                                        kernel.replaceLocation({'args': {},'id': 'home'});
                                    });
                                }();
                            }else{
                                targetLength--;
                            }
                        });
                        tempInfo.organization = targetData;
                        if(targetLength <= 0){
                            $loginBox.show();
                            $orgBox.hide();
                            //login status
                            $loginDoing.hide();
                            $loginSuccess.hide();
                            $loginSuccess.find('div.success-img >').remove();
                            $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                            $loginFail.show();
                        }else{
                            if(targetLength == 1){
                                $loginBox.show();
                                $orgBox.hide();
                                //login status
                                $loginDoing.show();
                                $loginSuccess.hide();
                                $loginFail.hide();
                                //initQrcode($loginBox.find('.loginQr'))
                                util.setCookie('orgid', orgInfo[targetCurrent].org_id),
                                util.setCookie('parentid', orgInfo[targetCurrent].top_department_id),
                                util.setCookie('orgname', orgInfo[targetCurrent].org_name),
                                util.setCookie('device_ids', (orgInfo[targetCurrent].device_ids ? orgInfo[targetCurrent].device_ids.length : 0)),
                                util.setCookie('app_ids', (orgInfo[targetCurrent].app_ids ? orgInfo[targetCurrent].app_ids.length : 0)),
                                util.setCookie('employee_count', orgInfo[targetCurrent].employee_count),
                                // update 20180306
                                tempInfo.orgindex = 0;
                                tempInfo.orgindexid = tempInfo.organization[0].org_id;
                                util.setUserData(tempInfo);
                                kernel.replaceLocation({'args': {},'id': 'home'});
                            }else{
                                $loginBox.hide();
                                $orgBox.show();
                                //login status
                                $loginDoing.show();
                                $loginSuccess.hide();
                                $loginFail.hide();
                                //initQrcode($loginBox.find('.loginQr'))
                                 if(targetLength <= 4){
                                    o.addClass('org-list-seldom');
                                }else{
                                    o.addClass('org-list-plenty');
                                }
                            }
                        }
                    }else{
                        $loginBox.show();
                        $orgBox.hide();
                        //login status
                        $loginDoing.hide();
                        $loginSuccess.hide();
                        $loginSuccess.find('div.success-img >').remove();
                        $loginSuccess.find('div.success-img').append('<img src="'+ json.avatar_url +'" title="'+ json.name +'">');
                        $loginFail.show();
                    }
                    if(data.type == 'websocket'){
                        //完成关闭websocket
                        ws.close();
                    }else if(data.type == 'polling'){
                        if(typeof ws === 'function'){
                            ws();
                        }
                    }
                } else {
                    kernel.hint(json.msg);
                }
            },
            error: function(res){
                kernel.hint(res.msg);
            }
        });
    }
    return {
        onload: function(force) {
            var h_userid, h_token, h_orgid, h_orgname, h_parentid;
            h_userid = util.getCookie('userid'),
            h_token = util.getCookie('token'),
            h_orgid = util.getCookie('orgid'),
            h_orgname = util.getCookie('orgname'),
            h_parentid = util.getCookie('parentid');
            if(h_userid != 'undefined' && h_token != 'undefined' && h_orgid != 'undefined' && h_orgname != 'undefined' && h_parentid != 'undefined'){
                $loginBox.show();
                $orgBox.hide();
            }
        }
    };
});