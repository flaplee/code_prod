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
                'fileSource': 'CLOUD',
                'duplexMode': 1,
                'fileSourceUrl': '',
                'fileSuffix': '',
                'fileSourceName': '',
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 1,
                'printEndPage': 1,
                'pagesPre': 1,
                'copyCount': 1,
                'printDpi': 600,
                'printPageSize': 'A4',
                'printColorMode': 'black',
                'isPrintWhole': 0,
                'printStartPage': 1
            },
        }
        console.log("props", props)
    }

    componentWillReceiveProps(transProps) {
        console.log("transProps", transProps)
        if (transProps.printer) {
            this.setState({
                printer: transProps.printer,
            }, function () {
                
            });
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
        let previewData = new FormData();
        //previewData.append();
        //上传文件 第三方url转PDF
        fetch(convertURL + '/file/uploadByUrl', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "token": Cookies.load('token'),
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
            deli.common.notification.prompt({
                "type": "error",
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) {}, function (resp) {});
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
                token: Cookies.load('token')
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
            deli.common.notification.prompt({
                "type": "error",
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
                        deli.common.notification.showPreloader();
                        for (let imgFileNum = 0; imgFileNum < data.length; imgFileNum++){
                            deli.common.file.upload({
                                url: convertURL + '/file/uploadByFile',
                                file: data[imgFileNum].file_path
                            }, function (json) {
                                if(json){
                                    innerIndex++;
                                    for (let i = 0; i < json.length; i++) {
                                        (function (i) {
                                            self.loadPreviewImg(json[i], 'image', function (inner) {
                                                imgFileList.push({
                                                    'fileSuffix': json[i].fileType,
                                                    'pdfMd5': json[i].pdfMd5,
                                                    'fileSourceName': json[i].fileName,
                                                    'totalPage': json[i].totalPage,
                                                    'previewUrl': inner,
                                                    'fileSourceUrl': json[i].printUrl
                                                })
                                                let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json[i].totalPage })
                                                if (innerIndex == data.length) {
                                                    self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                        Cookies.save('printPreviewData', imgFileList, { path: '/' });
                                                        Cookies.save('printData', tmpPrintData, { path: '/' });
                                                        deli.common.notification.hidePreloader();
                                                    });
                                                } else {
                                                    self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                                        Cookies.save('printPreviewData', imgFileList, { path: '/' });
                                                        Cookies.save('printData', tmpPrintData, { path: '/' });
                                                        deli.common.notification.hidePreloader();
                                                    })
                                                }
                                            })
                                        })(i);
                                    }
                                }
                            }, function (resp) {
                                deli.common.notification.hidePreloader();
                                deli.common.notification.prompt({
                                    "type": "error",
                                    "text": '网络错误，请重试',
                                    "duration": 2
                                }, function (data) {}, function (resp) {});
                            });
                        }
                    }
                }, function (resp) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.prompt({
                        "type": "error",
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
                    types: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'],
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
                    deli.common.notification.prompt({
                        "type": "error",
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
                //for (let i = 1; i <= json[0].totalPage; i++) {}
                docFileList.push({
                    'fileSuffix': json[0].fileType,
                    'fileSourceName': json[0].fileName,
                    'totalPage': json[0].totalPage,
                    'pdfMd5': json[0].pdfMd5,
                    'fileSourceUrl': json[0].printUrl
                    //'previewUrl': (convertURL + '/file/preview/' + json[0].id + '_1_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + '')
                })
                let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json[0].totalPage })
                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                    Cookies.save('printPreviewData', docFileList, { path: '/' });
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                    deli.common.notification.hidePreloader();
                });
                // 处理文件转化完成
                if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
            } else {
                // 处理文件转化未完成
                self.startConvertPoll(json[0].id, function(trans){
                    //for (let i = 1; i <= trans.totalPage; i++) {}
                    docFileList.push({
                        'fileSuffix': trans.fileType,
                        'fileSourceName': trans.fileName,
                        'totalPage': trans.totalPage,
                        'pdfMd5': trans.pdfMd5,
                        'fileSourceUrl': trans.printUrl
                        //'previewUrl': (convertURL + '/file/preview/' + trans.id + '_1_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + '')
                    })
                    
                    let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                    self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList }, function () {
                        Cookies.save('printPreviewData', docFileList, { path: '/' });
                        Cookies.save('printData', tmpPrintData, { path: '/' });
                        deli.common.notification.hidePreloader();
                    });
                    // 处理文件转化完成
                    if (self.state.timer) { self.stopConvertPoll(self.state.timer) }
                })
            }
        }, function (resp) {
            deli.common.notification.hidePreloader();
            deli.common.notification.prompt({
                "type": "error",
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) {}, function (resp) {});
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
                //for (let i = 1; i <= json.totalPage; i++) {}
                urlFileList.push({
                    'fileSuffix': json.fileType,
                    'fileSourceName': json.fileName,
                    'totalPage': json.totalPage,
                    'pdfMd5': json.pdfMd5,
                    //'previewUrl': (convertURL + '/file/preview/' + json.id + '_' + i + '_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + ''),
                    'fileSourceUrl': json.printUrl
                })
                let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: json.totalPage })
                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                    Cookies.save('printPreviewData', urlFileList, { path: '/' });
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
                            'fileSuffix': trans.fileType,
                            'fileSourceName': trans.fileName,
                            'totalPage': trans.totalPage,
                            'pdfMd5': trans.pdfMd5,
                            //'previewUrl': (convertURL + '/file/preview/' + trans.id + '_' + i + '_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + ''),
                            'fileSourceUrl': trans.printUrl
                        })
                    }
                    let tmpPrintData = Object.assign({}, self.state.printData, { printStartPage: 1, printEndPage: trans.totalPage })
                    self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList }, function () {
                        Cookies.save('printPreviewData', urlFileList, { path: '/' });
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
        const file = this.state.file
        const fileList = this.state.fileList
        const fileOuter = this.state.fileOuter
        const fileType = this.state.fileType
        if (this.state.redirect.imgNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "", state: { "sn": sn, "file": file, "fileList": fileList, "fileType": fileType }  }
            } />;
        }
        if (this.state.redirect.fileNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "", state: { "sn": sn, "file": file, "fileList": fileList, "fileType": fileType, "fileOuter":fileOuter   }  }
            } />;
        }
        if (this.state.redirect.taskNav) {
            return <Redirect push to={
                { pathname: "/printtask", search: "?sn=" + sn + "", state: { "sn": sn }  }
            } />;
        }
        if (this.state.redirect.manageNav) {
            return <Redirect push to={
                { pathname: "/printmanage", search: "?sn=" + sn + "", state: {"sn": sn } }
            } />;
        }
        return (
            <div className="content-nav">
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