'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/device/device'], function(module, kernel, util, device) {
    var userid, token, orgid, loc, locid, data, title;
    userid = util.getCookie('userid'),
    token = util.getCookie('token'),
    orgid = util.getCookie('orgid');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $delTitle = $dom.find('.del-title'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    return {
        onload: function(params) {
            console.log("params",params);
            data = params.data;
            $delTitle.text(data.title);
            $btnConfirm.off('click').on('click',function(){
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/bind/unbind/device/'+ data.devid,
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: {},
                    success: function(res) {
                        console.log("res", res);
                        if(res.code == 0){
                            kernel.hint('删除设备成功~', 'success');
                        }else{
                            kernel.hint('删除设备失败~', 'error');
                        }
                        kernel.closePopup('deldevice');
                        device.getDeviceSub(userid, token, orgid, $('#device .dev-box .dev-main .dev-installed .dev-wrap table.table tbody.tbody'));
                    },
                    error: function(res){
                        kernel.hint(res.msg, 'error');
                    }
                });
            });
            $btnClose.off('click').on('click',function(){
                kernel.closePopup('deldevice');
            });
        }
    };
});