import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import './Help.scss';

class PrintMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onLoad() { }

    componentWillMount() { };

    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "手机上使用云打印"
        }, function (data) { }, function (resp) { });

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) { }, function (resp) { });
    };

    render() {
        return (
            <div className="print-help-info">
                <h3>如何在手机上使用云打印？</h3>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        1、请确保所选打印机网络和状态正常。
				    </p>
                </div>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        2、在云打印应用中点击【选择图片打印】或【选择文件打印】，选择需要打印的内容。
				    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_mobile01.png" />
			    </div>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        3、在确认打印预览无误后，点击【打印】将文件或图片发送至打印机进行打印。 。
                    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_mobile02.png" />
                    <p className="print-help-info-text help-center">
                        <span className="print-help-info-tips">更多打印参数可在【设置】中进行设定</span>
                    </p>
                </div>
            </div>
        );
    }
}

export default PrintMobile;