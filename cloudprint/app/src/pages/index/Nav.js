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
            fileList : []
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
            callback(convertURL + '/file/preview/' + data.id + '_' + data.totalPage + '_' + Math.round((560 / 750) * document.documentElement.clientWidth / window.dpr) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight / window.dpr) + '', {
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
            callback(convertURL + '/file/preview/' + data.id + '_' + data.totalPage + '_' + Math.round((560 / 750) * document.documentElement.clientWidth / window.dpr) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight / window.dpr) + '', {
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
                    "fileUrl": "http://file.delicloud.xin/deli_POT_Manual.pdf",
                    "fileType": "pdf",
                    "fileName": "deli_POT_Manual.pdf",
                    "fileSource": "disk"
                }]
            })
            /* {
                'converterUrlVos': [{
                    'fileUrl': data.file_url,
                    'fileName': data.file_name,
                    'fileType': data.file_url.substring(data.file_url.lastIndexOf("\.") + 1, data.file_url.length),
                    'fileSource': 'disk'
                }]
            } */
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        //self.startConvertPoll(json.data, callback)
                        if (typeof callback === 'function') {
                            callback(convertURL + '/file/preview/' + json.data[0].id + '_' + json.data[0].totalPage + '_' + Math.round((560 / 750) * document.documentElement.clientWidth / window.dpr) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight / window.dpr) + '', {
                                "fileId": json.data[0].id,
                                "fileType": json.data[0].fileType,
                                "checkedPage": json.data[0].totalPage,
                                "pageCount": json.data[0].totalPage
                            });
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
            method: 'GET',
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
                    if (resp.code == 0 && resp.data && resp.data.converterStatus) {
                            self.stopConvertPoll(self.state.timer)
                            const taskData = resp.data
                            if(typeof callback === 'function'){
                                callback(taskData)
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
                    max: 1
                }, function (data) {
                    if(data.length > 0){
                        deli.common.notification.showPreloader();
                        for (let imgFileNum = 0; imgFileNum < data.length; imgFileNum++){
                            deli.common.file.upload({
                                url: convertURL + '/file/uploadByFile',
                                file: data[imgFileNum].file_path
                            }, function (json) {
                                for (let i = 0; i < json.length; i++) {
                                    (function (i) {
                                        self.loadPreviewImg(json[i], 'image', function (inner) {
                                            imgFileList.push({
                                                'fileSuffix': json[i].fileType,
                                                'pdfMd5': json[i].pdfMd5,
                                                'fileSourceName': json[i].fileName,
                                                'fileSourceUrl': inner
                                            })
                                            console.log("imgFileNum", imgFileNum)
                                            console.log("status", imgFileNum == (data.length - 1 ))
                                            if (imgFileNum == (data.length - 1 )) {
                                                self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                                                    deli.common.notification.hidePreloader();
                                                });
                                            } else {
                                                self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                                                    deli.common.notification.hidePreloader();
                                                })
                                            }
                                        })
                                    })(i);
                                }
                            }, function (resp) {});
                        }
                    }
                }, function (resp) {
                    alert(JSON.stringify(resp));
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
                const docFileList = []
                self.setState({ layerView: false });
                deli.common.file.choose({
                    types: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf'],
                    max_size: 52428800
                }, function(data) {
                    if(data.length > 0){
                        deli.common.notification.showPreloader();
                        for (let docFileNum = 0; docFileNum < data.length; docFileNum++) {
                            deli.common.file.upload({
                                url: convertURL + '/file/uploadByFile',
                                file: data[docFileNum].file_path
                            }, function (json) {
                                for (let i = 0; i < json.length; i++) {
                                    (function (i) {
                                        self.loadPreviewFile(json[i], 'file', function (inner, outer) {
                                            docFileList.push({
                                                'fileSuffix': json[i].fileType,
                                                'fileSourceName': json[i].fileName,
                                                'fileSourceUrl': inner
                                            })
                                            if (docFileNum == (data.length-1)) {
                                                self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: docFileList, fileOuter: outer }, function () {
                                                    deli.common.notification.hidePreloader();
                                                });
                                            } else {
                                                self.setState({ fileType: 'file', fileList: docFileList, fileOuter: outer }, function () {
                                                    deli.common.notification.hidePreloader();
                                                })
                                            }
                                        })
                                    })(i);
                                }
                            }, function (resp) {});
                        }
                    }
                });
                break;
            case 2:
                self.setState({ layerView: false });
                deli.app.disk.choose({
                    types: ['png', 'jpg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']
                }, function (data) {
                    deli.common.notification.showPreloader();
                        let urlFileNum = 0
                        let urlFileList = []
                        for (let i = 0; i < data.length; i++) {
                            urlFileGet(data, i)
                        }
                        function urlFileGet(data, i) {
                            self.loadPreviewUrl(data[i], 'url', function(url, json){
                                alert(JSON.stringify(url))
                                alert(JSON.stringify(json))
                                self.loadPreviewFile(json, 'url', function(inner, outer){
                                    urlFileList.push({
                                        'fileSuffix': json.fileType,
                                        'fileSourceName': json.fileName,
                                        'totalPage': json.totalPage,
                                        'fileSourceUrl': inner
                                    })
                                    self.setState({ redirect: { fileNav: true }, fileType: 'file', fileList: urlFileList, fileOuter: outer  }, function(){
                                        deli.common.notification.hidePreloader();
                                    });
                                })
                            })
                        }
                }, function (resp) {
                    alert(JSON.stringify(resp));
                });
                break;
            case 3:
                self.setState({ layerView: false });
                break;
            default:
                self.setState({ layerView: false });
                break;
        }
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
            //alert(JSON.stringify(fileList))
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