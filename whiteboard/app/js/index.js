seajs.config({
    base: './',
    alias: {
        util: 'js/util.js',
        svgicons: 'js/src/svgicons',
        sockjs: 'js/src/sockjs.js',
        stomp: 'js/src/stomp.js'
    }
});
seajs.use(['util', 'svgicons', 'sockjs', 'stomp'], function(util, svgicons, sockjs, stomp) {
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
                goon: true,
                index: 0
            },
            data: {
                userId: util.getCookie('userId') || '',
                orgId: util.getCookie('orgId') || '',
                meetId: util.getQuery('meet_id') || '',
                meetFrom: util.getQuery('meet_from') || '',
                isMeeting: false,
                meetName: '',
                access_token: util.getCookie('access_token') || '',
                meet_live: util.getCookie('meet_live') || '',
                viewImgs: {},
                socketIndex: 0
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $header = $page.find('.header'),
                    $headerTitle = $header.find('.title'),
                    $headerBack = $header.find('.back'),
                    $leftMenuBtn = $header.find('.leftMenuBtn'),
                    $rightMenuBtn = $header.find('.rightMenuBtn'),
                    $contentIndex = $page.find('.content .boardat-index'),
                    $boardatWrap = $contentIndex.find('.boardat-index-wrap'),
                    $wrapTop = $boardatWrap.find('.wrap-top'),
                    $wrapLive = $boardatWrap.find('.wrap-live'),
                    $wrapLiveEmpty = $boardatWrap.find('.live-empty'),
                    $wrapLiveArticle = $boardatWrap.find('article.live-article'),
                    $wrapLiveImg = $wrapLiveArticle.find('section .live-img'),
                    $boardatDatum = $contentIndex.find('.boardat-index-datum'),
                    $boardatFolder = $contentIndex.find('.boardat-index-folder'),
                    $datumTarget = $boardatDatum.find('.boardat-index-title'),
                    $folderTarget = $boardatFolder.find('.boardat-index-title'),
                    $datumTotal = $datumTarget.find('.title-next span'),
                    $folderTotal = $folderTarget.find('.title-next span'),
                    $datumList = $contentIndex.find('.datum-index-list-inner'),
                    $folderList = $contentIndex.find('.folder-index-list-inner'),
                    $navMenu = $page.find('.navMenu'),
                    $navMeeting = $navMenu.find('.nav-meeting'),
                    $navAdd = $navMenu.find('.nav-add'),
                    $navAt = $navMenu.find('.nav-at'),
                    $navCompere = $navMenu.find('.nav-compere');
                var pageCtn = document.querySelector('#page .content #boardat-index-list');
                Page.methods.menuAddOrAt(((util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1') ? 1 : 0), $navAdd);
                // 初始化 socket
                Page.methods.initSocket();

                //ppt 水平方向切换动画
                bespoke.from('article', {
                    fx: {
                        direction: "horizontal",
                        transition: "room",
                        reverse: false
                    }
                });

                // 初始化扫码结果
                var qrCodeIndex = function(data, callback){
                    if (data && data.qrcode && data.qrcode != '') {
                        $.ajax({
                            url: util.config.apiurl + "/api/meeting/join/qrcode",
                            type: "POST",
                            timeout: 1e3,
                            headers: {
                                'token': data.token
                            },
                            dataType: "json",
                            data: {
                                qrcode: data.qrcode
                            },
                            success: function(data) {
                                if(typeof callback === 'function'){
                                    callback();
                                }
                            }
                        });
                    }
                };

                // 离开会议处理
                var indexLeaveMeet = function(type) {
                    if(Page.data.meetId != ''){
                        $.ajax({
                            url: util.config.apiurl + "/api/meeting/leave",
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
                                    Page.data.isMeeting = false;
                                    Page.data.meetId = "";
                                    if (type && type == 'app') {
                                        deli.common.notification.toast({
                                            "text": "已退出会议",
                                            "duration": 1.5
                                        }, function(data) {}, function(resp) {});
                                    } else {
                                        $boardatWrap.hide();
                                        Page.methods.menuAddOrAt(0, $navAdd);
                                        Page.methods.setTargetUrl($navCompere, {
                                            'isMeetingAt': false,
                                            'meetId': Page.data.meetId
                                        });
                                        deli.common.notification.toast({
                                            "text": "已退出会议",
                                            "duration": 1.5
                                        }, function(data) {}, function(resp) {});
                                    }
                                    deli.common.screen.breakAwake();
                                    util.localStorage.remove('meetingStatus');
                                    util.localStorage.remove('meetFrom');
                                } else {
                                    $.toast(data.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                };
                            }
                        });
                    }
                };

                // 实例化会议socket
                var initSocketIndex = function() {
                    Page.data.socketIndex = 0;
                    boardatClient.init(Page.data.userId, {
                        callbacks: {
                            meetingEnd: function(data) {
                                Page.data.isMeeting = false;
                                Page.data.joinId = "";
                                Page.data.meetId = "";
                                $boardatWrap.hide();
                                Page.methods.menuAddOrAt(0, $navAdd);
                                Page.methods.setTargetUrl($navCompere, {
                                    'isMeetingAt': false,
                                    'meetId': Page.data.meetId
                                });
                            },
                            showMeeting: function(meeting) {
                                Page.data.meetId = meeting.id;
                                if (meeting.ppt_on_going) {
                                    deli.common.screen.keepAwake();
                                    //ppt直播开始
                                    Page.data.isMeeting = true;
                                    $boardatWrap.removeClass('meet-live');
                                    $wrapTop.find('a#play').hide();
                                    $wrapTop.find('a#stop').show();
                                    $wrapLive.show();
                                    $wrapLiveArticle.show();
                                    $wrapLiveEmpty.hide();
                                    $wrapLiveEmpty.find('.empty-text').css({
                                        'display': 'none'
                                    }).filter('.meeting-ongoing').css({
                                        'display': 'table-cell'
                                    });
                                } else if(meeting.board_on_going){
                                    deli.common.screen.keepAwake();
                                    //白板直播开始
                                    Page.data.isMeeting = true;
                                    $boardatWrap.removeClass('meet-live');
                                    $wrapTop.find('a#play').hide();
                                    $wrapTop.find('a#stop').show();
                                    $wrapLive.show();
                                    $wrapLiveArticle.show();
                                    $wrapLiveEmpty.hide();
                                    $wrapLiveEmpty.find('.empty-text').css({
                                        'display': 'none'
                                    }).filter('.meeting-ongoing').css({
                                        'display': 'table-cell'
                                    });
                                }else{
                                    deli.common.screen.breakAwake();
                                    if (meeting.on_going) {
                                        Page.data.isMeeting = false;
                                        $boardatWrap.addClass('meet-live');
                                        $wrapTop.find('a#play').show();
                                        $wrapTop.find('a#stop').hide();
                                        $wrapLive.hide();
                                        $wrapLiveArticle.hide();
                                        $wrapLiveEmpty.show();
                                        $wrapLiveEmpty.find('.empty-text').css({
                                            'display': 'none'
                                        }).filter('.ppt-ongoing').css({
                                            'display': 'table-cell'
                                        });
                                    }
                                }
                                if (meeting.end_time != -1) {
                                    $boardatWrap.hide();
                                    Page.methods.menuAddOrAt(0, $navAdd);
                                    deli.common.screen.breakAwake();
                                    util.localStorage.remove('meetingStatus');
                                    util.localStorage.remove('meetFrom');
                                    deli.common.notification.toast({
                                        "text": "当前会议已结束",
                                        "duration": 1.5
                                    }, function(data) {}, function(resp) {});
                                }else{
                                    if(Page.data.meetId != ''){
                                        $boardatWrap.show();
                                        $wrapTop.find('p.title span').text(meeting.meet_name);
                                        Page.methods.menuAddOrAt(1, $navAdd);
                                    }else{
                                        $boardatWrap.hide();
                                        Page.methods.menuAddOrAt(0, $navAdd);
                                        deli.common.screen.breakAwake();
                                        util.localStorage.remove('meetingStatus');
                                        util.localStorage.remove('meetFrom');
                                    }
                                }
                                Page.methods.setTargetUrl($navCompere, {
                                    'isMeetingAt': true,
                                    'meetId': Page.data.meetId
                                });
                            },
                            showPicture: function(data) {
                                var $targetHtml = $('<section data-bespoke-fx-transition="room" data-bespoke-fx-direction="horizontal" data-bespoke-fx-reverse="false"><img class="live-img" src="'+ data.img_url +'" width="100%" height="180" /></section>');
                                if($wrapLiveArticle.hasClass('live-article-loading')){
                                    $wrapLiveArticle.removeClass('live-article-loading');
                                    $wrapLiveArticle.find('img').attr("src", data.img_url);
                                }else{
                                    if($wrapLiveArticle.find('section').length > 1){
                                        $wrapLiveArticle.find('section').eq(0).remove();
                                        $wrapLiveArticle.append($targetHtml);
                                    }else if($wrapLiveArticle.find('section').length == 1){
                                        $wrapLiveArticle.append($targetHtml);
                                    }
                                    //ppt 水平方向切换动画
                                    bespoke.from('article', {
                                        fx: {
                                            direction: "horizontal",
                                            transition: "room",
                                            reverse: false
                                        }
                                    });
                                    if(!Page.data.socketIndex == 0){
                                        bespoke.next();
                                    }
                                }
                                Page.data.socketIndex ++;
                            },
                            drawPicture: function(data){
                                //白板内容绘画
                                if(data.img_url){
                                    console.log("draw image", data.img_url);
                                    loadImage(data.img_url+'?x-oss-process=image/resize,w_300', function(img) {
                                        image(img, 0, 0, parseInt(displayWidth), parseInt((new Number(212 / 667 * displayHeight)).toFixed(2)));
                                        if(data.white_board_lives){
                                            var p1, p2, pid;
                                            // 绘画
                                            for(var i = 0; i < data.white_board_lives.length; i++){
                                                //4种画布显示情况
                                                var dev_w, dev_h, draw_w, draw_h, scale = 1, id, colors, touch = 0, draw_x = 0, draw_y = 0, point_x = 0, point_y = 0, point_dev_scale = 1, point_draw_scale = 1;
                                                if(data.white_board_lives[i].len_unit == 0){
                                                    dev_w = parseInt(data.white_board_lives[i].dev_width),
                                                    dev_h = parseInt(data.white_board_lives[i].dev_height),
                                                    draw_w = parseInt(displayWidth),
                                                    draw_h = parseInt((new Number(212 / 667 * displayHeight)).toFixed(2));
                                                }else{
                                                    scale = util.getDPI()[0] / 25.4 / 2;
                                                    dev_w = parseInt((new Number(data.white_board_lives[i].dev_width * scale)).toFixed(2)),
                                                    dev_h = parseInt((new Number(data.white_board_lives[i].dev_height * scale)).toFixed(2)),
                                                    draw_w = parseInt(displayWidth),
                                                    draw_h = parseInt(Math.floor(212 / 667 * displayHeight));
                                                    console.log("scale", scale);
                                                    console.log("dev_w", dev_w);
                                                    console.log("dev_h", dev_h);
                                                    console.log("draw_w", draw_w);
                                                    console.log("draw_h", draw_h);
                                                }
                                                point_dev_scale = dev_w / dev_w, point_draw_scale = draw_w / draw_h;
                                                if(draw_w > dev_w && draw_h > dev_h){
                                                    //坐标原点
                                                    point_x = (new Number((draw_w - dev_w) / 2 / scale)).toFixed(2);
                                                    point_y = (new Number((draw_h - dev_h) / 2 / scale)).toFixed(2);
                                                    console.log("test1");
                                                }else if(draw_w > dev_w && draw_h < dev_h){
                                                    //坐标原点
                                                    point_x = 0;
                                                    point_y = (new Number((dev_h - draw_h) / 2 / scale)).toFixed(2);
                                                    console.log("test2");
                                                }else if(draw_w < dev_w && draw_h > dev_h){
                                                    //坐标原点
                                                    point_x = (new Number((dev_w - draw_w) / 2 / scale)).toFixed(2);
                                                    point_y = 0;
                                                    console.log("test3");
                                                }else if(draw_w < dev_w && draw_h < dev_h){
                                                    console.log("test4");
                                                    if(draw_w > draw_h){
                                                        //坐标原点
                                                        point_x =  parseInt((new Number(((draw_w - point_dev_scale * draw_h) / 2)).toFixed(2)));
                                                        point_y = 0;
                                                        console.log("point_x", point_x)
                                                    }else if(draw_w < draw_h){
                                                        //坐标原点
                                                        point_x = 0;
                                                        point_y =  parseInt((new Number(((draw_h - draw_w / point_dev_scale) / 2)).toFixed(2)));
                                                        console.log("point_y", point_y)
                                                    }
                                                }

                                                if(data.white_board_lives[i].frames[0].length >= 1){
                                                    for(var j = 0; j < data.white_board_lives[i].frames[0].length; j++){
                                                        fill(0, 0, 255);
                                                        strokeWeight(data.white_board_lives[i].frames[0][j].pt.w / scale);
                                                        // 触摸点类型
                                                        switch(data.white_board_lives[i].frames[0][j].t){
                                                            case 0: //指针(触摸点)
                                                                stroke(51);
                                                                colors = data.white_board_lives[i].frames[0][j].pt.c; //stroke(51); 设置画笔颜色
                                                                switch(colors){
                                                                  case 0:
                                                                    stroke(51);
                                                                    break;
                                                                  case 1:
                                                                    stroke(255, 0, 0);
                                                                    break;
                                                                  case 2:
                                                                    stroke(0, 255, 0);
                                                                    break;
                                                                  case 3:
                                                                    stroke(0, 0, 255);
                                                                    break;
                                                                  default:
                                                                    stroke(0, 0, 0);
                                                                }
                                                                // 区分画线和画点
                                                                id = data.white_board_lives[i].frames[0][j].pt.id;
                                                                touch = data.white_board_lives[i].frames[0][j].pt.s; // 0抬起 1 按下 2移动
                                                                if(id != pid){
                                                                    switch(touch) {
                                                                        case 0: //第一个点不处理抬起
                                                                            break;
                                                                        case 1: 
                                                                            p1 = point_x;
                                                                            p2 = point_y;
                                                                            draw_x = point_x;
                                                                            draw_y = point_y;
                                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点的id
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            break;
                                                                        case 2: 
                                                                            p1 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            p2 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y))).toFixed(2);
                                                                            draw_x = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            draw_y = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y))).toFixed(2);
                                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            break;
                                                                        }
                                                                }else{
                                                                    switch (touch) {
                                                                        case 0:
                                                                            pid = 0;//新的数据移除pid
                                                                            break;
                                                                        case 1: 
                                                                            break;
                                                                        case 2:
                                                                            draw_x = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            draw_y = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y))).toFixed(2);
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            //更新p1, p2信息
                                                                            p1 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            p2 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y))).toFixed(2);
                                                                            break;
                                                                    }
                                                                }
                                                                console.log("Point: " + draw_x + " " + draw_y);
                                                                break;
                                                            case 1: //橡皮擦
                                                                stroke(255);
                                                                alpha(color(255, 255, 255, 0));
                                                                // 区分画线和画点
                                                                id = data.white_board_lives[i].frames[0][j].pt.id;
                                                                touch = data.white_board_lives[i].frames[0][j].pt.s; // 0抬起 1 按下 2移动
                                                                if(id != pid){
                                                                    switch(touch) {
                                                                        case 0: //第一个点不处理抬起
                                                                            break;
                                                                        case 1: 
                                                                            p1 = point_x;
                                                                            p2 = point_y;
                                                                            draw_x = point_x;
                                                                            draw_y = point_y;
                                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点的id
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            break;
                                                                        case 2: 
                                                                            draw_x = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            draw_y = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y))).toFixed(2);
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            p1 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            p2 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y))).toFixed(2);
                                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                                            break;
                                                                        }
                                                                }else{
                                                                    switch (touch) {
                                                                        case 0:
                                                                            pid = 0;//新的数据移除pid
                                                                            break;
                                                                        case 1: 
                                                                            break;
                                                                        case 2:
                                                                            draw_x = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            draw_y = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y))).toFixed(2);
                                                                            //线段的第一个点
                                                                            strokeCap(ROUND);
                                                                            strokeJoin(ROUND);
                                                                            line(p1, p2, draw_x, draw_y);
                                                                            //更新p1, p2信息
                                                                            p1 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x))).toFixed(2);
                                                                            p2 = parseInt((new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y))).toFixed(2);
                                                                            break;
                                                                    }
                                                                }
                                                                console.log("Point: " + draw_x + " " + draw_y);
                                                                break;
                                                            case 2: //手势
                                                                break;
                                                            case 3: // 快照
                                                                break;
                                                            case 4: // 清屏
                                                                stroke(255);
                                                                fill(color(255, 255, 255, 0));
                                                                rect(0, 0, displayWidth, Math.floor(212 / 667 * displayHeight));
                                                                clear();
                                                                break;
                                                            case 5:
                                                                break;
                                                            default:
                                                                stroke(255);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }else{
                                }
                            },
                            showScreenshot: function() {
                                Page.methods.initIndex();
                            }
                        }
                    });
                };

                util.changeScroll(true);
                util.fixIosScrolling(pageCtn);
                pageCtn.addEventListener('scroll', function(evt) {}, false);
                deli.common.navigation.setTitle({
                    "title": "共享白板"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "text": "",
                    "icon": "https://static.delicloud.com/h5/web/boardat/images/icon/search.png"
                }, function(data) {
                    Page.data.socketIndex = 0;
                    location.href = util.config.domain + '/search.html';
                }, function(resp) {});

                deli.app.user.get({
                    "user_id": ""
                }, function(data) {
                    if (data) {
                        Page.data.userId = data.user.id;
                        util.setCookie('userId', Page.data.userId, 7);
                        deli.app.organization.get({
                            "org_id": ""
                        }, function(odata) {
                            deli.app.session.get({
                                user_id: Page.data.userId
                            }, function(udata) {
                                $.ajax({
                                    url: util.config.apiurl + "/auth/login",
                                    type: "POST",
                                    timeout: 1e3,
                                    headers: {
                                        user_id: Page.data.userId,
                                        org_id: odata.organization.id,
                                        token: udata.token
                                    },
                                    dataType: "json",
                                    success: function(json) {
                                        if (json.code == 0) {
                                            Page.data.access_token = json.data;
                                            util.setCookie('access_token', Page.data.access_token, 7);
                                            // 初始化首页数据
                                            Page.methods.initIndex(function(){
                                                initSocketIndex();
                                            });
                                            if(udata._d_data && udata._d_from){
                                                // 初始化扫码结果
                                                qrCodeIndex({
                                                    'token': Page.data.access_token,
                                                    'qrcode': udata._d_data,
                                                    'from': udata._d_from
                                                }, function(){
                                                    initSocketIndex();
                                                });
                                            }
                                        } else {
                                            $.toast(json.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                        }
                                    },
                                    error: function() {
                                        $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                                    }
                                });
                            }, function(uresp) {
                                $.toast(uresp.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            });
                        }, function(oresp) {
                            $.toast(oresp.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                        });
                    }
                }, function(resp) {
                    $.toast(resp.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                });

                if(Page.data.meet_live && Page.data.meet_live == 'hide'){
                    deli.common.navigation.show({}, function(data) {}, function(resp) {});
                    util.setCookie('meet_live', 'show', 7);
                }
                
                if(deli.ios && (util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1')){util.localStorage.set('meetFrom', 'index');}

                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.show({}, function(data) {}, function(resp) {});
                    if(util.localStorage.get('meetFrom') == 'index'){util.localStorage.set('meetFrom', 'indexLive');}
                    if(((util.localStorage.get('meetingStatus') == '1') && (util.localStorage.get('meetFrom') == 'add' || (location.href).indexOf('index.html') > 0) && (util.localStorage.get('meetFrom') != 'indexLive'))){util.localStorage.set('meetFrom', 'index');}
                    if((util.localStorage.get('meetingStatus') == '1') && (util.localStorage.get('meetFrom') == 'indexLive')){
                        util.setLeaveMeet({token: Page.data.access_token}, function() {
                            deli.common.screen.breakAwake();
                            util.localStorage.remove('meetingStatus');
                            util.localStorage.remove('meetFrom');
                            Page.methods.initIndex(function(){
                                Page.methods.menuAddOrAt(0, $navAdd);
                                deli.common.notification.toast({
                                    "text": "已退出会议",
                                    "duration": 1.5
                                }, function(data) {}, function(resp) {});
                            });
                        });
                    }else{
                        Page.methods.initIndex();
                    }
                    
                    deli.common.navigation.setTitle({
                        "title": "共享白板"
                    }, function(data) {}, function(resp) {});

                    deli.common.navigation.setRight({
                        "text": "",
                        "icon": "https://static.delicloud.com/h5/web/boardat/images/icon/search.png"
                    }, function(data) {
                        Page.data.socketIndex = 0;
                        location.href = util.config.domain + '/search.html';
                    }, function(resp) {});
                },function(resp){});

                // 关闭
                deli.common.navigation.close({}, function(data) {
                    deli.common.screen.breakAwake();
                    util.localStorage.remove('meetingStatus');
                    util.localStorage.remove('meetFrom');
                    util.localStorage.clear();
                    util.setLeaveMeet({token: Page.data.access_token}, function() {
                        //indexLeaveMeet('app');
                        deli.common.notification.toast({
                            "text": "已退出会议",
                            "duration": 1.5
                        }, function(data) {}, function(resp) {});
                    });
                }, function(resp) {});

                self.methods.setTargetUrl($navCompere, {
                    'isMeetingAt': false,
                    'meetId': Page.data.meetId
                });

                $datumTarget.on('click', function(e){
                    e.stopPropagation();
                    Page.data.socketIndex = 0;
                });

                $folderTarget.on('click', function(e){
                    e.stopPropagation();
                    Page.data.socketIndex = 0;
                });

                $wrapTop.find('a#play').on('click', function(e) {
                    e.stopPropagation();
                    $wrapTop.find('a#play').hide();
                    $wrapTop.find('a#stop').show();
                    $wrapLive.show();
                });

                $wrapTop.find('a#stop').on('click', function(e) {
                    e.stopPropagation();
                    $wrapTop.find('a#play').show();
                    $wrapTop.find('a#stop').hide();
                    $wrapLive.hide();
                });

                $wrapTop.find('a#quit').on('click', function(e, param) {
                    e.stopPropagation();
                    $boardatWrap.hide();
                    Page.methods.menuAddOrAt(0, $navAdd);
                    indexLeaveMeet(param);
                });

                setTimeout(function(){
                    //手动画图测试
                    $.getJSON("../json/whiteBoard.json?v=1",function(data){
                        console.log("data", data);
                        $('#page').removeClass('loading');
                        $('#home-page-skeleton').removeClass('loading');
                        //白板直播开始
                        $boardatWrap.show();
                        Page.data.isMeeting = true;
                        $boardatWrap.removeClass('meet-live');
                        $wrapTop.find('a#play').hide();
                        $wrapTop.find('a#stop').show();
                        $wrapLive.show();
                        $wrapLiveArticle.show();
                        $wrapLiveEmpty.hide();
                        $wrapLiveEmpty.find('.empty-text').css({
                            'display': 'none'
                        }).filter('.meeting-ongoing').css({
                            'display': 'table-cell'
                        });
                        Page.methods.drawPicture(data);
                    });
                }, 2000);
            },
            methods: {
                getIndexList: function(data1, data2, func) {
                    //$.showLoading("加载中...");
                    var force = 0;
                    $.ajax({
                        url: data1.url,
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data1.data,
                        success: function(res) {
                            if (res.code == 0) {
                                force++;
                                var json = res.data,
                                    rows = json.rows,
                                    total = json.total;
                                data1.$os.text(total);
                                data1.$o.find('>').remove();
                                if (rows.length == 0) {
                                    data1.$o.append('<p>暂无数据</p>');
                                } else {
                                    $.each(json.rows, function(i, n) {
                                        var $itemHtml = $('<a href="' + util.config.domain + '/datum.html?meet_id=' + n.meeting_participant.meet_id + '&meet_name='+ encodeURI(n.meeting_participant.meet_name) +'" class="folder-item dl-list-item clear" data-meet_id="' + n.meeting_participant.meet_id + '">\
                                            <div class="folder-list-content">\
                                                <div class="folder-list-info">\
                                                    <img class="icon-active" src="' + ((n.last_screenshot) ? n.last_screenshot.thumbnail : '') + '">\
                                                </div>\
                                                <div class="folder-list-text">\
                                                    <p class="title dl-ft-left dl-ft-ellipsis">' + ((n.meeting_participant.meet_name) ? n.meeting_participant.meet_name : n.meeting_participant.meeting.meet_name) + '</p>\
                                                    <p class="desc dl-ft-left dl-ft-ellipsis ">' + n.total + '</p>\
                                                </div>\
                                            </div>\
                                        </a>');
                                        data1.$o.append($itemHtml);
                                    });
                                }
                                if (force == 2) {
                                    $('#page').removeClass('loading');
                                    $('#home-page-skeleton').removeClass('loading');
                                    if(func){
                                        func();
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                            //$.hideLoading();
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            //$.hideLoading();
                        }
                    });
                    $.ajax({
                        url: data2.url,
                        type: "POST",
                        timeout: 1e3,
                        headers: {
                            'token': Page.data.access_token
                        },
                        dataType: "json",
                        data: data2.data,
                        success: function(res) {
                            if (res.code == 0) {
                                force++;
                                var json = res.data,
                                    rows = json.rows,
                                    total = json.total;
                                data2.$os.text(total);
                                data2.$o.find('>').remove();
                                if (rows.length == 0) {
                                    data2.$o.append('<p>暂无数据</p>');
                                } else {
                                    if(!data2.$o.hasClass('datum-index-list-inner-padding'))data2.$o.addClass('datum-index-list-inner-padding');
                                    var urls = [],
                                        cIndex = '0';
                                    $.each(rows, function(i, n) {
                                        urls.push(n.img_url);
                                    });
                                    Page.data.viewImgs[cIndex] = urls;
                                    util.localStorage.remove('viewImgs');
                                    util.localStorage.set('viewImgs', JSON.stringify(Page.data.viewImgs));
                                    $.each(rows, function(i, n) {
                                        //<a href="javascript:;" data-meet_id="' + n.id + '"><img class="icon-active" src="' + n.thumbnail + '"></a>\
                                        var $itemHtml = $('<div class="datum-item dl-list-item clear">\
                                            <a href="javascript:;" data-meet_id="' + n.id + '">\
                                                <div>\
                                                    <div class="img_inside">\
                                                        <img class="icon-active" src="' + n.thumbnail + '">\
                                                    </div>\
                                                </div>\
                                            </a>\
                                        </div>');
                                        data2.$o.append($itemHtml);
                                        return function() {
                                            $itemHtml.find('a').on('click', function(e) {
                                                e.stopPropagation();
                                                Page.data.socketIndex = 0;
                                                var c = $(this),
                                                    imgsIndex = c.parent('.datum-item').index(),
                                                    viewsIndex = 0;
                                                location.href = util.config.domain + '/view.html?meet_id=' + n.id + '&meet_from=index&imgs_index=' + viewsIndex + '&views_index=' + imgsIndex + '';
                                            });
                                        }();
                                    });
                                }
                                if (force == 2) {
                                    $('#page').removeClass('loading');
                                    $('#home-page-skeleton').removeClass('loading');
                                    if(func){
                                        func();
                                    }
                                }
                            } else {
                                $.toast(res.msg, 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            };
                            //$.hideLoading();
                        },
                        error: function() {
                            $.toast('网络错误，请重试', 'cancel', {'duration':1500,'newname':'weui-toast_modify'});
                            //$.hideLoading();
                        }
                    });
                },
                setTargetUrl: function(o, data) {
                    o.attr('href', '' + util.config.domain + '/meeting.html?is_meeting_at=' + data.isMeetingAt + '&meet_id=' + data.meetId + '');
                    o.off('click').on('click', function(e){
                        e.stopPropagation();
                        Page.data.socketIndex = 0;
                    });
                },
                initIndex: function(callback) {
                    var $contentIndex = $('#page .content .boardat-index'),
                        $boardatDatum = $contentIndex.find('.boardat-index-datum'),
                        $boardatFolder = $contentIndex.find('.boardat-index-folder'),
                        $datumTarget = $boardatDatum.find('.boardat-index-title'),
                        $folderTarget = $boardatFolder.find('.boardat-index-title'),
                        $datumTotal = $datumTarget.find('.title-next span'),
                        $folderTotal = $folderTarget.find('.title-next span'),
                        $datumList = $contentIndex.find('.datum-index-list-inner'),
                        $folderList = $contentIndex.find('.folder-index-list-inner');
                    // update 20180322 用户参与的会议 最新截图资料 
                    Page.methods.getIndexList({
                        $o: $folderList,
                        $os: $folderTotal,
                        url: util.config.apiurl + '/api/user/screenshot/meetings',
                        data: {
                            userId: Page.data.userId,
                            offset: 0,
                            limit: 6,
                            remark: ''
                        }
                    }, {
                        $o: $datumList,
                        $os: $datumTotal,
                        url: util.config.apiurl + '/api/user/screenshots',
                        data: {
                            userId: Page.data.userId,
                            offset: 0,
                            limit: 8,
                            remark: ''
                        }
                    }, callback);
                },
                initSocket: function(callback) {
                    String.prototype.format = function(args) {
                        var result = this;
                        if (arguments.length > 0) {
                            if (arguments.length == 1 && typeof(args) == "object") {
                                for (var key in args) {
                                    if (args[key] != undefined) {
                                        var reg = new RegExp("({" + key + "})", "g");
                                        result = result.replace(reg, args[key]);
                                    }
                                }
                            } else {
                                for (var i = 0; i < arguments.length; i++) {
                                    if (arguments[i] != undefined) {
                                        var reg = new RegExp("({)" + i + "(})", "g");
                                        result = result.replace(reg, arguments[i]);
                                    }
                                }
                            }
                        }
                        return result;
                    };

                    var isArray = function(obj) {
                        return Object.prototype.toString.call(obj) === '[object Array]';
                    }

                    function connect(headers, stompClient, url, topics, connectedFunc) {
                        var socket = new SockJS(url); //1
                        stompClient = Stomp.over(socket); //
                        stompClient.connect({}, function(frame) { //3
                            console.log('开始进行连接Connected: ' + frame);
                            if (topics) {
                                if (!isArray(topics)) {
                                    topics = [topics];
                                }
                                for (var index in topics) {
                                    var topic = topics[index];
                                    stompClient.subscribe(topic.url, function(respnose) { //4
                                        topic.notifyFunc(JSON.parse(respnose.body));
                                    });
                                }
                            }
                            //定时确认服务正常
                            window.stompClient = stompClient;
                            boardatClient.client = stompClient;

                            /* window.testNet = function() {stompClient.send("/topic/test", {}, JSON.stringify({}));}*/
                            connectedFunc.call(this, true);

                            try {
                                if (stompClient.intervalId) {
                                    clearInterval(stompClient.intervalId);
                                }
                                //stompClient.intervalId = setInterval('testNet()', 1000);
                            } catch (e) {
                                console.log(e);
                            }
                        }, function(frame) {
                            if (stompClient.intervalId) {
                                clearInterval(stompClient.intervalId);
                            }
                            //连接断开触发重连
                            console.log("连接异常 " + frame);
                            window.wsLostConnectTimes = window.wsLostConnectTimes || 0;
                            var lostConnectionTime = window.wsLostConnectTimes;
                            if (lostConnectionTime < 5) {
                                connect(headers, stompClient, url, topics, connectedFunc);
                            } else {
                                //5秒尝试重连
                                setTimeout(function() {
                                    connect(headers, stompClient, url, topics, connectedFunc);
                                }, 5000);
                            }
                            window.wsLostConnectTimes++;
                        });
                        return stompClient;
                    }

                    function connectServer(opts) {
                        var stompClient = null;
                        return connect(opts.headers, stompClient, opts.url, opts.topics, opts.connected);
                    };
                    /**
                     *
                     * screenShot:function   接收会议图片
                     *    param {
                     *     meet_id:string
                     *     join_id:string
                     *     }
                     * leaveMeet:function 离开会议
                     *    param {
                     *     join_id:string
                     *    }
                     * init:function 实例化会议内容
                     * @type {
                     *  {
                     *  init: Window.boardatClient.init,
                     *  dataHandler:
                     *     {
                     *      meetInfo: Window.boardatClient.dataHandler.meetInfo,
                     *      meetShot: Window.boardatClient.dataHandler.meetShot,
                     *      screenShot: Window.boardatClient.dataHandler.screenShot,
                     *      meetingEnd: Window.boardatClient.dataHandler.meetingEnd,
                     *      leaveMeet: Window.boardatClient.dataHandler.leaveMeet},
                     *      viewHandler: {
                     *          screenShot: Window.boardatClient.viewHandler.screenShot,
                     *          showMeeting: Window.boardatClient.viewHandler.showMeeting
                     *          }
                     *
                     *       }
                     * }
                     *
                     **/
                    window.boardatClient = {
                        init: function(userId, opts) {
                            var stompClient = null;
                            var self = window.boardatClient;
                            self.callbacks = opts.callbacks;
                            if (userId) {
                                boardatClient.client = connectServer({
                                    url: util.config.apiurl + "/socket?token=" + Page.data.access_token + "",
                                    headers: {
                                        userId: userId
                                    },
                                    topics: [{
                                        url: "/user/topic/meeting", //订阅会议
                                        notifyFunc: function(resp) {
                                            if (resp.type == "meeting") {
                                                self.dataHandler.meetInfo.call(self, resp.data);
                                            } else if (resp.type == "screenshot") {
                                                self.callbacks.showScreenshot.call(self, resp.data);
                                            }else if(resp.type == "whitemeeting"){
                                                self.dataHandler.boardInfo.call(self, resp.data);
                                            }
                                        }
                                    }],
                                    connected: function(data) {
                                        console.log("开始连接:" + data);
                                    }
                                });
                            }
                        },
                        dataHandler: {
                            meetInfo: function(meeting) {
                                if (meeting) {
                                    //订阅会议信息变更
                                    var self = this,
                                        meetId = meeting.id;
                                    boardatClient.client.subscribe(
                                        ("/topic/meeting/{0}".format(meetId)),
                                        function(resp) {
                                            self.viewHandler.showMeeting.call(self, JSON.parse(resp.body));
                                        }
                                    );
                                    //会议订阅直播
                                    boardatClient.client.subscribe(
                                        ("/topic/ppt/{0}".format(meetId)),
                                        function(resp) {
                                            self.dataHandler.meetShot.call(self, JSON.parse(resp.body), 'meeting');
                                        }
                                    );
                                    self.viewHandler.showMeeting.call(self, meeting);
                                }else{
                                    //订阅会议结束
                                    var self = this;
                                    self.viewHandler.meetingEnd.call(self);
                                }
                            },
                            //订阅白板实时数据 update 20181015
                            boardInfo: function(meeting){
                                if (meeting) {
                                    //订阅会议信息变更
                                    var self = this,
                                        meetId = meeting.id;
                                    boardatClient.client.subscribe(
                                        ("/topic/meeting/{0}".format(meetId)),
                                        function(resp) {
                                            self.viewHandler.showMeeting.call(self, JSON.parse(resp.body));
                                        }
                                    );
                                    boardatClient.client.subscribe(
                                        ("/topic/whiteBoard/{0}".format(meetId)),
                                        function(resp) {
                                            self.dataHandler.meetShot.call(self, JSON.parse(resp.body), 'whitemeeting');
                                        }
                                    );
                                    self.viewHandler.showMeeting.call(self, meeting);
                                }else{
                                    //订阅会议结束
                                    var self = this;
                                    self.viewHandler.meetingEnd.call(self);
                                }
                            },
                            meetShot: function(data, type) {
                                var self = this,
                                    callbacks = self.callbacks;
                                if(type == 'meeting'){
                                    if (typeof callbacks.showPicture == "function") {
                                        callbacks.showPicture.call(this, data);
                                    }
                                }else if (type == 'whitemeeting'){
                                    if (typeof callbacks.drawPicture == "function") {
                                        callbacks.drawPicture.call(this, data);
                                    }
                                }
                            }
                        },
                        viewHandler: {
                            showMeeting: function(data) {
                                var self = this,
                                    callbacks = self.callbacks;
                                if (typeof callbacks.showMeeting == "function") {
                                    callbacks.showMeeting.call(this, data);
                                }
                            },
                            showWhiteBoard: function(data){
                            },
                            meetingEnd: function(data){
                                var self = this,
                                    callbacks = self.callbacks;
                                if (typeof callbacks.meetingEnd == "function") {

                                    callbacks.meetingEnd.call(this, data);
                                }
                            }
                        }
                    };
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
                },
                drawPicture: function(data){
                    //白板内容绘画
                    if(data.img_url){
                        console.log("draw image", data.img_url);
                        var img =  createImg(data.img_url);
                        image(img, 0, 0, width, height);
                        /*loadImage('./images/list.png', function(img) {
                            console.log("img", img)
                            image(img, 0, 0, parseInt(displayWidth), parseInt((new Number(212 / 667 * displayHeight)).toFixed(2)));
                            
                        });*/
                        if(data.white_board_lives){
                            var p1, p2, pid;
                            // 绘画
                            for(var i = 0; i < data.white_board_lives.length; i++){
                                //4种画布显示情况
                                var dev_w, dev_h, draw_w, draw_h, scale = 1, id, colors, touch = 0, draw_x = 0, draw_y = 0, point_x = 0, point_y = 0, point_dev_scale = 1, point_draw_scale = 1;
                                if(data.white_board_lives[i].len_unit == 0){
                                    dev_w = data.white_board_lives[i].dev_width,
                                    dev_h = data.white_board_lives[i].dev_height,
                                    draw_w = parseInt(displayWidth),
                                    draw_h = parseInt(212 / 667 * displayHeight);
                                }else{
                                    scale = util.getDPI()[0] / 25.4 / 2;
                                    dev_w = data.white_board_lives[i].dev_width * scale,
                                    dev_h = data.white_board_lives[i].dev_height * scale,
                                    draw_w = parseInt(displayWidth),
                                    draw_h = parseInt(Math.floor(212 / 667 * displayHeight));
                                    /*console.log("scale", scale);
                                    console.log("dev_w", dev_w);
                                    console.log("dev_h", dev_h);
                                    console.log("draw_w", draw_w);
                                    console.log("draw_h", draw_h);*/
                                }
                                point_dev_scale = dev_w / dev_w, point_draw_scale = draw_w / draw_h;
                                if(draw_w > dev_w && draw_h > dev_h){
                                    //坐标原点
                                    point_x = parseFloat((draw_w - dev_w) / 2 / scale);
                                    point_y = parseFloat((draw_h - dev_h) / 2 / scale);
                                    console.log("test1");
                                }else if(draw_w > dev_w && draw_h < dev_h){
                                    //坐标原点
                                    point_x = 0;
                                    point_y = parseFloat((dev_h - draw_h) / 2 / scale);
                                    console.log("test2");
                                }else if(draw_w < dev_w && draw_h > dev_h){
                                    //坐标原点
                                    point_x = parseFloat((dev_w - draw_w) / 2 / scale);
                                    point_y = 0;
                                    console.log("test3");
                                }else if(draw_w < dev_w && draw_h < dev_h){
                                    console.log("test4");
                                    if(draw_w > draw_h){
                                        //坐标原点
                                        point_x = parseFloat(((draw_w - point_dev_scale * draw_h) / 2));
                                        point_y = 0;
                                        //console.log("point_x", point_x)
                                        //console.log("point_y", point_y)
                                    }else if(draw_w < draw_h){
                                        //坐标原点
                                        point_x = 0;
                                        point_y =  parseFloat(((draw_h - draw_w / point_dev_scale) / 2));
                                        //console.log("point_x", point_x)
                                        //console.log("point_y", point_y)
                                    }
                                }

                                if(data.white_board_lives[i].frames[0].length >= 1){
                                    for(var j = 0; j < data.white_board_lives[i].frames[0].length; j++){
                                        fill(0, 0, 255);
                                        strokeWeight(data.white_board_lives[i].frames[0][j].pt.w / scale);
                                        // 触摸点类型
                                        switch(data.white_board_lives[i].frames[0][j].t){
                                            case 0: //指针(触摸点)
                                                stroke(51);
                                                colors = data.white_board_lives[i].frames[0][j].pt.c; //stroke(51); 设置画笔颜色
                                                switch(colors){
                                                  case 0:
                                                    stroke(51);
                                                    break;
                                                  case 1:
                                                    stroke(255, 0, 0);
                                                    break;
                                                  case 2:
                                                    stroke(0, 255, 0);
                                                    break;
                                                  case 3:
                                                    stroke(0, 0, 255);
                                                    break;
                                                  default:
                                                    stroke(0, 0, 0);
                                                }
                                                // 区分画线和画点
                                                id = data.white_board_lives[i].frames[0][j].pt.id;
                                                touch = data.white_board_lives[i].frames[0][j].pt.s; // 0抬起 1 按下 2移动
                                                if(id != pid){
                                                    switch(touch) {
                                                        case 0://第一个点不处理抬起
                                                            break;
                                                        case 1: //跨id时需要重置画笔开始位置
                                                            p1 = p1 ? (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2) : point_x;
                                                            p2 = p2 ? (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2) : point_y;
                                                            draw_x = p1 ? (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2) : point_x;
                                                            draw_y = p2 ? (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2) : point_y;
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点的id
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            //point(p1, p2);
                                                            line(p1, p2, draw_x, draw_y);
                                                            break;
                                                        case 2:
                                                            p1 = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            p2 = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2);
                                                            draw_x = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            draw_y = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y)).toFixed(2);
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            line(p1, p2, draw_x, draw_y);
                                                            break;
                                                        }
                                                }else{
                                                    switch (touch) {
                                                        case 0:
                                                            pid = 0;//新的数据移除pid
                                                            break;
                                                        case 1: 
                                                            break;
                                                        case 2:
                                                            draw_x = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            draw_y = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y)).toFixed(2);
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            line(p1, p2, draw_x, draw_y);
                                                            //更新p1, p2信息
                                                            p1 = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            p2 = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2);
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                            break;
                                                    }
                                                }
                                                console.log("Point: " + draw_x + " " + draw_y);
                                                break;
                                            case 1: //橡皮擦
                                                stroke(255);
                                                alpha(color(255, 255, 255, 0));
                                                // 区分画线和画点
                                                id = data.white_board_lives[i].frames[0][j].pt.id;
                                                touch = data.white_board_lives[i].frames[0][j].pt.s; // 0抬起 1 按下 2移动
                                                if(id != pid){
                                                    switch(touch) {
                                                        case 0: //第一个点不处理抬起
                                                            break;
                                                        case 1: 
                                                            p1 = point_x;
                                                            p2 = point_y;
                                                            draw_x = point_x;
                                                            draw_y = point_y;
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点的id
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            line(p1, p2, draw_x, draw_y);
                                                            break;
                                                        case 2: 
                                                            draw_x = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            draw_y = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y)).toFixed(2);
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            line(p1, p2, draw_x, draw_y);
                                                            p1 = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            p2 = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2);
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                            break;
                                                        }
                                                }else{
                                                    switch (touch) {
                                                        case 0:
                                                            pid = 0;//新的数据移除pid
                                                            break;
                                                        case 1: 
                                                            break;
                                                        case 2:
                                                            draw_x = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            draw_y = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale  + point_y)).toFixed(2);
                                                            //线段的第一个点
                                                            strokeCap(ROUND);
                                                            strokeJoin(ROUND);
                                                            line(p1, p2, draw_x, draw_y);
                                                            //更新p1, p2信息
                                                            p1 = (new Number(data.white_board_lives[i].frames[0][j].pt.x / scale  + point_x)).toFixed(2);
                                                            p2 = (new Number(data.white_board_lives[i].frames[0][j].pt.y / scale + point_y)).toFixed(2);
                                                            pid = data.white_board_lives[i].frames[0][j].pt.id; //第一个点保存临时pid
                                                            break;
                                                    }
                                                }
                                                console.log("Point: " + draw_x + " " + draw_y);
                                                break;
                                            case 2: //手势
                                                break;
                                            case 3: // 快照
                                                break;
                                            case 4: // 清屏
                                                stroke(255);
                                                fill(color(255, 255, 255, 0));
                                                rect(0, 0, displayWidth, Math.floor(212 / 667 * displayHeight));
                                                clear();
                                                break;
                                            case 5:
                                                break;
                                            default:
                                                stroke(255);
                                        }
                                    }
                                }
                            }
                        }
                    }else{
                    }
                }
            }
        };

        if (!deli.isDeliApp()) {
            $(function(){
                Page.init();
            });
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