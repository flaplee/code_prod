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
import photoFail from '../../images/picture_fail@2x.png';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL, globalData } from '../../configs/config'
import Loading from '../../util/component/Loading.js';
import Utils from '../../util/js/util.js';

const { HBox, Box } = Boxs;

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectPrintSetup: false,
            redirectPrinter: false,
            redirectPrintTask: false,
            printerCurrent: localStorage.getItem('printerCurrent') || 0,
            printCount: localStorage.getItem('printCount') || 1,
            printCurrent: localStorage.getItem('printCurrent') || 1,
            printLoading: false,
            sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != 'undefined') ? (JSON.parse(localStorage.getItem('printer')).printerSn) : '',
            fileType: (props.location.state && props.location.state.fileType) || Cookies.load('printPreviewType') || 'image',
            fileList: (props.location.state && props.location.state.fileList) || JSON.parse(localStorage.getItem('printPreviewData')) || [],
            printer: (localStorage.getItem('printer') && localStorage.getItem('printer') != 'undefined') ? JSON.parse(localStorage.getItem('printer')) : undefined,
            printType: (new URLSearchParams(props.location.search)).get('type') || 'upload',
            printTaskInfo: (props.location.state && props.location.state.printTaskInfo) || JSON.parse(localStorage.getItem('printTaskInfo')) || {},
            printChildrens: [],
            printData: {
                'duplexMode': 0,
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 2,
                'printEndPage': 1,
                'copyCount': localStorage.getItem('printCount') || 1,
                'printDpi': 600,
                'paperSize': 'A4',
                'printColorMode': (localStorage.getItem('printer') && localStorage.getItem('printer') != 'undefined') ? ((JSON.parse(localStorage.getItem('printer')).printerSettings.colorTypes).indexOf('cmyk') >= 0 ? 'cmyk' : 'black') : 'black',
                'printWhole': 1,
                'printStartPage': 1
            },
            previewSetupData: {
                type: 'A4',
                direction: 2,
                dpi: 600,
                paper: {
                    width: 8.267,
                    height: 11.692,
                },
                print: {
                    width: 7.935,
                    height: 11.36,
                }
            },
            printertData: {},
            pageData: {
                pageForce: false,
                pageNum: 5,
                pageCurrent: (localStorage.getItem('printCurrent') ? Math.ceil(localStorage.getItem('printCurrent') / 5) : 1),
                pageRecord: []
            },
            // swipes 的配置
            optPageCount: ((((props.location.state && props.location.state.fileType) || Cookies.load('printPreviewType') || 'image') == 'image') ? ((props.location.state && props.location.state.fileList) || JSON.parse(localStorage.getItem('printPreviewData')) || []).length : ((props.location.state && props.location.state.fileList) || JSON.parse(localStorage.getItem('printPreviewData')) || [])[0].totalPage),
            optData:{},
            opt: {
                distance: Math.ceil(600 / 750 * document.documentElement.clientWidth), // 每次移动的距离，卡片的真实宽度
                currentPoint: (localStorage.getItem('printCurrent') ? (localStorage.getItem('printCurrent') - 1) : 0),// 初始位置，默认从0即第一个元素开始
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
                    const newPoint = (ev.newPoint + 1)
                    const total = this.state.optPageCount
                    if (newPoint <= total){
                        this.setState({
                            printCurrent: newPoint
                        }, function () {
                            const printcurrent = this.state.printCurrent //当前打印页码 从1开始
                            const pageNum = this.state.pageData.pageNum  //分页加载大小
                            const pageCurrent = this.state.pageData.pageCurrent  //分页码
                            const pageRecord = this.state.pageData.pageRecord
                            if (this.state.fileType == 'file' && Math.ceil(printcurrent % pageNum) == 3 && (total > pageNum * pageCurrent)) {
                                if (pageRecord.indexOf(printcurrent) < 0){
                                    pageRecord.push(printcurrent)
                                    this.setState({
                                        'pageData': {
                                            'pageForce': false,
                                            'pageNum': pageNum,
                                            'pageCurrent': (pageCurrent + 1),
                                            'pageRecord': pageRecord
                                        }
                                    })
                                    this.state.optData.swipes.maxPoint = (total - 1)
                                    this.state.optData.swipes.refresh()
                                }
                            }
                        })
                    }
                }
            }
        };
    }

    componentWillMount() {
        //处理重新打印重置打印配置
        let isReprint = ((localStorage.getItem('printPreviewFrom') && localStorage.getItem('printPreviewFrom') == 'printtask') ? true : false)
        let isNewprint = ((localStorage.getItem('printPreviewFrom') && localStorage.getItem('printPreviewFrom') == 'printindex') ? true : false)
        let printDataWrap = this.state.printData
        let previewSetupDataWrap = this.state.previewSetupData
        let printType = this.state.printType;
        let fileListWrap = (printType == 'scan') ? this.state.printTaskInfo.fileList : this.state.fileList;
        printDataWrap.printEndPage = ((fileListWrap.length == 1) ? fileListWrap[0].totalPage : fileListWrap.length);
        if (isReprint || isNewprint) {
            localStorage.removeItem('printPreviewFrom');
            localStorage.removeItem('printData');
            localStorage.setItem('printData', JSON.stringify(printDataWrap));
            localStorage.removeItem('previewSetupData');
            localStorage.setItem('previewSetupData', JSON.stringify(previewSetupDataWrap));
        } else {
            if (localStorage.getItem('printData') && localStorage.getItem('previewSetupData')) {
                if (localStorage.getItem('printDataChg') && localStorage.getItem('printDataChg') != 'undefined'){
                    // 打印数据配置
                    printDataWrap = JSON.parse(localStorage.getItem('printData'))
                    previewSetupDataWrap = JSON.parse(localStorage.getItem('previewSetupData'))
                }
                localStorage.removeItem('printData');
                localStorage.setItem('printData', JSON.stringify(printDataWrap));
            } else {
                localStorage.removeItem('printData');
                localStorage.removeItem('previewSetupData');
                localStorage.setItem('printData', JSON.stringify(printDataWrap));
                localStorage.setItem('previewSetupData', JSON.stringify(previewSetupDataWrap));
            }
        }
        this.setState({
            printData: printDataWrap,
            previewSetupData: previewSetupDataWrap
        }, function () { })
    }

    componentDidMount() {
        // 屏蔽触摸移动
        if (deli.ios == 'IOS') {
            document.getElementById('print-preview').addEventListener("touchmove", (e) => {
                this.unableTouchMove(e)
            }, {
                    passive: false
                })
        }
        document.querySelector('.rc-input-number-input').setAttribute("disabled", true)
        const self = this
        deli.common.navigation.setTitle({
            "title": "打印预览"
        }, function (data) { }, function (resp) { });

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) { }, function (resp) { });

        const tranData = self.state
        const storagePrintCountData = (localStorage.getItem('printCountData') && localStorage.getItem('printCountData') != undefined) ? JSON.parse(localStorage.getItem('printCountData')) : undefined
        const totalPage = (tranData.fileType == 'image') ? tranData.fileList.length : tranData.fileList[0].totalPage
        const startPage = ((storagePrintCountData && storagePrintCountData.startPage)) ? storagePrintCountData.startPage : 1
        const endPage = ((storagePrintCountData && storagePrintCountData.endPage)) ? storagePrintCountData.endPage : totalPage
        localStorage.removeItem('printCountData')
        localStorage.setItem('printCountData', JSON.stringify({ 'totalPage': totalPage, 'startPage': startPage, 'statusPage': ((storagePrintCountData && storagePrintCountData.statusPage) ? (storagePrintCountData && storagePrintCountData.statusPage) : false), 'endPage': endPage }))
        // 关闭
        deli.common.navigation.close({}, function (data) {
            // 重置
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
            Cookies.remove('admin');
            localStorage.removeItem('printer')
            localStorage.removeItem('printerChg')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('printTaskInfo')
            localStorage.removeItem('chooseTaskInfo')
            localStorage.removeItem('printData')
            localStorage.removeItem('previewSetupData')
        }, function (resp) { });
        if (self.state.printer && self.state.printer != undefined) {
            //获取打印机信息
            self.getPrinterData(self.state.printer.printerSn)
            deli.common.navigation.setRight({
                "text": "设置"
            }, function (data) {
                const tranData = self.state
                const storagePrintCountData = (localStorage.getItem('printCountData') && localStorage.getItem('printCountData') != undefined) ? JSON.parse(localStorage.getItem('printCountData')) : undefined
                const totalPage = (tranData.fileType == 'image') ? tranData.fileList.length : tranData.fileList[0].totalPage
                const startPage = ((storagePrintCountData && storagePrintCountData.startPage)) ? storagePrintCountData.startPage : 1
                const endPage = ((storagePrintCountData && storagePrintCountData.endPage)) ? storagePrintCountData.endPage : ((tranData.fileType == 'file') ? self.state.optPageCount : totalPage)
                localStorage.removeItem('printCountData')
                localStorage.setItem('printCountData', JSON.stringify({ 'totalPage': ((tranData.fileType == 'file') ? self.state.optPageCount : totalPage), 'startPage': startPage, 'statusPage': ((storagePrintCountData && storagePrintCountData.statusPage) ? (storagePrintCountData && storagePrintCountData.statusPage) : false), 'endPage': endPage }))
                self.setState({ redirectPrintSetup: true });
            }, function (resp) {});
        }
    }

    componentWillUpdate() {
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }

    // 打印机信息
    handlePrinterClick() {
        this.setState({ redirectPrinter: true });
    }

    // 打印页数较多处理
    handlePrintClick(type) {
        const self = this;
        if (type == true) {
            const pageNum = (this.state.fileType == 'image' ? this.state.fileList.length : this.state.fileList[0].totalPage);
            if (pageNum >= 20) {
                deli.common.modal.show({
                    "type": "confirm",
                    "title": "确认",
                    "content": "页数多，数据处理时间可能较长，是否继续打印? "
                }, function (data) {
                    if (data.confirm == true || data.confirm == 1) {
                        self.handlePrintLogic();
                    }
                }, function (resp) { });
            } else {
                self.handlePrintLogic();
            }
        } else {
            deli.common.notification.toast({
                "text": '请选择在线状态的打印机',
                "duration": 2
            }, function (data) { }, function (resp) { });
        }
    }

    // 打印
    handlePrintLogic() {
        const self = this;
        self.setState({ printLoading: true }, function () { })
        let printItems = {};
        if (self.state.printType == 'scan') {
            const printTaskInfo = self.state.printTaskInfo;
            const qrcodePrintData = (localStorage.getItem('printData') && localStorage.getItem('printData') != 'undefined') ? JSON.parse(localStorage.getItem('printData')) : self.state.printData;
            printItems.taskSource = printTaskInfo.taskSource;
            printItems.fileList = printTaskInfo.fileList;
            printItems.printerSn = printTaskInfo.printerSn || self.state.sn;
            printItems.printStartPage = qrcodePrintData.printStartPage;
            printItems.printEndPage = qrcodePrintData.printEndPage;
            printItems.copyCount = printTaskInfo.copyCount || qrcodePrintData.copyCount;
            //基础参数设置
            printItems.printDirection = qrcodePrintData.printDirection;
            printItems.paperSize = qrcodePrintData.paperSize;
            printItems.printColorMode = qrcodePrintData.printColorMode;
            printItems.printWhole = qrcodePrintData.printWhole;
            printItems.duplexMode = qrcodePrintData.duplexMode;
            printItems.printDpi = qrcodePrintData.printDpi;
        } else {
            const fileList = self.state.fileList;
            printItems = (localStorage.getItem('printData') && localStorage.getItem('printData') != 'undefined') ? JSON.parse(localStorage.getItem('printData')) : self.state.printData;
            printItems.printerSn = self.state.sn;
            printItems.fileList = [];
            for (let i = 0; i < fileList.length; i++) {
                printItems.fileList.push({
                    fileSource: fileList[i].fileSource,
                    printMd5: fileList[i].printMd5,
                    fileSuffix: fileList[i].fileSuffix,
                    printPDF: fileList[i].printPDF,
                    totalPage: fileList[i].totalPage,
                    fileId: fileList[i].id,
                    printUrl: fileList[i].printUrl,
                    fileName: fileList[i].fileName
                })
            }
        }
        //创建打印任务和任务设置打印机
        fetch(mpURL + ((self.state.printType == 'scan') ? '/v1/app/printTask/taskToPrinter/' + self.state.printTaskInfo.taskCode + '' : '/v1/app/printTask/apply'), {
            method: 'POST',
            timeout: 60000,
            headers: {
                "Content-Type": "application/json",
                "MP_TOKEN": Cookies.load('token')
            },
            body: JSON.stringify(printItems)
        }).then(
            function (response) {
                if (response.status !== 200) {
                    self.setState({ printLoading: false }, function () { })
                    deli.common.notification.toast({
                        "text": "网络错误,请重试",
                        "duration": 1.5
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    localStorage.removeItem('printDataChg')
                    localStorage.removeItem('printCount')
                    localStorage.removeItem('printPreviewData')
                    localStorage.setItem('printCount', printItems.copyCount)
                    localStorage.setItem('printPreviewData', JSON.stringify(self.state.fileList))
                    if (json.code == 0) {
                        self.setState({ printLoading: false, redirectPrintTask: true }, function () { })
                    } else {
                        self.setState({ printLoading: false }, function () { })
                        deli.common.notification.toast({
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ printLoading: false }, function () { })
            deli.common.notification.toast({
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
        });
    }

    // 打印份数
    handlePrintNumChange(name, value) {
        const self = this;
        const printData = Object.assign({}, JSON.parse(localStorage.getItem('printData')), { 'copyCount': value })
        self.setState({
            [name]: value,
            'printData': printData
        }, function () {
            localStorage.removeItem('printData');
            localStorage.removeItem('printPreviewData');
            localStorage.setItem('printData', JSON.stringify(printData));
            localStorage.setItem('printPreviewData', JSON.stringify(self.state.fileList));
            Cookies.save('printChildrens', self.state.printChildrens, { path: '/' });
        });
    }

    //获取纸张缩放比例
    getPrintImgScale() {
        let paper = this.state.previewSetupData.paper
        let print = this.state.previewSetupData.print
        let w = paper.width
        let h = paper.height
        let pw = print.width
        let ph = print.height
        if (w > pw && h > ph) {
            if ((w / pw) > (h / ph)) {
                ph = parseFloat((pw * h) / w)
            } else {
                pw = parseFloat((ph * w) / h)
            }
        } else if (w > pw && h < ph) {
            ph = parseFloat((pw * h) / w)
        } else if (w < pw && h > ph) {
            pw = parseFloat((ph * w) / h)
        } else {
            if ((pw / w) > (ph / h)) {
                ph = parseFloat((pw * h) / w)
            } else {
                pw = parseFloat((ph * w) / h)
            }
        }
        return [parseFloat(pw / w), parseFloat(ph / h)];
    }

    //图片加载
    handleImageLoaded(target, direction) {
        let r = 1
        const zoom = this.getPrintImgScale();
        const offsetWidth = (direction == 2) ? target.parentElement.parentElement.offsetWidth : target.parentElement.parentElement.offsetHeight
        const offsetHeight = (direction == 2) ? target.parentElement.parentElement.offsetHeight : target.parentElement.parentElement.offsetWidth
        let rw = parseFloat(target.width / offsetWidth)
        let rh = parseFloat(target.height / offsetHeight)
        if (rw > 1 || rh > 1) {
            r = Math.max(rw, rh)
            target.style.width = parseFloat(target.width / r * zoom[0]) + 'px'
            target.style.height = parseFloat(target.height / r * zoom[1]) + 'px'
        }else{
            target.style.width = parseFloat(target.width * zoom[0]) + 'px'
            target.style.height = parseFloat(target.height * zoom[1]) + 'px'
        }
        target.parentNode.style.display = 'block';
        target.parentNode.style.display = 'flex';
        target.parentNode.style.display = '-webkit-box';
        target.parentNode.style.display = '-webkit-flex';
        target.parentNode.nextElementSibling.style.display = 'none';
        target.parentNode.nextElementSibling.nextElementSibling.style.display = 'none';
    }

    //图片加载失败
    handleImageErrored(target) {
        target.parentNode.style.display = 'none';
        target.parentNode.nextElementSibling.style.display = 'none';
        target.parentNode.nextElementSibling.nextElementSibling.style.display = 'flex';
        target.parentNode.nextElementSibling.nextElementSibling.style.display = '-webkit-box';
        target.parentNode.nextElementSibling.nextElementSibling.style.display = '-webkit-flex';
    }

    // 渲染图片
    rederPrintImgItem() {
        const result = []
        const fileType = this.state.fileType
        const printType = this.state.printType
        const fileList = this.state.fileList
        const current = this.state.pageData.pageCurrent
        const imgData = (fileType == 'image') ? fileList : fileList[0]
        let imgDataCopy = {}
        for (let item in imgData) {
            imgDataCopy[item] = imgData[item]
        }
        //预览图片分页处理
        const total = this.state.optPageCount
        const pageNum = this.state.pageData.pageNum
        if (fileType == 'file') {
            if (total >= (current + 1) * pageNum) {
                imgDataCopy.totalPage = (current + 1) * pageNum 
            } else {
                imgDataCopy.totalPage = total
            }
        }else{
            imgDataCopy = imgData
        }
        const imgDirection = this.state.previewSetupData.direction
        const imgList = this.rederPrintImgList(fileType, printType, imgDataCopy, imgDirection)
        if (imgList.length > 0) {
            for (let i = 0; i < imgList.length; i++) {
                result.push(<div key={`page-img-${i}`} className="swiper-slide"><div className="swiper-slide-img"><img className={imgDirection == 2 ? "loading-img" : "swiper-slide-img-rotate-90  loading-img"} data-src={imgList[i]} src={imgList[i]} onLoad={e => this.handleImageLoaded(e.target, imgDirection)} onError={e => this.handleImageErrored(e.target)} /></div><div className="swiper-slide-loading-img"></div><div className="swiper-slide-fail-img"></div></div>);
            }
        }
        return result;
    }

    // 生成预览图片数据
    rederPrintImgList(type, printType, item, direction) {
        const imgList = []
        const width = (direction == 2) ? Math.round((560 / 750) * document.documentElement.clientWidth) : Math.round((790 / 1206) * document.documentElement.clientHeight)
        const height = (direction == 2) ? Math.round((790 / 1206) * document.documentElement.clientHeight) : Math.round((560 / 750) * document.documentElement.clientWidth)
        for (let i = 0; i < ((type == 'image') ? item.length : item.totalPage); i++) {
            imgList.push((convertURL + '/file/preview/' + (printType == 'scan' ? ((type == 'image') ? item[i].fileId : item.fileId) : ((type == 'image') ? item[i].id : item.id)) + '_' + (i + 1) + '_' + width + '_' + height + ''))
        }
        return imgList;
    }

    //获取打印机信息
    getPrinterData(sn) {
        const self = this
        //查询打印机信息
        fetch(mpURL + '/app/printer/queryStatus/' + sn, {
            method: 'GET',
            timeout: 60000,
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
                    if (resp1.code == 0) {
                        let initResp = resp1.data
                        if (initResp.hasPermissions == true) {
                            if (localStorage.getItem('printerChg')) {
                                let lastPrintData = self.state.printData
                                let lastPreviewSetupData = self.state.previewSetupData
                                // 处理打印设置变更
                                let paper
                                let mode
                                let color = initResp.printerSettings.colorTypes.indexOf(lastPrintData.printColorMode) >= 0
                                for (let j = 0; j < initResp.printerSettings.paperInfos.length; j++){
                                    if (initResp.printerSettings.paperInfos[j].double == (lastPrintData.duplexMode == 1 ? true : false)){
                                        paper = true
                                    }
                                    if (initResp.printerSettings.paperInfos[j].paperType == lastPrintData.paperSize) {
                                        mode = true
                                    }
                                }
                                //const startPage = lastPrintData.printStartPage
                                //const endPage = lastPrintData.printEndPage
                                //是否包含所有支持设置项
                                if (paper && mode && color) {
                                    localStorage.removeItem('printer')
                                    localStorage.setItem('printer', JSON.stringify(initResp))
                                    self.setState({ printer: initResp }, function () { })
                                } else {
                                    if (localStorage.getItem('printerDataChg')){
                                        deli.common.modal.show({
                                            "type": "confirm",
                                            "title": "确认",
                                            "content": "有不支持的打印设置发生改变 "
                                        }, function (data) {
                                            if (data.confirm == true || data.confirm == 1) {
                                                // 处理打印机配置
                                                if (!paper) { lastPrintData.duplexMode = 0 }
                                                if (!mode) {
                                                    lastPrintData.paperSize = 'A4';
                                                    //处理打印设置参数
                                                    lastPreviewSetupData = {
                                                        type: 'A4',
                                                        direction: 2,
                                                        dpi: 600,
                                                        paper: {
                                                            width: 8.267,
                                                            height: 11.692,
                                                        },
                                                        print: {
                                                            width: 7.935,
                                                            height: 11.36,
                                                        }
                                                    }
                                                }
                                                if (!color) { lastPrintData.printColorMode = 'black' }
                                                //重置数据
                                                localStorage.removeItem('printer')
                                                localStorage.setItem('printer', JSON.stringify(initResp))
                                                localStorage.removeItem('printData');
                                                localStorage.removeItem('previewSetupData');
                                                localStorage.setItem('printData', JSON.stringify(lastPrintData));
                                                localStorage.setItem('previewSetupData', JSON.stringify(lastPreviewSetupData));
                                                self.setState({ printer: initResp }, function () { })
                                            }
                                        }, function (resp) { });
                                    }
                                }
                            } else {
                                localStorage.removeItem('printer')
                                localStorage.setItem('printer', JSON.stringify(initResp))
                                self.setState({ printer: initResp }, function () { })
                            }
                            if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
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
                                        localStorage.removeItem('printer')
                                        localStorage.setItem('printer', (resp1.data.hasPermissions == true ? JSON.stringify(initResp) : undefined))
                                        self.setState({ printer: (resp1.data.hasPermissions == true ? initResp : undefined) }, function () { })
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
                            if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
                            localStorage.removeItem('printer')
                            self.setState({ printer: undefined }, function () { })
                            deli.common.notification.toast({
                                "text": '请重新选择打印机',
                                "duration": 2
                            }, function (data) { }, function (resp) { });
                        }
                    } else {
                        if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
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

    render() {
        let sn = (this.state.printer && this.state.printer != undefined) ? this.state.printer.printerSn : ''
        let status = (this.state.printer && this.state.printer != undefined) ? (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2)) : -1
        let name = (this.state.printer && this.state.printer != undefined) ? this.state.printer.printerName : ''
        let printCount
        let tranData
        if (this.state.redirectPrintSetup) {
            tranData = this.state
            sn = this.state.printer.printerSn
            status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            printCount = this.state.printCount
            localStorage.removeItem('printCount');
            localStorage.setItem('printCount', printCount);
            return <Redirect push to={
                { pathname: "/previewsetup", search: "?sn=" + sn + "&status=" + status + "&printcount=" + printCount + "", state: tranData }
            } />;
        }
        if (this.state.redirectPrinter) {
            printCount = this.state.printCount
            localStorage.removeItem('printCount');
            localStorage.setItem('printCount', printCount);
            return <Redirect push to={
                { pathname: "/printlist", search: "?printercurrent=" + this.state.printerCurrent + "", state: { "printercurrent": this.state.printerCurrent } }
            } />;
        }

        if (this.state.redirectPrintTask) {
            sn = this.state.printer.printerSn
            status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&status=" + status + "&from=preview", state: { "sn": sn, "status": status, "from": "preview" } }
            } />;
        }
        return (
            <div className="print-preview" id="print-preview" onTouchMove={this.unableTouchMove.bind(this)}>
                <Group className="preview-title">
                    <Group.List lineIndent={15}>
                        <div>
                            <div className="preview-title-device print-list-wrap-single print-list-wrap-single-tap" onClick={this.handlePrinterClick.bind(this)}>
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single omit">打印机</p>
                                        </Box>
                                        <Box className="preview-title-device-text print-list-text-content-single">
                                            <div className="print-list-title-single print-list-title-single-name omit left"><span className={(status != -1) ? ((status == 0 ? 'print-list-title-single-text print-status-error' : (status == 1 ? 'print-list-title-single-text print-status-success' : 'print-list-title-single-text print-status-offline'))) : 'print-list-title-single-text'}>{ name }</span></div>
                                        </Box>
                                        <Box className="print-list-text-content-single preview-title-device-icon">
                                            <Icon className="print-list-arrow right" name='direction-right' fill="#666666" width="3rem" height="3rem" />
                                        </Box>
                                    </HBox>
                                </HBox>
                            </div>
                        </div>
                        <div>
                            <div className="preview-title-sheet print-list-wrap-single">
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single omit">打印份数</p>
                                        </Box>
                                        <Box className="print-list-text-content-single preview-title-sheet-num">
                                            <div className="line"> <NumberPicker className="number-picker" value={this.state.printCount} min={1} max={99} step={1} width="14rem" onChange={this.handlePrintNumChange.bind(this, 'printCount')} focusOnUpDown={false} useTouch={!Context.isPC} /></div>
                                        </Box>
                                    </HBox>
                                </HBox>
                            </div>
                        </div>
                    </Group.List>
                </Group>
                <div className={ Utils.previewSuitClass }>
                    <div className="preview-container swiper-container">
                        <div className="preview-container-box">
                            <ReactSwipe className="preview-inner swiper-wrapper" options={this.state.opt} ref={el => (this.state.optData = el)}>
                                {this.rederPrintImgItem()}
                            </ReactSwipe>
                            <div className="preview-reference">
                                <span className="preview-before">{this.state.printCurrent}</span>/<span className="preview-after">{this.state.optPageCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="preview-nav">
                    <div className="preview-print">
                        <a className={(status == 1) ? 'preview-btn' : 'preview-btn preview-btn-disabled'} onClick={this.handlePrintClick.bind(this, (status == 1) ? true : false)} href="javascript:;">打印</a>
                    </div>
                </div>
                {(this.state.printLoading == true) ? <Loading pageLoading={true} pageLoadingText={'打印准备中…'}></Loading> : ''}
            </div>
        );
    }
}

export default Index;