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
            printer: props.printer,
            page: props.pages,
            loading: false,
            isEmpty: false,
            noMore: false, 
            force: true,
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

    //获取列表数据
    getListPage(data) {
        console.log("data~~~~~~~~~~~~", data)
        const self = this
        self.setState({ loading: true });
        let pages = self.state.fileList;
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
                                fileList: [],
                                isEmpty: true,
                                loading: false,
                                force: false
                            }, function () {})
                        }else{
                            if(json.data.total > (data.pageLimit * data.pageNo)){
                                let rows = self.state.fileList
                                self.setState({
                                    fileList: rows.concat(json.data.rows),
                                    force: true
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
            self.setState({ loading: false });
        });
    }

    onLoad() {
        this.getListPage({ pageNo: this.state.page + 1, pageLimit: 12, sn: this.state.printer.sn })
        this.setState({ page: this.state.page + 1, loading: false }, function(){
            console.log("page", this.state.page)
            //this.getListPage({ pageNo: this.state.page, pageLimit: 12, sn: this.state.printer.sn })
        });
    }

    //加载元素
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
        let fileItems, fileItemEmpty;
        if (this.state.isEmpty == true){
            fileItemEmpty = <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>
        }else{
            console.log("this.props.fileList", this.state.fileList)
            fileItems = this.state.fileList.map((file, index) => {
                return (
                    <FileItem key={index} index={index} file={file} transFilerList={filer => this.transFilerList(filer)} />
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
                className={this.state.isEmpty == true ? 'scroll-view-empty' : 'scroll-view-demo'}
            >
                <Group className="list-item">
                    <Group.List lineIndent={15}>
                        {this.state.isEmpty == true ? fileItemEmpty : fileItems}
                        <div className="task-list-more" style={{ display: (this.state.noMore == true) ? 'block' : 'none' }}><p>没有更多了</p></div>
                    </Group.List>
                </Group>
            </ScrollView>
        );
    }
}

export default FileList;