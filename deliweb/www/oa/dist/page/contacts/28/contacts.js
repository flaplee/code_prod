'use strict';define(['common/kernel/kernel','site/util/util','page/contacts/department'],function(a,b,c){function d(a,b){a.text(b)}function e(a){a.on('click',function(a){a.stopPropagation();var b=$(this);b.hasClass('selected')?(b.removeClass('selected').find('i').html('&#xe76a;'),S.find('tr td a.item').removeClass('selected'),S.find('tr td a.item').find('i').html('&#xe76a;')):(b.addClass('selected').find('i').html('&#xe63d;'),S.find('tr td a.item').addClass('selected'),S.find('tr td a.item').find('i').html('&#xe63d;'))})}var f,g,h,i,j,k,l,m,n,o,p,q,r,s,u,t,v,x='',y=0,z=100,w=!1,A=$('#contacts'),B=A.find('.contacts-menu'),C=B.find('.contacts-list'),D=C.find('.search-form'),E=C.find('.contacts-team'),F=D.find('.search-box input.search'),G=D.find('.search-box a.btn-user-search'),H=A.find('.contacts-box'),I=H.find('.contacts-info'),J=I.find('.contacts-wrap-data'),K=I.find('.contacts-wrap-empty'),L=I.find('.contacts-form h2.form-title'),M=I.find('.btn-user-dept'),N=I.find('.btn-user-remove'),O=I.find('.btn-user-delete-end'),P=I.find('.btn-user-add'),Q=I.find('.contacts-inner'),R=I.find('.contacts-inner .table'),S=R.find('.tbody'),T=E.find('.dept-select-list'),U=T.find('div.dept-select-wrap'),V=T.find('ul.dept-select-inner'),W=A.find('ul.department-list-inner');$(document).keydown(function(a){switch(a.keyCode){case 13:return!1;}});var X=function(a,b){t=b.orgid,v=b.orgid,a.find('>').remove();var c=$('<a class="item-info select-item" href="javascript:;" data-orgid="'+b.orgid+'" data-expand="true"><i class="iconfont item-class">&#xe608;</i><span class="text"><i class="iconfont item-class">&#xe61d;</i>'+b.name+'</span></a>');a.append(c),function(a,b){a.on('click',function(a){a.stopPropagation();var d=$(this);d.hasClass('current')||(T.find('.select-item').removeClass('current'),d.addClass('current'),q&&q!=b.orgid&&(q=b.orgid,r=b.type,s=b.title,y=0,u=b.orgid,Y(S,{id:q,orgid:u,title:s,type:r,query:x,page:y,size:z})))})}(c,{orgid:b.orgid,title:b.name,type:b.type})},Y=function(c,h,l){var i=''==h.query?'/v1.0/org'+(h.type&&'parent'==h.type?'':'/department')+'/'+h.orgid+'/users':'/v1.0/org'+(h.type&&'parent'==h.type?'':'/department')+'/'+h.orgid+'/users',j=''==h.query?{page:h.page,size:h.size}:{query:h.query,page:h.page,size:h.size},m=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:i,dauth:f+' '+m+' '+a.buildDauth(f,g,m),data:j,success:function success(f){if(0==f.code){var g=f.data.result;if(p=g,''!=h.query&&l&&(J.show(),K.hide(),l.find('a.select-item, li.select-item').removeClass('current'),l.find('.dept-select-wrap a.item-info').addClass('current')),g&&0<g.length){0==y&&c.find('>').remove();for(var m=0;m<f.data.result.length;m++){var s=g[m].department_paths,t='',u=g[m].titles;if(s&&1<s.length||h.orgid==g[m].org_id&&1==s.length)for(var i=0;i<s.length;i++)t+=(s[i]?s[i]:'').replace(/\//gm,'-').replace(new RegExp(''+g[m].organization+'-','gm'),'')+(i==s.length-1?'':'/');else t=g[m].department;var j=g[m].org_id==g[m].department_id&&h.type&&'parent'==h.type?'':t,n=g[m].org_id==g[m].department_id&&h.type&&'parent'==h.type?g[m].title:u&&1<u.length?u.join('/'):g[m].title,o=$('<tr class="table-item">                                <td class="user-check" style="display:none;"><a class="item" href="javascript:;" data-uid="'+g[m].user_id+'" data-did="'+g[m].department_id+'"  data-isMaster="'+(k==g[m].user_id)+'" data-isAdmin="'+g[m].is_department_director+'"><i class="iconfont">&#xe76a;</i></a></td>                                <td class="user-name"><p>'+g[m].nickname+'</p></td>                                <td class="user-employeenum">'+(g[m].employee_num?g[m].employee_num:'')+'</td>                                <td class="user-deptname dept-text"><p class="'+(h.type&&'parent'==h.type?'':'text-center')+'">'+j+'</p></td>                                <td class="user-title"><p class="'+(h.type&&'parent'==h.type?'':'text-center')+'">'+n+'</p></td>                                <td class="user-mobile">'+g[m].mobile+'</td>                                <td class="user-operate" style="display:none;">                                    <button data-index="'+m+'" type="button" class="btn btn-info btn-sm btn-user-edit">\u7F16\u8F91</button>                                </td>                            </tr>');c.append(o),function selectUser(a){a.on('click',function(a){a.stopPropagation();var b=$(this);b.hasClass('selected')?(b.removeClass('selected').find('i').html('&#xe76a;'),b.removeClass('selected'),b.find('i').html('&#xe76a;')):(b.addClass('selected').find('i').html('&#xe63d;'),b.addClass('selected'),b.find('i').html('&#xe63d;'))})}(o.find('a.item')),function editUser(b,c){b.find('td button.btn-user-edit').on('click',function(){a.openPanel('adduser',{type:'edit',data:c})})}(o,{nickname:g[m].nickname,id:q,type:r,userid:g[m].user_id,department:g[m].department,departments:g[m].departments,departmentid:g[m].department_id,departmentids:g[m].department_ids,orgid:g[m].org_id,orgname:g[m].organization,mobile:g[m].mobile,mobile_region:g[m].mobile_region,employee_num:g[m].employee_num,title:g[m].title,titles:g[m].titles})}g.length<z?0<y&&c.append('<tr class="table-item-end"><td colspan="5"><div class="item-end-box"><span>\u6CA1\u6709\u66F4\u591A\u4E86</span></div></td></tr>'):w=!0,e(R.find('.thead .select-all'))}else if(0!=y)c.append('<tr class="table-item-end"><td colspan="5"><div class="item-end-box"><span>\u6CA1\u6709\u66F4\u591A\u4E86</span></div></td></tr>');else if(''!=h.query&&l)J.hide(),K.show();else{c.find('>').remove();c.append($('<tr class="empty empty-user"><td colspan="8" class="empty-item"><div class="empty-img empty-img-user"></div><p class="empty-text">\u6682\u65E0\u4EBA\u5458\u4FE1\u606F</p></td></tr>'))}d(L,h.title)}else''==h.query&&'parent'==h.type?(a.hint('\u5F53\u524D\u7EC4\u7EC7\u72B6\u6001\u5F02\u5E38,\u8BF7\u91CD\u65B0\u767B\u5F55','error'),b.setUserData(void 0),a.replaceLocation({args:{},id:'loginhome'})):a.hint(g.msg,'error')}})},Z=function(c,d,h,e){var i=d.status,j=d.type,k=d.parentid,l=d.orgid,m='parent'==j?k:l;c.find('>').remove();var o=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:'/v1.0/org/department/'+m+'/departments',dauth:f+' '+o+' '+a.buildDauth(f,g,o),data:{},success:function success(a){for(var b=a.data.result,d=function(){function a(b,c,d,e,f){var g=b.parent('a.item-info').siblings('ul.select-son-list'),h=b.parent('a.item-info').parent('.select-item');'false'==h.attr('data-expand')?(b.html('&#xe608;'),h.attr('data-expand',!0),g.show()):(b.html('&#xe641;'),h.attr('data-expand',!1),g.hide()),'loaded'==h.attr('data-status')||(Z(c.find('ul.select-son-list'),{status:'onload',type:'son',parentid:d,orgid:e},f&&!0==f||void 0,$('#adddept .dept-box .dept-selected-list').find('ul.dept-selected-inner')),h.attr('data-status','loaded'))}function d(a,b,d){if(a){a.find('>').remove();var c=$('<li class="selected-item clear" data-orgid="'+b.orgid+'">                                <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe661;</i><span class="text">'+b.title+'</span></a>                                <a class="item-check" href="javascript:;"><i class="iconfont">&#xe660;</i></a>                            </li>');a.append(c),a.find('a.item-check').on('click',function(a){a.stopPropagation();var b=$(this),c=b.parent('.selected-item');c.remove(),'loaded'==d.attr('data-status')&&d.attr('data-status','onload')})}}g=$('<li class="select-item clear" data-orgid="'+b[f].org_id+'" data-status="onload" data-expand="false">                            <a class="item-info" href="javascript:;"><i class="iconfont item-class">&#xe641;</i><span class="text"><i class="iconfont item-class">&#xe661;</i>'+b[f].name+'</span></a>                            <ul class="select-son-list clear"></ul>                        </li>'),c.append(g),function(b,f,g){b.find('a.item-info > i.item-class').on('click',function(d){d.stopPropagation(),t='';var e=$(this);a(e,b,k,f.orgid,h)}),b.find('a.item-info').on('click',function(a){a.stopPropagation(),J.show(),K.hide(),D.find('.search-box input.search').val(''),x='';var b=$(this),c=b.parent('.select-item');c.hasClass('current')||(T.find('.select-item').removeClass('current'),c.addClass('current'),u=f.orgid),q&&q!=f.orgid&&(q=f.id,r=f.type,s=f.title,y=0,u=f.orgid,'department'!=n&&h&&!0==h&&Y(S,{id:q,type:r,orgid:u,title:s,query:x,page:y,size:z})),d(g,f,c)})}(g,{id:b[f].id,orgid:b[f].id,title:b[f].name},e)},f=0;f<a.data.result.length;f++){var g;d()}}})},_=function(c,d){function h(c,d){var e=new Date().valueOf().toString();b.ajaxSubmit({type:'get',url:'/v1.0/org/department/'+d.orgid+'/departments',dauth:f+' '+e+' '+a.buildDauth(f,g,e),data:{},success:function success(b){var e=b.data.result;if(0<e.length)for(var f=function(){function b(a,b,c){b.hasClass('current')||(a.find('li.select-item div.item-info').removeClass('current'),b.addClass('current'));var e='parent'==d.relation?a:b;'onload'==e.attr('data-status')&&e.attr('data-status','loaded'),'function'==typeof c&&c()}i=e[g].directors&&e[g].directors[0].name?'<span class="item-admin">'+e[g].directors[0].name+'(<em>\u4E3B\u7BA1</em>)</span>':'<span class="null">\u7A7A\u7F3A</span>',j=$('<li class="select-item clear" data-orgid="'+e[g].id+'" data-status="onload" data-expand="false">                                <div class="item-info clear" data-status="onload">                                    <div class="item-text fl">                                        <i class="iconfont item-class">&#xe608;</i><span class="text"><span class="item-name">'+e[g].name+'</span><span class="item-count">(<em>'+e[g].employee_cnt+'\u4EBA</em>)</span></span>/'+i+'                                    </div>                                    <div class="item-setup fr">                                        <a class="setup-admin" title="\u8BBE\u7F6E\u4E3B\u7BA1" href="javascript:;"><i class="iconfont">&#xe634;</i></a>                                        <a class="setup-rename" title="\u91CD\u547D\u540D" href="javascript:;"><i class="iconfont">&#xe618;</i></a>                                        <a class="setup-add" title="\u6DFB\u52A0\u5B50\u90E8\u95E8" href="javascript:;"><i class="iconfont">&#xe73e;</i></a>                                        <a class="setup-del" title="\u5220\u9664\u90E8\u95E8" href="javascript:;"><i class="iconfont">&#xe6df;</i></a>                                    </div>                                </div>                                <ul class="item-select-inner-son" data-index="'+d.index+'" data-status="onload"></ul>                            </li>'),c.append(j),function(c,d){c.on('click',function(a){var b=a||window.event;b.stopPropagation();var e=b.target||b.srcElement,f=$(this),c=f.find('> div.item-info'),g=f.find('> ul.item-select-inner-son');l(f),c.hasClass('current')||(k.find('li.select-item div.item-info').removeClass('current'),c.addClass('current')),'loaded'==f.attr('data-status')||(f.attr('data-status','loaded'),f.attr('data-expand',!0),h(g,{orgid:d.orgid,title:d.name,index:d.index+1}))}),c.on('click','.item-setup .setup-admin',function(){var e=$(this).parent('.item-setup').parent('.item-info');b(k,e,function(){a.openPopup('seluser',{type:'seluser',data:{orgid:d.orgid},func:function func(){_(k,{status:'onload',relation:'parent',orgid:o,orgname:q,parentid:n,index:0})}})})}),c.on('click','.item-setup .setup-rename',function(){var e=$(this).parent('.item-setup').parent('.item-info');b(k,e,function(){a.openPopup('editdept',{type:'rename',data:{id:d.orgid,pid:n,text:'\u8BF7\u8F93\u5165\u65B0\u7684\u90E8\u95E8\u540D\u79F0',name:d.name},func:function func(){_(k,{status:'onload',relation:'parent',orgid:o,orgname:q,parentid:n,index:0})}})})}),c.on('click','.item-setup .setup-add',function(){var e=$(this).parent('.item-setup').parent('.item-info');b(k,e,function(){a.openPopup('editdept',{type:'add',data:{id:d.orgid,pid:n,text:'\u8BF7\u8F93\u5165\u90E8\u95E8\u540D\u79F0',name:d.name},func:function func(){_(k,{status:'onload',relation:'parent',orgid:o,orgname:q,parentid:n,index:0})},idNeedId:!0,isNeedLoad:!0})})}),c.on('click','.item-setup .setup-del',function(f){f.stopPropagation();var e=$(this),c=e.parent('.item-setup').parent('.item-info'),g=e.parent('.item-setup').attr('data-id'),h=e.parent('.item-setup').siblings('a.item-info').find('.item-name').text();b(k,c,function(){a.openPopup('deldept',{type:'group',data:{id:d.orgid,pid:n,name:d.name,title:'\u662F\u5426\u5220\u9664\u8BE5\u90E8\u95E8\uFF1F'},func:function func(){_(k,{status:'onload',relation:'parent',orgid:o,orgname:q,parentid:n,index:0})},isNeedLoad:!0})})})}(j,{orgid:e[g].id,title:'',index:d.index,relation:d.relation}),l=function(a){'loaded'==a.attr('data-status')&&('false'==a.attr('data-expand')?(a.attr('data-expand',!0),a.find('.item-info .item-text > i.iconfont').html('&#xe608;'),a.find('ul.item-select-inner-son').toggle()):(a.attr('data-expand',!1),a.find('.item-info .item-text > i.iconfont').html('&#xe641;'),a.find('ul.item-select-inner-son').toggle()))}},g=0;g<e.length;g++){var i,j,l;f()}else;}})}var e=$('.department-info').find('.department-form .form-title'),i=$('.department-info').find('.department-form .form-btns .btn-dept-add'),j=$('.department-info').find('.department-inner'),k=j.find('.department-list .department-list-inner'),l=d.status,m=d.relation,n=d.parentid,o=d.orgid,p=d.index+1,q=d.orgname,r='parent'==m?n:o;c.find('>').remove(),'parent'==m?e.text(q):m='son',h(c,{orgid:d.orgid,title:d.orgname,index:p,relation:m})};B.find('.menu-list .item a.item-menu').on('click',function(a){a.stopPropagation();var b=$(this).parent('li');b.hasClass('current')||(b.siblings('li').removeClass('current'),b.addClass('current'))}),D.find('.btn-user-search').off('click').on('click',function(a){a.preventDefault(),w=!1,y=0,x=encodeURI(D.find('.search-box input.search').val()),Y(S,{id:q,orgid:v,title:s,type:r,query:x,page:y,size:z},T)}),D.find('.search-box input.search').bind('keyup',function(a){var b=$(this);'13'==a.keyCode&&0<b.val().length&&D.find('.btn-user-search').trigger('click')}),K.find('p a.empty-back').on('click',function(a){a.stopPropagation(),J.show(),K.hide(),D.find('.search-box input.search').val(''),x=''});var aa=function(c,d,e){var h=new Date().valueOf().toString();b.ajaxSubmit({type:'post',url:'/v1.0/org/user/move',dauth:f+' '+h+' '+a.buildDauth(f,g,h),data:{user_ids:c,src_department_id:d,dest_department_id:e},success:function success(b){0==b.code?(a.hint('\u79FB\u52A8\u6210\u5458\u6210\u529F','success'),Y(S,{id:q,orgid:u,title:s,query:x,page:y,size:z})):a.hint('\u8BF7\u9009\u62E9\u8981\u79FB\u52A8\u7684\u4EBA\u5458','error')}})};M.on('click',function(){var b=[];R.find('tbody.tbody tr td a.item.selected').each(function(a,c){b.push($(c).attr('data-uid'))}),0<b.length?a.openPopup('adddept',{type:'movedept',data:{id:q,org_id:h,user_ids:b},func:function func(a,c){aa(b,a,c)}}):a.hint('\u8BF7\u9009\u62E9\u8981\u79FB\u52A8\u7684\u4EBA\u5458','info')}),N.on('click',function(){var c=[];if(R.find('tbody.tbody tr td a.item.selected').each(function(a,b){c.push($(b).attr('data-uid'))}),0<c.length){var d=new Date().valueOf().toString();b.ajaxSubmit({type:'post',url:'/v1.0/org/user/delete',dauth:f+' '+d+' '+a.buildDauth(f,g,d),data:{org_id:h,user_ids:c},success:function success(b){0==b.code?(a.hint('\u5220\u9664\u6210\u5458\u6210\u529F','success'),Y(S,{id:q,orgid:u,title:s,query:x,page:y,size:z})):a.hint('\u8BF7\u9009\u62E9\u8981\u5220\u9664\u7684\u6210\u5458','error')}})}else a.hint('\u8BF7\u9009\u62E9\u8981\u5220\u9664\u7684\u6210\u5458','info')}),O.on('click',function(){var b,c=[],d=[],e='';R.find('tbody.tbody tr td a.item.selected').each(function(a,e){c.push(p[$(e).parents('tr').index()].user_id),d.push(p[$(e).parents('tr').index()].nickname),b=p[0].organization}),0<c.length?(e=1==c.length?'\u662F\u5426\u5C06 '+d[0]+' \u6210\u5458':2==c.length?'\u662F\u5426\u5C06 '+d[0]+'\u3001'+d[1]+' 2\u540D\u6210\u5458':'\u662F\u5426\u5C06 '+d[0]+'\u3001'+d[1]+' \u7B493\u540D\u6210\u5458',a.openPopup('deluser',{type:'user',data:{org_id:h,user_ids:c,title:e,sub:'\u4ECE'+(b?b:'\u5F97\u529B\u56E2\u961F')+' \u901A\u8BAF\u5F55\u4E2D\u5F7B\u5E95\u5220\u9664\uFF1F'}})):a.hint('\u8BF7\u9009\u62E9\u8981\u5F7B\u5E95\u5220\u9664\u7684\u4EBA\u5458','info')}),P.on('click',function(){var b=[];b.push(j),a.openPanel('adduser',{type:'add',data:{id:q,type:r,orgid:h,orgname:i,mobile_region:'86',parentids:b,isParentid:t}})});var ba=$('.btn-dept-add');return ba.off('click').on('click',function(b){b.stopPropagation(),a.openPopup('editdept',{type:'add',data:{id:j,pid:h,text:'\u8BF7\u8F93\u5165\u90E8\u95E8\u540D\u79F0'},func:function func(){_($('.department-info .department-inner .department-list .department-list-inner'),{status:'onload',relation:'parent',orgid:j,orgname:i,parentid:h,index:0})},idNeedId:!1,isNeedLoad:!0})}),{onload:function onload(){f=b.getCookie('userid'),g=b.getCookie('token'),h=b.getCookie('orgid'),i=b.getCookie('orgname'),j=b.getCookie('parentid'),k=b.getCookie('adminid'),q=h,s=i,r='parent',u=h,w=!1,x='',y=0,l=a.parseHash(location.hash),m=l.id,n=l.args.type,o=n?'.'+n+'-info':'.user-info';var d=$('#contacts .search-form .search-box input.search'),e=$('#contacts .contacts-box .contacts-info .contacts-inner');if(d.val(''),void 0===f||void 0===g||void 0===h)b.setUserData(void 0),a.replaceLocation({args:{},id:'loginhome'});else{if('contacts'==m){var p=$('#header .user-head .nav-top .nav-item');p.find('a.navlink').removeClass('navlink-current'),p.find('a.navlink.orgBtn').addClass('navlink-current')}switch(X(U,{orgid:h,name:i,type:'parent'}),Y(S,{id:q,orgid:u,title:s,type:r,query:x,page:y,size:z}),e.off('scroll').scroll(function(){var a=$(this).height(),b=$(this)[0].scrollHeight;$(this)[0].scrollTop+a+150>=b&&0!=$(this)[0].scrollTop&&w&&(w=!1,Y(S,{id:q,orgid:u,title:s,type:r,query:x,page:++y,size:z}))}),Z(V,{status:'onload',type:'parent',parentid:j,orgid:h},!0),V.height(document.body.clientHeight-205),e.height(document.body.clientHeight-210),B.find('ul.menu-list li.item').removeClass('current'),B.find('ul.menu-list li.item').filter('.item-'+(n?n:'user')+'').addClass('current'),H.find(o).show().siblings().hide(),n){case'user':D.show(),V.hasClass('dept-select-inner-department')?V.removeClass('dept-select-inner-department').addClass('dept-select-inner-user'):V.removeClass('dept-select-inner-user').addClass('dept-select-inner-user');break;case'import':D.hide();break;case'department':V.height(document.body.clientHeight-133),W.height(document.body.clientHeight-170),c(),D.hide(),V.hasClass('dept-select-inner-user')?V.removeClass('dept-select-inner-user').addClass('dept-select-inner-department'):V.removeClass('dept-select-inner-department').addClass('dept-select-inner-department');break;default:D.show();}}},initContacts:Y,initDepartment:Z,initTopDept:_}});