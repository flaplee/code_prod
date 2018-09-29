'use strict';
define(['common/kernel/kernel', 'site/util/util'], function(kernel, util) {
    var $userlist = $('#header .user-head .nav-top .nav-top-list'),
        $usermenu = $userlist.find('.nav-item'),
        $userteam = $userlist.find('.nav-item-team'),
        $userpanel = $userlist.find('.nav-item-login'),
        $userlogout = $userpanel.find('.nologin'),
        $userlogin = $userpanel.find('.userBtn');
    // ie8 圆角
    if(window.PIE && (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0")){
        $(".nav-item-current").each(function(){
            PIE.attach(this)
        });
        $(".user-wrap").each(function(){
            PIE.attach(this)
        });
        $(".son-nav-list").each(function(){
            PIE.attach(this)
        });
        $(".user-panel").each(function(){
            PIE.attach(this)
        });       
        $(".user-info-avatar").each(function(){
            PIE.attach(this)
        });

        $(".userinfo-avatar").each(function(){
            PIE.attach(this)
        });
    }
    // 顶部导航
    $usermenu.find('a.navlink').on('click',function(e){
        e.stopPropagation();
        var c = $(this);
        if(!c.hasClass('navlink-current')){
            c.parent('li.nav-item').siblings('li').find('>a.navlink').removeClass('navlink-current');
            c.addClass('navlink-current');
        }
    });

    $(document).on('scroll', function() {
        if($(this).scrollTop() > $('#header').height()) {
            $('#header .user-head').addClass('user-head-fixed')
        } else {
            $('#header .user-head').removeClass('user-head-fixed')
        }
    })

    // 我的组织下拉
    $(document).on("mouseover", "li.nav-item-team", function() {
        $("li.nav-item-team .son-nav-wrap").show();       
    })
    $(document).on("mouseout", "li.nav-item-team", function() {
        $("li.nav-item-team .son-nav-wrap").hide();
    })

    $userteam.find('.son-nav-wrap a.sub-nav-item').on('click',function(e){
        var e= e || window.e;
        e.stopPropagation();
        var c = $(this), pid = c.attr('data-pid');
        if(!c.hasClass('current')){
            c.siblings().removeClass('current');
            c.addClass('current');
        }
        $(".son-nav-wrap").hide();
        util.setCookie('parentid', pid);
    });

    // 用户提出
    $userlogin.find('a.logout').on('click', function(e){
        var e = e || window.e;
        e.stopPropagation();
        var uid = util.getUserData().id,
            token = util.getUserData().token;
        // 用户退出 /web/v1.0/cd/logout/web
        /*util.ajaxSubmit({
            type: 'get',
            url: '/v1.0/cd/logout/web',
            dauth: uid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(uid, token, (new Date().valueOf())),
            data: {
                type: 'group'
            },
            success: function(json) {
                if (json.code == 0) {
                    util.delCookie('userid', undefined),
                    util.delCookie('token', undefined),
                    util.delCookie('orgid', undefined),
                    util.delCookie('parentid', undefined);
                    util.setUserData(undefined, true);
                    //kernel.reloadPage('loginhome');
                    window.location.reload();
                } else {
                    kernel.hint(json.msg, 'error');
                }
            }
        });*/
        util.delCookie('userid', undefined),
        util.delCookie('token', undefined),
        util.delCookie('orgid', undefined),
        util.delCookie('orgindex', undefined),
        util.delCookie('orgindexid', undefined),
        util.delCookie('parentid', undefined),
        util.delCookie('orgname', undefined),
        util.delCookie('device_ids', undefined),
        util.delCookie('app_ids', undefined),
        util.delCookie('employee_count', undefined),
        util.setUserData(undefined, true);
        kernel.replaceLocation({'args': {},'id': 'loginhome'});
        $('.loginQr').trigger('click');
    });

    //statechange({});

    var historyNav;
    
    //百度统计代码
    /*if (location.host === 'your_production_host') {
        window._hmt = [
            ['_setAutoPageview', false]
        ];
        require(['//hm.baidu.com/hm.js?[your_hmid]'], function() {
            //由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
            var ipt = head.getElementsByTagName('input')[0];
            if (ipt) {
                head.removeChild(ipt);
            }
        });
    }

    kernel.listeners.add(kernel.pageEvents, 'route', function() {
        historyNav = history.state;
        history.replaceState && history.replaceState(true, null);
        //百度统计接口
        if (window._hmt && _hmt.push) {
            _hmt.push(['_trackPageview', '/' + kernel.buildHash(kernel.location)]);
        }
    });*/

    //在获取用户数据后启动路由
    util.updateUserData(util.getCookie('userid'), util.getCookie('token'),function (data) {
        // init home 
        kernel.init('home');
    });
    

    // init home 
    //kernel.init('home');

    kernel.listeners.add(util.userEvents, 'statechange', statechange);
    kernel.listeners.add(util.userEvents, 'datachange', datachange);
    kernel.listeners.add(util.userEvents, 'pagechange', pagechange);

    kernel.listeners.add(kernel.pageEvents, 'routend', function() {
        var h;
        //如果上次访问的页面id和当前页id不同，并且不是在history中导航时，则滚动到页面顶部
        if (kernel.lastLocation && kernel.lastLocation.id !== kernel.location.id && !historyNav) {
            h = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            if (h > 0) {
                $('html,body').animate({
                    scrollTop: 0
                }, h);
            }
        }
    });
    function showCg(data) {}

    function statechange(evt) {
        //showCg(evt.data);
        if(evt.data){
            datachange(evt);
            $userlogout.hide();
            $userlogin.addClass('hasLogin');
            $userlogin.show();
        }else {
            $userlogout.show();
            $userlogin.removeClass('hasLogin');
            $userlogin.hide();
        }

        if(evt.data){
            $userteam.show();
        }else{
            $userteam.hide();
        }
    }
    
    function datachange(evt) {
        if(evt.data && evt.data.data){
            $userlogin.find('.user-wrap img.user-info-avatar').prop('src', evt.data.data.avatar_url);
            $userlogin.find('.user-panel >.user-info >.userinfo-name-box b').text(evt.data.data.name);
            $userlogin.find('.user-panel >.user-info img').prop('src', evt.data.data.avatar_url);
        }
        orgdatachange(evt);
    }

    function orgdatachange(evt){
        var index = parseInt(util.getCookie('orgindex') ? util.getCookie('orgindex') : 0), indexnum = 0, indexid = util.getCookie('orgindexid'), indexdata = evt.data.organization;
        for(var i = 0;i < indexdata.length;i++){
            if(indexdata[i].org_id == indexid){
                index = i;
                util.setCookie('orgindex', i);
                indexnum ++;
            }
        }

        if(indexid && indexdata && indexnum <= 0)index = -1;
        
        if(index >= 0 && evt.data.organization && evt.data.organization.length > 0 && evt.data.organization[index]){
            $('a.nav-item-current .navlink-name').text(evt.data.organization[index].org_name);
            $('.nav-item-team .son-nav-wrap .son-nav-list-team').find('>').remove();
            //update 20180522
            evt.data.orgindex = index;
            if(evt.data.organization[evt.data.orgindex].org_id != evt.data.orgindexid){
                evt.data.orgindexid = evt.data.organization[evt.data.orgindex].org_id;
            }
            pagechange(evt);
            $.each(evt.data.organization, function(i, item) {
                var $targetHtml = $('<a class="sub-nav-item '+ ((evt.data.organization[index].org_id == item.org_id) ? 'current' : '') +'"  href="javascript:;" data-oid="' + item.org_id + '" data-pid="' + item.top_department_id + '">' + item.org_name + '</a>');
                $('.nav-item-team .son-nav-wrap .son-nav-list-team').append($targetHtml);
                return function(){
                    // 切换组织
                    $targetHtml.on('click', function(e) {
                        var e = e || window.e;
                        e.stopPropagation();
                        var c = $(this), oname = c.text();
                        if(!c.hasClass('current')){
                            $targetHtml.parents('.nav-item-team').find('a.nav-item-current .navlink-name').text(oname);
                            c.siblings().removeClass('current');
                            c.addClass('current');
                            // update 20180308 更新相应数据
                            evt.data.orgindex = c.index();
                            util.setCookie('orgindex', evt.data.orgindex);
                            util.setCookie('orgindexid', evt.data.organization[evt.data.orgindex].org_id);
                            // update 20180313 更新相应数据
                            util.setUserData(evt.data);
                            if(kernel.parseHash(location.hash).id == 'imports' && kernel.parseHash(location.hash).args.id) kernel.replaceLocation({'args':{},'id':'imports'});
                            pagechange(evt);
                        }
                        $('.nav-item-team .son-nav-wrap').hide();
                    });
                }();
            });
        }else{
            $userlogin.find('a.logout').trigger('click');
        }
    }

    function pagechange(evt){
        util.setCookie('userid', evt.data.data.id),
        util.setCookie('orgid', evt.data.organization[evt.data.orgindex].org_id),
        util.setCookie('parentid', evt.data.organization[evt.data.orgindex].top_department_id),
        util.setCookie('orgname', evt.data.organization[evt.data.orgindex].org_name),
        util.setCookie('device_ids', (evt.data.organization[evt.data.orgindex].device_ids ? evt.data.organization[evt.data.orgindex].device_ids.length : 0)),
        util.setCookie('app_ids', (evt.data.organization[evt.data.orgindex].app_ids ? evt.data.organization[evt.data.orgindex].app_ids.length : 0)),
        util.setCookie('employee_count', evt.data.organization[evt.data.orgindex].employee_count),
        kernel.reloadPage(kernel.parseHash(location.hash).id);
    }
});