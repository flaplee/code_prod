import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import TaskList from './TaskList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Print.scss';

const { HBox, Box } = Boxs;

class ManageTask extends Component {

    constructor(props) {
        super(props);
        this.state = {
            printer:{
                sn: (new URLSearchParams(props.location.search)).get('sn'),
                name: (new URLSearchParams(props.location.search)).get('name'),
                status: (new URLSearchParams(props.location.search)).get('status')
            },
            page: 0,
            loading: false,
            refreshing: false,
            statusInfo: {
            },
            menuList: [{
                value: 1,
                text: '取消打印'
            }, {
                value: 2,
                text: '取消'
            }],
            taskList: [],
            taskItemData: {},
            layerView: false,
            layerViewData: [],
            redirect: {
                previewNav: false
            },
            timer: 0
        };
    }
    
    onLoad() {
        /* this.setState({ loading: true });

        setTimeout(() => {
            this.setState({ page: this.state.page + 1, loading: false });
        }, 2000); */
    }

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
            this.stopPrinterPoll(this.state.timer);
        }, function (resp) {});

        // 关闭
        deli.common.navigation.close({}, function (data) {
           this.stopPrinterPoll(this.state.timer)
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
                    if (data.code === 0) {
                        if (self.state.printer.sn != data.data.printerSn || self.state.printer.name != data.data.printerName || self.state.printer.status == data.data.onlineStatus){
                            self.setState({ sn: data.data.printerSn, name: data.data.printerName, status: data.data.onlineStatus}, function () {})
                        }
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": "网络错误,请重试",
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
            }, function (data) { }, function (resp) { });
        });
    }

    //取消打印
    handleCancelTask(item) {
        console.log("取消打印~~~~~~~~~~~~")
        const self = this
        fetch(mpURL + '/app/printerTask/cancel/' + item.id, {
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
                        self.setState({
                            layerView: false
                        })
                        deli.common.notification.prompt({
                            "type": 'success',
                            "text": '取消成功',
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
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
            deli.common.notification.prompt({
                "type": 'error',
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
        });
    }

    //监听Tasker变化状态
    transTasker(tasker) {
        console.log("tasker~~~", tasker);
        this.setState(tasker);
    }

    //打印菜单
    handleLayerClick(value, task) {
        console.log("value", value);
        console.log("task", task);
        switch (value) {
            case 1:
                this.handleCancelTask(task);
                break;
            case 2:
                this.setState({ layerView: false });
                break;
            default:
                this.setState({ layerView: false });
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
        if (this.state.redirect.previewNav) {
            this.stopPrinterPoll(this.state.timer)
            return <Redirect push to="/previewindex" />;
        }
        return (
        <div className="print-task">
            <Group className="print-task-list">
                <Group.List lineIndent={15}>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single">打印机</p>
                                    </Box>
                                </HBox>
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                       <div className={(this.state.status == 0 ? 'print-img-status print-status-error' : (this.state.status == 1 ? 'print-img-status print-status-success' : 'print-img-status print-status-offline'))}></div>
                                    </Box>
                                    <Box>
                                        <div name="angle-right" width={20} fill="#ccc" className="print-list-name">
                                            <p className="print-list-title-single">{this.state.name}</p>
                                        </div>
                                    </Box>
                                </HBox>
                            </HBox>
                        </div>
                    </div>
                </Group.List>
                <Group.Head className="task-title">打印列表</Group.Head>
                <Group.List className="task-list" lineIndent={15}>
                    <TaskList pages={this.state.page} tasks={this.state.taskList} printer={this.state.printer} transTasker={tasker => this.transTasker(tasker)}></TaskList>
                </Group.List>
            </Group>
            <Layer bottom="0" visible={this.state.layerView} maskCloseable>
                {this.renderlayerItems(this.state.layerViewData, this.state.taskItemData)}
            </Layer>
        </div>);
    }
}

export default ManageTask;