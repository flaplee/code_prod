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

    //选择任务打印
    handleItemClick(data) {
        this.props.transFilerList({ fileItemData: data })
    }

    render() {
        const self = this
        let dataIndex = self.statefile
        let dataItem = self.state.file
        return <div key={`page-file-${dataIndex}`} className="task-list-item task-list-item-tap" ref={(input) => { this.fileImgInput = input }} onClick={self.handleItemClick.bind(self, dataItem)}>
            <div className="task-list-item-wrap">
                <HBox vAlign="center">
                    <HBox flex={1}>
                        <Box className="list-item-text-content" flex={1}>
                            <p className="list-item-title t-omit">{dataItem.fileSourceName}</p>
                            <p className="list-item-text t-omit">{dataItem.taskStartTime}</p>
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