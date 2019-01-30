import React, { Component } from 'react';
import { defaults, Doughnut, Chart} from 'react-chartjs-2';
import drawimg from '../../images/pointer@3x.png';
class PrintChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartData: props.chartData,
            percent: props.percent,
            width: props.width,
            height: props.height
        }
    }

    componentWillMount() {
        console.log("defaults", defaults);
    }

    componentDidMount(){
        var self = this;
        Chart.defaults.derivedDoughnut = Chart.defaults.doughnut;
        var custom = Chart.controllers.doughnut.extend({
            draw: function (ease) {
                console.log("ease", ease);
                // Call super method first
                Chart.controllers.doughnut.prototype.draw.call(this, ease);
                // Now we can do some custom drawing for this dataset. Here we'll draw a red box around the first point in each dataset
                var meta = this.getMeta();
                var pt0 = meta.data[0];
                console.log("pt0", pt0);
                var x = pt0._view.x;
                var y = pt0._view.y;
                var ctx = this.chart.chart.ctx;
                var ctx_width = Math.round((375 / 750) * document.documentElement.clientWidth / (window.devicePixelRatio || 1));
                var ctx_height = Math.round((790 / 1334) * document.documentElement.clientHeight);
                ctx.save()
                ctx.translate(x, y)
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])
                // circle
                ctx.save()
                ctx.strokeStyle = '#CCCCCC'
                ctx.rotate(-Math.PI / 2)
                ctx.beginPath()
                ctx.arc(0, 0, ctx_width, 0, Math.PI * 2, false)
                ctx.stroke()
                ctx.restore()
                
                //画文本
                // text
                var w = self.state.percent;
                var a = (w == 0 ? 0 : (w != 100 ? w : 100));
                var n = 6;
                var ctx_left_text1 = 0;
                var ctx_left_text3 = 0;
                ctx.fillStyle = '#5d85e0'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.font = '156px arial'
                switch (a) {
                    case 0:
                        n = 6;
                        ctx_left_text1 = ctx_width / 2 - n * 12 / 2 - 5 * 12 * 2 - 1 * 12;
                        ctx_left_text3 = ctx_width / 2 - 2 * 12;
                        break;
                    case 100:
                        n = 20;
                        ctx_left_text1 = ctx_width / 2 - n * 12 / 2 - 5 * 12 * 2 + 1 * 12;
                        ctx_left_text3 = ctx_width / 2 + 2 * 12 * 2;
                        break;
                    default:
                        n = 14;
                        ctx_left_text1 = ctx_width / 2 - n * 12 / 2 - 5 * 12 * 2 - 1 * 12;
                        ctx_left_text3 = ctx_width / 2 + 1 * 12;
                }
                var text2_w = ctx.measureText(a).width
                var text2_h = 9 * 12 / 2
                ctx.fillText(a, 0, 0)
                //ctx.restore()
                ctx.fillStyle = '#4b4b4c'
                ctx.textBaseline = 'bottom'
                ctx.font = '36px arial'
                var text1_w = ctx.measureText('剩余').width
                ctx.fillText('剩余', ctx_left_text1, 100 / 2 - 9 * 12 / 2 + text2_h, 5 * 12)
                //ctx.restore()
                ctx.fillStyle = '#4b4b4c'
                ctx.textBaseline = 'bottom'
                ctx.font = '36px arial'
                var text3_w = ctx.measureText('%').width
                ctx.fillText('%', ctx_left_text3, 100 / 2 - 9 * 12 / 2 + text2_h, 5 * 12)
                ctx.restore()
            }
        });
        Chart.controllers.derivedDoughnut = custom;
        new Chart(document.getElementById('canvas').getContext('2d'), {
            type: 'derivedDoughnut',
            data: self.state.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                title: {
                    display: false,
                    text: self.props.location,
                    position: self.props.legendPosition,
                    fontSize: 25
                },
                legend: {
                    display: false
                },
                tooltips: {
                    borderWidth: self.props.borderWidth,
                    enabled: false,
                },
                cutoutPercentage: self.props.cutoutPercentage,
                rotation: self.props.rotation,
            },
        });
        
        Chart.pluginService.register({
            afterDatasetsDraw: function (chart, easing) {
                // Plugin code.
                console.log("chart", chart);
               /*  var ctx = chart.chart.ctx;
                var img = new Image();
                img.src = drawimg;
                img.onload = function () {
                    ctx.save();//保存状态
                    ctx.translate(Math.round((chart.outerRadius)), Math.round((chart.outerRadius)));//设置画布上的(0,0)位置
                    ctx.rotate((self.state.percent) / 100 * 2 * Math.PI);
                    ctx.translate(- chart.radiusLength,- chart.radiusLength);
                    //ctx.drawImage(img, Math.round((chart.width - img.width) / 2), Math.round((chart.height - img.height) / 2));
                    ctx.drawImage(img, 0, Math.round((chart.outerRadius)/ 2))
                    ctx.restore();//恢复状态
                } */
            }
        });
    }

    render() {
        return (
            <div className="print-ink-chart chart">
                <canvas id="canvas" width={this.state.width} height={this.state.height}></canvas>
            </div>
        )
    }
}

PrintChart.defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: 'bottom',
    location: '墨粉剩余量',
    borderWidth: 10
}

export default PrintChart;