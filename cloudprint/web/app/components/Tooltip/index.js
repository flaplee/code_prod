/**
 * place: top(default) right bottom left
 * type: dark(default) success warning error info light
 * effect: float solid(default)
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, ThemeProvider } from 'styled-components';
import placeCss, { float as floatCss, common } from './place';

const TYPE = {
  dark: {
    bg: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
  },
  success: {
    bg: '#8DC572',
    color: '#fff',
  },
  warning: {
    bg: '#F0AD4E',
    color: '#fff',
  },
  error: {
    bg: '#BE6464',
    color: '#fff',
  },
  info: {
    bg: '#337AB7',
    color: '#fff',
  },
  light: {
    bg: '#fff',
    color: '#333',
  },
};

const TipBox = styled.div`
  ${({ effect, place }) =>
    effect === 'solid'
      ? css`
          ${placeCss[place || 'top']};
          ${common};
        `
      : floatCss};
`;

const tooltip = WrappedComponent => {
  class Tip extends React.PureComponent {
    tipRef = React.createRef();

    state = {
      show: false,
    };

    componentDidMount() {
      const { effect } = this.props;

      const wrapEle = this.tipRef.current && this.tipRef.current.parentNode;

      if (effect === 'solid') {
        wrapEle.addEventListener('mouseover', this.showTip, false);
      }

      if (effect === 'float') {
        wrapEle.addEventListener('mousemove', this.floatTip, false);
      }

      wrapEle.addEventListener('mouseleave', this.hideTip, false);
    }

    componentWillUnmount() {
      const { effect } = this.props;

      const wrapEle = this.tipRef.current && this.tipRef.current.parentNode;

      if (effect === 'solid') {
        wrapEle.removeEventListener('mouseover', this.showTip, false);
      }

      if (effect === 'float') {
        wrapEle.removeEventListener('mousemove', this.floatTip, false);
      }

      wrapEle.removeEventListener('mouseleave', this.hideTip, false);
    }

    adjustPosition = () => {
      const tipEle = this.tipRef.current;

      const { place } = this.props;

      if (place === 'top' || place === 'bottom') {
        tipEle.style.left = `-${(tipEle.clientWidth -
          tipEle.parentNode.clientWidth) /
          2}px`;
      }

      if (place === 'left' || place === 'right') {
        tipEle.style.top = `-${(tipEle.clientHeight -
          tipEle.parentNode.clientHeight) /
          2}px`;
      }
    };

    showTip = () => {
      this.adjustPosition();

      this.setState({
        show: true,
      });
    };

    floatTip = e => {
      const { clientX, clientY } = e;
      const tipEle = this.tipRef.current;
      tipEle.style.left = `${clientX - tipEle.clientWidth / 2}px`;
      tipEle.style.top = `${clientY - tipEle.clientHeight}px`;

      this.setState({
        show: true,
      });
    };

    hideTip = () => {
      this.setState({
        show: false,
      });
    };

    render() {
      const { children, tip, theme, place, effect } = this.props;
      const { show } = this.state;
      return (
        <ThemeProvider theme={theme}>
          <WrappedComponent>
            {children}
            <TipBox show={show} effect={effect} place={place} ref={this.tipRef}>
              {tip}
            </TipBox>
          </WrappedComponent>
        </ThemeProvider>
      );
    }
  }

  Tip.defaultProps = {
    theme: {
      type: TYPE.dark,
    },
    place: 'top',
    effect: 'solid',
  };

  Tip.propTypes = {
    theme: PropTypes.object,
    place: PropTypes.string,
    effect: PropTypes.string,
    children: PropTypes.node.isRequired,
    tip: PropTypes.string.isRequired,
  };

  return Tip;
};

export default tooltip;
