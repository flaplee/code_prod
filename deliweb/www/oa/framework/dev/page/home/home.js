'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var loc, locid, userid, token, orgid, orgname, parentid, device_ids, app_ids, employee_count, orgindex;
    var $homeBox = $('#home .home-box'),
        $homeRecord = $homeBox.find('.home-record'),
        $homeName = $homeRecord.find('.record-top p.text'),
        $homeDev = $homeRecord.find('.record-main .device span em'),
        $homeApp = $homeRecord.find('.record-main .app span em'),
        $homeCount = $homeRecord.find('.record-main .count span em'),
        $homeIndex = $homeBox.find('.home-index'),
        $bn = $homeIndex.find('.banner'),
        $bnav = $homeIndex.find(' .bannerNav');
    var loadHomeData = function(params){
        var timestamp = (new Date().valueOf()).toString(), data = {type: 'group'};
        (params.orgid) ? (data.org_id = params.orgid ) : '';
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/admin/auth/my',
            dauth: params.userid + ' ' + timestamp + ' ' + kernel.buildDauth(params.userid, params.token, timestamp),
            data: data,
            success: function(res) {
                if(res.code == 0){
                    var json = res.data.result;
                    if(json && json.length == 1){
                        var getUserData = util.getUserData();
                        if(getUserData.organization[util.getCookie('orgindex')] != json[0]){
                            getUserData.organization[util.getCookie('orgindex')] = json[0];
                            util.setUserData(getUserData);
                        };
                        util.setCookie('orgname', json[0].org_name),
                        util.setCookie('device_ids', (json[0].device_ids ? json[0].device_ids.length : 0)),
                        util.setCookie('app_ids', (json[0].app_ids ? json[0].app_ids.length : 0)),
                        util.setCookie('employee_count', json[0].employee_count);
                        $homeName.text(json[0].org_name);
                        $homeDev.text((json[0].device_ids ? json[0].device_ids.length : 0));
                        $homeApp.text((json[0].app_ids ? json[0].app_ids.length : 0));
                        $homeCount.text(json[0].employee_count);
                    }
                }
            }
        });
    }
    return {
        onload: function(force) {
            loc = kernel.parseHash(location.hash),
            locid = loc.id,
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid'),
            device_ids = util.getCookie('device_ids'),
            app_ids = util.getCookie('app_ids'),
            employee_count = util.getCookie('employee_count'),
            orgindex = util.getCookie('orgindex');
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                var json = {
                    userid: userid,
                    token: token
                }
                if(orgid) json.orgid = orgid;
                if(locid == 'home'){
                    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink.homeBtn').addClass('navlink-current');
                };
                loadHomeData(json);
            }
        }
    };
});