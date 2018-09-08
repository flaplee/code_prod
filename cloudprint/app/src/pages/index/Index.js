import React, { Component } from 'react'
import { render } from 'react-dom'
import Cookies from 'react-cookies';
import 'whatwg-fetch'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import Nav from './Nav'
import Printer from './Printer'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class PrintIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user:{
                user_id: '',
                org_id: '',
                token: ''
            },
            sn: '' || props.location.search.sn,
            printer:{},
            printerList:{},
            inkbox:{},
            navlist: [{
                title: '选择图片打印',
                url: ''
            },
            {
                title: '选择文件打印',
                url: ''
            },
            {
                title: '打印任务',
                url: ''
            },
            {
                title: '打印机管理',
                url: ''
            }]
        };
    };

    componentWillUpdate(props, state) {
        
    }

    componentWillMount(){}
    
    componentDidMount() {
        const self = this
        if (self.state.sn != '') { Cookies.save('sn', self.state.sn, { path: '/' });}
        let signPrint;
        let appIdPrint;
        let timestampPrint = '1536041270823';
        let nonceStrPrint = 'abcdefg';
        if (Cookies.load('sign') && Cookies.load('timestamp') && Cookies.load('nonceStr')) {
            signPrint = Cookies.load('sign')
            timestampPrint = Cookies.load('timestamp')
            nonceStrPrint = Cookies.load('nonceStr')
        } else {
            timestampPrint = (Date.now().toString())
            nonceStrPrint = "abcdefg";
        }

        self.getAppData(timestampPrint, nonceStrPrint, function (response) {
            if (response && response.signStr) {
                signPrint = response.signStr
                appIdPrint = response.appId
                Cookies.save('sign', signPrint, { path: '/' });
                Cookies.save('appId', appIdPrint, { path: '/' });
                Cookies.save('timestamp', timestampPrint, { path: '/' });
                Cookies.save('nonceStr', nonceStrPrint, { path: '/' });
            }

            // 注入配置信息
            deli.config({
                noncestr: nonceStrPrint, // 必填，生成签名的随机串
                appId: appIdPrint || Cookies.load('appId'), // 必填，应用ID  373175764691976192
                timestamp: timestampPrint, // 必填，生成签名的时间戳
                signature: signPrint || Cookies.load('sign') // 必填，服务端生成的签名 26fcd1cab8ff455bfea0ee59a67bf122
            });

            // 验证签名成功
            deli.ready(function () {
                // 通用设置
                deli.common.navigation.setTitle({
                    "title": "得力云打印"
                }, function(data) {}, function(resp) {});

                deli.common.navigation.setRight({
                    "icon": "http://t.static.delicloud.com/h5/web/cloudprint/images/icon/scan_code.png"
                }, function(data) {
                    deli.app.code.scan({
                        app_id: ''
                    }, function (json) {
                        alert(JSON.stringify(json))
                    }, function(resp) {});
                }, function(resp) {});

                deli.common.navigation.setColors({
                    "color": "#5D85E0",
                    "notify_theme": "white",
                    "nav_theme": "white"
                }, function (data) {}, function (resp) {});

                // 关闭
                deli.common.navigation.close({}, function (data) {
                    // 重置设置
                }, function (resp) {});

                deli.app.user.get({
                    "user_id": ""
                }, function (data) {
                    if (data) {
                        self.setState({ "user": { "user_id": data.user.id } })
                        deli.app.organization.get({
                            "org_id": ""
                        }, function (odata) {
                            self.setState({ "user": { "org_id": odata.organization.id } })
                            deli.app.session.get({
                                user_id: data.user.id
                            }, function (udata) {
                                self.getLocalData({
                                    user_id: data.user.id,
                                    org_id: odata.organization.id,
                                    token: udata.token
                                }, self.state.sn);

                            }, function (uresp) {
                            });
                        }, function (oresp) {
                        });
                    }
                }, function (resp) {
                });
            });

            //验证签名失败
            deli.error(function () {
                console.log("deli.error")
            });

            // 调试
            /* self.setState({ "user": { "token": Cookies.load('token') } })
            self.getLocalData({
                user_id: Cookies.load('userId'),
                org_id: Cookies.load('orgId'),
                token: Cookies.load('loginToken')
            }); */
        });
    }
    
    //监听Printer变化状态
    transPrinter(printer) {
        console.log("printer", printer);
    }
    
    renderPrinter() {
        const user = this.state.user;
        const printer = this.state.printer;
        const result = <Printer user={user} printer={printer}></Printer>;
        return result;
    }

    //获取auth信息
    getLocalData(data, printSn){
        var self = this
        //登录api
        fetch(mpURL + '/a/auth/login', {
            method: 'POST',
            headers: {
                user_id: data.user_id,
                org_id: data.org_id,
                token: data.token
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        self.setState({"user":{token: data.data }}, function(){
                            Cookies.save('userId', data.user_id, { path: '/' });
                            Cookies.save('orgId', data.org_id, { path: '/' });
                            Cookies.save('token', json.data, { path: '/' });

                            self.setState({ "user": { "token": json.data } })
                            self.setState({ "user": { "user_id": data.user_id } })
                            self.setState({ "user": { "org_id": data.org_id } })
                        })
                        if(printSn){
                            self.getPrinterData(printSn)
                        }else{
                            //获取打印机列表并选择上次的打印机
                            self.getPrinterList({
                                'page': 1,
                                'limit': 10
                            }, function(sn) {
                                self.getPrinterData(sn)
                            });
                        }
                        
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //获取打印机列表
    getPrinterList(data, callback) {
        const self = this
        let formData = new FormData();
        formData.append('pageNo', data.page);
        formData.append('pageSize', data.limit);
        //打印机列表
        fetch(mpURL + '/app/printer/queryPage', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: formData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        // update 20180904
                        if(json.data.rows.length > 0){
                            let current = 0
                            self.setState({ printer: json.data.rows[current] }, function () {
                                if(typeof callback === 'function'){
                                    callback(json.data.rows[current].printerSn);
                                }
                            });
                        }
                    } else {
                        deli.common.notification.prompt({
                            "type": 'error',
                            "text": json.data,
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

    //获取打印机信息
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
                response.json().then(function (resp1) {
                    console.log("resp1", resp1)
                    if (resp1.code == 0) {
                        Cookies.save('printer', resp1.data, { path: '/' });
                        self.setState({ printer: resp1.data }, function () {
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
                                    response.json().then(function (resp2) {
                                        if (resp2.code == 0) {
                                            self.setState({ inkbox: resp2.data }, function () {
                                                console.log("test3")
                                            });
                                        }
                                    });
                                }
                            ).catch(function (err) {
                                console.log("错误:" + err);
                            });
                        })
                    } else {

                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //获取应用信息
    getAppData(timestamp, nonceStr, callback){
        const self = this
        let appData = new FormData();
        appData.append('timestamp', timestamp);
        appData.append('nonceStr', nonceStr);
        //获取应用id
        fetch(mpURL + '/a/auth/config', {
            method: 'POST',
            headers: appData,
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (data) {
                    if (data.code === 0) {
                        Cookies.save('appId', data.data.appId, { path: '/' });
                        Cookies.save('sign', data.data.signStr, { path: '/' });
                        /* self.setState({ "user": { token: data.data } }, function () {
                            self.setState({ "user": { "token": data.data } })
                            Cookies.save('token', data.data, { path: '/' });
                            Cookies.save('sn', 'L1000DNW-1B_0000000000000000', { path: '/' });
                        }) */
                        // Cookies.save('token', 'cf8fbcb6-a582-4aaf-b309-0cdb5aaba2f8', { path: '/' });
                        // todo
                        if (typeof callback === 'function'){
                            callback(data)
                        }
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    render(){
        return(
            <div className="print-index">
                <Printer user={this.state.user} printer={this.state.printer} printer={this.state.printer} inkbox={this.state.inkbox} transPrinter={printer => this.transPrinter(printer)}></Printer>
                <Nav navlist={this.state.navlist} printer={this.state.printer} transPrinter={printer => this.transPrinter(printer)}></Nav>
            </div>
        );
    }
}
PrintIndex.defaultProps = {
    print:{
        printCurrent:0,
        printList:{}
    }
};

export default PrintIndex;