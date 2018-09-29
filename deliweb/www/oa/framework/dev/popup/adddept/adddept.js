'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        parentid = util.getCookie('parentid');
    var uids = [], id, oid, type, func;
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $deptBox = $dom.find('.dept-box'),
        $deptselectList = $deptBox.find('.dept-select-list'),
        $deptselectedList = $deptBox.find('.dept-selected-list'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    return {
        onload: function(params) {
            id = params.data.id, oid = params.data.org_id, uids = params.data.user_ids, type = params.type, func = params.func;
            console.log("params", params);
            contacts.initDepartment($deptselectList.find('.dept-select-inner'),{
                orgid : oid,
                user_ids : uids,
                status: 'onload',
                type: 'parent',
                parentid: parentid
            }, undefined, $deptselectedList.find('ul.dept-selected-inner'));

            $btnConfirm.off('click').on('click',function(e){
                e.stopPropagation();
                if(type == 'seldept'){
                    setAdddept($deptselectedList.find('ul.dept-selected-inner'), $('#adduser .add-user .add-inner .add-form-extra ul.extra-list').find('.extra-item').eq(params.data.index), params.data.index);
                }else if(type == 'movedept'){
                    if(func && typeof func === 'function'){
                        func(id, $deptselectedList.find('ul.dept-selected-inner li.selected-item').attr('data-orgid'));
                    }
                }
                kernel.closePopup('adddept');
            });

            $btnClose.off('click').on('click',function(e){
                e.stopPropagation();
                kernel.closePopup('adddept');
            });

            // 后面做确定type 后统一处理
            // type == 'seldept' 直接处理dom
            function setAdddept(o, os, domIndex){
                var operateId = o.find('li.selected-item').attr('data-orgid'),
                    operateName= o.find('li.selected-item .item-info span').text();
                //os.find('.extra-item').attr('data-orgid', operateId);
                os.find('input.department'+ domIndex +'').val($.trim(operateName));
                os.find('input.departmentId'+ domIndex +'').val($.trim(operateId));
                os.find('input.business'+ domIndex +'').val('');
            }
        }
    };
});