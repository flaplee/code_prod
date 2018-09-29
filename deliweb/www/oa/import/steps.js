'use strict';
define(['module', 'common/kernel/kernel', 'site/util/util', 'common/text/text!page/imports/steps.html!strip'], function(module, kernel, util, html) {
	var userid = util.getCookie('userid'),
        token = util.getCookie('token'),
        orgid = util.getCookie('orgid');
    var $dom = $(html),
    	$imports = $('#imports .imports-box'),
    	$downloadBtn = $dom.find('.btn-step-download'),
        $uploadBtn = $dom.find('.btn-step-upload'),
        $uploadForm = $dom.find('#upload-form'),
    	$uploadHideBtn = $dom.find('#upload-file');
    	$imports.append($dom);

    $uploadForm.on('change','#upload-file', function(){
        ajaxFileUpload(orgid);
    });

    return function(force){}

    function ajaxFileUpload(orgid) {
        var scnt, fcnt;
        $.ajaxFileUpload({
            url: '/v1.0/import/employee', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'upload-file', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            beforeSend:function(xhr){
                xhr.setRequestHeader("dauth", userid + ' ' + (new Date().valueOf()) + ' ' + kernel.buildDauth(token));
            },
            data: {
                org_id: orgid
            },
            success: function (res, status)  //服务器成功响应处理函数
            {
                var json = $.parseJSON(jQuery(res).text());
                if(json.code == 0){
                    scnt = json.data.success_cnt;
                    fcnt = json.data.fail_cnt;
                }else{
                    kernel.hint(json.msg, 'error');
                }
            },
            error: function (res, status, e)//服务器响应失败处理函数
            {
                var json = $.parseJSON(jQuery(res.responseText).text());
                kernel.hint(json.msg, 'error');
            }
        });
        return false;
    }
});