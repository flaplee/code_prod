import React, { Component } from 'react';
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import 'whatwg-fetch'
import { Group, Boxs, List, NumberPicker, Context } from 'saltui';
import Icon from 'salt-icon';
import ReactSwipe from 'react-swipes'
import './Index.scss'
import photo01 from '../../images/photo01@3x.png';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL, globalData } from '../../configs/config'
import Loading from '../../util/component/Loading.js';

const { HBox, Box } = Boxs;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectPrintSetup:false,
            redirectPrinter: false,
            redirectPrintTask: false,
            printCount: 1,
            printCurrent: 1,
            printLoading: false,
            sn: (new URLSearchParams(props.location.search)).get('sn') || '',
            file: (props.location.state && props.location.state.file) || '',
            fileList: (props.location.state && props.location.state.fileList) || [],
            printer:{
                sn: (new URLSearchParams(props.location.search)).get('sn') || '',
                name: (new URLSearchParams(props.location.search)).get('name') || '',
                status: (new URLSearchParams(props.location.search)).get('status') || ''
            },
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
                'printStartPage': 0
            },
            printertData:{},
            pageData: {},//props.location.state,
            // swipes 的配置
            opt : {
                distance: Math.ceil(600 / 750 * document.documentElement.clientWidth), // 每次移动的距离，卡片的真实宽度
                currentPoint: 0,// 初始位置，默认从0即第一个元素开始
                autoPlay: false, // 是否开启自动播放
                swTouchstart: (ev) => {
                },
                swTouchmove: (ev) => {
                },
                swTouchend: (ev) => {
                    let data = {
                        moved: ev.moved,
                        originalPoint: ev.originalPoint,
                        newPoint: ev.newPoint,
                        cancelled: ev.cancelled
                    }
                    this.setState({printCurrent: (ev.newPoint + 1)})
                    console.log("data", data);
                }
            }
        };
        //alert(JSON.stringify(this.state.fileList))
        console.log("previewindex props",  props.location.state);
    }

    componentWillMount(){
        // 打印配置
        let printData = Cookies.load('printData')
        let printertData = Cookies.load('printer')
        if (printData){
            this.setState({
                printData: printData
            }, function() {
                console.log("this.state.printData", this.state.printData)
            })
        }
        if (printertData) {
            this.setState({
                printertData: printertData
            }, function () {
                console.log("this.state.printertData", this.state.printertData)
            })
        }
        //data.file_url.substring(data.file_url.lastIndexOf("\.") + 1, data.file_url.length)
        //this.getTaskToImages(this.state.fileList)
    }

    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-preview').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        const self = this
        deli.common.navigation.setTitle({
            "title": "打印预览"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": "设置"
        }, function (data) {
            self.setState({ redirectPrintSetup: true });
        }, function (resp) {});

        // 关闭
        deli.common.navigation.close({}, function (data) {
            // 重置
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
        }, function (resp) { });
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }

    // 打印机信息
    handlePrinterClick(){
        this.setState({ redirectPrinter: true });
    }

    // 打印
    handlePrintClick(){
        this.setState({printLoading: true}, function(){})
        const self = this
        let printData = new FormData();
        let printItems = self.state.printData;
        let fileMsg = {
            'pdfMd5': this.state.fileList[0].pdfMd5,
            'fileSuffix': this.state.fileList[0].fileSuffix
        }
        printItems.fileSourceUrl = this.state.fileList[0].fileSourceUrl
        printItems.fileSuffix = this.state.fileList[0].fileSuffix
        printItems.fileSourceName = this.state.fileList[0].fileSourceName
        if (printItems) {
            Object.keys(printItems).map(print => {
                printData.append(print, printItems[print]);
            });
        }
        //创建打印任务
        fetch(mpURL + '/app/printerTask/create', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: printData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    console.log("json", json)
                    if (json.code === 0) {
                        self.handlePrinterStart(json.data, fileMsg);
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //任务设置打印机打印
    handlePrinterStart(task, fileMsg){
        const self = this
        let PrinterData = new FormData();
        PrinterData.append('printerSn', self.state.sn);
        PrinterData.append('taskCode', task);
        //update 20180929
        PrinterData.append('pdfMd5', fileMsg.pdfMd5);
        PrinterData.append('fileSuffix', fileMsg.fileSuffix);
        fetch(mpURL + '/app/printerTask/setPrinterToPrint', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: PrinterData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    console.log("setPrinterToPrint", json)
                    if (json.code == 0) {
                        self.setState({ printLoading: false, redirectPrintTask: true }, function () { })
                    }else{
                         deli.common.notification.toast({
                            "text": json.msg,
                            "duration": 1.5
                        },function(data){},function(resp){});
                        self.setState({ printLoading: false }, function () { })
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.prompt({
                "type": 'error',
                "text": "网络错误,请重试",
                "duration": 1.5
            },function(data){},function(resp){});
            this.setState({ printLoading: false }, function () { })
            console.log("错误:" + err);
        });
    }
    
    // 打印份数
    handlePrintNumChange(name, value) {
        console.log("name", name);
        console.log("value", value);
        const t = this;
        t.setState({
            [name]: value
        });
    }

    // 分页预览
    handlePagePreview(data, limit){
        const self = this
        let pageLoad = data.pageCount
        for(let i = 1 ;i <= ((pageLoad <= limit) ? pageLoad : limit); i++){
            pageLoad++;
            self.getImagePage(data)
        }
    }

    //任务转换
    getTaskToImages(data, type){
        const self = this
        //文件转换
        let previewData = new FormData();
        previewData.append('fileId', data.fileId);
        previewData.append('sourceName', data.fileId);
        previewData.append('fileType', data.fileType);
        previewData.append('pdfPageCount', data.pdfPageCount);
        fetch(convertURL + '/file/uploadByFile', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: previewData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if(type == 'image'){
                        self.loadPreviewImg(json, 'image', function (inner) {
                            imgFileList.push({
                                'fileSuffix': json.fileType,
                                'pdfMd5': json.pdfMd5,
                                'fileSourceName': json.sourceName,
                                'fileSourceUrl': inner
                            })
                            self.setState({fileType: 'image', fileList: imgFileList}, function () {
                                deli.common.notification.hidePreloader();
                            });
                        })
                    }else if(type == 'file'){
                        self.loadPreviewFile(json, 'file', function(inner, outer){
                            docFileList.push({
                                'fileSuffix': json.fileType,
                                'fileSourceName': json.sourceName,
                                'fileSourceUrl': inner
                            })
                        })
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });

        if(type=='file'){
            self.loadPreviewFile(data, type)
        }else{
            self.loadPreviewImg(data, type)
        }
        
        if (data.length == 1) {
            self.loadPreviewImg(json, 'image', function (inner) {
                imgFileList.push({
                    'fileSuffix': json.fileType,
                    'fileSourceName': json.sourceName,
                    'fileSourceUrl': inner
                })
                self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                    deli.common.notification.hidePreloader();
                });
            })
        } else {
            self.loadPreviewImg(json, 'image', function (inner) {
                imgFileList.push({
                    'fileSuffix': json.fileType,
                    'fileSourceName': json.sourceName,
                    'fileSourceUrl': inner
                })
                if (imgFileNum == data.length) {
                    self.setState({ layerView: true, redirect: { imgNav: true }, fileType: 'image', fileList: imgFileList }, function () {
                        deli.common.notification.hidePreloader();
                    });
                } else {
                    self.setState({ fileType: 'image', fileList: imgFileList }, function () {
                        deli.common.notification.hidePreloader();
                    })
                }
            })
        }
    }

    // 文件转换,下载预览图片
    loadPreviewFile(data, type, callback){
        //alert(JSON.stringify(data))
        const self = this
        //PDF 文件预览接口
        let previewData = new FormData();
        previewData.append('taskId', data.taskId);
        previewData.append('fileType', ((type && type == 'file') ? data.fileType : 'pdf'));
        previewData.append('checkedPage', 1);//data.pdfPageCount
        previewData.append('width', 560);
        previewData.append('height', 790);
        fetch(convertURL + '/h5/converter/preview', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: previewData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    console.log("json", json)
                    if (json.code === 0) {
                        if (json.code === 0) {
                            if(typeof callback === 'function'){
                                callback(json.data, {
                                    "taskId": data.taskId,
                                    "fileType": data.fileType,
                                    "checkedPage": data.pdfPageCount,
                                    "pageCount": data.pdfPageCount
                                });
                            }
                        }
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    // 图片转换,下载预览图片
    loadPreviewImg(data, type, callback) {
        //alert(JSON.stringify(data))
        const self = this
        //PDF 文件预览接口
        /* let previewData = new FormData();
        previewData.append('taskId', data.taskId);
        previewData.append('fileType', data.fileType);
        previewData.append('checkedPage', data.pdfPageCount);
        previewData.append('width', 560);
        previewData.append('height', 790);
        fetch(convertURL + '/h5/converter/preview', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: previewData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code === 0) {
                        if(typeof callback === 'function'){
                            callback(json.data);
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
        }); */

    }

    //获取图片数据
    getImagePage(data) {
        const self = this
        //PDF 文件预览接口
        let previewData = new FormData();
        previewData.append('taskId', data.taskId);
        previewData.append('fileType', data.fileType);
        previewData.append('checkedPage', data.currentPage);
        previewData.append('width', 560);
        previewData.append('height', 790);
        fetch(convertURL + '/h5/converter/preview', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: previewData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code === 0) {
                        const fileList = self.state.fileList
                        self.setState({fileList:fileList})
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

    // 渲染图片
    rederPrintImgItem(){
        const imgItem = this.state.fileList;
        const result = [];
        if(imgItem.length > 0){
            for (let i = 0; i < imgItem.length; i++) {
                result.push(<div key={`page-img-${i}`} className="swiper-slide"><div className="swiper-slide-img"><img src={imgItem[i].fileSourceUrl} /></div></div>);
            }
        }
        
        return result;
    }
    
    render() {
        const tranData = this.state
        const sn = this.state.sn
        if (this.state.redirectPrintSetup) {
            return <Redirect push to={
                { pathname: "/previewsetup", search: "?sn=" + sn + "", state: tranData }
            } />;
        }
        if(this.state.redirectPrinter){
            return <Redirect push to={
                { pathname: "/printmanage", search: "?sn=" + sn + "", state: { "sn": sn } }
            } />;
        }

        if (this.state.redirectPrintTask) {
            return <Redirect push to={
                { pathname: "/printtask", search: "?sn=" + sn + "", state: { "sn": sn } }
            } />;
        }
        return (
            <div className="print-preview" id="print-preview" onTouchMove={this.unableTouchMove.bind(this)}>
                <Group className="preview-title">
                    <Group.List lineIndent={15}>
                        <div>
                            <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handlePrinterClick.bind(this)}>
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single omit">打印机</p>
                                        </Box>
                                    </HBox>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <div className={(this.state.status == 0 ? 'print-img-status print-status-error' : (this.state.status == 1 ? 'print-img-status print-status-success' : 'print-img-status print-status-offline'))}></div>
                                    </Box>
                                    <Box>
                                        <Box className="print-list-text-content-single">
                                            <p className="print-list-title-single omit left">{this.state.printertData.printerName}</p>
                                            <Icon className="print-list-arrow right" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                                        </Box>
                                    </Box>
                                </HBox>
                            </div>
                        </div>
                        <div>
                            <div className="print-list-wrap-single">
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single omit">打印份数</p>
                                        </Box>
                                    </HBox>
                                    <Box>
                                        <Box className="print-list-text-content-single">
                                            <div className="line"> <NumberPicker className="number-picker" value={this.state.printCount} min={1} max={99} step={1} width="14rem" onChange={this.handlePrintNumChange.bind(this, 'printCount')} useTouch={!Context.isPC} /></div>
                                        </Box>
                                    </Box>
                                </HBox>
                            </div>
                        </div>
                    </Group.List>
                </Group>
                <div className="preview-box">
                    <div className="preview-container swiper-container">
                        <ReactSwipe className="preview-inner swiper-wrapper" options={this.state.opt}>
                            {this.rederPrintImgItem()}
                        </ReactSwipe>
                    </div>
                    <div className="preview-nav">
                        <div className="preview-reference">
                            <span className="preview-before">{this.state.printCurrent}</span>/<span className="preview-after">{this.state.fileList.length}</span>
                        </div>
                        <div className="preview-print">
                            <a className="preview-btn" onClick={this.handlePrintClick.bind(this)} href="javascript:;">打印</a>
                        </div>
                    </div>
                </div>
                {(this.state.printLoading == true) ? <Loading pageLoading={true}></Loading> : ''}
            </div>
        );
    }
}

export default Index;