'use strict';
define(['common/kernel/kernel', 'site/util/util', 'common/text/text!page/contacts/department.html!strip'], function(kernel, util, html) {
    var userid, token, orgid, parentid, orgname, loc, locid;
    var dom = $(html), $contacts = $('#contacts .contacts-box');
    $contacts.append($(dom));
    var $deptTitle = $(dom).find('.department-form .form-title'),
        $deptBtnAdd = $(dom).find('.department-form .form-btns .btn-dept-add'),
        $deptInner = $(dom).find('.department-inner'),
        $deptList = $deptInner.find('.department-list .department-list-inner');    
    return function() {
        userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        orgname = util.getCookie('orgname'),
        parentid = util.getCookie('parentid'),
        loc = kernel.parseHash(location.hash),
        locid = loc.id;
        if(locid == 'contacts'){
            var $usermenu = $('#header .user-head .nav-top .nav-item');
            $usermenu.find('a.navlink').removeClass('navlink-current');
            $usermenu.find('a.navlink.orgBtn').addClass('navlink-current');
            initTopDept($deptList, {
                status: 'onload',
                relation: 'parent',
                orgid: orgid,
                orgname: orgname,
                parentid: parentid, //'355671868335718401'
                index: 0
            });
            
            //初始化组织
            function initTopDept(o, data){
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
                    orgid: id, //data.orgid
                    title: data.orgname,
                    index: index,
                    relation: relation
                });
            }

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
                                var directorHtml = (json[i].directors && json[i].directors[0].name) ? '<span class="item-admin"><span class="item-admin-name">'+ json[i].directors[0].name +'</span>(<em>主管</em>)</span>' : '<span class="null">空缺</span>';
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
                                    relation: data.relation,
                                    name: json[i].name
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

                                       /* var $dom = (data.relation == 'parent') ? $deptList : $info;
                                        if($dom.attr('data-status') == 'onload'){
                                            $dom.attr('data-status','loaded');
                                            initDeps($son,{
                                                orgid : data.orgid,
                                                title : data.name,
                                                index: data.index + 1 
                                            });
                                        }*/

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

                                    //设置部门主管 item-admin
                                    o.on('click', '.item-setup .setup-admin', function (e) {
                                        //e.stopPropagation();
                                        var c = $(this).parent('.item-setup').parent('.item-info');
                                        setCurrent($deptList, c, function(){
                                            kernel.openPopup('seluser', {
                                                type: 'seluser',
                                                data: {
                                                    orgid: data.orgid,
                                                    adnull: ((c.find('.item-text .item-admin').length > 0) ? true : false),
                                                    $target: $(((c.find('.item-text .item-admin').length > 0) ? c.find('.item-text .item-admin') : c.find('.item-text .null')))
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
                                                    name: c.find('.item-text span.text .item-name').text(),
                                                },
                                                $target: $(c.find('.item-text span.text .item-name'))
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
                                                    name: ''
                                                },
                                                func: function(){
                                                    initTopDept($deptList, {
                                                        status: 'onload',
                                                        relation: 'parent',
                                                        orgid: orgid,
                                                        orgname: orgname,
                                                        parentid: parentid,
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
                                                    //update 20180304 orgid、parentid置换
                                                    initTopDept($deptList,{
                                                        status: 'onload',
                                                        relation: 'parent',
                                                        orgid: orgid,
                                                        orgname: orgname,
                                                        parentid: parentid, //'355671868335718401'
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
                            // 当前组织无部门时
                            if(data.relation == 'parent'){
                                o.find('>').remove();
                                var emptyTpl = '<li class="empty empty-dept"><div class="empty-item empty-item-dept"><div class="empty-img empty-img-dept"></div><p class="empty-text">暂无部门</p></div></li>';
                                o.append($(emptyTpl));
                            }
                        }
                    }
                });
            }
        };
    }
});