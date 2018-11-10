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
                goon: false,
                index: 0,
            },
            data: {
                userId: util.getCookie('userId'),
                meetId: util.getQuery('meetId'),
                joinId: '',
                isMeeting: false,
                meetName: '',
                access_token: util.getCookie('access_token') || ''
            },
            bindEvt: function() {
                var self = this;
                var $page = $('#page'),
                    $contentLive = $page.find('.content .boardat-live .live-content'),
                    $liveEmpty = $contentLive.find('.live-empty'),
                    $liveArticle = $contentLive.find('.live-article'),
                    $liveImg = $liveArticle.find('section .live-img'),
                    $navBack = $contentLive.find('a#navBack'),
                    $navScreenShot = $contentLive.find('a#navScreenShot');
                deli.common.navigation.hide({}, function(data) {
                    var pageCtn = document.querySelector('#page .content #boardat-live');
                    util.changeScroll(true);
                    util.fixIosScrolling(pageCtn);
                    pageCtn.addEventListener('scroll', function(evt) {}, false);
                }, function(resp) {});
                $navBack.on('click', function(e) {
                    e.stopPropagation();
                    location.replace(util.config.domain + "/?meet_from=live");
                    util.setCookie('meet_live', 'hide', 7);
                });

                if(util.localStorage.get('meetingStatus') && util.localStorage.get('meetingStatus') == '1'){
                    util.localStorage.set('meetFrom', 'live');
                }

                deli.common.navigation.goBack({}, function(data) {}, function(resp) {});

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

                //ppt 水平方向切换动画
                bespoke.from('article', {
                    fx: {
                        direction: "horizontal",
                        transition: "room",
                        reverse: false
                    }
                });

                $navScreenShot.on('click', function(e) {
                    e.stopPropagation();
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

                // 初始化 socket
                Page.methods.initSocket();

                // 实例化会议socket
                var initSocketLive = function() {
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
                                if (meeting.ppt_on_going) {
                                    deli.common.screen.keepAwake();
                                    //ppt直播开始
                                    Page.data.isMeeting = true;
                                    $contentLive.show();
                                    $liveImg.show();
                                    $liveEmpty.hide();
                                    $liveEmpty.find('.empty-text').css({
                                        'display': 'none'
                                    }).filter('.meeting-ongoing').css({
                                        'display': 'table-cell'
                                    });
                                } else {
                                    deli.common.screen.breakAwake();
                                    Page.data.isMeeting = false;
                                    $contentLive.show();
                                    $liveImg.hide();
                                    $liveEmpty.show();
                                    $liveEmpty.find('.empty-text').css({
                                        'display': 'none'
                                    }).filter('.ppt-ongoing').css({
                                        'display': 'table-cell'
                                    });
                                }
                                Page.data.meetId = meeting.id;
                                if (meeting.end_time != -1) {
                                    deli.common.screen.breakAwake();
                                    util.localStorage.remove('meetingStatus');
                                    util.localStorage.remove('meetFrom');
                                    deli.common.notification.toast({
                                        "text": "当前会议已结束",
                                        "duration": 1.5
                                    }, function(data) {}, function(resp) {});
                                }
                            },
                            showPicture: function(data) {
                                var $targetHtml = $('<section data-bespoke-fx-transition="room" data-bespoke-fx-direction="horizontal" data-bespoke-fx-reverse="false"><img class="live-img" src="'+ data.img_url +'" width="100%" height="180" /></section>');
                                if($liveArticle.hasClass('live-article-loading')){
                                    $liveArticle.removeClass('live-article-loading');
                                    $liveArticle.find('img').attr("src", data.img_url);
                                }else{
                                    if($liveArticle.find('section').length > 1){
                                        $liveArticle.find('section').eq(0).remove();
                                        $liveArticle.append($targetHtml);
                                    }else if($liveArticle.find('section').length == 1){
                                        $liveArticle.append($targetHtml);
                                    }

                                    //ppt 水平方向切换动画
                                    bespoke.from('article', {
                                        fx: {
                                            direction: "horizontal",
                                            transition: "room",
                                            reverse: false
                                        }
                                    });
                                    bespoke.next();
                                }
                            },
                            drawPicture: function(data){
                                console.log("drawPicture", data);
                                if(data.img_url){
                                    console.log("draw image");
                                }
                                // 绘制白色的点
                                for(var i = 0; i < data.white_board_lives.length; i++){
                                    //4种画布显示情况
                                    var dev_w = data.white_board_lives[i].dev_width,
                                        dev_h = data.white_board_lives[i].dev_height,
                                        draw_w = displayWidth,
                                        draw_h = Math.floor(212 / 667 * displayHeight);
                                    var point_x = 0, point_y = 0;
                                    if(draw_w > dev_w && draw_h > dev_h){
                                        //坐标原点
                                        point_x = Math.floor((draw_w - dev_w) / 2);
                                        point_y = Math.floor((draw_h - dev_h) / 2);
                                        console.log("test1");
                                    }else if(draw_w > dev_w && draw_h < dev_h){
                                        //坐标原点
                                        point_x = 0;
                                        point_y = Math.floor((dev_h - draw_h) / 2);
                                        console.log("test2");
                                    }else if(draw_w < dev_w && draw_h > dev_h){
                                        //坐标原点
                                        point_x = Math.floor((dev_w - draw_w) / 2);
                                        point_y = 0;
                                        console.log("test3");
                                    }else if(draw_w < dev_w && draw_h < dev_h){
                                        //坐标原点
                                        point_x = 0;
                                        point_y = 0;
                                        console.log("test4");
                                    }
                                    for(var j = 0; j < data.white_board_lives[i].frames[0].length; j++){
                                        fill(0, 0, 255);
                                        strokeWeight(data.white_board_lives[i].frames[0][j].pt.w);
                                        //stroke(255); 设置画笔颜色
                                        switch(data.white_board_lives[i].frames[0][j].pt.c){
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
                                        
                                        // 触摸点类型
                                        switch(data.white_board_lives[i].frames[0][j].t){
                                          case 0:
                                            stroke(51);
                                            break;
                                          case 1:
                                            stroke(255);
                                            alpha(color(255, 255, 255, 0));
                                            break;
                                        case 4:
                                            console.log("清屏");
                                            stroke(255);
                                            fill(color(255, 255, 255, 0));
                                            rect(0, 0, displayWidth, Math.floor(212 / 667 * displayHeight));
                                            clear();
                                            break;
                                          default:
                                            stroke(255);
                                        }
                                        //画点
                                        //point(data.white_board_lives[i].frames[0][j].pt.x, data.white_board_lives[i].frames[0][j].pt.y);
                                        point(data.white_board_lives[i].frames[0][j].pt.x , data.white_board_lives[i].frames[0][j].pt.y);
                                        console.log("Point: " + data.white_board_lives[i].frames[0][j].pt.x + " " + data.white_board_lives[i].frames[0][j].pt.y);
                                    }
                                }
                            }
                        }
                    });
                }();
            },
            methods: {
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
                            meetingEnd: function(data){
                                var self = this,
                                    callbacks = self.callbacks;
                                if (typeof callbacks.meetingEnd == "function") {
                                    callbacks.meetingEnd.call(this, data);
                                }
                            }
                        }
                    };
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