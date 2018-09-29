'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/contacts/contacts'], function(module, kernel, util, contacts) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $title = $dom.find('.del-box .del-title'),
        $subTitle = $dom.find('.del-box .del-sub-title'),
        $btnConfirm = $dom.find('.btn-confirm'),
        $btnClose = $dom.find('.btn-close');
    return {
        onload: function(params) {
            var userid = util.getCookie('userid'),
                token = util.getCookie('token');
            console.log("params",params);
            $title.text(params.data.title);
            $subTitle.text(params.data.sub);
            $btnConfirm.off('click').on('click',function(){
                // 将人员从团队组织中删除 /v1.0/org/user/delete
                util.ajaxSubmit({
                    type: 'post',
                    url: '/v1.0/org/user/delete',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: {
                        "org_id": params.data.org_id,
                        "user_ids": params.data.user_ids
                    },
                    success: function(res) {
                        kernel.closePopup('deluser');
                        if(res.code == 0){
                            kernel.hintIcon('success',{
                                title: '成员信息已删除',
                                desc:''
                            }, 2000);
                            contacts.initContacts($('#contacts .contacts-box .contacts-inner tbody.tbody'), {
                                orgid: params.data.org_id, //data.id
                                type: params.data.type,
                                title: params.data.orgname
                            });
                        }else{
                            kernel.hintIcon('error',{
                                title: '彻底删除失败',
                                desc:'成员在其他部门任职，您可以选择将其从本部门移除'
                            }, 2000);
                        }
                    }
                });
            });

            $btnClose.on('click',function(){
                kernel.closePopup('deluser');
            });
        }
    };
});