import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

const Center = styled.div`
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
`;

const Title = styled.div`
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
`;

const Box = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 0 20px;
`;

const Color = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 0 5px;
`;

const Volume = styled.div`
  color: #333;
  margin-bottom: 0.5em;
`;

const RectangleWrap = styled.div`
  position: relative;
  display: inline-block;
  color: ${props => (props.warn ? 'red' : '#999')};
`;

const Rectangle = styled.div`
  width: 20px;
  height: 200px;
  background-color: #eaeaea;
  border-style: solid;
  border-width: 1px;
  border-color: ${props => (props.warn ? 'red' : '#eaeaea')};
  &&::after {
    content: ' ';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${props => props.num}%;
    background-color: ${props => props.color};
  }
`;

const Tip = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  line-height: 200px;
  vertical-align: middle;
  z-index: 3;
`;

const TipText = styled.div`
  display: inline-block;
  line-height: 1.3;
  vertical-align: middle;
  font-size: 12px;
`;

const Label = styled.div`
  color: #333;
  margin-top: 0.5em;
`;

const Chart = ({ inkboxDetails, warningValue }) => {
  const A = ({ list }) =>
    list.map((item, i) => {
      const warn = () => {
        if (item.tonerRemain + 0 === 0) {
          return true;
        }
        return false;
      };

      const TipRender = () => {
        if (item.tonerRemain + 0 === 0) {
          return (
            <Tip>
              <TipText>墨量已耗尽</TipText>
            </Tip>
          );
        }
        if (item.tonerRemain < warningValue) {
          return (
            <Tip>
              <TipText>墨量即将耗尽</TipText>
            </Tip>
          );
        }
        return null;
      };

      return (
        <Color key={i.toString()}>
          <Volume>{parseInt(item.tonerRemain, 10)}%</Volume>
          <RectangleWrap warn={warn()}>
            <Rectangle
              warn={warn()}
              num={item.tonerRemain}
              color={item.colorRGB}
            />
            <TipRender />
          </RectangleWrap>
          <Label>{item.colorName}</Label>
        </Color>
      );
    });
  const D = () =>
    inkboxDetails.map((item, i) => (
      <Box key={i.toString()}>
        <A list={item.inkboxColors} />
      </Box>
    ));
  return (
    <Wrap>
      <Center>
        <Title>墨量信息</Title>
        <D />
      </Center>
    </Wrap>
  );
};

Chart.propTypes = {
  inkboxDetails: PropTypes.any.isRequired,
  warningValue: PropTypes.any.isRequired,
};

export default Chart;
