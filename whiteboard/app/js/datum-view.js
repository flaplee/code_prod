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
                limit: 28,
                offset: 0,
                goon: false,
                gallery: []
            },
            data: {
                datumId: util.getQuery('meet_id') || -1,
                datumName: util.getQuery('meet_name') || -1,
                datumForm: util.getQuery('meet_from') || -1,
                datumIndex: util.getQuery('imgs_index'),
                viewsIndex: util.getQuery('views_index'),
                shareId: '',
                access_token: util.getCookie('access_token')
            },
            bindEvt: function() {
                var self = this,
                    views;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $oDatumImg = $header.find('.item-img-refer .item-img-zoom .item-img-inner'),
                    $oDatum = $page.find('.content .boardat-datum-view'),
                    $oDatumWrap = $oDatum.find('.item-desc-wrap'),
                    $oDatumForm = $oDatumWrap.find('.item-desc-input-form'),
                    $navMenu = $page.find('.navMenu'),
                    $navShare = $navMenu.find('.nav-share'),
                    $navDelete = $navMenu.find('.nav-delete');
                //放开后安卓原生复制粘贴被屏蔽
                /*var pageCtn = document.querySelector('#page .content .boardat-datum-view'),
                    PageTextarea = document.querySelector('#page .content textarea.item-desc-inner.item-desc-inner'),
                    PageContent = document.querySelector('#page .content .boardat-datum-view .item-desc-wrap');
                util.changeScroll(true);
                util.fixIosScrolling(PageTextarea);
                util.fixIosScrolling(PageContent);*/
                deli.common.navigation.setRight({
                    "text": ""
                }, function(data) {}, function(resp) {});

                if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                    util.localStorage.set('meetFrom', 'datumView');
                }

                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setRight({
                        "text": ""
                    }, function(data) {}, function(resp) {});
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
                //init
                Page.methods.getDatum($oDatum, $oDatumImg);

                $oDatumForm.find('.desc-input-form-btn').on('click', function() {
                    var text = $oDatumForm.find('textarea.item-desc-inner').val();
                    if (text.length <= 1000) {
                        Page.methods.remarkDatum({
                            "id": Page.data.datumId,
                            "remark": text
                        }, $oDatumWrap);
                    } else {
                        $.toast('备注信息请控制在1000字内', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                    }
                });

                $oDatumForm.find('textarea.item-desc-inner').on('focus mousedown', function() {
                    //将输入框定位到底部
                    if (window.getSelection){
                        var max_Len = this.value.length;
                        this.setSelectionRange(max_Len, max_Len);
                    }else if (document.selection){
                        var range = this.createTextRange();
                        range.collapse(false);
                        range.select();
                    }
                    $(this).addClass('focus-grey');
                    $(this).scrollTop($(this)[0].scrollHeight);
                    //$(this).parents('.item-desc-input-form') && $(this).parents('.item-desc-input-form').scrollIntoView(false);
                    /*window.addEventListener('touchmove', function(evt) {
                        evt.preventDefault()
                    });*/
                });

                $navShare.on('click', function(e) {
                    e.stopPropagation();
                    $.confirm("确定要分享该资料？", "", function() {
                        self.methods.shareDatum({
                            "id": Page.data.datumId
                        });
                    }, function() {});
                });

                $navDelete.on('click', function(e) {
                    e.stopPropagation();
                    $.confirm("确定要删除该资料？", "", function() {
                        self.methods.deleteDatum({
                            "id": Page.data.datumId
                        });
                    }, function() {});
                });

                // get viewImgs
                views = (typeof util.localStorage.get('viewImgs') == 'object') ? util.localStorage.get('viewImgs') : JSON.parse(util.localStorage.get('viewImgs'));
                console.log("views", views);
                $oDatumImg.on("click", function(e) {
                    e.stopPropagation();
                    deli.common.image.preview({
                        "current": Page.data.viewsIndex,
                        "urls": views[Page.data.datumIndex]
                    }, function(data) {}, function(resp) {});
                });

                $oDatumWrap.find('.item-desc.item-desc-p p').on('click', function(e){
                    e.stopPropagation();
                    var c = $(this).parent('.item-desc-p'), $nextC = c.siblings('.item-desc-input');
                    if(c.hasClass('show')){
                        c.removeClass('show').addClass('hide');
                        $nextC.removeClass('hide').addClass('show');
                        $nextC.find('textarea.item-desc-inner').focus();
                    }else{
                        c.removeClass('hide').addClass('show');
                        $nextC.removeClass('show').addClass('hide');
                    }
                });

                //util.delCookie('viewImgs');

                if(deli.android){
                    //获取原始窗口的高度
                    var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    var contentHeight = document.getElementsByClassName('item-img-refer')[0].clientHeight + document.getElementsByClassName('item-desc-input-form')[0].clientHeight;
                    window.addEventListener('resize', function () {
                        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                            window.setTimeout(function () {
                                document.activeElement.scrollIntoViewIfNeeded();
                            }, 400);
                        }
                        var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
                        if(resizeHeight < originalHeight){
                            $navMenu.hide();
                            $oDatum.scrollTop(resizeHeight - contentHeight);
                        }else{
                            $navMenu.show();
                            $oDatum.scrollTop(0);
                        }
                    });
                }
            },
            methods: {
                getDatum: function(o, oimg) {
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshot/query',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: {
                            'id': Page.data.datumId
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                var json = res.data;
                                Page.data.shareId = json.id;
                                //oimg.attr('src', json.img_url);
                                var imgs = document.querySelectorAll('img');
                                util.loadImage(imgs[0], json.img_url, function($o) {
                                    $o.parentNode.nextElementSibling.style.display = 'none';
                                    $o.src = this.src;
                                });
                                
                                o.find('.item-desc-input-form textarea.item-desc-inner').attr('data-meet_id', json.meet_id).attr('data-detail_id', json.id).val(((json.remark) ? json.remark : ''));
                                o.find('.item-desc-input-form a.desc-input-form-btn').attr('data-meet_id', json.meet_id).attr('data-detail_id', json.id);
                                o.find('.item-desc-wrap .item-desc-p p').html(((json.remark !== undefined && json.remark != '') ? json.remark : '<span class="we-grey">点击输入备注信息</span>'));
                                setTimeout(function() {
                                    deli.common.navigation.setTitle({
                                        "title": util.formatDate(parseInt(JSON.parse(json.update_time)), false, true)
                                    }, function(data) {}, function(resp) {});
                                }, 0);
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
                remarkDatum: function(data, o) {
                    // update 20180322 会议截图备注
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshot/remark',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data,
                        success: function(res) {
                            if (res.code == 0) {
                                var remarkText = (res.data.remark == '') ? '<span class="we-grey">点击输入备注信息</span>' :res.data.remark; 
                                o.find('.item-desc-p').find('p').html(remarkText);
                                o.find('.item-desc-input').removeClass('show').addClass('hide');
                                o.find('.item-desc-p').removeClass('hide').addClass('show');
                                if(res.data.remark != '')$.toast('备注信息修改成功', 'success', {'duration':1500,'newname':'weui-toast_modify'});
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        }
                    });
                },
                shareDatum: function(data) {
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshots/share',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: {
                            'ids': data.id,
                            'meetingIds': ''
                        },
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
                deleteDatum: function(data) {
                    // update 20180322 删除截图资料
                    $.ajax({
                        url: util.config.apiurl + '/api/user/screenshots/delete',
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: {
                            'ids': data.id
                        },
                        success: function(res) {
                            if (res.code == 0) {
                                $.toast('资料删除成功', 'seccess', {'duration':1500,'newname':'weui-toast_modify_small'});
                                history.go(-1);
                                /*switch(Page.data.datumForm){
                                    case 'index':
                                        location.href = util.config.domain + '/index.html?meet_id='+ Page.data.datumId +'&meet_name=' + Page.data.datumName + '&meet_name=index';
                                        break;
                                    case 'datum':
                                        location.href = util.config.domain + '/datum.html?meet_id='+ Page.data.datumId +'&meet_name=' + Page.data.datumName + '&meet_from=datum';
                                        break;
                                    case 'search':
                                        location.href = util.config.domain + '/search.html?meet_id='+ Page.data.datumId +'&meet_name=' + Page.data.datumName + '&meet_from=search';
                                        break;
                                    default:;
                                }*/
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