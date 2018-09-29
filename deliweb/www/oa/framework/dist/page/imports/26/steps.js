'use strict';define(['common/kernel/kernel','site/util/util','page/imports/member','common/text/text!page/imports/steps.html!strip'],function(a,b,c,d){function e(){var c=a.parseHash(location.hash),d=b.getCookie('userid'),e=b.getCookie('token'),g=b.getCookie('orgid'),h=new Date().valueOf().toString();return $.ajaxFileUpload({url:'/web/v1.0/import/employee',secureuri:!1,fileElementId:'upload-file',dataType:'json',beforeSend:function beforeSend(b){b.setRequestHeader('Duagent','_web'),b.setRequestHeader('Dauth',d+' '+h+' '+a.buildDauth(d,e,h))},ajaxSend:function ajaxSend(b){b.setRequestHeader('Duagent','_web'),b.setRequestHeader('Dauth',d+' '+h+' '+a.buildDauth(d,e,h))},data:{org_id:g,Duagent:'_web',Dauth:d+' '+h+' '+a.buildDauth(d,e,h)},success:function success(b){if(b&&b.responseText){var d=$.parseJSON(jQuery(b.responseText).text());if(0==d.code){t=!0,$('#upload-file').val('');var e=d.data.result;e&&e.ws_session_id&&f(w,e,$('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'),function(){w.splice($.inArray(e.ws_session_id,w),1)})}else t=!1,c.args.status='error',a.hint(d.msg,'error'),'9103101'==d.code?(F.find('p.user-error-title').hide(),F.find('p.authority-error-title').show()):(F.find('p.user-error-title').show(),F.find('p.authority-error-title').hide()),a.replaceLocation(c)}else a.hint('\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5','error')},error:function error(b){if(b&&b.responseText){var d=$.parseJSON(jQuery(b.responseText).text());if(0==d.code){t=!0,$('#upload-file').val('');var e=d.data.result;e&&e.ws_session_id&&f(w,e,$('.imports-steps .steps-record .record-list .record-list-table table.table tbody.tbody'),function(){w.splice($.inArray(e.ws_session_id,w),1)})}else t=!1,c.args.status='error',a.hint(d.msg,'error'),'9103101'==d.code?(F.find('p.user-error-title').hide(),F.find('p.authority-error-title').show()):(F.find('p.user-error-title').show(),F.find('p.authority-error-title').hide()),a.replaceLocation(c)}else a.hint('\u7F51\u7EDC\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5','error')}}),!1}function f(c,d,e,f){var h=d.ws_session.session_id,i=$.inArray(h,c),k=w.length;0>i&&(u.push(''),i=u.length),'undefined'==typeof WebSocket?v[i]=setInterval(function(){g(d.ws_session.http_url,i,e,function(){f()})},3e3):(u[i]=new WebSocket(d.ws_session.ws_url),u[i].onopen=function(){u[i].send('{"cmd": "register","data": "'+h+'"}')},u[i].onmessage=function(c){var f=JSON.parse(c.data);if(console.log('json',f),f){if(0<=$.inArray(h,w)){var g=f.status?0<=$.inArray(h,w)?'push':'unpush':'unpush';0<=$.inArray(h,w)&&w.push(h),j(e,f,g,0<=$.inArray(h,w)?$.inArray(h,w):0),u[i]&&(u[i].close(),w.splice($.inArray(h,w),1),u.splice(i,1))}else{new Date().valueOf().toString();j(e,d,'increased'),f.status&&1==f.status&&u[i]&&u[i].close(),w.push(h)}!a.parseHash(location.hash).args.p&&5<=e.find('.record-item').length&&b.paging(e.parents('.record-list').find('.record-list-paging'),parseInt(a.parseHash(location.hash).args.p?a.parseHash(location.hash).args.p:1),e.find('.record-item').length,5)}},u[i].onclose=function(){'function'==typeof f&&f()},u[i].onerror=function(){'function'==typeof f&&f()})}function g(c,d,e){$.getJSON(c).done(function(c){var f=c;f&&$.each(f,function(c,f){var g=f.ws_session_id;if(0<=$.inArray(g,w)){var h=f.status?0<=$.inArray(g,w)?'push':'unpush':'unpush';0<=$.inArray(g,w)&&(w.push(g),v.push('')),v[d]&&(clearInterval(v[d]),w.splice($.inArray(g,w),1),v.splice(d,1)),j(e,f,h,0<=$.inArray(g,w)?$.inArray(g,w):0)}else{new Date().valueOf().toString();j(e,f,'increased'),f.status&&1==f.status&&clearInterval(v[d]),w.push(g),v.push('')}!a.parseHash(location.hash).args.p&&5<=e.find('.record-item').length&&b.paging(e.parents('.record-list').find('.record-list-paging'),parseInt(a.parseHash(location.hash).args.p?a.parseHash(location.hash).args.p:1),e.find('.record-item').length,5)})})}function h(){$('#upload-file').val(''),q=0,r=0,s=0,M.find('>').remove(),N.find('>').remove(),J.find('span.nav-enable-num').text(0),K.find('span.nav-unable-num').text(0)}function i(c){var d=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:c.url,dauth:c.userid+' '+d+' '+a.buildDauth(c.userid,c.token,d),data:{org_id:c.orgid,page:c.page-1,size:c.size},success:function success(d){if(c.$target.find('.record-list-table table.table tbody.tbody >').remove(),0==d.code){var e=d.data.result;0<e.total&&e.rows&&0<e.rows.length?($.each(e.rows,function(a,b){j(c.$target.find('.record-list-table table.table tbody.tbody'),b,'push')}),c.$target.find('tr.empty')&&c.$target.find('tr.empty').remove()):0==c.$target.find('.record-list-table .record-item').length&&c.$target.find('.record-list-table table.table tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">\u6682\u65E0\u5BFC\u5165\u8BB0\u5F55</td></tr>'),b.paging(c.$target.find('.record-list-paging'),parseInt(a.parseHash(location.hash).args.p?a.parseHash(location.hash).args.p:1),parseInt(e.total),5)}else a.hint('\u67E5\u770B\u5386\u53F2\u5BFC\u5165\u4EFB\u52A1\u5931\u8D25','error')}})}function j(c,d,e,f){var g=$('<tr class="record-item '+(1==d.status?'':'record-importing')+'">            <td class="record-date">'+b.formatTime(parseInt((d.finish_time?d.finish_time:d.update_time)/1e3))+'</td>            <td class="record-imported">'+(1==d.status?d.success:'/')+'</td>            <td class="record-unimported">'+(1==d.status?d.fail:'/')+'</td>            <td class="record-operater">'+(d.user_name?d.user_name:'')+'</td>            <td class="record-status">'+(1==d.status?'\u5BFC\u5165\u5B8C\u6210':0==d.status?'\u6B63\u5728\u5BFC\u5165':'\u6B63\u5728\u5BFC\u5165')+'</td>            <td class="record-operate"><a class="operate-view" style="'+(1==d.status?'':'display:none;')+'" data-task_id="'+d.id+'" href="javascript:;" title="\u67E5\u770B">\u67E5\u770B</a></td>        </tr>');if('increased'===e?c.prepend(g):'unpush'===e?c.prepend(g):'push'===e?0<=f?$('.record-importing').eq(f?f:0).replaceWith(g):c.append(g):c.append(g),c.find('tr.empty')&&c.find('tr.empty').remove(),0==d.status&&d.id){var h=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:'/v1.0/importtask/task/sessionn',dauth:n+' '+h+' '+a.buildDauth(n,o,h),data:{id:d.id,status:d.status},success:function success(a){if(0==a.code)a.data.result;else;}})}g.find('td.record-operate a.operate-view').on('click',function(b){b.stopPropagation();var d=$(this),c=d.attr('data-task_id');l.args.id=c,c&&'undefined'!=c?(l.args.status='data',l.args.imports='enable',k({status:1,task_id:c,userid:n,token:o,url:'/v1.0/importtask/item/byTask',orgid:p,$target:F.find('.imports-inner-data')}),k({status:-1,task_id:c,userid:n,token:o,url:'/v1.0/importtask/item/byTask',orgid:p,$target:F.find('.imports-inner-data')}),a.replaceLocation(l)):a.hint('\u6682\u65E0\u5BFC\u5165\u6570\u636E,\u8BF7\u7A0D\u540E\u518D\u8BD5','error')})}function k(c){var d=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:c.url,dauth:c.userid+' '+d+' '+a.buildDauth(c.userid,c.token,d),data:{task_id:c.task_id,status:c.status,size:1e3},success:function success(d){if(1==c.status?c.$target.find('.imports-table-enable table.table tbody.tbody >').remove():c.$target.find('.imports-table-unable table.table tbody.tbody >').remove(),console.log('getRecordInfo',d),0==d.code){var e=d.data.result,f='';1==c.status?c.$target.find('span.nav-enable-num').text(e.total):c.$target.find('span.nav-unable-num').text(e.total),0<e.total&&e.rows&&0<e.rows.length?($.each(e.rows,function(a,b){f+='<tr>                                <td class="user-index">'+(a+1)+'</td>                                <td class="user-name"><p>'+b.name+'</p></td>                                <td class="user-employeenum">'+b.employee_num+'</td>                                <td class="user-deptname" title="'+b.dept_name+'"><p>'+b.dept_name+'</p></td>                                <td class="user-title" title="'+b.title+'"><p>'+b.title+'</p></td>                                <td class="user-mobile">'+b.mobile+'</td>                                '+(c.status&&1!=c.status?'<td class="user-error"><span class="red">'+(b.msg&&''!=b.msg?b.msg:'\u4E0D\u53EF\u5BFC\u5165')+'</span></td>':'')+'                            </tr>'}),1==c.status?c.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append(f):c.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append(f)):1==c.status?0==c.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody tr').length&&c.$target.find('.imports-table-enable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="5">\u6682\u65E0\u5DF2\u5BFC\u5165\u6570\u636E</td></tr>'):0==c.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody tr').length&&c.$target.find('.imports-table-unable .table-data-wrap .table-data tbody.tbody').append('<tr class="empty"><td rowspan="3" colspan="6">\u6682\u65E0\u4E0D\u53EF\u5BFC\u5165\u6570\u636E</td></tr>'),1==c.status?b.paging(c.$target.find('.imports-enable-paging'),parseInt(a.parseHash(location.hash).args.p?a.parseHash(location.hash).args.p:1),parseInt(e.total),5):b.paging(c.$target.find('.imports-unable-paging'),parseInt(a.parseHash(location.hash).args.p?a.parseHash(location.hash).args.p:1),parseInt(e.total),5)}else a.hint('\u67E5\u770B\u5386\u53F2\u5BFC\u5165\u4EFB\u52A1\u5931\u8D25','error')}})}var l=a.parseHash(location.hash),m=l.args.id,n=b.getCookie('userid'),o=b.getCookie('token'),p=b.getCookie('orgid'),q=0,r=0,s=0,t=!1,u=[],v=[],w=[],x=!!window.WebSocket&&window.WebSocket.prototype.send,y=$('#imports .imports-menu .menu-list .menu-manage-import'),z=$('#imports .imports-box'),A=z.find('.imports-info'),B=z.find('.imports-steps'),C=A.find('.imports-crumbs'),D=C.find('.imports-crumbs-user'),E=C.find('.imports-crumbs-info'),F=A.find('.imports-inner'),G=F.find('.imports-inner-data .imports-nav a'),H=F.find('.imports-inner-data .imports-table'),I=F.find('.imports-upload button.btn-upload'),J=F.find('.imports-nav a.nav-enable'),K=F.find('.imports-nav a.nav-unable'),L=F.find('.imports-inner-data .imports-table .table-data-wrap'),M=F.find('.imports-inner-data .imports-table .imports-table-enable .table-data-wrap table.table-data tbody.tbody'),N=F.find('.imports-inner-data .imports-table .imports-table-unable .table-data-wrap table.table-data tbody.tbody'),O=$(d),P=O.find('.btn-step-download'),Q=O.find('.btn-step-upload'),R=O.find('#upload-form'),S=O.find('#upload-file');return z.append(O),h(),y.on('click',function(b){b.preventDefault(),l={id:'imports',args:{type:'info'}},h(),a.replaceLocation(l)}),R.on('change','#upload-file',function(){e(),L.height(document.body.clientHeight-376),a.parseHash(location.hash).args.p&&1!=a.parseHash(location.hash).args.p}),D.on('click',function(b){b.stopPropagation(),l={args:{},id:'imports'},h(),a.replaceLocation(l)}),E.on('click',function(b){b.stopPropagation(),l.args.status='data',h(),a.replaceLocation(l)}),function(){var c=a.parseHash(location.hash),d=c.args.id;d||i({userid:b.getCookie('userid'),token:b.getCookie('token'),url:'/v1.0/importtask/task/byOrgAndUser',orgid:b.getCookie('orgid'),page:c.args.p?c.args.p:1,size:5,$target:$('.imports-steps .steps-record .record-list')}),t&&!0==t&&(A.show(),B.hide())}});