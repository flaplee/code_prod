import React, { Component } from 'react'
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import './Index.scss';
const { HBox, Box } = Boxs;

class ChooseItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file: props.file,
            index: props.index
        };
    }

    formatDate(time, full, date) {
        let r;
        let t = new Date(time);
        let y = t.getFullYear();
        let m = t.getMonth() + 1;
        let d = t.getDate();
        if (full) {
            r = [t.getHours(), t.getMinutes(), t.getSeconds()];
            if (r[1] < 10) {
                r[1] = '0' + r[1];
            }
            if (r[2] < 10) {
                r[2] = '0' + r[2];
            }
            r = r.join(':');
            r = y + '年' + m + '月' + d + '日' + ' ' + r;
        } else {
            var diff = new Date().Diff('d', t);
            if (diff <= 2 && diff >= -2) {
                r = [t.getHours(), t.getMinutes(), t.getSeconds()];
                if (r[1] < 10) {
                    r[1] = '0' + r[1];
                }
                if (r[2] < 10) {
                    r[2] = '0' + r[2];
                }
                r = r.join(':');
                if (date) {
                    if (diff === 1) {
                        r = '昨天';
                    } else if (diff === 2) {
                        r = '前天';
                    } else if (diff === -1) {
                        r = '明天';
                    } else if (diff === -2) {
                        r = '后天';
                    } else {
                        r = '今天';
                    }
                } else {
                    if (diff === 1) {
                        r = '昨天' + r;
                    } else if (diff === 2) {
                        r = '前天' + r;
                    } else if (diff === -1) {
                        r = '明天' + r;
                    } else if (diff === -2) {
                        r = '后天' + r;
                    } else {
                        r = '今天' + r;
                    }
                }
            } else {
                r = y + '年' + m + '月' + d + '日';
            }
        }
        return r;
    }

    //选择任务打印
    handleItemClick(data) {
        this.props.transFilerList({ fileItemData: data })
    }

    render() {
        const self = this
        let dataIndex = self.state.index
        let dataItem = self.state.file
        return <div key={`page-file-${dataIndex}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, dataItem)}>
            <div className="task-list-item-wrap">
                <HBox vAlign="center">
                    <HBox flex={1}>
                        <Box className="list-item-text-content" flex={1}>
                            <p className="list-item-title t-omit">{dataItem.fileList[0].fileName}</p>
                            <p className="list-item-text t-omit">{self.formatDate(parseInt(dataItem.createTime), true)}</p>
                        </Box>
                    </HBox>
                    <Box>
                        <Icon className="print-list-arrow right" name='direction-right' fill="#ccc" width="7rem" height="3rem" />
                    </Box>
                </HBox>
            </div>
        </div>
    }
}

export default ChooseItem;