import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import TaskList from './TaskList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Print.scss';
// 引入路由
import { History, createHashHistory } from "history";
import Utils from '../../util/js/util.js';
const { HBox, Box } = Boxs;

class ManageTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printer:{
                sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
                name: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerName : '',
                status: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? ((JSON.parse(localStorage.getItem('printer')).workStatus == 'error') ? 0 : (JSON.parse(localStorage.getItem('printer')).onlineStatus == '1' ? 1 : 2)) : ''
            },
            urlFrom: (new URLSearchParams(props.location.search)).get('from') || '',
            page: 1,
            loading: false,
            refreshing: false,
            isEmpty: false,
            statusInfo: {},
            menuList: [{
                value: 1,
                text: '取消打印'
            }, {
                value: 2,
                text: '取消'
            }],
            taskList: [],
            taskLast: false,
            taskItemData: {},
            layerView: false,
            layerViewData: [],
            redirect: {
                previewNav: false,
                previewBack: false
            },
            timer: 0
        };
    }
    
    onLoad() {}

    componentWillMount() {};
    
    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "打印机任务列表"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) {}, function (resp) {});

        // 返回
        deli.common.navigation.goBack({}, function (data) {
            localStorage.removeItem('printDataChg')
            localStorage.setItem('printDataChg', true)
            if (Utils.timer.printListTimer) { Utils.stopGetPrinterInfo(Utils.timer.printListTimer) }
        }, function (resp) {});

        // 关闭
        deli.common.navigation.close({}, function (data) {
            //this.stopPrinterPoll(this.state.timer)
            if (Utils.timer.printListTimer) { Utils.stopGetPrinterInfo(Utils.timer.printListTimer) }
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
            Cookies.remove('admin');
            localStorage.removeItem('printer')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('chooseTaskInfo')
        }, function (resp) {});
        
        //this.startPrinterPoll(this.state.printer.sn)
    };

    //开启轮询打印机状态
    startPrinterPoll(sn){
        const timer = setInterval(() => {
            this.getPrinterData(sn);
        }, 5000);
        this.setState({ timer: timer})
    }

    //关闭轮询打印机状态
    stopPrinterPoll(timer){
        clearInterval(timer)
    }

    //获取打印机数据
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
                    return;
                }
                response.json().then(function (data) {
                    if (data.code == 0) {
                        if (self.state.printer.sn != data.data.printerSn || self.state.printer.name != data.data.printerName || self.state.printer.status == data.data.onlineStatus){
                            self.setState({printer: {sn: data.data.printerSn, name: data.data.printerName, status: data.data.onlineStatus}}, function () {})
                        }
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

    //取消打印
    handleCancelTask(item) {
        const self = this
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
                        let taskList
                        let taskLast
                        taskList = self.state.taskList
                        taskLast = self.state.taskList
                        let index = taskList.findIndex(element => element.taskCode === item.taskCode)
                        taskList.splice(index, 1)
                        self.setState({
                            taskList: taskList,
                            layerView: false,
                            redirect: {
                                previewBack: (taskList.length == 0 && self.state.urlFrom == 'preview') ? true : false
                            },
                            isEmpty: (taskList.length == 0) ? true : false
                        }, function () {
                            deli.common.notification.prompt({
                                "type": 'success',
                                "text": "取消成功",
                                "duration": 1.5
                            }, function (data) {}, function (resp) {});
                            if (taskLast.length == 0 && self.state.urlFrom == 'preview') {
                                setTimeout(() => {
                                    self.setState({
                                        redirect: {
                                            previewBack: true
                                        }
                                    });
                                }, 2000);
                            }
                        })
                    } else {
                        self.setState({ layerView: false });
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": data.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ layerView: false });
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    //监听Tasker变化状态
    transTasker(tasker) {
        this.setState(tasker);
    }

    //打印菜单
    handleLayerClick(value, task) {
        const self = this
        switch (value) {
            case 1:
                deli.common.modal.show({
                    "type": "confirm",
                    "title": "确认取消",
                    "content": "是否取消该打印任务? "
                }, function (data) {
                    if (data.confirm == true || data.confirm == 1) {
                        self.handleCancelTask(task);
                    }
                }, function (resp) {});
                break;
            case 2:
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
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            result.push(<div key={`page-${i}`} className="setting-item setting-item-double" onClick={this.handleLayerClick.bind(this, valueItem, taskData)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        if (this.state.redirect.previewNav) {
            //this.stopPrinterPoll(this.state.timer)
            return <Redirect push to="/previewindex" />;
        }

        const hashHistory = createHashHistory()
        if (this.state.redirect.previewBack){
            //this.stopPrinterPoll(this.state.timer)
            hashHistory.goBack();
        }

        //最后一个我的任务打印完成返回预览页面
        if (this.state.taskLast){
            //this.stopPrinterPoll(this.state.timer)
            hashHistory.goBack();
        }
        
        let taskListDom;
        if(this.state.isEmpty == true){
            taskListDom = <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>;
        }else{
            taskListDom = <TaskList pages={this.state.page} tasks={this.state.taskList} forms={this.state.urlFrom} printer={this.state.printer} transTasker={tasker => this.transTasker(tasker)}></TaskList>;
        }
        return (
            <div className="print-task">
                <Group className="print-task-list task-print">
                    <Group.List lineIndent={15}>
                        <div>
                            <div className="print-list-wrap-single">
                                <HBox vAlign="center">
                                    <HBox flex={1}>
                                        <Box className="print-list-text-content-single" flex={1}>
                                            <p className="print-list-title-single">打印机</p>
                                        </Box>
                                        <Box className="print-list-text-content-info">
                                            <div className="print-list-title-single print-list-title-single-name"><span className={(this.state.printer.status == 0 ? 'print-status-error print-list-title-single-text' : (this.state.printer.status == 1 ? 'print-status-success print-list-title-single-text' : 'print-status-offline print-list-title-single-text'))}>{this.state.printer.name}</span></div>
                                        </Box>
                                    </HBox>
                                </HBox>
                            </div>
                        </div>
                    </Group.List>
                    <Group.Head className="task-title">打印列表</Group.Head>
                    <Group.List className="task-list" lineIndent={15}>
                        { taskListDom }
                    </Group.List>
                </Group>
                <Layer className="layer-blank" bottom="0" visible={this.state.layerView} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.taskItemData)}
                </Layer>
            </div>);
    }
}

export default ManageTask;