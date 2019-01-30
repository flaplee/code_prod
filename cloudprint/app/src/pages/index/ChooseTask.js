import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui'
import Icon from 'salt-icon'
import ChooseList from './ChooseList';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
import './Index.scss'

const { HBox, Box } = Boxs;

class ChooseTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loading: false,
            isEmpty: false,
            refreshing: false,
            printer:{
                sn: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerSn : '',
                name: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? JSON.parse(localStorage.getItem('printer')).printerName : '',
                status: (localStorage.getItem('printer') && localStorage.getItem('printer') != "undefined") ? ((JSON.parse(localStorage.getItem('printer')).workStatus == 'error') ? 0 : (JSON.parse(localStorage.getItem('printer')).onlineStatus == '1' ? 1 : 2)) : ''
            },
            fileList: [],
            fileItemData: {},
            printType: 'scan',
            chooseData: JSON.parse(localStorage.getItem('chooseTaskInfo')) || props.location.state.printTaskInfo || {},
            redirect: {
                previewNav: false
            }
        };
    }

    componentWillMount(){
        deli.common.navigation.setTitle({
            "title": "选择任务"
        }, function(data) {}, function(resp) {});

        deli.common.navigation.setRight({
            "text":"",
            "icon": ""
        }, function (data) {}, function (resp) {});

        // 关闭
        deli.common.navigation.close({}, function (data) {
            // 重置
            Cookies.remove('appId');
            Cookies.remove('sign');
            Cookies.remove('userId');
            Cookies.remove('orgId');
            Cookies.remove('token');
            Cookies.remove('admin');
            localStorage.removeItem('printer')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('chooseTaskInfo')
        }, function (resp) {});

        deli.common.navigation.goBack({
            "is_go_back": true
        }, function (data) {}, function (resp) {});
    }

    componentDidMount(){}

    onLoad(){}

    //监听Tasker变化状态
    transFiler(filer) {
        this.setState({
            redirect:{
                previewNav: true
            },
            fileItemData: filer.fileItemData
        }, function(){});
    }

    onLoad() {}

    render() {
        if(this.state.redirect.previewNav){
            const file = {
                fileId: this.state.fileItemData.id,
                fileUrl: this.state.fileItemData.pdfUrl,
                fileName: this.state.fileItemData.sourceName,
                fileExt: this.state.fileItemData.fileType
            }
            const sn = this.state.printer.sn
            const name = this.state.printer.name
            const status = this.state.printer.status
            const printType = 'scan'
            const printTaskInfo = this.state.fileItemData
            const fileList = printTaskInfo.fileList
            const fileType = (fileList.length == 1 && fileList[0].fileSuffix == 'other') ? 'other' : ((fileList.length > 1 || (fileList.length == 1 && fileList[0].fileSuffix != 'pdf')) ? 'image' : 'file')
            localStorage.removeItem('printPreviewData')
            localStorage.setItem('printPreviewData', JSON.stringify(fileList))
            localStorage.removeItem('printTaskInfo')
            localStorage.setItem('printTaskInfo', JSON.stringify(printTaskInfo))
            Cookies.save('printPreviewType', fileType, { path: '/' });
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&status=" + status + "&type=" + printType + "", state: { "sn": sn, "fileList": fileList, "fileType": fileType, "printTaskInfo": printTaskInfo } }
            } />;
        }
        let fileListDom;
        if(this.state.isEmpty == true){
            fileListDom = <div className="task-list-empty"><div className="task-list-empty-img"></div><p className="task-list-empty-text">暂无更多打印记录</p></div>;
        }else{
            fileListDom = <ChooseList pages={this.state.page} files={this.state.chooseData} printer={this.state.printer} transFiler={filer => this.transFiler(filer)}></ChooseList>;
        }
        return (
            <div className="print-index-task print-list" id="print-index-task">
                { fileListDom }
            </div>);
    }
}

export default ChooseTask;