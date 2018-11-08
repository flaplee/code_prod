import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies'
import pictureimg from '../../images/picture@3x.png'
import fileimg from '../../images/file@3x.png'
import taskimg from '../../images/Print_task@3x.png'
import manage01 from '../../images/management01@3x.png'
import manage02 from '../../images/Printer_management02@3x.png'
import { Layer } from 'saltui';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printer: {},
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
            timer:''
        }
        console.log("props", props)
    }

    componentWillReceiveProps(transProps) {
        console.log("transProps", transProps)
        if (transProps.printer) {
            this.setState({
                printer: transProps.printer,
                timer: transProps.timer,
                transTimer: transProps.transTimer
            }, function () {});
        }
    }

    componentWillUpdate(transProps, transState) {
        console.log("componentWillUpdate", transProps)
        console.log("transState", transState)
    }

    componentWillMount(props, state) {
        console.log("props", props)
        console.log("state", state)
    }

    componentDidMount(){
        // 允许触摸移动
        document.getElementById('content-nav').addEventListener("touchmove", (e) => {
            this.ableTouchMove(e)
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
        fetch(convertURL + '/file/uploadByUrl', {
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
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        if(json.data[0] && json.data[0].status != -1){
                            if (typeof callback === 'function') {
                                callback(json.data[0])
                            }
                        }else{
                            deli.common.notification.hidePreloader();
                            deli.common.notification.prompt({
                                "type": "error",
                                "text": "文件无法解析,请重试",
                                "duration": 2
                            }, function (data) {}, function (resp) {});
                        }
                    }else{
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 2
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
            console.log("错误:" + err);
        });
    }

    // 获取文件转换状态
    getConvertStatus(id, callback){
        const self = this
        let statusData = new FormData();
        statusData.append('fileId', id);
        //文件转换情况
        fetch(convertURL + '/file/findByFileId', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: statusData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (resp) {
                    if (resp.code == 0 && resp.data) {
                        if (resp.data.status != 0){
                            self.stopConvertPoll(self.state.timer)
                            if(resp.data.status == 1){
                                if (typeof callback === 'function') {
                                    callback(resp.data)
                                }
                            }
                            if (resp.data.status == -1) {
                                deli.common.notification.hidePreloader();
                                deli.common.notification.prompt({
                                    "type": "error",
                                    "text": '文件上传失败,请重试',
                                    "duration": 2
                                }, function (data) {}, function (resp) {});
                            }
                        }
                    }else{
                        deli.common.notification.hidePreloader();
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": resp.msg,
                            "duration": 2
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
            console.log("错误:" + err);
        });
    }

    //开启文件转换状态
    startConvertPoll(id, callback){
        const self = this
        const timer = setInterval(() => {
            self.getConvertStatus(id, callback);
        }, 2000);
        self.setState({ timer: timer})
    }

    //关闭文件转换状态
    stopConvertPoll(timer){
        clearInterval(timer)
    }

    //首页NAV
    handleOnClick(type, status) {
        const self = this
        switch (type) {
            case 'upload':
                //this.setState({ redirect: { imgNav: true } });
                break;
            case 'imgNav':
                const imgFileList = []
                deli.common.image.choose({
                    types: ["photo"],
                    multiple: true,
                    max: 9
                }, function (data) {
                    if(data.length > 0){
                        let innerIndex = 0;
                        let innerLength = data.length;
                        deli.common.notification.showPreloader();
                        for (let imgFileNum = 0; imgFileNum < data.length; imgFileNum++){
                            deli.common.file.upload({
                                url: convertURL + '/file/uploadByFile',
                                file: data[imgFileNum].file_path
                            }, function (json) {
                                if (json && json instanceof Array && json.length > 0){
                                    innerIndex++;
                                    for (let i = 0; i < json.length; i++) {
                                        (function (i) {
                                            self.loadPreviewImg(json[i], 'image', function (inner) {
                                                imgFileList.push({
                                                    'id': json[i].id,
                                                    'fileSuffix': json[i].fileType,
                                                    'printMd5': json[i].fileMd5,
                                                    'fileName': json[i].fileName,
                                                    'totalPage': json[i].totalPage,
                                                    'previewUrl': inner,
                                                    'printUrl': json[i].printUrl,
                                                    'fileSource': json[i].fileSource,
                                                    'printPDF': false
                                                })
                                                let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json[i].totalPage })
                                                if (innerIndex == data.length) {
                                                    self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                        localStorage.removeItem('printPreviewData')
                                                        localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                        Cookies.save('printPreviewType', 'image', { path: '/' });
                                                        Cookies.save('printData', tmpPrintData, { path: '/' });
                                                        deli.common.notification.hidePreloader();
                                                        if (data.length != innerLength){
                                                            deli.common.notification.toast({
                                                                "text": (data.length - innerLength) + "张图片上传失败",
                                                                "duration": 3
                                                            }, function (data) {}, function (resp) {});
                                                        }
                                                    });
                                                } else {
                                                    self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                                        localStorage.removeItem('printPreviewData')
                                                        localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                        Cookies.save('printPreviewType', 'image', { path: '/' });
                                                        Cookies.save('printData', tmpPrintData, { path: '/' });
                                                    })
                                                }
                                            })
                                        })(i);
                                    }
                                }else{
                                    innerIndex++;
                                    let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: 1 })
                                    if (innerIndex == data.length) {
                                        if (data.length != 1){
                                            self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                localStorage.removeItem('printPreviewData')
                                                localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                                Cookies.save('printPreviewType', 'image', { path: '/' });
                                                Cookies.save('printData', tmpPrintData, { path: '/' });
                                                deli.common.notification.hidePreloader();
                                                if (data.length != innerLength) {
                                                    deli.common.notification.toast({
                                                        "text": (data.length - innerLength) + "张图片上传失败",
                                                        "duration": 3
                                                    }, function (data) { }, function (resp) { });
                                                }
                                            });
                                        }else{
                                            deli.common.notification.toast({
                                                "text": "1张图片上传失败",
                                                "duration": 3
                                            }, function (data) { }, function (resp) { });
                                        }
                                    } else {
                                        self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                            localStorage.removeItem('printPreviewData')
                                            localStorage.setItem('printPreviewData', JSON.stringify(imgFileList))
                                            Cookies.save('printPreviewType', 'image', { path: '/' });
                                        })
                                    }
                                    innerLength--;
                                }
                            }, function (resp) {
                                deli.common.notification.hidePreloader();
                                deli.common.notification.toast({
                                    "text": '网络错误，请重试',
                                    "duration": 2
                                }, function (data) {}, function (resp) {});
                            });
                        }
                    }
                }, function (resp) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) {}, function (resp) {});
                });
                break;
            case 'fileNav':
                self.setState({ layerView: true});
                break;
            case 'taskNav':
                this.setState({ redirect: { taskNav: true }});
                break;
            case 'manageNav':
                if (status){
                    this.setState({ redirect: { manageNav: true } });
                }
                break;
            default:
                break;
        }
    }

    //打印菜单
    handleLayerClick(value, task) {
        const self = this
        console.log("value", value);
        console.log("task", task);
        switch (value) {
            case 1:
                let docFileList = []
                self.setState({ layerView: false });
                deli.common.file.choose({
                    types: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf', 'jpg', 'jpeg', 'bmg', 'png', 'pic', 'tif', 'gif', 'wmf', 'ico'],
                    max_size: 52428800
                }, function(data) {
                    if(data.length > 0){
                        deli.common.notification.showPreloader();
                        for (let docFileNum = 0; docFileNum < data.length; docFileNum++) {
                            self.handleFileUpload(data, docFileList, docFileNum)
                        }
                    }else{
                        deli.common.notification.hidePreloader();
                    }
                }, function (resp) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                });
                break;
            case 2:
                self.setState({ layerView: false });
                deli.app.disk.choose({
                    types: ['png', 'jpg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']
                }, function (data) {
                    if (data) {
                        deli.common.notification.showPreloader();
                        self.handleDiskUpload(data)
                    }
                }, function (resp) {})
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
            file: data[docFileNum].file_path
        }, function (json) {
            //单个文件处理
            if (json[0].status == 1) {
                let file_name = data[docFileNum].file_name
                docFileList.push({
                    'id': json[0].id,
                    'fileSuffix': json[0].fileType,
                    'fileName': json[0].fileName,
                    'totalPage': json[0].totalPage,
                    'printMd5': json[0].pdfMd5,
                    'printUrl': json[0].printUrl,
                    'fileSource': json[0].fileSource,
                    'printPDF': (file_name.substring(file_name.lastIndexOf("\.") + 1, file_name.length) in ['jpg', 'jpeg', 'bmg', 'png', 'pic', 'tif', 'gif', 'wmf', 'ico']) ? true : false
                })
                let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json[0].totalPage })
                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                    localStorage.removeItem('printPreviewData')
                    localStorage.setItem('printPreviewData', JSON.stringify(docFileList))
                    Cookies.save('printPreviewType', 'file', { path: '/' });
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                    deli.common.notification.hidePreloader();
                });
                // 处理文件转化完成
                if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
            } else {
                // 处理文件转化未完成
                self.startConvertPoll(json[0].id, function(trans){
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
                    
                    let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                    self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                        localStorage.removeItem('printPreviewData')
                        localStorage.setItem('printPreviewData', JSON.stringify(docFileList))
                        Cookies.save('printPreviewType', 'file', { path: '/' });
                        Cookies.save('printData', tmpPrintData, { path: '/' });
                        deli.common.notification.hidePreloader();
                    });
                    // 处理文件转化完成
                    if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
                })
            }
        }, function (resp) {
            deli.common.notification.hidePreloader();
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
            }else{
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

    // 显示菜单
    renderlayerItems(viewData, taskData) {
        const pages = this.state.menuList;
        const result = [];
        console.log("viewData", viewData);
        console.log("taskData", taskData);
        console.log("pages", pages);
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            console.log("valueItem", valueItem)
            console.log("textItem", textItem)
            result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, valueItem, taskData)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        const sn = this.state.printer.printerSn
        const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
        const fileList = this.state.fileList
        const fileOuter = this.state.fileOuter
        const fileType = this.state.fileType
        if (this.state.redirect.imgNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "status": status }  }
            } />;
        }
        if (this.state.redirect.fileNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=upload", state: { "sn": sn, "fileList": fileList, "fileType": fileType, 'printType': 'upload', "fileOuter": fileOuter, "status": status   }  }
            } />;
        }
        if (this.state.redirect.taskNav) {
            this.state.transTimer(this.state.timer);
            return <Redirect push to={
                { pathname: "/printtask", search: "?sn=" + sn + "&status=" + status +"", state: { "sn": sn, "status": status }  }
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
                <Layer bottom="0" visible={this.state.layerView} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.taskItemData)}
                </Layer>
            </div>
        );
    }
}

export default Nav;