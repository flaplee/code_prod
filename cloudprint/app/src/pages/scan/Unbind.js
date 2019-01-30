import React, { Component } from 'react'
import { render } from 'react-dom'
import Cookies from 'react-cookies';
// 引入路由
import { History, createHashHistory } from "history";
class Unbind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printer:{
                sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
                name: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerName : '',
                status: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? ((JSON.parse(localStorage.getItem('printer')).workStatus == 'error') ? 0 : (JSON.parse(localStorage.getItem('printer')).onlineStatus == '1' ? 1 : 2)) : ''
            },
            redirectIndexNav: false
        };
    }

    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-scan').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })

        deli.common.navigation.setTitle({
            "title": "云打印"
        }, function (data) { }, function (resp) { });

        deli.common.navigation.setRight({
            "text": "",
            "icon": ""
        }, function (data) {}, function (resp) {});

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
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('chooseTaskInfo')
        }, function (resp) {});
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }

    handleBackClick(){
        this.setState({redirectIndexNav:true}, function(){})
    }

    render() {
        const hashHistory = createHashHistory()
        if(this.state.redirectIndexNav){
            const sn = this.state.printer.sn
            const name = this.state.printer.name
            const status = this.state.printer.status
            hashHistory.replace({
                pathname: '/',
                search: "?sn=" + sn + "&name=" + name + "&status=" + status + "",
                state: { "sn": sn, name: name, status: status }
            })
        }
        return <div className="print-scan" id="print-scan">
            <div className="scan-denied">
                <div className="scan-denied-img"></div>
                <p className="scan-denied-text">无权限操作该打印机</p>
                <div className="scan-denied-back">
                    <a className="scan-btn" onClick={this.handleBackClick.bind(this)} href="javascript:;">返回</a>
                </div>
            </div>
        </div>;
    }
}

export default Unbind;