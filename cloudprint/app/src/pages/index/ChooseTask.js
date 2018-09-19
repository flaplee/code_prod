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
    }

    componentDidMount(){
    }

    onLoad(){
    }

    //监听Tasker变化状态
    transFiler(filer) {
        console.log("filer~~~", filer);
        this.setState(filer);
    }

    //查询任务详情
    handleQueryTask(item) {
        console.log("查询任务详情~~~~~~~~~~~~")
        console.log("item", item)
        const self = this
        fetch(mpURL + '/app/printerTask/queryDetais/' + item.taskCode, {
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
                    console.log("~~~~~~~~~~data", data)
                    if (data.code == 0 ) {
                        self.setState({ printer: { sn: data.data.printerSn, name: data.data.printerName, status: data.data.onlineStatus }, redirect: { previewNav: true } });
                    } else {

                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
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
            const name = this.state.printer.sn
            const status = this.state.printer.status
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "&name=" + name + "&status=" + status + "", state: { "sn": sn, "file": file } }
            } />;
        }
        return (
            <div className="print-index-task print-list" id="print-index-task">
                <ChooseList pages={this.state.page} files={this.state.fileList} printer={this.state.printer} transFiler={filer => this.transFiler(filer)}></ChooseList>
            </div>);
    }
}

export default ChooseTask;