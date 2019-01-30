import React, { Component } from 'react'
import 'whatwg-fetch'
import './Print.scss';
import Cookies from 'react-cookies';
import ProgressInboxs from '../components/progressinbox/ProgressInboxs';
class PrintInks extends React.Component {
    constructor() {
        super();
        this.state = {
            printer: JSON.parse(localStorage.getItem('printer')) || {}
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-inks').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        deli.common.navigation.setTitle({
            "title": "墨水信息"
        }, function (data) {}, function (resp) {});
        
        deli.common.navigation.setRight({
            "text": ""
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

    
    render() {
        let inkboxDetails = this.state.printer.inkboxDetails
        let inboxItems = inkboxDetails.map((inbox, index) => {
            let inboxItem = inbox.inkboxColors.map((item, i) => {
                let colorName = (item.color == 'cyan' ? '青色' : (item.color == 'yellow' ? '黄色' : (item.color == 'magenta' ? '品红' : '黑色')))
                let toner = parseInt(item.tonerRemain)
                let inboxItemClass = 'inner-item'
                inboxItemClass += ' ' + (inbox.inkboxStatus == "0" ? ((toner == 0) ? 'inner-item-empty' : ((toner > 0 && toner <= 20) ? 'inner-item-common inner-item-less' : 'inner-item-common')) : 'inner-item-none')
                inboxItemClass += ' ' + (item.color == 'cyan' ? 'inner-item-cyan' : (item.color == 'yellow' ? 'inner-item-yellow' : (item.color == 'magenta' ? 'inner-item-magenta' : 'inner-item-black')))
                return (
                    <div key={index + 'inner-item' + i} className={ inboxItemClass }>
                        {inbox.inkboxStatus == "0" ? <span className="item-title">{ colorName }</span> : ''}
                        {inbox.inkboxStatus == "0" ? <ProgressInboxs key={'ProgressInboxs'} inboxs={item} /> : <div className="progress-inboxs"><div className="progress-inboxs-bar">未检测到墨盒</div></div> }
                    </div>
                )
            })
            return (
                <div key={'progress' + index} className="inks-box">
                    <div className="inks-title">{index == 0 ? 'A' : 'B'}墨盒</div>
                    <div className="inks-inner">
                        {inboxItem}
                    </div>
                </div>
            );
        });

        return (
            <div className="print-inks" id="print-inks">
                <div className="inks-list">
                    { inboxItems }
                </div>
            </div>
        );
    }
}

export default PrintInks;