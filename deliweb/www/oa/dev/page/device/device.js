'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid, token, orgid, orgname, parentid, loc, locid;
	var $devBox = $('#device .dev-box'),
		$tmp = $devBox.find('.dev-main .dev-installed .dev-wrap table.table tbody.tbody');
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
            	if(locid == 'device'){
            		var $usermenu = $('#header .user-head .nav-top .nav-item');
				    $usermenu.find('a.navlink').removeClass('navlink-current');
				    $usermenu.find('a.navlink.devBtn').addClass('navlink-current');
            	};
            	getDevice(userid, token, orgid, $tmp);
            }
        },
        getDeviceSub:function(userid, token, orgid, $dom){
        	getDevice(userid, token, orgid, $dom);
	    }
    };
    function getDevice(userid, token, orgid, $dom){
    	$dom.find('>').remove();
    	var timestamp = (new Date().valueOf()).toString();
	    // 我可管理的设备
		util.ajaxSubmit({
			type: 'get',
	        url: '/v1.0/admin/device/my', //获取我可管理的设备列表
	        dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
	        data: {
	        	org_id:orgid
	        },
	        success: function(res) {
	            var json = res.data.result;
	            if(json.length > 0){
	            	for (var i = 0; i < json.length; i++) {
	            		var binds = json[i].binds;
	            		for(var j = 0; j < binds.length; j++){
	            			var device = binds[j].device;
	            			if(device){
		            			var appTpl = '<span>'+ ((device.product && device.product.name) ? device.product.name : '') +'</span>';
				        		var $deviceTpl = $('<tr class="dev-item" data-dev_id="'+ binds[j].device_id +'">\
									<td class="item-desc">\
										<div class="item-img fl">\
											<img src="'+ (device.product.icon ? device.product.icon : '')+'" />\
										</div>\
										<div class="item-text fl">\
											<p>'+ (device.product.name ? device.product.name : '') +'</p>\
											<p>'+ device.sn +'</p>\
										</div>\
									</td>\
									<td class="item-title">'+ device.name +'</td>\
									<td class="item-status"><span class="'+ ((device.online == true) ? 'status-online' : 'status-offline')  +'">'+ ((device.online == true) ? '在线' : '离线')  +'</span></td>\
									<td class="item-app">\
									'+ appTpl +'\
									</td>\
									<td class="item-delact">\
										<a href="javascript:;" class="button button-orange btn-dev-rename-item">修改设备名称</a>\
										<a href="javascript:;" class="button button-red btn-dev-delete-item">删除设备</a>\
										<a href="javascript:;" class="button btn-dev-bind-item hide">绑定其他应用</a>\
									</td>\
								</tr>');
				                $dom.append($deviceTpl);
				                setOperates($deviceTpl, {
				                	orgid: binds[j].org_id,
				                	devid: binds[j].device_id,
				                	name: device.name
				                });
					            function setOperates(o, data){
							    	// 绑定其他应用
							    	/*o.find('.btn-dev-bind-item').off('click').on('click',function(e){
							    		e.stopPropagation();
							    		var timestamp = (new Date().valueOf()).toString();
							    		util.ajaxSubmit({
							        		type: 'get',
								            url: '/v1.0/bind/device',
								            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
								            data: {
								            	"org_id": data.orgid,
												"dev_id": data.devid
								            },
								            success: function(res) {
								            	//kernel.hint('添加成功');
								            }
								        });
							    	});*/

							    	// 修改设备名称
							    	o.find('.btn-dev-rename-item').off('click').on('click',function(){
							    		kernel.openPopup('editdevice', {
											type: 'editdevice',
							            	data: data
										});
							    	});

							    	// 删除设备
							    	o.find('.btn-dev-delete-item').off('click').on('click',function(){
							    		kernel.openPopup('deldevice', {
											type: 'deldevice',
							            	data: data
										});
							    	});
							    }
	            			}
	            		}
		            }
	            }else{
					var emptyTpl = '<tr class="empty empty-device"><td colspan="5" class="empty-item"><div class="empty-img empty-img-device"></div><p class="empty-text">暂无设备</p></td></tr>';
					$dom.append($(emptyTpl));
	            }
	        }
	    });
    }
});