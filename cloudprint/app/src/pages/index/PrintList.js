import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { ScrollList, Icon } from 'saltui';
import './Index.scss';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
// 引入路由
import { History, createHashHistory } from "history";
import Utils from '../../util/js/util.js';

class PrintList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataGetted: false,
            sn: "",
            hasError: false,
            pageSize: 50,
            currentPage: 1,
            loading: false,
            force: false,
            redirectIndexNav: false,
            printer: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')) : undefined,
            printerCurrent: localStorage.getItem('printerCurrent') || 0 
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
            localStorage.removeItem('printer')
            localStorage.removeItem('printerCurrent')
            localStorage.removeItem('printerList')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('chooseTaskInfo')
        }, function (resp) {});
        const currentPage = this.state.currentPage
        const currentSize = this.state.pageSize
        const force = this.state.force
        if (currentPage == 1 && force  == false){
            this.getPrinterList({ page: currentPage, limit: currentSize })
        }
    };

    componentWillMount() {}

    componentWillUnmount(){}

    onLoad() {
        if (this.state.force == true) {
            const curr = this.state.currentPage;
            this.getPrinterList({ page: curr, limit: this.state.pageSize})
        }
    }

    handlePrinterClick(props){
        const self = this
        if (Utils.timer.printerTimer) { Utils.stopGetPrinterInfo(Utils.timer.printerTimer) }
        localStorage.removeItem('printer')
        localStorage.removeItem('printerChg')
        localStorage.removeItem('printerCurrent')
        localStorage.setItem('printerChg', true)
        localStorage.setItem('printerCurrent', props.index)
        localStorage.setItem('printer', JSON.stringify(props.data))
        self.setState({ redirectIndexNav: true, printerCurrent: props.index}, function(){})
    }

    //获取打印机列表
    getPrinterList(data){
        const self = this
        self.setState({ loading: false });
        //deli.common.notification.showPreloader();
        let formData = new FormData();
        formData.append('pageNo', data.page);
        formData.append('pageSize', data.limit);
        //打印机列表
        fetch(mpURL + '/app/printer/queryPage', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "MP_TOKEN": Cookies.load('token')
            },
            body: formData
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
                        const totals = json.data.total;
                        const items = json.data.rows;
                        if (data.page == 1 && totals == 0) {
                            self.setState({
                                loading: false,
                                force: false,
                                dataGetted: true,
                                data:[],
                                noMore: false,
                                hasError: true,
                            });
                        }else{
                            if (totals > 0) {
                                let printerCurrent = 0
                                const printer = self.state.printer
                                if (printer && printer.printerSn != undefined){
                                    for (let i = 0; i < items.length; i++) {
                                        if (items[i].printerSn == printer.printerSn) {
                                            printerCurrent = i
                                        }
                                    }
                                }else{
                                    printerCurrent = -1
                                }
                                self.setState({
                                    loading: false,
                                    dataGetted: true,
                                    data: self.state.data.concat(items),
                                    force: (totals > (data.page * data.limit)) ? true : false,
                                    currentPage: self.state.currentPage + 1,
                                    noMore: false,
                                    hasError: false,
                                    printerCurrent: printerCurrent,
                                }, function(){
                                    localStorage.removeItem('printerList')
                                    localStorage.setItem('printerList', JSON.stringify(self.state.data))
                                    localStorage.removeItem('printerCurrent')
                                    localStorage.setItem('printerCurrent', printerCurrent)
                                });
                            }else{
                                self.setState({
                                    loading: false,
                                    dataGetted: true,
                                    data: [],
                                    force: false,
                                    noMore: true
                                }, function () { })
                            }
                        }
                    } else {
                        self.setState({ loading: false });
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) {}, function (resp) {});
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ loading: false });
            //deli.common.notification.hidePreloader();
            deli.common.notification.toast({
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) { }, function (resp) { });
        });
    }

    render() {
        const hashHistory = createHashHistory()
        if(this.state.redirectIndexNav){
            hashHistory.goBack();
        }
        if (this.state.data && this.state.data.length > 0){
            const Item = (props) =>
                <a className={(props.index == this.state.printerCurrent ? "list-item current" :"list-item")} href="javascript:;" onClick={this.handlePrinterClick.bind(this, props)}>
                    <div className="list-item-wrap">
                        <div className="list-item-info">
                            <div className="info-img">
                                <img src={props.logo} />
                            </div>
                            <div className="info-text">
                                <div className="title">{` ${props.printerName}`}</div>
                                <p className="title-sub">sn:{` ${props.printerSn}`}</p>
                            </div>
                        </div>
                        <div className={(props.workStatus == 'error' ? 'list-item-status status-fault' : (props.onlineStatus == '1' ? 'list-item-status status-online' : 'list-item-status status-offline'))}><span>{props.workStatus == 'error' ? '故障' : (props.onlineStatus == '1' ? '在线' : '离线')}</span></div>
                    </div>
                </a>;
            return (<div className="print-list">
                <div className="container">
                    <ScrollList
                        className="scroll-list-demo"
                        dataGetted={this.state.dataGetted}
                        data={this.state.data}
                        hasError={this.state.hasError}
                        loading={this.state.loading}
                        onLoad={this.onLoad.bind(this)}
                    >
                        <Item />
                    </ScrollList>
                </div>
            </div>);
        }else{
            return (<div className="print-list"><div className="container"><div className="print-list-empty"><div className="print-list-empty-img"></div><p className="print-list-empty-text">无可用打印机</p></div></div></div>);
        }
    }
}

export default PrintList;