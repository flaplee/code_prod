import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Icon from 'salt-icon';

class Footer extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            isShowFooter: false
        };
    }

    // 组件已经加载到dom中
    componentDidMount() {

    }

    //打印
    handlePrintClick() {
        console.log("close");
    }
    render() {
        return (
            <div className="navMenu flexfixed" style={{ display: (this.state.isShowFooter == true) ? '' : 'none' }}>
                <div className="poster-print">
                    <a className="print-btn" href="javascript:;" onClick={this.handlePrintClick.bind(this)}>打印</a>
                </div>
            </div>
        )
    }
}

export default Footer;