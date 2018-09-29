;
(function() {
    var shareConfig = {
        /*text: "我是对话框标题",*/
        title: "得力分享demo",
        desc: "得力分享内容",
        link: "http://www.nbdeli.com/",
        imgUrl: "http://www.nbdeli.com/formwork/default/images/logo.gif"
    };
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        appId: "373175764691976192", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "26fcd1cab8ff455bfea0ee59a67bf122" // 必填，服务端生成的签名
    });
    var Page = {
        init: function() {
            var that = this;
            var i = 0;
            $("[data-type]").on("click", function(a) {
                var d = $(a.target),
                    e = d.attr("data-type");
                switch (e) {
                    case "supbrowser":
                        deli.common.supbrowser({
                            "ie": 8
                        }, function(data) {
                            console.log("supbrowser data", data);
                        }, function(resp) {
                            console.log("supbrowser resp", resp);
                        });
                        break;
                    case "onlogout":
                        deli.app.onlogout({}, function(data) {
                            alert("我设置退出~");
                        }, function(resp) {});
                        break;
                }
            });
        }
    };
    // 验证签名成功
    deli.ready(function() {
        console.log("签名成功");
        Page.init();
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
})();
