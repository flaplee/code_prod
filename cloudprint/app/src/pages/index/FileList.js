import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import FileItem from './FileItem'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index.scss';

const { HBox, Box } = Boxs;

class FileList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sn: props.sn,
            page: props.pages,
            loading: false,
            refreshing: false,
            fileList: []
        };
        console.log("fileList props", props)
    }

    //监听transFilerList变化状态
    transFilerList(filer) {
        console.log("filer", filer);
        filer.fileList = this.state.fileList
        this.props.transFiler(filer)
    }

    onRefresh() {
        this.setState({ refreshing: true });

        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 2000);
    }

    //获取列表数据
    getListPage(data) {
        const self = this
        let pages = self.state.fileList
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
                            fileList: json.data.rows
                        }, function () {
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
        /* setTimeout(() => {
            this.setState({ page: this.state.page + 1, loading: false });
        }, 2000); */
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
                <FileItem />
            </div>);
        }

        return pages;
    }

    render() {
        let fileItems;
        if (this.state.fileList) {
            console.log("this.props.fileList", this.state.fileList)
            fileItems = this.state.fileList.map((file, index) => {
                return (
                    <FileItem key={index} index={index} file={file} transFilerList={filer => this.transFilerList(filer)} />
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
                <Group className="list-item">
                    <Group.List lineIndent={15}>
                        {fileItems}
                    </Group.List>
                </Group>
            </ScrollView>
        );
    }
}

export default FileList;