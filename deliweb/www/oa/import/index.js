'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'page/imports/member', 'page/imports/steps'], function(module, kernel, util, member, steps) {
    var loc, type, keyword;
    var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    /*kernel.appendCss(require.toUrl("common/ztree/css/metroStyle/metroStyle.css"));*/
    var $imports = $('#imports'),
        $importsMenu = $imports.find('.imports-menu'),
        $importsForm = $importsMenu.find('.search-form'),
        $importsSearch = $importsForm.find('.search-box input.search'),
        $searchBtn = $importsForm.find('.search-box a.btn-user-search'),
        $importsBox = $imports.find('.imports-box'),
        $importsInfo = $importsBox.find('.imports-info'),
        $moveUser = $importsInfo.find('.btn-user-dept'),
        $removeUser = $importsInfo.find('.btn-user-remove'),
        $deleteUser = $importsInfo.find('.btn-user-delete'),
        $addUser = $importsInfo.find('.btn-user-add'),
        $importsTable = $importsInfo.find('.imports-inner .table'),
        $tmp = $importsTable.find('.tbody');
    var dataCache;

    // 左侧菜单导航
    $importsMenu.find('.menu-list .item a.item-menu').on('click', function(e) {
        e.stopPropagation();
        var c = $(this).parent('li');
        if (!c.hasClass('current')) {
            c.siblings('li').removeClass('current');
            c.addClass('current');
        }
    });

    //关键字搜索
    /*$importsForm.on("submit", "form", function(e) {
        e.preventDefault()
        var loc = kernel.parseHash(location.hash);
        var params = {};
        params.key_search = $importsSearch.val();
        checkUrlParams(params, loc);
        kernel.replaceLocation(loc);
    });*/

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

    //移动到其他部门
    $moveUser.on('click', function() {
        var uids = [];
        $importsTable.find('tbody.tbody tr td a.item.selected').each(function(i, dom) {
            uids.push($(dom).attr('data-uid'));
        });
        if (uids.length > 0) {
            // 选择部门
            kernel.openPopup('adddept', {
                type: 'adddept',
                data: {
                    "org_id": '350236083323142144',
                    "user_ids": uids
                }
            });
        } else {
            kernel.hint('请选择要移动的人员~');
        }
    });

    //从本部门移除
    $removeUser.on('click', function() {
        var uids = [];
        $importsTable.find('tbody.tbody tr td a.item.selected').each(function(i, dom) {
            uids.push($(dom).attr('data-uid'));
        });
        if (uids.length > 0) {
            // 将人员从团队组织中删除 /v1.0/org/user/delete
            util.ajaxSubmit({
                type: 'post',
                url: '/v1.0/org/user/delete',
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {
                    "user_ids": uids,
                    "org_id": '350236083323142144'
                },
                success: function(res) {
                    console.log("res", res);
                }
            });
        } else {
            kernel.hint('请选择要从本部门移除的人员~');
        }
    });

    //彻底删除
    $deleteUser.on('click', function() {
        var uids = [];
        $importsTable.find('tbody.tbody tr td a.item.selected').each(function(i, dom) {
            uids.push($(dom).attr('data-uid'));
        });
        if (uids.length > 0) {
            kernel.openPopup('deluser', {
                type: 'user',
                data: {
                    org_id: '350236083323142144',
                    user_ids: uids,
                    title: '是否将 匡勇、李娜 等3名成员',
                    sub: '从 得力团队 通讯录中彻底删除？'
                }
            });
            // 将人员从团队组织中删除 /v1.0/org/user/delete
            /*util.ajaxSubmit({
                type: 'post',
                url: '/v1.0/org/user/delete',
                dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
                data: {
                    "user_ids": [350305795163815936],
                    "org_id": 350236083323142144
                },
                success: function(res) {
                    console.log("res", res);
                }
            });*/
        } else {
            kernel.hint('请选择要彻底删除的人员~');
        }
    });

    // 添加成员
    $addUser.on('click', function() {
        kernel.openPanel('adduser', {
            type: 'add',
            data: {}
        });
    });

    // 查看我的通讯录 /v1.0/address_book/my  //查看团队下所有成员信息 /v1.0/org/{org_id}/users?q={keyword} 
    //initimports($tmp, orgid);

    // 初始化通讯录
    function initimports(o, orgid) {
        o.find('>').remove();
        util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/org/' + orgid + '/users',
            dauth: userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token),
            data: {},
            success: function(res) {
                //console.log("res",res);
                var json = res.data.result;
                dataCache = json;
                for (var i = 0; i < res.data.result.length; i++) {
                    var userText = (json[i].is_department_admin == true) ? '部门管理员' : '普通用户';
                    var itemTpl = '<tr>\
                        <td><a class="item" href="javascript:;" data-uid="' + json[i].user_id + '"><i class="iconfont">&#xe76a;</i></a></td>\
                        <td>' + json[i].name + '</td>\
                        <td>' + json[i].nickname + '</td>\
                        <td>' + json[i].employee_num + '</td>\
                        <td>' + json[i].department + '</td>\
                        <td>' + json[i].title + '</td>\
                        <td>' + userText + '</td>\
                        <td>\
                            <button data-index="' + i + '" type="button" class="btn btn-primary btn-sm btn-user-edit">编辑</button>\
                            <button data-index="' + i + '" type="button" class="btn btn-default btn-sm btn-user-delete">删除</button>\
                        </td>\
                    </tr>';
                    $tmp.append($(itemTpl));
                }
                selectUserAll($importsTable.find('.thead .select-all'));
                selectUser($tmp.find('a.item'));
                setUserEdit($tmp.find('.btn-user-edit'));
                setUserDelete($tmp.find('.btn-user-delete'));
            }
        });
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

    //编辑成员
    function setUserEdit(o) {
        o.on('click', function() {
            kernel.openPanel('adduser', {
                type: 'edit',
                data: dataCache[$(this).attr('data-index')]
            });
        });
    }

    //删除成员
    function setUserDelete(o) {
        o.on('click', function() {
            kernel.openPopup('deluser', {
                type: 'user',
                data: {
                    orgid: '1234',
                    ids: ['123', '123', '123'],
                    title: '是否将 匡勇、李娜 等3名成员',
                    sub: '从 得力团队 通讯录中彻底删除？'
                }
            });
        });
    }


    // 搜索我的通讯录 /v1.0/address_book/search?q={keyword}&org_id={org_id}



    // test api 查看团队一级部门信息 /v1.0/org/355671868335718401/departments  

    //部门
    var $addDept = $('.btn-dept-add');
    var $reNameDept = $('.btn-dept-add');

    /* 部门管理 */
    //添加部门
    $addDept.on('click', function() {
        kernel.openPopup('editdept', {
            type: 'editdept',
            data: {
                id: '123456'
            }
        });
    });


    //test treeMenu

    /*var data = {"code":0,"msg":null,"data":{"result":[{"id":355678628404527104,"update_time":1504841993201,"name":"得力iOS技术部","child_dept_cnt":3,"code":"355671868335718401_355678628404527104","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544]},{"id":355678749540220928,"update_time":1504842022082,"name":"得力iOS产品部","child_dept_cnt":4,"code":"355671868335718401_355678749540220928","org_id":355671868335718400,"parent_id":355671868335718401,"status":1,"admin_ids":[355672617635545088,362618666346348544,355672617635545088,362618666346348544]},{"id":355763306545283072,"update_time":1505898146223,"name":"得力人力资源部","child_dept_cnt":3,"code":"355763306545283072","org_id":355671868335718400,"parent_id":355671868335718401,"status":0},{"id":357224821521645568,"update_time":1505210634367,"name":"得力产品部","child_dept_cnt":3,"code":"355671868335718401_357224821521645568","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":357225954084388864,"update_time":1505210904391,"name":"得力财务部","child_dept_cnt":3,"code":"355671868335718401_357225954084388864","org_id":355671868335718400,"parent_id":355671868335718401,"status":1},{"id":376070297540886528,"update_time":1509703745958,"name":"text1","child_dept_cnt":0,"code":"355671868335718401_376070297540886528","org_id":355671868335718400,"parent_id":355671868335718401,"status":1}]}};
    var treeMenu = data.data.result;
    var zTreeObj;
    var setting = {};
    var zNodes = [
        {name:"test1", open:true, children:[{name:"test1_1"}, {name:"test1_2"}]},
        {name:"test2", open:true, children:[{name:"test2_1"}, {name:"test2_2"}]}
    ];
    zTreeObj = $.fn.zTree.init($("#treeMenu"), setting, treeMenu);*/

    var setTreeMenu = function(id) {
        var curStatus = "init",
            curAsyncCount = 0,
            goAsync = false;
        var setting = {
            async: {
                enable: true,
                url: "/v1.0/org/department/" + id + "/departments",
                autoParam: ["id", "name=n", "level=lv"],
                otherParam: {
                    "otherParam": "zTreeAsyncTest"
                },
                dataFilter: filter,
                type: "get"
            },
            callback: {
                beforeAsync: beforeAsync,
                onAsyncSuccess: onAsyncSuccess,
                beforeClick: function(treeId, treeNode) {
                    console.log("treeNode", treeNode);
                    //initimports($tmp, treeNode.org_id);
                    /* var zTree = $.fn.zTree.getZTreeObj("treeMenu");
                    if (treeNode.isParent) {
                        zTree.expandNode(treeNode);
                        return false;
                    } else {
                        return true;
                    }*/


                }
            }
        };
        $.fn.zTree.init($("#treeMenu"), setting);

        function filter(treeId, parentNode, childNodes) {
            if (!childNodes) return null;
            var nodes = childNodes.data.result;
            for (var i = 0, l = childNodes.length; i < l; i++) {
                nodes[i].name = nodes[i].name.replace(/\.n/g, '.');
            }
            return nodes;
        }

        function beforeAsync() {
            curAsyncCount++;
        }

        function onAsyncSuccess(event, treeId, treeNode, msg) {
            //alert(treeNode);
            curAsyncCount--;
            if (curStatus == "expand") {
                expandNodes(treeNode.children);
            } else if (curStatus == "async") {
                asyncNodes(treeNode.children);
            }
            if (curAsyncCount <= 0) {
                curStatus = "";
            }
        }

        function expandNodes(nodes) {
            if (!nodes) return;
            curStatus = "expand";
            var zTree = $.fn.zTree.getZTreeObj("treeMenu");
            for (var i = 0, l = nodes.length; i < l; i++) {
                zTree.expandNode(nodes[i], true, false, false); //展开节点就会调用后台查询子节点  
                if (nodes[i].isParent && nodes[i].zAsync) {
                    expandNodes(nodes[i].children); //递归  
                } else {
                    goAsync = true;
                }
            }
        }

        function asyncNodes(nodes) {
            if (!nodes) return;
            util.ajaxSubmit({
                type: 'post',
                url: '/v1.0/org/department/355671868335718401/departments',
                data: {
                    "director_ids": [349944153787858944]
                },
                success: function(res) {
                    console.log("res", res);
                }
            });
        }

        function check() {
            if (curAsyncCount > 0) {
                return false;
            }
            return true;
        }
    };

    //setTreeMenu('355671868335718401');
    return {
        onload: function(force) {
            var $importsBox = $('#imports .imports-box'),
                boxClass;
            loc = kernel.parseHash(location.hash),
                type = loc.args.type,
                keyword = loc.args.key_search;
            boxClass = type ? '.' + type + '-info' : '.user-info';
            $importsBox.find(boxClass).show().siblings().hide();
            switch (type) {
                case 'user':
                    $importsForm.show();
                    break;
                case 'import':
                    $importsForm.hide();
                    break;
                case 'department':
                    $importsForm.hide();
                    break;
                default:
                    $importsForm.show();
                    break;
            }
        }
    };
});