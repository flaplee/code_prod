'use strict';
define(['common/kernel/kernel', 'site/util/util', 'page/contacts/department'], function(kernel, util, departments) {
    var userid, token, orgid, orgname, parentid, adminid, loc, locid, type, keyword, boxClass;
    var dataCache, title, tempId, tempType, tempTitle, tempOrgid, tempParentid, tempQuery = '', tempPage = 0, tempSize = 100, tempGoon = false, queryParentid;
    var $contacts = $('#contacts'),
        $contactsMenu = $contacts.find('.contacts-menu'),
        $contactsList = $contactsMenu.find('.contacts-list'),
        $contactsForm = $contactsList.find('.search-form'),
        $contactsTeam = $contactsList.find('.contacts-team'),
        $contactsSearch = $contactsForm.find('.search-box input.search'),
        $searchBtn = $contactsForm.find('.search-box a.btn-user-search'),
        $contactsBox = $contacts.find('.contacts-box'),
        $contactsInfo = $contactsBox.find('.contacts-info'),
        $contactsWrapData = $contactsInfo.find('.contacts-wrap-data'),
        $contactsWrapEmpty = $contactsInfo.find('.contacts-wrap-empty'),
        $contactsTitle = $contactsInfo.find('.contacts-form h2.form-title'),
        $moveUser = $contactsInfo.find('.btn-user-dept'),
        $removeUser = $contactsInfo.find('.btn-user-remove'),
        $deleteUser = $contactsInfo.find('.btn-user-delete-end'),
        $addUser = $contactsInfo.find('.btn-user-add'),
        $contactsInner = $contactsInfo.find('.contacts-inner'),
        $contactsTable = $contactsInfo.find('.contacts-inner .table'),
        $tmp = $contactsTable.find('.tbody'),
        $listTmp = $contactsTeam.find('.dept-select-list'),
        $wrapTmp = $listTmp.find('div.dept-select-wrap'),
        $listTmpInner = $listTmp.find('ul.dept-select-inner'),
        $departmentInner = $contacts.find('ul.department-list-inner');
    // 屏蔽回车键自动提交
    $(document).keydown(function(e){
        switch(e.keyCode){
            case 13:
             return false;
        }
    });
    
    //初始化组织
    var initTopDeparentment = function(o, data){
        tempParentid = data.orgid;
        queryParentid = data.orgid;
        o.find('>').remove();
        var $wrapTpl = $('<a class="item-info select-item" href="javascript:;" data-orgid="'+ data.orgid +'" data-expand="true"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe61d;</i>'+ data.name +'</span></a>');
        o.append($wrapTpl);
        initUsers($wrapTpl, {
            orgid: data.orgid,
            title: data.name,
            type: data.type
        });
        //加载组织成员信息
        function initUsers(o, data) {
            o.on('click', function(e) {
                e.stopPropagation();
                var c = $(this);
                if (!c.hasClass('current')) {
                    $listTmp.find('.select-item').removeClass('current');
                    c.addClass('current');
                    //update 20180307
                    if(tempId && tempId != data.orgid){
                        tempId = data.orgid, tempType = data.type, tempTitle = data.title, tempPage = 0, tempOrgid = data.orgid;
                        initContacts($tmp, {
                            id: tempId,
                            orgid: tempOrgid,
                            title: tempTitle,
                            type: tempType,
                            query: tempQuery,
                            page: tempPage,
                            size: tempSize
                        });
                    }
                }
            });
        }
    }

    // 初始化团队成员
    var initContacts = function(o, data, os) {
        var initUrl = (data.query != '') ? '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users' : '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users';
        var initData = (data.query != '') ? {query:data.query, page : data.page, size : data.size} : {page : data.page, size : data.size} ;
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: initUrl,
            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
            data: initData,
            success: function(res) {
                if(res.code == 0){
                    var json = res.data.result;
                    dataCache = json;
                    if(data.query != '' && os){
                        $contactsWrapData.show();
                        $contactsWrapEmpty.hide();
                        os.find('a.select-item, li.select-item').removeClass('current');
                        os.find('.dept-select-wrap a.item-info').addClass('current');
                    }
                    if(json && json.length > 0){
                        o.scrollTop(0)
                        if(tempPage == 0){
                            o.find('>').remove();
                        }
                        for (var i = 0; i < res.data.result.length; i++) {
                            var deptPaths = json[i].department_paths, deptsText = '', deptTitles = json[i].titles;
                            if((deptPaths && deptPaths.length > 1) || (data.orgid == json[i].org_id && deptPaths.length == 1)) {
                                for(var j = 0;j < deptPaths.length; j++){
                                    deptsText += (deptPaths[j] ? deptPaths[j] : '').replace(new RegExp("/","gm"),"-").replace(new RegExp(""+ json[i].organization +"-","gm"),"") + ((j == deptPaths.length - 1) ? '' : '/');
                                }
                            }else{
                                deptsText = json[i].department;
                            }
                            var departmentText = (json[i].org_id == json[i].department_id && (data.type && data.type == 'parent')) ? '' : deptsText;
                            var titleText = (json[i].org_id == json[i].department_id && (data.type && data.type == 'parent')) ? json[i].title : ((deptTitles && deptTitles.length > 1) ? deptTitles.join('/') : json[i].title);
                            var $itemTpl = $('<tr class="table-item">\
                                <td class="user-check" style="display:none;"><a class="item" href="javascript:;" data-uid="' + json[i].user_id + '" data-did="'+ json[i].department_id +'"  data-isMaster="' + ((adminid == json[i].user_id) ? true : false) + '" data-isAdmin="' + json[i].is_department_director + '"><i class="iconfont">&#xe76a;</i></a></td>\
                                <td class="user-name"><p>' + json[i].nickname + '</p></td>\
                                <td class="user-employeenum">' + (json[i].employee_num ? json[i].employee_num : '') + '</td>\
                                <td class="user-deptname dept-text"><p class="'+ ((data.type && data.type == 'parent') ? '' : 'text-center') +'">' + departmentText + '</p></td>\
                                <td class="user-title"><p class="'+ ((data.type && data.type == 'parent') ? '' : 'text-center') +'">' + titleText + '</p></td>\
                                <td class="user-mobile">' + json[i].mobile + '</td>\
                                <td class="user-operate" style="display:none;">\
                                    <button data-index="' + i + '" type="button" class="btn btn-info btn-sm btn-user-edit">编辑</button>\
                                </td>\
                            </tr>');
                            o.append($itemTpl);
                            selectUser($itemTpl.find('a.item'));
                            //单个用户编辑
                            editUser($itemTpl,{
                                nickname : json[i].nickname,
                                id : tempId,
                                type : tempType,
                                userid : json[i].user_id,
                                department : json[i].department,
                                departments : json[i].departments,
                                departmentid : json[i].department_id,
                                departmentids : json[i].department_ids,
                                orgid : json[i].org_id,
                                orgname : json[i].organization,
                                mobile : json[i].mobile,
                                mobile_region: json[i].mobile_region,
                                employee_num : json[i].employee_num,
                                title: json[i].title,
                                titles: json[i].titles
                            });

                            //编辑成员
                            function editUser(o, data){
                                o.find('td button.btn-user-edit').on('click', function() {
                                    kernel.openPanel('adduser', {
                                        type: 'edit',
                                        data: data
                                    });
                                });
                            }

                            //选择成员
                            function selectUser(o) {
                                o.on('click', function(e) {
                                    e.stopPropagation();
                                    var c = $(this);
                                    if (!c.hasClass('selected')) {
                                        c.addClass('selected').find('i').html('&#xe63d;');
                                        c.addClass('selected');
                                        c.find('i').html('&#xe63d;');
                                    } else {
                                        c.removeClass('selected').find('i').html('&#xe76a;');
                                        c.removeClass('selected');
                                        c.find('i').html('&#xe76a;');
                                    }
                                });
                            }
                        }
                        if (json.length < tempSize) {
                            if(tempPage > 0){
                                o.append('<tr class="table-item-end"><td colspan="5"><div class="item-end-box"><span>没有更多了</span></div></td></tr>');;
                            }
                        }else{
                            tempGoon = true;
                        }
                        selectUserAll($contactsTable.find('.thead .select-all'));
                    }else{
                        if(tempPage == 0){
                            if(data.query != '' && os){
                                $contactsWrapData.hide();
                                $contactsWrapEmpty.show();
                            }else{
                                o.find('>').remove();
                                var itemTpl = '<tr class="empty empty-user"><td colspan="8" class="empty-item"><div class="empty-img empty-img-user"></div><p class="empty-text">暂无人员信息</p></td></tr>';
                                o.append($(itemTpl));
                            }
                        }else{
                            o.append('<tr class="table-item-end"><td colspan="5"><div class="item-end-box"><span>没有更多了</span></div></td></tr>');;
                        }
                    }
                    setDeptTitle($contactsTitle, data.title);
                }else{
                    if(data.query == '' && data.type == 'parent'){
                        kernel.hint('当前组织状态异常,请重新登录', 'error');
                        util.setUserData(undefined);
                        kernel.replaceLocation({'args': {},'id': 'loginhome'});
                    }else{
                        kernel.hint(json.msg, 'error');
                    }
                }
            }
        });
    }

    //初始化团队 及 团队子部门信息
    var initDepartment = function(o, data, w, os) {
        var status = data.status,
            relation = data.type,
            parentid = data.parentid,
            orgid = data.orgid;
        // status = 'onload/loaded',  relation = 'parent/son', parentid = 355671868335718401, orgid = 363677081407586304;
        var id = (relation == 'parent') ? parentid : orgid;
        o.find('>').remove();
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/org/department/' + id + '/departments',
            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
            data: {},
            success: function(res) {
                var json = res.data.result;
                for (var i = 0; i < res.data.result.length; i++) {
                    var $itemTpl = $('<li class="select-item clear" data-orgid="' + json[i].org_id + '" data-status="onload" data-expand="false">\
                            <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe641;</i><span class="text"><i class="iconfont item-class">&#xe661;</i>' + json[i].name + '</span></a>\
                            <ul class="select-son-list clear"></ul>\
                        </li>');
                    o.append($itemTpl);

                    bindSon($itemTpl, {
                        id: json[i].id,
                        orgid: json[i].id,
                        title: json[i].name
                    }, os);

                    //加载团队子部门信息
                    function bindSon(o, data, os) {
                        o.find('a.item-info > i.item-class').on('click', function(e) {
                            e.stopPropagation();
                            tempParentid = '';
                            var c = $(this);
                            // 设置收缩展开
                            setExpandTwo(c, o, parentid, data.orgid, w);
                        });

                        o.find('a.item-info').on('click', function(e) {
                            e.stopPropagation();
                            $contactsWrapData.show();
                            $contactsWrapEmpty.hide();
                            $contactsForm.find('.search-box input.search').val('');
                            tempQuery = '';
                            var c = $(this), cLi = c.parent('.select-item');
                            // 加载数据&选中部门
                            if (!cLi.hasClass('current')) {
                                $listTmp.find('.select-item').removeClass('current');
                                cLi.addClass('current');
                                tempOrgid = data.orgid;
                            }
                            if(tempId && tempId != data.orgid){
                                tempId = data.id, tempType = data.type, tempTitle = data.title, tempPage = 0, tempOrgid = data.orgid;
                                if(type != 'department' && (w && w == true)){
                                    initContacts($tmp, {
                                        id: tempId,
                                        type: tempType,
                                        orgid: tempOrgid,
                                        title: tempTitle,
                                        query: tempQuery,
                                        page: tempPage,
                                        size: tempSize
                                    });
                                }
                            }
                            // 选中部门
                            bindSel(os, data, cLi);
                        });
                    }
                    
                    // 设置收缩展开
                    function setExpandTwo(o, os, w, a, n){
                        var oList = o.parent('a.item-info').siblings('ul.select-son-list'),oLi = o.parent('a.item-info').parent('.select-item');
                        if(oLi.attr('data-expand') == 'false'){
                            o.html('&#xe608;');
                            oLi.attr('data-expand', true);
                            oList.show();
                        }else{
                            o.html('&#xe641;');
                            oLi.attr('data-expand', false);
                            oList.hide();
                        }
                        if (!(oLi.attr('data-status') == 'loaded')) {
                            initDepartment(os.find('ul.select-son-list'), {
                                status: 'onload',
                                type: 'son',
                                parentid: w,
                                orgid: a
                            }, (n && n == true) ? true : undefined, $('#adddept .dept-box .dept-selected-list').find('ul.dept-selected-inner'));
                            oLi.attr('data-status', 'loaded');
                        }
                    };

                    // 选中部门
                    function bindSel(o, data, os){
                        if(o){
                            o.find('>').remove();
                            var $itemTpl = $('<li class="selected-item clear" data-orgid="' + data.orgid + '">\
                                <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe661;</i><span class="text">' + data.title + '</span></a>\
                                <a class="item-check" href="javascript:;"><i class="iconfont">&#xe660;</i></a>\
                            </li>');
                            o.append($itemTpl);
                            o.find('a.item-check').on('click', function(e) {
                                e.stopPropagation();
                                var c = $(this), cLi = c.parent('.selected-item');
                                cLi.remove();
                                if(os.attr('data-status') == 'loaded'){
                                    os.attr('data-status','onload');
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    //初始化组织
    var initTopDept = function(o, data){
        var $deptTitle = $('.department-info').find('.department-form .form-title'),
        $deptBtnAdd = $('.department-info').find('.department-form .form-btns .btn-dept-add'),
        $deptInner = $('.department-info').find('.department-inner'),
        $deptList = $deptInner.find('.department-list .department-list-inner');
        var status = data.status,
            relation = data.relation,
            parentid = data.parentid,
            orgid = data.orgid,
            index = data.index + 1,
            orgname = data.orgname;
        // status = 'onload/loaded',  relation = 'parent/son', parentid = 355671868335718401, orgid = 363677081407586304;
        var id = (relation == 'parent') ? parentid : orgid;
        o.find('>').remove();
        if(relation == 'parent'){
            $deptTitle.text(orgname);
        }else{
            relation = 'son'
        }
        initDeps(o, {
            orgid: data.orgid,
            title: data.orgname,
            index: index,
            relation: relation
        });

        //初始化团队 及 团队子部门信息
        function initDeps(o, data){
            var timestamp = (new Date().valueOf()).toString();
            util.ajaxSubmit({
                type:'get',
                url: '/v1.0/org/department/'+ data.orgid +'/departments',
                dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                data: {},
                success: function(res) {
                    var json = res.data.result;
                    if(json.length > 0){
                        for(var i = 0;i < json.length; i++){
                            var directorHtml = (json[i].directors && json[i].directors[0].name) ? '<span class="item-admin">'+ json[i].directors[0].name +'(<em>主管</em>)</span>' : '<span class="null">空缺</span>';
                            var $temp = $('<li class="select-item clear" data-orgid="'+ json[i].id +'" data-status="onload" data-expand="false">\
                                <div class="item-info clear" data-status="onload">\
                                    <div class="item-text fl">\
                                        <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+ json[i].name +'</span><span class="item-count">(<em>'+ json[i].employee_cnt +'人</em>)</span></span>/'+ directorHtml +'\
                                    </div>\
                                    <div class="item-setup fr">\
                                        <a class="setup-admin" title="设置主管" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                        <a class="setup-rename" title="重命名" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                        <a class="setup-add" title="添加子部门" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                        <a class="setup-del" title="删除部门" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                                    </div>\
                                </div>\
                                <ul class="item-select-inner-son" data-index="'+ data.index +'" data-status="onload"></ul>\
                            </li>');
                            o.append($temp);
                            bindDeptSetup($temp, {
                                'orgid': json[i].id,
                                'title': '',
                                index: data.index,
                                relation: data.relation
                            });
                            
                            // 绑定部门操作 
                            function bindDeptSetup(o, data){
                                // 设置当前组织
                                o.on('click',function(e){
                                    var event = e || window.event;
                                    event.stopPropagation();
                                    var target = event.target || event.srcElement;
                                    var c = $(this), $info = c.find('> div.item-info'), $son = c.find('> ul.item-select-inner-son'), $dom;
                                    // 设置收缩展开
                                    setExpand(c);
                                    if(!$info.hasClass('current')){
                                        $deptList.find('li.select-item div.item-info').removeClass('current');
                                        $info.addClass('current');
                                    }

                                    if (!(c.attr('data-status') == 'loaded')) {
                                        c.attr('data-status','loaded');
                                        c.attr('data-expand', true);
                                        initDeps($son,{
                                            orgid : data.orgid,
                                            title : data.name,
                                            index: data.index + 1 
                                        });
                                    }

                                });

                                //设置部门主管
                                o.on('click', '.item-setup .setup-admin', function (e) {
                                    //e.stopPropagation();
                                    var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('seluser', {
                                            type: 'seluser',
                                            data: {
                                                orgid: data.orgid
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            }
                                        });
                                    });
                                })

                                //部门重命名 
                                o.on('click', '.item-setup .setup-rename', function (e) {
                                    //e.stopPropagation();
                                    var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('editdept', {
                                            type: 'rename',
                                            data: {
                                                id: data.orgid,
                                                pid: parentid,
                                                text:'请输入新的部门名称',
                                                name: data.name,
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            }
                                        });
                                    });
                                });

                                // 添加部门
                                o.on('click', '.item-setup .setup-add', function (e) {
                                    //e.stopPropagation();
                                    var c = $(this).parent('.item-setup').parent('.item-info');
                                    setCurrent($deptList, c, function(){
                                        kernel.openPopup('editdept', {
                                            type: 'add',
                                            data: {
                                                id: data.orgid,
                                                pid: parentid,
                                                text:'请输入部门名称',
                                                name: data.name
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid, //'355671868335718401'
                                                    index: 0
                                                });
                                            },
                                            idNeedId: true,
                                            isNeedLoad: true
                                        });
                                    });
                                });

                                //删除部门信息 /v1.0/org/department/delete
                                o.on('click', '.item-setup .setup-del', function (e) {
                                    e.stopPropagation();
                                    var c = $(this),$info = c.parent('.item-setup').parent('.item-info');
                                    var userLength, deptLength, id = c.parent('.item-setup').attr('data-id'),name = c.parent('.item-setup').siblings('a.item-info').find('.item-name').text();
                                    setCurrent($deptList, $info, function(){
                                        kernel.openPopup('deldept',{
                                            type:'group', //both group none user
                                            data:{
                                                id: data.orgid,
                                                pid: parentid,
                                                name: data.name,
                                                title:  '是否删除该部门？'
                                            },
                                            func: function(){
                                                initTopDept($deptList,{
                                                    status: 'onload',
                                                    relation: 'parent',
                                                    orgid: orgid,
                                                    orgname: orgname,
                                                    parentid: parentid,
                                                    index: 0
                                                });
                                            },
                                            isNeedLoad: true
                                        });
                                    });
                                });
                            }
                            // 设置收缩展开
                            var setExpand = function(o){
                                if(o.attr('data-status') == 'loaded'){
                                    if(o.attr('data-expand') == 'false'){
                                        o.attr('data-expand', true);
                                        o.find('.item-info .item-text > i.iconfont').html('&#xe608;');
                                        o.find('ul.item-select-inner-son').toggle();
                                    }else{
                                        o.attr('data-expand', false);
                                        o.find('.item-info .item-text > i.iconfont').html('&#xe641;');
                                        o.find('ul.item-select-inner-son').toggle();
                                    }
                                }
                            };

                            //设置选择部门
                            function setCurrent(o, w, callback){
                                if(!w.hasClass('current')){
                                    o.find('li.select-item div.item-info').removeClass('current');
                                    w.addClass('current');
                                }
                                var $d = (data.relation == 'parent') ? o : w;
                                if($d.attr('data-status') == 'onload'){
                                    $d.attr('data-status','loaded');
                                }
                                if(typeof callback === 'function'){
                                    callback();
                                }
                            }
                        }
                    }else{
                        // 无子部门时需要处理样式
                    }
                }
            });
        }
    }

    // 左侧菜单导航
    $contactsMenu.find('.menu-list .item a.item-menu').on('click', function(e) {
        e.stopPropagation();
        var c = $(this).parent('li');
        if (!c.hasClass('current')) {
            c.siblings('li').removeClass('current');
            c.addClass('current');
        }
    });

    //关键字搜索
    $contactsForm.find('.btn-user-search').off('click').on('click',function(e){
        e.preventDefault();
        tempGoon = false;
        tempPage = 0;
        tempType = 'parent'
        tempQuery = encodeURI($contactsForm.find('.search-box input.search').val());
        initContacts($tmp, {
            id: tempId,
            orgid: queryParentid, // tempOrgid tempParentid 
            title: tempTitle,
            type: tempType,
            query: tempQuery,
            page: tempPage,
            size: tempSize
        }, $listTmp);
    });

    // 回车键搜索
    $contactsForm.find('.search-box input.search').bind('keyup', function(e) {
        var c = $(this);
        if (e.keyCode == "13" && c.val().length > 0) {
            $contactsForm.find('.btn-user-search').trigger('click');
        }
    });

    //组织中未搜索到内容返回处理
    $contactsWrapEmpty.find('p a.empty-back').on('click', function(e){
        e.stopPropagation();
        $contactsWrapData.show();
        $contactsWrapEmpty.hide();
        $contactsForm.find('.search-box input.search').val('');
        tempQuery = '';
    });

    var setMove =  function(uids, oldDid, newDid){
        var timestamp = (new Date().valueOf()).toString();
        // 将人员移动到其他部门 /v1.0/org/user/move
        util.ajaxSubmit({
            type: 'post',
            url: '/v1.0/org/user/move',
            dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
            data: {
                "user_ids": uids,
                "src_department_id": oldDid,
                "dest_department_id": newDid
            },
            success: function(res) {
                if(res.code == 0){
                    kernel.hint('移动成员成功', 'success');
                    initContacts($tmp, {
                        id: tempId,
                        orgid: tempOrgid,
                        title: tempTitle,
                        query: tempQuery,
                        page: tempPage,
                        size: tempSize
                    });
                    //kernel.closePopup('adddept');
                }else{
                    kernel.hint('请选择要移动的人员', 'error');
                }
            }
        });
    };

    //移动到其他部门
    $moveUser.on('click', function() {
        var uids = [];
        $contactsTable.find('tbody.tbody tr td a.item.selected').each(function(i, dom) {
            uids.push($(dom).attr('data-uid'));
        });
        if (uids.length > 0) {
            // 选择部门
            kernel.openPopup('adddept', {
                type: 'movedept',
                data: {
                    "id": tempId,
                    "org_id": orgid,
                    "user_ids": uids
                },
                func: function(oldid, newid){
                    setMove(uids, oldid, newid);
                }
            });
        } else {
            kernel.hint('请选择要移动的人员', 'info');
        }
    });

    //从本部门移除
    $removeUser.on('click', function() {
        var uids = [];
        $contactsTable.find('tbody.tbody tr td a.item.selected').each(function(i, dom) {
            uids.push($(dom).attr('data-uid'));
        });
        if (uids.length > 0) {
            var timestamp = (new Date().valueOf()).toString();
            // 将人员从团队组织中删除 /v1.0/org/user/delete
            util.ajaxSubmit({
                type: 'post',
                url: '/v1.0/org/user/delete',
                dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                data: {
                    "org_id": orgid, //本部门移除
                    "user_ids": uids
                },
                success: function(res) {
                    if(res.code == 0){
                        kernel.hint('删除成员成功', 'success');
                        initContacts($tmp, {
                            id: tempId,
                            orgid: tempOrgid,
                            title: tempTitle,
                            query: tempQuery,
                            page: tempPage,
                            size: tempSize
                        });
                    }else{
                        kernel.hint('请选择要删除的成员', 'error');
                    }
                }
            });
        } else {
            kernel.hint('请选择要删除的成员', 'info');
        }
    });

    //彻底删除
    $deleteUser.on('click', function() { // /v1.0/org/user/delete
        var uids = [], unames = [], oname, text = '';
        $contactsTable.find('tbody.tbody tr td a.item.selected').each(function(i, o) {
            uids.push(dataCache[$(o).parents('tr').index()].user_id);
            unames.push(dataCache[$(o).parents('tr').index()].nickname);
            oname = dataCache[0].organization;
        });
        if (uids.length > 0) {
            if(uids.length == 1){
                 text = '是否将 '+ unames[0] +' 成员';
            }else if(uids.length ==2){
                text = '是否将 '+ unames[0] + '、' + unames[1] + ' 2名成员';
            }else{
                text = '是否将 '+ unames[0] + '、' + unames[1] + ' 等3名成员';
            }
            kernel.openPopup('deluser', {
                type: 'user',
                data: {
                    org_id: orgid, //从顶级部门移除 parentid //update 20180304 orgid、parentid置换
                    user_ids: uids,
                    title: text,
                    sub: '从' + (oname ? oname : '得力团队') + ' 通讯录中彻底删除？'
                }
            });
        } else {
            kernel.hint('请选择要彻底删除的人员', 'info');
        }
    });

    // 添加成员
    $addUser.on('click', function() {
        var pids = [];
        pids.push(parentid);
        kernel.openPanel('adduser', {
            type: 'add',
            data: {
                id: tempId,
                type: tempType,
                orgid : orgid,
                orgname : orgname,
                mobile_region : "86",
                parentids : pids,
                isParentid : tempParentid
            }
        });
    });

    //部门
    var $addDept = $('.btn-dept-add');

    //添加部门
    $addDept.off('click').on('click', function(e) {
        //update 20180304 orgid、parentid置换
        e.stopPropagation();
        kernel.openPopup('editdept', {
            type: 'add',
            data: {
                id: parentid,
                pid: orgid,
                text:'请输入部门名称'
            },
            func: function(){
                initTopDept($('.department-info .department-inner .department-list .department-list-inner'),{
                    status: 'onload',
                    relation: 'parent',
                    orgid: parentid,
                    orgname: orgname,
                    parentid: orgid,
                    index: 0
                });
            },
            idNeedId: false,
            isNeedLoad: true
        });
    });

    return {
        onload: function(force) {
            userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid'),
            orgname = util.getCookie('orgname'),
            parentid = util.getCookie('parentid'),
            adminid = util.getCookie('adminid');
            tempId = orgid,
            tempTitle = orgname,
            tempType = 'parent',
            tempOrgid  = orgid,
            tempGoon = false,
            tempQuery = '',
            tempPage = 0,
            loc = kernel.parseHash(location.hash),
            locid = loc.id,
            type = loc.args.type,
            //keyword = loc.args.key_search;
            boxClass = type ? '.' + type + '-info' : '.user-info';
            var $contactsSearch = $('#contacts .search-form .search-box input.search'),
                $contactsInner = $('#contacts .contacts-box .contacts-info .contacts-inner');
            $contactsSearch.val('');
            if(userid === undefined || token === undefined || orgid === undefined){
                util.setUserData(undefined);
                kernel.replaceLocation({'args': {},'id': 'loginhome'});
            }else{
                if(locid == 'contacts'){
                    var $usermenu = $('#header .user-head .nav-top .nav-item');
                    $usermenu.find('a.navlink').removeClass('navlink-current');
                    $usermenu.find('a.navlink.orgBtn').addClass('navlink-current');
                };
                
                //init
                initTopDeparentment($wrapTmp,{
                    orgid: orgid,
                    name: orgname,
                    type: 'parent'
                });

                initContacts($tmp, {
                    id: tempId,
                    orgid: tempOrgid,
                    title: tempTitle,
                    type: tempType,
                    query: tempQuery,
                    page: tempPage,
                    size: tempSize
                });

                $contactsInner.off('scroll').scroll(function () {
                    var t = $(this).height(),
                        e = $(this)[0].scrollHeight;
                    if ($(this)[0].scrollTop + t + 150 >= e && $(this)[0].scrollTop != 0 && tempGoon) {
                        tempGoon = false;
                        $(this).scrollTop(0);
                        initContacts($tmp, {
                            id: tempId,
                            orgid: tempOrgid,
                            title: tempTitle,
                            type: tempType,
                            query: tempQuery,
                            page: ++tempPage,
                            size: tempSize
                        });
                    }
                });

                initDepartment($listTmpInner, {
                    status: 'onload',
                    type: 'parent',
                    parentid: parentid,
                    orgid: orgid
                }, true);

                // 获取屏幕的可见区域高度减去其他部分的高度
                $listTmpInner.height(document.body.clientHeight - 205);
                $contactsInner.height(document.body.clientHeight - 210);
                
                $contactsMenu.find('ul.menu-list li.item').removeClass('current');
                $contactsMenu.find('ul.menu-list li.item').filter('.item-'+ ((type) ? type : 'user') +'').addClass('current');
                $contactsBox.find(boxClass).show().siblings().hide();
                switch (type) {
                    case 'user':
                        $contactsForm.show();
                        if($listTmpInner.hasClass('dept-select-inner-department')){
                            $listTmpInner.removeClass('dept-select-inner-department').addClass('dept-select-inner-user');
                        }else{
                            $listTmpInner.removeClass('dept-select-inner-user').addClass('dept-select-inner-user');
                        }
                        break;
                    case 'import':
                        $contactsForm.hide();
                        break;
                    case 'department':
                        // 获取屏幕的可见区域高度减去其他部分的高度
                        $listTmpInner.height(document.body.clientHeight - 133);
                        $departmentInner.height(document.body.clientHeight - 170);
                        departments();
                        $contactsForm.hide();
                        if($listTmpInner.hasClass('dept-select-inner-user')){
                            $listTmpInner.removeClass('dept-select-inner-user').addClass('dept-select-inner-department');
                        }else{
                            $listTmpInner.removeClass('dept-select-inner-department').addClass('dept-select-inner-department');
                        }
                        break;
                    default:
                        $contactsForm.show();
                        break;
                }
            }
        },
        initContacts: initContacts,
        initDepartment: initDepartment,
        initTopDept: initTopDept
    };

    //检查是否空对象
    function isNullObj(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    //检查URL参数
    function checkUrlParams(params, loc) {
        if (!isNullObj(params)) {
            for (var x in params) {
                if (params[x] != '' && params[x] != null) {
                    delete loc.args.p;
                    loc.args[x] = params[x];
                } else {
                    delete loc.args[x];
                }
            }
        }
    }

    // 部门标题
    function setDeptTitle(o, title) {
        o.text(title);
    }

    //全选
    function selectUserAll(o) {
        o.on('click', function(e) {
            e.stopPropagation();
            var c = $(this);
            if (!c.hasClass('selected')) {
                c.addClass('selected').find('i').html('&#xe63d;');
                $tmp.find('tr td a.item').addClass('selected');
                $tmp.find('tr td a.item').find('i').html('&#xe63d;');
            } else {
                c.removeClass('selected').find('i').html('&#xe76a;');
                $tmp.find('tr td a.item').removeClass('selected');
                $tmp.find('tr td a.item').find('i').html('&#xe76a;');
            }
        });
    }
});