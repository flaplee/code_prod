import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import TaskItem from './TaskItem'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Print.scss'
import Utils from '../../util/js/util.js';
const { HBox, Box } = Boxs;

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            printer: props.printer,
            page: props.pages,
            form: props.forms,
            loading: false,
            isEmpty: false,
            noMore: false, 
            force: true,
            taskList: [],
            taskLast: false
        };
    }

    //监听transTaskerList变化状态
    transTaskerList(tasker) {
        tasker.taskList = this.state.taskList
        tasker.taskLast = this.state.taskLast
        this.props.transTasker(tasker)
    }

    //获取列表数据
    getListPage(data) {
        const self = this
        self.setState({ loading: false });
        //deli.common.notification.showPreloader();
        let appData = new FormData();
        appData.append('pageNo', data.pageNo);
        appData.append('pageSize', data.pageLimit);
        appData.append('printerSn', data.sn);
        //分页查询打印机任务列表
        fetch(mpURL + '/app/printerTask/queryPage', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    self.setState({ loading: false});
                    //deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) {}, function (resp) {});
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        /* setTimeout(() => {
                            deli.common.notification.hidePreloader();
                        }, 500); */
                        let taskLastOne = false
                        if (self.state.form == 'preview' && json.data.total == 0) {
                            taskLastOne = true
                            self.transTaskerList({
                                'taskList': (data.pageNo == 1 && json.data.total == 0) ? [] : ((json.data.total > 0) ? self.state.taskList : []),
                                'taskLast': true
                            })
                        } else {
                            taskLastOne = false
                        }
                        if(data.pageNo == 1 && json.data.total == 0){
                            self.setState({
                                taskLast: taskLastOne,
                                taskList: [],
                                isEmpty: true,
                                loading: false,
                                force: false
                            }, function () {})
                        }else{
                            if (json.data.total > 0) {
                                let rows = self.state.taskList
                                self.setState({
                                    taskLast: taskLastOne,
                                    loading: false,
                                    page: self.state.page + 1,
                                    force: (json.data.total > (data.pageLimit * data.pageNo)) ? true : false,
                                    noMore: ((data.pageNo != 1 && json.data.rows && json.data.rows.length == data.pageLimit) ? true : false),
                                    taskList: rows.concat(json.data.rows)
                                }, function() {})
                            } else {
                                self.setState({
                                    taskLast: taskLastOne,
                                    loading: false,
                                    force: false,
                                    noMore: true
                                }, function() {})
                            }
                        }
                        if (Utils.timer.printListTimer) { Utils.stopGetPrinterInfo(Utils.timer.printListTimer) }
                        //开始打印机任务列表轮询
                        Utils.startGetPrinterInfo({
                            page: 1,
                            limit: data.pageLimit * data.pageNo,
                            token: Cookies.load('token'),
                            sn: data.sn,
                            error: function () {
                                self.setState({ loading: false });
                                /* setTimeout(() => {
                                    deli.common.notification.hidePreloader();
                                }, 500); */
                                deli.common.notification.toast({
                                    "text": '网络错误，请重试',
                                    "duration": 2
                                }, function (data) { }, function (resp) { });
                            },
                            success: function (json) {
                                /* setTimeout(() => {
                                    deli.common.notification.hidePreloader();
                                }, 500); */
                                if (json.code == 0) {
                                    let taskLastOneInner = false
                                    if (self.state.form == 'preview' && json.data.total == 0) {
                                        taskLastOneInner = true
                                        self.transTaskerList({
                                            'taskList': (data.pageNo == 1 && json.data.total == 0) ? [] : ((json.data.total > 0) ? self.state.taskList : []),
                                            'taskLast': true
                                        })
                                    } else {
                                        taskLastOneInner = false
                                    }
                                    if (data.pageNo == 1 && json.data.total == 0) {
                                        self.setState({
                                            taskLast: taskLastOneInner,
                                            taskList: [],
                                            isEmpty: true,
                                            loading: false,
                                            force: false
                                        }, function () { })
                                    } else {
                                        if (json.data.total > 0) {
                                            let rows = []
                                            self.setState({
                                                taskLast: taskLastOneInner,
                                                loading: false,
                                                page: self.state.page + 1,
                                                force: (json.data.total > (data.pageLimit * data.pageNo)) ? true : false,
                                                noMore: ((data.pageNo != 1 && json.data.rows && json.data.rows.length == data.pageLimit) ? true : false),
                                                taskList: rows.concat(json.data.rows)
                                            }, function () { })
                                        } else {
                                            self.setState({
                                                taskLast: taskLastOneInner,
                                                loading: false,
                                                force: false,
                                                noMore: true
                                            }, function () { })
                                        }
                                    }
                                } else {
                                    self.setState({ loading: false });
                                    deli.common.notification.toast({
                                        "text": '网络错误，请重试',
                                        "duration": 2
                                    }, function (data) { }, function (resp) { });
                                }
                            }
                        }, 'printerlist');
                    }else{
                        self.setState({ loading: false });
                        //deli.common.notification.hidePreloader();
                        deli.common.notification.toast({
                            "text": '网络错误，请重试',
                            "duration": 2
                        }, function (data) { }, function (resp) { });
                        //结束打印机信息状态轮询
                        if (Utils.timer.printListTimer) { Utils.stopGetPrinterInfo(Utils.timer.printListTimer) }
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ loading: false});
            //deli.common.notification.hidePreloader();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    onLoad() {
        if(this.state.force == true){
            const curr = this.state.page;
            this.getListPage({ pageNo: curr, pageLimit: 100, sn: this.state.printer.sn })
        }
    }

    render() {
        if (this.state.isEmpty == true){
            return (
                <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>
            );
        }else{
            let taskItems, taskItemEmpty;
            if (this.state.taskList) {
                taskItems = this.state.taskList.map((task, index) => {
                    return (
                        <TaskItem key={task.taskCode + index} index={index + 1} task={task} transTaskerList={tasker => this.transTaskerList(tasker)} />
                    );
                });
            }
            return (
                <ScrollView
                    infiniteScroll={true}
                    infiniteScrollOptions={{
                        loading: this.state.loading,
                        onLoad: this.onLoad.bind(this),
                    }}
                    className='scroll-view-demo'
                >
                    { taskItems }
                    <div className="task-list-more" style={{ display: (this.state.noMore == true) ? 'block' : 'none' }}><p>没有更多了</p></div>
                </ScrollView>
            );
        }
    }
}

export default TaskList;