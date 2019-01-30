import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import objectAssign from 'object-assign'
import { Group, Boxs, List, Layer, ScrollView } from 'saltui'
import Icon from 'salt-icon'
import FileList from './FileList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index.scss'
import Utils from '../../util/js/util.js';

const { HBox, Box } = Boxs;

class ChooseTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loading: false,
            refreshing: false,
            isEmpty: false,
            statusInfo:{
                'create': {
                    text: '未开始',
                    value: [5, 4, 6]
                },
                'confirm': {
                    text: '等待中',
                    value: [3, 4, 6]
                },
                'wating': {
                    text: '等待中',
                    value: [3, 4, 6]
                },
                'doing': {
                    text: '正在打印',
                    value: [3, 4, 6]
                },
                'success': {
                    text: '打印成功',
                    value: [1, 2, 6]
                },
                'fail': {
                    text: '打印失败',
                    value: [1, 2, 6]
                },
                'cancel': {
                    text: '已取消',
                    value: [1, 2, 6]
                }
            },
            menuList: [{
                value: 1,
                text: '重新打印'
            }, {
                value: 2,
                text: '删除任务'
            }, {
                value: 3,
                text: '查看任务'
            }, {
                value: 4,
                text: '取消任务'
            }, {
                value: 5,
                text: '扫码指定打印机'
            }, {
                value: 6,
                text: '取消'
            }],
            printer:{
                sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
                name: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerName : '',
                status: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? ((JSON.parse(localStorage.getItem('printer')).workStatus == 'error') ? 0 : (JSON.parse(localStorage.getItem('printer')).onlineStatus == '1' ? 1 : 2)) : ''
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
            },
            fileList: [],
            fileItemData:{},
            layerView: false,
            layerViewData:[],
            redirect: {
                previewNav: false,
                manageNav: false,
                printTask: false
            }
        };
    }

    componentWillMount(){
        deli.common.navigation.setTitle({
            "title": "打印任务"
        }, function(data) {}, function(resp) {});

        deli.common.navigation.setRight({
            "text":"",
            "icon": ""
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
            localStorage.removeItem('printer')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('printerCurrent')
            localStorage.removeItem('printerList')
            localStorage.removeItem('chooseTaskInfo')
            localStorage.removeItem('printData')
            localStorage.removeItem('previewSetupData')
        }, function (resp) { });
    }

    componentDidMount(){}

    onLoad(){}

    //监听Tasker变化状态
    transFiler(filer) {
        this.setState(filer);
    }

    //获取打印机信息
    getPrinterData(sn, callback) {
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
                        localStorage.removeItem('printer')
                        localStorage.setItem('printer', (resp1.data.hasPermissions == true ? JSON.stringify(resp1.data) : undefined))
                        self.setState({ printer: resp1.data }, function () {})
                        if (typeof callback === 'function') {
                            callback(resp1.data);
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
                                    localStorage.setItem('printer', JSON.stringify(resp1.data))
                                    self.setState({ printer: resp1.data }, function () {})
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

    //重新打印
    handleprintTask(item) {
        if (item.whetherAgainPrint){
            const self = this
            self.setState({ layerView: false });
            let fileList = item.fileList;
            //let index = fileList.findIndex(element => element.taskCode === item.taskCode)
            //单个文件处理
            let mixFileList = [];
            for (let i = 0; i < fileList.length; i++) {
                const inner = {
                    'id': fileList[i].fileId,
                    'printMd5': fileList[i].printMd5,
                    'fileSuffix': fileList[i].fileSuffix,
                    'fileName': fileList[i].fileName,
                    'printUrl': fileList[i].printUrl,
                    'totalPage': fileList[i].totalPage,
                    'fileSource': fileList[i].fileSource
                }
                if (fileList.length > 1 || (fileList.length == 1 && fileList[0].fileSuffix != 'pdf')) {
                    inner.printPDF = false,
                        inner.previewUrl = (convertURL + '/file/preview/' + fileList[i].fileId + '_' + (i + 1) + '_' + Math.round((560 / 750) * document.documentElement.clientWidth / (window.devicePixelRatio || 1)) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight / (window.devicePixelRatio || 1)) + '')
                } else {
                    inner.printPDF = true
                }
                mixFileList.push(inner)
            }
            let tmpPrintData = objectAssign({}, self.state.printData, {
                'taskSource': item.taskSource,
                'printEndPage': item.printEndPage,
                'copyCount': item.copyCount,
                'printStartPage': item.printStartPage
            })
            localStorage.removeItem('printPreviewData')
            localStorage.setItem('printPreviewData', JSON.stringify(mixFileList))
            self.setState({ layerView: false, redirect: { previewNav: true }, printer: { sn: item.printerSn, name: item.printerName, status: 1 }, fileType: (fileList.length > 1 || (fileList.length == 1 && fileList[0].fileSuffix != 'pdf')) ? 'image' : 'file', fileList: mixFileList }, function () {
                Cookies.save('printPreviewType', self.state.fileType, { path: '/' })
                localStorage.removeItem('printPreviewFrom');
                localStorage.setItem('printPreviewFrom', 'printtask');
                localStorage.removeItem('printData');
                localStorage.setItem('printData', JSON.stringify(tmpPrintData));
                if (deli.ios == 'IOS') {
                    deli.common.notification.hidePreloader();
                } else {
                    setTimeout(() => {
                        deli.common.notification.hidePreloader();
                    }, 500);
                }
            });
        }else{
            deli.common.notification.toast({
                "text": item.tips,
                "duration": 2
            }, function (data) { }, function (resp) { });
        }
    }

    //删除任务
    handleDeleteTask(item) {
        const self = this
        self.setState({ layerView: false });
        let delData = new FormData()
        delData.append('id', item.id)
        fetch(mpURL + '/app/printerTask/delete', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: delData
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
                        let fileList = self.state.fileList
                        let index = fileList.findIndex(element => element.taskCode === item.taskCode)
                        fileList.splice(index, 1)
                        self.setState({
                            fileList: fileList,
                            layerView: false,
                            isEmpty: (fileList.length == 0) ? true : false
                        }, function () {
                            deli.common.notification.prompt({
                                "type": 'success',
                                "text": "删除任务成功",
                                "duration": 2
                            }, function (data) { }, function (resp) { });
                        })
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": data.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
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

    //查询任务详情
    handleQueryTask(item) {
        const self = this
        self.setState({ layerView: false});
        fetch(mpURL + '/app/printerTask/queryDetais/' + item.taskCode, {
            method: 'GET',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    if (data.code == 0 ) {
                        self.setState({ printer: { sn: data.data.printerSn, name: item.printerName, status: 1 }, redirect: { manageNav: true } });
                    } else {
                        deli.common.notification.toast({
                            "text": '网络错误，请重试',
                            "duration": 2
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

    //取消任务
    handleCancelTask(item) {
        const self = this
        self.setState({ layerView: false });
        fetch(mpURL + '/app/printerTask/cancel/' + item.taskCode, {
            method: 'GET',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    if (data.code == 0) {
                        let fileList = self.state.fileList
                        let index = fileList.findIndex(element => element.taskCode === item.taskCode)
                        fileList[index].task_status = 'cancel'
                        self.setState({
                            fileList: fileList,
                            layerView: false
                        }, function(){
                            let fileListInner = self.state.fileList
                            let indexInner = fileList.findIndex(element => element.taskCode === item.taskCode)
                            fileListInner[indexInner].taskStatus = 'cancel'
                            self.setState({
                                fileList: fileListInner,
                                layerView: false
                            }, function(){
                                deli.common.notification.prompt({
                                    "type": 'success',
                                    "text": '取消成功',
                                    "duration": 1.5
                                }, function (data) {}, function (resp) {});
                            })
                        })
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": data.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
        });
    }
    
    //扫码指定打印机
    handleQrcodeTask(item) {
        const self = this
        self.setState({ layerView: false });
        deli.app.code.scan({
            type: 'qrcode',
            app_id: Cookies.load('appId'),
            direct: true
        }, function (data) {
            if(data){
                let qrData = new FormData()
                qrData.append('qrCode', data.text)
                //处理扫码结果
                fetch(mpURL + '/app/printerTask/scanQrCode', {
                    method: 'POST',
                    timeout: 60000,
                    headers: {
                        "MP_TOKEN": Cookies.load('token')
                    },
                    body: qrData
                }).then(
                    function (response) {
                        if (response.status !== 200) {
                            deli.common.notification.toast({
                                "text": '网络错误，请重试',
                                "duration": 2
                            }, function (data) {}, function (resp) {});
                            return;
                        }
                        response.json().then(function (json) {
                            if (json.code == 0) {
                                //扫码切换至该打印机
                                self.getPrinterData(json.data.printerSn, function(respPrinter){
                                    if (item && item.whetherAgainPrint == false){
                                        //虚拟打印直接打印
                                        let tmpPrintData = objectAssign({}, self.state.printData, {
                                            'printerSn': json.data.printerSn
                                        })
                                        //任务设置打印机 /v1/app/printTask/taskToPrinter/
                                        fetch(mpURL + '/v1/app/printTask/taskToPrinter/' + item.taskCode + '', {
                                            method: 'POST',
                                            timeout: 60000,
                                            headers: {
                                                "Content-Type": "application/json",
                                                "MP_TOKEN": Cookies.load('token')
                                            },
                                            body: JSON.stringify(tmpPrintData)
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
                                                        self.setState({ layerView: false, redirect: { printTask: true } });
                                                    } else {
                                                        deli.common.notification.prompt({
                                                            "type": 'warning',
                                                            "text": data.msg,
                                                            "duration": 2
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
                                    }else{
                                        //扫码打印跳转至打印预览界面
                                        self.handleprintTask(item);
                                    }
                                });
                            } else {
                                deli.common.notification.prompt({
                                    "type": 'warning',
                                    "text": json.msg,
                                    "duration": 2
                                }, function (data) {}, function (resp) {});
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
        }, function (resp) {});
    }

    onLoad() {}

    //打印菜单
    handleLayerClick(value, file) {
        const self = this
        switch (value) {
            case 1:
                self.handleprintTask(file);
                break;
            case 2:
                deli.common.modal.show({
                    "type": "confirm",
                    "title": "确认删除",
                    "content": "是否删除该打印任务? "
                }, function (data) {
                    if (data.confirm == true || data.confirm == 1){
                        self.handleDeleteTask(file);
                    }
                }, function (resp) {});
                break;
            case 3:
                self.handleQueryTask(file);
                break;
            case 4:
                deli.common.modal.show({
                    "type": "confirm",
                    "title": "确认取消",
                    "content": "是否取消该打印任务? "
                }, function (data) {
                    if (data.confirm == true || data.confirm == 1) {
                        self.handleCancelTask(file);
                    }
                }, function (resp) {});
                break;
            case 5:
                self.handleQrcodeTask(file);
                break;
            case 6:
                self.setState({ layerView: false });
                break;
            default:
                self.setState({ layerView: false });
                break;
        }
    }

    // 显示菜单
    renderlayerItems(viewData, fileData) {
        const pages = this.state.menuList;
        const result = [];
        for (let j = 0; j < viewData.length; j++) {
            for (let i = 0; i < pages.length; i++) {
                if (pages[i].value == viewData[j]) {
                    let valueItem = pages[i].value;
                    let textItem = pages[i].text;
                    result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, valueItem, fileData)}>{textItem}</div>);
                }
            }
        }
        return result;
    }

    // layerView
    handlePropClick(e) {
        e.stopPropagation();
        this.setState({ layerView: false });
    }

    render() {
        //虚拟打印进入打印机任务列表
        if (this.state.redirect.printTask) {
            const sn = this.state.printer.printerSn
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == '1' ? 1 : 2))
            const name = this.state.printer.printerName
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&status=" + status + "&name=" + name + "", state: { "sn": sn, "status": status, "name": name } }
            } />;
        }

        if (this.state.redirect.manageNav) {
            const file = {
                fileId: this.state.fileItemData.id,
                fileUrl: this.state.fileItemData.pdfUrl,
                fileName: this.state.fileItemData.sourceName,
                fileExt: this.state.fileItemData.fileType
            }
            const sn = this.state.printer.sn
            const name = this.state.printer.name
            const status = this.state.printer.status
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&name=" + name + "&status=" + status +"", state: { "sn": sn, "file": file }  }
            }/>;
        }

        if(this.state.redirect.previewNav){
            const file = {
                fileId: this.state.fileItemData.id,
                fileUrl: this.state.fileItemData.pdfUrl,
                fileName: this.state.fileItemData.sourceName,
                fileExt: this.state.fileItemData.fileType
            }
            const sn = this.state.printer.sn
            const name = this.state.printer.name
            const status = this.state.printer.status
            const fileList = this.state.fileList
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "", state: { "sn": sn, "file": file, "fileList": fileList } }
            } />;
        }

        let fileListDom;
        if(this.state.isEmpty == true){
            fileListDom = <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>;
        }else{
            fileListDom = <FileList isEmpty={this.state.isEmpty} pages={this.state.page} files={this.state.fileList} printer={this.state.printer} transFiler={filer => this.transFiler(filer)}></FileList>;
        }

        return (
            <div className="print-index-task print-list" id="print-index-task">
                { fileListDom }
                <Layer className="layer-blank" bottom="0" zIndex={888} visible={this.state.layerView} onClick={this.handlePropClick.bind(this)}  maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.fileItemData)}
                </Layer>
            </div>);
        
    }
}

export default ChooseTask;