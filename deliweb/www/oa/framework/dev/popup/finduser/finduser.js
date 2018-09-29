'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $searchForm = $dom.find('.search-form'),
        $searchBox = $searchForm.find('.search-box'),
        $searchInput = $searchBox.find('input.search'),
        $searchBtn = $searchForm.find('a.btn-user-search'),
        $btnUserEnd= $dom.find('.btn-find-user-end'),
        $btnUserCancel = $dom.find('.btn-find-user-cancel'),
        $userMain = $dom.find('.user-box .user-main'),
        $tmpTable =  $userMain.find('.user-main-info table.user-main-table'),
        $tmp = $tmpTable.find('tbody.user-main-tbody'),
        $listTmp = $userMain.find('.user-main-nav .dept-select-list'),
        $wrapTmp = $listTmp.find('div.dept-select-wrap'),
        $dTmp = $listTmp.find('ul.dept-select-inner');
    var dataCache, tempOrgid;
    return {
        onload: function(params) {
            var userid = util.getCookie('userid'),
            token = util.getCookie('token');
            console.log("params", params);
            var type = params.type,data = params.data;
            // 搜索
            $searchBtn.off('click').on('click',function(e){
                e.stopPropagation();
                initContacts($tmp, {
                    type: 'parent',
                    query: $searchInput.val(),
                    orgid: data.orgid
                }, true, $listTmp);
            });

            $btnUserEnd.off('click').on('click',function(e){
                e.stopPropagation();
                console.log("~~~~~~~添加成员");
                var jsonData = [];
                $tmp.find('a.item.selected').each(function(i, o) {
                    jsonData.push(dataCache[$(o).parents('tr').index()]);
                });
                console.log("jsonData", jsonData);
                setFinduser($('#adduser .add-user .add-inner'), jsonData);
                kernel.closePopup('finduser');
            });

            $btnUserCancel.off('click').on('click',function(){
                kernel.closePopup('finduser');
            });

            // 直接处理dom
            function setFinduser(o, data){
                if(data && data[0]){
                    var $target = o,
                    $targetBase = $target.find('.add-form-base'),
                    $targetExtra = $target.find('.add-form-extra .extra-list');
                    $target.attr('data-userid', data[0].user_id);
                    $targetBase.find('input.username').val(data[0].name),
                    $targetBase.find('input.usermobile').val(data[0].mobile),
                    $targetBase.find('input.employee_num').val(data[0].employee_num);
                    $targetExtra.find('.extra-item-index input.business').val(data[0].title);
                    $targetExtra.find('.extra-item-index input.departmentId').val(data[0].department_id);
                    $targetExtra.find('.extra-item-index input.department').val(data[0].department);
                }
            }

            initDepartment($dTmp, {
                status: 'onload',
                type: 'parent',
                parentid: data.parentid,
                orgid: data.orgid,
                orgname: data.orgname
            });

            //初始化团队 及 团队子部门信息
            function initDepartment(o, data) {
                var status = data.status,
                    relation = data.type,
                    parentid = data.parentid,
                    orgid = data.orgid;
                // status = 'onload/loaded',  relation = 'parent/son', parentid = 355671868335718401, orgid = 363677081407586304;
                var id = (relation == 'parent') ? parentid : orgid;
                o.find('>').remove();
                util.ajaxSubmit({
                    type: 'get',
                    url: '/v1.0/org/department/' + id + '/departments',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: {},
                    success: function(res) {
                        var json = res.data.result;
                        if(data.type == 'parent'){
                            $wrapTmp.find('>').remove();
                            var $wrapTpl = $('<a class="item-info select-item" href="javascript:;" data-orgid="'+ data.orgid +'"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe61d;</i>'+ data.orgname +'</span></a>');
                            $wrapTmp.append($wrapTpl);
                            initUsers($wrapTpl, {
                                orgid: data.orgid,
                                title: data.orgname,
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
                                        tempOrgid = data.orgid;
                                        initContacts($tmp, {
                                            orgid: tempOrgid,
                                            title: data.title
                                        });
                                    }
                                });
                            }
                        }
                        for (var i = 0; i < res.data.result.length; i++) {
                            var $itemTpl = $('<li class="select-item clear" data-orgid="' + json[i].org_id + '" data-status="onload">\
                                    <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe641;</i><span class="text"><i class="iconfont item-class">&#xe661;</i>' + json[i].name + '</span></a>\
                                    <ul class="select-son-list clear"></ul>\
                                </li>');
                            o.append($itemTpl);
                            bindSon($itemTpl, {
                                orgid: json[i].id,
                                title: json[i].name
                            });

                            //加载团队子部门信息
                            function bindSon(o, data) {
                                o.find('a.item-info').on('click', function(e) {
                                    e.stopPropagation();
                                    var c = $(this),
                                        cLi = c.parent('.select-item');
                                    if (!cLi.hasClass('current')) {
                                        $listTmp.find('.select-item').removeClass('current');
                                        cLi.addClass('current');
                                        tempOrgid = data.orgid;
                                    }
                                    tempOrgid = data.orgid;
                                    if(type != 'department'){
                                        initContacts($tmp, {
                                            orgid: tempOrgid,
                                            title: data.title
                                        });
                                    }
                                    if (!(cLi.attr('data-status') == 'loaded')) {
                                        initDepartment(o.find('ul.select-son-list'), {
                                            status: 'onload',
                                            type: 'son',
                                            parentid: parentid,
                                            orgid: data.orgid
                                        });
                                        cLi.attr('data-status', 'loaded');
                                    }
                                });
                            }
                        }
                    }
                });
            }

            initContacts($tmp, {
                type: 'parent',
                orgid: data.orgid,
                title: data.orgname
            });

            // 初始化团队成员
            function initContacts(o, data, isQuery, os) {
                var initUrl = (isQuery && isQuery == true) ? '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users' : '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users';
                var initData = (isQuery && isQuery == true) ? {query:data.query} : {} ;
                o.find('>').remove();
                util.ajaxSubmit({
                    type: 'get',
                    url: initUrl,
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: initData,
                    success: function(res) {
                        //console.log("res",res);
                        var json = res.data.result;
                        dataCache = json;
                        if (json) {
                            if(isQuery && isQuery == true && os){
                                os.find('a.select-item, li.select-item').removeClass('current');
                                os.find('.dept-select-wrap a.item-info').addClass('current');
                            }
                            for (var i = 0; i < res.data.result.length; i++) {
                                var $itemTpl = $('<tr>\
                                    <td><a class="item" href="javascript:;" data-uid="' + json[i].user_id + '"><i class="iconfont">&#xe76a;</i></a></td>\
                                    <td>' + json[i].nickname + '</td>\
                                    <td>' + json[i].employee_num + '</td>\
                                    <td>' + json[i].department + '</td>\
                                    <td>' + json[i].title + '</td>\
                                    <td>' + json[i].mobile + '</td>\
                                </tr>');
                                o.append($itemTpl);
                                // checkbox 改为 radio
                                selectUser($itemTpl.find('a.item'), $tmpTable.find('.user-main-tbody'));
                                //选择成员
                                function selectUser(o, top) {
                                    o.on('click', function(e) {
                                        e.stopPropagation();
                                        var c = $(this);
                                        if (!c.hasClass('selected')) {
                                            top.find('a.item.selected').removeClass('selected').find('i').html('&#xe76a;');
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
                        } else {
                            var itemTpl = '<tr><td colspan="8" class="empty"></td></tr>';
                            o.append($(itemTpl));
                        }
                    }
                });
            }
        }
    };
});