import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies'
import 'whatwg-fetch'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import Nav from './Nav'
import Printer from './Printer'

import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class PrintIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user:{
                user_id: '',
                org_id: '',
                token: '',
                app_id:'',
                admin: false
            },
            sn: (new URLSearchParams(props.location.search)).get('sn') || Cookies.load('sn') || '',
            printer:{},
            printerCurrent: (new URLSearchParams(props.location.search)).get('printercurrent') || Cookies.load('printercurrent') || 0,
            printerList:{},
            inkbox:{},
            navlist: [
                {
                    title: '选择图片打印',
                    url: ''
                },
                {
                    title: '选择文件打印',
                    url: ''
                },
                {
                    title: '打印任务',
                    url: ''
                },
                {
                    title: '打印机管理',
                    url: ''
                }
            ],
            fileList: [],
            printType: 'upload',
            printTaskInfo: {},
            redirect:{
                chooseTask: false,
                previewIndex: false,
                scandenied: false,
                scanunbind: false,
                login: false
            },
            printData: {
                'duplexMode': 1,
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 2,
                'printEndPage': 1,
                'copyCount': 1,
                'printDpi': 600,
                'paperSize': 'A4',
                'printColorMode': 'black',
                'printWhole': 0,
                'printStartPage': 1
            },
            timer: ''
        };
    };

    componentWillUpdate(props, state) {
    }

    componentWillMount(){
    }
    
    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-index').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        const self = this
        if (self.state.sn != '') { Cookies.save('sn', self.state.sn, { path: '/' });}
        let signPrint;
        let appIdPrint;
        let timestampPrint = '1536041270823';
        let nonceStrPrint = 'abcdefg';
        if (Cookies.load('sign') && Cookies.load('timestamp') && Cookies.load('nonceStr')) {
            signPrint = Cookies.load('sign')
            timestampPrint = Cookies.load('timestamp')
            nonceStrPrint = Cookies.load('nonceStr')
        } else {
            timestampPrint = (Date.now().toString())
            nonceStrPrint = "abcdefg";
        }
        
        self.getAppData(timestampPrint, nonceStrPrint, function (response) {
            if (response && response.signStr) {
                signPrint = response.signStr
                appIdPrint = response.appId
                Cookies.save('sign', signPrint, { path: '/' });
                Cookies.save('appId', appIdPrint, { path: '/' });
                Cookies.save('timestamp', timestampPrint, { path: '/' });
                Cookies.save('nonceStr', nonceStrPrint, { path: '/' });
                self.setState({ "user": { "app_id": appIdPrint } })
            }

            // 注入配置信息
            deli.config({
                noncestr: nonceStrPrint, // 必填，生成签名的随机串
                appId: appIdPrint || Cookies.load('appId'), // 必填，应用ID  373175764691976192
                timestamp: timestampPrint, // 必填，生成签名的时间戳
                signature: signPrint || Cookies.load('sign') // 必填，服务端生成的签名 26fcd1cab8ff455bfea0ee59a67bf122
            });

            // 验证签名成功
            deli.ready(function () {
                // 通用设置
                deli.common.navigation.setTitle({
                    "title": "云打印"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "icon": "http://t.static.delicloud.com/h5/web/cloudprint/images/icon/scan_code@3x.png"
                }, function(data) {
                    deli.app.code.scan({
                        type: 'qrcode',
                        app_id: Cookies.load('appId'),
                        direct: true
                    }, function (json) {}, function(resp) {});
                }, function(resp) {});

                deli.common.navigation.setColors({
                    "color": "#5D85E0",
                    "notify_theme": "white",
                    "nav_theme": "white"
                }, function (data) {}, function (resp) {});

                // 关闭
                deli.common.navigation.close({}, function (data) {
                    // 重置
                    Cookies.remove('appId');
                    Cookies.remove('sign');
                    Cookies.remove('userId');
                    Cookies.remove('orgId');
                    Cookies.remove('token');
                    Cookies.remove('admin');
                    //Cookies.remove('loginToken');
                }, function (resp) {});
                
                deli.common.notification.showPreloader();
                if(!(Cookies.load('userId') && Cookies.load('orgId') && Cookies.load('token'))){
                    deli.app.user.get({
                        "user_id": ""
                    }, function (data) {
                        if (data) {
                            self.setState({ "user": { "user_id": data.user.id } })
                            deli.app.organization.get({
                                "org_id": ""
                            }, function (odata) {
                                if(odata){
                                    self.setState({ "user": { "org_id": odata.organization.id } })
                                    deli.app.session.get({
                                        user_id: data.user.id
                                    }, function (udata) {
                                        Cookies.save('loginToken', udata.token, { path: '/' });
                                        self.getLocalData({
                                            user_id: data.user.id,
                                            org_id: odata.organization.id,
                                            token: udata.token
                                        }, self.state.sn, function(){
                                            if (udata._d_data && udata._d_from && udata._d_from == 'qrCode') {
                                                if ((udata._d_data).indexOf('/ca/') >= 0){
                                                    self.setState({ "redirect": { "login": true }, "user": { "task_code": udata._d_data } })
                                                }
                                            } else if (udata._d_data && udata._d_from && udata._d_from == 'app_file') {
                                                let urlFileList = []
                                                //文件转换
                                                self.handleFileUpload(udata._d_data, function(json){
                                                    //单个文件处理
                                                    if (json.status == 1) {
                                                        urlFileList.push({
                                                            'id': json.id,
                                                            'fileSuffix': json.fileType,
                                                            'fileName': json.fileName,
                                                            'totalPage': json.totalPage,
                                                            'printMd5': json.pdfMd5,
                                                            'printUrl': json.printUrl,
                                                            'fileSource': json.fileSource,
                                                            'printPDF': true
                                                        })
                                                        let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json.totalPage })
                                                        self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                                                            localStorage.removeItem('printPreviewData')
                                                            localStorage.setItem('printPreviewData', JSON.stringify(urlFileList))
                                                            Cookies.save('printPreviewType', 'file', { path: '/' });
                                                            Cookies.save('printData', tmpPrintData, { path: '/' });
                                                            deli.common.notification.hidePreloader();
                                                        });
                                                        // 处理文件转化未完成
                                                        if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
                                                    } else {
                                                        // 处理文件转化未完成
                                                        self.startConvertPoll(json.id, function (trans) {
                                                            for (let i = 1; i <= trans.totalPage; i++) {
                                                                urlFileList.push({
                                                                    'id': trans.id,
                                                                    'fileSuffix': trans.fileType,
                                                                    'fileName': trans.fileName,
                                                                    'totalPage': trans.totalPage,
                                                                    'printMd5': trans.pdfMd5,
                                                                    'printUrl': trans.printUrl,
                                                                    'fileSource': trans.fileSource,
                                                                    'printPDF': true
                                                                })
                                                            }
                                                            let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                                                            self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                                                                localStorage.removeItem('printPreviewData')
                                                                localStorage.setItem('printPreviewData', JSON.stringify(urlFileList))
                                                                Cookies.save('printPreviewType', 'file', { path: '/' });
                                                                Cookies.save('printData', tmpPrintData, { path: '/' });
                                                                deli.common.notification.hidePreloader();
                                                            });
                                                            // 处理文件转化完成
                                                            if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
                                                        })
                                                    }
                                                })
                                            }
                                        });
                                    }, function (uresp) {});
                                }else{
                                    deli.common.notification.hidePreloader();
                                    deli.common.notification.prompt({
                                        "type": 'error',
                                        "text": '获取组织信息失败',
                                        "duration": 1.5
                                    }, function (data) {}, function (resp) {});
                                }
                            }, function (oresp) {});
                        }else{
                            deli.common.notification.hidePreloader();
                            deli.common.notification.prompt({
                                "type": 'error',
                                "text": '获取员工信息失败',
                                "duration": 1.5
                            }, function (data) {}, function (resp) {});
                        }
                    }, function (resp) {
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": '获取员工信息失败',
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    });
                }else{
                    self.startGetNewListPage()
                    if (self.state.sn) {
                        self.getPrinterData(self.state.sn)
                        deli.common.notification.hidePreloader();
                    } else {
                        //获取打印机列表并选择上次的打印机
                        self.getPrinterList({
                            'page': 1,
                            'limit': 10
                        }, function (sn) {
                            if(sn){self.getPrinterData(sn)}
                            deli.common.notification.hidePreloader();
                        });
                    }
                }
            });

            //验证签名失败
            deli.error(function () {
                console.log("deli.error")
            });
        });
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }
    
    //监听Printer变化状态
    transPrinter(printer) {
        console.log("printer", printer);
    }

    //监听Timer变化状态
    transTimer(timer){
        this.stopGetNewListPage(timer)
    }

    // 处理deli e+ 第三方url文件转PDF
    handleFileUpload(url, callback) {
        const self = this
        fetch(convertURL + '/file/uploadByUrl', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "MP_TOKEN": Cookies.load('token'),
            },
            body: JSON.stringify({
                "converterUrlVos": [{
                    "fileUrl": url.slice(0, url.lastIndexOf('?name')),
                    "fileName": decodeURIComponent(self.getUrlQuery('name', url)),
                    "fileType": url.substring(url.lastIndexOf("\.") + 1, url.length),
                    "fileSource": "disk"
                }]
            })
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    console.log("json1", json)
                    if (json.code == 0) {
                        if (json.data[0] && json.data[0].status != -1) {
                            if (typeof callback === 'function') {
                                callback(json.data[0])
                            }
                        } else {
                            deli.common.notification.hidePreloader();
                            deli.common.notification.prompt({
                                "type": "error",
                                "text": "文件无法解析,请重试",
                                "duration": 2
                            }, function (data) { }, function (resp) { });
                        }
                    } else {
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 2
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.hidePreloader();
            deli.common.notification.prompt({
                "type": "error",
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
            console.log("错误:" + err);
        });
    }

    //开启文件转换状态
    startConvertPoll(id, callback) {
        const self = this
        const timer = setInterval(() => {
            self.getConvertStatus(id, callback);
        }, 2000);
        self.setState({ timer: timer })
    }

    //关闭文件转换状态
    stopConvertPoll(timer) {
        clearInterval(timer)
    }

    getUrlQuery(param, url) {
        let searchIndex = url.lastIndexOf('?');
        let searchParams = url.slice(searchIndex + 1).split('&');
        for (let i = 0; i < searchParams.length; i++) {
            let items = searchParams[i].split('=');
            if (items[0].trim() == param) {
                return items[1].trim();
            }
        }
    }
    
    renderPrinter() {
        const user = this.state.user;
        const printer = this.state.printer;
        const printerCurrent = this.state.printerCurrent;
        const result = <Printer user={user} printer={printer} printerCurrent={printerCurrent}></Printer>;
        return result;
    }

    //获取auth信息
    getLocalData(data, printSn, callback){
        var self = this
        //登录api
        fetch(mpURL + '/a/auth/login', {
            method: 'POST',
            headers: {
                user_id: data.user_id,
                org_id: data.org_id,
                token: data.token
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    console.log("json", json)
                    if (json.code == 0) {
                        self.startGetNewListPage()
                        self.setState({"user":{token: data.data }}, function(){
                            Cookies.save('userId', data.user_id, { path: '/' });
                            Cookies.save('orgId', data.org_id, { path: '/' });
                            Cookies.save('token', json.data.token, { path: '/' });
                            Cookies.save('admin', json.data.admin, { path: '/' });
                            self.setState({ "user": { "token": json.data.token, "user_id": data.user_id, "org_id": data.org_id, "admin": json.data.admin } })
                        })
                        if(printSn){
                            self.getPrinterData(printSn, callback)
                        }else{
                            //获取打印机列表并选择上次的打印机
                            self.getPrinterList({
                                'page': 1,
                                'limit': 10
                            }, function(sn) {
                                if(sn){
                                    self.getPrinterData(sn, callback)
                                }
                                deli.common.notification.hidePreloader();
                            });
                        }
                    }else{
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        },function(data){},function(resp){});
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
            deli.common.notification.hidePreloader();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //获取打印机列表
    getPrinterList(data, callback) {
        const self = this
        let formData = new FormData();
        formData.append('pageNo', data.page);
        formData.append('pageSize', data.limit);
        //打印机列表
        fetch(mpURL + '/app/printer/queryPage', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: formData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        // update 20180904
                        if(json.data.rows.length > 0){
                            let current = self.state.printerCurrent;
                            self.setState({ printer: json.data.rows[current]}, function () {
                                if(typeof callback === 'function'){
                                    callback(json.data.rows[current].printerSn);
                                }
                            });
                        }else if(json.data.rows.length == 0){
                            self.setState({ printer: '' }, function () {
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            });
                        }
                    } else {
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        },function(data){},function(resp){});
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.hidePreloader();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //获取打印机信息
    getPrinterData(sn, callback){
        const self = this
        //查询打印机信息
        fetch(mpURL + '/app/printer/queryStatus/' + sn, {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (resp1) {
                    console.log("resp1", resp1)
                    if (resp1.code == 0) {
                        Cookies.save('printer', resp1.data, { path: '/' });
                        self.setState({ printer: resp1.data }, function () {
                            console.log("test2")
                            //查询打印机墨水信息
                            fetch(mpURL + '/app/inkbox/queryDetails/' + self.state.printer.inkboxSn, {
                                method: 'POST',
                                headers: {
                                    "MP_TOKEN": Cookies.load('token')
                                },
                                body: {}
                            }).then(
                                function (response) {
                                    if (response.status !== 200) {
                                        deli.common.notification.toast({
                                            "text": '网络错误，请重试',
                                            "duration": 2
                                        }, function (data) { }, function (resp) { });
                                        return;
                                    }
                                    response.json().then(function (resp2) {
                                        if (resp2.code == 0) {
                                            self.setState({ inkbox: resp2.data }, function () {
                                                console.log("test3")
                                            });
                                        }else{
                                            deli.common.notification.prompt({
                                                "type": 'error',
                                                "text": resp2.msg,
                                                "duration": 1.5
                                            }, function (data) { }, function (resp) { });
                                        }
                                        if (typeof callback === 'function') {
                                            callback();
                                        }
                                    });
                                }
                            ).catch(function (err) {
                                deli.common.notification.toast({
                                    "text": '网络错误，请重试',
                                    "duration": 2
                                }, function (data) { }, function (resp) { });
                            });
                        })
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": resp1.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //获取应用信息
    getAppData(timestamp, nonceStr, callback){
        const self = this
        let appData = new FormData();
        appData.append('timestamp', timestamp);
        appData.append('nonceStr', nonceStr);
        //获取应用id
        fetch(mpURL + '/a/auth/config', {
            method: 'POST',
            headers: {},
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (data) {
                    if (data.code == 0) {
                        Cookies.save('appId', data.data.appId, { path: '/' });
                        Cookies.save('sign', data.data.signStr, { path: '/' });
                        // todo
                        if (typeof callback === 'function'){
                            callback(data.data)
                        }
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //显示头部任务状态图标
    setQrcodeStatus(data){
        const self = this
        deli.common.navigation.setRight({
            "icon": "http://t.static.delicloud.com/h5/web/cloudprint/images/icon/scan_code" + ((data  && data.length > 0) ? '02' : '')+"@3x.png"
        }, function(innerdata) {
            deli.app.code.scan({
                type: 'qrcode',
                app_id: Cookies.load('appId'),
                direct: true
            }, function (json) {
                if (data){
                    self.getScanQrcode(json.text, 'web', data)
                }
            }, function(resp) {});
        }, function(resp) {});
    }

    // 获取新的任务状态及数据
    getNewListPage() {
        const self = this
        let appData = new FormData();
        appData.append('pageNo', 1);
        appData.append('pageSize', 100);
        //分页查询打印机任务列表
        fetch(mpURL + '/v1/app/printTask/queryScanPrintTask/P_1_10', {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    self.stopGetNewListPage(self.state.timer)
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        if (json.data.total >= 0){
                            self.setState({
                                printTaskInfo: json.data.list
                            }, function () {
                                self.setQrcodeStatus(json.data.list)
                            })
                        }else{
                            self.setQrcodeStatus()
                        }
                    }else{
                        self.stopGetNewListPage(self.state.timer)
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
            self.stopGetNewListPage(self.state.timer)
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    // 开始获取新的任务状态及数据
    startGetNewListPage() {
        const self = this
        const timer = setInterval(() => {
            self.getNewListPage();
        }, 10000);
        self.setState({ timer: timer })
    }

    // 关闭获取新的任务状态及数据
    stopGetNewListPage(timer){
        clearInterval(timer)
    }
    
    // 处理扫码结果
    getScanQrcode(text, type, printTaskInfo){
        const self = this
        let appData = new FormData();
        appData.append('qrCode', text);
        //appData.append('printerType', type);
        //查询打印机状态
        fetch(mpURL + '/app/printerTask/scanQrCode', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if(json.code == 0){
                        if (printTaskInfo) {
                            //只有一条数据时进入打印预览，否则进入选择打印任务
                            if (printTaskInfo.length > 1) {
                                self.setState({
                                    sn: text,
                                    printType: 'scan',
                                    printTaskInfo: printTaskInfo,
                                    fileType: 'file',
                                    fileList: [],
                                    redirect: {
                                        chooseTask: true,
                                        previewIndex: false
                                    }
                                })
                            } else if (printTaskInfo.length == 1){
                                const singleFileList = printTaskInfo[0].fileList
                                const singleFileType = (singleFileList.length > 1 || (singleFileList.length == 1 && singleFileList[0].fileSuffix != 'pdf')) ? 'image' : 'file'
                                Cookies.save('printPreviewType', singleFileType, { path: '/' });
                                self.setState({
                                    sn: text,
                                    printType: 'scan',
                                    printTaskInfo: printTaskInfo[0],
                                    fileType: singleFileType,
                                    fileList: singleFileList,
                                    redirect: {
                                        chooseTask: false,
                                        previewIndex: true
                                    }
                                })
                            }
                        } else {
                            self.setState({
                                sn: text,
                                fileList: [],
                                redirect: {
                                    chooseTask: false,
                                    previewIndex: false
                                }
                            })
                        }
                    } else if(json.code == -1) {
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    } else if (json.code == -3) {
                        self.setState({ "redirect": { "scandenied": true } }, function(){})
                    } else if (json.code == -4) {
                        self.setState({ "redirect": { "scanunbind": true } }, function(){})
                    }else{
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    render(){
        if (this.state.redirect.chooseTask) {
            const sn = this.state.printer.printerSn
            const name = this.state.printer.printerName
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            const printTaskInfo = this.state.printTaskInfo
            const printType = 'scan'
            const fileType = []
            localStorage.removeItem('chooseTaskInfo')
            localStorage.setItem('chooseTaskInfo', JSON.stringify(printTaskInfo))
            return <Redirect push to={
                { pathname: "/choosetask", search: "?sn=" + sn + "&status=" + status + "&type=" + printType + "&name=" + name +"", state: { "sn": sn, "fileType": fileType, "fileList": fileList, "printTaskInfo": printTaskInfo, "status": status}  }
            } />;
        }

        if (this.state.redirect.previewIndex) {
            const sn = this.state.printer.printerSn
            const name = this.state.printer.printerName
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            const printTaskInfo = this.state.printTaskInfo
            const printType = this.state.printType
            const fileType = this.state.fileType
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=" + printType + "&name=" + name +"", state: { "sn": sn, "fileType": fileType, "fileList": fileList, "printTaskInfo": printTaskInfo, "status": status}  }
            } />;
        }
        
        if (this.state.redirect.fileNav) {
            const sn = this.state.printer.printerSn
            const name = this.state.printer.printerName
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            const fileType = this.state.fileType
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload&name=" + name +"", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "status": status } }
            } />;
        }

        if (this.state.redirect.scandenied) {
            const sn = this.state.printer.printerSn
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            return <Redirect push to={
                { pathname: "/scandenied", search: "?sn=" + sn + "&status=" + status +"", state: { "sn": sn, "fileList": fileList, "status": status}  }
            } />;
        }

        if (this.state.redirect.scanunbind) {
            const sn = this.state.printer.printerSn
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            return <Redirect push to={
                { pathname: "/scanunbind", search: "?sn=" + sn + "", state: { "sn": sn, "fileList": fileList } }
            } />;
        }

        if (this.state.redirect.login) {
            const sn = this.state.printer.printerSn
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            this.stopGetNewListPage(this.state.timer)
            const taskCode = this.state.user.task_code
            return <Redirect push to={
                { pathname: "/login", search: "?taskCode=" + taskCode + "", state: { "taskCode": taskCode} }
            } />;
        }

        return(
            <div className="print-index"
            id="print-index"
            onTouchMove={this.unableTouchMove.bind(this)}>
                <Printer user={this.state.user} printer={this.state.printer} printerCurrent={this.state.printerCurrent} inkbox={this.state.inkbox} transPrinter={printer => this.transPrinter(printer)}></Printer>
                <Nav navlist={this.state.navlist} printer={this.state.printer} timer={this.state.timer} transTimer={timer => this.transTimer(timer)} transPrinter={printer => this.transPrinter(printer)} ></Nav>
            </div>
        );
    }
}
PrintIndex.defaultProps = {
    print:{
        printCurrent:0,
        printList:{}
    }
};

export default PrintIndex;