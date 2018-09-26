$(function() {
    function k(a) {
        a.addClass("login-loading"), setTimeout(function() {
            $.ajax({
                url:"/web/v1.0/barcode_login/public",
                type:"get",
                dataType:"json",
                success:function(b) {
                    if (a.removeClass("login-loading"), 0 == b.code) {
                        var c = b.data["result"], d = c.cid, e = c.data;
                        e ? (a.html(""), new QRCode(document.getElementById("qrcode"), {
                            text:e,
                            width:234,
                            height:234,
                            correctLevel:QRCode.CorrectLevel.L
                        }), l(d, "disconnect")) :a.html("");
                    } else alert(b.msg);
                },
                error:function() {
                    alert("网络或服务器错误");
                }
            });
        }, 0);
    }
    function l(a, b) {
        var c = new SockJS("http://t.delicloud.com/web/web-gateway-websocket");
        j = Stomp.over(c), j.connect({}, function() {
            var d = "/user/" + a + "/barcode/login";
            m(a, d, b);
        });
    }
    function m(a, c, f) {
        j.subscribe("/user/" + a + "/info", function(a) {
            var b = JSON.parse(a.body);
            console.log("json~~~~~~~~~~~", b), d.hide(), g.hide(), e.find("div.success-img").css({
                "background-image":"url(" + b.avatar_url + ")"
            }).attr("title", b.name), e.show();
        }), j.subscribe(c, function(a) {
            var c = JSON.parse(a.body);
            c && c.user_id ? (i = c, "_user_" == i.type && (util.setCookie("token", i.token), 
            util.setCookie("userid", i.user_id), util.setCookie("expire", i.expire)), f && "disconnect" == f && n(), 
            o($orgList, {
                userid:i.user_id,
                token:i.token
            })) :setTimeout(k(b.find(".loginQr")), 1e3);
        });
    }
    function n() {
        null != j && j.disconnect();
    }
    function o(a, c) {
        $.ajax({
            url:"/web/v1.0/admin/auth/my",
            type:"get",
            dataType:"json",
            headers:{
                Dauth:c.userid + " " + new Date().valueOf() + " " + util.buildDauth(c.userid, c.token, new Date().valueOf()),
                Duagent:'_web'
            },
            data:{
                type:"group"
            },
            success:function(c) {
                var f, h;
                0 == c.code ? (a.find(">").remove(""), f = c.data.result, f && f.length && f.length > 0 ? (b.hide(), 
                $orgBox.show(), h = f.length, 3 >= h ? 1 == h ? (util.setCookie("orgid", f[0].org_id), 
                util.setCookie("parentid", f[0].top_department_id), util.setCookie("orgname", f[0].org_name)) :a.addClass("org-list-seldom") :a.addClass("org-list-plenty"), 
                $.each(f, function(b, c) {
                    function e(a, b) {
                        a.find("a.list-item-inner").on("click", function(a) {
                            a.stopPropagation();
                            var c = /\/login\b/, d = util.getQuery("redirect", !0);
                            c.test(d) && (d = util.updateURLParameter(d, "redirect", window.location.href)), 
                            util.setCookie("user_id", i.user_id, 7, void 0, d), util.setCookie("org_id", b, 7, void 0, d), 
                            util.setCookie("token", i.token, 7, void 0, d), util.setCookie("uuid", "", 7, void 0, d), 
                            window.location.href = d + "?user_id=" + i.user_id + "&org_id=" + b + "&token=" + i.token + "&uuid=";
                        });
                    }
                    if (1 == c.is_admin) {
                        var d = $('<li class="list-item"><a class="list-item-inner noline" href="javascript:;" data-oid="' + c.org_id + '" data-pid="' + c.top_department_id + '">' + c.org_name + "</a></li>");
                        a.append(d), e(d, c.org_id);
                    }
                })) :(b.show(), $orgBox.hide(), d.hide(), e.hide(), e.find("div.success-img").css({
                    "background-image":"url(" + c.avatar_url + ")"
                }).attr("title", c.name), g.show())) :alert(c.msg);
            },
            error:function() {
                alert("网络或服务器错误");
            }
        });
    }
    var i, j, a = $("#login"), b = a.find(".login-box"), c = b.find("#loginQr"), d = c.find(".login-doing"), e = c.find(".login-success"), f = e.find(".success-btn"), g = c.find(".login-fail"), h = g.find(".fail-btn");
    $orgBox = a.find(".org-box"), $orgList = $orgBox.find(".org-wrap .org-inner .org-list"), 
    i = {}, j = null, k(b.find(".loginQr")), $(document).on("click", ".loginQr", function() {
        var c = b.find(".loginQr"), d = c[this === c[0] ? 1 :0];
        0 === this.childNodes.length && (d && d.childNodes.length > 0 ? this.innerHTML = d.innerHTML :$.ajax({
            url:"/web/v1.0/barcode_login/public",
            type:"get",
            dataType:"json",
            success:function(a) {
                if (0 == a.code) {
                    var b = a.data["result"], d = b.cid, e = b.data;
                    e ? (c.html(""), new QRCode(document.getElementById("qrcode"), {
                        text:e,
                        width:234,
                        height:234,
                        correctLevel:QRCode.CorrectLevel.L
                    }), l(d)) :c.html("");
                } else alert(a.msg);
            },
            error:function() {
                alert("网络或服务器错误");
            }
        }));
    }), f.on("click", function() {
        k(b.find(".loginQr"), "disconnect"), g.hide(), e.hide(), d.show();
    }), h.on("click", function() {
        k(b.find(".loginQr"), "disconnect"), g.hide(), e.hide(), d.show();
    });
});