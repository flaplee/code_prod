'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid, token, orgid, orgname, parentid;
	var $appBox = $('#appcap .app-box'),
    	$tmpApp = $appBox.find('.app-main .app-inner .app-main-list'),
    	$tmpBack = $appBox.find('.btn-app-back');
    	$tmpApp.find('>').remove();
    return {
        onload: function(force) {
			userid = util.getCookie('userid'),
			token = util.getCookie('token'),
			orgid = util.getCookie('orgid'),
			orgname = util.getCookie('orgname'),
			parentid = util.getCookie('parentid');
        	if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }
            var timestamp = (new Date().valueOf()).toString();
        	util.ajaxSubmit({
	            type: 'get',
	            url: '/v1.0/app',
	            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
	            data: {},
	            success: function(res) {
	                console.log("res", res);
	                var data = res.data.result;
	                for (var i = 0; i < data.length; i++) {
	                 	var innerHTML = '';
	                 	switch (data[i].belong_type) {
                            case 'group':
                                innerHTML = '<span class="item-category-name">团队可用</span>';
                                break;
                            case 'user':
                                innerHTML = '<span class="item-category-name">个人可用</span>';
                                break;
                            case 'both':
                                innerHTML = '<span class="item-category-name">团队可用</span><span class="item-category-name">个人可用</span>';
                                break;
                        }
	                	var $itemHtml = $('<li class="item">\
							<div class="item-img" title="'+ data[i].name +'">\
								<img  src="'+ data[i].icon +'" width="80" height="80" />\
							</div>\
							<div class="item-info">\
								<div class="item-title clear">\
									<div class="item-text">'+ data[i].name +'</div>\
									<div class="item-category">'+ innerHTML +'</div>\
								</div>\
								<div class="item-content">'+ data[i].slogan +'</div>\
							</div>\
							<div class="item-btn">\
								<a data-appid="'+ data[i].id +'" class="btn btn-info btn-install" title="安装" href="javascript:;">安装</a>\
							</div>\
						</li>');
                        $tmpApp.append($itemHtml);
                        setInstall($itemHtml.find('.btn-install'), {
                        	appid: data[i].id
                        });
                    }
	            }
	        });
	        function setInstall(o, data){
	        	o.on('click',function(){
	        		var timestamp = (new Date().valueOf()).toString();
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
							console.log("res", res);
							if(res.code == 0){
								kernel.hint('应用安装成功', 'success');
							}
						}
			        });
	        	});
	        }
        }
    };
});