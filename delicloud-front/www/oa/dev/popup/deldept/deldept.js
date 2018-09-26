'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
    var data, title, func, isNeedLoad;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $delTitle = $dom.find('.del-title'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
        
    return {
        onload: function(params) {
            console.log("params", params);
            data = params.data, func = params.func, isNeedLoad = params.isNeedLoad;
            $delTitle.text(data.title);
            $btnConfirm.off('click').on('click',function(){
                //update 20180304 orgid、parentid置换
                util.ajaxSubmit({
                    type:'post',
                    url: '/v1.0/org/department/delete',
                    silent: true,
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: {
                        "department_id": data.id
                    },
                    success: function(resp) {
                        console.log("resp",resp);
                        if(resp.code == 0){
                            kernel.hint('部门删除成功~', 3000);
                            kernel.closePopup('deldept');
                            if(func && typeof func === 'function'){
                                func();
                            }
                            if(isNeedLoad && isNeedLoad == true){
                                contacts.initDepartment($('#contacts .contacts-menu .contacts-list .contacts-team .dept-select-list ul.dept-select-inner'), {
                                    status: 'onload',
                                    type: 'parent',
                                    parentid: data.pid,
                                    orgid: data.id
                                }, true);
                            }
                        }else{
                            kernel.hint(resp.msg, 'error');
                            kernel.closePopup('deldept');
                        }
                    },
                    error: function(resp){
                        kernel.hint(resp.msg, 'error');
                        kernel.closePopup('deldept');
                    }
                });
            });

            $btnClose.off('click').on('click',function(){
                kernel.closePopup('deldept');
            });
        }
    };
});