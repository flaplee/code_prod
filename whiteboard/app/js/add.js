seajs.config({
    base: './',
    alias: {
        util: 'js/util.js',
        svgicons: 'js/src/svgicons'
    }
});
seajs.use(['util', 'svgicons'], function(util, svgicons) {
    util.delCookie('sign'), util.delCookie('appId'), util.delCookie('timestamp');
    var timestampPage = (Date.now().toString()), nonceStrPage = "abcdefg";
    util.getSignature(util.getCookie('sign'), util.config.apiurl + '/auth/config', timestampPage, nonceStrPage, function(response) {
        var sign, appId;
        if (response && response.signStr) {
            sign = response.signStr,
            appId = response.appId;
            util.setCookie('sign', sign, 7);
            util.setCookie('appId', appId, 7);
        }
        // 注入配置信息
        deli.config({
            noncestr: nonceStrPage, // 必填，生成签名的随机串
            appId: appId || util.getCookie('appId'), // 必填，应用ID  373175764691976192
            timestamp: timestampPage, // 必填，生成签名的时间戳
            signature: sign || util.getCookie('sign') // 必填，服务端生成的签名 26fcd1cab8ff455bfea0ee59a67bf122
        });
        var Page = {
            init: function() {
                var self = this;
                self.bindEvt();
            },
            params: {
                limit: 20,
                page: 0,
                spage: 0,
                goon: false,
                index: 0,
            },
            data: {
                appId: util.getCookie('appId'),
                access_token: util.getCookie('access_token') || ''
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $contentForm = $page.find('.content .boardat-meeting-form'),
                    $contentMeetId = $contentForm.find('input.text-meeting'),
                    $contentMeetPwd = $contentForm.find('input.text-password'),
                    $contentPwdIcon = $contentForm.find('#meetingPwd i'),
                    $navMeeting = $page.find('.navMenu.navmenu-meeting'),
                    $btnAddMeeting = $navMeeting.find('.btn-add');
                var pageCtn = document.querySelector('#page .content .boardat-meeting-form');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                pageCtn.addEventListener('scroll', function(evt) {}, false);

                deli.common.navigation.setTitle({
                    "title": "加入会议"
                }, function(data) {}, function(resp) {});
                deli.common.navigation.setRight({
                    "text": "",
                    "icon": "https://static.delicloud.com/h5/web/boardat/images/icon/scancode.png"
                }, function(data) {
                    deli.app.code.scan({
                        type: 'qrcode',
                        app_id: Page.data.appId
                    }, function(data) {
                        Page.methods.getAddMeeting({
                            url: util.config.apiurl + '/api/meeting/join/qrcode',
                            data: {
                                qrcode: data.text
                            }
                        });
                    }, function(resp) {});
                }, function(resp) {});
                // 关闭
                deli.common.navigation.close({}, function(data) {
                    deli.common.screen.breakAwake();
                    util.localStorage.remove('meetingStatus');
                    util.localStorage.remove('meetFrom');
                    util.localStorage.clear();
                    util.setLeaveMeet({token: Page.data.access_token}, function() {
                        deli.common.notification.toast({
                            "text": "已退出会议",
                            "duration": 1.5
                        }, function(data) {}, function(resp) {});
                    });
                }, function(resp) {});

                // goback
                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setTitle({
                        "title": "加入会议"
                    }, function(data) {}, function(resp) {});
                    deli.common.navigation.setRight({
                        "text": "",
                        "icon": "https://static.delicloud.com/h5/web/boardat/images/icon/scancode.png"
                    }, function(data) {
                        deli.app.code.scan({
                            type: 'qrcode',
                            app_id: Page.data.appId
                        }, function(data) {
                            Page.methods.getAddMeeting({
                                url: util.config.apiurl + '/api/meeting/join/qrcode',
                                data: {
                                    qrcode: data.text
                                }
                            }, 'back');
                        }, function(resp) {});
                    }, function(resp) {});
                },function(resp){});
                
                $contentPwdIcon.on('click', function() {
                    var c = $(this);
                    if (!c.hasClass('iconapp-eyespwd-view')) {
                        c.addClass('iconapp-eyespwd-view');
                        $contentMeetPwd.attr('type', 'text');
                    } else {
                        c.removeClass('iconapp-eyespwd-view');
                        $contentMeetPwd.attr('type', 'password');
                    }
                });
                
                $btnAddMeeting.on('click', function(e) {
                    e.stopPropagation();
                    var meetId = $contentMeetId.val(),
                        meetPwd = $contentMeetPwd.val();
                    if (meetId != '') {
                        self.methods.getAddMeeting({
                            url: util.config.apiurl + '/api/meeting/join',
                            data: {
                                meetNo: meetId,
                                password: meetPwd
                            }
                        });
                    } else {
                        $.toast('请输入会议号和会议密码', 'forbidden', {'duration':1500,'newname':'weui-toast_modify'});
                    }
                });
            },
            methods: {
                getAddMeeting: function(data, back) {
                    if(!(back && back == 'back'))$.showLoading("加载中...");
                    $.ajax({
                        url: data.url,
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data.data,
                        success: function(res) {
                            if(!(back && back == 'back'))$.hideLoading();
                            if (res.code == 0) {
                                var json = res.data,
                                    mid = json.meet_id,
                                    name = json.meet_name;
                                util.localStorage.remove('meetingStatus');
                                util.localStorage.remove('meetFrom');
                                util.localStorage.set('meetingStatus', '1');
                                util.localStorage.set('meetFrom', 'add');
                                $.toast('加入会议成功', 'seccess', {'duration':1500,'newname':'weui-toast_modify_small'});
                                setTimeout(function() {
                                    location.replace(util.config.domain + '/index.html?meet_id=' + mid + '&meet_name=' + name + '&meet_from=add');
                                }, 500);
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                }
            }
        };
        if (!deli.isDeliApp()) {
            Page.init();
        }
        // 验证签名成功
        deli.ready(function() {
            Page.init();
        });
        // 验证签名失败
        deli.error(function(resp) {
            util.delCookie('sign');
            util.delCookie('appId');
            alert(JSON.stringify(resp));
        });
    });
});