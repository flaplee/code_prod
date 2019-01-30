import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import './Help.scss';

class PrintPc extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onLoad() { }

    componentWillMount() { };

    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "电脑上使用云打印"
        }, function (data) { }, function (resp) { });

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) { }, function (resp) { });
    };

    render() {
        return (
            <div className="print-help-info">
                <h3>如何在电脑上使用云打印？</h3>
                <div className="print-help-info-item"><p className="print-help-info-text">1、请在电脑上登录得力e+WEB端。网址：<span className="print-help-info-link">https://www.delicloud.com</span></p></div>
                <div className="print-help-info-item"><p className="print-help-info-text">2、进入应用，选择云打印应用。</p><img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_pc01.png" /></div>
                <div className="print-help-info-item"><p className="print-help-info-text">3、选择本地文件或将需要打印的文件拖拽到打印区域内，文件将自动上传到服务器。 。</p><img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_pc02.png" /></div>
                <div className="print-help-info-item"><p className="print-help-info-text">4、完成对打印文件的预览和参数设置，选择打印机进行打印。 。</p><img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_pc03.png" /><p className="print-help-info-text center"><span className="print-help-info-tips">点击【直接打印】将发送给当前选择的打印机进行打印</span></p></div>
            </div>
        );
    }
}

export default PrintPc;