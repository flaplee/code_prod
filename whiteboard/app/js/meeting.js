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
                offset: 0,
                goon: false
            },
            data: {
                remark: '',
                isMeetingAt: util.getQuery('is_meeting_at') || '',
                meetId: util.getQuery('meet_id') || '',
                joinId: util.getQuery('join_id') || '',
                access_token: util.getCookie('access_token')
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $contentMeeting = $page.find('.content .boardat-meeting-list'),
                    $meetingList = $contentMeeting.find('.meeting-list-data'),
                    $navMenu = $page.find('.navMenu'),
                    $navMeeting = $navMenu.find('.nav-meeting'),
                    $navAdd = $navMenu.find('.nav-add'),
                    $navAt = $navMenu.find('.nav-at'),
                    $navCompere = $navMenu.find('.nav-compere');
                var pageCtn = document.querySelector('#page .content .boardat-meeting-list');
                Page.methods.menuAddOrAt(((util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1') ? 1 : 0), $navAdd);
                // 禁用系统滚动
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);

                deli.common.navigation.setTitle({
                    "title": "主持人会议数据"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "text": ""
                }, function(data) {}, function(resp) {});

                //goback
                deli.common.navigation.goBack({},function(data){
                    // init 
                    Page.params.offset = 0;
                    Page.methods.getMeetingList({
                        $o: $contentMeeting,
                        url: util.config.apiurl + '/api/user/meetings/create',
                        data: Page.methods.setMeetingData()
                    }, 'back');

                    deli.common.navigation.setTitle({
                        "title": "主持人会议数据"
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": ""
                    }, function(data) {}, function(resp) {});

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
                },function(resp){});

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

                pageCtn.addEventListener('scroll', function(evt) {
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        Page.params.goon = false;
                        self.methods.getMeetingList({
                            $o: $contentMeeting,
                            url: util.config.apiurl + '/api/user/meetings/create',
                            data: self.methods.setMeetingData()
                        });
                    }
                }, false);

                self.methods.getMeetingList({
                    $o: $contentMeeting,
                    url: util.config.apiurl + '/api/user/meetings/create',
                    data: self.methods.setMeetingData()
                });

                if (self.data.isMeetingAt && (self.data.isMeetingAt == 'true' || self.data.isMeetingAt == true)) {
                    //$navAdd.hide();
                    //$navAt.show();
                    $navAt.off('click').on('click', function(e) {
                        e.stopPropagation();
                        $.ajax({
                            url: util.config.apiurl + "/api/meeting/screenshot",
                            type: "POST",
                            timeout: 1e3,
                            headers: {
                                'token': Page.data.access_token
                            },
                            dataType: "json",
                            data: {
                                meetId: self.data.meetId,
                                joinId: self.data.joinId
                            },
                            success: function(data) {
                                if (data.code == 0) {
                                    if (data.data == "1") {
                                        initIndex();
                                    }
                                    $.toast('截图中...', 'seccess', {'duration':1000,'newname':'weui-toast_modify_small'});
                                } else {
                                    $.toast('截图失败，请稍后再试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                }
                            },
                            error: function() {
                                $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            }
                        });
                    });
                } else {
                    //$navAdd.show();
                    //$navAt.hide();
                }
            },
            methods: {
                setMeetingData: function() {
                    var odata = Page.params;
                    odata.remark = Page.data.remark;
                    return odata;
                },
                getMeetingList: function(data, back) {
                    var $dom = data.$o,
                        $domData = $dom.find('.meeting-list-data'),
                        $domLoading = $dom.find('.loading_bottom');
                    $domLoading.show();
                    //$domLoading.find('.refresh').show();
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
                            $domLoading.hide();
                            //$domLoading.find('.refresh').hide();
                            if(!(back && back == 'back'))$.hideLoading();
                            if (res.code == 0) {
                                if (res.data.total > 0 && res.data.rows && res.data.rows.length > 0) {
                                    var rows = res.data.rows;
                                    if (Page.params.offset == 0) {
                                        $domData.find('>').remove();
                                    }
                                    if(back && back == 'back'){
                                        $domData.find('>').remove();
                                    }
                                    $.each(rows, function(i, n) {
                                        var min = Math.round(parseInt(n.update_time - n.begin_time) / (60 * 1000));
                                        var $itemHtml = $('<a href="' + util.config.domain + '/user.html?meet_id=' + n.id + '&meet_name='+ encodeURI((n.meet_name) ? n.meet_name : n.meeting.meet_name) +'" class="meeting-item" data-meet_id="' + n.id + '">\
                                            <div class="meeting-title">\
                                                <p><span class="meeting-title-inner dl-ft-ellipsis">会议：' + (n.meet_name ? n.meet_name : n.meeting.meet_name) + '</span><span>（时长' + ((min < 10) ? 10 : min) + '分钟' + ((min < 10) ? '内' : '') + '）</span></p>\
                                            </div>\
                                            <div class="meeting-info">\
                                                <div class="meeting-desc clear">\
                                                    <p class="meeting-user">会议人数：' + ((n.total_participants < 1) ? 0 : n.total_participants) + '人</p>\
                                                    <p class="meeting-img">截图数量：' + ((n.total_screenshots < 1) ? 0 : n.total_screenshots) + '张</p>\
                                                </div>\
                                            </div>\
                                            <div class="meeting-date">' + util.formatDate(n.begin_time * 1) + '</div>\
                                            <div class="meeting-next"></div>\
                                        </a>');
                                        $domData.append($itemHtml);
                                    });
                                    Page.params.offset += Page.params.limit;
                                    if (res.data.rows.length < Page.params.limit) {
                                        Page.params.goon = false;
                                        if (res.data.total > Page.params.limit) {
                                            // empty
                                            $domLoading.show();
                                            $domLoading.find('p').show();
                                        }
                                    } else {
                                        Page.params.goon = true;
                                    }
                                } else {
                                    if (Page.params.offset == 0) {
                                        $dom.removeClass('iosScrollFix');
                                        $dom.find('>').remove();
                                        $dom.append('<div class="empty"><div class="empty-img"></div><p class="empty-text">暂时没有数据</p></div>');
                                    } else {
                                        $domLoading.show();
                                        $domLoading.find('p').show();
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            $domLoading.hide();
                            //$domLoading.find('.refresh').hide();
                            if(!(back && back == 'back'))$.hideLoading();
                        }
                    });
                },
                menuAddOrAt:function(t, o){
                    if(t != 1 || Page.data.meetId == ''){
                        o.removeClass('nav-at');
                        o.siblings().css({'visibility':'visible'});
                        o.find('div.new-text span').text('加入会议');
                        o.off('click').on('click', function(e){
                            location.href = util.config.domain + '/add.html';
                        });
                    }else{
                        o.addClass('nav-at');
                        o.siblings().css({'visibility':'hidden'});
                        o.find('div.new-text span').text('');
                        o.off('click').on('click', function(e) {
                            e.stopPropagation();
                            $.ajax({
                                url: util.config.apiurl + "/api/meeting/screenshot",
                                type: "POST",
                                timeout: 1e3,
                                headers: {
                                    'token': Page.data.access_token
                                },
                                dataType: "json",
                                data: {
                                    meetId: Page.data.meetId
                                },
                                success: function(data) {
                                    if (data.code == 0) {
                                        if (data.data == "1") {
                                            Page.methods.initIndex();
                                        }
                                        $.toast('截图中...', 'seccess', {'duration':1000,'newname':'weui-toast_modify_small'});
                                    } else {
                                        $.toast(data.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                    }
                                },
                                error: function() {
                                    $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                }
                            });
                        });
                    }
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