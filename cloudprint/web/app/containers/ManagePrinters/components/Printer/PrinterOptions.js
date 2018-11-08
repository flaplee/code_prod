import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrap = styled.div`
  position: relative;
  width: 300px;
  line-height: 30px;
  background-color: #e4edff;
  cursor: pointer;
`;

const Value = styled.div`
  padding: 0 15px;
`;

const Arrow = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -3px;
  border-style: solid;
  border-color: #333 transparent transparent;
  border-width: 6px 5px 0;
  transition: 0.3s;
  transform: rotate(${props => (props.drop === true ? 0 : '90deg')});
`;

const List = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  transform-origin: 0 0;
  transition: 0.3s;
  transform: scaleY(${props => (props.drop === true ? 1 : 0)});
`;

const Item = styled.div`
  padding: 0 15px;
  line-height: 2;
  background-color: #e4edff;
  &:hover {
    background-color: #cedaf6;
  }
`;

class PrinterOptions extends React.PureComponent {
  state = {
    drop: false,
  };

  toggle = () => {
    document.addEventListener('click', this.closeAll, false);
    this.setState(prevState => ({ drop: !prevState.drop }));
  };

  closeAll = () => {
    document.removeEventListener('click', this.closeAll, false);
    this.setState({
      drop: false,
    });
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.closeAll, false);
  }
  render() {
    const { data, current, makeSelect } = this.props;
    const { drop } = this.state;
    return (
      <Wrap onClick={this.toggle}>
        <Value>{current.printerName}</Value>
        {
          <List drop={drop}>
            {data
              .filter(item => item.printerSn !== current.printerSn)
              .map((item, i) => (
                <Item onClick={() => makeSelect(item)} key={i.toString()}>
                  {item.printerName}
                </Item>
              ))}
          </List>
        }
        {data.length > 1 && <Arrow drop={drop} />}
      </Wrap>
    );
  }
}

PrinterOptions.propTypes = {
  data: PropTypes.any.isRequired,
  current: PropTypes.any.isRequired,
  makeSelect: PropTypes.func.isRequired,
};

export default PrinterOptions;
