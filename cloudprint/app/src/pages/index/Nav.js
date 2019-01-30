import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies'
import objectAssign from 'object-assign'
import pictureimg from '../../images/picture@3x.png'
import fileimg from '../../images/file@3x.png'
import taskimg from '../../images/Print_task@3x.png'
import manage01 from '../../images/management01@3x.png'
import manage02 from '../../images/Printer_management02@3x.png'
import { Layer } from 'saltui';
import Utils from '../../util/js/util.js';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printer: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')) : {},
            navlist: {},
            redirect:{
                imgNav: false,
                fileNav: false,
                taskNav: false,
                manageNav: false
            },
            file:{
                width: 0,
                height: 0
            },
            previewData:{
                previewList: [],
                previewCount: 0
            },
            printImgList:[],
            taskItemData: {},
            layerView: false,
            layerViewData: [],
            menuList: [{
                value: 1,
                text: '本地文件'
            }, {
                value: 2,
                text: '网盘文件'
            }, {
                value: 3,
                text: '取消'
            }],
            fileNum : 0,
            fileList : [],
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
        }
    }

    componentWillReceiveProps(transProps) {
        if (transProps.printer) {
            this.setState({
                printer: transProps.printer,
                transTimer: transProps.transTimer
            }, function () {});
        }
    }

    componentWillUpdate(transProps, transState) {
    }

    componentWillMount(props, state) {
    }

    componentDidMount(){
        // 允许触摸移动
        document.getElementById('content-nav').addEventListener("touchmove", (e) => {
            this.ableTouchMove(e)
        })
        // layerView
        document.body.addEventListener("click", (e) => {
            this.setState({ layerView: false });
        })
    }

    ableTouchMove(e){
        e.stopPropagation();
    }

    //下载图片获取图片宽高
    getPreviewImg(url){
        //获取图片数据
        const tmp = new Image();
        tmp.onload = function () {}
        tmp.onerror = function () { }
        tmp.src = url;
        let type = (tmp.width > tmp.height) ? 1 : ((tmp.width < tmp.height) ?  2: 0)
        let sapce = (tmp.width > tmp.height) ? tmp.height : tmp.width
        return [type, sapce]
    }
    
    // 文件转换,下载预览图片
    loadPreviewFile(data, type, callback){
        const self = this
        if(typeof callback === 'function'){
            callback(convertURL + '/file/preview/' + data.id + '_' + data.totalPage + '_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + '', {
                "fileId": data.id,
                "fileType": data.fileType,
                "checkedPage": data.totalPage,
                "pageCount": data.totalPage
            });
        }
    }

    // 图片转换,下载预览图片
    loadPreviewImg(data, type, callback) {
        const self = this
        if (typeof callback === 'function') {
            callback(convertURL + '/file/preview/' + data.id + '_' + data.totalPage + '_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + '', {
                "fileId": data.id,
                "fileType": data.fileType,
                "checkedPage": data.totalPage,
                "pageCount": data.totalPage
            });
        }
    }

    // url转换，下载预览图片
    loadPreviewUrl(data, type, callback){
        const self = this
        //上传文件 第三方url转PDF
        Utils.timeoutFetch(convertURL + '/file/uploadByUrl', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "MP_TOKEN": Cookies.load('token'),
            },
            body: JSON.stringify({
                "converterUrlVos": [{
                    "fileUrl": data.file_url,
                    "fileName": data.file_name,
                    "fileType": data.file_name.substring(data.file_name.lastIndexOf("\.") + 1, data.file_name.length),
                    "fileSource": "disk"
                }]
            })
        }, 60000, function () {
            Utils.hideLoading('loading')
            /* deli.common.notification.toast({
                "text": '网络超时，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { }); */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    Utils.hideLoading('loading')
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        if(json.data[0] && json.data[0].status != -1){
                            if (typeof callback === 'function') {
                                callback(json.data[0])
                            }
                        }else{
                            Utils.hideLoading('loading')
                            setTimeout(() => {
                                deli.common.notification.prompt({
                                    "type": "error",
                                    "text": "文件转换失败",
                                    "duration": 2
                                }, function (data) { }, function (resp) { });
                            }, 500);
                        }
                    }else{
                        Utils.hideLoading('loading')
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 2
                        },function(data){},function(resp){});
                    }
                });
            }
        ).catch(function (err) {
            Utils.hideLoading('loading')
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    // 获取文件转换状态
    getConvertStatus(id, callback){
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
                    Utils.hideLoading('loading')
                    if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                    return;
                }
                response.json().then(function (resp) {
                    if (resp.code == 0) {
                        if(resp.data.status == 1){
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
                            }, function (data) {}, function (resp) {});
                        }
                    }else{
                        if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
                        Utils.hideLoading('loading')
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": resp.msg,
                            "duration": 2
                        },function(data){},function(resp){});
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
    startConvertPoll(id, callback){
        const self = this
        const timer = setInterval(() => {
            self.getConvertStatus(id, callback);
        }, 2000);
        Utils.timer.convertTimer = timer
    }

    //关闭文件转换状态
    stopConvertPoll(timer){
        clearInterval(timer)
        Utils.timer.convertTimer = 0
    }

    //首页NAV
    handleOnClick(type, status) {
        const self = this
        switch (type) {
            case 'upload':
                //this.setState({ redirect: { imgNav: true } });
                break;
            case 'imgNav':
                self.setState({ layerView: false });
                deli.common.image.choose({
                    types: ["photo"],
                    multiple: true,
                    max: 9
                }, function (data) {
                    if (data.length > 0) {
                        let innerIndex = 0;
                        let innerLength = data.length;
                        let imgFileList = new Array(innerLength)
                        let imgFileListComp = []
                        let reference = []
                        for (let imgFileNum = 0; imgFileNum < data.length; imgFileNum++) {
                            reference.push(data[imgFileNum].file_path)
                        }
                        // 重置弹出框进度条
                        Utils.setPopupProgress(0, 0, true)
                        // 初始化弹出框
                        Utils.bindPopup('popups', undefined, function () {
                            deli.common.file.abort({}, function (data) {}, function (resp) {})
                        })
                        // 打开弹出框
                        Utils.showPopup('popups')
                        for (let imgFileNum = 0; imgFileNum < data.length; imgFileNum++) {
                            setTimeout(() => {
                                deli.common.file.upload({
                                    url: convertURL + '/file/uploadByFile',
                                    file: decodeURIComponent(data[imgFileNum].file_path),
                                    isShowProgress: false
                                }, function (json) {
                                    let jsonInner;
                                    let jsonIndex;
                                    if (json && (json.hasOwnProperty('index') || (json instanceof Array && json.length > 0))){
                                        if (json.hasOwnProperty('index')) {
                                            jsonIndex = json.index
                                            jsonInner = json.data
                                            imgFileList = imgFileList
                                        } else {
                                            jsonIndex = undefined
                                            jsonInner = json
                                            imgFileList = imgFileListComp
                                        }
                                        ++innerIndex;
                                        for (let i = 0; i < jsonInner.length; i++) {
                                            (function (i) {
                                                self.loadPreviewImg(jsonInner[i], 'image', function (inner) {
                                                    if (jsonInner[i].status != -1){
                                                        let dataPushList = {
                                                            'id': jsonInner[i].id,
                                                            'fileSuffix': jsonInner[i].fileType,
                                                            'printMd5': jsonInner[i].fileMd5,
                                                            'fileName': jsonInner[i].fileName,
                                                            'totalPage': jsonInner[i].totalPage,
                                                            'previewUrl': inner,
                                                            'printUrl': jsonInner[i].printUrl,
                                                            'fileSource': jsonInner[i].fileSource,
                                                            'printPDF': false
                                                        }
                                                        if (json.hasOwnProperty('index')){
                                                            imgFileList[reference.indexOf(jsonIndex)] = dataPushList
                                                        }else{
                                                            imgFileList.push(dataPushList)
                                                        }
                                                        setTimeout(() => {
                                                            // 更新弹出框进度条
                                                            Utils.setPopupProgress(innerIndex, data.length)
                                                        }, 300);
                                                        let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: jsonInner[i].totalPage })
                                                        if (innerIndex == data.length) {
                                                            Utils.hideLoading('loading')
                                                            // 关闭进度条
                                                            Utils.closePopup('popups')
                                                            if ((innerLength + innerIndex) == data.length && innerLength <= 0) {
                                                                deli.common.notification.toast({
                                                                    "text": (data.length - innerLength) + "张图片上传失败",
                                                                    "duration": 3
                                                                }, function (data) {}, function (resp) {});
                                                            } else {
                                                                self.setState({ redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                                    localStorage.removeItem('printData')
                                                                    localStorage.removeItem('printPreviewData')
                                                                    localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                                                                    localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                                    Cookies.save('printPreviewType', 'image', { path: '/' });
                                                                    if (data.length > innerLength) {
                                                                        deli.common.notification.toast({
                                                                            "text": (data.length - innerLength) + "张图片上传失败",
                                                                            "duration": 3
                                                                        }, function (data) { }, function (resp) { });
                                                                    }
                                                                });
                                                            }
                                                        } else {
                                                            self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                                                localStorage.removeItem('printData')
                                                                localStorage.removeItem('printPreviewData')
                                                                localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                                                                localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                                Cookies.save('printPreviewType', 'image', { path: '/' });
                                                            })
                                                        }
                                                    }else{
                                                        if (json.hasOwnProperty('index')) {
                                                            imgFileList.splice(reference.indexOf(jsonIndex), imgFileList.length);
                                                        }
                                                    }
                                                })
                                            })(i);
                                        }
                                    }else{
                                        ++innerIndex;
                                        --innerLength;
                                        let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: 1 })
                                        if (innerIndex == data.length) {
                                            Utils.hideLoading('loading')
                                            // 关闭进度条
                                            Utils.closePopup('popups')
                                            if ((innerLength + innerIndex) == data.length && innerLength <= 0) {
                                                deli.common.notification.toast({
                                                    "text": (data.length - innerLength) + "张图片上传失败",
                                                    "duration": 3
                                                }, function (data) {}, function (resp) {});
                                            } else {
                                                self.setState({ redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                    localStorage.removeItem('printData')
                                                    localStorage.removeItem('printPreviewData')
                                                    localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                                                    localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                    Cookies.save('printPreviewType', 'image', { path: '/' });
                                                    if (data.length > innerLength) {
                                                        deli.common.notification.toast({
                                                            "text": (data.length - innerLength) + "张图片上传失败",
                                                            "duration": 3
                                                        }, function (data) { }, function (resp) { });
                                                    }
                                                });
                                            }
                                        } else {
                                            self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                                localStorage.removeItem('printPreviewData')
                                                localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                Cookies.save('printPreviewType', 'image', { path: '/' });
                                            })
                                        }
                                    }
                                }, function (resp) {
                                    Utils.hideLoading('loading')
                                    // 关闭进度条
                                    Utils.closePopup('popups')
                                    deli.common.notification.toast({
                                        "text": '网络错误，请重试',
                                        "duration": 2
                                    }, function (data) {}, function (resp) {});
                                });
                            }, 200);
                        }
                    }
                }, function (resp) {
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                });
                break;
            case 'fileNav':
                self.setState({ layerView: true });
                break;
            case 'taskNav':
                this.setState({ layerView: false, redirect: { taskNav: true } });
                break;
            case 'manageNav':
                if (status) {
                    this.setState({ layerView: false, redirect: { manageNav: true } });
                }
                break;
            default:
                break;
        }
    }

    //打印菜单
    handleLayerClick(value, task) {
        const self = this
        switch (value) {
            case 1:
                let docFileList = []
                self.setState({ layerView: false });
                deli.common.file.choose({
                    types: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'bmp', 'png', 'gif'],
                    max_size: 52428800
                }, function(data) {
                    if(data.length > 0){
                        //Utils.showLoading('loading', '文件正在上传...')
                        for (let docFileNum = 0; docFileNum < data.length; docFileNum++) {
                            if ((['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'bmp', 'png', 'gif']).indexOf(data[docFileNum].file_path.substring(data[docFileNum].file_path.lastIndexOf('.') + 1, data[docFileNum].file_path.length)) >= 0) {
                                self.handleFileUpload(data, docFileList, docFileNum)
                            }else{
                                Utils.hideLoading('loading')
                                deli.common.notification.toast({
                                    "text": '文件无法识别，请重新选择',
                                    "duration": 2
                                }, function (data) {}, function (resp) {});
                            }
                        }
                    }else{
                        Utils.hideLoading('loading')
                    }
                }, function (resp) {
                    Utils.hideLoading('loading')
                });
                break;
            case 2:
                self.setState({ layerView: false });
                deli.app.disk.choose({
                    types: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'bmp', 'png', 'gif']
                }, function (data) {
                    if (data.length > 0) {
                        //Utils.showLoading('loading', '文件正在上传...')
                        self.handleDiskUpload(data)
                    }else{
                        Utils.hideLoading('loading')
                    }
                }, function (resp) {
                    Utils.hideLoading('loading')
                })
                break;
            case 3:
                self.setState({ layerView: false });
                break;
            default:
                self.setState({ layerView: false });
                break;
        }
    }

    // 处理deli e+文件转化
    handleFileUpload(data, docFileList, docFileNum){
        const self = this
        deli.common.file.upload({
            url: convertURL + '/file/uploadByFile',
            file: decodeURIComponent(data[docFileNum].file_path),
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
                let file_name = data[docFileNum].file_name
                docFileList.push({
                    'id': jsonInner[0].id,
                    'fileSuffix': jsonInner[0].fileType,
                    'fileName': file_name,//jsonInner[0].fileName
                    'totalPage': jsonInner[0].totalPage,
                    'printMd5': jsonInner[0].pdfMd5,
                    'printUrl': jsonInner[0].printUrl,
                    'fileSource': jsonInner[0].fileSource,
                    'printPDF': ((['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt']).indexOf(file_name.substring(file_name.lastIndexOf("\.") + 1, file_name.length)) >= 0 ) ? true : false
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
                    })
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

    // 处理deli disk文件转化
    handleDiskUpload(data) {
        const self = this
        let urlFileNum = 0
        let urlFileList = []
        self.loadPreviewUrl(data[0], 'url', function (json) {
            Utils.showLoading('loading', '文件转换中...')
            //单个文件处理
            if (json.status == 1) {
                urlFileList.push({
                    'id': json.id,
                    'fileSuffix': json.fileType,
                    'fileName': data[0].file_name,
                    'totalPage': json.totalPage,
                    'printMd5': json.pdfMd5,
                    'printUrl': json.printUrl,
                    'fileSource': json.fileSource,
                    'printPDF': true
                })
                let tmpPrintData = objectAssign({}, self.state.printData, { printStartPage: 1, printEndPage: json.totalPage })
                Utils.hideLoading('loading')
                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                    localStorage.removeItem('printData')
                    localStorage.removeItem('printPreviewData')
                    localStorage.setItem('printData', JSON.stringify(tmpPrintData))
                    localStorage.setItem('printPreviewData', JSON.stringify(urlFileList))
                    Cookies.save('printPreviewType', 'file', { path: '/' });
                });
                // 处理文件转化未完成
                if (Utils.timer.convertTimer) { self.stopConvertPoll(Utils.timer.convertTimer) }
            }else if(json.status == 0){
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
                    Utils.hideLoading('loading')
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
                Utils.hideLoading('loading')
                deli.common.notification.toast({
                    "text": '文件无法识别，请重新选择',
                    "duration": 2
                }, function (data) { }, function (resp) { });
            }
        })
    }

    // layerView
    handlePropClick(e){
        e.stopPropagation();
        this.setState({ layerView: false });
    }

    // 显示菜单
    renderlayerItems(viewData, taskData) {
        const pages = this.state.menuList;
        const result = [];
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, valueItem, taskData)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        const sn = this.state.printer.printerSn
        const neme = this.state.printer.printerName
        const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
        const fileList = this.state.fileList
        const fileOuter = this.state.fileOuter
        const fileType = this.state.fileType
        if (this.state.redirect.imgNav) {
            localStorage.removeItem('printPreviewFrom');
            localStorage.setItem('printPreviewFrom', 'printindex');
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "status": status } }
            } />;
        }
        if (this.state.redirect.fileNav) {
            localStorage.removeItem('printPreviewFrom');
            localStorage.setItem('printPreviewFrom', 'printindex');
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "fileOuter": fileOuter, "status": status } }
            } />;
        }
        if (this.state.redirect.taskNav) {
            this.state.transTimer(Utils.timer.convertTimer);
            return <Redirect push to={
                { pathname: "/printtask", search: "?sn=" + sn + "&status=" + status + "", state: { "sn": sn, "status": status } }
            } />;
        }
        if (this.state.redirect.manageNav) {
            return <Redirect push to={
                { pathname: "/printmanage", search: "?sn=" + sn + "&status=" + status + "", state: { "sn": sn, "status": status } }
            } />;
        }
        return (
            <div className="content-nav" id="content-nav" onTouchMove={this.ableTouchMove.bind(this)}>
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'imgNav')}  href="javascript:;">
                        <div className="item-img"><img src={pictureimg} /></div>
                        <div className="item-title">选择图片打印</div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'fileNav')} href="javascript:;">
                        <div className="item-img"><img src={fileimg} /></div>
                        <div className="item-title">选择文件打印</div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'taskNav')}  href="javascript:;">
                        <div className="item-img"><img src={taskimg} /></div>
                        <div className="item-title">打印任务</div>
                    </a>
                </div>
                <div className="nav-item nav-item-manage">
                    <a className={this.state.printer.workStatus ? 'item' : 'item item-unable'} onClick={this.handleOnClick.bind(this, 'manageNav', this.state.printer.workStatus ? true : false)} href="javascript:;">
                        <div className="item-img"><img src={this.state.printer.workStatus ? manage02 : manage01} /></div>
                        <div className="item-title">打印机管理</div>
                    </a>
                </div>
                <Layer className="layer-blank" bottom="0" zIndex={888} visible={this.state.layerView} onClick={this.handlePropClick.bind(this)} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.taskItemData)}
                </Layer>
            </div>
        );
    }
}

export default Nav;