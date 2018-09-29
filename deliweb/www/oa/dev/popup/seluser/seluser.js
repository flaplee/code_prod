'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util'], function(module, kernel, util) {
    var loc, type, keyword;
    var departmentid = util.getCookie('departmentid');
    var thisPopup = module.id.replace(/^[^/]+\/|\/[^/]+/g, ''),
        $dom = $('#' + thisPopup),
        $searchForm = $dom.find('.search-form'),
        $searchInput = $searchForm.find('input.search'),
        $searchBtn = $searchForm.find('a.btn-user-search'),
        $btnSetAdmin = $dom.find('.btn-edit-dept-setadmin'),
        $btnCancel = $dom.find('.btn-edit-dept-cancel'),
        $userTable = $dom.find('.user-main .user-main-innner .user-main-table .user-main-tbody');
    return {
        onload: function(params) {
            loc = kernel.parseHash(location.hash),
            type = loc.args.type,
            keyword = loc.args.key_search;
            var userid = util.getCookie('userid'), token = util.getCookie('token');
            console.log("params", params);
            var type = params.type, data = params.data;
            //关键字搜索
            $searchBtn.off('click').on("click", function(e) {
                e.preventDefault()
                initContacts($userTable, {
                    userid: userid,
                    token: token,
                    orgid: data.orgid,
                    query: $searchInput.val()
                }, true);
            });
            
            initContacts($userTable, {
                userid: userid,
                token: token,
                orgid: data.orgid
            });

            $btnSetAdmin.off('click').on('click',function(e){
                e.stopPropagation();
                var ids = [], names = [];
                $userTable.find('tr.main-item td input[name="director"]:checked').each(function(i, dom){
                    ids.push($(dom).attr('data-id'));
                    names.push($(dom).parents('.main-item').find('.main-item-name').text());
                });
                //设置部门主管 /v1.0/org/department/{department_id}/director
                util.ajaxSubmit({
                    type:'post',
                    url: '/v1.0/org/department/'+ data.orgid +'/director',
                    dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(userid, token, (new Date().valueOf())),
                    data: {
                        'director_ids': ids
                    },
                    success: function(res) {
                        if(res.code == 0){
                            kernel.hint('设置部门主管成功~', 3000);
                            kernel.closePopup('seluser');
                            //initDept();
                            var adminName = '';
                            $.each(names, function(i, n){
                                adminName += names[i];
                            });
                            if(data.adnull && data.adnull == true){
                                data.$target.html('<span class="item-admin-name">'+ adminName +'</span>(<em>主管</em>)')
                            }else{
                                data.$target.removeClass('null').addClass('item-admin').html('<span class="item-admin-name">'+ adminName +'</span>(<em>主管</em>)</span>');
                            }
                        }else{
                            kernel.hint(res.msg, 3000);
                        }
                    }
                });
            });

            $btnCancel.off('click').on('click',function(){
                kernel.closePopup('seluser');
            });
        }
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

    // 初始化组织数据
    function initDept(o, data){
        util.ajaxSubmit({
            type:'get',
            url: '/v1.0/org/department/'+ data.orgid +'/departments',
            data: {},
            success: function(res) {
                var json = res.data.result;
                if(json.length > 0){
                    o.append($('<ul class="item-select-inner-son"></ul>'));
                    for(var i = 0;i < json.length; i++){
                        var $temp  = $('<li class="select-item clear" data-orgid="'+ json[i].id +'">\
                            <div class="item-info clear" data-status="onload">\
                                <div class="item-text fl">\
                                    <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+ json[i].name +'</span><span class="item-count">(<em>10人</em>)</span></span>/<span class="item-admin">'+ json[i].directors[0].name +'(<em>主管</em>)</span>\
                                </div>\
                                <div class="item-setup fr">\
                                    <a class="setup-admin" title="设置主管" href="javascript:;"><i class="iconfont">&#xe634;</i></a>\
                                    <a class="setup-rename" title="重命名" href="javascript:;"><i class="iconfont">&#xe618;</i></a>\
                                    <a class="setup-add" title="添加子部门" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>\
                                    <a class="setup-del" title="删除部门" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>\
                                </div>\
                            </div>\
                            <ul class="item-select-inner-son" data-status="onload">\
                            </ul>\
                        </li>');
                        o.find('ul.item-select-inner-son').append($(temp));
                        bindDept($(temp),{
                            'orgid':json[i].id
                        });
                        // 绑定组织数据
                        function bindDept(o, data){
                            o.find('a.item-info').on('click',function(e){
                                e.stopPropagation();
                                initDept(o, data.orgid);
                            });
                        }
                    }
                }else{

                }
            }
        });
    }

    // 加载团队成员信息
    function initContacts(o, data, isQuery) {
        var initUrl = (isQuery && isQuery == true) ? '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users' : '/v1.0/org'+ ((data.type && data.type == 'parent') ? '': '/department') +'/' + data.orgid + '/users';
        var initData = (isQuery && isQuery == true) ? {q:data.query} : {} ;
        o.find('>').remove();
        util.ajaxSubmit({
            type: 'get',
            url: initUrl,
            dauth: data.userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(data.userid, data.token, (new Date().valueOf())),
            data: initData,
            success: function(res) {
                //console.log("res",res);
                var json = res.data.result;
                if (json) {
                    for (var i = 0; i < res.data.result.length; i++) {
                        var departmentText = (json[i].org_id == json[i].department_id) ? '' : json[i].department;
                        var $itemTpl = $('<tr class="main-item" data-id="' + json[i].user_id + '">\
                            <td><input class="main-item-radio" name="director" type="checkbox"  data-id="' + json[i].user_id + '"/></td>\
                            <td class="main-item-name">' + json[i].nickname + '</td>\
                            <td>' + json[i].employee_num + '</td>\
                            <td>' + departmentText + '</td>\
                            <td>' + json[i].title + '</td>\
                            <td>' + json[i].mobile + '</td>\
                        </tr>');
                        o.append($itemTpl);
                        /*selectUser($itemTpl.find('a.item'));

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
                        }*/
                    }
                } else {
                    var itemTpl = '<tr><td colspan="8" class="empty"></td></tr>';
                    o.append($(itemTpl));
                }
            }
        });
    };
});