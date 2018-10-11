import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { hasHistory } from 'react-router'
import { Group, Boxs, List, Layer} from 'saltui';
import Icon from 'salt-icon';
import Cookies from 'react-cookies';
import './Index.scss';
import SelectField from '../components/selectfield/SelectField';
// 引入路由
import { History, createHashHistory } from "history";
const { HBox, Box } = Boxs;
class PreviewSetup extends React.Component {
    constructor(props){
        super(props)
        const t = this
        t.state = {
            tranPreview: Cookies.load('printPreviewData') || {},
            paper: { data: [{ value: 'A4', text: 'A4' }, { value: 'A5', text: 'A5' }], current: 0},
            direction: { data: [{ value: 1, text: '横向' }, { value: 2, text: '纵向' }], current: 0},
            mode: { data: [{ value: 0, text: '单面' }, { value: 1, text: '双面' }, { value: 2, text: '双面短边' }], current: 0},
            color: { data: [{ value: 'black', text: '黑色' }, { value: 'white', text: '白色' }], current: 0}, 
            range: {
                count: 1,
                options: [{
                    value: 1,
                    label: 1,
                    children: [{
                        value: '-',
                        label: '-',
                        children: [{
                            value: 1,
                            label: 1
                        }]  //Cookies.load('printChildrens') || 
                    }]
                }],
                columns: ['开始', '', '结束'],
                value: [1, 1]
            },
            layerView: false,
            type: 'paper',
            PrintSetupData: Cookies.load('printData') || {
                'fileSource': 'CLOUD',
                'duplexMode': 1,
                'fileSourceUrl': '',
                'fileSuffix': '',
                'fileSourceName': '',
                'taskSource': (deli.android ? 'ANDROID' : (deli.ios ? 'IOS' : 'WBE')),
                'printDirection': 1,
                'printEndPage': 1,
                'pagesPre': 1,
                'copyCount': 1,
                'printDpi': 600,
                'printPageSize': 'A4',
                'printColorMode': 'black',
                'isPrintWhole': 0,
                'printStartPage': 1
            },
            redirectBack: false
        }
    }

    
    componentWillMount() {
        this.setState({ paper: Object.assign({}, this.state.paper, { current: (this.state.paper.data.findIndex(element => element.value == Cookies.load('printData').printPageSize)) || 0 }) }, function () {
            Cookies.save('printData', this.state.PrintSetupData, { path: '/' });
        })

        this.setState({ direction: Object.assign({}, this.state.direction, { current: (this.state.direction.data.findIndex(element => element.value == Cookies.load('printData').printDirection)) || 0 }) }, function () {
            Cookies.save('printData', this.state.PrintSetupData, { path: '/' });
        })

        this.setState({ mode: Object.assign({}, this.state.mode, { current: (this.state.mode.data.findIndex(element => element.value == Cookies.load('printData').duplexMode)) || 0 }) }, function () {
            Cookies.save('printData', this.state.PrintSetupData, { path: '/' });
        })

        this.setState({ color: Object.assign({}, this.state.color, { current: (this.state.color.data.findIndex(element => element.value == Cookies.load('printData').printColorMode)) || 0 }) }, function () {
            Cookies.save('printData', this.state.PrintSetupData, { path: '/' });
        })
    }
    
    componentDidMount() {
        // 屏蔽触摸移动
        document.getElementById('print-setup').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        const self = this
        deli.common.navigation.setTitle({
            "title": "设置"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": "确认"
        }, function (data) {
            self.setState({ PrintSetupData: self.state.PrintSetupData, redirectBack: true }, function () {
                Cookies.save('printData', self.state.PrintSetupData, { path: '/' });
            })
        }, function (resp) {});

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
    
    handleChildChange(range) {
        if (range) {
            let tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printStartPage: range[0], printEndPage: range[1]  })
            this.setState({ layerView: false, PrintSetupData: tmpPrintData }, function () {
                Cookies.save('printData', this.state.PrintSetupData, { path: '/' });
            })
            /* this.setState({range: { value: range } }, function () {
                console.log("~~~~~~~~~value", this.state.range.value);
            }); */
        }
    }

    handleItemClick(type){
        this.setState({ layerView: true, type: type });
    }

    handleLayerClick(index, value, type){
        let tmpData, tmpPrintData;
        switch (type) {
            case 'paper':
                tmpData = Object.assign({}, this.state.paper, { current: index})
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printPageSize: value })
                this.setState({ layerView: false, type: type, paper: tmpData , PrintSetupData: tmpPrintData }, function () {
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                })
                break;
            case 'direction':
                tmpData = Object.assign({}, this.state.direction, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printDirection: value })
                this.setState({ layerView: false, type: type, direction: tmpData , PrintSetupData: tmpPrintData }, function () {
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                })
                break;
            case 'mode':
                tmpData = Object.assign({}, this.state.mode, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { duplexMode: value })
                this.setState({ layerView: false, type: type, mode: tmpData, PrintSetupData: tmpPrintData }, function () {
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                })
                break;
            case 'color':
                tmpData = Object.assign({}, this.state.color, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printColorMode: value })
                this.setState({ layerView: false, type: type, color: tmpData, PrintSetupData: tmpPrintData }, function () {
                    Cookies.save('printData', tmpPrintData, { path: '/' });
                })
                break;
            default:
                break;
        }
    }

    // 打印页面设置
    handlePrintPage(total) {
        const self = this
        const printOptionsItems
        const printChildrens = []
        const printOptions = []
        for (let i = 1; i <= total; i++) {
            printChildrens.push({
                value: i,
                label: i
            })
        }
        printOptionsItems = {
            value: 1,
            label: 1,
            children: [{
                value: '-',
                label: '-',
                children: printChildrens
            }]
        }
        printOptions.push(printOptionsItems)
        return printOptions
    }

    renderItems(type) {
        const self = this
        const pages = self.state[type].data;
        const current = self.state[type].current;
        const result = [];
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            let indexItem = i;
            result.push(<div key={`page-${indexItem}`} className={(current == indexItem) ? 'setting-item setting-current' : 'setting-item'} onClick={this.handleLayerClick.bind(this, `${indexItem}`, `${valueItem}`, `${type}`)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        const hashHistory = createHashHistory()
        //this.setState({tranPreview : {printData : this.state.PrintSetupData}})
        if (this.state.redirectBack) {
            const data = this.state.tranPreview
            const sn = data.sn
            hashHistory.goBack();
            /* hashHistory.push({
                pathname: '/previewindex',
                search: "?sn=" + sn + "",
                state: data
            }) */
        }
        return (<div className="print-setup" id="print-setup" onTouchMove={this.unableTouchMove.bind(this)}>
            <Group className="print-setup-content">
                <Group.List lineIndent={15}>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleItemClick.bind(this, 'paper')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印纸张</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.paper.data[this.state.paper.current].text}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleItemClick.bind(this, 'direction')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印方向</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.direction.data[this.state.direction.current].text}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleItemClick.bind(this, 'mode')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印模式</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.mode.data[this.state.mode.current].text}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleItemClick.bind(this, 'color')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印颜色</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single omit">{this.state.color.data[this.state.color.current].text}</p>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <SelectField Name="setup-select-field" columns={this.state.range.columns} options={this.handlePrintPage(30)} onChange={this.handleChildChange.bind(this)} placeholder={"所有页面("+ this.state.range.count + "页)"} unit="页" />
                </Group.List>
            </Group>
            <Layer bottom="0" visible={this.state.layerView}  maskCloseable>
                {this.renderItems(this.state.type)}
            </Layer>
        </div>);
    }
}

export default PreviewSetup;