import React, { Component } from 'react'
import { render } from 'react-dom'
import {
    Redirect,
    BrowserRouter as Router,
    Route
} from 'react-router-dom'
import Cookies from 'react-cookies';
import objectAssign from 'object-assign'
import 'whatwg-fetch'
import Nav from './Nav'
import Printer from './Printer'
import Loading from '../../util/component/Loading.js';
import Utils from '../../util/js/util.js';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import util from '../../util/js/util.js';
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
            sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
            printer: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')) : undefined,
            printerCurrent: (localStorage.getItem('printerCurrent') && localStorage.getItem('printerCurrent') != "undefined") ? localStorage.getItem('printerCurrent') : 0,
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
                login: false,
                printTask: false
            },
            printData: {
                'duplexMode': 0,
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 2,
                'printEndPage': 1,
                'copyCount': 1,
                'printDpi': 600,
                'paperSize': 'A4',
                'printColorMode': 'black',
                'printWhole': 1,
                'printStartPage': 1
            }
        };
    };

    componentWillUpdate(props, state) {}

    componentWillMount(){}
    
    componentDidMount() {
        Utils.goVisible();
        // 屏蔽触摸移动
        if(deli.ios == 'IOS'){
            document.getElementById('print-index').addEventListener("touchmove", (e) => {
                this.unableTouchMove(e)
            }, {
                passive: false
            })
        }
        const self = this
        if (self.state.sn != '') { Cookies.save('sn', self.state.sn, { path: '/' });}
        let signPrint;
        let appIdPrint;
        let timestampPrint = (new Date()).valueOf();
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
                    "icon": "https://static.delicloud.com/h5/web/cloudprint/images/icon/scan_code@3x.png?v=20181226"
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

                // 返回
                deli.common.navigation.goBack({}, function (data) {
                    if (Utils.timer.printListTimer) { Utils.stopGetPrinterInfo(Utils.timer.printListTimer) }
                }, function (resp) {});

                //获取手机基础信息
                deli.common.phone.getBaseInfo({}, function (data) {
                    if ((window.screen.availWidth * 3 == data.screenWidth) && ((window.screen.availHeight <= 640 && (window.screen.availHeight * 3 > data.screenHeight)) || (window.screen.availHeight <= 592 && window.screen.availHeight * 3 <= data.screenHeight))) {
                        Utils.previewSuitClass = "preview-box preview-box-suit"
                    }
                }, function (resp) {});
                
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
                    localStorage.removeItem('printCount');
                    localStorage.removeItem('printer')
                    localStorage.removeItem('printerChg')
                    localStorage.removeItem('printerCurrent')
                    localStorage.removeItem('printerList')
                    localStorage.removeItem('printTaskInfo')
                    localStorage.removeItem('printPreviewData')
                    localStorage.removeItem('printCountData')
                    localStorage.removeItem('chooseTaskInfo')
                    localStorage.removeItem('printData')
                    localStorage.removeItem('previewSetupData')
                }, function (resp) {});
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
                                            if (udata._d_from && udata._d_from == 'qrCode') {
                                                if (udata._d_qr && (udata._d_qr).indexOf('/ca/') >= 0) {
                                                    self.setState({ "redirect": { "login": true }, "user": { "task_code": udata._d_data } })
                                                }
                                            }else if (udata._d_from && udata._d_from == 'app_file') {
                                                let urlFileList = []
                                                //文件转换
                                                self.handleFileUpload(udata._d_data, function(json){
                                                    Utils.showLoading('loading', '文件转换中...')
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
                                                        let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: json.totalPage })
                                                        self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                                                            localStorage.removeItem('printPreviewData')
                                                            localStorage.setItem('printPreviewData', JSON.stringify(urlFileList))
                                                            localStorage.removeItem('printData')
                                                            localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                                                            Cookies.save('printPreviewType', 'file', { path: '/' });
                                                            Utils.goVisible();
                                                        });
                                                        // 处理文件转化未完成
                                                        if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                                                    } else {
                                                        if(json.status == 0){
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
                                                                let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                                                                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                                                                    localStorage.removeItem('printData')
                                                                    localStorage.removeItem('printPreviewData')
                                                                    localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                                                                    localStorage.setItem('printPreviewData', JSON.stringify(urlFileList))
                                                                    Cookies.save('printPreviewType', 'file', { path: '/' });
                                                                });
                                                                // 处理文件转化完成
                                                                if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                                                            })
                                                        }else{
                                                            Utils.goVisible();
                                                            deli.common.notification.toast({
                                                                "text": '文件无法识别，请重新选择',
                                                                "duration": 2
                                                            }, function (data) { }, function (resp) { });
                                                        }
                                                    }
                                                })
                                            } else if (udata._d_from && udata._d_from == 'outer_file'){
                                                let docFileList = []
                                                Utils.showLoading('loading', '文件正在上传...')
                                                //文件上传
                                                self.handleTmpFileUpload(decodeURIComponent(udata._d_data), docFileList)
                                            }
                                            if (udata._d_qr){
                                                const device_sn = self.getUrlQuery('device', udata._d_qr)
                                                if (device_sn && udata._d_from == 'qrCode') {
                                                    self.getPrinterData(device_sn, function () {
                                                        self.getNewListPage(undefined, function (printTaskInfo) {
                                                            self.scanQrcodePrint(device_sn, printTaskInfo)
                                                        });
                                                    })
                                                }
                                            }
                                        });
                                    }, function (uresp) {
                                        Utils.goVisible();
                                        deli.common.notification.prompt({
                                            "type": 'error',
                                            "text": '获取登录信息失败',
                                            "duration": 1.5
                                        }, function (data) { }, function (resp) { });
                                    });
                                }else{
                                    Utils.goVisible();
                                    deli.common.notification.prompt({
                                        "type": 'error',
                                        "text": '获取组织信息失败',
                                        "duration": 1.5
                                    }, function (data) {}, function (resp) {});
                                }
                            }, function (oresp) {});
                        }else{
                            Utils.goVisible();
                            deli.common.notification.prompt({
                                "type": 'error',
                                "text": '获取员工信息失败',
                                "duration": 1.5
                            }, function (data) {}, function (resp) {});
                        }
                    }, function (resp) {
                        Utils.goVisible();
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
                        Utils.goVisible();
                    } else {
                        //获取打印机列表并选择上次的打印机
                        self.getPrinterList({
                            'page': 1,
                            'limit': 10
                        }, function (sn) {
                            if(sn){self.getPrinterData(sn)}
                            Utils.goVisible();
                        });
                    }
                }
                localStorage.removeItem('printTaskInfo')
                localStorage.removeItem('printCount')
                localStorage.removeItem('printCountData')
                localStorage.removeItem('printerChg')
                localStorage.removeItem('printDataChg')
                localStorage.setItem('printCount', 1)
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
    }

    //监听Timer变化状态
    transTimer(timer){
        this.stopGetNewListPage(timer)
    }

    // 处理deli e+ 第三方url文件转PDF
    handleFileUpload(url, callback) {
        Utils.showLoading('loading', '文件转换中...')
        const self = this
        Utils.timeoutFetch(convertURL + '/file/uploadByUrl', {
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
        }, 60000, function () {
            Utils.hideLoading('loading')
            /* deli.common.notification.prompt({
                "type": "error",
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    Utils.hideLoading('loading')
                    deli.common.notification.prompt({
                        "type": "error",
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        if (json.data[0] && json.data[0].status != -1) {
                            if (typeof callback === 'function') {
                                callback(json.data[0])
                            }
                        } else {
                            Utils.hideLoading('loading')
                            setTimeout(() => {
                                deli.common.notification.prompt({
                                    "type": "error",
                                    "text": "文件转换失败",
                                    "duration": 2
                                }, function (data) { }, function (resp) { });
                            }, 500);
                        }
                    } else {
                        Utils.hideLoading('loading')
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 2
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            Utils.hideLoading('loading')
            deli.common.notification.prompt({
                "type": "error",
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    // 处理deli e+ 本地临时文件
    handleTmpFileUpload(tmpPath, docFileList) {
        const self = this
        deli.common.file.upload({
            url: convertURL + '/file/uploadByFile',
            file: tmpPath,
            isShowProgress: true
        }, function (json) {
            Utils.showLoading('loading', '文件转换中...')
            let jsonInner;
            let jsonIndex;
            if (json) {
                jsonIndex = (json.hasOwnProperty('index') ? json.index : undefined)
                jsonInner = (json.hasOwnProperty('index') ? json.data : json)
            }
            //单个文件处理
            if (jsonInner[0].status == 1) {
                Utils.hideLoading('loading')
                let file_name = tmpPath.substring(tmpPath.lastIndexOf("\.") + 1, tmpPath.length)
                docFileList.push({
                    'id': jsonInner[0].id,
                    'fileSuffix': jsonInner[0].fileType,
                    'fileName': jsonInner[0].fileName,
                    'totalPage': jsonInner[0].totalPage,
                    'printMd5': jsonInner[0].pdfMd5,
                    'printUrl': jsonInner[0].printUrl,
                    'fileSource': jsonInner[0].fileSource,
                    'printPDF': ((['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt']).indexOf(file_name.substring(file_name.lastIndexOf("\.") + 1, file_name.length)) >= 0) ? true : false
                })
                let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: jsonInner[0].totalPage })
                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                    localStorage.removeItem('printData')
                    localStorage.removeItem('printPreviewData')
                    localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                    localStorage.setItem('printPreviewData', JSON.stringify(docFileList))
                    Cookies.save('printPreviewType', 'file', { path: '/' });
                });
                // 处理文件转化完成
                if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
            } else if (jsonInner[0].status == 0){
                // 处理文件转化未完成
                self.startConvertPoll(jsonInner[0].id, function (trans) {
                    Utils.hideLoading('loading')
                    docFileList.push({
                        'id': trans.id,
                        'fileSuffix': trans.fileType,
                        'fileName': trans.fileName,
                        'totalPage': trans.totalPage,
                        'printMd5': trans.pdfMd5,
                        'printUrl': trans.printUrl,
                        'fileSource': trans.fileSource,
                        'printPDF': true
                    })
                    let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                    self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                        localStorage.removeItem('printData')
                        localStorage.removeItem('printPreviewData')
                        localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                        localStorage.setItem('printPreviewData', JSON.stringify(docFileList))
                        Cookies.save('printPreviewType', 'file', { path: '/' });
                    });
                    // 处理文件转化完成
                    if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                })
            }else{
                Utils.hideLoading('loading')
                deli.common.notification.toast({
                    "text": '文件无法识别，请重新选择',
                    "duration": 2
                }, function (data) { }, function (resp) { });
            }
        }, function (resp) {
            Utils.hideLoading('loading')
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    // 获取文件转换状态
    getConvertStatus(id, callback) {
        const self = this
        let statusData = new FormData();
        statusData.append('fileId', id);
        //文件转换情况
        Utils.timeoutFetch(convertURL + '/file/findByFileId', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: statusData
        }, 60000, function () {
            if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
            Utils.hideLoading('loading')
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                    return;
                }
                response.json().then(function (resp) {
                    if (resp.code == 0) {
                        if (resp.data.status == 1) {
                            if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                            if (typeof callback === 'function') {
                                callback(resp.data)
                            }
                        }
                        if (resp.data.status == -1) {
                            if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                            Utils.hideLoading('loading')
                            deli.common.notification.prompt({
                                "type": "error",
                                "text": '文件打印失败',
                                "duration": 2
                            }, function (data) { }, function (resp) { });
                        }
                    } else {
                        if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                        Utils.hideLoading('loading')
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": resp.msg,
                            "duration": 2
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
            Utils.hideLoading('loading')
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //开启文件转换状态
    startConvertPoll(id, callback) {
        const self = this
        const timer = setInterval(() => {
            self.getConvertStatus(id, callback);
        }, 2000);
        Utils.timer.convertTimer = timer
    }

    //关闭文件转换状态
    stopConvertPoll(timer) {
        clearInterval(timer)
        Utils.timer.getNewListTimer = 0
    }

    //获取URL参数
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
    
    //获取auth信息
    getLocalData(data, printSn, callback){
        var self = this
        //登录api
        Utils.timeoutFetch(mpURL + '/a/auth/login', {
            method: 'POST',
            headers: {
                user_id: data.user_id,
                org_id: data.org_id,
                token: data.token
            }
        }, 60000, function () {
            Utils.goVisible();
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    Utils.goVisible();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        self.setState({"user":{token: data.data }}, function(){
                            Cookies.save('userId', data.user_id, { path: '/' });
                            Cookies.save('orgId', data.org_id, { path: '/' });
                            Cookies.save('token', json.data.token, { path: '/' });
                            Cookies.save('admin', json.data.admin, { path: '/' });
                            self.startGetNewListPage()
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
                                }else{
                                    if (typeof callback === 'function'){
                                        callback();
                                    }
                                }
                                Utils.goVisible();
                            });
                        }
                    }else{
                        Utils.goVisible();
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        },function(data){},function(resp){});
                    }
                });
            }
        ).catch(function (err) {
            Utils.goVisible();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) {}, function (resp) {});
        });
    }

    //获取打印机列表
    getPrinterList(data, callback) {
        const self = this
        let formData = new FormData();
        formData.append('pageNo', data.page);
        formData.append('pageSize', data.limit);
        //打印机列表
        Utils.timeoutFetch(mpURL + '/app/printer/queryPage', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: formData
        }, 60000, function () {
            Utils.goVisible();
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    Utils.goVisible();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        // update 20180904
                        if (json.data.total > 0 && json.data.rows.length > 0){
                            let current = self.state.printerCurrent;
                            self.setState({ printer: json.data.rows[current]}, function () {
                                if(typeof callback === 'function'){
                                    callback(json.data.rows[current].printerSn);
                                }
                            });
                        } else if (json.data.rows.length == 0 && data.page == 1){
                            self.setState({ printer: {} }, function () {
                                if (typeof callback === 'function') {
                                    callback();
                                }
                            });
                        }
                    } else {
                        Utils.goVisible();
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 2
                        },function(data){},function(resp){});
                        self.setState({ printer: {} }, function () {
                            if (typeof callback === 'function') {
                                callback();
                            }
                        });
                    }
                });
            }
        ).catch(function (err) {
            Utils.goVisible();
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
        Utils.timeoutFetch(mpURL + '/app/printer/queryStatus/' + sn, {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }, 60000, function () {
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
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
                    if (resp1.code == 0) {
                            if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
                            localStorage.removeItem('printer')
                            localStorage.setItem('printer', (resp1.data.hasPermissions == true ? JSON.stringify(resp1.data) : undefined))
                            self.setState({ printer: resp1.data, inkbox: resp1.data.inkboxDetails }, function () {})
                            if (typeof callback === 'function') {
                                callback(resp1.data);
                            }
                            //开始打印机信息状态轮询
                            Utils.startGetPrinterInfo({
                                token: Cookies.load('token'),
                                sn: sn,
                                error: function () {
                                    if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
                                    deli.common.notification.toast({
                                        "text": '网络错误，请重试',
                                        "duration": 2
                                    }, function (data) { }, function (resp) { });
                                },
                                success: function (resp1) {
                                    if (resp1.code == 0) {
                                        if (resp1.data.printerSn == JSON.parse(localStorage.getItem('printer')).printerSn) {
                                            localStorage.removeItem('printer')
                                            localStorage.setItem('printer', JSON.stringify(resp1.data))
                                            self.setState({ printer: resp1.data, inkbox: resp1.data.inkboxDetails }, function () {
                                            })
                                        } else {
                                            if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
                                        }
                                    } else {
                                        if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
                                        deli.common.notification.prompt({
                                            "type": 'error',
                                            "text": resp1.msg,
                                            "duration": 1.5
                                        }, function (data) { }, function (resp) { });
                                    }
                                }
                            }, 'printer');
                    } else {
                        Utils.stopGetPrinterInfo(Utils.timer.printerTimer)
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
        Utils.timeoutFetch(mpURL + '/a/auth/config', {
            method: 'POST',
            headers: {},
            body: appData
        }, 60000, function () {
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
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
            "icon": "https://static.delicloud.com/h5/web/cloudprint/images/icon/scan_code" + ((data  && data.length > 0) ? '02' : '')+"@3x.png?v=20181226"
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
    getNewListPage(timer, callback) {
        const self = this
        let appData = new FormData();
        appData.append('pageNo', 1);
        appData.append('pageSize', 200);
        //分页查询打印机任务列表
        Utils.timeoutFetch(mpURL + '/v1/app/printTask/queryScanPrintTask/P_1_10', {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }, 60000, function () {
            if (timer) self.stopGetNewListPage(timer);
        }).then(
            function (response) {
                if (response.status !== 200) {
                    if (timer) self.stopGetNewListPage(timer);
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        if (json.data.total >= 0){
                            if (json.data.total >= 1 && typeof callback === 'function'){
                                callback(json.data.list)
                            }else{
                                self.setState({
                                    printTaskInfo: json.data.list
                                }, function () {
                                    self.setQrcodeStatus(json.data.list)
                                })
                            }
                        }else{
                            self.setQrcodeStatus()
                        }
                    }else{
                        if (timer) self.stopGetNewListPage(timer);
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    }
                });
            }
        ).catch(function (err) {
            if (timer) self.stopGetNewListPage(timer);
        });
    }

    // 开始获取新的任务状态及数据
    startGetNewListPage() {
        const self = this
        self.getNewListPage();
        const timer = setInterval(() => {
            self.getNewListPage(Utils.timer.getNewListTimer);
        }, 3000);
        Utils.timer.getNewListTimer = timer
    }

    // 关闭获取新的任务状态及数据
    stopGetNewListPage(timer){
        clearInterval(timer)
        Utils.timer.getNewListTimer = 0
    }
    
    // 处理扫码结果
    getScanQrcode(text, type, printTaskInfo){
        const self = this
        let appData = new FormData();
        appData.append('qrCode', text);
        //appData.append('printerType', type);
        //查询打印机状态
        Utils.timeoutFetch(mpURL + '/app/printerTask/scanQrCode', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: appData
        }, 60000, function () {
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
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
                        //扫码绑定打印机
                        self.getPrinterData(json.data.printerSn, function(){
                            self.scanQrcodePrint(text, printTaskInfo)
                        });
                    } else if(json.code == -1) {
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    } else if (json.code == -3) {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    } else if (json.code == -4) {
                        self.setState({ "redirect": { "scandenied": true } }, function () { })
                    } else if (json.code == -5){
                        self.setState({ "redirect": { "scanunbind": true } }, function () { })
                    }else{
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
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

    // 绑定打印机并打印
    scanQrcodePrint(sn, printTaskInfo){
        const self = this
        if (printTaskInfo) {
            //只有一条数据时进入打印预览，否则进入选择打印任务
            if (printTaskInfo.length > 1) {
                self.setState({
                    sn: sn,
                    printType: 'scan',
                    printTaskInfo: printTaskInfo,
                    fileType: 'file',
                    fileList: [],
                    redirect: {
                        chooseTask: true,
                        previewIndex: false
                    }
                })
            } else if (printTaskInfo.length == 1) {
                const singleFileList = printTaskInfo[0].fileList
                const singleFileType = (singleFileList.length == 1 && singleFileList[0].fileSuffix == 'other') ? 'other' : ((singleFileList.length > 1 || (singleFileList.length == 1 && singleFileList[0].fileSuffix != 'pdf')) ? 'image' : 'file')
                let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: (singleFileList.length > 1 ? singleFileList.length : singleFileList[0].totalPage) })
                localStorage.removeItem('printData')
                localStorage.removeItem('printTaskInfo')
                localStorage.removeItem('printPreviewData')
                localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                localStorage.setItem('printTaskInfo', JSON.stringify(printTaskInfo[0]))
                localStorage.setItem('printPreviewData', JSON.stringify(singleFileList))
                Cookies.save('printPreviewType', singleFileType, { path: '/' });
                if (printTaskInfo[0].printTaskType == 'virtual') {
                    self.handleVirPrintClick(printTaskInfo[0])
                } else {
                    self.setState({
                        sn: sn,
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
            }
        } else {
            self.setState({
                sn: sn,
                fileList: [],
                redirect: {
                    chooseTask: false,
                    previewIndex: false
                }
            })
        }
    }

    // 虚拟打印
    handleVirPrintClick(data) {
        const self = this;
        let printItems = {};
        const fileList = data.fileList;
        printItems = self.state.printData;
        printItems.taskSource = 'VIRTUAL';
        if (data.downloadUrl){
            printItems.downloadUrl = data.downloadUrl;
        }
        printItems.printerSn = self.state.printer.printerSn; 
        printItems.fileList = [];
        for (let i = 0; i < fileList.length; i++) {
            printItems.fileList.push({
                fileSource: fileList[i].fileSource,
                printMd5: fileList[i].printMd5,
                fileSuffix: fileList[i].fileSuffix,
                printPDF: fileList[i].printPDF,
                totalPage: fileList[i].totalPage,
                fileId: fileList[i].fileId,
                printUrl: fileList[i].printUrl,
                fileName: fileList[i].fileName
            })
        }
        //创建虚拟打印任务和任务设置打印机
        Utils.timeoutFetch(mpURL + '/v1/app/printTask/taskToPrinter/' + data.taskCode + '', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "MP_TOKEN": Cookies.load('token')
            },
            body: JSON.stringify(printItems)
        }, 60000, function () {
            deli.common.notification.toast({
                "text": "网络超时,请重试",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.toast({
                        "text": "网络错误,请重试",
                        "duration": 1.5
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        self.setState({ redirect:{ printTask: true } }, function () { })
                    } else {
                        deli.common.notification.toast({
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.toast({
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
        });
    }

    render(){
        //虚拟打印进入打印机任务列表
        if (this.state.redirect.printTask){
            const sn = this.state.printer.printerSn
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            const name = this.state.printer.printerName
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&status=" + status + "&name=" + name + "", state: { "sn": sn, "status": status, "name": name } }
            } />;
        }

        if (this.state.redirect.chooseTask) {
            const sn = this.state.printer.printerSn
            const name = this.state.printer.printerName
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
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
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
            const printTaskInfo = this.state.printTaskInfo
            const printType = this.state.printType
            const fileType = this.state.fileType
            localStorage.removeItem('printPreviewFrom');
            localStorage.setItem('printPreviewFrom', 'printindex');
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=" + printType + "&name=" + name + "", state: { "sn": sn, "fileType": fileType, "fileList": fileList, "printTaskInfo": printTaskInfo, "status": status } }
            } />;
        }
        
        if (this.state.redirect.fileNav) {
            const sn = this.state.printer.printerSn
            const name = this.state.printer.printerName
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            const fileList = this.state.fileList
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
            const fileType = this.state.fileType
            localStorage.removeItem('printPreviewFrom');
            localStorage.setItem('printPreviewFrom', 'printindex');
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "status": status } }
            } />;
        }

        if (this.state.redirect.scandenied) {
            const sn = this.state.printer.printerSn
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
            return <Redirect push to={
                { pathname: "/scandenied", search: "?sn=" + sn + "&status=" + status +"", state: { "sn": sn, "fileList": fileList, "status": status}  }
            } />;
        }

        if (this.state.redirect.scanunbind) {
            const sn = this.state.printer.printerSn
            const fileList = this.state.fileList
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
            return <Redirect push to={
                { pathname: "/scanunbind", search: "?sn=" + sn + "", state: { "sn": sn, "fileList": fileList } }
            } />;
        }

        if (this.state.redirect.login) {
            this.stopGetNewListPage(Utils.timer.getNewListTimer)
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
                {(Utils.loadinger.printLoading == true) ? <Loading pageLoading={true} pageLoadingText={ Utils.loadinger.printLoadingText }></Loading> : ''}
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