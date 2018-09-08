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
                limit: 10,
                offset: 0,
                goon: false
            },
            data: {
                userId: util.getCookie('userId'),
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
                    $oFolder = $page.find('.content .folder-o-select'),
                    $oFolderList = $oFolder.find('.folder-o-list'),
                    $navMenu = $page.find('.navMenu'),
                    $navShare = $navMenu.find('.nav-share'),
                    $navDelete = $navMenu.find('.nav-delete');
                var pageCtn = document.querySelector('#page .content .folder-o-select');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                setTimeout(function() {
                    deli.common.navigation.setTitle({
                        "title": "选择文件夹"
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "取消"
                    }, function(data) {
                        if(Page.methods.getOptList($oFolderList.find('input:checked')).length > 0){
                            $oFolderList.find('input:checked').prop('checked', false);
                        }else{
                            //history.go(-1);
                            location.replace(util.config.domain + '/folder.html');
                        }
                    }, function(resp) {});

                    deli.common.navigation.goBack({},function(data){
                        deli.common.navigation.setTitle({
                            "title": "选择文件夹"
                        }, function(data) {}, function(resp) {});

                        deli.common.navigation.setRight({
                            "text": "取消"
                        }, function(data) {
                            if(Page.methods.getOptList($oFolderList.find('input:checked')).length > 0){
                                $oFolderList.find('input:checked').prop('checked', false);
                            }else{
                                // init history.go(-1); location.replace(util.config.domain + '/folder.html');
                                Page.params.offset = 0;
                                var dataInner = {
                                    offset: 0,
                                    limit: Page.params.limit
                                }
                                Page.methods.getFolderSelectList({
                                    $o: $oFolder,
                                    url: util.config.apiurl + '/api/user/screenshot/meetings',
                                    data: {
                                        offset: 0,
                                        limit: Page.params.limit
                                    }
                                }, 'back');
                            }
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
                }, 0);
                pageCtn.addEventListener('scroll', function(evt) {
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        self.methods.getFolderSelectList({
                            $o: $oFolder,
                            url: util.config.apiurl + '/api/user/screenshot/meetings',
                            data: Page.methods.setFolderSelectdata()
                        });
                    }
                }, false);

                // init
                self.methods.getFolderSelectList({
                    $o: $oFolder,
                    url: util.config.apiurl + '/api/user/screenshot/meetings',
                    data: Page.methods.setFolderSelectdata()
                });

                /*$rightMenuBtn.on('click', function(e){
                    e.stopPropagation();
                    var c = $(this);
                    if(c.attr('data-selectall') == 'true'){
                        c.attr('data-selectall', false);
                        $oFolderList.find('input').prop('checked', false);
                    }else{
                        c.attr('data-selectall', true);
                        $oFolderList.find('input').prop('checked', true);
                    }
                });*/

                $navShare.on('click', function(e) {
                    e.stopPropagation();
                    var shareList = {
                        'ids': '',
                        'meetingIds': self.methods.getOptList($oFolderList.find('input:checked')).join(',')
                    };
                    if (shareList.meetingIds.length > 0 || shareList.ids.length > 0) {
                        $.confirm("确定要分享已选中的文件夹?", "", function() {
                            Page.methods.shareList(shareList);
                        }, function() {});
                    }
                    return false;
                });

                $navDelete.on('click', function(e) {
                    e.stopPropagation();
                    var deleteList = {
                        'ids': '',
                        'meetingIds': self.methods.getOptList($oFolderList.find('input:checked')).join(',')
                    };
                    if (deleteList.meetingIds.length > 0 || deleteList.ids.length > 0) {
                        $.confirm("确定要删除已选中的文件夹?", "", function() {
                            Page.methods.deleteList(deleteList, $oFolderList.find('input:checked').parents('.folder-o-item'));
                        }, function() {});
                    }
                    return false;
                });
            },
            methods: {
                shareList: function(data) {
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshots/share',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data,
                        success: function(res) {
                            if (res.code == 0) {
                                var json = res.data;
                                deli.common.message.share({
                                    title: '会议分享',
                                    desc: '会议简介',
                                    link: util.config.domain + '/detail.html?id=' + json + '',
                                    imgUrl: 'https://static.delicloud.com/images/logos/logo_share.png'
                                }, function(data) {}, function(resp) {});
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
                deleteList: function(data, o) {
                    // update 20180322 用户删除主持的会议资料
                    $.ajax({
                        url: util.config.apiurl + '/api/user/meeting/screenshots/delete',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: {
                            meetIds: data.meetingIds
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                o.remove();
                                $.toast('已选文件夹删除成功', 'success', {'duration':1500,'newname':'weui-toast_modify'});
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
                getOptList: function(o) {
                    var ids = [];
                    if (o.length > 0) {
                        $.each(o, function(i, n) {
                            ids.push($(n).attr('data-meet_id'));
                        });
                    }
                    return ids;
                },
                setFolderSelectdata: function() {
                    var odata = {
                        offset: Page.params.offset,
                        limit: Page.params.limit
                    }
                    return odata;
                },
                getFolderSelectList: function(data, back) {
                    var $dom = data.$o,
                        $domData = $dom.find('.folder-o-list'),
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
                            // $domLoading.find('.refresh').hide();
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
                                        var $itemHtml = $('<div class="folder-o-item weui-cells weui-cells_checkbox" data-meet_id="' + n.meeting_participant.meet_id + '">\
                                          <label class="folder-o-check weui-cell weui-check__label" for="s' + n.meeting_participant.meet_id + '">\
                                            <div class=" weui-cell__hd">\
                                              <input type="checkbox" class="weui-check" name="checkbox' + n.meeting_participant.meet_id + '" data-meet_id="' + n.meeting_participant.meet_id + '" id="s' + n.meeting_participant.meet_id + '">\
                                              <i class="weui-icon-checked"></i>\
                                            </div>\
                                            <div class="folder-o-info weui-cell__bd">\
                                              <div class="info-inner weui-cell">\
                                                <div class="info-desc weui-cell__bd">\
                                                  <div class="info-img">\
                                                    <img class="icon-active" src="' + ((n.last_screenshot) ? n.last_screenshot.img_url : '') + '">\
                                                  </div>\
                                                  <div class="info-text">\
                                                    <p class="title dl-ft-left dl-ft-ellipsis">' + n.meeting_participant.meet_name + '</p>\
                                                    <p class="desc dl-ft-left dl-ft-ellipsis ">' + n.total + '</p>\
                                                  </div>\
                                                </div>\
                                                <div class="info-date weui-cell__ft">' + util.formatDate(parseInt(n.meeting_participant.update_time), false, true) + '</div>\
                                              </div>\
                                            </div>\
                                          </label>\
                                        </div>');
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
                                    // empty
                                    $domLoading.show();
                                    $domLoading.find('p').show();
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            if(!(back && back == 'back'))$.hideLoading();
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