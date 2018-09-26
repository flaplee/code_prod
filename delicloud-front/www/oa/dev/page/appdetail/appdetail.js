'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var userid, token, orgid, orgname, parentid, loc, appid;
    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid');
            loc = kernel.parseHash(location.hash), appid = loc.args.appid;
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                /*
                var timestamp = (new Date().valueOf()).toString();
                util.ajaxSubmit({
                    type:'get',
                    url: '/v1.0/cd/app/'+ appid +'',
                    dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                    data: {},
                    success: function(res) {
                        console.log("res",res);
                    }
                });*/
            }
        }
    };
});