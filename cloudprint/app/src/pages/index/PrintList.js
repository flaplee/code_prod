import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { ScrollList, Icon } from 'saltui';
import './Index.scss';
import printimg from '../../images/L1000DNW@3x.png'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
// 引入路由
import { History, createHashHistory } from "history";

class PrintList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataGetted: false,
            printList: props.location.state.printList,
            sn: "",
            hasError: false,
            pageSize: 10,
            currentPage: 1,
            loading: false,
            refreshing: false,
            redirectIndexNav: false,
            printerCurrent: (new URLSearchParams(props.location.search)).get('printercurrent') || Cookies.load('printercurrent') || 0
        };
    }

    componentDidMount(){
        this.setState({
            loading: false
        })
        
        deli.common.navigation.setTitle({
            "title": "选择打印机"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": "",
            "icon": ""
        }, function (data) { }, function (resp) { });

        // 关闭
        deli.common.navigation.close({}, function (data) {
            // 重置
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
            Cookies.remove('admin');
        }, function (resp) {});
    };

    componentWillUnmount(){
        console.log("componentWillUnmount")
    }

    onRefresh() {
    }

    onLoad() {
        const curr = this.state.currentPage;
        this.setState({ loading: true });
        this.getPrinterList({
            'page': curr,
            'limit': this.state.pageSize
        });
    }

    handlePrinterClick(props){
        const self = this
        self.setState({ redirectIndexNav: true, sn: props.printerSn, printerCurrent: props.index}, function(){})
    }

    //获取打印机列表
    getPrinterList(data){
        const self = this
        let formData = new FormData();
        formData.append('pageNo', data.page);
        formData.append('pageSize', data.limit);
        //打印机列表
        fetch(mpURL + '/app/printer/queryPage', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: formData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.prompt({
                        "type": 'error',
                        "text": "网络错误,请重试",
                        "duration": 1.5
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    deli.common.notification.hidePreloader();
                    if (json.code == 0) {
                        const items = json.data.rows;
                        const hasNoMore = (items.length == 0) || items.length < self.state.pageSize;
                        if (hasNoMore){
                            self.setState({
                                loading: false,
                                dataGetted: true,
                                data: self.state.data.concat(items),
                                currentPage: data.curr + 1,
                                noMore: true,
                                hasError: false,
                                printerCurrent: self.state.printerCurrent
                            });
                        }else{
                            self.setState({
                                loading: false,
                                dataGetted: true,
                                noMore: false,
                                hasError: true,
                            });
                        }
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.hidePreloader();
            deli.common.notification.prompt({
                "type": 'error',
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) {}, function (resp) {});
        });
    }

    render() {
        const hashHistory = createHashHistory()
        if(this.state.redirectIndexNav){
            const sn = this.state.sn
            const printercurrent = this.state.printerCurrent
            Cookies.save('sn', sn)
            Cookies.save('printercurrent', printercurrent)
            hashHistory.goBack();
        }
        const Item = (props) =>
            <a className={(props.index == this.state.printerCurrent ? "list-item current" :"list-item")} href="javascript:;" onClick={this.handlePrinterClick.bind(this, props)}>
                <div className="list-item-wrap">
                    <div className="list-item-info">
                        <div className="info-img">
                            <img src={printimg} />
                        </div>
                        <div className="info-text">
                            <div className="title">{` ${props.printerName}`}</div>
                            <p className="title-sub">sn:{` ${props.printerSn}`}</p>
                        </div>
                    </div>
                    <div className={(props.workStatus == 'error' ? 'list-item-status status-fault' : (props.onlineStatus == 1 ? 'list-item-status status-online' : 'list-item-status status-offline'))}><span>{props.workStatus == 'error' ? '故障' : (props.onlineStatus == 1 ? '在线' : '离线')}</span></div>
                </div>
            </a>;
        return (<div className="print-list">
            <div className="container">
                <ScrollList
                    className="scroll-list-demo"
                    dataGetted={this.state.dataGetted}
                    data={this.state.data}
                    hasError={this.state.hasError}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}
                    loading={this.state.loading}
                    onLoad={this.onLoad.bind(this)}
                >
                    <Item />
                </ScrollList>
            </div>
        </div>);
    }
}

export default PrintList;