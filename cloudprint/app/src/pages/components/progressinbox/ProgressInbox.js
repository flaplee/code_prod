import React, { Component } from 'react';
import Cookies from 'react-cookies';
import { Progress } from 'saltui';
class ProgressInbox extends React.Component {

    constructor(props) {
        super(props);
        const t = this;
        t.state = {
            inkboxDetails: t.props.inboxs ? t.props.inboxs : []
        };
    }
    render() {
        let inboxItems = this.state.inkboxDetails.map((inbox, index) => {
            let inboxItem = inbox.inkboxColors.map((item, i) => {
                    return (
                        <div key={'progress' + i} className={(this.state.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? 'progress-wrap-bar-long progress-wrap-bar-more short-' + item.color + '-bar' : 'progress-wrap-bar-short progress-wrap-bar-more short-' + item.color +'-bar' }>
                            <Progress key={index + 'progress' + i} inbox={inbox} index={index} percent={parseInt(item.tonerRemain)} status={((this.state.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? (item.tonerRemain <= 20 ? 'normal' : 'success') : 'normal')} showInfo={false} strokeWidth={(this.state.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? 14 : 14} />
                        </div>
                    )
                })
            return (
                <div key={index + 'progress'} className="progress-wrap-bar">
                    {inboxItem }
                </div>
            );
        });
        return (
            <div className="progress-inbox">
                { inboxItems }
            </div>
        );
    }
}

export default ProgressInbox;