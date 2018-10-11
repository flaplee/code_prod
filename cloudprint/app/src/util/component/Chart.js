import React, { Component } from 'react';
import { defaults, Doughnut, Chart} from 'react-chartjs-2';

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
                ctx.save()
                ctx.translate(x, y)
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])

                // circle
                ctx.save()
                ctx.strokeStyle = '#CCCCCC'
                ctx.rotate(-Math.PI / 2)
                ctx.beginPath()
                ctx.arc(0, 0, Math.round((375 / 750) * document.documentElement.clientWidth / window.dpr), 0, Math.PI * 2, false)
                ctx.stroke()
                ctx.restore()

                // text
                /* ctx.fillStyle = '#000'
                ctx.textAlign = 'left'
                ctx.textBaseline = 'middle'
                ctx.font = '18px arial'
                var text1 = ctx.measureText('剩余')
                console.log("text1", text1.width)
                ctx.fillText('剩余', -text1.width, 0)
                //ctx.restore()
                ctx.fillStyle = '#5d85e0'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.font = '110px arial'
                var text2 = ctx.measureText(self.state.percent)
                ctx.fillText(self.state.percent, text1.width, 0)
                //ctx.restore()
                ctx.fillStyle = '#000'
                ctx.textAlign = 'right'
                ctx.textBaseline = 'middle'
                ctx.font = '18px arial'
                //ctx.fillText('%', 0, 0)
                ctx.fillText('%', text1.width, 0) */
                ctx.fillStyle = '#5d85e0'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.font = '110px arial'
                var text2 = ctx.measureText(self.state.percent)
                ctx.fillText(self.state.percent, 0, 0)
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