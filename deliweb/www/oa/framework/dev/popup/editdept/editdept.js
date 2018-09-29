'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
    var oid, pid, text, type, name, callFunc, $target, isNeedLoad;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        parentid = util.getCookie('parentid');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $formText = $dom.find('.form-group p.form-text'),
        $editInfo = $dom.find('.form-group .form-name input.deptname'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    return {
        onload: function(params) {
            console.log("params", params);
            var data = params.data;
            type = params.type, oid = data.id, pid = data.pid, text = data.text, name = data.name, callFunc = params.func, $target= params.$target, isNeedLoad = params.isNeedLoad;
            $editInfo.attr('data-id', oid);
            $editInfo.val(name);
            $formText.text(text);

            $btnConfirm.off('click').on('click',function(){
                if(type == 'rename' || type == 'edit'){
                    var msg = '部门重命名成功~';
                    //部门重命名
                    util.ajaxSubmit({
                        type:'post',
                        url: '/v1.0/org/department/'+ $editInfo.attr('data-id') +'/name',
                        dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                        data: {
                            "name" : $editInfo.val()
                        },
                        success: function(res) {
                            console.log("res",res);
                            if(res && res.code == 0){
                                kernel.closePopup('editdept');
                                kernel.hint(msg, 3000);
                                $target.text($editInfo.val());
                            }else{
                                kernel.hint(res.msg, 3000);
                            }
                        },
                        error: function(res){
                            kernel.hint(res.msg, 3000);
                            kernel.closePopup('editdept');
                        }
                    });
                }else if(type == 'add'){
                    var msg = '添加部门成功~';
                    // 添加部门
                    //update 20180304 pid、oid置换
                    util.ajaxSubmit({
                        type: 'post',
                        url: '/v1.0/org/department',
                        dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                        data: {
                            "org_id": pid,
                            "name" : $editInfo.val(),
                            "parent_id": oid
                        },
                        success: function(res) {
                            if(res && res.code == 0){
                                kernel.closePopup('editdept');
                                kernel.hint(msg, 3000);
                                if(callFunc && typeof callFunc === 'function'){
                                    callFunc();
                                }
                                if(isNeedLoad && isNeedLoad == true){
                                    contacts.initDepartment($('#contacts .contacts-menu .contacts-list .contacts-team .dept-select-list ul.dept-select-inner'), {
                                        status: 'onload',
                                        type: 'parent',
                                        parentid: oid,
                                        orgid: pid
                                    }, true);
                                }
                            }else{
                                kernel.hint(res.msg, 3000);
                            }
                        },
                        error: function(res){
                            kernel.hint(res.msg, 3000);
                            kernel.closePopup('editdept');
                        }
                    });
                }
            });
            $btnClose.off('click').on('click',function(){
                kernel.closePopup('editdept');
            });
        }
    };
});