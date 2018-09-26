'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/member.html!strip'], function(module, kernel, util, html) {
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var dom = $(html),
        $contacts = $('#contacts .contacts-box'),
        $deptTitle = dom.find('.department-form .form-title'),
        $deptBtnAdd = dom.find('.department-form .form-btns .btn-dept-add'),
        $deptList = dom.find('.department-inner .department-list .department-list-inner');
        $contacts.append(dom);
    $deptList.find('.select-item').on('click',function(e){
        e.stopPropagation();
        var c = $(this);
        if(!c.hasClass('current')){
            c.addClass('current');
            $deptList.find('.select-item').removeClass('current');
        }
    });

    return function(){
    }

    // 初始化组织数据
    function initDept(o, status, orgid){
        util.ajaxSubmit({
            type:'get',
            url: '/v1.0/org/department/'+ orgid +'/departments',
            data: {},
            success: function(res) {
                var json = res.data.result;
                if(json.length > 0){
                    o.append($('<ul class="dept-select-inner-son"></ul>'));
                    for(var i = 0;i < json.length; i++){
                        var temp  = '<li class="select-item clear" data-orgid="'+ json.org_id +'">\
                            <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe661;</i>'+ json.name +'</span></a>\
                        </li>';
                        o.find('ul.dept-select-inner-son').append($(temp));
                        bindDept($(temp), 'middle', {
                            'orgid':json.org_id,
                        });
                    }
                }else{

                }
            }
        });
    }

    // 绑定组织数据
    function bindDept(o, status, data){
        o.find('a.item-info').on('click',function(e){
            e.stopPropagation();
            initDept(o, status, data.orgid);
        });
    }

    // 重置组织数据
    function resetDept(o, data){
        $deptTitle.text(data.title);
         if(!o.hasClass('current')){
            o.addClass('current');
            $deptList.find('.select-item').removeClass('current');
        }
    }

    // 初始化团队数据
    function initDeptSetup(o, status, orgid){
        util.ajaxSubmit({
            type:'get',
            url: '/v1.0/org/department/'+ orgid +'/departments',
            data: {},
            success: function(res) {
                var json = res.data.result;
                if(json.length > 0){
                    for(var i = 0;i < json.length; i++){
                        o.append($('<ul class="department-list-inner-son"></ul>'));
                        var temp = '<li class="select-item current clear" data-orgid="'+ json.org_id +'">\
                            <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe661;</i>'+ json.name +'<span class="item-count">(<em>10人</em>)</span></span>/<span class="item-admin">'+ json.name +'(<em>主管</em>)</span></a>\
                            <div class="item-setup">\
                                <a class="setup-admin" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                <a class="setup-rename" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                <a class="setup-add" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                <a class="setup-del" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                            </div>\
                        </li>';
                        o.find('ul.department-list-inner-son').append($(temp));
                        bindDeptSetup($(temp), 'middle', {
                            'orgid':json.org_id,
                        });

                    }
                }else{
                }
            }
        });
    }

    bindDeptSetup($deptList.find('.select-item.current'),'middle',{'orgid':'123456789','title':'该部门有4名成员，请先移除部门成员！'});

    // 绑定组织数据
    function bindDeptSetup(o, status, data){
        o.find('a.select-item').on('click',function(e){
            e.stopPropagation();
            initDeptSetup(o, status, data.orgid);
        });

        //设置部门主管
        o.find('.item-setup .setup-admin').on('click',function(){
            kernel.openPopup('seluser', {
                type: 'seluser',
                data: {}
            });
        });

        //部门重命名 
        o.find('.item-setup .setup-rename').on('click',function(){
            kernel.openPopup('editdept', {
                type: 'rename',
                data: {
                    id: '123456',
                    pid: '123456789',
                    text:'请输入新的部门名称',
                    name: data.name
                }
            });
        });

        // 添加部门
        o.find('.item-setup .setup-add').on('click',function(){
            kernel.openPopup('editdept', {
                type: 'add',
                data: {
                    id: '123456',
                    pid: '123456789',
                    text:'请输入新的部门名称',
                    name: data.name
                }
            });
        });

        //删除部门信息 /v1.0/org/department/delete
        o.find('.item-setup .setup-del').on('click',function(e){
            e.stopPropagation();
            var c = $(this);
            var userLength, deptLength, id = c.parent('.item-setup').attr('data-id'),name = c.parent('.item-setup').siblings('a.item-info').find('.item-name').text();
            //查看部门的下级部门： /v1.0/org/department/355671868335718401/departments
            util.ajaxSubmit({
                type:'get',
                url: 'json/dept.json',
                data: {},
                success: function(resp) {
                    console.log("resp",resp);
                    var oids = [], uids = [];
                    if(resp.code == 0){
                        var json = resp.data.result;
                        deptLength = json.length;
                        for(var i = 0;i < json.length; i++){
                            (json[i].id) ? oids.push(json[i].id):'';
                        }
                        if(deptLength > 0){
                            // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                            util.ajaxSubmit({
                                type: 'get',
                                url: 'json/user.json',
                                data: {},
                                success: function(resuser) {
                                    console.log("resuser",resuser);
                                    if(resuser.code == 0){
                                        var jsonUser = resuser.data.result;
                                        userLength = jsonUser.length;
                                        console.log("deptLength", deptLength);
                                        console.log("userLength", userLength);
                                        for(var i = 0;i < jsonUser.length; i++){
                                            (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                        }
                                        kernel.openPopup('deldept',{
                                            type:((userLength > 0) ? 'both' : 'group'), //both group none user
                                            data:{
                                                name: name,
                                                title:((userLength > 0) ? '该部门有'+ oids.length +'个子部门和'+ uids.length +'名成员，请先移除部门和成员！' : '是否删除 '+ name +'，连同其子部门？'),
                                                oids: oids,
                                                uids: uids
                                            }
                                        });
                                    }else{
                                        kernel.hint(resuser.msg, 3000);
                                    }
                                }
                            });
                        }else{
                            // 查看部门下级所有成员信息 /v1.0/org/department/{department_id}/users 355671868335718401
                            util.ajaxSubmit({
                                type: 'get',
                                url: 'json/user.json',
                                data: {},
                                success: function(resuser) {
                                    console.log("resuser",resuser);
                                    if(resuser.code == 0){
                                        var jsonUser = resuser.data.result;
                                        userLength = jsonUser.length;
                                        console.log("deptLength", deptLength);
                                        console.log("userLength", userLength);
                                        for(var i = 0;i < jsonUser.length; i++){
                                            (jsonUser[i].user_id) ? uids.push(jsonUser[i].user_id):'';
                                        }
                                        kernel.openPopup('deldept',{
                                            type:((userLength > 0) ? 'user' : 'none'), //both group none user
                                            data:{
                                                name: name,
                                                title:((userLength > 0) ? '该部门有'+ uids.length +'名成员，请先移除部门成员！' : '是否删除 '+ name +'？'),
                                                oids: oids,
                                                uids: uids
                                            }
                                        });
                                    }else{
                                        kernel.hint(resuser.msg, 3000);
                                    }
                                }
                            });
                        }
                    }else{
                        kernel.hint(resp.msg, 3000);
                    }
                }
            });
            
        });
    }

    // 重置组织数据
    function resetDeptSetup(o, data){
        $deptTitle.text(data.title);
         if(!o.hasClass('current')){
            o.addClass('current');
            $deptList.find('.select-item').removeClass('current');

        }
    }
});