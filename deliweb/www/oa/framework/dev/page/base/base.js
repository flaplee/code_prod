'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
	var userid = util.getCookie('userid'),
		token = util.getCookie('token'),
		orgid = util.getCookie('orgid');
    return {
        onload: function(force) {
        	if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }
            var timestamp = (new Date().valueOf()).toString();
        	util.ajaxSubmit({
        		type: 'get',
	            url: '/v1.0/device/my',
	            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
	            data: {},
	            success: function(res) {
	                console.log("res",res);
	            }
	        });
        }
    };
});