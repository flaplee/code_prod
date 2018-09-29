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
        signature: "26fcd1cab8ff455bfea0ee59a67bf122", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    var Page = {
        init: function() {
            setTimeout(function(){
                deli.common.navigation.setTitle({
                    "title": "测试返回页面2"
                }, function(data) {}, function(resp) {});
                deli.common.navigation.goBack({},function(data){
                    deli.common.navigation.setTitle({
                    "title": "测试返回页面2"
                }, function(data) {}, function(resp) {});
                },function(resp){});
            }, 500);
        }
    };
    Page.init();
    // 验证签名成功
    deli.ready(function() {
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
})();
