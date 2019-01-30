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
import Utils from '../../util/js/util.js';
const { HBox, Box } = Boxs;
class PreviewSetup extends React.Component {
    constructor(props){
        super(props)
        const t = this
        t.state = {
            paper: { data: [], current: 0},
            direction: { data: [{ value: 2, text: '纵向' }, { value: 1, text: '横向' }], current: 0},
            quality: { data: [{ value: 300, text: '速度' }, { value: 600, text: '均衡' }, { value: 900, text: '质量' }], current: 1 },
            mode: { data: [], current: 0},
            color: { data: [], current: 0},
            range: {},
            layerView: false,
            type: 'paper',
            isShowMode: true,
            printer: (localStorage.getItem('printer') && localStorage.getItem('printer') != 'undefined') ? JSON.parse(localStorage.getItem('printer')) : undefined,
            printSetupData: (localStorage.getItem('printData') && localStorage.getItem('printData') != 'undefined') ? JSON.parse(localStorage.getItem('printData')) : {
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
            },
            previewSetupData:  (localStorage.getItem('previewSetupData') && localStorage.getItem('previewSetupData') != 'undefined') ? JSON.parse(localStorage.getItem('previewSetupData')) : {
                type: 'A4',
                direction: 2,
                dpi: 600,
                paper: {
                    width: 0,
                    height: 0
                },
                print: {
                    width: 0,
                    height: 0
                }
            },
            printCountData: (localStorage.getItem('printCountData') && localStorage.getItem('printCountData') != 'undefined') ? JSON.parse(localStorage.getItem('printCountData')) : { 'totalPage': 1, 'statusPage': false, 'startPage': 1, 'endPage': 1 },
            redirectBack: false
        }
    }

    componentWillMount() {
        if(this.state.printer && this.state.printer!= undefined){
            const dictionary = Utils.dictionary
            const printerSettings = this.state.printer.printerSettings
            const paper = this.state.paper
            const mode = this.state.mode
            const color = this.state.color
            const direction = this.state.direction
            const quality = this.state.quality
            const endPrintData = this.state.printSetupData
            const paperIndex = (paper.data.findIndex(element => element.value == endPrintData.paperSize))
            const qualityIndex = (quality.data.findIndex(element => element.value == endPrintData.printDpi))
            if (printerSettings){
                for (let i = 0; i < printerSettings.paperInfos.length; i++) {
                    paper.data.push({ value: dictionary.paper.code[printerSettings.paperInfos[i].paperType], text: dictionary.paper.text[printerSettings.paperInfos[i].paperType] })
                }
                //单双面
                for (let i = 0; i < ((printerSettings.paperInfos.length == 1 && printerSettings.paperInfos[0].double == false) ? 1 : 2); i++) {
                    mode.data.push({ value: dictionary.mode.code[i], text: dictionary.mode.text[i] })
                }
                for (let i = 0; i < printerSettings.colorTypes.length; i++) {
                    color.data.push({ value: dictionary.color.code[printerSettings.colorTypes[i]], text: dictionary.color.text[printerSettings.colorTypes[i]] })
                }
            }
            
            this.setState({
                paper: Object.assign({}, paper, { current: (paperIndex >= 0) ? paperIndex : 0 }), 
                mode: Object.assign({}, mode, { current: (mode.data.findIndex(element => element.value == endPrintData.duplexMode)) || 0 }),
                color: Object.assign({}, color, { current: ((color.data.findIndex(element => element.value == endPrintData.printColorMode))) >= 0 ? (color.data.findIndex(element => element.value == endPrintData.printColorMode)) : ((printerSettings.colorTypes).indexOf('cmyk') >= 0 ? 1 : 0) }),
                direction: Object.assign({}, direction, { current: (direction.data.findIndex(element => element.value == endPrintData.printDirection)) || 0 }),
                quality: Object.assign({}, quality, { current: ((qualityIndex >= 0) ? qualityIndex : 1)})
            }, function () {
                localStorage.removeItem('printData');
                localStorage.setItem('printData', JSON.stringify(this.state.printSetupData));
                //处理打印类型支持单双面
                if (printerSettings) {
                    let isShowMode = true
                    const duplexModes = printerSettings.paperInfos
                    const duplexModesData = this.state.mode
                    const paperCurrent = ((paperIndex >= 0) ? paperIndex : 0)
                    if(duplexModes[paperCurrent].double == true){
                        isShowMode = true;
                        duplexModesData.current = (duplexModesData.data.findIndex(element => element.value == endPrintData.duplexMode))
                        this.setState({ mode: duplexModesData, isShowMode: true }, function () { })
                    }else{
                        isShowMode = false;
                        this.setState({ mode: duplexModesData, isShowMode: false }, function () { })
                    }
                }
            })
        }
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
            localStorage.removeItem('printDataChg')
            localStorage.setItem('printDataChg', true);
            const currentSetupData = self.state.printSetupData
            const previewSetupData = {
                type: currentSetupData.paperSize,
                direction: currentSetupData.printDirection,
                dpi: currentSetupData.printDpi,
                paper: Utils.dictionary.paper.scale[currentSetupData.paperSize].paper,
                print: Utils.dictionary.paper.scale[currentSetupData.paperSize].print
            }
            self.setState({ printSetupData: currentSetupData, previewSetupData: previewSetupData, redirectBack: true }, function () {
                localStorage.removeItem('printData');
                localStorage.removeItem('previewSetupData');
                localStorage.setItem('printData', JSON.stringify(currentSetupData));
                localStorage.setItem('previewSetupData', JSON.stringify(previewSetupData));
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
            Cookies.remove('admin');
            localStorage.removeItem('printer')
            localStorage.removeItem('printPreviewData')
            localStorage.removeItem('chooseTaskInfo')
            localStorage.removeItem('printData');
            localStorage.removeItem('previewSetupData');
        }, function (resp) {});
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
    }
    
