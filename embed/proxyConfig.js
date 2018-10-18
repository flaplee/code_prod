'use strict';
//devProxy config
module.exports = [{
    // http://192.168.0.180:9002/   http://test4.delicloud.cn:9002/ http://t.web.delicloud.com/
    remote: 'http://t.delicloud.com/',
    local: {
        prefix: '/',
        root: './',
        index: 'index.html'
    },
    port: 1995
}
];