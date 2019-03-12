'use strict';
var _hmt;
! function() {
    var head = document.head || document.getElementsByTagName('head')[0];
    if ($.browser.msie && parseInt($.browser.version) < 7) {
        window.onload = function() {
            document.getElementById('loading').firstChild.firstChild.firstChild.data = '请使用IE7+、Chrome、Firefox访问';
        };
    } else {
        //百度统计代码
        if (location.host === 'your_production_host') {
            _hmt = [
                ['_setAutoPageview', false]
            ];
            require(['//hm.baidu.com/hm.js?[your_hmid]'], function() {
                //由于百度统计在head中插入的input标签在ie7中会导致jquery选择器遍历时出错，这里尝试将其移除
                if ($.browser.msie && parseInt($.browser.version) === 7) {
                    var ipt = head.getElementsByTagName('input')[0];
                    if (ipt) {
                        head.removeChild(ipt);
                    }
                }
            });
        }
    }
}();