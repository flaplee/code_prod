import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { history } from 'app';
import styled, { css } from 'styled-components';

const Wrap = styled.div`
  display: inline-block;
  font-size: 12px;
  user-select: none;
`;

const size = 30;

const Btn = styled.div`
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  line-height: ${size}px;
  border: 1px solid #dcdcdc;
  border-radius: 3px;
  text-align: center;
  color: ${props => (props.able ? '#666' : '#999')};
  cursor: ${props => (props.able ? 'pointer' : 'default')};
  vertical-align: middle;
  ${props =>
    props.able === false &&
    css`
      background-color: #efefef;
    `};
`;

const Item = styled.div`
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  margin: 0 5px;
  line-height: ${size}px;
  border: 1px solid ${props => (props.select ? '#5d85e0' : '#dcdcdc')};
  color: ${props => (props.select ? '#fff' : '#666')};
  background-color: ${props => (props.select ? '#5d85e0' : 'transparent')};
  border-radius: 3px;
  text-align: center;
  cursor: ${props => (props.select ? 'default' : 'pointer')};
  vertical-align: middle;
`;

const JumpText = styled.div`
  display: inline-block;
  color: #666;
  vertical-align: middle;
`;

const GoPageNum = styled.div`
  display: inline-block;
  margin-left: 1em;
  padding: 0 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  line-height: 2;
  font-size: 12;
  vertical-align: middle;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
`;

const PageNum = styled.input`
  display: inline-block;
  width: 40px;
  height: 27px;
  margin: 0 10px;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #d7d7d7;
  color: #666;
  vertical-align: middle;
`;

const Dots = styled.div`
  display: inline-block;
  margin: 0 10px;
`;

const signUrl = ({ num, localUrl, handleNum }) => {
  let searchObj = qs.parse(history.location.search.slice(1));
  searchObj = {
    ...searchObj,
    page: num,
  };
  const search = `?${qs.stringify(searchObj)}`;
  if (typeof localUrl === 'string') {
    history.push({
      pathname: localUrl,
      search,
      state: {
        noScroll: true,
      },
    });
  }
  handleNum(num);
};

const Num = props => {
  const { num } = props;
  return <Item onClick={() => signUrl(props)}>{num}</Item>;
};

Num.propTypes = {
  num: PropTypes.number.isRequired,
};

const SelectNum = ({ num }) => <Item select>{num}</Item>;

SelectNum.propTypes = {
  num: PropTypes.number.isRequired,
};

const Ellipsis = () => <Dots>...</Dots>;

const NUM = {
  unselect: Num,
  select: SelectNum,
  ellipsis: Ellipsis,
};

class Pagination extends React.Component {
  initState = {
    pageNum: '',
  };

  state = this.initState;

  enterPageNum = pageNum => {
    const { pages } = this.props;
    if (pageNum > pages || pageNum < 1) {
      this.setState({
        pageNum: '',
      });
      return; // break
    }
    this.setState({
      pageNum,
    });
  };

  test = keyCode => {
    if (keyCode === 13) {
      // 13 回车按钮
      this.goPageNum();
    }
  };

  goPageNum = () => {
    const { pageNum } = this.state;
    if (pageNum === '') return;

    const { localUrl, handleNum } = this.props;

    signUrl({ num: parseInt(pageNum, 10), localUrl, handleNum });
    this.setState(this.initState); // reset
  };

  render() {
    const { page, pages, offSet, localUrl, handleNum } = this.props;
    const { pageNum } = this.state;
    if (page === undefined) return null;
    if (pages === undefined || pages === 1 || pages === Infinity) return null;
    const list = [];

    /* eslint-disable no-plusplus */
    for (let num = 1; num <= pages; num++) {
      // 注意优先级
      if (page + offSet === num) {
        list[num] = { type: 'ellipsis' };
      }

      if (page - offSet === num) {
        list[num] = { type: 'ellipsis' };
      }

      if (num < 3 || num > pages - 2) {
        // 首尾 前2页按钮 始终显示
        list[num] = { type: 'unselect', num };
      }

      if (num > page - offSet && num < page) {
        list[num] = { type: 'unselect', num };
      }

      if (num < page + offSet && num > page) {
        list[num] = { type: 'unselect', num };
      }

      if (page === num) {
        list[num] = { type: 'select', num };
      }
    }

    return (
      <Wrap>
        <Btn
          able={page > 1}
          onClick={() => {
            if (page > 1) {
              signUrl({ num: page - 1, localUrl, handleNum });
            }
          }}
        >{` < `}</Btn>
        {list.map((item, i) => {
          const NumRender = NUM[item.type];
          return (
            <NumRender
              key={i.toString()}
              {...item}
              localUrl={localUrl}
              handleNum={handleNum}
            />
          );
        })}
        <Btn
          able={page < pages}
          onClick={() => {
            if (page < pages) {
              signUrl({ num: page + 1, localUrl, handleNum });
            }
          }}
        >{` > `}</Btn>
        <JumpText style={{ marginLeft: '37px' }}>跳转到</JumpText>
        <PageNum
          type="number"
          value={pageNum}
          onKeyUp={e => this.test(e.keyCode)}
          onChange={e => this.enterPageNum(e.target.value.trim())}
        />
        <JumpText>页</JumpText>
        <GoPageNum onClick={this.goPageNum}>Go</GoPageNum>
      </Wrap>
    );
  }
}

Pagination.propTypes = {
  page: PropTypes.number,
  pages: PropTypes.number,
  offSet: PropTypes.number,
  localUrl: PropTypes.any,
  handleNum: PropTypes.func,
};

Pagination.defaultProps = {
  offSet: 5,
  localUrl: false,
  handleNum: () => {},
};

export default Pagination;
