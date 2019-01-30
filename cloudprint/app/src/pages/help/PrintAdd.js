import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import './Help.scss';

class PrintAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    onLoad() {}

    componentWillMount() {};
    
    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "添加打印机"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) {}, function (resp) {});
    };

    render() {
        return (
            <div className="print-help-info">
                <h3>如何添加打印机到云打印应用？</h3>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        1、使用得力e+【扫一扫】，扫描打印机机身上二维码，通过引导完成打印机绑定组织和配网操作。
                    </p>
                    <img src="http://mp.delicloud.xin/cloudprint/docs/help/images/print_help_add01.png" />
                </div>
                <div className="print-help-info-item">
                    <p className="print-help-info-text">
                        2、进入得力云打印应用，开始使用你的打印机。
                    </p>
                </div>
            </div>
        );
    }
}

export default PrintAdd;