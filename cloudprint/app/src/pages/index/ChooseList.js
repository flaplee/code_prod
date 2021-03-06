import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import ChooseItem from './ChooseItem'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index.scss';

const { HBox, Box } = Boxs;

class ChooseList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            printer: props.printer || JSON.parse(localStorage.getItem('printer')),
            page: props.pages || 1,
            loading: false,
            isEmpty: false,
            noMore: false,
            force: true,
            printTaskInfo: props.files || [],
            fileList: []
        };
    }

    //监听transFilerList变化状态
    transFilerList(filer) {
        this.props.transFiler(filer)
    }

    //获取列表数据
    getListPage(data) {
        const self = this
        self.setState({ loading: false });
        //deli.common.notification.showPreloader();
        let pages = self.state.fileList;
        let appData = new FormData();
        appData.append('pageNo', data.pageNo);
        appData.append('pageSize', data.pageLimit);
        appData.append('printerSn', data.sn);
        //分页查询打印机任务列表
        fetch(mpURL + '/app/printerTask/queryMyPage', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    self.setState({ loading: false });
                    //deli.common.notification.hidePreloader();
                    deli.common.notification.toast({
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    //deli.common.notification.hidePreloader();
                    if (json.code == 0) {
                        self.setState({ loading: false });
                        if(data.pageNo == 1 && json.data.total == 0){
                            self.setState({
                                fileList: [],
                                isEmpty: true,
                                loading: false,
                                force: false
                            }, function () {})
                        }else{
                            if (json.data.total > 0){
                                let rows = self.state.fileList
                                self.setState({
                                    fileList: rows.concat(json.data.rows),
                                    force: (json.data.total > (data.pageLimit * data.pageNo)) ? true : false,
                                    noMore: ((data.pageNo == 1) ? false : true),
                                }, function () {})
                            }else{
                                self.setState({
                                    force: false,
                                    noMore: true
                                }, function () { })
                            }
                        }
                    }else{
                        deli.common.notification.toast({
                            "text": json.msg,
                            "duration": 2
                        }, function (data) { }, function (resp) { });
                        self.setState({
                            fileList: [],
                            isEmpty: (data.pageNo == 1) ? true : false,
                            loading: false,
                            force: false
                        }, function () {})
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ loading: false });
            //deli.common.notification.hidePreloader();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) {}, function (resp) {});
        });
    }

    onLoad() {
        //this.getListPage({ pageNo: this.state.page + 1, pageLimit: 12, sn: this.state.printer.sn })
        /* this.setState({ page: this.state.page + 1, loading: false }, function(){
            //this.getListPage({ pageNo: this.state.page, pageLimit: 12, sn: this.state.printer.sn })
        }); */
    }

    render() {
        if (this.state.isEmpty == true){
            return (<div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>);
        }else{
            const files = this.state.printTaskInfo
            let fileItems = files.map((file, index) => {
                return (
                    <ChooseItem key={index} index={index} file={file} transFilerList={filer => this.transFilerList(filer)} />
                );
            });
            return (
                <ScrollView
                    infiniteScroll={this.state.force}
                    infiniteScrollOptions={{
                        loading: this.state.loading,
                        onLoad: this.onLoad.bind(this),
                    }}
                    className='scroll-view-demo'
                >
                    <Group className="list-item">
                        <Group.List lineIndent={15}>
                            {fileItems}
                            <div className="task-list-more" style={{ display: (this.state.noMore == true) ? 'block' : 'none' }}><p>没有更多了</p></div>
                        </Group.List>
                    </Group>
                </ScrollView>
            );
        }
    }
}

export default ChooseList;