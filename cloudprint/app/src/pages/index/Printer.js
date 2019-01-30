import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom'
import Cookies from 'react-cookies'
import printimg from '../../images/L1000DNW@3x.png'
import printimgNone from '../../images/Printer_management01@3x.png'
import { Progress } from 'saltui'
import './Index.scss';
class Printer extends Component {
    constructor(props) {
        super(props);
        const t = this;
        t.state = {
            printer: t.props.printer ? t.props.printer : {},
            printerCurrent: localStorage.getItem('printerCurrent') || 0,
            printerList: {},
            redirect: false,
            current: 0
        };
    }

    handleOnClick(){
        this.setState({ redirect: true });
    }

    componentWillReceiveProps(transProps){
        if (transProps.user && transProps.printer){
            this.setState({
                printer: transProps.printer,
                printerCurrent: transProps.printerCurrent
            }, function() {});
        }
    }

    componentWillUpdate(transProps, transState){
    }

    componentWillMount(props, state){
    }

    render() {
        let printerData = this.state.printer
        let inboxItems = ''
        if (printerData && printerData.hasOwnProperty('inkboxDetails')){
            inboxItems = printerData.inkboxDetails.map((inbox, index) => {
                let inboxItem = inbox.inkboxColors.map((item, i) => {
                    return (
                        <div key={'progress' + i} className={(printerData.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? 'progress-wrap-bar-long progress-wrap-bar-more short-' + item.color + '-bar' : 'progress-wrap-bar-short progress-wrap-bar-more short-' + item.color + '-bar'}>
                            <Progress key={index + 'progress' + i} inbox={inbox} index={index} percent={parseInt(item.tonerRemain)} status={((printerData.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? (item.tonerRemain <= 20 ? 'normal' : 'success') : 'normal')} showInfo={false} strokeWidth={(printerData.inkboxDetails.length == 1 && inbox.inkboxColors.length == 1) ? 14 : 14} />
                        </div>
                    )
                })
                return (
                    <div key={index + 'progress'} className="progress-wrap-bar">
                        {inboxItem}
                    </div>
                );
            });
        }
        
        if (this.state.redirect) {
            return <Redirect push to={
                { pathname: "/printlist", search: "?printercurrent=" + this.state.printerCurrent + "", state: { "printercurrent": this.state.printerCurrent}  }
            } />;
        }
        return (
            <header className="header header-print">
                <div className={(this.state.printer && printerData.workStatus) ? 'print-box' : 'print-box hide'}>
                    <div className="print-wrap">
                        <div className="print-inner">
                            <div className="print-img">
                                <div className="print-img-inner">
                                    <img src={printerData.logo} className="print-img-info" />
                                    <div className={(printerData.workStatus == 'error' ? 'print-img-status print-status-error' : (printerData.onlineStatus == '1' ? 'print-img-status print-status-success' : 'print-img-status print-status-offline'))}></div>
                                </div>
                            </div>
                            <div className={(printerData.inkboxDetails && printerData.inkboxDetails.length == 1 && printerData.inkboxDetails[0].inkboxColors.length == 1) ? 'print-progress' : 'print-progress print-progress-inboxs'} style={{ display: (printerData.onlineStatus != '1') ? 'none' : '' }}>
                                <div className="progress-inbox">
                                    {inboxItems}
                                </div>
                            </div>
                        </div>
                        <div className="print-title">
                            <p className="print-title-sup">{printerData.printerName}</p>
                            <div className="print-title-sub"><i className={(printerData.errorMsg ? 'icon icon-notice' : 'icon')}></i><span>{printerData.errorMsg}</span></div>
                        </div>
                    </div>
                    <div className="print-switch">
                        <a className="print-switch-btn" onClick={this.handleOnClick.bind(this)} href="javascript:;">切换</a>
                    </div>
                </div>
                <div className={(this.state.printer && printerData.workStatus) ? 'print-box hide' : 'print-box'}>
                    <div className="print-wrap">
                        <div className="print-inner">
                            <div className="print-img">
                                <div className="print-img-inner">
                                    <img src={printimgNone} className="print-img-info print-imgNone-info" />
                                    <div className="print-img-status print-status-empty"></div>
                                </div>
                            </div>
                            <div className="print-progress" style={{ display: 'none' }}>
                                <div className="progress-bar bg-success"></div>
                            </div>
                        </div>
                        <div className="print-title">
                            <p className="print-title-sup">尚未添加打印机</p>
                            <div className="print-title-sub"><span>请先为组织添加云打印机设备</span></div>
                        </div>
                    </div>
                    <div className="print-switch" style={{ display: 'none' }}>
                        <a className="print-switch-btn" onClick={this.handleOnClick.bind(this)} href="javascript:;">切换</a>
                    </div>
                </div>
            </header>
        );
    }
}

export default Printer;
