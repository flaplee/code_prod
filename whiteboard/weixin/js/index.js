seajs.config({
    base: './',
    alias: {
        util: 'js/util.js'
    }
});

seajs.use(['util'], function(util) {
    var Page = {
        init: function() {
            var self = this;
            self.bindEvt();
            if (!(util.getQuery('userId') ? util.getQuery('userId') : util.getCookie('userId'))) {
                util.wxLogin();
                return false;
            }
            document.addEventListener('WeixinJSBridgeReady', function onBridgeReady(){
                WeixinJSBridge.call('hideOptionMenu');
            });

            util.loadJsTicket(function(){
                util.wxShare('index');

                //隐藏右上角菜单接口
                wx.hideOptionMenu();
                pushHistory();
                window.addEventListener("popstate", function(e) {
                    window.location.reload();
                }, false);
                function pushHistory(){
                    var state = {
                        title : "",
                        url : "#"
                    };
                    window.history.replaceState(state, "", "#");
                }
                //init wx.ready
                /*util.browserIOS();
                window.addEventListener('scroll', noscroll, false);
                document.documentElement.addEventListener('scroll', noscroll, false);
                document.body.addEventListener('scroll', noscroll, false);
                document.getElementById('page').addEventListener('scroll', noscroll, false);
                window.addEventListener('contextmenu', browser.name === 'Firefox' ? util.stopEvent : util.cancelEvent, false);
                window.addEventListener('dragstart', util.cancelEvent, false);*/
                if (/Android/gi.test(navigator.userAgent)) {
                    window.addEventListener('resize', function () {
                        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                            window.setTimeout(function () {
                                document.activeElement.scrollIntoViewIfNeeded();
                            }, 0);
                        }
                    })
                }

                var initWeixinIndex = function() {
                    $.ajax({
                        url: util.config.apiurl + "/weixin/login",
                        type: "GET",
                        timeout: 1e3,
                        dataType: "json",
                        data: {
                            userId: Page.data.userId
                        },
                        success: function(json) {
                            if (json.code == 0) {
                                Page.data.access_token = json.data;
                                util.setCookie('access_token', Page.data.access_token, 7);
                                // page load
                                self.dataHandler.getMeetingList.call(self, {
                                    userId: self.data.userId,
                                    limit: self.params.limit,
                                    offset: self.params.page,
                                    search: ''
                                });

                                var pageCtn = document.querySelector('#page-list #house-index-list .house-index-list-inner'),
                                    sPageCtn = document.querySelector('#house-search-list .house-search-list-inner');
                                util.fixIosScrolling(pageCtn), util.fixIosScrolling(sPageCtn);
                                pageCtn.addEventListener('scroll', function(evt) {
                                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                                        self.params.goon = false;
                                        self.dataHandler.getMeetingList.call(self, {
                                            userId: self.data.userId,
                                            limit: self.params.limit,
                                            offset: self.params.page,
                                            search: ''
                                        });
                                    }
                                }, false);

                                sPageCtn.addEventListener('scroll', function(evt) {
                                    if (this.scrollTop + this.clientHeight >= util.getScrollHeight(this) && self.params.goon) {
                                        self.params.goon = false;
                                        Page.loadMettingPage($('#searchInput').val(), 'search', 0);
                                    }
                                }, false);

                            } else {
                                $.toast(json.msg, 'cancel');
                            }
                        },
                        error: function() {}
                    });
                }();
            });

            // 重置scroll
            function noscroll(evt) {
                if (evt.target === this) {
                    if (this.scrollTo) {
                        this.scrollTo(0, 0);
                    } else {
                        this.scrollLeft = this.scrollTop = 0;
                    }
                }
            }
        },
        params: {
            limit: 10,
            page: 0,
            spage: 0,
            goon: true,
            index: 0,
            sindex: 0,
            gallery: [],
            sgallery: []
        },
        data: {
            rows: [],
            userId: (util.getQuery('userId') ? util.getQuery('userId') : util.getCookie('userId')),
            access_token: ''
        },
        selector: {},
        methods: {
            getRow: function(meet_id) {
                var self = this,
                    row;
                $.each(self.data.rows, function(i, n) {
                    if (n.id == meet_id) {
                        row = n;
                    }
                });
                return row;
            },
            isAllSelected: function(nodelist) {
                var len = nodelist.length,
                    num = 0,
                    res;
                $.each(nodelist, function(i, n) {
                    (!($(n).attr('data-checked') == "true")) ? num-- : num++;
                });
                res = (num == len) ? true : false;
                return res;
            },
            getShareList: function(nodelist) {
                var self = this,
                    shareList = {},
                    ids = [],
                    meetingIds = [];
                $.each(nodelist, function(i, n) {
                    var $wrapItem = $(n).find('.dl-list-item-wrap .dl-list-check label > input[type=checkbox]');
                    if ($wrapItem.attr('data-checked') == "true") {
                        meetingIds.push($(n).attr('meet_id'));
                    } else {
                        $.each($(n).find('.dl-list-item-inner .dl-list-text .text-item .item-cont .item-img'), function(j, k) {
                            var $innerItem = $(k).find('.item-img-wrap .dl-list-img-check label > input[type=checkbox]');
                            if ($innerItem.attr('data-checked') == "true") ids.push($(k).attr('data-id'));
                        });
                    };
                });
                shareList.ids = ids.join(','),
                    shareList.meetingIds = meetingIds.join(',');
                return shareList;
            },
            backToTop: function() {
                function swipershow(h, con) {
                    function fixed_header() {
                        if ($(this).scrollTop() > h) {
                            con.fadeIn(500);
                        } else {
                            con.fadeOut(500);
                        }
                    };
                    $('body').bind('touchmove', function() {
                        fixed_header();
                    });
                    $(window).scroll(function() {
                        fixed_header();
                    });
                }

                swipershow(400, $('.back-top'));
                $('.back-top').click(function() {
                    $('body,html').animate({
                        scrollTop: 0
                    }, 500);
                });
            },
            searchRow: function(o, os) {
                var searchTag = null,
                    lasttime;
                o.bind('input', function(evt) {
                    var keyword = o.val();
                    $('#page #page-list.house-outer').hide();
                    $('#page #house-search-list').show();
                    $('#page #page-list.house-outer').attr('data-extend', false);
                    $('#page #house-search-list').attr('data-extend', true);
                    clearInterval(searchTag);
                    searchTag = setTimeout(function() {
                        searchTag = null;
                        if (keyword.length != 0) {
                            Page.loadMettingPage(keyword, 'search', 0);
                        } else {}
                    }, 500);
                });
                o.keyup(function(evt) {
                    lasttime = evt.timeStamp;
                    if (evt.keyCode == '13') {
                        if ((lasttime - evt.timeStamp) == 0) {
                            var keyword = o.val();
                            $('#page #page-list.house-outer').hide();
                            $('#page #house-search-list').show();
                            $('#page #page-list.house-outer').attr('data-extend', false);
                            $('#page #house-search-list').attr('data-extend', true);
                            clearInterval(searchTag);
                            searchTag = setTimeout(function() {
                                searchTag = null;
                                if (keyword.length != 0) {
                                    Page.loadMettingPage(keyword, 'search', 0);
                                } else {}
                            }, 500);
                        }
                    }
                });
                o.on('submit', function(e) {
                    e.preventDefault();
                });
                $('#searchCancel').click(function() {
                    o.val('');
                    Page.params.spage = 0;
                    $('#page #page-list.house-outer').show();
                    $('#page #house-search-list').hide();
                    $('#page #page-list.house-outer').attr('data-extend', true);
                    $('#page #house-search-list').attr('data-extend', false);
                    //Page.loadMettingPage('');
                });
            }
        },
        loadMettingPage: function(keyword, type, page) {
            var self = this;
            var w = (type && type == 'search') ? 'search' : type,
                a = (type && type == 'search') ? self.params.spage : self.params.page;
            self.dataHandler.getMeetingList.call(self, {
                type: w,
                page: page,
                userId: self.data.userId,
                limit: self.params.limit,
                offset: page,
                search: keyword
            });
        },
        viewHandler: {
            list: function(n) {
                var self = this;
                return '<div class="dl-list-item" meet_id="' + n.meeting_participant.meet_id + '"> <div class="dl-list-item-wrap clearfix weui-cell weui-cell_swiped"> <div class="dl-list-wrap-box clearfix weui-cell__bd weui-cells_checkbox" style="transform: translate3d(0px, 0px, 0px);"> <div class="dl-list-check weui-cell__hd"> <label class="weui-cell weui-check__label left" for="' + n.meeting_participant.meet_id + '"> <input type="checkbox" class="weui-check" name="checkbox' + n.meeting_participant.meet_id + '" id="' + n.meeting_participant.meet_id + '" data-checked="false"><i class="weui-icon-checked"></i> </label> </div> <div class="dl-list-info weui-cell__bd"> <div class="info-title"> ' + n.meeting_participant.meet_name + '</div> <div class="info-date"> ' + util.formatDate(n.meeting_participant.update_time * 1, "full") + '</div> </div> <div class="dl-list-btn weui-cell__ft" data-load="loading"> <a href="javascript:;" class="icon-down btn-pull-down" data-boardat_id=""></a> </div> </div> <div class="weui-cell__ft"> <a class="weui-swiped-btn weui-swiped-btn_default btn-pull-share" href="javascript:">分享</a><a class="weui-swiped-btn weui-swiped-btn_warn btn-pull-delete" href="javascript:">删除</a> </div> </div> <div class="dl-list-item-inner weui-panel weui-panel_access" style="display: none;"> <div class="dl-list-text"> <div class="text-item"> <div class="item-cont"></div> </div> </div> </div> </div>';
            },
            detail: function(o, w, a, data, d) {
                if (w) {
                    var $targetHtml;
                    if (Array.isArray(w)) {
                        var urls = [],
                            surls = [],
                            dStatus = false;
                        d = (d == 'loaded') ? 'loaded' : 'loading';
                        dStatus = (d == 'loaded') ? true : false;
                        $.each(w, function(k, j) {
                            (data.type && data.type == 'search') ? surls.push(j.img_url): urls.push(j.img_url);
                        });
                        $.each(w, function(i, n) {
                            $targetHtml = $('<div class="item-img" data-id="' + n.id + '">\
                              <div class="item-img-wrap" style="display:flex;">\
                                <div class="dl-list-img-check weui-cells_checkbox">\
                                    <label class="dl-check dl-check-one weui-cell weui-check__label left" for="img' + a + '' + n.id + '">\
                                        <input type="checkbox" class="weui-check dl-check-boxs" name="imgcheckbox' + n.id + '" id="img' + a + '' + n.id + '" meet_id="' + data.meetid + '" detail_id="' + n.id + '" data-checked="'+ dStatus +'">\
                                        <i class="weui-icon-checked"></i>\
                                    </label>\
                                </div>\
                                <div class="dl-list-content">\
                                  <div class="dl-list-info">\
                                    <div class="info-date">' + util.formatDate(n.update_time * 1, "date") + '</div>\
                                  </div>\
                                </div>\
                                <div class="dl-list-btn" data-load="'+ d +'">\
                                  <a href="javascript:;" detail_id="' + n.id + '" class="icon-img-edit btn-img-edit" ></a>\
                                </div>\
                              </div>\
                              <div class="item-img-refer">\
                                <div class="item-img-refer-inner">\
                                    <img class="item-img-inner" data-src="' + n.img_url + '" width="100%" height="100%" />\
                                    <div id="loadingIco" style="display: none;"></div>\
                                </div>\
                                <a href="javascript:;" class="icon-edit item-btn item-btn-extend btn-pull-edit" data-clicked="false">编辑</a>\
                              </div>\
                              <div class="item-desc-wrap">\
                                <div class="item-desc item-desc-input hide">\
                                    <div class="item-desc-input-form weui-cells weui-cells_form">\
                                        <div class="desc-input-form weui-cell">\
                                          <div class="weui-cell__bd">\
                                            <textarea class="weui-textarea" contenteditable="true" placeholder="' + ((n.remark !== undefined && n.remark != '') ? n.remark : '') + '" rows="2" class="item-desc-inner" meet_id="' + data.meetid + '" detail_id="' + n.id + '">' + ((n.remark !== undefined && n.remark != '') ? n.remark : '') + '</textarea>\
                                          </div>\
                                        </div>\
                                        <a href="javascript:;" meet_id="' + data.meetid + '" detail_id="' + n.id + '" class="desc-input-form-btn weui-btn weui-btn_mini weui-btn_default">确定</a>\
                                    </div>\
                                </div>\
                                <div class="item-desc item-desc-p show">\
                                  <p>' + ((n.remark !== undefined && n.remark != '') ? n.remark : '<span class="we-grey">点击输入备注信息</span>') + '</p>\
                                </div>\
                              </div>\
                            </div>\
                            ');
                            o.append($targetHtml);
                            operates((i + ((data.type && data.type == 'search') ? Page.params.sindex : Page.params.index)), $targetHtml, i, a);

                            function operates(index, o, i, a) {
                                if (data.type && data.type == 'search') {
                                    Page.params.sgallery[a] = $.photoBrowser({
                                        items: surls,
                                        initIndex: 0,
                                        onSlideChange: function(index) {},
                                        onOpen: function() {},
                                        onClose: function() {}
                                    });
                                } else {
                                    Page.params.gallery[a] = $.photoBrowser({
                                        items: urls,
                                        initIndex: 0,
                                        onSlideChange: function(index) {},
                                        onOpen: function() {},
                                        onClose: function() {}
                                    });
                                }

                                // 处理图片预览
                                o.find('img.item-img-inner').on('click', function(e) {
                                    e.stopPropagation();
                                    //(data.type && data.type == 'search') ? Page.params.sgallery[a].open(i): Page.params.gallery[a].open(i);
                                    if(data.type && data.type == 'search'){
                                        wx.previewImage({
                                            current: surls[i],
                                            urls: surls
                                        });
                                    }else{
                                        wx.previewImage({
                                            current: urls[i],
                                            urls: urls
                                        });
                                    }
                                });

                                // viewHandler.detail
                                o.find('.item-img-wrap .dl-list-img-check label > input[type=checkbox]').on("click", function(e) {
                                    e.stopPropagation();
                                    var $c = $(this),
                                        $itemWrap = $c.parents('.dl-list-item').find('.dl-list-item-wrap .dl-list-check label > input[type=checkbox]');
                                    if ($c.prop('checked') == true) {
                                        $c.attr("data-checked", true);
                                        if (Page.methods.isAllSelected($c.parents('.item-cont').find('.item-img .item-img-wrap .dl-list-img-check label > input[type=checkbox]'))) {
                                            $itemWrap.prop('checked', true);
                                        }
                                    } else {
                                        $c.attr("data-checked", false);
                                        $itemWrap.prop('checked', false);
                                    }
                                });

                                o.find('.btn-pull-edit').on('click', function(e) {
                                    e.stopPropagation();
                                    var $c = $(this),
                                        $img = $c.parent('.item-img-refer').siblings('.item-img-wrap'),
                                        $desc = $c.parent('.item-img-refer').siblings('.item-desc-wrap');
                                    if ($c.attr('data-clicked') == "false") {
                                        $c.attr('data-clicked', true);
                                        //$img.show();
                                        $desc.find('.item-desc.item-desc-input').removeClass('hide').addClass('show');
                                        $desc.find('.item-desc.item-desc-p').removeClass('show').addClass('hide');
                                    } else {
                                        $c.attr('data-clicked', false);
                                        //$img.hide();
                                        $desc.find('.item-desc.item-desc-input').removeClass('show').addClass('hide');
                                        $desc.find('.item-desc.item-desc-p').removeClass('hide').addClass('show');
                                    }
                                });

                                o.find('.item-desc-wrap .item-desc.item-desc-p').on('click', function(e){
                                    e.stopPropagation();
                                    var c = $(this), $nextC = $(this).siblings('.item-desc-input');
                                    if(c.hasClass('show')){
                                        c.removeClass('show').addClass('hide');
                                        c.siblings().removeClass('hide').addClass('show');
                                        c.siblings().find('textarea').focus();
                                    }else{
                                        c.removeClass('hide').addClass('show');
                                        c.siblings().removeClass('show').addClass('hide');
                                    }
                                });

                                o.find('.item-desc .item-desc-input-form .desc-input-form textarea').on('submit', function() {
                                    var meet_id = $(this).attr("meet_id");
                                    var detail_id = $(this).attr("detail_id");
                                    var text = $(this).val();
                                    Page.dataHandler.remark.call(self, [{
                                        'id': detail_id,
                                        'remark': text
                                    }, function() {
                                        var remarkText = (text == '') ? '<span class="we-grey">点击输入备注信息</span>' : text; 
                                        os.filter('.item-desc-p').find('p').html(remarkText);
                                        os.filter('.item-desc-input').removeClass('show').addClass('hide');
                                        os.filter('.item-desc-p').removeClass('hide').addClass('show');
                                        if(text != '')$.toast("备注成功");
                                        Page.dataHandler.getMeetingList.call(self, {
                                            userId: self.data.userId,
                                            limit: self.params.limit,
                                            offset: self.params.page,
                                            search: ''
                                        });
                                    }]);
                                });

                                o.find('.item-desc .item-desc-input-form .desc-input-form textarea').on('focus', function() {
                                    //将输入框定位到底部
                                    if (window.getSelection){
                                        var max_Len = this.value.length;
                                        this.setSelectionRange(max_Len, max_Len);
                                    }else if (document.selection){
                                        var range = this.createTextRange();
                                        range.collapse(false);
                                        range.select();
                                    }
                                    $(this).scrollTop($(this)[0].scrollHeight);
                                    $(this).parents('.item-desc-input-form') && $(this).parents('.item-desc-input-form').scrollIntoView(false);
                                    window.addEventListener('touchmove', function(evt) {
                                        evt.preventDefault();
                                    });
                                });

                                o.find('.item-desc .item-desc-input-form .desc-input-form textarea').keyup(function(evt) {
                                    if (evt.keyCode == '13') {
                                        var meet_id = $(this).attr("meet_id");
                                        var detail_id = $(this).attr("detail_id");
                                        var text = $(this).val();
                                        Page.dataHandler.remark.call(self, [{
                                            'id': detail_id,
                                            'remark': text
                                        }, function() {
                                            var remarkText = (text == '') ? '<span class="we-grey">点击输入备注信息</span>' : text; 
                                            os.filter('.item-desc-p').find('p').html(remarkText);
                                            os.filter('.item-desc-input').removeClass('show').addClass('hide');
                                            os.filter('.item-desc-p').removeClass('hide').addClass('show');
                                            $.toast("备注成功");
                                        }]);
                                    }
                                });

                                o.find('.item-desc .item-desc-input-form .desc-input-form-btn').on("click", function(e) {
                                    e.stopPropagation();
                                    var $c = $(this);
                                    var meet_id = $c.attr("meet_id");
                                    var detail_id = $c.attr("detail_id");
                                    var text = $c.siblings('.desc-input-form').find('textarea').val();
                                    Page.dataHandler.remark.call(self, [{
                                        'id': detail_id,
                                        'remark': text
                                    }, function() {
                                        var remarkText = (text == '') ? '<span class="we-grey">点击输入备注信息</span>' : text; 
                                        $c.parents('.item-desc-input').removeClass('show').addClass('hide');
                                        $c.parents('.item-desc-input').siblings('.item-desc-p').find('p').html(remarkText);
                                        $c.parents('.item-desc-input').siblings('.item-desc-p').removeClass('hide').addClass('show');
                                        $.toast("备注成功");
                                    }]);
                                });

                                o.find('.icon-img-edit').on("click", function(e) {
                                    e.stopPropagation();
                                    var c = $(this);
                                    var meet_id = c.parents(".dl-list-item").attr("meet_id");
                                    var detail_id = c.attr("detail_id");
                                    var $detail = c.parents(".item-img");
                                    var $desc = $detail.siblings(".item-desc").eq(0);
                                    $.confirm("确定删除该图片？", "温馨提示", function() {
                                        Page.dataHandler.delMeetingDetail.call(self, [{
                                            'ids': detail_id
                                        }, function() {
                                            $detail.remove();
                                            $desc.remove();
                                            $.toast("图片删除成功");
                                        }]);
                                    }, function() {});
                                });
                            }
                        });
                        
                        if(dStatus == true){
                            o.find('input.dl-check-boxs').prop("checked", true);
                        }

                        // 异步加载图片
                        var imgs = document.querySelectorAll('.item-img-refer .item-img-refer-inner img.item-img-inner');
                        for (var i = 0; i < imgs.length; i++) {
                            var url = imgs[i].dataset.src;
                            util.loadImage(imgs[i], url, function($o) {
                                $o.nextElementSibling.style.display = 'none';
                                $o.src = this.src;
                            });
                        }
                    }
                }
            }
        },
        dataHandler: {
            getMeetingList: function(data) {
                var self = this;
                var $domList = (data.type && data.type == 'search') ? self.selector.$searchList : self.selector.$houseList;
                $domList.find('.dl-list-loading.loading_bottom').show();
                $domList.find('.dl-list-loading.loading_bottom .refresh').show();
                setTimeout(function() {
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshot/meetings',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            user_id: Page.data.userId,
                            org_id: -1,
                            token: Page.data.access_token
                        },
                        dataType: "json",
                        data: data,
                        success: function(res) {
                            $domList.find('.dl-list-loading.loading_bottom').hide();
                            $domList.find('.dl-list-loading.loading_bottom .refresh').hide();
                            if (res.code == 0) {
                                var json = res.data.rows;
                                var page = Math.ceil(res.data.total / self.params.limit);
                                if (page == 0) {
                                    if (json.length == 0) {
                                        //$('#search-list .house-search-empty').show();
                                    } else {
                                        //$('#search-list .house-search-empty').hide();
                                    }
                                    self.data.rows = json;
                                } else {}
                                // page = 0 需要清除文档初始内容
                                if (self.params.page == 0 || ((data.type == 'search') ? self.params.spage == 0 : false)) {
                                    $domList.find('.dl-list-item').remove();
                                }

                                if (json.length > 0) {
                                    $domList.find('.dl-list-loading.loading_bottom').hide();
                                    $.each(json, function(i, n) {
                                        self.data.rows.push(n);
                                        var $item = $(self.viewHandler.list.call(self, n));
                                        $domList.find('.house-list-inner-result .dl-list-data').append($($item));
                                        $($item).find('.weui-cell_swiped').swipeout();
                                    });
                                    if (data.type && data.type == 'search') {
                                        self.params.sindex = self.params.sindex + json.length;
                                    } else {
                                        self.params.index = self.params.index + json.length;
                                    }

                                    // 处理图片预览
                                    /*$.each($domList.find(".dl-list-item"), function(i, n) {
                                        var index = $domList.find(".dl-list-item").index($(n));
                                        $(n).find('img.item-img-inner').on("click", function(e) {
                                            e.stopPropagation();
                                            var oIndex = $(n).find('img.item-img-inner').index($(this));
                                            (data.type && data.type == 'search') ? self.params.sgallery[index].open(oIndex) : self.params.gallery[index].open(oIndex);
                                        });
                                    });*/

                                    if (json.length < self.params.limit && json.length > 0) {
                                        $domList.find('.dl-list-loading.loading_bottom').show();
                                        $domList.find('.dl-list-loading.loading_bottom').find('p').show();
                                    }
                                } else if (json.length == 0 && self.params.page != 0) {
                                    $domList.find('.dl-list-loading.loading_bottom').show();
                                    $domList.find('.dl-list-loading.loading_bottom').find('p').show();
                                } else {
                                    $domList.find('.dl-list-loading.loading_bottom').show();
                                    $domList.find('.dl-list-loading.loading_bottom').find('p').show();
                                }

                                (data.type && data.type == 'search') ? (self.params.spage = 0) : (self.params.page += Page.params.limit);

                                if (json.length == self.params.limit) {
                                    self.params.goon = true;
                                } else {
                                    self.params.goon = false;
                                    return;
                                }
                            } else {
                                self.params.goon = false;
                                $.toast(res.msg, 'cancel');
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel');
                            $domList.find('.dl-list-loading.loading_bottom').hide();
                            $domList.find('.dl-list-loading.loading_bottom .refresh').hide();
                        }
                    });
                }, 1000);
            },
            getScreenshotList: function(o, index, data, status) {
                var self = this;
                $.ajax({
                    url: util.config.apiurl + '/api/user/screenshots',
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        user_id: Page.data.userId,
                        org_id: -1,
                        token: Page.data.access_token
                    },
                    dataType: "json",
                    data: data,
                    success: function(res) {
                        if (res.code == 0) {
                            if (data.offset <= data.limit) {
                                o.find('>').remove();
                            }
                            self.viewHandler.detail.call(self, o, res.data.rows, index, {
                                'meetid': data.id
                            }, status);
                        } else {
                            $.toast(res.msg, 'cancel');
                        }
                    },
                    error: function() {
                        $.toast('网络错误，请重试', 'cancel');
                    }
                });
            },
            applyShare: function(data) {
                $.ajax({
                    url: util.config.apiurl + '/api/user/screenshots/share', //http://boardat.delicloud.com/api/meeting/share
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        user_id: Page.data.userId,
                        org_id: -1,
                        token: Page.data.access_token
                    },
                    dataType: "json",
                    data: data,
                    success: function(res) {
                        if (res.code == 0) {
                            var id = res.data;
                            setTimeout(function() {
                                //跳转
                                window.location.href = util.config.domain + "/detail.html?id=" + id;
                            }, 2000);
                        } else {
                            $.toast(res.msg, 'cancel');
                        };
                    },
                    error: function() {
                        $.toast('网络错误，请重试', 'cancel');
                    }
                });
            },
            remark: function(params) {
                var data = params[0],
                    callback = params[1],
                    self = this;
                if(data.remark.length <= 1000){
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshot/remark',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            user_id: Page.data.userId,
                            org_id: -1,
                            token: Page.data.access_token
                        },
                        dataType: "json",
                        data: data,
                        success: function(res) {
                            if (res.code == 0) {
                                callback.call(self);
                            } else {
                                $.toast(res.msg, 'cancel');
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel');
                        }
                    });
                }else{
                    $.toast('请正确输入备注', 'cancel');
                }
            },
            delMeeting: function(params) {
                var data = params[0],
                    callback = params[1],
                    self = this;
                $.ajax({
                    url: util.config.apiurl + '/api/user/meeting/screenshots/delete',
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        user_id: Page.data.userId,
                        org_id: -1,
                        token: Page.data.access_token
                    },
                    dataType: "json",
                    data: data,
                    success: function(res) {
                        if (res.code == 0) {
                            if (typeof callback == "function") {
                                callback.call(self);
                            }
                        } else {
                            $.toast(res.msg, 'cancel');
                        };
                    },
                    error: function() {
                        $.toast('网络错误，请重试', 'cancel');
                    }
                });
            },
            delMeetingDetail: function(params) {
                var data = params[0],
                    callback = params[1],
                    self = this;
                $.ajax({
                    url: util.config.apiurl + '/api/user/screenshots/delete',
                    type: "POST",
                    timeout: 1e3,
                    headers: {
                        user_id: Page.data.userId,
                        org_id: -1,
                        token: Page.data.access_token
                    },
                    dataType: "json",
                    data: data,
                    success: function(res) {
                        if (res.code == 0) {
                            if (typeof callback == "function") {
                                callback.call(self);
                            }
                        } else {
                            $.toast(res.msg, 'cancel');
                        };
                    },
                    error: function() {
                        $.toast('网络错误，请重试', 'cancel');
                    }
                });
            }
        },
        bindEvt: function() {
            var self = this;
            self.selector = {
                $page: $('#page'),
                $houseBox: $('#page').find('#page-list.house-outer'),
                $searchList: $('#page').find('.house-wrap-search .house-auto-search #house-search-list'), // .house-search-list-inner
                $houseList: $('#page').find('#page-list .house-index-list #house-index-list'), //.house-index-list-inner
                $houseItem: $('#page').find('#page-list .house-index-list #house-index-list .house-index-list-inner .dl-list-item'),
                $houseItemImg: $('#page').find('#page-list .house-index-list #house-index-list .house-index-list-inner .dl-list-item .dl-list-item-inner .dl-list-text .text-item .item-cont .item-img'),
                $houseSidebar: $('#page').find('.dl-sidebar'),
                $houseListLoading: $('#page').find('.house-outer .house-box .dl-scroll .loading_bottom')
            };

            // viewHandler.list 
            self.selector.$page.on("click", ".dl-list-item .dl-list-item-wrap .dl-list-check label > input[type=checkbox]", function(e) {
                e.stopPropagation();
                var $c = $(this),
                    $cListtem = $c.parents('.dl-list-item'),
                    $dropLoad = $cListtem.find('.dl-list-item-wrap .dl-list-btn'),
                    meetId = $cListtem.attr('meet_id'),
                    $detailHtml = $cListtem.find('.dl-list-item-inner .dl-list-text .text-item .item-cont'),
                    wrapIndex = $cListtem.index(); //新增上级元素索引
                if($dropLoad.attr('data-load') == 'loading'){
                    $dropLoad.attr('data-load', 'loaded');
                    self.dataHandler.getScreenshotList.call(self, $detailHtml, wrapIndex, {
                        meetId: meetId,
                        limit: self.params.limit,
                        offset: 0 //self.params.page 
                    }, 'loaded');
                }
                var $itemListInput = $cListtem.find('.dl-list-item-inner .dl-list-text .text-item .item-cont .item-img').find('label > input[type=checkbox]'),
                    status = ($c.prop('checked') == true);
                var chgStatus = (status ? true : false);
                $c.attr("data-checked", chgStatus);
                $c.prop("checked", chgStatus);
                $itemListInput.attr("data-checked", chgStatus);
                $itemListInput.prop("checked", chgStatus);
            });

            self.selector.$page.on("click", ".dl-list-item-wrap .dl-list-btn a", function(e) {
                e.stopPropagation();
                var c = $(this),
                    $dropLoad = c.parent('.dl-list-btn'),
                    meetId = c.parents('.dl-list-item').attr('meet_id'),
                    $detailHtml = c.parents('.dl-list-item').find('.dl-list-item-inner .dl-list-text .text-item .item-cont'),
                    wrapIndex = c.parents('.dl-list-item').index(); //新增上级元素索引
                if ($dropLoad.attr('data-load') == 'loading') {
                    $dropLoad.attr('data-load', 'loaded');
                    self.dataHandler.getScreenshotList.call(self, $detailHtml, wrapIndex, {
                        meetId: meetId,
                        limit: self.params.limit,
                        offset: 0 //self.params.page 
                    });
                }
                if (c.hasClass('icon-top')) {
                    c.parents('.dl-list-item-wrap').siblings(".dl-list-item-inner").hide();
                    c.removeClass('icon-top').addClass('icon-down');
                } else {
                    c.parents('.dl-list-item-wrap').siblings(".dl-list-item-inner").show();
                    c.removeClass('icon-down').addClass('icon-top');
                }
            });

            self.selector.$page.on("click", ".btn-pull-share", function(e) {
                e.stopPropagation();
                var meet_id = $(this).parents(".dl-list-item").attr("meet_id");
                console.log("meet_id", meet_id);
                $.confirm("确定分享该条会议记录？", "分享", function() {
                    self.dataHandler.applyShare({
                        'ids': '',
                        'meetingIds': meet_id
                    });
                }, function() {});
            });

            self.selector.$page.on("click", ".btn-pull-delete", function(e) {
                e.stopPropagation();
                var meet_id = $(this).parents(".dl-list-item").attr("meet_id");
                var $row = $(this).parents(".dl-list-item");
                $.confirm("确定删除该条会议记录？", "删除", function() {
                    
                    self.dataHandler.delMeeting.call(self, [{
                        userId: self.data.userId,
                        meetId: meet_id
                    }, function() {
                        $row.remove();
                        $.toast("会议已经删除!");
                    }]);
                }, function() {});
            });

            // share
            self.selector.$page.on("click", "#dl-share", function(e) {
                e.stopPropagation();
                var shareList = self.methods.getShareList.call(self, $('.house-list-inner-result .dl-list-data .dl-list-item'));
                //console.log("shareList1", shareList);
                if ((shareList.ids.length > 0) || (shareList.meetingIds.length > 0)) {
                    $.confirm("确定要分享已选中的会议和图片", "温馨提示", function() {
                        self.dataHandler.applyShare(shareList);
                    }, function() {});
                } else {
                    $.confirm("请选择要分享的会议和图片", "温馨提示", function() {}, function() {});
                    return false;
                }
                return false;
            });

            // back to top
            self.methods.backToTop();

            // searchRow
            self.methods.searchRow($('#searchInput'), $('#searchResult'));
        }
    };

    Page.init();
});