    handleChildChange(range) {
        const self = this
        if (range) {
            let tmpPrintData = Object.assign({}, self.state.printSetupData, { printStartPage: range[0], printEndPage: range[1]  })
            let printCountData = Object.assign({}, self.state.printCountData, { 'statusPage': true, 'startPage': range[0], 'endPage': range[1]})
            localStorage.removeItem('printRange')
            localStorage.setItem('printRange', range)
            localStorage.removeItem('printCountData')
            localStorage.setItem('printCountData', JSON.stringify(printCountData))
            self.setState({ layerView: false, printSetupData: tmpPrintData, printCountData: printCountData }, function () {})
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
                tmpPrintData = Object.assign({}, this.state.printSetupData, { paperSize: value })
                //处理打印类型支持单双面
                if (this.state.printer.printerSettings) {
                    let isShowMode = true
                    const duplexModes = this.state.printer.printerSettings.paperInfos
                    const duplexModesData = this.state.mode
                    if (duplexModes[index].double == true) {
                        isShowMode = true;
                        duplexModesData.current = this.state.mode.current;
                    } else {
                        isShowMode = false;
                        duplexModesData.current = 0;
                        tmpPrintData.duplexMode = 0;
                    }
                    this.setState({mode: duplexModesData, isShowMode: isShowMode,layerView: false, type: type, paper: tmpData , printSetupData: tmpPrintData }, function () {})
                }else{
                    this.setState({ layerView: false, type: type, paper: tmpData , printSetupData: tmpPrintData }, function () {})
                }
                break;
            case 'direction':
                tmpData = Object.assign({}, this.state.direction, { current: index })
                tmpPrintData = Object.assign({}, this.state.printSetupData, { printDirection: value })
                this.setState({ layerView: false, type: type, direction: tmpData , printSetupData: tmpPrintData }, function () {})
                break;
            case 'mode':
                tmpData = Object.assign({}, this.state.mode, { current: index })
                tmpPrintData = Object.assign({}, this.state.printSetupData, { duplexMode: value })
                this.setState({ layerView: false, type: type, mode: tmpData, printSetupData: tmpPrintData }, function () {})
                break;
            case 'quality':
                tmpData = Object.assign({}, this.state.quality, { current: index })
                tmpPrintData = Object.assign({}, this.state.printSetupData, { printDpi: value })
                this.setState({ layerView: false, type: type, quality: tmpData, printSetupData: tmpPrintData }, function () { })
                break;
            case 'color':
                tmpData = Object.assign({}, this.state.color, { current: index })
                tmpPrintData = Object.assign({}, this.state.printSetupData, { printColorMode: value })
                this.setState({ layerView: false, type: type, color: tmpData, printSetupData: tmpPrintData }, function () {})
                break;
            default:
                break;
        }
    }

