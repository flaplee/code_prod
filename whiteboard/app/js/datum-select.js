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
                limit: 28,
                offset: 0,
                goon: false,
                gallery: []
            },
            data: {
                meetId: util.getQuery('meet_id') || -1,
                meetTitle: decodeURI(util.getQuery('meet_name') || '选择资料'),
                api: util.config.apiurl + '/api/user/screenshots',
                access_token: util.getCookie('access_token') || '',
                viewImgs: {},
                dateIndex: 0,
                old_time: 0
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $oDatum = $page.find('.content .datum-o-select'),
                    $oDatumList = $oDatum.find('.datum-o-list'),
                    $navMenu = $page.find('.navMenu'),
                    $navShare = $navMenu.find('.nav-share'),
                    $navDelete = $navMenu.find('.nav-delete');
                var pageCtn = document.querySelector('#page .content .datum-o-select');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);

                deli.common.navigation.setTitle({
                    "title": Page.data.meetTitle
                }, function(data) {}, function(resp) {});
                deli.common.navigation.setRight({
                    "text": "取消"
                }, function(data) {
                    if(Page.methods.getOptList($oDatumList.find('input:checked')).length > 0){
                        $oDatumList.find('input:checked').prop('checked', false);
                    }else{
                        //history.go(-1);
                        location.replace(util.config.domain + '/datum.html' + ((Page.data.meetId > 0 && Page.data.meetId != -1) ? ('?meet_id=' + Page.data.meetId + '&meet_name=' + Page.data.meetTitle  + '') : ''));
                    }
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

                //goback
                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setTitle({
                        "title": Page.data.meetTitle
                    }, function(data) {}, function(resp) {});
                    deli.common.navigation.setRight({
                        "text": "取消"
                    }, function(data) {
                        if(Page.methods.getOptList($oDatumList.find('input:checked')).length > 0){
                            $oDatumList.find('input:checked').prop('checked', false);
                        }else{
                            //init history.go(-1); location.replace(util.config.domain + '/datum.html' + ((Page.data.meetId > 0 && Page.data.meetId != -1) ? ('?meet_id=' + Page.data.meetId + '') : ''));
                            Page.params.offset = 0;
                            var dataInner = {
                                offset: 0,
                                limit: Page.params.limit
                            }
                            if ((util.getQuery('meet_id') && util.getQuery('meet_id') != -1)) {
                                dataInner.meetId = Page.data.meetId;
                            }
                            Page.methods.getDatumList({
                                $o: $oDatum,
                                url: Page.data.api,
                                data: dataInner
                            },'back');
                        }
                    }, function(resp) {});
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
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        self.methods.getDatumList({
                            $o: $oDatum,
                            url: Page.data.api,
                            data: self.methods.setDatumData()
                        });
                    }
                }, false);
                //init
                self.methods.getDatumList({
                    $o: $oDatum,
                    url: Page.data.api,
                    data: self.methods.setDatumData()
                });
                $navShare.on('click', function(e) {
                    e.stopPropagation();
                    var shareList = {
                        'ids': self.methods.getOptList($oDatumList.find('input:checked')).join(','),
                        'meetingIds': ''
                    };
                    if (shareList.ids.length > 0 || shareList.meetingIds.length > 0) {
                        $.confirm("确定要分享已选中的资料?", "", function() {
                            Page.methods.shareList(shareList);
                        }, function() {});
                    }
                    return false;
                });
                $navDelete.on('click', function(e) {
                    e.stopPropagation();
                    var deleteList = {
                        'ids': self.methods.getOptList($oDatumList.find('input:checked')).join(','),
                        'meetingIds': ''
                    };
                    if (deleteList.ids.length > 0 || deleteList.meetingIds.length > 0) {
                        $.confirm("确定要删除已选中的资料?", "", function() {
                            Page.methods.deleteList(deleteList, $oDatumList.find('input:checked').parents('a.info-item'));
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
                    // update 20180322 删除指定截图资料
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshots/delete',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: {
                            'ids': data.ids,
                            'meetingIds': data.meetingIds
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                o.remove();
                                $.toast('已选资料删除成功', 'success', {'duration':1500,'newname':'weui-toast_modify'});
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
                setDatumData: function() {
                    var odata = {
                        offset: Page.params.offset,
                        limit: Page.params.limit
                    }
                    if ((util.getQuery('meet_id') && util.getQuery('meet_id') != -1)) {
                        odata.meetId = Page.data.meetId;
                    }
                    return odata;
                },
                getDatumList: function(data, back) {
                    var $dom = data.$o,
                        $domData = $dom.find('.datum-o-list'),
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
                            if (res.data.total > 0 && res.data.rows && res.data.rows.length > 0) {
                                var rows = res.data.rows;
                                if (Page.params.offset == 0) {
                                    $domData.find('>').remove();
                                }
                                if(back && back == 'back'){
                                    $domData.find('>').remove();
                                }
                                $.each(rows, function(i, n) {
                                    var urls = [],
                                        itemInnerHtml = '';
                                    appendTarget($domData, {
                                        index: Page.data.dateIndex,
                                        update_time: n.update_time,
                                        old_time: (Page.data.dateIndex == 0) ? n.update_time : Page.data.old_time,
                                        meet_id: n.id,
                                        id: n.id,
                                        img_url: n.img_url
                                    });
                                });
                                //根据时间间隔排列数据
                                function appendTarget(o, data) {
                                    var indexStr = '';
                                    var timeCeil = Math.ceil((parseInt(JSON.parse(data.update_time)) - parseInt(JSON.parse(data.old_time))) / (3.6E6));
                                    var diffDate = ((timeCeil < 24) && (timeCeil > (-24))) ? true : false;
                                    var $targetHtml, targetHtml = '<a class="info-item" href="javascript:;">\
                                        <label class="info-item-label weui-check__label" for="s' + data.meet_id + '" href="javascript:;">\
                                            <div class="info-item-input weui-cell__hd">\
                                                <input type="checkbox" class="weui-check" data-meet_id="' + data.id + '" name="checkbox' + data.meet_id + '" id="s' + data.meet_id + '" /><i class="weui-icon-checked"></i>\
                                            </div>\
                                            <div>\
                                                <div class="img_inside">\
                                                    <img class="icon-active" src="' + ((data.thumbnail) ? data.thumbnail : data.img_url) + '" data-index="' + data.index + '">\
                                                </div>\
                                            </div>\
                                        </label>\
                                    </a>';
                                    if (data.index != 0) {
                                        switch (diffDate) {
                                            case true:
                                                data.index = data.index;
                                                o.find('.datum-o-item').eq(data.index - 1).find('.datum-o-info').append(targetHtml);
                                                break;
                                            case false:
                                                $targetHtml = $('<div class="datum-o-item dl-list-item weui-cells_checkbox clear" data-meet_id="' + data.id + '" data-wrap-index="' + data.index + '">\
                                                    <div class="datum-o-date dl-ft-ellipsis"><span class="text">' + util.formatDate(parseInt(JSON.parse(data.update_time)), false, true) + '</span><a class="operate select-all" data-meet_id="' + data.id + '" href="javascript:;">全选</a></div>\
                                                    <div class="datum-o-info clear">\
                                                        ' + targetHtml + '\
                                                    </div>\
                                                </div>');
                                                o.append($targetHtml);
                                                Page.data.old_time = data.update_time;
                                                Page.data.dateIndex += 1;
                                                break;
                                        }
                                    } else {
                                        $targetHtml = $('<div class="datum-o-item dl-list-item weui-cells_checkbox clear" data-meet_id="' + data.id + '" data-wrap-index="' + data.index + '">\
                                            <div class="datum-o-date dl-ft-ellipsis"><span class="text">' + util.formatDate(parseInt(JSON.parse(data.update_time)), false, true) + '</span><a class="operate select-all" data-meet_id="' + data.id + '" href="javascript:;">全选</a></div>\
                                            <div class="datum-o-info clear">\
                                                ' + targetHtml + '\
                                            </div>\
                                        </div>');
                                        o.append($targetHtml);
                                        Page.data.dateIndex += 1;
                                        Page.data.old_time = data.update_time;
                                    }

                                    return function() {
                                        $($targetHtml).find('a.info-item img').on("click", function(e) {
                                            e.stopPropagation();
                                            var oIndex = $targetHtml.find('a.info-item img').attr('data-index');
                                            Page.params.gallery[i].open(oIndex);
                                        });

                                        $($targetHtml).find('a.operate').on('click', function(e) {
                                            e.stopPropagation();
                                            var c = $(this),
                                                cInfo = c.parent('.datum-o-date').siblings('.datum-o-info'),
                                                meet_id = c.attr('data-meet_id');
                                            if (c.hasClass('select-all')) {
                                                c.removeClass('select-all').addClass('select-cancel').text('取消全选');
                                                cInfo.find('input').prop('checked', true);
                                            } else {
                                                c.removeClass('select-cancel').addClass('select-all').text('全选');
                                                cInfo.find('input').prop('checked', false);
                                            }
                                        });


                                    }();
                                }
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
                                    // empty
                                    $domLoading.show();
                                    $domLoading.find('p').show();
                                }
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