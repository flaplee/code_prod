seajs.config({
    base: './',
    alias: {
        util: 'js/util.js',
        svgicons: 'js/src/svgicons'
    }
});
seajs.use(['util', 'svgicons'], function(util, svgicons) {
    var signPage = util.getCookie('sign'), timestampPage, nonceStrPage;
    if(util.getCookie('sign') && util.getCookie('timestamp') && util.getCookie('nonceStr')){
        signPage = util.getCookie('sign'),
        timestampPage = util.getCookie('timestamp'),
        nonceStrPage = util.getCookie('nonceStr');
    }else{
        timestampPage = (Date.now().toString()),
        nonceStrPage = "abcdefg";
    }

    util.getSignature(signPage, util.config.apiurl + '/auth/config', timestampPage, nonceStrPage, function(response) {
        var sign, appId;
        if (response && response.signStr) {
            sign = response.signStr,
            appId = response.appId;
            util.setCookie('sign', sign, 7);
            util.setCookie('appId', appId, 7);
            util.setCookie('timestamp', timestampPage, 7);
            util.setCookie('nonceStr', nonceStrPage, 7);
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
                sgoon: false,
                index: 0,
                gallery: []
            },
            data: {
                userId: util.getCookie('userId'),
                meetId: util.getQuery('meet_id'),
                meetTitle: decodeURI(util.getQuery('meet_name')) || '会议',
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
                    $boardatWrap = $page.find('#page-user.boardat-user'),
                    $boardatTab = $page.find('.boardat-tab'),
                    $boardatTabUser = $page.find('.boardat-navbar-user'),
                    $boardatTabScreen = $page.find('.boardat-navbar-screen'),
                    $boardatContent = $page.find('.boardat-tab .boardat-content'),
                    $contentUser = $page.find('.content #user.user-list .boardat-user-list-inner'),
                    $userData = $contentUser.find('.user-list-data'),
                    $contentScreen = $page.find('.content #screen.screen-list .boardat-screen-list-inner'),
                    $screenData = $contentScreen.find('.screen-list-data'),
                    $navMenu = $page.find('#navMenu'),
                    $navMeeting = $navMenu.find('nav-meeting'),
                    $navAdd = $navMenu.find('nav-add'),
                    $navCompere = $navMenu.find('nav-compere');
                var pageCtn = document.querySelector('#page .content #user.user-list .boardat-user-list-inner'),
                    sPageCtn = document.querySelector('#page .content #screen.screen-list .boardat-screen-list-inner');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                util.fixIosScrolling(sPageCtn);
                setTimeout(function() {
                    deli.common.navigation.setTitle({
                        "title": Page.data.meetTitle
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "清空"
                    }, function(data) {
                        $.confirm("确定要清空此会议数据？", "", function() {
                            // update 20180322 用户删除主持的会议资料
                            Page.methods.clearMettingData(util.config.apiurl + '/api/user/meetings/delete', {
                                ids: Page.data.meetId
                            }, $boardatWrap);
                        }, function() {});
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
                }, 0);

                // goback
                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setTitle({
                        "title": Page.data.meetTitle
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "清空"
                    }, function(data) {
                        $.confirm("确定要清空此会议数据？", "", function() {
                            // update 20180322 用户删除主持的会议资料
                            Page.methods.clearMettingData(util.config.apiurl + '/api/user/meetings/delete', {
                                ids: Page.data.meetId
                            }, $boardatWrap);
                        }, function() {});
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
                },function(resp){});

                pageCtn.addEventListener('scroll', function(evt) {
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && Page.params.goon) {
                        // update 20180322 会议截图的用户列表
                        Page.params.goon = false;
                        self.methods.getUserList({
                            $o: $contentUser,
                            url: util.config.apiurl + '/api/meeting/participants',
                            data: Page.methods.setSingleData()
                        });
                    }
                }, false);

                sPageCtn.addEventListener('scroll', function(evt) {
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && Page.params.sgoon) {
                        // update 20180322 会议截图列表
                        Page.params.sgoon = false;
                        self.methods.getSceentList({
                            $o: $contentScreen,
                            url: util.config.apiurl + '/api/meeting/screenshots',///api/user/screenshots
                            data: Page.methods.setSingleData(true)
                        });
                    }
                }, false);

                self.methods.getUserList({
                    $o: $contentUser,
                    url: util.config.apiurl + '/api/meeting/participants',
                    data: Page.methods.setSingleData()
                });

                self.methods.getSceentList({
                    $o: $contentScreen,
                    url: util.config.apiurl + '/api/meeting/screenshots',
                    data: Page.methods.setSingleData(true)
                });

                $boardatTab.find('a').on('click', function(e) {
                    e.stopPropagation();
                    var c = $(this),
                        index = c.index();
                    if (!c.hasClass('current')) {
                        c.addClass('current');
                        c.siblings().removeClass('current');
                        $boardatContent.find('> div').eq(index).show();
                        $boardatContent.find('> div').eq(index).show().siblings().hide();
                    }
                });
            },
            methods: {
                setSingleData: function(isPage) {
                    var odata = {
                        userId: Page.data.userId,
                        offset: (isPage && isPage == true) ? Page.params.spage : Page.params.page,
                        limit: Page.params.limit,
                        meetId: Page.data.meetId
                    }
                    return odata;
                },
                getUserList: function(data) {
                    var $dom = data.$o,
                        $domData = $dom.find('.user-list-data'),
                        $domLoading = $dom.find('.loading_bottom');
                    $domLoading.show();
                    //$domLoading.find('.refresh').show();
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
                            if (res.code == 0) {
                                $('#page #page-user .boardat-navbar-user').find('span.user-total').text(res.data.total);
                                if (res.data.total > 0 && res.data.rows.length > 0) {
                                    var rows = res.data.rows;
                                    if (Page.params.page == 0) {
                                        $domData.find('>').remove();
                                    }
                                    if (rows) {
                                        $.each(rows, function(i, n) {
                                            var $itemHtml = $('<div class="dl-list-item">\
                                            <div class="dl-list-content">\
                                                <div class="dl-list-info dl-list-user-info">\
                                                    <a href="javascript:;"><img class="icon-active" src="' + ((n.user.avatar_url && n.user.avatar_url != '') ? n.user.avatar_url : 'https://static.delicloud.com/images/users/avatar_100.png') + '"></a>\
                                                </div>\
                                                <div class="dl-list-text dl-list-user-text">\
                                                    <span>' + n.user.name + '</span>\
                                                </div>\
                                            </div>\
                                        </div>');
                                            $domData.append($itemHtml);
                                            return function() {
                                                $($itemHtml).find('.dl-list-content .dl-list-info a img').on("click", function(e) {
                                                    e.stopPropagation();
                                                    deli.common.image.preview({
                                                        "current": 0,
                                                        "urls": [((n.user.avatar_url && n.user.avatar_url != '') ? n.user.avatar_url : 'https://static.delicloud.com/images/users/avatar_100.png')]
                                                    }, function(data) {}, function(resp) {});
                                                });
                                            }();
                                        });
                                        Page.params.page += Page.params.limit;
                                        Page.params.goon = true;
                                    }
                                } else {
                                    if (Page.params.page == 0){
                                        // empty
                                        $domData.removeClass('iosScrollFix');
                                        $domData.find('>').remove();
                                        $domData.append('<div class="empty"><div class="empty-img"></div><p class="empty-text">暂时没有数据</p></div>');
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
                        }
                    });
                },
                getSceentList: function(data) {
                    var $dom = data.$o,
                        $domData = $dom.find('.screen-list-data'),
                        $domLoading = $dom.find('.loading_bottom');
                    $domLoading.show();
                    //$domLoading.find('.refresh').show();
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
                            if (res.code == 0) {
                                $('#page #page-user .boardat-navbar-screen').find('span.screen-total').text(res.data.total);
                                if (res.data.total > 0 && res.data.rows.length > 0) {
                                    var rows = res.data.rows;
                                    if (Page.params.spage == 0) {
                                        $domData.find('>').remove();
                                    }
                                    if (rows) {
                                        $.each(rows, function(i, n) {
                                            var $itemHtml = $('<div class="dl-list-item" data-meet_id="' + n.meet_id + '">\
                                                <div class="dl-list-content">\
                                                  <div class="dl-list-info dl-list-screen-info">\
                                                    <a href="javascript:;">\
                                                        <div>\
                                                            <div class="img_inside">\
                                                                <img class="icon-active" src="' + n.img_url + '">\
                                                            </div>\
                                                        </div>\
                                                    </a>\
                                                  </div>\
                                                  <div class="dl-list-text dl-list-user-text">\
                                                    <span>截图人数：<span>' + ((n.total_users > 0) ? n.total_users : 1) + '</span>人</span>\
                                                  </div>\
                                                </div>\
                                            </div>');
                                            $domData.append($itemHtml);
                                            return function() {
                                                $($itemHtml).find('.dl-list-content .dl-list-info a img').on("click", function(e) {
                                                    e.stopPropagation();
                                                    deli.common.image.preview({
                                                        "current": 0,
                                                        "urls": [n.img_url]
                                                    }, function(data) {}, function(resp) {});
                                                });
                                            }();
                                        });
                                        Page.params.spage += Page.params.limit;
                                        Page.params.sgoon = true;
                                    }
                                } else {
                                    if (Page.params.spage == 0){
                                        // empty
                                        $domData.removeClass('iosScrollFix');
                                        $domData.find('>').remove();
                                        $domData.append('<div class="empty"><div class="empty-img"></div><p class="empty-text">暂时没有数据</p></div>');
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
                        }
                    });
                },
                clearMettingData: function(url, data, o) {
                    $.ajax({
                        url: url,
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data,
                        success: function(res) {
                            if (res.code == 0) {
                                $.toast('会议数据已清空', 'success', {'duration':1500,'newname':'weui-toast_modify'});
                                o.find('>').remove();
                                o.append('<div class="empty"><div class="empty-img"></div><p class="empty-text">暂时没有数据</p></div>');
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
            util.delCookie('sign'), util.delCookie('appId'), util.delCookie('timestamp'), util.delCookie('nonceStr');
            alert(JSON.stringify(resp));
        });
    });
});