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
        // 屏蔽触摸移动
        document.getElementById('print-ink').addEventListener("touchmove", (e) => {
            this.unableTouchMove(e)
        }, {
            passive: false
        })
        deli.common.navigation.setTitle({
            "title": "墨水信息"
        }, function (data) {}, function (resp) {});
        
        deli.common.navigation.setRight({
            "text": ""
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
        }, function (resp) {});
    }

    // 屏蔽触摸移动
    unableTouchMove(e) {
        e.preventDefault();
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
            <div className="print-ink" id="print-ink">
                <PrintChart chartData={this.state.chartData} percent={this.state.percent} displayLegend="true" location="墨盒信息" borderWidth="100" cutoutPercentage="86" rotation={2.5 * Math.PI} width="10" height="7" legendPosition="bottom" />
                <div className="print-ink-title">墨盒信息</div>
            </div>
        );
    }
}

export default PrintInk;