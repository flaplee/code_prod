import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui'
import Icon from 'salt-icon'
import FileList from './FileList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index'

const { HBox, Box } = Boxs;

class PrintTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            loading: false,
            refreshing: false,
            statusInfo:{
                10: {
                    text: '未开始',
                    value:[5 , 4, 6]
                },
                20: {
                    text: '等待中',
                    value: [3, 4, 6]
                },
                30: {
                    text: '正在打印',
                    value: [3, 4, 6]
                },
                40: {
                    text: '打印成功',
                    value: [1, 2, 6]
                },
                41: {
                    text: '打印失败',
                    value: [1, 2, 6]
                } ,
                50: {
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
            fileList: [],
            fileItemData:{},
            layerView: false,
            layerViewData:[],
            redirect: {
                previewNav: false
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
    }

    componentDidMount(){
        
    }

    onLoad(){
    }

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
        fetch(mpURL + '/app/printerTask/restart/' + item.taskCode, {
            method: 'GET',
            headers: {
                token: Cookies.load('token')
            },
            body: {}
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("data", data)
                    if (data.code == 0 ) {
                        let fileList = self.state.fileList
                        let index = fileList.findIndex(element => element.taskCode === item.taskCode)
                            fileList[index].task_status = '20'
                        self.setState({
                            fileList: fileList,
                            layerView: false
                        }, function() {
                            console.log("self.state.fileList", self.state.fileList)
                            //self.renderListItems();
                        })
                    } else {
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
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
                token: Cookies.load('token')
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
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.prompt({
                "type": 'error',
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) {}, function (resp) {});
        });
    }

    //查询任务详情
    handleQueryTask(item) {
        console.log("查询任务详情~~~~~~~~~~~~")
        const self = this
        self.setState({ layerView: false, redirect: { previewNav: true } });
        fetch(mpURL + '/app/printerTask/queryDetais/' + item.taskCode, {
            method: 'GET',
            headers: {
                token: Cookies.load('token')
            },
            body: {}
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("data", data)
                    if (data.code == 0 ) {
                        self.setState({redirect: { previewNav: true } });
                    } else {

                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
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
                token: Cookies.load('token')
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
                            deli.common.notification.prompt({
                                "type": 'success',
                                "text": '取消成功',
                                "duration": 1.5
                            }, function (data) { }, function (resp) { });
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
            app_id: ''
        }, function (data) {
            let qrData = new FormData()
            qrData.append('qrcode', data.text)
            //处理扫码结果
            fetch(mpURL + '/app/printer/scan', {
                method: 'POST',
                headers: {
                    token: Cookies.load('token')
                },
                body: qrData
            }).then(
                function (response) {
                    if (response.status !== 200) {
                        return;
                    }
                    response.json().then(function (json) {
                        if (json.code == 0) {
                            let printerData = new FormData()
                            printerData.append('printerSn', json.data)
                            printerData.append('taskCode', item.taskCode)
                            //任务设置打印机 
                            fetch(mpURL + '/app/printerTask/setPrinterToPrint', {
                                method: 'GET',
                                headers: {
                                    token: Cookies.load('token')
                                },
                                body: printerData
                            }).then(
                                function (response) {
                                    if (response.status !== 200) {
                                        return;
                                    }
                                    response.json().then(function (data) {
                                        console.log("data", data)
                                        if (data.code == 0) {
                                            alert("正在打印~")
                                            self.setState({
                                                layerView: false
                                            })
                                        } else {
                                            deli.common.notification.prompt({
                                                "type": 'warning',
                                                "text": data.msg,
                                                "duration": 2
                                            },function(data){},function(resp){});
                                        }
                                    });
                                }
                            ).catch(function (err) {
                                console.log("错误:" + err);
                            });
                        } else {
                            
                        }
                    });
                }
            ).catch(function (err) {
                
                console.log("错误:" + err);
            });

        }, function (resp) {
            
        });
    }

    onLoad() {
    }

    //打印菜单
    handleLayerClick(value, file) {
        console.log("value", value);
        console.log("file", file);
        switch (value) {
            case 1:
                this.handleprintTask(file);
                break;
            case 2:
                this.handleDeleteTask(file);
                break;
            case 3:
                this.handleQueryTask(file);
                break;
            case 4:
                this.handleCancelTask(file);
                break;
            case 5:
                this.handleQrcodeTask(file);
                break;
            case 6:
                this.setState({ layerView: false });
                break;
            default:
                this.setState({ layerView: false });
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
        if (this.state.redirect.previewNav) {
            const file = {
                fileId: this.state.fileItemData.id,
                fileUrl: this.state.fileItemData.pdfUrl,
                fileName: this.state.fileItemData.sourceName,
                fileExt: this.state.fileItemData.fileType
            }
            const sn = this.state.fileItemData.printerSn
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "", state: { "sn": sn, "file": file }  }
            }/>;
        }
        return (
            <div className="print-index-task print-list" id="print-index-task">
                <FileList pages={this.state.page} files={this.state.fileList} transFiler={filer => this.transFiler(filer)}></FileList>
                <Layer bottom="0" visible={this.state.layerView} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.fileItemData)}
                </Layer>
            </div>);
    }
}


export default PrintTask;
