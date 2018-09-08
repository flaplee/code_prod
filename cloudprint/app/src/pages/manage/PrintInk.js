import React, { Component } from 'react'
import 'whatwg-fetch'
import './Print.scss';
import Cookies from 'react-cookies';
import PrintChart from '../../util/component/Chart';
class PrintInk extends React.Component {
    constructor() {
        super();
        this.state = {
            chartData: {},
            percent: Cookies.load('toner'),
            numerator: 1,
            denominator: 36
        }
    }

    componentWillMount() {
        this.getChartData();
    }

    componentDidMount() {
        deli.common.navigation.setTitle({
            "title": "墨水信息"
        }, function (data) {}, function (resp) {});
        
        deli.common.navigation.setRight({
            "text": ""
        }, function (data) {}, function (resp) {});
    }
    
    getChartData() {
        // update data
        this.setState({
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Population',
                        data: this.outPutColor(this.state.denominator)[0],
                        borderColor: 'rgba(217, 228, 250, .2)',
                        backgroundColor: this.outPutColor(this.state.denominator)[1],
                        hoverBackgroundColor: this.outPutColor(this.state.denominator)[1]
                    }
                ]
            },
            percent: Cookies.load('toner')
        }, function () {
            
        });
    }

    outPutColor(count){
        const dataInner = []
        const colorInner = []
        const bgColor = 'rgba(197, 213, 246, 1)'
        const hBgColor = 'rgba(93, 133, 224, 1)'
        const lastColor = Math.round(this.state.percent / 100 * this.state.denominator);
        for (var i = 0; i < count; i++) {
            dataInner.push(1),
            ((i + 1) <= lastColor) ? colorInner.push(hBgColor) : colorInner.push(bgColor)
        }
        return [dataInner, colorInner];
    }

    render() {
        return (
            <div className="print-ink">
                <PrintChart chartData={this.state.chartData} percent={this.state.percent} displayLegend="true" location="墨盒信息" borderWidth="100" cutoutPercentage="86" rotation={2.5 * Math.PI} width="44rem" height="44rem" legendPosition="bottom" />
                <div className="print-ink-title">墨盒信息</div>
            </div>
        );
    }
}

export default PrintInk;