import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import { Group, Boxs, List, Layer} from 'saltui';
import Icon from 'salt-icon';
import Cookies from 'react-cookies';
import './Index.scss';
import SelectField from '../components/selectfield/SelectField';
const { HBox, Box } = Boxs;
class PreviewSetup extends React.Component {
    constructor(props){
        super(props)
        const t = this
        t.state = {
            paper: { data: [{ value: 'A4', text: 'A4' }, { value: 'A5', text: 'A5' }], current: 0},
            direction: { data: [{ value: 1, text: '横向' }, { value: 2, text: '纵向' }], current: 0},
            mode: { data: [{ value: 0, text: '单面' }, { value: 1, text: '双面' }, { value: 2, text: '双面短边' }], current: 0},
            color: { data: [{ value: 'singlecolour', text: '黑白' }, { value: 'multicolour', text: '彩色' }], current: 0}, 
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
                        },{
                            value: 2,
                            label: 2
                        }, {
                            value: 3,
                            label: 3
                        }, {
                            value: 4,
                            label: 4
                        }],
                    }]
                }],
                columns: ['开始', '', '结束'],
                value: [1, 1]
            },
            layerView: false,
            type: 'paper',
            PrintSetupData:{
                'fileSource': 'CLOUD',
                'duplexMode': 1,
                'fileSourceUrl': 'http://file.delicloud.xin/deli_POT_Manual.pdf',
                'fileSuffix': 'pdf',
                'taskSource': 'WBE',
                'printerSn':  'DL-M2500ADNW_0000000000000000',
                'printDirection': 1,
                'fileSourceName': 'deli_POT_Manual',
                'printEndPage': 1,
                'pagesPre': 1,
                'copyCount':  1,
                'printDpi': 1200,
                'printPageSize': 'A4',
                'printColorMode': 'black',
                'isPrintWhole':  0,
                'printStartPage': 0
            }
        }
    }

    
    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "设置"
        }, function (data) {}, function (resp) {});

        deli.common.navigation.setRight({
            "text": "确认"
        }, function (data) {
            
            this.setState({PrintSetupData: tmpPrintData }, function () {

            })

        }, function (resp) {});
    }
    

    handleChildChange(range) {
        if (range) {
            this.setState({ range: { value: range } }, function () {
                console.log("~~~~~~~~~value", this.state.range.value);
            });
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
                    //console.log("this.sate.PrintSetupData", this.state.PrintSetupData)
                    Cookies.save('printData', this.state.PrintSetupData)
                })
                break;
            case 'direction':
                tmpData = Object.assign({}, this.state.direction, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printDirection: value })
                this.setState({ layerView: false, type: type, direction: tmpData , PrintSetupData: tmpPrintData }, function () {
                    //console.log("this.sate.PrintSetupData", this.state.PrintSetupData)
                    Cookies.save('printData', this.state.PrintSetupData)
                })
                break;
            case 'mode':
                tmpData = Object.assign({}, this.state.mode, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { duplexMode: value })
                this.setState({ layerView: false, type: type, mode: tmpData, PrintSetupData: tmpPrintData }, function () {
                    //console.log("this.sate.PrintSetupData", this.state.PrintSetupData)
                    Cookies.save('printData', this.state.PrintSetupData)
                })
                break;
            case 'color':
                tmpData = Object.assign({}, this.state.color, { current: index })
                tmpPrintData = Object.assign({}, this.state.PrintSetupData, { printColorMode: value })
                this.setState({ layerView: false, type: type, color: tmpData, PrintSetupData: tmpPrintData }, function () {
                    //console.log("this.sate.PrintSetupData", this.state.PrintSetupData)
                    Cookies.save('printData', this.state.PrintSetupData)
                })
                break;
            default:
                break;
        }
    }

    renderItems(type) {
        const pages = this.state[type].data;
        const result = [];
        for (let i = 0; i < pages.length; i++) {
            let valueItem = pages[i].value;
            let textItem = pages[i].text;
            let indexItem = i;
            result.push(<div key={`page-${i}`} className="setting-item" onClick={this.handleLayerClick.bind(this, `${indexItem}`, `${valueItem}`, `${type}`)}>{textItem}</div>);
        }
        return result;
    }
    render() {
        return (<div className="print-setup">
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
                    <SelectField Name="setup-select-field" columns={this.state.range.columns} options={this.state.range.options} onChange={this.handleChildChange.bind(this)} placeholder={"所有页面("+ this.state.range.count + "页)"} unit="页" />
                </Group.List>
            </Group>
            <Layer bottom="0" visible={this.state.layerView}  maskCloseable>
                {this.renderItems(this.state.type)}
            </Layer>
        </div>);
    }
}

export default PreviewSetup;