import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import './Help.scss';

class PrintScan extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onLoad() { }

    componentWillMount() { };

    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "扫码打印"
        }, function (data) { }, function (resp) { });

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) { }, function (resp) { });
    };

    render() {
        return (
            <div className="print-help-info">
                <h3>如何使用扫码打印？</h3>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        1、在得力e+web端提交打印任务，在打印预览中选择【扫码打印】，弹窗提示使用手机云打印应用。 。
				    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_scan01.png" />
                </div>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        2、在得力e+APP或云打印应用中点击【扫一扫】，扫描指定打印机上的二维码，进行打印。 。
                    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_scan02.png" />
                    <p className="print-help-info-text center">
                        <span className="print-help-info-tips">若同时有多个任务，请先选择打印任务后再进行选择打印机</span>
                    </p>
			    </div>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        3、扫码选择后进入打印预览，点击【打印】完成打印任务。 。
                    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_scan03.png" />
                </div>
            </div>
        );
    }
}

export default PrintScan;