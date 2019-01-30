import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies'
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import './Index.scss';
const { HBox, Box } = Boxs;
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'

class ChooseItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file: props.file,
            index: props.index,
            printLoading: false,
            redirect: { printTask: false },
            printer: {
                sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
                name: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerName : '',
                status: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? ((JSON.parse(localStorage.getItem('printer')).workStatus == 'error') ? 0 : (JSON.parse(localStorage.getItem('printer')).onlineStatus == '1' ? 1 : 2)) : ''
            },
            printData: {
                'duplexMode': 0,
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 2,
                'printEndPage': 1,
                'copyCount': 1,
                'printDpi': 600,
                'paperSize': 'A4',
                'printColorMode': 'black',
                'printWhole': 1,
                'printStartPage': 1
            }
        };
    }

    formatDate(time, full, date) {
        let r;
        let t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth() + 1;
        let d = t.getDate();
        if (full) {
            r = [t.getHours(), t.getMinutes(), t.getSeconds()];
            if (r[1] < 10) {
                r[1] = '0' + r[1];
            }
            if (r[2] < 10) {
                r[2] = '0' + r[2];
            }
            r = r.join(':');
            r = y + '年' + m + '月' + d + '日' + ' ' + r;
        } else {
            var diff = new Date().Diff('d', t);
            if (diff <= 2 && diff >= -2) {
                r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                if (r[1] < 10) {
                    r[1] = '0' + r[1];
                }
                if (r[2] < 10) {
                    r[2] = '0' + r[2];
                }
                r = r.join(':');
                if (date) {
                    if (diff === 1) {
                        r = '昨天';
                    } else if (diff === 2) {
                        r = '前天';
                    } else if (diff === -1) {
                        r = '明天';
                    } else if (diff === -2) {
                        r = '后天';
                    } else {
                        r = '今天';
                    }
                } else {
                    if (diff === 1) {
                        r = '昨天' + r;
                    } else if (diff === 2) {
                        r = '前天' + r;
                    } else if (diff === -1) {
                        r = '明天' + r;
                    } else if (diff === -2) {
                        r = '后天' + r;
                    } else {
                        r = '今天' + r;
                    }
                }
            } else {
                r = y + '年' + m + '月' + d + '日';
            }
        }
        return r;
    }

    //选择任务打印
    handleItemClick(data) {
        if (data.printTaskType == 'virtual'){
            this.handleVirPrintClick(data)
        }else{
            this.props.transFilerList({ fileItemData: data })
        }
    }

    // 虚拟打印
    handleVirPrintClick(data) {
        const self = this;
        self.setState({ printLoading: true }, function () { })
        let printItems = {};
        const fileList = data.fileList;
        printItems = self.state.printData;
        printItems.taskSource = 'VIRTUAL';
        if (data.downloadUrl) {
            printItems.downloadUrl = data.downloadUrl;
        }
        printItems.printerSn = self.state.printer.sn;
        printItems.fileList = [];
        if (fileList.length == 1){
            printItems.printEndPage = data.fileList[0].totalPage
        }
        for (let i = 0; i < fileList.length; i++) {
            printItems.fileList.push({
                fileSource: fileList[i].fileSource,
                printMd5: fileList[i].printMd5,
                fileSuffix: fileList[i].fileSuffix,
                printPDF: fileList[i].printPDF,
                totalPage: fileList[i].totalPage,
                fileId: fileList[i].fileId,
                printUrl: fileList[i].printUrl,
                fileName: fileList[i].fileName
            })
        }
        //虚拟打印任务设置打印机打印
        fetch(mpURL + '/v1/app/printTask/taskToPrinter/' + data.taskCode +'', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "Content-Type": "application/json",
                "MP_TOKEN": Cookies.load('token')
            },
            body: JSON.stringify(printItems)
        }).then(
            function (response) {
                if (response.status !== 200) {
                    self.setState({ printLoading: false }, function () { })
                    deli.common.notification.toast({
                        "text": "网络错误,请重试",
                        "duration": 1.5
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    if (json.code == 0) {
                        self.setState({ printLoading: false, redirect: { printTask: true } }, function () { })
                    } else {
                        self.setState({ printLoading: false }, function () { })
                        deli.common.notification.toast({
                            "text": json.msg,
                            "duration": 1.5
                        }, function (data) { }, function (resp) { });
                    }
                });
            }
        ).catch(function (err) {
            self.setState({ printLoading: false }, function () { })
            deli.common.notification.toast({
                "text": "网络错误,请重试",
                "duration": 1.5
            }, function (data) { }, function (resp) { });
        });
    }

    render() {
        const self = this
        let dataIndex = self.state.index
        let dataItem = self.state.file
        //虚拟打印进入打印机任务列表
        if (self.state.redirect.printTask) {
            const sn = self.state.printer.sn
            const status = self.state.printer.status
            const name = self.state.printer.name
            return <Redirect push to={
                { pathname: "/managetask", search: "?sn=" + sn + "&status=" + status + "&name=" + name + "", state: { "sn": sn, "status": status, "name": name } }
            } />;
        }
        return <div key={`page-file-${dataIndex}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, dataItem)}>
            <div className="task-list-item-wrap">
                <HBox vAlign="center">
                    <HBox flex={1}>
                        <Box className="list-item-text-content" flex={1}>
                            <p className="list-item-title t-omit">{dataItem.taskName}</p>
                            <p className="list-item-text t-omit">{self.formatDate(parseInt(dataItem.createTime), true)}</p>
                        </Box>
                    </HBox>
                    <Box>
                        <Icon className="print-list-arrow right" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                    </Box>
                </HBox>
            </div>
        </div>
    }
}

export default ChooseItem;