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
            page: 0,
            loading: false,
            refreshing: false,
            printer:{
                sn: (new URLSearchParams(props.location.search)).get('sn') || '',
                name: (new URLSearchParams(props.location.search)).get('name') || '',
                status: (new URLSearchParams(props.location.search)).get('status') || '',
            },    
            fileList: [],
            fileItemData:{},
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
        }, function (resp) {});
    }

    componentDidMount(){
    }

    onLoad(){}

    //监听Tasker变化状态
    transFiler(filer) {
        console.log("filer~~~", filer);
        this.setState({
            redirect:{
                previewNav: true
            },
            fileItemData: filer.fileItemData
        }, function(){

        });
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
            const fileItemData = this.state.fileItemData
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&name=" + name + "&status=" + status + "", state: { "sn": sn, "file": file, "fileList": fileItemData } }
            } />;
        }
        return (
            <div className="print-index-task print-list" id="print-index-task">
                <ChooseList pages={this.state.page} files={this.state.fileList} printer={this.state.printer} transFiler={filer => this.transFiler(filer)}></ChooseList>
            </div>);
    }
}

export default ChooseTask;