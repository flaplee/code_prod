/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import styled from 'styled-components';

import chartRegister from './chartRegister';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  line-height: 360px;
  text-align: center;
`;

const Center = styled.div`
  display: inline-block;
  width: 200px;
  height: 200px;
  line-height: 1;
  vertical-align: middle;
`;

class PrinterChart extends React.PureComponent {
  canvasRef = React.createRef();

  render() {
    return (
      <Wrap>
        <Center>
          <canvas ref={this.canvasRef} width="100" height="100" />
        </Center>
      </Wrap>
    );
  }

  componentDidMount() {
    const { data } = this.props;

    const { tonerRemain } = (data && data.inkboxColors[0]) || {
      inkboxColors: [
        {
          tonerRemain: '0',
        },
      ],
    };
    const ctx = this.canvasRef.current;

    const config = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [tonerRemain, (100 - tonerRemain).toFixed(2)],
            backgroundColor: ['#5D85E0', '#F2F8FF'],
            label: 'Dataset 1',
          },
        ],
        labels: ['墨粉剩余量', '墨粉耗费量'],
      },
      options: {
        cutoutPercentage: 70,
        legend: {
          position: 'center',
        },
        title: {
          display: true,
          text: '墨量信息',
          position: 'bottom',
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
        elements: {
          center: {
            text: `${tonerRemain}%`,
            color: '#5D85E0',
          },
        },
      },
    };

    Chart.pluginService.register(chartRegister);

    new Chart(ctx, config);
  }
}

PrinterChart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PrinterChart;
