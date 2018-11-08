import React, { Component } from 'react'
import Cookies from 'react-cookies';
import { Group, Boxs, List, Layer, ScrollView } from 'saltui';
import Icon from 'salt-icon';
import './Print.scss';



const { HBox, Box } = Boxs;

class TaskItem extends Component{
    
    //打印任务状态
    handleItemClick(data) {
        console.log("data~~~", data);
        console.log("this.props.transTaskerList~~~", this.props.transTaskerList);
        const isAdmin = Cookies.load('admin') || false;
        if (isAdmin == true){
            this.props.transTaskerList({ layerView: true, taskItemData: data })
        }else{
            if (data.whetherMe == true) {
                switch (data.printTaskType) {
                    case 'normal':
                        this.props.transTaskerList({ layerView: true, taskItemData: data })
                        break;
                    case 'scan':
                        this.props.transTaskerList({ layerView: true, taskItemData: data })
                        break;
                    case 'virtual':
                        this.props.transTaskerList({ layerView: true, taskItemData: data })
                        break;
                    default:
                        this.props.transTaskerList({ layerView: true, taskItemData: data })
                        break;
                }
            } else {
                //this.props.transTaskerList({ redirect: { previewNav: true } })
            }
        }
    }

    render() {
        let dataIndex = this.props.index
        let dataItem = this.props.task
        let status = ""
        let statusMine = ((dataItem.whetherMe == true) ? '-mine' : '')
        switch (dataItem.taskStatus) {
            case 'create':
                status = 'print-status-waiting' + statusMine +''
                break;
            case 'wating':
                status = 'print-status-waiting' + statusMine +''
                break;
            case 'doing':
                status = 'print-status-printing' + statusMine +''
                break;
            case 'success':
                status = 'print-status-success' + statusMine +''
                break;
            case 'fail':
                status = 'print-status-error' + statusMine +''
                break;
            case 'cancel':
                status = 'print-status-error' + statusMine +''
                break;
            default:
                status = 'print-status-waiting' + statusMine +''
                break;
        }
        return <div key={`page-task-${dataIndex}`} className="task-list-item" onClick={this.handleItemClick.bind(this, dataItem)}>
            <div className={dataItem.whetherMe == true ? 'print-list-wrap-single print-list-wrap-single-tap print-list-wrap-single-success' : 'print-list-wrap-single print-list-wrap-single-tap'}>
                <HBox vAlign="center">
                    <HBox className="task-list-item-before" flex={1}>
                        <p className="print-list-text-info task-list-item-order">{dataIndex}</p>
                        <div name="angle-right" width={20} fill="#ccc" className="print-list-arrow task-list-item-name">
                            <p className="print-list-text-info">{dataItem.whetherMe == true ? '我的打印任务' : dataItem.userName + '的打印任务'}</p>
                        </div>
                    </HBox>
                    <HBox flex={1}>
                        <Box className="print-list-text-content-single" flex={1}>
                            <div className={"print-list-status "+ status +""}></div>
                        </Box>
                    </HBox>
                    <HBox flex={1}>
                        <Box className="print-list-text-content-single" flex={1}>
                            <p className="print-list-text-info">{dataItem.printPageCount}/{dataItem.printPageCount} 页</p>
                        </Box>
                    </HBox>
                    <Box>
                        <Icon className="icon-back" name='angle-down' fill="#5D85E0" width="4rem" height="3rem" />
                    </Box>
                </HBox>
            </div>
        </div>
    }
}


export default TaskItem;