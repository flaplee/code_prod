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
                limit: 16,
                slimit: 16,
                offset: 0,
                foffset: 0,
                soffset: 0,
                sfoffset: 0,
                goon: false,
                sgoon: true,
                overgoon: true
            },
            data: {
                force: false,
                fforce: false,
                access_token: util.getCookie('access_token'),
                viewImgs: {},
                viewUrls: [],
                viewInit: 0
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $oSearch = $page.find('.content .boardat-wrap-search #searchInput'),
                    $oList = $page.find('.content .boardat-search-list'),
                    $oDatum = $oList.find('.boardat-search-datum'),
                    $oDatumList = $oList.find('.search-datum-list'),
                    $oFolder = $oList.find('.boardat-search-folder'),
                    $oFolderList = $oList.find('.search-folder-list');
                var pageCtn = document.querySelector('#page .content .boardat-search-list');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                pageCtn.addEventListener('scroll', function(evt) {
                    if(self.params.sgoon){
                        if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                            self.params.goon = false;
                            if (self.params.overgoon) {
                                self.methods.getDatumList({
                                    $o: $oList,
                                    $os: $oDatumList,
                                    url: util.config.apiurl + '/api/user/screenshots',
                                    data: self.methods.setDatumData(Page.params.remark)
                                });
                            } else {
                                self.methods.getFolderList({
                                    $o: $oList,
                                    $os: $oFolderList,
                                    url: util.config.apiurl + '/api/user/screenshot/meetings',
                                    data: self.methods.setFolderData(Page.params.remark)
                                });
                            }
                        }
                    }
                }, false);

                deli.common.navigation.setTitle({
                    "title": "搜索"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "text": "",
                    "icon": ""
                }, function(data) {}, function(resp) {});

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

                if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                    util.localStorage.set('meetFrom', 'search');
                }

                // goback
                deli.common.navigation.goBack({},function(data){
                    if(!(window.location.href.indexOf("#") >= 0)){}
                    deli.common.navigation.setTitle({
                        "title": "搜索"
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "",
                        "icon": ""
                    }, function(data) {}, function(resp) {});

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

                //init loadSearchPage
                Page.methods.loadSearchPage($oList, $oDatumList, $oFolderList);

                // searchRow
                self.methods.searchRow($oSearch);
            },
            methods: {
                setFolderData: function(remark) {
                    var odata = {
                        limit: Page.params.limit,
                        offset: Page.params.foffset
                    }
                    if (remark){
                        odata.limit = Page.params.slimit;
                        odata.offset = Page.params.sfoffset;
                        odata.search = remark;
                    }
                    return odata;
                },
                getFolderList: function(data) {
                    var $dom = data.$o,
                        $domData = data.$os,
                        $domLoading = $domData.siblings('.loading_bottom');
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
                            $.hideLoading();
                            $dom.find('.dl-list-data .empty').removeClass('show').addClass('hide');
                            if (res.code == 0) {
                                if (Page.params.foffset == 0 || (data.type == 'search' && Page.params.sfoffset == 0)) {
                                    $domData.find('>').remove();
                                    Page.params.sfoffset = 0;
                                }
                                if (res.data.total > 0 && res.data.rows.length > 0) {
                                    Page.data.fforce = false;
                                    var rows = res.data.rows;
                                    $.each(rows, function(i, n) {
                                        var $itemHtml = $('<div class="folder-item dl-list-item">\
                                          <div class="dl-list-content clear">\
                                            <div class="dl-list-info">\
                                              <img class="icon-active" src="' + ((n.last_screenshot) ? n.last_screenshot.thumbnail : '') + '">\
                                            </div>\
                                            <div class="dl-list-text">\
                                              <p class="dl-list-text-name dl-ft-ellipsis">' + ((n.meeting_participant.meet_name) ? n.meeting_participant.meet_name : n.meeting_participant.meeting.meet_name) + '</p>\
                                              <p class="dl-list-text-total dl-ft-ellipsis">' + n.total + '</p>\
                                            </div>\
                                          </div>\
                                        </div>');
                                        $domData.append($itemHtml);
                                        return function() {
                                            $($itemHtml).on('click', function(e) {
                                                e.stopPropagation();
                                                if(data.data.search && data.data.search.length > 0){
                                                    window.history.replaceState({"title":"","url":"#"}, "", "#");
                                                    window.addEventListener("popstate", function(e) {}, false);
                                                }
                                                location.href = util.config.domain + '/datum.html?meet_id=' + n.meeting_participant.meet_id + '';
                                            });
                                        }();
                                    });
                                    Page.params.goon = true;
                                    if(data.type == 'search'){
                                        Page.params.sfoffset = 0;
                                        Page.params.sgoon = false;
                                    }else{
                                        Page.params.foffset += Page.params.limit;
                                    }
                                    $dom.find('.boardat-search-folder').show();
                                } else {
                                    Page.data.fforce = true;
                                    // empty
                                    $domLoading.show();
                                    $domLoading.find('p').show();
                                    if(Page.params.foffset == 0 || (data.type == 'search' && Page.params.sfoffset == 0)){
                                        $dom.find('.boardat-search-folder').hide();
                                        if(Page.data.fforce == true && Page.data.force == true  && (data.type == 'search' && Page.params.sfoffset == 0)) {
                                            $dom.removeClass('iosScrollFix');
                                            $dom.find('.dl-list-data .empty').removeClass('hide').addClass('show');
                                        }else{
                                            $dom.find('.dl-list-data .empty').removeClass('show').addClass('hide');
                                        }
                                    }else{
                                        Page.params.overgoon = false;
                                        Page.params.goon = true;
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            $domLoading.hide();
                            Page.data.fforce = true;
                            $.hideLoading();
                        }
                    });
                },
                setDatumData: function(remark) {
                    var odata = {
                        limit: Page.params.limit,
                        offset: Page.params.offset
                    }
                    if (remark){
                        odata.limit = Page.params.slimit;
                        odata.offset = Page.params.soffset;
                        odata.search = remark;
                    }
                    return odata;
                },
                getDatumList: function(data) {
                    var $dom = data.$o,
                        $domData = data.$os,
                        $domLoading = $domData.siblings('.loading_bottom');
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
                            $.hideLoading();
                            $dom.find('.dl-list-data .empty').removeClass('show').addClass('hide');
                            if(res.code == 0){
                                if (Page.params.offset == 0 || (data.type == 'search' && Page.params.soffset == 0)) {
                                    $domData.find('>').remove();
                                    Page.params.soffset = 0;
                                }
                                if (res.data.total > 0 && res.data.rows.length > 0) {
                                    Page.data.force = false;
                                    var urls = [],
                                        cIndex = '0';
                                    var rows = res.data.rows;
                                    $.each(rows, function(i, n) {
                                        urls.push(n.img_url);
                                        var $itemDatumHtml = $('<div class="datum-item dl-list-item" data-meet_id="' + n.meet_id + '" data-detail_id="' + n.id + '">\
                                          <div class="dl-list-content clear">\
                                            <div class="dl-list-info">\
                                                <div>\
                                                    <div class="img_inside">\
                                                        <img class="icon-active" src="' + n.img_url + '">\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="dl-list-text">\
                                              <p class="dl-list-text-name dl-ft-ellipsis">' + ((n.img_url) ? n.img_url.match(/\/(\w+\.(?:png|jpg|gif|bmp))$/i)[1] : '') + '</p>\
                                              <p class="dl-list-text-total dl-ft-ellipsis">' + util.formatDate(parseInt(n.update_time), false) + '</p>\
                                            </div>\
                                          </div>\
                                        </div>');
                                        $domData.append($itemDatumHtml);
                                        return function() {
                                            $($itemDatumHtml).on('click', function(e) {
                                                e.stopPropagation();
                                                if(data.data.search && data.data.search.length > 0){
                                                    window.history.replaceState({"title":"","url":"#"}, "", "#");
                                                    window.addEventListener("popstate", function(e) {}, false);
                                                }
                                                location.href = util.config.domain + '/view.html?meet_id=' + n.id + '&meet_from=search&imgs_index=0&views_index='+ parseInt(Page.data.viewInit + i) +'';
                                                Page.data.viewInit += rows.length;
                                            });
                                        }();
                                    });

                                    Page.data.viewImgs[cIndex] = (Page.data.viewUrls).concat(urls);
                                    util.localStorage.remove('viewImgs');
                                    util.localStorage.set('viewImgs', JSON.stringify(Page.data.viewImgs));

                                    Page.params.goon = true;
                                    if(data.type == 'search'){
                                        Page.params.soffset = 0;
                                        Page.data.viewInit = 0;
                                        Page.data.viewUrls = [];
                                    }else{
                                        Page.params.offset += Page.params.limit;
                                    }
                                    $dom.find('.boardat-search-datum').show();
                                }else {
                                    Page.data.force = true;
                                    // empty
                                    $domLoading.show();
                                    $domLoading.find('p').show();
                                    if(Page.params.offset == 0 || (data.type == 'search' && Page.params.soffset == 0)){
                                        $dom.find('.boardat-search-datum').hide();
                                        if (Page.data.force == true && Page.data.fforce == true && (data.type == 'search' && Page.params.soffset == 0)) {
                                            $dom.removeClass('iosScrollFix');
                                            $dom.find('.dl-list-data .empty').removeClass('hide').addClass('show');
                                        }else{
                                            $dom.find('.dl-list-data .empty').removeClass('show').addClass('hide');
                                        }
                                    }else{
                                        Page.params.overgoon = false;
                                        Page.params.goon = true;
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            $domLoading.hide();
                            Page.data.force = true;
                            $.hideLoading();
                        }
                    });
                },
                searchRow: function(o) {
                    var searchTag = null;
                    var $page = $('#page'),
                        $oList = $page.find('.content .boardat-search-list'),
                        $oDatumList = $oList.find('.search-datum-list'),
                        $oFolderList = $oList.find('.search-folder-list');
                    o.bind('input', function() {
                        var keyword = o.val();
                        clearInterval(searchTag);
                        searchTag = setTimeout(function() {
                            searchTag = null;
                            if (keyword.length != 0) {
                                Page.methods.loadSearchPage($oList, $oDatumList, $oFolderList, keyword);
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
                                    Page.methods.loadSearchPage($oList, $oDatumList, $oFolderList, keyword);
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
                        Page.params.offset = 0;
                        Page.params.foffset = 0;
                        Page.params.sgoon = true;
                        Page.methods.loadSearchPage($oList, $oDatumList, $oFolderList, '');
                    });
                },
                loadSearchPage: function(o, osd, os, keyword) {
                    $.showLoading("加载中...");
                    // update 20180322 搜索
                    Page.methods.getFolderList({
                        $o: o,
                        $os: os,
                        type: (keyword && keyword.length > 0) ? 'search' : undefined,
                        url: util.config.apiurl + '/api/user/screenshot/meetings',
                        data: Page.methods.setFolderData(keyword)
                    });

                    Page.methods.getDatumList({
                        $o: o,
                        $os: osd,
                        type: (keyword && keyword.length > 0) ? 'search' : undefined,
                        url: util.config.apiurl + '/api/user/screenshots',
                        data: Page.methods.setDatumData(keyword)
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