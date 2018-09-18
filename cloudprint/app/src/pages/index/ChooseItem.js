import React, { Component } from 'react'
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import './Index.scss';



const { HBox, Box } = Boxs;

class ChooseItem extends Component{

    //打印任务状态
    handleItemClick(data) {
        console.log("data~~~", data);
        this.props.transFilerList({ fileItemData: data })
    }

    render() {
        const self = this
        let dataIndex = self.props.index
        let dataItem = self.props.file
        return <div key={`page-file-${dataIndex}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, dataItem)}>
            <div className="task-list-item-wrap">
                <HBox vAlign="center">
                    <HBox flex={1}>
                        <Box className="list-item-text-content" flex={1}>
                            <p className="list-item-title t-omit">{dataItem.fileSourceName}</p>
                            <p className="list-item-text t-omit">{dataItem.printerName}</p>
                        </Box>
                    </HBox>
                    <Box>
                        <Icon name="angle-down" width={20} fill="#ccc" className="list-item-arrow" />
                    </Box>
                </HBox>
            </div>
        </div>
    }
}

export default ChooseItem;