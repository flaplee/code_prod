import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Group, Boxs, List } from 'saltui';
import Cookies from 'react-cookies';
import Icon from 'salt-icon';
import './Print.scss';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'

const { HBox, Box } = Boxs;

class PrintManage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            taskListRedirect: false,
            inkRedirect: false,
            helpRedirect: false,
            cleanRedirect: false,
            sn: (new URLSearchParams(props.location.search)).get('sn'),
            isShowUpdate: false,
            printer:{}
        };
        console.log("props.location.query.sn", this.state.sn)
    }

    handleOnClick(type) {
        switch (type) {
            case 'task':
                this.setState({ taskListRedirect: true });
                break;
            case 'ink':
                this.setState({ inkRedirect: true });
                break;
            case 'help':
                this.setState({ helpRedirect: true });
                break;
            case 'clean':
                this.setState({ cleanRedirect: true });
                break;
            default:
                break;
        }
        
    }

    componentWillMount() {
        this.getPrinterData(this.state.sn)
    }

    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-manage').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        deli.common.navigation.setTitle({
            "title": "打印机管理"
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
        }, function (resp) {});
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }

    //更新
    handleOnUpdate(){
        console.log("update")
    }

    handleClick(event, dataItem) {
        console.log(event);
        console.log(dataItem);
    }

    handleClickImg(event, imgUrl) {
        console.log(event);
        console.log(imgUrl);
    }

    handleDelete(event, dataItem) {
        console.log(event);
        console.log(dataItem);
    }

    //获取打印机数据
    getPrinterData(sn){
        const self = this
        //查询打印机信息
        fetch(mpURL + '/app/printer/queryStatus/' + sn, {
            method: 'GET',
            headers: {
                token: Cookies.load('token')
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    console.log("data", data)
                    if (data.code === 0) {
                        self.setState({ printer: data.data }, function () {
                            console.log("test2")
                            //查询打印机墨水信息
                            fetch(mpURL + '/app/inkbox/queryDetails/' + self.state.printer.inkboxSn, {
                                method: 'POST',
                                headers: {
                                    token: Cookies.load('token')
                                },
                                body: {}
                            }).then(
                                function (response) {
                                    if (response.status !== 200) {
                                        return;
                                    }
                                    response.json().then(function (data) {
                                        if (data.code === 0) {
                                            self.setState({ inkbox: data.data }, function () {
                                                console.log("test3")
                                                Cookies.save('toner', parseInt(data.data.inkboxColors[0].tonerRemain), { path: '/' });
                                            });
                                        }
                                    });
                                }
                            ).catch(function (err) {
                                deli.common.notification.prompt({
                                    "type": 'error',
                                    "text": "网络错误,请重试",
                                    "duration": 1.5
                                }, function (data) { }, function (resp) { });
                            });
                        })
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": "网络错误,请重试",
                            "duration": 1.5
                        },function(data){},function(resp){});
                    }
                });
            }
        ).catch(function (err) {
            deli.common.notification.prompt({
                "type": 'error',
                "text": "网络错误,请重试",
                "duration": 1.5
            },function(data){},function(resp){});
        });
    }

    render() {
        if (this.state.taskListRedirect) {
            const sn = this.state.sn
            const name = this.state.printer.printerName
            const status = (this.state.printer.workStatus == 'error' ? 0 : (this.state.printer.onlineStatus == 1 ? 1 : 2))
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&name="+ name +"&status="+ status +"", state: { "sn": sn, "name": name, "status": status}  }
            } />;
        }
        if (this.state.inkRedirect) {
            return <Redirect push to="/printink" />;
        }
        if (this.state.helpRedirect) {
            deli.common.notification.toast({
                "text": "开发中...",
                "duration": 1.5
            },function(data){},function(resp){});
            //return <Redirect push to="/printhelp" />;
        }
        if (this.state.cleanRedirect) {
            deli.common.notification.toast({
                "text": "开发中...",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
            //return <Redirect push to="/printclean" />;
        }
        return (<div className="print-manage" id="print-manage" onTouchMove={this.unableTouchMove.bind(this)}>
            <Group className="print-list">
                <Group.List lineIndent={15}>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleOnClick.bind(this, 'task')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印机任务列表</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <Icon className="print-list-arrow" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleOnClick.bind(this, 'ink')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">墨水信息</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <Icon className="print-list-arrow" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                                </Box>
                            </HBox>
                        </div>
                    </div>
                </Group.List>
                <Group.Head className="manage-title">打印机信息</Group.Head>
                <Group.List lineIndent={15}>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印机名称</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.printer.printerName}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>

                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">序列号</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.printer.printerSn}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印机状态</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <div name="angle-right" width={20} fill="#ccc" className={(this.state.printer.workStatus == 'error' ? 'print-list-status status-fault' : (this.state.printer.onlineStatus == 1 ? 'print-list-status status-online' : 'print-list-status status-offline'))}>{this.state.printer.workStatus == 'error' ? '故障' : (this.state.printer.onlineStatus == 1 ? '在线' : '离线')}</div>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>

                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">IP地址</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.printer.printerIp}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single">
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">固件版本</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <a style={{ display: (this.state.isShowUpdate == true) ? '' : 'none' }} onClick={this.handleOnUpdate.bind(this)} href="javascript:;" name="angle-right" width={20} fill="#ccc" className="print-list-status print-list-status-update">更新</a>
                                </Box>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.printer.firmwareVersion}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                </Group.List>
                <Group.Head className="manage-title">帮助和修理</Group.Head>
                <Group.List lineIndent={15}>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleOnClick.bind(this, 'help')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">帮助手册</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <Icon className="print-list-arrow" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleOnClick.bind(this, 'clean')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">清洗打印头</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <Icon className="print-list-arrow" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                                </Box>
                            </HBox>
                        </div>
                    </div>
                </Group.List>
            </Group>
        </div>);
    }
}

export default PrintManage;