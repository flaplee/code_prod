'use strict';
define(['common/kernel/kernel', 'site/util/util',  'page/imports/member', 'common/text/text!page/imports/steps.html!strip'], function(kernel, util, member, html) {
    var loc = kernel.parseHash(location.hash), task_id = loc.args.id;
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid'),
        scnt = 0, fcnt = 0, importStatus = 0, isImport = false, ws = [], timer = [], sid = [], supWebsocket = (!!window.WebSocket && window.WebSocket.prototype.send);
    var $menuImport = $('#imports .imports-menu .menu-list .menu-manage-import'),
        $imports = $('#imports .imports-box'),
        $importsInfo = $imports.find('.imports-info'),
        $importsSteps = $imports.find('.imports-steps'),
        $importsCrumbs = $importsInfo.find('.imports-crumbs'),
        $importsCrumbsUser = $importsCrumbs.find('.imports-crumbs-user'),
        $importsCrumbsInfo = $importsCrumbs.find('.imports-crumbs-info'),
        $importsInner = $importsInfo.find('.imports-inner'),
        $importsNav = $importsInner.find('.imports-inner-data .imports-nav a'),
        $importsTable = $importsInner.find('.imports-inner-data .imports-table'),
        $reUploadBtn = $importsInner.find('.imports-upload button.btn-upload'),
        $scntBtn = $importsInner.find('.imports-nav a.nav-enable'),
        $fcntBtn = $importsInner.find('.imports-nav a.nav-unable'),
        $tableWrap = $importsInner.find('.imports-inner-data .imports-table .table-data-wrap'),
        $scntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-enable .table-data-wrap table.table-data tbody.tbody'),
        $fcntTarget = $importsInner.find('.imports-inner-data .imports-table .imports-table-unable .table-data-wrap table.table-data tbody.tbody');
    var $dom = $(html),
        $downloadBtn = $dom.find('.btn-step-download'),
        $uploadBtn = $dom.find('.btn-step-upload'),
        $uploadForm = $dom.find('#upload-form'),
        $uploadHideBtn = $dom.find('#upload-file');
        $imports.append($dom);

    resetUploadFile();

    $menuImport.on('click', function(e){
        e.preventDefault();
        loc = {'id':'imports','args':{'type':'info'}};
        resetUploadFile();
        kernel.replaceLocation(loc);
    });

    $uploadForm.on('change','#upload-file', function(){
        ajaxFileUpload();
        $tableWrap.height(document.body.clientHeight - 376);
        if(kernel.parseHash(location.hash).args.p && kernel.parseHash(location.hash).args.p != 1){
        }
    });

    $importsCrumbsUser.on('click', function(e){
        e.stopPropagation();
        loc = {'args':{},'id':'imports'};
        resetUploadFile();
        kernel.replaceLocation(loc);
    });

    $importsCrumbsInfo.on('click', function(e){
        e.stopPropagation();
        loc.args.status = 'data';
        resetUploadFile();
        kernel.replaceLocation(loc);
    });

    // 上传文件
    function ajaxFileUpload() {
        var loc = kernel.parseHash(location.hash);
        var userid = util.getCookie('userid'),
            token = util.getCookie('token'),
            orgid = util.getCookie('orgid');
        var timestamp = (new Date().valueOf()).toString();
        $.ajaxFileUpload({
            url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'upload-file', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            beforeSend:function(xhr){
                xhr.setRequestHeader('Duagent', '_web');
                xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
            },
            ajaxSend:function(xhr){
                xhr.setRequestHeader('Duagent', '_web');
                xhr.setRequestHeader("Dauth", userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp));
            },
            data: {
                org_id: orgid,
                Duagent: '_web',
                Dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp)
            },
            success: function (res, status)  //服务器成功响应处理函数
            {
                //kernel.hideLoading();
                if(res && res.responseText){
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        $('#upload-file').val('');
                        var data = json.data['result'];
                        if(data && data.ws_session_id){
                            webSocketInit(sid, data, $('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'), function(){
                                sid.splice($.inArray(data.ws_session_id, sid), 1);
                            });
                        }
                    }else{
                        //kernel.hideLoading();
                        isImport = false;
                        //loc.args.type = 'steps';
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                        kernel.replaceLocation(loc);
                    }
                }else{
                    kernel.hint('网络异常，请稍后再试', 'error');
                }
            },
            error: function (res, status, e)//服务器响应失败处理函数
            {
                if(res && res.responseText){
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        isImport = true;
                        $('#upload-file').val('');
                        var data = json.data['result'];
                        if(data && data.ws_session_id){
                            webSocketInit(sid, data, $('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'), function(){
                                sid.splice($.inArray(data.ws_session_id, sid), 1);
                            });
                        }
                    }else{
                        isImport = false;
                        loc.args.status = 'error';
                        kernel.hint(json.msg, 'error');
                        if(json.code == '9103101'){
                            $importsInner.find('p.user-error-title').hide();
                            $importsInner.find('p.authority-error-title').show();
                        }else{
                            $importsInner.find('p.user-error-title').show();
                            $importsInner.find('p.authority-error-title').hide();
                        }
                        kernel.replaceLocation(loc);
                    }
                }else{
                    kernel.hint('网络异常，请稍后再试', 'error');
                }
            }
        });
        return false;
    }

    // 处理上传表格数据
    function setTargetHtml(o, type, status, data, count, callback){
        if(status == 0){
            o.find('>').remove();
            if(type == 'enable'){
                kernel.hint('导入完成');
                loc.args.status = 'success';
                kernel.replaceLocation(loc);
            }else{
                kernel.hint('导入失败', 'error');
                loc.args.status = 'error';
                kernel.replaceLocation(loc);
            }
        }
        if(data && data.length > 0){
            if(typeof callback === 'function'){
                callback();
            }
            var targetHtml = '';
            if(data.length != 0){
                var iCount = count + data.length;
                (type == 'enable') ? $scntBtn.find('span.nav-enable-num').text(iCount) : $fcntBtn.find('span.nav-unable-num').text(iCount);
            }
            $.each(data, function(i, n){
                targetHtml += '<tr>\
                    <td class="user-index">'+ (i + count + 1) +'</td>\
                    <td class="user-name"><p>'+ data[i].name +'</p></td>\
                    <td class="user-employeenum">'+ data[i].employee_num +'</td>\
                    <td class="user-deptname" title="'+ data[i].dept_name +'"><p>'+ data[i].dept_name +'</p></td>\
                    <td class="user-title" title="'+ data[i].title +'"><p>'+ data[i].title +'</p></td>\
                    <td class="user-mobile">'+ data[i].mobile +'</td>\
                    '+ ((type && type == 'unable') ? '<td class="user-error"><span class="red">'+ ((data[i].msg && data[i].msg != '') ? data[i].msg : '不可导入') +'</span></td>' : '') +'\
                </tr>';
            });
            o.append(targetHtml);
        }
    }

    // webSocket
    function webSocketInit(id, session, $target, callback){
        var wsid = session.ws_session.session_id, index = $.inArray(wsid, id), len = sid.length;
        if(index < 0){
            ws.push("");
            index = ws.length;
        };
        if (typeof WebSocket != 'undefined'){
            // 打开一个 web socket
            ws[index] = new WebSocket(session.ws_session.ws_url);
            ws[index].onopen = function(){
                //console.log("已连接上");
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws[index].send('{"cmd": "register","data": "'+ wsid +'"}');
            };
            ws[index].onmessage = function(evt){
                var json = JSON.parse(evt.data);
                console.log("json", json);
                if(json){
                    if($.inArray(wsid, sid) >= 0){
                        var wstype = (json.status) ? (($.inArray(wsid, sid) >= 0) ? 'push' : 'unpush') :'unpush';
                        if(($.inArray(wsid, sid) >= 0)) sid.push(wsid);
                        setRecordTask($target, json, wstype, (($.inArray(wsid, sid) >= 0) ? $.inArray(wsid, sid) : 0));
                        if(ws[index]){ws[index].close();sid.splice($.inArray(wsid, sid), 1);ws.splice(index, 1);};
                    }else{
                        var timestamp = (new Date().valueOf()).toString();
                        setRecordTask($target, session, 'increased');
                        if(json.status && json.status == 1){if(ws[index]){ws[index].close();}}
                        sid.push(wsid);
                    }
                    if(!kernel.parseHash(location.hash).args.p && $target.find('.record-item').length >= 5){
                        util.paging($target.parents('.record-list').find('.record-list-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), $target.find('.record-item').length, 5);
                    }
                }
            };
            ws[index].onclose = function() {
                // 关闭 websocket
                //console.log("连接已关闭...")
                if(typeof callback === 'function'){
                    callback();
                }
            };
            ws[index].onerror = function (e) {
                //console.log('发生异常:', e);
                if(typeof callback === 'function'){
                    callback();
                }
            };
        }else{
            // 浏览器不支持 WebSocket
            timer[index] = setInterval(function(){pollInit(session.ws_session.http_url, index, $target, function(){
                callback();
            })}, 3000);
        }
    }
    // polling
    function pollInit(url, index, $target, callback) {
        $.getJSON(url).done(function(res) {
            var response = res;
            if(response){
                $.each(response, function(i, n){
                    var wsid = n.ws_session_id;
                    if($.inArray(wsid, sid) >= 0){
                        var wstype = (n.status) ? (($.inArray(wsid, sid) >= 0) ? 'push' : 'unpush') :'unpush';
                        if(($.inArray(wsid, sid) >= 0)) sid.push(wsid), timer.push("");
                        if(timer[index]){clearInterval(timer[index]);sid.splice($.inArray(wsid, sid), 1);timer.splice(index, 1);};
                        setRecordTask($target, n, wstype, (($.inArray(wsid, sid) >= 0) ? $.inArray(wsid, sid) : 0));
                    }else{
                        var timestamp = (new Date().valueOf()).toString();
                        setRecordTask($target, n, 'increased');
                        if(n.status && n.status == 1){clearInterval(timer[index]);}
                        sid.push(wsid), timer.push("");
                    }
                    if(!kernel.parseHash(location.hash).args.p && $target.find('.record-item').length >= 5){
                        util.paging($target.parents('.record-list').find('.record-list-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), $target.find('.record-item').length, 5);
                    }
                });
            }
        });
    }

    return function(callback){
        var loc = kernel.parseHash(location.hash), task_id = loc.args.id;

        if(!task_id){
            // 获取导入记录
            getTaskList({
                userid: util.getCookie('userid'),
                token: util.getCookie('token'),
                url: '/v1.0/importtask/task/byOrgAndUser',
                orgid: util.getCookie('orgid'),
                page: (loc.args.p ? loc.args.p : 1),
                size: 5,
                $target: $('.imports-steps .steps-record .record-list')
            });
        }

        if(isImport && isImport == true){
            $importsInfo.show();
            $importsSteps.hide();
        }
    };

    function resetUploadFile(){
        $('#upload-file').val('');
        scnt = 0, fcnt = 0, importStatus = 0;
        $scntTarget.find('>').remove();
        $fcntTarget.find('>').remove();
        $scntBtn.find('span.nav-enable-num').text(0);
        $fcntBtn.find('span.nav-unable-num').text(0);
    }

    //查看历史导入任务
    function getTaskList(data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: data.url,
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                org_id: data.orgid,
                page: (data.page - 1),
                size: data.size
            },
            success: function(res) {
                data.$target.find('.record-list-table table.table tbody.tbody >').remove();
                if(res.code == 0){
                    var json = res.data['result'];
                    if(json.total > 0 && (json.rows && json.rows.length > 0)){
                        $.each(json.rows, function(i, n){
                            setRecordTask(data.$target.find('.record-list-table table.table tbody.tbody') ,n ,'push');
                        });
                        if(data.$target.find('tr.empty'))data.$target.find('tr.empty').remove();
                    }else{
                        if(data.$target.find('.record-list-table .record-item').length == 0){
                            data.$target.find('.record-list-table table.table tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无导入记录</td></tr>');
                        }
                    }
                    util.paging(data.$target.find('.record-list-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5);
                }else{
                    kernel.hint('查看历史导入任务失败', 'error');
                }
            }
        });
    }

    //导入记录
    function setRecordTask($target, data, type, index){
        var $targetHtml = $('<tr class="record-item '+ ((data.status != 1) ? 'record-importing': '') +'">\
            <td class="record-date">'+ util.formatTime(parseInt((data.finish_time ? data.finish_time : data.update_time)/1000)) +'</td>\
            <td class="record-imported">'+ ((data.status != 1) ? '/' : data.success) +'</td>\
            <td class="record-unimported">'+ ((data.status != 1) ? '/' : data.fail) +'</td>\
            <td class="record-operater">'+ (data.user_name ? data.user_name : '') +'</td>\
            <td class="record-status">'+ (data.status == 1 ? '导入完成' : ((data.status == 0) ? '正在导入' : '正在导入')) +'</td>\
            <td class="record-operate"><a class="operate-view" style="'+ (data.status != 1 ? 'display:none;':'') +'" data-task_id="'+ data.id +'" href="javascript:;" title="查看">查看</a></td>\
        </tr>');
        switch(type){
            case 'increased':
                $target.prepend($targetHtml);
            break;
            case 'unpush':
                $target.prepend($targetHtml);
            break;
            case 'push':
                if(index >= 0){
                    $('.record-importing').eq(index ? index : 0).replaceWith($targetHtml);
                }else{
                    $target.append($targetHtml);
                }
            break;
            default:
                $target.append($targetHtml);
        }

        if($target.find('tr.empty'))$target.find('tr.empty').remove();

        if(data.status == 0 && data.id){
            var timestamp = (new Date().valueOf()).toString();
            util.ajaxSubmit({
                type: 'get',
                url: '/v1.0/importtask/task/sessionn',
                dauth: userid + ' ' + timestamp + ' ' + kernel.buildDauth(userid, token, timestamp),
                data: {
                    id: data.id,
                    status: data.status
                },
                success: function(res) {
                    if(res.code == 0){
                        var json = res.data['result'];
                        //console.log("按照任务id获取websocket", json);
                    }else{}
                }
            });
        }

        $targetHtml.find('td.record-operate a.operate-view').on('click', function(e){
            e.stopPropagation();
            var c = $(this), task_id = c.attr('data-task_id');
            loc.args.id = task_id;
            if(task_id && task_id != 'undefined'){
                //loc.args.type = 'steps';
                loc.args.status = 'data';
                loc.args.imports = 'enable';
                getRecordInfo({
                    status: 1,
                    task_id: task_id,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    $target: $importsInner.find('.imports-inner-data')
                });

                getRecordInfo({
                    status: -1,
                    task_id: task_id,
                    userid: userid,
                    token: token,
                    url: '/v1.0/importtask/item/byTask',
                    orgid: orgid,
                    $target: $importsInner.find('.imports-inner-data')
                });

                kernel.replaceLocation(loc);
            }else{
                kernel.hint('暂无导入数据,请稍后再试', 'error');
            }
        });
    }

    //导入成员信息
    function getRecordInfo(data){
        var timestamp = (new Date().valueOf()).toString();
        util.ajaxSubmit({
            type: 'get',
            url: data.url,
            dauth: data.userid + ' ' + timestamp + ' ' + kernel.buildDauth(data.userid, data.token, timestamp),
            data: {
                task_id: data.task_id,
                status: data.status,
                size: 1000
            },
            success: function(res) {
                (data.status == 1) ? data.$target.find('.imports-table-enable table.table tbody.tbody >').remove() : data.$target.find('.imports-table-unable table.table tbody.tbody >').remove();
                console.log("getRecordInfo", res);
                if(res.code == 0){
                    var json = res.data['result'], targetHtml = '';
                    (data.status == 1) ? data.$target.find('span.nav-enable-num').text(json.total) : data.$target.find('span.nav-unable-num').text(json.total);
                    if(json.total > 0 && (json.rows && json.rows.length > 0)){
                        $.each(json.rows, function(i, n){
                            targetHtml += '<tr>\
                                <td class="user-index">'+ (i + 1) +'</td>\
                                <td class="user-name"><p>'+ n.name +'</p></td>\
                                <td class="user-employeenum">'+ n.employee_num +'</td>\
                                <td class="user-deptname" title="'+ n.dept_name +'"><p>'+ n.dept_name +'</p></td>\
                                <td class="user-title" title="'+ n.title +'"><p>'+ n.title +'</p></td>\
                                <td class="user-mobile">'+ n.mobile +'</td>\
                                '+ ((data.status && data.status != 1) ? '<td class="user-error"><span class="red">'+ ((n.msg && n.msg != '') ? n.msg : '不可导入') +'</span></td>' : '') +'\
                            </tr>';
                        });
                        (data.status == 1) ? data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append(targetHtml) : data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append(targetHtml);
                    }else{
                        if(data.status == 1){
                            if(data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">暂无已导入数据</td></tr>')
                            }
                        }else{
                            if(data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody tr').length == 0){
                                data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无不可导入数据</td></tr>')
                            }
                        }
                        //(data.status == 1) ? data.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">暂无已导入数据</td></tr>') : data.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">暂无不可导入数据</td></tr>');
                    }
                    (data.status == 1) ? util.paging(data.$target.find('.imports-enable-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5) : util.paging(data.$target.find('.imports-unable-paging'), parseInt((kernel.parseHash(location.hash).args.p ? kernel.parseHash(location.hash).args.p : 1)), parseInt(json.total), 5);
                }else{
                    kernel.hint('查看历史导入任务失败', 'error');
                }
            }
        });
    }
});