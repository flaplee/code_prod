import React, { Component } from 'react'
import { ScrollView } from 'saltui';
import './Task.scss';

class TaskItem extends React.Component {
    static defaultProps = {
        index: 0,
        name: 'name',
    };

    render() {
        return <div className="demo-item">{`${this.props.index} ${this.props.name}`}</div>;
    }
}

export default TaskItem;