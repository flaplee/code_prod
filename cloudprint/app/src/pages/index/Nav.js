import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies';
import { FileUpload } from 'react-fileupload'
import pictureimg from '../../images/picture.png'
import fileimg from '../../images/file.png'
import taskimg from '../../images/Print_task.png'
import manage01 from '../../images/management01.png'
import manage02 from '../../images/Printer_management02.png'
import { Layer } from 'saltui';
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printer: {},
            navlist: {},
            redirect:{
                imgNav: false,
                fileNav: false,
                taskNav: false,
                manageNav: false
            },
            file:{
                width: 0,
                height: 0
            },
            previewList:[],
            taskItemData: {},
            layerView: false,
            layerViewData: [],
            menuList: [{
                value: 1,
                text: '本地文件'
            }, {
                value: 2,
                text: '网盘文件'
            }, {
                value: 3,
                text: '取消'
            }]
        }
        console.log("props", props)
    }

    componentWillReceiveProps(transProps) {
        console.log("transProps", transProps)
        if (transProps.printer) {
            this.setState({
                printer: transProps.printer,
            }, function () {
                
            });
        }
    }

    componentWillUpdate(transProps, transState) {
        console.log("componentWillUpdate", transProps)
        console.log("transState", transState)
    }

    componentWillMount(props, state) {
        console.log("props", props)
        console.log("state", state)
    }

    // 转换完成直接预览
    handleUploadPreview(data){
        const self = this
        let pageLoad = data.pdfPageCount
        for(let i = 1 ;i <= ((pageLoad <= 5) ? pageLoad : 5); i++){
            self.loadPreviewImg(data, false, function(){
                pageLoad++;
            })
        }
    }
    
    //下载图片获取图片宽高
    getPreviewImg(url){
        //获取图片数据
        const tmp = new Image();
        tmp.onload = function () {}
        tmp.onerror = function () { }
        tmp.src = url;
        let type = (tmp.width > tmp.height) ? 1 : ((tmp.width < tmp.height) ?  2: 0)
        let sapce = (tmp.width > tmp.height) ? tmp.height : tmp.width
        return [type, sapce]
    }

    // 下载预览图片
    loadPreviewImg(data, space, callback){
        const self = this
        //PDF 文件预览接口
        let previewData = new FormData();
        previewData.append('fileId', data.fileId); // this.state.file.fileId 486971115692883968
        previewData.append('fileType', data.fileType);
        previewData.append('checkedPage', data.pdfPageCount);
        previewData.append('width', (space ? space : 560));
        previewData.append('height', 790);
        fetch(convertURL + '/h5/converter/preview', {
            method: 'POST',
            headers: {
                token: Cookies.load('token')
            },
            body: previewData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function (json) {
                    console.log("json", json)
                    if (json.code === 0) {
                        if(self.getPreviewImg()[0] == 1){
                            self.loadPreviewImg(data, space, function(){
                                callback()
                            })
                        }else{
                            const tmpImg = self.state.previewList
                            const tmpImgs = tmpImg.push(json.data)
                            self.setState({
                                previewList: tmpImgs
                            }, function () {
                                callback();
                            })
                        }
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //上传图片表单
    handleUploadImgSubmit(data){
        const self = this
        let formData = new FormData();
        formData.append('file', data.file)
    
        //上传图片
        fetch(convertURL + '/h5/converter/local', {
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
                    console.log("json", json)
                    if (json.code == 0) {
                        self.handleUploadPreview(json.data)
                        //const localFile = json.data
                        //self.setState({ file: { url: '', id: localFile.fileId, fileExt: localFile.fileType, fileName: localFile.sourceName, count: localFile.pdfPageCount}, redirect: { imgNav: true } });
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //上传文件表单
    handleUploadFileSubmit(data) {
        const self = this
        let formData = new FormData();
        formData.append('url', 'http://file.delicloud.xin/deli_POT_Manual.pdf');
        formData.append('fileName', 'deli_POT_Manual');
        formData.append('fileExt', 'pdf');

        //上传文件 第三方url转PDF
        fetch(convertURL + '/h5/converter/converterByUrlForId', {
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
                        //文件转换情况datadata
                        fetch(convertURL + '/converter/find/taskId/'+ json.data +'', {
                            method: 'GET',
                            headers: {
                                token: Cookies.load('token')
                            }
                        }).then(
                            function (response) {
                                if (response.status !== 200) {
                                    return;
                                }
                                response.json().then(function (resp) {
                                    if (resp.code == 0) {
                                        if(resp.data) {
                                            const taskData = resp.data
                                            self.setState({ file: { fileId: taskData.taskId, fileUrl: taskData.pdfUrl, fileName: taskData.sourceName, fileExt: taskData.fileType }, redirect: { fileNav: true } });
                                        }
                                    }
                                });
                            }
                        ).catch(function (err) {
                            console.log("错误:" + err);
                        });
                    }
                });
            }
        ).catch(function (err) {
            console.log("错误:" + err);
        });
    }

    //上传图片
    handleUploadImgChange() {
        const self = this
        const fr = new FileReader();
        fr.onload = function () {
            //获取图片数据
            const tmp = new Image();
            tmp.onload = function () {
                console.log("width", tmp.width)
                console.log("height", tmp.height)
                self.setState({
                    file: {
                        width: tmp.width,
                        height: tmp.height
                    },
                }, function () {

                });
            }
            tmp.onerror = function () { }
            tmp.src = this.result;
            console.log("tmp", tmp);
        };
        fr.onerror = function () {
            console.log("无法读取文件, 请重试");
        };
        fr.readAsDataURL(this.fileImgInput.files[0])
        console.log("fr", fr)
        self.handleUploadImgSubmit({ 'file': this.fileImgInput.files[0] })
    }

    //上传文件
    handleUploadFileChange(){
        const self = this
        const fr = new FileReader();
        fr.onload = function () {
        };
        fr.onerror = function () {
            console.log("无法读取文件, 请重试");
        };
        fr.readAsDataURL(this.fileInput.files[0])
        console.log("fr", fr)
        self.handleUploadFileSubmit({ 'file': this.fileInput.files[0]})
    }

    handleOnClick(type, status) {
        switch (type) {
            case 'upload':
                //this.setState({ redirect: { imgNav: true } });
                break;
            case 'imgNav':
                deli.common.image.choose({
                    types: ["photo"],
                    multiple: true,
                    max: 9
                }, function (data) {
                    alert(JSON.stringify(data));
                }, function (resp) {
                    alert(JSON.stringify(resp));
                });
                break;
            case 'fileNav':
                this.setState({ layerView: true }, function () {})
                break;
            case 'taskNav':
                this.setState({ redirect: { taskNav: true }});
                break;
            case 'manageNav':
                if (status){
                    this.setState({ redirect: { manageNav: true } });
                }
                break;
            default:
                break;
        }
    }

    //打印菜单
    handleLayerClick(value, task) {
        console.log("value", value);
        console.log("task", task);
        switch (value) {
            case 1:
                deli.common.file.choose({
                    types: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']
                }, function (data) {
                    alert(JSON.stringify(data));
                }, function (resp) {
                    alert(JSON.stringify(resp));
                });
                this.setState({ layerView: false });
                break;
            case 2:
                deli.app.disk.choose({
                    types: ['png', 'jpg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']
                }, function (data) {
                    alert(JSON.stringify(data));
                }, function (resp) {
                    alert(JSON.stringify(resp));
                });
                this.setState({ layerView: false });
                break;
            case 3:
                this.setState({ layerView: false });
                break;
            default:
                this.setState({ layerView: false });
                break;
        }
    }

    // 显示菜单
    renderlayerItems(viewData, taskData) {
        const pages = this.state.menuList;
        const result = [];
        console.log("viewData", viewData);
        console.log("taskData", taskData);
        console.log("pages", pages);
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            console.log("valueItem", valueItem)
            console.log("textItem", textItem)
            result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, valueItem, taskData)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        const sn = this.state.printer.printerSn
        const file = this.state.file
        if (this.state.redirect.imgNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "", state: { "sn": sn, "file": file }  }
            } />;
        }
        if (this.state.redirect.fileNav) {
            return <Redirect push to={
                { pathname: "/previewindex", search: "?sn=" + sn + "", state: { "sn": sn, "file": file }  }
            } />;
        }
        if (this.state.redirect.taskNav) {
            return <Redirect push to={
                { pathname: "/printtask", search: "?sn=" + sn + "", state: { "sn": sn }  }
            } />;
        }
        if (this.state.redirect.manageNav) {
            return <Redirect push to={
                { pathname: "/printmanage", search: "?sn=" + sn + "", state: {"sn": sn } }
            } />;
        }
        return (
            <div className="content-nav">
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'imgNav')}  href="javascript:;">
                        <div className="item-img"><img src={pictureimg} /></div>
                        <div className="item-title">选择图片打印</div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'fileNav')} href="javascript:;">
                        <div className="item-img"><img src={fileimg} /></div>
                        <div className="item-title">选择文件打印</div>
                    </a>
                </div>
                <div className="nav-item">
                    <a className="item" onClick={this.handleOnClick.bind(this, 'taskNav')}  href="javascript:;">
                        <div className="item-img"><img src={taskimg} /></div>
                        <div className="item-title">打印任务</div>
                    </a>
                </div>
                <div className="nav-item nav-item-manage">
                    <a className={this.state.printer.workStatus ? 'item' : 'item item-unable'} onClick={this.handleOnClick.bind(this, 'manageNav', this.state.printer.workStatus ? true : false)} href="javascript:;">
                        <div className="item-img"><img src={this.state.printer.workStatus ? manage02 : manage01} /></div>
                        <div className="item-title">打印机管理</div>
                    </a>
                </div>
                <Layer bottom="0" visible={this.state.layerView} maskCloseable>
                    {this.renderlayerItems(this.state.layerViewData, this.state.taskItemData)}
                </Layer>
            </div>
        );
    }
}

export default Nav;