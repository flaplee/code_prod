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
            refreshing: false,
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
                        self.setState({
                            taskList: json.data.rows
                        }, function () {
                            console.log("taskList~~~")
                        })
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    onLoad() {
        this.setState({ loading: true });
        this.getListPage({pageNo : this.state.page, pageLimit: 10, sn: this.state.sn})
    }

    onRefresh(){
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
        let taskItems;
        if (this.state.taskList) {
            console.log("this.props.taskList", this.state.taskList)
            taskItems = this.state.taskList.map((task, index) => {
                return (
                    <TaskItem key={task.taskCode + index} index={index + 1} task={task} transTaskerList={tasker => this.transTaskerList(tasker)} />
                );
            });
        }
        return (
            <ScrollView
                infiniteScroll
                refreshControl
                refreshControlOptions={{
                    refreshing: this.state.refreshing,
                    onRefresh: this.onRefresh.bind(this),
                }}

                infiniteScrollOptions={{
                    loading: this.state.loading,
                    onLoad: this.onLoad.bind(this),
                }}
                className="scroll-view-demo"
            >
                {taskItems}
            </ScrollView>
        );
    }
}

export default TaskList;