seajs.config({
    base: 'http://t.static.delicloud.com/h5/app/application/',
    alias: {
        jquery:'js/jquery.js',
        util: 'js/util.js',
        fastclick: 'js/fastclick.js',
        swiper: 'js/swiper.jquery.min.js'
    }
});
seajs.use(['jquery', 'util', 'fastclick', 'swiper'], function(jquery, util, fastclick, swiper) {
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        appId: "355373255801962497", // 必填，应用ID 办公逸：  377900597703081984
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "ae60fff41cc36aa39b1879528460b8fa", // 必填，服务端生成的签名 办公逸： 0c6f93a1017e6edcdf53682cd9e3ad73
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    var Page = {
        init: function() {
            var self = this;
            FastClick.attach(document.body);
            self.bindEvt();
        },
        bindEvt: function() {
            var self = this;
            var token = util.getQuery('token'),
                appid = util.getQuery('appid'),
                orgid = util.getQuery('orgid'),
                userid = util.getQuery('userid'),
                app_name, belong_type, app_url;
            var orgHtml = '';
            var $page = $('#page'),
                $detail = $page.find('.content > .appdetail'),
                $detailItem = $detail.find('.appdetail-item'),
                $detailItemIcon = $detailItem.find('.appdetail-icon'),
                $detailItemInfo = $detailItem.find('.appdetail-info'),
                $detailBannerInner = $detail.find('.appdetail-banner .appdetail-device .appdetail-device-inner'),
                $detailIntroduce = $detail.find('.appdetail-introduce'),
                $introduceCont = $detailIntroduce.find('.introduce-content'),
                $introduceMore = $introduceCont.find('.introduce-more'),
                $detailBase = $detail.find('.appdetail-base'),
                $detailBaseList = $detailBase.find('.base-device-list'),
                $detailBtns = $page.find('.navmenu > .btns'),
                $btnAdd = $detailBtns.find('.btn-add'),
                $btnAdded = $detailBtns.find('.btn-added'),
                $btnSwitch = $detailBtns.find('.btn-switch'),
                $btnRelated = $detailBtns.find('.btn-related');
            var sentAppBind = function(userid, orgid, orgname, appid, appname, appurl, token){
                $.ajax({
                    "type": "get",
                    "url": "http://t.web.delicloud.com/v1.0/cd/bind?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "headers": {
                        "Dauth": userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token)
                    },
                    "data": {
                        "org_id":orgid,
                        "app_id":appid
                    },
                    "contentType":"application/json; charset=utf-8",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        if(res.code == 0&& res.data['result'] != false){
                            deli.common.notification.hidePreloader();
                            deli.common.notification.toast({
                                "text": "应用添加成功~",
                                "duration": 1.5
                            },function(data){},function(resp){});
                            setTimeout(function(){
                            	var data = res.data;
                           	    deli.app.method.transit({
                                	"id":appid,
                                	"org_id":orgid,
                                	"name":appname || '',
                                	"org_name":orgname || '',
                                    "app_url":appurl || ''
                            	}, function(data) {}, function(resp) {});
                            }, 300); 
                        }else{
			                deli.common.notification.toast({
                                "text": res.msg,
                                "duration": 1.5
                            },function(data){},function(resp){});
                        }
                    },
                    error:function(res){
                        if(res.readyState == 4 && res.status == 200){
                            deli.common.notification.toast({
                                "text": "网络错误，请重试~",
                                "duration": 1.5
                            },function(data){},function(resp){});
                        }
                    }
                });
            };

            $btnAdd.on('click', function() {
                deli.common.notification.showPreloader();
                deli.app.organization.select({
                    'type':belong_type
                }, function(data) {
                    var org_id, org_name;
                    org_id = data.id;
                    org_name = data.name;
                    sentAppBind(userid, org_id, org_name, appid, app_name, app_url, token);
                }, function(resp) {});
            });
            
            /* 获取应用信息 */
            var getInitData = function(id) {
                $.ajax({
                    "type": "get",
                    "url": "http://t.web.delicloud.com/v1.0/cd/app/" + id + "?Dauth="+ userid + ' ' + (new Date().valueOf()) + ' ' + util.buildHash(token) +"",
                    "dataType": "jsonp",
                    "jsonp": "callback",
                    success: function(res) {
                        if (res.code == 0) {
                            var data = res.data['result'];
                            var innerHTML = '', deviceHtml = '';
                            app_name = data.name;
                            $detailItemIcon.find('img').attr('src',data.icon);
                            $detailItemInfo.find('.appdetail-title').text(app_name);
                            $detailItemInfo.find('.appdetail-content').text(data.slogan);
                            if(data.description){
                                if(data.description.length >= 200){
                                    $introduceMore.show();
                                    $introduceMore.on('click', function() {
                                        var c = $(this);
                                        $introduceCont.find('p.content-inner').css({ "overflow": "hidden", "height": "auto","white-space":"pre-wrap"});
                                        $introduceMore.hide();
                                    });
                                }
                                $introduceCont.find('p.content-inner').html(data.description);
                            }else{
                                $introduceMore.hide();
                            }
                            app_url = data.app_url;
                            belong_type = data.belong_type;
                            switch (belong_type) {
                                case 'group':
                                    innerHTML = '<span class="appdetail-category-name">企业可用</span>';
                                    break;
                                case 'user':
                                    innerHTML = '<span class="appdetail-category-name">个人可用</span>';
                                    break;
                                case 'both':
                                    innerHTML = '<span class="appdetail-category-name">企业可用</span><span class="appdetail-category-name">个人可用</span>';
                                    break;
                            }
                            $detailItemInfo.find('.appdetail-category').html(innerHTML);
                            var i = 1,urls = [],
                                screen_shot1 = data.screen_shot1,
                                screen_shot2 = data.screen_shot2,
                                screen_shot3 = data.screen_shot3,
                                screen_shot4 = data.screen_shot4,
                                screen_shot5 = data.screen_shot5;
                            while(i <= 5){
                                var item_shot = eval("screen_shot" + i),$targetHtml;
                                if(item_shot && item_shot != ''){
                                    urls.push(item_shot);
                                }
                                i++;
                            }
                            setScreenShot(urls);
                            if(data.products && data.products.length > 0){
                                var itemHtml = '';
                                $detailBase.show();
                                for(var i = 0;i < 1; i++){
                                    itemHtml += '<a class="base-device" href="javascript:;"><div class="device-icon"><img src="'+ data.products[i].icon +'" /></div><div class="device-title">'+ data.products[i].name +'</div></a>';
                                }
                                $detailBaseList.append($(itemHtml));
                            }else{
                                $detailIntroduce.css({"margin-bottom": "65px"});
                                $introduceCont.find('p.content-inner').css({"height": "auto"});
                                $introduceMore.hide();
                                $detailBase.hide();
                            }
                        } else {
                            util.hint(res.msg);
                        }
                    }
                });
            };

            // 应用截图
            function setScreenShot(urls){
                var $app_screenshot = $('#app_screenshot');
                var urlMap = urls.join(',').split(',').map(function(a, e) {
                    $app_screenshot.append($('<div class="screenshot app_screenshot" data-index="'+ e +'"><img width="131" class="lazyload lazyload-fadein" data-src="'+ a +'" src="'+ a +'"></div>'));
                });
                $app_screenshot.on("click", ".app_screenshot", function() {
                    var $dom = $(this), current = parseInt($dom.attr('data-index'));
                    deli.common.image.preview({
                        current: current,
                        urls: urls
                    }, function(data) {}, function(resp) {});
                })
            };

            getInitData(appid);

            $detailBtns.find('a').css('display', 'none') && $detailBtns.find('a.btn-add').css('display', 'block');
        }
    };
    // 验证签名成功
    deli.ready(function() {
        Page.init();
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
});
