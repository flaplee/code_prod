import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui'
import Icon from 'salt-icon'
import FileList from './FileList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index.scss'

const { HBox, Box } = Boxs;

class ChooseTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            loading: false,
            refreshing: false,
            statusInfo:{
                'create': {
                    text: '未开始',
                    value: [5, 4, 6]
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
                sn: (new URLSearchParams(props.location.search)).get('sn') || '',
                name: (new URLSearchParams(props.location.search)).get('name') || '',
                status: (new URLSearchParams(props.location.search)).get('status') || '',
            },
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
            fileList: [],
            fileItemData:{},
            layerView: false,
            layerViewData:[],
            redirect: {
                previewNav: false,
                manageNav: false
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
        }, function (resp) { });
    }

    componentDidMount(){}

    onLoad(){}

    //监听Tasker变化状态
    transFiler(filer) {
        console.log("filer~~~", filer);
        this.setState(filer);
    }

    //重新打印
    handleprintTask(item) {
        console.log("重新打印~~~~~~~~~~~~")
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
            if (fileList.length > 1 || (fileList.length == 1 && fileList[0].fileSuffix != 'pdf')){
                inner.printPDF = false,
                inner.previewUrl = (convertURL + '/file/preview/' + fileList[i].fileId + '_' + (i + 1) + '_' + Math.round((560 / 750) * document.documentElement.clientWidth / window.dpr) + '_' + Math.round((790 / 1334) * document.documentElement.clientHeight / window.dpr) + '')
            }else{
                inner.printPDF = true
            }
            mixFileList.push(inner)
        }
        let tmpPrintData = Object.assign({}, self.state.printData, {
            'taskSource': item.taskSource,
            'printEndPage': item.printEndPage,
            'copyCount': item.copyCount,
            'printStartPage': item.printStartPage
        })
        localStorage.removeItem('printPreviewData')
        localStorage.setItem('printPreviewData', JSON.stringify(mixFileList))
        self.setState({ layerView: false, redirect: { previewNav: true }, printer: { sn: item.printerSn, name: item.printerName, status: 1 }, fileType: (fileList.length > 1 || (fileList.length == 1 && fileList[0].fileSuffix != 'pdf')) ? 'image' : 'file', fileList: mixFileList },function(){
            Cookies.save('printPreviewType', self.state.fileType, { path: '/' })
            Cookies.save('printData', tmpPrintData, { path: '/' });
            deli.common.notification.hidePreloader();
        });
    }

    //删除任务
    handleDeleteTask(item) {
        console.log("删除任务~~~~~~~~~~~~")
        const self = this
        self.setState({ layerView: false });
        let delData = new FormData()
        delData.append('id', item.id)
        fetch(mpURL + '/app/printerTask/delete', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: delData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("data", data)
                    if (data.code == 0) {
                        let fileList = self.state.fileList
                        let index = fileList.findIndex(element => element.taskCode === item.taskCode)
                        fileList.splice(index, 1)
                        self.setState({
                            fileList: fileList,
                            layerView: false
                        }, function(){
                            deli.common.notification.prompt({
                                "type": 'success',
                                "text": "删除任务成功",
                                "duration": 2
                            },function(data){},function(resp){});
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
        console.log("查询任务详情~~~~~~~~~~~~")
        const self = this
        self.setState({ layerView: false});
        fetch(mpURL + '/app/printerTask/queryDetais/' + item.taskCode, {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("~~~~~~~~~~data", data)
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
            console.log("错误:" + err);
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //取消任务
    handleCancelTask(item) {
        console.log("取消任务~~~~~~~~~~~~")
        const self = this
        self.setState({ layerView: false });
        fetch(mpURL + '/app/printerTask/cancel/' + item.taskCode, {
            method: 'GET',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("data", data)
                    if (data.code == 0) {
                        let fileList = self.state.fileList
                        let index = fileList.findIndex(element => element.taskCode === item.taskCode)
                        fileList[index].task_status = '50'
                        self.setState({
                            fileList: fileList,
                            layerView: false
                        }, function(){
                            console.log("self.state.fileList", self.state.fileList)
                            //self.renderListItems();
                            let fileListInner = self.state.fileList
                            let indexInner = fileList.findIndex(element => element.taskCode === item.taskCode)
                            console.log("fileList", fileListInner)
                            fileListInner[indexInner].taskStatus = 50
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
            console.log("错误:" + err);
        });
    }
    
    //扫码指定打印机
    handleQrcodeTask(item) {
        console.log("扫码指定打印机~~~~~~~~~~~~")
        const self = this
        self.setState({ layerView: false });
        deli.app.code.scan({
            type: 'qrcode',
            app_id: Cookies.load('appId'),
            direct: true
        }, function (data) {
            if(data){
                let qrData = new FormData()
                qrData.append('qrcode', data.text)
                //处理扫码结果
                fetch(mpURL + '/app/printer/scan', {
                    method: 'POST',
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
                            }, function (data) { }, function (resp) { });
                            return;
                        }
                        response.json().then(function (json) {
                            if (json.code == 0) {
                                let tmpPrintData = Object.assign({}, self.state.printData, {
                                    'printerSn': json.data
                                })
                                //任务设置打印机 /v1/app/printTask/taskToPrinter/
                                fetch(mpURL + '/v1/app/printTask/taskToPrinter/' + item.taskCode + '', {
                                    method: 'POST',
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
                                                self.setState({
                                                    layerView: false
                                                })
                                                deli.common.notification.prompt({
                                                    "type": 'success',
                                                    "text": '打印成功',
                                                    "duration": 2
                                                }, function (data) {}, function (resp) {});
                                            } else {
                                                deli.common.notification.prompt({
                                                    "type": 'warning',
                                                    "text": data.msg,
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
        console.log("value", value);
        console.log("file", file);
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
        console.log("data", viewData);
        console.log("pages", pages);
        for (let j = 0; j < viewData.length; j++) {
            for (let i = 0; i < pages.length; i++) {
                if (pages[i].value == viewData[j]) {
                    let valueItem = pages[i].value;
                    let textItem = pages[i].text;
                    console.log("valueItem", valueItem)
                    console.log("textItem", textItem)
                    result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, valueItem, fileData)}>{textItem}</div>);
                }
            }
        }
        return result;
    }

    render() {
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
                { pathname: "/previewindex", search: "?sn=" + sn + "&name=" + name + "&status=" + status + "", state: { "sn": sn, "file": file, "fileList": fileList } }
            } />;
        }
        return (
            <div className="print-index-task print-list" id="print-index-task">
                <FileList pages={this.state.page} files={this.state.fileList} printer={this.state.printer} transFiler={filer => this.transFiler(filer)}></FileList>
                <Layer bottom="0" visible={this.state.layerView} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.fileItemData)}
                </Layer>
            </div>);
    }
}

export default ChooseTask;