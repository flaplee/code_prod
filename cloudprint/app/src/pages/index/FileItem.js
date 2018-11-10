import React, { Component } from 'react'
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import './Index.scss';

const { HBox, Box } = Boxs;

class FileItem extends Component{

    //打印任务状态
    handleItemClick(item, data) {
        console.log("item~~~", item);
        console.log("data~~~", data);
        this.props.transFilerList({ layerView: true, layerViewData: item, fileItemData: data })
    }

    //打印任务
    renderListItems() {
        const self = this
        const result = []
        let pages = self.state.fileList
        for (let i = 0; i < pages.length; i++) {
            let dataItem = pages[i];
            let text =
                result.push(<div key={`page-file-${i}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, statusInfo[dataItem.taskStatus].value, dataItem)}>
                    <div className="task-list-item-wrap">
                        <HBox vAlign="center">
                            <HBox flex={1}>
                                <Box className="list-item-text-content" flex={1}>
                                    <p className="list-item-title t-omit">{dataItem.fileName}</p>
                                    <p className="list-item-text t-omit">{dataItem.printerName}</p>
                                </Box>
                            </HBox>
                            <Box>
                                <p className="list-item-status t-omit">{statusInfo[dataItem.taskStatus].text}</p>
                                <Icon name="angle-down" width={20} fill="#ccc" className="list-item-arrow" />
                            </Box>
                        </HBox>
                    </div>
                </div>);
        }
        return result;
    }

    render() {
        const self = this
        const statusInfo = {
            'create': {
                text: '未开始',
                value: [5, 4, 6]
            },
            'wating': {
                text: '等待中',
                value: [3, 4, 6]
            },
            'doing': {
                text: '正在打印',
                value: [3, 4, 6]
            },
            'success': {
                text: '打印成功',
                value: [1, 2, 6]
            },
            'fail': {
                text: '打印失败',
                value: [1, 2, 6]
            },
            'cancel': {
                text: '已取消',
                value: [1, 2, 6]
            }
        }
        let dataIndex = self.props.index
        let dataItem = self.props.file
        return <div key={`page-file-${dataIndex}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, statusInfo[dataItem.taskStatus].value, dataItem)}>
            <div className="task-list-item-wrap">
                <HBox vAlign="center">
                    <HBox flex={1}>
                        <Box className="list-item-text-content" flex={1}>
                            <p className="list-item-title t-omit">{dataItem.taskName}</p>
                            <p className="list-item-text t-omit">{dataItem.printerName}</p>
                        </Box>
                    </HBox>
                    <Box>
                        <p className="list-item-status t-omit">{statusInfo[dataItem.taskStatus].text}</p>
                        <Icon name="angle-down" width={20} fill="#ccc" className="list-item-arrow" />
                    </Box>
                </HBox>
            </div>
        </div>
    }
}

export default FileItem;