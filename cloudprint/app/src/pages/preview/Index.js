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
            printerCurrent: 0,
            printCount: 1,
            printCurrent: 1,
            printLoading: false,
            sn: (new URLSearchParams(props.location.search)).get('sn') || '',
            fileType: (props.location.state && props.location.state.fileType) || Cookies.load('printPreviewType') || 'image',
            fileList: (props.location.state && props.location.state.fileList) || JSON.parse(localStorage.getItem('printPreviewData')) || [],
            printer:{
                sn: (new URLSearchParams(props.location.search)).get('sn') || '',
                name: (new URLSearchParams(props.location.search)).get('name') || '',
                status: (new URLSearchParams(props.location.search)).get('status') || ''
            },
            printType: (new URLSearchParams(props.location.search)).get('type') || 'upload',
            printTaskInfo: (props.location.state && props.location.state.printTaskInfo) || {},
            printChildrens:[],
            printData: Cookies.load('printData') || {
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
            printertData:{
            },
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
            const tranData = self.state
            const totalPage = (tranData.fileType == 'image') ? tranData.fileList.length : tranData.fileList[0].totalPage
            Cookies.save('printCountData', { 'totalPage': totalPage, 'startPage': 1, 'statusPage': ((Cookies.load('printCountData') && Cookies.load('printCountData').statusPage) ? (Cookies.load('printCountData') && Cookies.load('printCountData').statusPage):  false), 'endPage': totalPage}, { path: '/' });
            self.setState({ redirectPrintSetup: true });
        }, function (resp) {});
        const tranData = self.state
        const totalPage = (tranData.fileType == 'image') ? tranData.fileList.length : tranData.fileList[0].totalPage
        Cookies.save('printCountData', { 'totalPage': totalPage, 'startPage': 1, 'statusPage': ((Cookies.load('printCountData') && Cookies.load('printCountData').statusPage) ? (Cookies.load('printCountData') && Cookies.load('printCountData').statusPage) : false), 'endPage': totalPage }, { path: '/' });
        // 关闭
        deli.common.navigation.close({}, function (data) {
            // 重置
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
            Cookies.remove('admin');
        }, function (resp) {});

        // 异步加载图片
        var imgs = document.querySelectorAll('img.loading-img');
        for (var i = 0; i < imgs.length; i++) {
            var url = imgs[i].dataset.src;
            self.loadImage(imgs[i], url, function ($o) {
                $o.parentNode.style.display = 'block';
                $o.parentNode.nextElementSibling.style.display = 'none';
            });
        }
    }

    componentWillUpdate(){
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
    handlePrintClick(type){
        const self = this;
        if(type == true){
            self.setState({ printLoading: true }, function () {})
            let printItems = {};
            if (self.state.printType == 'scan') {
                const printTaskInfo = self.state.printTaskInfo;
                const qrcodePrintData = self.state.printData;
                printItems.taskSource = printTaskInfo.taskSource;
                printItems.fileList = printTaskInfo.fileList;
                printItems.printerSn = printTaskInfo.printerSn || self.state.sn;
                printItems.printStartPage = printTaskInfo.printStartPage || qrcodePrintData.printStartPage;
                printItems.printEndPage = printTaskInfo.printEndPage || qrcodePrintData.printEndPage;
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
                printItems = self.state.printData;
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
                headers: {
                    "Content-Type": "application/json",
                    "MP_TOKEN": Cookies.load('token')
                },
                body: JSON.stringify(printItems)
            }).then(
                function (response) {
                    if (response.status !== 200) {
                        return;
                    }
                    response.json().then(function (json) {
                        console.log("json", json)
                        if (json.code == 0) {
                            self.setState({ printLoading: false, redirectPrintTask: true }, function () { })
                        } else {
                            deli.common.notification.toast({
                                "text": json.msg,
                                "duration": 1.5
                            }, function (data) { }, function (resp) { });
                            self.setState({ printLoading: false }, function () {})
                        }
                    });
                }
            ).catch(function (err) {
                console.log("错误:" + err);
            });
        }else{
            deli.common.notification.toast({
                "text": '请选择在线状态的打印机',
                "duration": 2
            }, function (data) {}, function (resp) {});
        }
    }

    // 打印份数
    handlePrintNumChange(name, value) {
        const self = this;
        const printData = Object.assign({}, Cookies.load('printData'), { 'copyCount': value })
        self.setState({
            [name]: value,
            'printData': printData
        }, function(){
            Cookies.save('printData', printData, { path: '/' });
            localStorage.setItem('printPreviewData', JSON.stringify(self.state.fileList))
            Cookies.save('printChildrens', self.state.printChildrens, { path: '/' });
        });
    }

    // 渲染图片
    rederPrintImgItem(){
        const result = []
        const fileType = this.state.fileType
        const printType = this.state.printType
        const fileList = this.state.fileList
        const imgData = (fileType == 'image') ? fileList : fileList[0]
        const imgList = this.rederPrintImgList(fileType, printType, imgData)
        if (imgList.length > 0){
            for (let i = 0; i < imgList.length; i++) {
                result.push(<div key={`page-img-${i}`} className="swiper-slide"><div className="swiper-slide-img"><img className="loading-img" data-src={imgList[i]} src={imgList[i]} /></div><div className="swiper-slide-loading-img"></div></div>);
            }
        }
        return result;
    }

    // 生成预览图片数据
    rederPrintImgList(type, printType, item){
        const imgList = []
        for (let i = 0; i < ((type == 'image') ? item.length : item.totalPage); i++){
            imgList.push((convertURL + '/file/preview/' + (printType == 'scan' ? ((type == 'image') ? item[i].fileId : item.fileId) : ((type == 'image') ? item[i].id : item.id)) + '_'+ (i + 1) +'_' + Math.round((560 / 750) * document.documentElement.clientWidth) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight) + ''))
        }
        return imgList;
    }

    // 加载预览图片
    loadImage(o, url, callback) {
        if (o.parentNode.nextElementSibling) {
            o.parentNode.nextElementSibling.style.display = 'block'
        }
        var img = new Image();
        img.src = url;
        // 判断图片是否在缓存中
        if (img.complete) {
            callback.call(img, o);
            return;
        }
        img.onload = function () {
            callback.call(img, o);
        }
    }

    render() {
        let sn
        let status
        let name
        let tranData
        if (this.state.redirectPrintSetup) {
            tranData = this.state
            sn = this.state.sn
            status = this.state.printer.status
            return <Redirect push to={
                { pathname: "/previewsetup", search: "?sn=" + sn + "&status="+ status +"", state: tranData }
            } />;
        }
        if(this.state.redirectPrinter){
            return <Redirect push to={
                { pathname: "/printlist", search: "?printercurrent=" + this.state.printerCurrent + "", state: { "printercurrent": this.state.printerCurrent } }
            } />;
        }

        if (this.state.redirectPrintTask) {
            sn = this.state.sn
            status = this.state.printer.status
            name = this.state.printer.name
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&status=" + status + "&name=" + name + "", state: { "sn": sn, "status": status, "name": name } }
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
                                            <div className={(this.state.printer.status == 0 ? 'print-img-status print-status-error' : (this.state.printer.status == 1 ? 'print-img-status print-status-success' : 'print-img-status print-status-offline'))}></div>
                                            <p className="print-list-title-single print-list-title-single-name omit left">{this.state.printertData.printerName}</p>
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
                                            <div className="line"> <NumberPicker className="number-picker" value={this.state.printCount} min={1} max={99} step={1} width="14rem" onChange={this.handlePrintNumChange.bind(this, 'printCount')} useTouch={!Context.isPC} /></div>
                                        </Box>
                                    </HBox>
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
                            <span className="preview-before">{this.state.printCurrent}</span>/<span className="preview-after">{(this.state.fileType == 'image' ? this.state.fileList.length : this.state.fileList[0].totalPage)}</span>
                        </div>
                        <div className="preview-print">
                            <a className={(this.state.printer.status == 1) ? 'preview-btn' :'preview-btn preview-btn-disabled' } onClick={this.handlePrintClick.bind(this, (this.state.printer.status == 1) ? true : false)} href="javascript:;">打印</a>
                        </div>
                    </div>
                </div>
                {(this.state.printLoading == true) ? <Loading pageLoading={true}></Loading> : ''}
            </div>
        );
    }
}

export default Index;