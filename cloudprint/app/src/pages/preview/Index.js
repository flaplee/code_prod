import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'react-cookies';
import 'whatwg-fetch'
import { Group, Boxs, List, NumberPicker, Context } from 'saltui';
import Icon from 'salt-icon';
import ReactSwipe from 'react-swipes'
import './Index.scss'
import photo01 from '../../images/photo01.png';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'

const { HBox, Box } = Boxs;

// swipes 的配置
let opt = {
    distance: 600, // 每次移动的距离，卡片的真实宽度
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
        console.log("data", data);
    }
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectPrintSetup:false,
            redirectPrinter: false,
            printCount: 1,
            printCurrent: 1,
            photo: 'https://file.delicloud.xin/oss-1535626446061-2048.jpg',
            sn: props.location.state.sn,
            file: props.location.state.file,
            printData: {
                'fileSource': 'CLOUD',
                'duplexMode': 1,
                'fileSourceUrl': props.location.state.file.url,
                'fileSuffix': props.location.state.file.fileExt,
                'taskSource': 'WBE',
                'printDirection': 1,
                'fileSourceName': props.location.state.file.fileName,
                'printEndPage': 1,
                'pagesPre': 1,
                'copyCount': 1,
                'copyCount': 1,
                'printDpi': 1200,
                'printPageSize': 'A4',
                'printColorMode': 'black',
                'isPrintWhole': 0,
                'printStartPage': 0
            },
            printImg: [],
            printertData:{},
            pageData: props.location.state
        };
        console.log("previewindex props", props.location.state.file);
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
        deli.common.navigation.setTitle({
            "title": "打印预览"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": "设置"
        }, function (data) {
            this.setState({ redirectPrintSetup: true });
        }, function (resp) {});
    }

    // 打印机信息
    handlePrinterClick(){
        this.setState({ redirectPrinter: true });
    }

    // 打印
    handlePrintClick(){
        const self = this
        let printData = new FormData();
        let printItems = self.state.printData;
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
                        self.handlePrinterStart(json.data);
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //任务设置打印机打印
    handlePrinterStart(task){
        const self = this
        let PrinterData = new FormData();
        PrinterData.append('printerSn', self.state.sn);
        PrinterData.append('taskCode', task);
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

                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }
    
    // 打印份数
    handlePrintNumChange(name, value) {
        console.log("name", name);
        console.log("value", value);
        const t = this;
        t.setState({
            [name]: value,
        });
    }

    // 渲染图片
    rederPrintImgItem(){
        const imgItem = this.state.printImg;
        const result = [];
        for (let i = 0; i < imgItem.length; i++) {
            result.push(<div key={`page-img-${i}`} className="swiper-slide"><div className="swiper-slide-img"><img src={imgItem[i]} /></div></div>);
        }
        return result;
    }
    
    render() {
        const sn = this.state.sn
        if (this.state.redirectPrintSetup) {
            return <Redirect push to="/previewsetup" />;
        }
        if(this.state.redirectPrinter){
            return <Redirect push to={
                { pathname: "/printmanage", search: "?sn=" + sn + "", state: { "sn": sn } }
            } />;
        }
        return (
            <div className="print-preview">
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
                            <div className="print-list-wrap-single print-list-wrap-single-tap">
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single omit">打印份数</p>
                                        </Box>
                                    </HBox>
                                    <Box>
                                        <Box className="print-list-text-content-single">
                                            <div className="line"> <NumberPicker value={this.state.printCount} min={1} max={99} step={1} width="14rem" onChange={this.handlePrintNumChange.bind(this, 'printCount')} useTouch={!Context.isPC} /></div>
                                        </Box>
                                    </Box>
                                </HBox>
                            </div>
                        </div>
                    </Group.List>
                </Group>
                <div className="preview-box">
                    <div className="preview swiper-container">
                        <ReactSwipe className="preview-inner swiper-wrapper" options={opt}>
                            {this.rederPrintImgItem()}
                        </ReactSwipe>
                    </div>
                    <div className="preview-nav">
                        <div className="preview-reference">
                            <span className="preview-before">{this.state.printCurrent}</span>/<span className="preview-after">{this.state.printCount}</span>
                        </div>
                        <div className="preview-print">
                            <a className="preview-btn" onClick={this.handlePrintClick.bind(this)} href="javascript:;">打印</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;