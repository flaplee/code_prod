'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/ztree/ztree'], function(module, kernel, util, ztree) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $btnReConfirm = $dom.find('.btn-renamedept-confirm'),
        $btnReClose = $dom.find('.btn-renamedept-close');
        $btnReConfirm.on('click',function(){
            // 修改部门信息 /v1.0/org/department/{department_id} 355671868335718401
            util.ajaxSubmit({
                type: 'post',
                url: '/v1.0/org/department/355671868335718401',
                data: {
                    "name":""
                },
                success: function(res) {
                    console.log("res",res);
                }
            });
        });
        $btnReClose.on('click',function(){
            kernel.closePopup('renamedept', {
                model: {
                    attr: 'renamedept'
                }
            });
        });
    return {
        onload: function() {
        }
    };
});