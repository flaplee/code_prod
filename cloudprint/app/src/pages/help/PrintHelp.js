import React, { Component } from 'react'
import { render } from 'react-dom'
import {
    Router,
    Switch,
    Route,
    Link,
    NavLink
} from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Help.scss';
// 引入路由
import { History, createHashHistory } from "history";
import Utils from '../../util/js/util.js';
const { HBox, Box } = Boxs;

class ManageTask extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    onLoad() {}

    handleOnClick(type) {
        switch (type) {
            case 'printAdd':
                window.location.href = 'http://mp.delicloud.xin/cloudprint/docs/help/printadd.html'
                break;
            case 'printMobile':
                window.location.href = 'http://mp.delicloud.xin/cloudprint/docs/help/printmobile.html'
                break;
            case 'printPc':
                window.location.href = 'http://mp.delicloud.xin/cloudprint/docs/help/printpc.html'
                break;
            case 'printScan':
                window.location.href = 'http://mp.delicloud.xin/cloudprint/docs/help/printscan.html'
                break;
            default:
                break;
        }
    }

    componentWillMount() {};
    
    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "帮助手册"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": ""
        }, function (data) {}, function (resp) {});
    };

    render() {
        return (
            <div className="print-help" id="print-help">
                <Group className="help-list">
                    <Group.List lineIndent={15}>
                        <Link to="/printhelpadd">
                            <div>
                                <div className="print-list-wrap-single print-list-wrap-single-tap">
                                    <HBox vAlign="center">
                                        <HBox flex={1}>
                                            <Box className="print-list-text-content-single" flex={1}>
                                                <p className="print-list-title-single omit">添加打印机</p>
                                            </Box>
                                        </HBox>
                                        <Box>
                                            <Icon className="print-list-arrow" name='direction-right' fill="#999" width="3rem" height="3rem" />
                                        </Box>
                                    </HBox>
                                </div>
                            </div>
                        </Link>
                        <Link to="/printhelpmobile">
                            <div>
                                <div className="print-list-wrap-single print-list-wrap-single-tap">
                                    <HBox vAlign="center">
                                        <HBox flex={1}>
                                            <Box className="print-list-text-content-single" flex={1}>
                                                <p className="print-list-title-single omit">手机上使用云打印</p>
                                            </Box>
                                        </HBox>
                                        <Box>
                                            <Icon className="print-list-arrow" name='direction-right' fill="#999" width="3rem" height="3rem" />
                                        </Box>
                                    </HBox>
                                </div>
                            </div>
                        </Link>
                        <Link to="/printhelppc">
                            <div>
                                <div className="print-list-wrap-single print-list-wrap-single-tap">
                                    <HBox vAlign="center">
                                        <HBox flex={1}>
                                            <Box className="print-list-text-content-single" flex={1}>
                                                <p className="print-list-title-single omit">电脑上使用云打印</p>
                                            </Box>
                                        </HBox>
                                        <Box>
                                            <Icon className="print-list-arrow" name='direction-right' fill="#999" width="3rem" height="3rem" />
                                        </Box>
                                    </HBox>
                                </div>
                            </div>
                        </Link>
                        <Link to="/printhelpscan">
                            <div>
                                <div className="print-list-wrap-single print-list-wrap-single-tap">
                                    <HBox vAlign="center">
                                        <HBox flex={1}>
                                            <Box className="print-list-text-content-single" flex={1}>
                                                <p className="print-list-title-single omit">扫码打印</p>
                                            </Box>
                                        </HBox>
                                        <Box>
                                            <Icon className="print-list-arrow" name='direction-right' fill="#999" width="3rem" height="3rem" />
                                        </Box>
                                    </HBox>
                                </div>
                            </div>
                        </Link>
                    </Group.List>
                </Group>
            </div>
        );
    }
}

export default ManageTask;