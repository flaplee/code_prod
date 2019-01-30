import React, { Component } from 'react';
import Cookies from 'react-cookies';
import { Progress } from 'saltui';
class ProgressInboxs extends React.Component {

    constructor(props) {
        super(props);
        const t = this;
        t.state = {
            inkboxColors: t.props.inboxs ? t.props.inboxs : {}
        };
    }
    render() {
        const inkboxColors = this.state.inkboxColors
        return (
            <div className="progress-inboxs">
                <div key={'progress'} className="progress-inboxs-bar">
                    <Progress key={'progress'} inbox={{}} index={1} percent={parseInt(inkboxColors.tonerRemain)} status={'normal'} showInfo={true} strokeWidth={34} />
                </div>
            </div>
        );
    }
}

export default ProgressInboxs;