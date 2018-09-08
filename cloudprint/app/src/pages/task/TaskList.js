import React, { Component } from 'react'
import { ScrollView } from 'saltui';
import TaskItem from './TaskItem'
import './Task.scss';

function Other1() {
    return <div className="demo-item other1">{'Other1'}</div>;
}

function Other2() {
    return <div className="demo-item other2">{'Other2'}</div>;
}


class TaskList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loading: false,
            refreshing: false,
        };
    }

    onRefresh() {
        this.setState({ refreshing: true });

        setTimeout(() => {
            this.setState({ refreshing: false });
        }, 2000);
    }

    onLoad() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.setState({ page: this.state.page + 1, loading: false });
        }, 2000);
    }

    renderItems() {
        const { page } = this.state;
        const pages = [];

        for (let i = 0; i < page; i++) {
            pages.push(<div key={`page-${i}`}>
                <Other1 />
                <Other2 />
                <TaskItem />
            </div>);
        }

        return pages;
    }

    render() {
        return (<div >
            <div className="container">
                <ScrollView
                    infiniteScroll
                    refreshControl
                    refreshControlOptions={{
                        refreshing: this.state.refreshing,
                        onRefresh: this.onRefresh.bind(this),
                    }}

                    infiniteScrollOptions={{
                        loading: this.state.loading,
                        onLoad: this.onLoad.bind(this),
                    }}
                    className="scroll-view-demo"
                >

                    {this.renderItems()}
                </ScrollView>
            </div>
        </div>);
    }
}

export default TaskList;