    // 打印页面设置
    handlePrintPage(total) {
        const self = this
        const printChildrens = []
        const printOptions = []
        for (let i = 1; i <= total + 1; i++) {
            printChildrens.push({
                value: (i > total) ? '' : i,
                label: (i > total) ? '' : i
            })
        }

        for (let j = 1; j <= total + 1; j++) {
            let printOptionsItems = {
                value: (j > total) ? '' : j,
                label: (j > total) ? '' : j,
                children: [{
                    value: '-',
                    label: '-',
                    children: printChildrens
                }]
            }
            printOptions.push(printOptionsItems)
        }

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
            let isShowMode = (self.state.isShowMode == false && type == 'mode' && valueItem == 1) ? false : true;
            result.push(<div key={`page-${indexItem}`} style={{ display: (isShowMode == true) ? 'block' : 'none' }} className={(current == indexItem) ? 'setting-item setting-current' : 'setting-item'} onClick={this.handleLayerClick.bind(this, `${indexItem}`, valueItem, `${type}`)}>{textItem}</div>);
        }
        return result;
    }

    render() {
        const hashHistory = createHashHistory()
        if (this.state.redirectBack) {
            hashHistory.goBack();
        }
        const printCountData = this.state.printCountData
        const totalPage = printCountData.totalPage
        const statusPage = printCountData.statusPage
        const startPage = printCountData.startPage
        const endPage = printCountData.endPage
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
                                    <p className="print-list-title-single print-list-title-single-text omit">{this.state.paper.data.length > 0 ?  this.state.paper.data[this.state.paper.current].text : ''}</p>
                                    <i className="print-list-title-super"></i>
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
                                    <p className="print-list-title-single print-list-title-single-text omit">{this.state.direction.data.length > 0 ? this.state.direction.data[this.state.direction.current].text : ''}</p>
                                    <i className="print-list-title-super"></i>
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
                                    <p className="print-list-title-single print-list-title-single-text omit">{ this.state.mode.data.length > 0 ? this.state.mode.data[this.state.mode.current].text : ''}</p>
                                    <i className="print-list-title-super"></i>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <div>
                        <div className="print-list-wrap-single print-list-wrap-single-tap" onClick={this.handleItemClick.bind(this, 'quality')}>
                            <HBox vAlign="center">
                                <HBox flex={1}>
                                    <Box className="print-list-text-content-single" flex={1}>
                                        <p className="print-list-title-single omit">打印质量</p>
                                    </Box>
                                </HBox>
                                <Box>
                                    <p className="print-list-title-single print-list-title-single-text omit">{ this.state.quality.data.length > 0 ? this.state.quality.data[this.state.quality.current].text : ''}</p>
                                    <i className="print-list-title-super"></i>
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
                                    <p className="print-list-title-single print-list-title-single-text omit">{this.state.color.data.length > 0 ? this.state.color.data[this.state.color.current].text : ''}</p>
                                    <i className="print-list-title-super"></i>
                                </Box>
                            </HBox>
                        </div>
                    </div>
                    <SelectField className="setup-select-field" Name="setup-select-field" columns={this.state.range.columns} options={this.handlePrintPage(totalPage)} onChange={this.handleChildChange.bind(this)} value={(statusPage ? [{ value: startPage, text: startPage }, { value: "-", text: "-" }, { value: endPage, text: endPage }] : [])} placeholder={"所有页面 (" + totalPage + "页) "} unit="页" />
                </Group.List>
            </Group>
            <Layer bottom="0" visible={this.state.layerView}  maskCloseable>
                {this.renderItems(this.state.type)}
            </Layer>
        </div>);
    }
}

export default PreviewSetup;