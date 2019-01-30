import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Icon from 'salt-icon';

class Header extends Component {
    // 初始化页面常量 绑定事件方法
    constructor(props, context) {
        super(props)
        this.state = {
            className: '',
            title: '云打印',
            rightText: '扫码',
            isShow: false
        };
    }

    // 组件已经加载到dom中
    componentDidMount() {

    }

    // 扫码
    qrcode() {
        const { config } = this.props
    }

    handleOnLeftClick() {
    }

    handleOnRightClick() {
    }

    handleCloseViewClick() {
    }
    render() {
        return (
            <div className="header" style={{ display: (this.state.isShow == true) ? '' : 'none' }}>
                <div className="title">{this.state.title}</div>
                <a className="back" href="javascript:;" onClick={this.handleOnLeftClick.bind(this)}><Icon className="icon-back" name='direction-left' fill="#fff" width="7rem" height="4rem" /></a>
                <a className="leftMenuBtn" href="javascript:;" onClick={this.handleCloseViewClick.bind(this)}>关闭</a>
                <a className="rightMenuBtn" onClick={this.handleOnRightClick.bind(this)}>{this.state.rightText}</a>
            </div>
        )
    }
}

export default Header;