import React, { Component } from 'react'
// 引入路由
import { History, createHashHistory } from "history";
class Unbind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printer:{
                sn: (new URLSearchParams(props.location.search)).get('sn') || '',
                name: (new URLSearchParams(props.location.search)).get('name') || '',
                status: (new URLSearchParams(props.location.search)).get('status') || '',
            },   
            redirectIndexNav: false
        };
    }

    handleBackClick(){
        this.setState({redirectIndexNav:true}, function(){})
    }

    render() {
        const hashHistory = createHashHistory()
        if(this.state.redirectIndexNav){
            const sn = this.state.printer.sn
            const name = this.state.printer.sn
            const status = this.state.printer.status
            console.log("hashHistory", hashHistory)
            hashHistory.replace({
                pathname: '/',
                search: "?sn=" + sn + "&name=" + name + "&status=" + status + "",
                state: { "sn": sn, name: name, status: status }
            })
        }
        return <div className="print-scan">
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