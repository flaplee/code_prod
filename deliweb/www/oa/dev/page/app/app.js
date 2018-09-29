'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid, token, orgid, orgname, parentid, loc, locid;
	var $appBox = $('#app .app-box'),
    	$tmpApp = $appBox.find('.app-main .app-inner .app-main-list'),
    	$tmpBack = $appBox.find('.btn-app-back');
    $tmpBack.on('click',function(){
    	window.history.back();
    });
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid');
        	loc = util.clone(kernel.location), locid = loc.id;
        	if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
            	if(locid == 'app'){
            		var $usermenu = $('#header .user-head .nav-top .nav-item');
				    $usermenu.find('a.navlink').removeClass('navlink-current');
				    $usermenu.find('a.navlink.appBtn').addClass('navlink-current');
            	};
            	getAppList($tmpApp);
            }

            function getAppList(o){
                o.find('>').remove();
                var timestamp = (new Date().valueOf()).toString();
                util.ajaxSubmit({
                    type: 'get',
                    url: '/v1.0/app',
                    dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                    data: {
                        org_id: orgid
                    },
                    success: function(res) {
                        var data = res.data.result;
                        for (var i = 0; i < data.length; i++) {
                            var innerHtml = '', installHtml = '';
                            installHtml =(data[i].installed == true) ? '<a data-appid="'+ data[i].id +'" class="btn btn-default btn-uninstall" title="已安装" href="javascript:;">已安装</a>' : '<a data-appid="'+ data[i].id +'" class="btn btn-info btn-install" title="安装" href="javascript:;">安装</a>';
                            switch (data[i].belong_type) {
                                case 'group':
                                    innerHtml = '<span class="item-category-name">团队可用</span>';
                                    break;
                                case 'user':
                                    innerHtml = '<span class="item-category-name">个人可用</span>';
                                    break;
                                case 'both':
                                    innerHtml = '<span class="item-category-name">团队可用</span><span class="item-category-name">个人可用</span>';
                                    break;
                            }
                            var $itemHtml = $('<li class="item">\
                                <div class="item-wrap clear">\
                                    <div class="item-img" title="'+ data[i].name +'">\
                                        <img  src="'+ data[i].icon +'" width="80" height="80" />\
                                    </div>\
                                    <div class="item-info">\
                                        <div class="item-title clear">\
                                            <div class="item-text">'+ data[i].name +'</div>\
                                            <div class="item-category">'+ innerHtml +'</div>\
                                        </div>\
                                        <div class="item-content">'+ data[i].slogan +'</div>\
                                    </div>\
                                </div>\
                                <div class="item-btn">\
                                    '+ installHtml +'\
                                </div>\
                            </li>');
                            o.append($itemHtml);
                            setInstall($itemHtml.find('.btn-install'), o, {
                                appid: data[i].id,
                                type: data[i].belong_type
                            });
                        }
                    }
                });
            }

            function setInstall(o, os, data){
                o.on('click',function(){
                    var timestamp = (new Date().valueOf()).toString();
                    if(data.type == 'group' || data.type == 'both'){
                        // 安装应用
                        util.ajaxSubmit({
                            type: 'post',
                            url: '/v1.0/bind/bind', ///v1.0/cd/bind
                            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                            data: {
                                org_id: orgid,
                                app_id: data.appid
                            },
                            success: function(res) {
                                if(res.code == 0){
                                    kernel.hint('应用安装成功', 'success');
                                    util.setCookie('app_ids', (parseInt(util.getCookie('app_ids')) + 1));
                                    getAppList(os);
                                }
                            }
                        });
                    }else{
                        kernel.hint('企业组织无法添加个人应用', 'info');
                    }
                });
            }
        }
    };

});
