'use strict';
module.exports = [{
    // http://192.168.0.202:9002/ http://test4.delicloud.cn:9002/ http://t.delicloud.com/
    remote: 'http://t.delicloud.com/',
    local: {
        prefix: '/',
        root: './',
        index: 'mobile.html'
    },
    port: 4000
},{
    remote: 'http://t.delicloud.com/',//http://t.delicloud.com/
    local: {
        prefix: '/',
        root: './',
        index: 'index.html'
    },
    port: 1992
},
{
    remote: 'http://t.delicloud.com/',
    local: {
        prefix: '/',
        root: './',
        index: 'import.html'
    },
    port: 1993
}];