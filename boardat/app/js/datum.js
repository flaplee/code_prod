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
                soffset: 0,
                goon: false
            },
            data: {
                meetId: util.getQuery('meet_id') || -1,
                meetName: util.getQuery('meet_name') || -1,
                meetTitle: decodeURI(util.getQuery('meet_name') || '最新资料'),
                pushstate: util.getQuery('push_state') || -1,
                api: util.config.apiurl + '/api/user/screenshots',
                access_token: util.getCookie('access_token'),
                viewImgs: {},
                date_index: 0,
                s_date_index: 0,
                old_time: 0,
                s_old_time: 0,
                posData:[]
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $oDatum = $page.find('.content .datum-o-operate'),
                    $oDatumSearchList = $oDatum.find('.datum-search-list-inner'),
                    $oDatumSearch = $oDatum.find('.datum-wrap-search'),
                    $oDatumList = $oDatum.find('.datum-o-list');
                var pageCtn = document.querySelector('#page .content #boardat-o-datum .datum-o-list'),
                    sPageCtn = document.querySelector('#page .content #datum-search-list .datum-search-list-inner');
                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                util.fixIosScrolling(sPageCtn);

                deli.common.navigation.setTitle({
                    "title": Page.data.meetTitle
                }, function(data) {}, function(resp) {});
                deli.common.navigation.setRight({
                    "text": "选择"
                }, function(data) {
                    if ($oDatumList.find('.datum-o-item').length > 0) {
                        location.href = util.config.domain + '/datum-select.html' + ((Page.data.meetId > 0 && Page.data.meetId != -1) ? ('?meet_id=' + Page.data.meetId + '&meet_name=' + Page.data.meetTitle  + '') : '');
                    } else {
                        deli.common.notification.toast({
                            "text": "暂无可选内容"
                        }, function(data) {}, function(resp) {});
                    }
                }, function(resp) {});

                if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                    util.localStorage.set('meetFrom', 'datum');
                }

                //goback
                deli.common.navigation.goBack({},function(data){
                    if(!(window.location.href.indexOf("#") >= 0)){
                        //init getDatumList
                        Page.params.offset = 0;
                        Page.data.date_index = 0;
                        Page.data.s_date_index = 0;
                        Page.data.old_time = 0;
                        Page.data.s_old_time = 0;
                        var dataInner = {
                            offset: 0,
                            limit: Page.params.limit,
                            search: ''
                        }
                        if ((util.getQuery('meet_id') && util.getQuery('meet_id') != -1)) {
                            dataInner.meetId = Page.data.meetId;
                        }
                        if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                            util.localStorage.set('meetFrom', 'datum');
                        }
                        Page.methods.getDatumList({
                            type: 'index',
                            $o: $oDatumList,
                            url: Page.data.api,
                            data: dataInner
                        }, 'back');
                    }
                    deli.common.navigation.setTitle({
                        "title": Page.data.meetTitle
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "选择"
                    }, function(data) {
                        if ($oDatumList.find('.datum-o-item').length > 0) {
                            location.href = util.config.domain + '/datum-select.html' + ((Page.data.meetId > 0 && Page.data.meetId != -1) ? ('?meet_id=' + Page.data.meetId + '') : '');
                        } else {
                            deli.common.notification.toast({
                                "text": "暂无可选内容"
                            }, function(data) {}, function(resp) {});
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

                pageCtn.addEventListener('scroll', function(evt) {
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        self.methods.getDatumList({
                            type: 'index',
                            $o: $oDatumList,
                            url: Page.data.api,
                            data: self.methods.setDatumData()
                        });
                    }
                }, false);

                sPageCtn.addEventListener('scroll', function(evt) {
                    evt.stopPropagation();
                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                        self.params.goon = false;
                        Page.methods.loadDatumPage($oDatumSearchList, 'search', $('#searchInput').val());
                    }
                }, false);

                self.methods.getDatumList({
                    type: 'index',
                    $o: $oDatumList,
                    url: Page.data.api,
                    data: self.methods.setDatumData()
                });

                // searchRow
                self.methods.searchRow($('#searchInput'), $('#searchResult'));

                /*$(window).resize(function(){
                    Page.methods.autoStickPos($oDatumList, 'datum-o-date', 'data-step-index', Page.data.posData);
                });

                $oDatumList.scroll(function(){
                    Page.methods.autoStickPos($oDatumList, 'datum-o-date', 'data-step-index', Page.data.posData);
                });*/
            },
            methods: {
                setDatumData: function(type, keyword) {
                    var odata = {
                        offset: (type && type == 'search') ? Page.params.soffset : Page.params.offset,
                        limit: Page.params.limit,
                        search: ((type && type == 'search') ? keyword : '')
                    }
                    if ((util.getQuery('meet_id') && util.getQuery('meet_id') != -1)) {
                        odata.meetId = Page.data.meetId;
                    }
                    return odata;
                },
                getDatumList: function(data, back) {
                    var $oDatumWrapSearch = $('#page .content .datum-o-operate .datum-wrap-search'),
                        $oDatumSearch = $oDatumWrapSearch.find('.datum-search-list'),
                        $oDatumList = $('#page .content .datum-o-operate  .datum-o-list');
                    if (data.type == 'search') {
                        $oDatumWrapSearch.addClass('topheight');
                        $oDatumSearch.show();
                        $oDatumList.hide();
                    } else {
                        $oDatumWrapSearch.removeClass('topheight');
                        $oDatumSearch.hide();
                        $oDatumList.show();
                    }
                    var $dom = data.$o,
                        $domData = $dom.find('.datum-list-data'),
                        $domLoading = $dom.find('.loading_bottom');
                    $domLoading.show();
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
                            if(!(back && back == 'back'))$.hideLoading();
                            if (res.code == 0) {
                                if (res.data.total > 0 && res.data.rows && res.data.rows.length > 0) {
                                    var rows = res.data.rows;
                                    if ((data.type == 'search') ? (Page.params.soffset == 0) : (Page.params.offset == 0)) {
                                        $domData.find('>').remove();
                                    }
                                    /*if(data.type != 'search' && back && back == 'back'){
                                        $domData.find('>').remove();
                                    }*/
                                    $.each(rows, function(i, n) {
                                        appendTarget($domData, {
                                            type: data.type,
                                            index: Page.data.date_index,
                                            s_index: Page.data.s_date_index,
                                            update_time: n.update_time,
                                            old_time: (Page.data.date_index == 0) ? n.update_time : Page.data.old_time,
                                            s_old_time: (Page.data.s_date_index == 0) ? n.update_time : Page.data.s_old_time,
                                            meet_id: n.id,
                                            id: n.id,
                                            img_url: n.img_url,
                                            thumbnail: n.thumbnail
                                        });
                                    });
                                    //根据时间间隔排列数据
                                    function appendTarget(o, data) {
                                        var indexStr = '';
                                        data.index = ((data.type == 'search') ? data.s_index : data.index);
                                        data.old_time = ((data.type == 'search') ? data.s_old_time : data.old_time);
                                        var diffDate = (new Date().Diff('d', new Date(parseInt(JSON.parse(data.update_time)))) == new Date().Diff('d', new Date(parseInt(JSON.parse(data.old_time))))) ? true : false;
                                        var $targetHtml, targetHtml = '<a class="info-item" href="javascript:;" data-meet_id="' + data.meet_id + '" data-id="' + data.id + '">\
                                            <div>\
                                                <div class="img_inside">\
                                                    <img class="icon-active" src="' + ((data.thumbnail) ? data.thumbnail : data.img_url) + '" data-index="' + data.index + '">\
                                                </div>\
                                            </div>\
                                        </a>';
                                        if (data.index != 0) {
                                            switch (diffDate) {
                                                case true:
                                                    data.index = data.index;
                                                    o.find('.datum-o-item').eq(data.index - 1).find('.datum-o-info').append(targetHtml);
                                                    indexStr = (data.index - 1).toString();
                                                    if (Page.data.viewImgs[indexStr] && Page.data.viewImgs[indexStr] instanceof Array) {
                                                        Page.data.viewImgs[indexStr].push(data.img_url);
                                                    } else {
                                                        Page.data.viewImgs[indexStr] = [];
                                                        Page.data.viewImgs[indexStr].push(data.img_url)
                                                    }
                                                    break;
                                                case false:
                                                    Page.data.posData.push(util.formatDate(parseInt(JSON.parse(data.update_time)), false, true));
                                                    $targetHtml = $('<div class="datum-o-item dl-list-item clear" data-wrap-index="' + data.index + '">\
                                                        <div class="datum-o-date dl-ft-ellipsis" data-step-index="' + (data.index + 1) + '">' + util.formatDate(parseInt(JSON.parse(data.update_time)), false, true) + '</div>\
                                                        <div class="datum-o-info clear">\
                                                          ' + targetHtml + '\
                                                        </div>\
                                                    </div>');
                                                    o.append($targetHtml);
                                                    indexStr = (((data.type == 'search') ? Page.data.s_date_index : Page.data.date_index)).toString();
                                                    if (Page.data.viewImgs[indexStr] && Page.data.viewImgs[indexStr] instanceof Array) {
                                                        Page.data.viewImgs[indexStr].push(data.img_url)
                                                    } else {
                                                        Page.data.viewImgs[indexStr] = [];
                                                        Page.data.viewImgs[indexStr].push(data.img_url)
                                                    }
                                                    Page.data.old_time = data.update_time;
                                                    (data.type == 'search' ? (Page.data.s_date_index += 1) : (Page.data.date_index += 1));
                                                    break;
                                            }
                                        } else {
                                            Page.data.posData.push(util.formatDate(parseInt(JSON.parse(data.update_time)), false, true));
                                            $targetHtml = $('<div class="datum-o-item dl-list-item clear" data-wrap-index="' + data.index + '">\
                                                <div class="datum-o-date dl-ft-ellipsis" data-step-index="' + (data.index + 1) + '">' + util.formatDate(parseInt(JSON.parse(data.update_time)), false, true) + '</div>\
                                                <div class="datum-o-info clear">\
                                                  ' + targetHtml + '\
                                                </div>\
                                            </div>');
                                            o.append($targetHtml);
                                            indexStr = (((data.type == 'search') ? Page.data.s_date_index : Page.data.date_index)).toString();
                                            if (Page.data.viewImgs[indexStr] && Page.data.viewImgs[indexStr] instanceof Array) {
                                                Page.data.viewImgs[indexStr].push(data.img_url);
                                            } else {
                                                Page.data.viewImgs[indexStr] = [];
                                                Page.data.viewImgs[indexStr].push(data.img_url)
                                            }
                                            Page.data.old_time = data.update_time;
                                            (data.type == 'search' ? (Page.data.s_date_index += 1) : (Page.data.date_index += 1));
                                        }
                                    }
                                    $domData.find('.datum-o-item a.info-item').on('click', function(e) {
                                        e.stopPropagation();
                                        var viewsIndex = $(this).index(),
                                            imgsIndex = $(this).parents('.datum-o-item').attr('data-wrap-index'),
                                            meetId = $(this).attr('data-meet_id');
                                        if(data.type == 'search'){
                                            window.history.replaceState({"title":"","url":"#"}, "", "#");
                                        }
                                        $(this).attr('href', '' + util.config.domain + '/view.html?meet_id=' + meetId + '&meet_name='+ Page.data.meetName +'&meet_from=datum&imgs_index=' + imgsIndex + '&views_index=' + viewsIndex + '');
                                    });
                                    util.localStorage.remove('viewImgs');
                                    util.localStorage.set('viewImgs', JSON.stringify(Page.data.viewImgs));
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
                                };
                                //Page.methods.autoStickPos($oDatumList, 'datum-o-date', 'data-step-index', Page.data.posData);
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                $domLoading.hide();
                                if(!(back && back == 'back'))$.hideLoading();
                            };
                        },
                        error: function() {
                            if(!(back && back == 'back'))$.hideLoading();
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
                searchRow: function(o, os) {
                    var searchTag = null;
                    var $rowList = $('#page .content .datum-o-operate .datum-o-list'),
                        $searchRowList = $('#page .content .datum-o-operate .datum-search-list-inner');
                    o.bind('input', function() {
                        var keyword = o.val();
                        clearInterval(searchTag);
                        searchTag = setTimeout(function() {
                            searchTag = null;
                            if (keyword.length != 0) {
                                Page.methods.loadDatumPage($searchRowList, 'search', keyword);
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
                                    Page.methods.loadDatumPage($searchRowList, 'search', keyword);
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
                        var $oDatumWrapSearch = $('#page .content .datum-o-operate .datum-wrap-search'),
                            $oDatumSearch = $oDatumWrapSearch.find('.datum-search-list'),
                            $oDatumList = $('#page .content .datum-o-operate  .datum-o-list');
                        $oDatumWrapSearch.removeClass('topheight');
                        $oDatumSearch.hide();
                        $oDatumList.show();
                        $oDatumSearch.find('.datum-list-data >').remove();
                        //Page.methods.loadDatumPage($rowList, undefined, '');
                    });
                },
                loadDatumPage: function(o, type, keyword) {
                    Page.methods.getDatumList({
                        type: type,
                        $o: o,
                        url: Page.data.api,
                        data: Page.methods.setDatumData('search', keyword)
                    });
                },
                autoStickPos:function($dom, itemClass, itemStep, data){
                    var w = function(){
                      var e = $dom.find("." + itemClass)[0],
                          o = Math.abs($(e).offset().top - 44),
                          t = $dom.find('.datum-list-data').last(),
                          n = Math.abs($(t).offset().top + $(t).height()),
                          i = Math.abs($(t).offset().top - 44);
                      i !== 0 && i >= o && i < $(t).height() ? $(e).addClass(""+ itemClass +"-fixed") : ($(e).find("."+ itemClass +"").html(1), $(e).removeClass(""+ itemClass +"-fixed")), $("."+ itemClass +"").each(function(index, ele) {
                          var o = $(ele).offset().top;
                          if (i > o - 80 && o <= 44) {
                              var n = $(ele).attr(itemStep);
                              var r = data[index];
                              $("."+ itemClass +"-fixed").html(r)
                          }
                      });
                    }();
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