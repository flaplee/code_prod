$(function(){
    var util = {
        getQuery: function(param, isRedirect) {
            var url = window.location.href;
            var searchIndex = url.indexOf('?');
            if(isRedirect && isRedirect == true){
                var durl = url.slice(searchIndex + 1);
                var dIndex = durl.indexOf('=');
                var searchParams = durl.slice(dIndex + 1);
                return searchParams.trim();
            }else{
                var searchParams = url.slice(searchIndex + 1).split('&');
                for (var i = 0; i < searchParams.length; i++) {
                    var items = searchParams[i].split('=');
                    if (items[0].trim() == param) {
                        return items[1].trim();
                    }
                }
            }
        },
        setCookie: function (name,value,exp,path,domain) {
            var exp = exp || 0;
            var et = new Date();
            if ( exp != 0 ) {
                et.setTime(et.getTime() + exp*3600000);
            } else {
                et.setHours(23); et.setMinutes(59); et.setSeconds(59); et.setMilliseconds(999);
            }
            var more = "";
            var path = path || "/";
            var domain = domain || "";
            if (domain != "")
                more += "; domain="+domain;
            more += "; path="+path;
            document.cookie = name + "=" + escape(value) + more + "; expires=" + et.toGMTString();
        },
        getCookie: function (name) {
            var res = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            return null != res ? unescape(res[2]) : null;
        },
        /*setCookie: function(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + '; path=/' + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        },
        getCookie: function(c_name) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == c_name) {
                    return unescape(y);
                }
            }
        },*/
        SHA256: function(s) {
            var chrsz = 8;
            var hexcase = 0;

            function safe_add(x, y) {
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            }

            function S(X, n) {
                return (X >>> n) | (X << (32 - n));
            }

            function R(X, n) {
                return (X >>> n);
            }

            function Ch(x, y, z) {
                return ((x & y) ^ ((~x) & z));
            }

            function Maj(x, y, z) {
                return ((x & y) ^ (x & z) ^ (y & z));
            }

            function Sigma0256(x) {
                return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
            }

            function Sigma1256(x) {
                return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
            }

            function Gamma0256(x) {
                return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
            }

            function Gamma1256(x) {
                return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
            }

            function core_sha256(m, l) {
                var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
                var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
                var W = new Array(64);
                var a, b, c, d, e, f, g, h, i, j;
                var T1, T2;
                m[l >> 5] |= 0x80 << (24 - l % 32);
                m[((l + 64 >> 9) << 4) + 15] = l;
                for (var i = 0; i < m.length; i += 16) {
                    a = HASH[0];
                    b = HASH[1];
                    c = HASH[2];
                    d = HASH[3];
                    e = HASH[4];
                    f = HASH[5];
                    g = HASH[6];
                    h = HASH[7];
                    for (var j = 0; j < 64; j++) {
                        if (j < 16) W[j] = m[j + i];
                        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                        h = g;
                        g = f;
                        f = e;
                        e = safe_add(d, T1);
                        d = c;
                        c = b;
                        b = a;
                        a = safe_add(T1, T2);
                    }
                    HASH[0] = safe_add(a, HASH[0]);
                    HASH[1] = safe_add(b, HASH[1]);
                    HASH[2] = safe_add(c, HASH[2]);
                    HASH[3] = safe_add(d, HASH[3]);
                    HASH[4] = safe_add(e, HASH[4]);
                    HASH[5] = safe_add(f, HASH[5]);
                    HASH[6] = safe_add(g, HASH[6]);
                    HASH[7] = safe_add(h, HASH[7]);
                }
                return HASH;
            }

            function str2binb(str) {
                var bin = Array();
                var mask = (1 << chrsz) - 1;
                for (var i = 0; i < str.length * chrsz; i += chrsz) {
                    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
                }
                return bin;
            }

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }
                return utftext;
            }

            function binb2hex(binarray) {
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for (var i = 0; i < binarray.length * 4; i++) {
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                        hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                }
                return str;
            }
            s = Utf8Encode(s);
            return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
        },
        buildDauth:function(userid, token, timestamp) {
            //userid token timestamp 
            var hashLoc = userid + token + timestamp;
            var sha256 = util.SHA256(hashLoc);
            var hash = sha256.substr(0, 32);
            return hash;
        },
        updateURLParameter: function(url, param, paramVal){
            var TheAnchor = null;
            var newAdditionalURL = "";
            var tempArray = url.split("?");
            var baseURL = tempArray[0];
            var additionalURL = tempArray[1];
            var temp = "";
            if (additionalURL) {
                var tmpAnchor = additionalURL.split("#");
                var TheParams = tmpAnchor[0];
                    TheAnchor = tmpAnchor[1];
                if(TheAnchor)
                    additionalURL = TheParams;

                tempArray = additionalURL.split("&");

                for (i=0; i<tempArray.length; i++)
                {
                    if(tempArray[i].split('=')[0] != param)
                    {
                        newAdditionalURL += temp + tempArray[i];
                        temp = "&";
                    }
                }        
            }else{
                var tmpAnchor = baseURL.split("#");
                var TheParams = tmpAnchor[0];
                    TheAnchor  = tmpAnchor[1];
                if(TheParams)
                    baseURL = TheParams;
            }
            if(TheAnchor)
            paramVal += "#" + TheAnchor;
            var rows_txt = temp + "" + param + "=" + paramVal;
            return baseURL + "?" + newAdditionalURL + rows_txt;
        },
        // 上传文件
        ajaxFileUpload: function(orgid, userid, token, o) {
            //util.showLoading();
            $.ajaxFileUpload({
                url: '/web/v1.0/import/employee', //用于文件上传的服务器端请求地址
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'upload-file', //文件上传域的ID
                dataType: 'json', //返回值类型 一般设置为json
                beforeSend:function(xhr){
                    xhr.setRequestHeader("dauth", userid + ' ' + (new Date().valueOf()) + ' ' + util.buildDauth(userid, token, (new Date().valueOf())));
                    xhr.setRequestHeader("duagent", "_web");
                },
                data: {
                    org_id: orgid,
                    admin_id: userid
                },
                success: function (res, status){
                    o.find('#upload-file').val('');
                    var json = $.parseJSON(jQuery(res).text());
                    if(json.code == 0){
                        scnt = json.data['result'].success_list;
                        fcnt = json.data['result'].fail_list;
                        o.find('span.nav-enable-num').text(scnt.length);
                        o.find('span.nav-unable-num').text(fcnt.length);
                        util.setTargetHtml(o.find('.imports-inner-data .imports-table .imports-table-enable table.table tbody.tbody'), 'enable', scnt);
                        util.setTargetHtml(o.find('.imports-inner-data .imports-table .imports-table-unable table.table tbody.tbody'), 'unable', fcnt);
                        if(scnt.length > 0){
                            o.find('.imports-steps').hide();
                            o.find('.imports-info').show();
                            o.find('')
                            loc.args.type = 'steps';
                            loc.args.status = 'success';
                        }else{
                            loc.args.type = 'steps';
                            loc.args.status = 'error';
                        }
                        setTimeout(function(){
                            loc.args.type = 'steps';
                            loc.args.status = 'data';
                            loc.args.imports = (scnt.length > 0) ? 'enable' : 'unable';
                            kernel.replaceLocation(loc);
                        }, 1000);
                    }else{

                    }
                },
                error: function (res, status, e){
                    o.find('#upload-file').val('');
                    var json = $.parseJSON(jQuery(res.responseText).text());
                    if(json.code == 0){
                        scnt = json.data['result'].success_list;
                        fcnt = json.data['result'].fail_list;
                        o.find('span.nav-enable-num').text(scnt.length);
                        o.find('span.nav-unable-num').text(fcnt.length);
                        util.setTargetHtml(o.find('.imports-inner-data .imports-table .imports-table-enable table.table tbody.tbody'), 'enable', scnt);
                        util.setTargetHtml(o.find('.imports-inner-data .imports-table .imports-table-unable table.table tbody.tbody'), 'unable', fcnt);
                    }else{
                        if(json.code == '9103101'){
                            o.find('p.user-error-title').hide();
                            o.find('p.authority-error-title').show();
                        }else{
                            o.find('p.user-error-title').show();
                            o.find('p.authority-error-title').hide();
                        }
                    }
                }
            });
            return false;
        },
        // 处理上传表格数据
        setTargetHtml: function(o, type, data){
            o.find('>').remove();
            if(data && data.length > 0){
                var targetHtml = '';
                $.each(data, function(i, n){
                    targetHtml += '<tr>\
                        <td>'+ (i + 1) +'</td>\
                        <td>'+ data[i].name +'</td>\
                        <td>'+ data[i].employee_num +'</td>\
                        <td>'+ data[i].dept_name +'</td>\
                        <td>'+ data[i].title +'</td>\
                        <td>'+ data[i].mobile +'</td>\
                        '+ ((type && type == 'unable') ? '<td><span class="red">通讯录中已存在该手机号码的员工</span></td>' : '') +'\
                    </tr>';
                });
                o.append(targetHtml);
            }
        }
    };
    var userid = util.getCookie('userid') || util.getQuery('user_id'),
        token = util.getCookie('token') || util.getQuery('token'),
        orgid = util.getCookie('orgid') || util.getQuery('org_id');
    var $imports = $('#imports'),
        $importsMenu = $imports.find('.imports-menu'),
        $importsBox = $imports.find('.imports-box'),
        $importsInfo = $importsBox.find('.imports-info'),
        $importsInner = $importsInfo.find('.imports-inner'),
        $importsTable = $importsInner.find('.table'),
        $tmp = $importsTable.find('.tbody'),
        $importsSteps = $importsBox.find('.imports-steps'),
        $downloadBtn = $importsSteps.find('.btn-step-download'),
        $uploadBtn = $importsSteps.find('.btn-step-upload'),
        $uploadForm = $importsSteps.find('#upload-form'),
        $uploadHideBtn = $importsSteps.find('#upload-file');
    if(userid && orgid && token){
        $uploadForm.on('change','#upload-file', function(){
            util.ajaxFileUpload(orgid, userid, token, $importsInner);
        });
    }else{
        location.href = 'http://t.delicloud.com/oauth/?redirect=http://t.delicloud.com/import/';
    }
});