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
                limit: 10,
                offset: 0,
                soffset: 0,
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
                    $oFolder = $page.find('.content .folder-o-operate'),
                    $oFolderList = $oFolder.find('.folder-o-list');
                var pageCtn = document.querySelector('#page .content #boardat-o-folder .folder-o-list'),
                    sPageCtn = document.querySelector('#page .content #folder-search-list .folder-search-list-inner');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn),
                util.fixIosScrolling(sPageCtn);

                deli.common.navigation.setTitle({
                    "title": "文件夹列表"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "text": "选择"
                }, function(data) {
                    if ($oFolderList.find('.folder-o-item').length > 0) {
                        location.href = util.config.domain + '/folder-select.html';
                    } else {
                        deli.common.notification.toast({
                            "text": "暂无可选内容"
                        }, function(data) {}, function(resp) {});
                    }
                }, function(resp) {});

                if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                    util.localStorage.set('meetFrom', 'folder');
                }

                deli.common.navigation.goBack({},function(data){
                    //init history.go(-1);
                    if(!(window.location.href.indexOf("#") >= 0)){
                        Page.params.offset = 0;
                        var dataInner = {
                            offset: 0,
                            limit: Page.params.limit
                        }
                        if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                            util.localStorage.set('meetFrom', 'folder');
                        }
                        Page.methods.getFolderList({
                            type: 'index',
                            $o: $oFolderList,
                            url: util.config.apiurl + '/api/user/screenshot/meetings',
                            data: dataInner
                        }, 'back');
                    }
                    
                    deli.common.navigation.setTitle({
                        "title": "文件夹列表"
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "选择"
                    }, function(data) {
                        if ($oFolderList.find('.folder-o-item').length > 0) {
                            location.href = util.config.domain + '/folder-select.html';
                        } else {
                            deli.common.notification.toast({
                                "text": "暂无可选内容"
                            }, function(data) {}, function(resp) {});
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
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        self.methods.getFolderList({
                            type: 'index',
                            $o: $oFolderList,
                            url: util.config.apiurl + '/api/user/screenshot/meetings',
                            data: self.methods.setFolderData()
                        });
                    }
                }, false);

                sPageCtn.addEventListener('scroll', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        Page.methods.loadFolderPage($oFolderSearchList, 'search', $('#searchInput').val());
                    }
                }, false);

                self.methods.getFolderList({
                    type: 'index',
                    $o: $oFolderList,
                    url: util.config.apiurl + '/api/user/screenshot/meetings',
                    data: self.methods.setFolderData()
                });

                // searchRow
                self.methods.searchRow($('#searchInput'), $('#searchResult'));
            },
            methods: {
                setFolderData: function(type, keyword) {
                    var odata = {
                        offset: (type && type == 'search') ? Page.params.soffset : Page.params.offset,
                        limit: Page.params.limit
                    }
                    if (type && type == 'search') odata.search = keyword;
                    return odata;
                },
                getFolderList: function(data, back) {
                    var $oFolderWrapSearch = $('#page .content .folder-o-operate .folder-wrap-search'),
                        $oFolderSearch = $oFolderWrapSearch.find('.folder-search-list'),
                        $oFolderList = $('#page .content .folder-o-operate  .folder-o-list');
                    if (data.type == 'search') {
                        $oFolderWrapSearch.addClass('topheight');
                        $oFolderSearch.show();
                        $oFolderList.hide();
                    } else {
                        $oFolderWrapSearch.removeClass('topheight');
                        $oFolderSearch.hide();
                        $oFolderList.show();
                    }
                    var $dom = data.$o,
                        $domData = $dom.find('.folder-list-data'),
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
                                if (res.data.total > 0 && res.data.rows.length > 0) {
                                    var self = this;
                                    var rows = res.data.rows;
                                    if ((data.type == 'search') ? (Page.params.soffset == 0) : (Page.params.offset == 0)) {
                                        $domData.find('>').remove();
                                    }
                                    if(back && back == 'back'){
                                        $domData.find('>').remove();
                                    }
                                    $.each(rows, function(i, n) {
                                        var status = (n.meeting_participant.leave_time && n.meeting_participant.leave_time == '-1') ? 'doing' : 'done';
                                        var $itemHtml = $('<div class="folder-o-item weui-cell weui-cell_swiped" data-meet_id="' + n.meeting_participant.meet_id + '" data-meet_status="'+ status +'">\
                                            <div class="folder-o-info weui-cell__bd">\
                                              <div class="info-inner weui-cell">\
                                                <div class="info-desc weui-cell__bd">\
                                                  <div class="info-img">\
                                                    <img class="icon-active" src="' + ((n.last_screenshot) ? n.last_screenshot.img_url : '') + '">\
                                                  </div>\
                                                  <div class="info-text">\
                                                    <p class="title dl-ft-left dl-ft-ellipsis">' + ((n.meeting_participant.meet_name) ? n.meeting_participant.meet_name : n.meeting_participant.meet_name) + '</p>\
                                                    <p class="desc dl-ft-left dl-ft-ellipsis ">' + n.total + '</p>\
                                                  </div>\
                                                </div>\
                                                <div class="info-date weui-cell__ft">' + util.formatDate(parseInt(n.meeting_participant.update_time), false, true) + '</div>\
                                              </div>\
                                            </div>\
                                            <div class="folder-operate weui-cell__ft">\
                                              <a class="operate-share weui-swiped-btn weui-swiped-btn_default default-swipeout" data-meet_id="' + n.meeting_participant.meet_id + '" href="javascript:">分享</a>\
                                              <a class="operate-edit weui-swiped-btn weui-swiped-btn_default default-swipeout" data-meet_id="' + n.meeting_participant.meet_id + '" href="javascript:">编辑</a>\
                                              <a class="operate-del weui-swiped-btn weui-swiped-btn_warn delete-swipeout" data-meet_id="' + n.meeting_participant.meet_id + '" href="javascript:">删除</a>\
                                            </div>\
                                        </div>');
                                        $domData.append($itemHtml);
                                        return function() {
                                            $($itemHtml).on('click', function(e) {
                                                e.stopPropagation();
                                                var pushstate = '';
                                                if(data.type == 'search'){
                                                    pushstate = '&push_state=search';
                                                    window.history.replaceState({"title":"","url":"#"}, "", "#");
                                                    window.addEventListener("popstate", function(e) {
                                                    }, false);
                                                }
                                                location.href = util.config.domain + '/datum.html?meet_id=' + n.meeting_participant.meet_id + '&meet_name='+ encodeURI(n.meeting_participant.meet_name) +''+ pushstate +'';
                                            });
                                            $($itemHtml).find('.operate-share').on('click', function(e) {
                                                e.stopPropagation();
                                                var c = $(this),
                                                    meet_id = c.attr('data-meet_id');
                                                Page.methods.folderShare(meet_id, c.parent('.folder-operate').siblings('.folder-o-info').find('.info-text p.title').text());
                                            });
                                            $($itemHtml).find('.operate-edit').on('click', function(e) {
                                                e.stopPropagation();
                                                var c = $(this),
                                                    meet_id = c.attr('data-meet_id');
                                                Page.methods.folderEdit(meet_id, c.parent('.folder-operate').siblings('.folder-o-info').find('.info-text p.title').text(), c.parents('.folder-o-item'));
                                            });
                                            $($itemHtml).find('.operate-del').on('click', function(e) {
                                                e.stopPropagation();
                                                var c = $(this),
                                                    meet_id = c.attr('data-meet_id');
                                                Page.methods.folderDel(meet_id, $($itemHtml));
                                            });
                                        }();
                                    });
                                    $('.weui-cell_swiped').swipeout();
                                    (data.type == 'search') ? (Page.params.soffset = 0) : (Page.params.offset += Page.params.limit);
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
                                    if ((data.type == 'search') ? (Page.params.soffset == 0) : (Page.params.offset == 0)) {
                                        $domData.removeClass('iosScrollFix');
                                        $domData.find('>').remove();
                                        $domData.append('<div class="empty"><div class="empty-img"></div><p class="empty-text">暂时没有数据</p></div>');
                                    } else {
                                        // empty
                                        $domLoading.show();
                                        $domLoading.find('p').show();
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $domLoading.hide();
                            $domLoading.find('.refresh').hide();
                            if(!(back && back == 'back'))$.hideLoading();
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
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
                folderShare: function(mid, name){
                    var shareList = {
                        'ids': '',
                        'meetingIds': mid
                    };
                    if (shareList.meetingIds.length > 0 || shareList.ids.length > 0) {
                        $.confirm("确定要分享文件夹："+ name +"", "", function() {
                            Page.methods.shareList(shareList);
                        }, function() {}, "weui-dialog__bd_modify");
                    }
                },
                folderEdit: function(mid, name, o) {
                    $.prompt({
                        title: '编辑文件夹名称',
                        text: '',
                        input: name,
                        empty: false, // 是否允许为空
                        maxlength: 15, //修改源码jq-weui加入此参数
                        modify: {
                            'focus':'focus-grey',
                            'input':'weui-prompt-input-margin-bottom'
                        }, //修改源码jq-weui加入此参数
                        onOK: function(input) {
                            $.ajax({
                                url: util.config.apiurl + '/api/user/meeting/rename',
                                type: "POST",
                                timeout: 1e3,
                                headers: {
                                    'token': Page.data.access_token
                                },
                                dataType: "json",
                                data: {
                                    meetId: mid,
                                    meetName: input
                                },
                                success: function(res) {
                                    if (res.code == 0) {
                                        o.find('.folder-o-info .info-inner .info-desc .info-text p.title').text(input);
                                        $.toast('编辑文件夹名称成功', 'success', {'duration':1500,'newname':'weui-toast_modify'});
                                        o.swipeout('close');
                                    } else {
                                        $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                    };
                                },
                                error: function() {
                                    $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                }
                            });
                        },
                        onCancel: function() {}
                    });
                },
                folderDel: function(mid, o) {
                    $.confirm("此操作将永久删除该文件夹？", "", function() {
                        if(o.attr('data-meet_status') == 'doing'){
                            $.toast('会议正在进行中，无法删除', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }else{
                            $.ajax({
                                url: util.config.apiurl + '/api/user/meeting/screenshots/delete',
                                type: "POST",
                                timeout: 1e3,
                                headers: {
                                    'token': Page.data.access_token
                                },
                                dataType: "json",
                                data: {
                                    meetIds: mid
                                },
                                success: function(res) {
                                    if (res.code == 0) {
                                        o.remove();
                                        $.toast('文件夹删除成功', 'seccess', {'duration':1500,'newname':'weui-toast_modify'});
                                    } else {
                                        $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                    };
                                },
                                error: function() {
                                    $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                }
                            });
                        }
                    }, function() {});
                },
                searchRow: function(o, os) {
                    var searchTag = null;
                    var $rowList = $('#page .content .folder-o-operate .folder-o-list'),
                        $searchRowList = $('#page .content .folder-o-operate .folder-search-list-inner');
                    o.bind('input', function() {
                        var keyword = o.val();
                        clearInterval(searchTag);
                        searchTag = setTimeout(function() {
                            searchTag = null;
                            if (keyword.length != 0) {
                                Page.methods.loadFolderPage($searchRowList, 'search', keyword);
                            } else {}
                        }, 500);
                    });
                    o.keyup(function(evt) {
                        if (evt.keyCode == '13') {
                            var keyword = o.val();
                            clearInterval(searchTag);
                            searchTag = setTimeout(function() {
                                searchTag = null;
                                if (keyword.length != 0) {
                                    Page.methods.loadFolderPage($searchRowList, 'search', keyword);
                                } else {}
                            }, 500);
                        }
                    });
                    o.on('submit', function(e) {
                        e.preventDefault();
                        return false;
                    });
                    $('#searchCancel').click(function() {
                        o.val('');
                        Page.params.soffset = 0;
                        var $oFolderWrapSearch = $('#page .content .folder-o-operate .folder-wrap-search'),
                            $oFolderSearch = $oFolderWrapSearch.find('.folder-search-list'),
                            $oFolderList = $('#page .content .folder-o-operate  .folder-o-list');
                        $oFolderWrapSearch.removeClass('topheight');
                        $oFolderSearch.hide();
                        $oFolderList.show();
                        $oFolderSearch.find('.folder-list-data >').remove();
                        //Page.methods.loadFolderPage($rowList, undefined, '');
                    });
                },
                loadFolderPage: function(o, type, keyword) {
                    Page.methods.getFolderList({
                        type: type,
                        $o: o,
                        url: util.config.apiurl + '/api/user/screenshot/meetings',
                        data: Page.methods.setFolderData('search', keyword)
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