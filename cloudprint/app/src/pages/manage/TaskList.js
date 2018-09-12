import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import TaskItem from './TaskItem'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'

import './Print.scss'

const { HBox, Box } = Boxs;

class TaskList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sn: props.sn,
            page: props.pages,
            loading: false,
            isEmpty: false,
            noMore: false, 
            force: true,
            taskList: []
        };
        console.log("tasklist props", props)
    }

    //监听transTaskerList变化状态
    transTaskerList(tasker) {
        console.log("tasker", tasker);
        this.props.transTasker(tasker)
    }

    //获取列表数据
    getListPage(data) {
        const self = this
        let pages = self.state.taskList
        let appData = new FormData();
        appData.append('pageNo', data.pageNo);
        appData.append('pageSize', data.pageLimit);
        appData.append('printerSn', data.sn);
        //分页查询打印机任务列表
        fetch(mpURL + '/app/printerTask/queryPage', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code === 0) {
                        self.setState({ loading: false });
                        if(data.pageNo == 1 && json.data.total == 0){
                            self.setState({
                                taskList: [],
                                isEmpty: true,
                                loading: false
                            }, function () {})
                        }else{
                            if(json.data.total > (data.pageLimit * data.pageNo)){
                                let rows = self.state.taskList
                                self.setState({
                                    taskList: rows.concat(json.data.rows)
                                }, function () {})
                            }else{
                                self.setState({
                                    force: false,
                                    noMore: true
                                }, function () {})
                            }
                        }
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    onLoad() {
        this.setState({ page: this.state.page + 1, loading: false }, function(){
            console.log("page", this.state.page)
            this.getListPage({ pageNo: this.state.page, pageLimit: 10, sn: this.state.sn })
        });
    }

    renderItems() {
        const { page } = this.state;
        const pages = [];
        console.log("page", page)
        for (let i = 0; i < page; i++) {
            pages.push(<div key={`page-${i}`}>
                <TaskItem />
            </div>);
        }

        return pages;
    }

    render() {
        let taskItems, taskItemEmpty;
        if (this.state.taskList) {
            console.log("this.props.taskList", this.state.taskList)
            taskItems = this.state.taskList.map((task, index) => {
                return (
                    <TaskItem key={task.taskCode + index} index={index + 1} task={task} transTaskerList={tasker => this.transTaskerList(tasker)} />
                );
            });
        }
        if (this.state.isEmpty == true){
            taskItemEmpty = <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>
        }else{
            console.log("this.props.taskList", this.state.taskList)
            taskItems = this.state.taskList.map((task, index) => {
                return (
                    <TaskItem key={task.taskCode + index} index={index + 1} task={task} transTaskerList={tasker => this.transTaskerList(tasker)} />
                );
            });
        }
        return (
            <ScrollView
                infiniteScroll={this.state.force}
                infiniteScrollOptions={{
                    loading: this.state.loading,
                    onLoad: this.onLoad.bind(this),
                }}
                className="scroll-view-demo"
            >
                {this.state.isEmpty == true ? taskItemEmpty : taskItems}
                <div className="task-list-more" style={{ display: (this.state.noMore == true) ? 'block' : 'none' }}><p>没有更多了</p></div>
            </ScrollView>
        );
    }
}

export default TaskList;