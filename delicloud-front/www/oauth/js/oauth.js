$(function() {
    var $login = $('#login'),
        $loginBox = $login.find('.login-box'),
        $loginQr = $loginBox.find('#loginQr'),
        $loginDoing = $loginQr.find('.login-doing'),
        $loginSuccess = $loginQr.find('.login-success'),
        $successBtn = $loginSuccess.find('.success-btn'),
        $loginFail = $loginQr.find('.login-fail'),
        $failBtn = $loginFail.find('.fail-btn');
        $orgBox = $login.find('.org-box'),
        $orgList = $orgBox.find('.org-wrap .org-inner .org-list');
    var userInfo = {}, stomp = null;
    // init
    initQrcode($loginBox.find('.loginQr'));

    $(document).on('click', '.loginQr', function() {
        var self = this,
            loginQr = $loginBox.find('.loginQr'),
            that = loginQr[this === loginQr[0] ? 1 : 0];
        if (this.childNodes.length === 0) {
            if (that && that.childNodes.length > 0) {
                this.innerHTML = that.innerHTML;
            } else {
                $.ajax({
                    url: '/web/v1.0/barcode_login/public',
                    type: 'get',
                    dataType: 'json',
                    success: function(json) {
                        if (json.code == 0) {
                            var res = json.data['result'],
                                cid = res.cid,
                                url = res.data,
                                session = res.session;
                            if (url) {
                                loginQr.html('');
                                //self.appendChild(kernel.makeQr(url, 300));
                                new QRCode(document.getElementById('qrcode'), {
                                    text: url,
                                    width: 234,
                                    height: 234,
                                    correctLevel: QRCode.CorrectLevel.L
                                });
                                webSocketInit(session);
                            } else {
                                loginQr.html('');
                                //更新user
                            }
                        } else {
                            alert(json.msg);
                        }
                    },
                    error: function(json) {
                        alert('网络或服务器错误');
                    }
                });
            }
        }
    });
    
    $successBtn.on('click', function() {
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });;

    $failBtn.on('click', function() {
        initQrcode($loginBox.find('.loginQr'));
        $loginFail.hide();
        $loginSuccess.hide();
        $loginDoing.show();
    });;

    // init qrcode
    function initQrcode(o) {
        o.addClass('login-loading');
        setTimeout(function() {
            $.ajax({
                url: '/web/v1.0/barcode_login/public',
                type: 'get',
                dataType: 'json',
                success: function(json) {
                    o.removeClass('login-loading');
                    if (json.code == 0) {
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
                        } else {
                            o.html('');
                        }
                    } else {
                        alert(json.msg);
                    }
                },
                error: function(json) {
                    //alert('网络或服务器错误');
                }
            });
        }, 0);
    };

    // webSocket
    function webSocketInit(session){
        if (!!window.WebSocket && window.WebSocket.prototype.send){
            // 打开一个 web socket
            var ws = new WebSocket(session.ws_url);
            ws.onopen = function(){
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send('{"cmd": "register","data": "'+ session.session_id +'"}');
            };
            ws.onmessage = function(evt){
                var json = JSON.parse(evt.data);
                if(json){
                    if(json.id){
                        //login status
                        $loginDoing.hide();
                        $loginFail.hide();
                        $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'}).attr('title', json.name);
                        $loginSuccess.show();
                    }
                    if(json.user_id){
                        userInfo = json;
                        if (userInfo.type == '_user_') {
                            util.setCookie('token', userInfo.token);
                            util.setCookie('userid', userInfo.user_id);
                            util.setCookie('expire', userInfo.expire);
                        }
                        orgsCalls($orgList,{
                            userid: userInfo.user_id,
                            token: userInfo.token
                        }, ws);
                    }
                }
            };
            ws.onclose = function() {
                // 关闭 websocket
                console.log("连接已关闭...")
            };
        }
        else{
            // 浏览器不支持 WebSocket
            console.log("use polling")
            pollInit(session.http_url);
        }
    }

    // polling
    function pollInit(url) {
        setTimeout(function() {
            util.ajaxSubmit({
                url: url,
                silent: true,
                type:'get',
                force: true,
                success: function(json) {
                    console.log("json", json);
                    //pollInit(url);
                },
                error: function(json){
                    kernel.hint('网络或服务器错误~', 'error');
                }
            });
        }, 5000);
    }

    // 选择组织
    function orgsCalls(o, data, ws) {
        $.ajax({
            url: '/web/v1.0/admin/auth/my',
            type: 'get',
            dataType: 'json',
            headers: {
                Dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + util.buildDauth(data.userid, data.token, (new Date().valueOf())),
            },
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    o.find('>').remove('');
                    var orgInfo = json.data.result;
                    if(orgInfo && orgInfo.length && orgInfo.length > 0){
                        $loginBox.hide();
                        $orgBox.show();
                        var length = orgInfo.length;
                        // 组织列表
                        (length <= 3) ? ((length == 1) ? (util.setCookie('orgid', orgInfo[0].org_id), util.setCookie('parentid', orgInfo[0].top_department_id), util.setCookie('orgname', orgInfo[0].org_name)) : o.addClass('org-list-seldom')) : o.addClass('org-list-plenty');
                        $.each(orgInfo, function(i, item) {
                            if(item.is_admin == true){
                                var $tempOrg = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a></li>');
                                o.append($tempOrg);
                                setOrgList($tempOrg, item.org_id);
                                // 选择组织
                                function setOrgList(o, orgid) {
                                    o.find('a.list-item-inner').on('click', function(e) {
                                        e.stopPropagation();
                                        // set url redirect
                                        var login = /\/login\b/, url = util.getQuery('redirect', true);
                                        if (login.test(url)){url = util.updateURLParameter(url, 'redirect', window.location.href);}
                                        //set app url cookies
                                        util.setCookie('user_id', userInfo.user_id, 7, undefined, url),
                                        util.setCookie('org_id', orgid, 7, undefined, url),
                                        util.setCookie('token', userInfo.token, 7, undefined, url);
                                        util.setCookie('uuid', '', 7, undefined, url);
                                        window.location.href = url + '?user_id='+ userInfo.user_id +'&org_id='+ orgid +'&token='+ userInfo.token +'&uuid=';
                                    });
                                }
                            }
                        });
                    }else{
                        $loginBox.show();
                        $orgBox.hide();
                        //login status
                        $loginDoing.hide();
                        $loginSuccess.hide();
                        $loginSuccess.find('div.success-img').css({'background-image':'url('+json.avatar_url+')'}).attr('title', json.name);
                        $loginFail.show();
                    }
                    ws.close();
                }else{
                    alert(json.msg);
                }
            },
            error: function(json) {
                alert('网络或服务器错误');
            }
        });
    }
});