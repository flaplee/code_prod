import React, { Component } from 'react'
import { render } from 'react-dom'
import { Redirect } from 'react-router-dom';
import printimg from '../../images/L1000DNW@3x.png'
import printimgNone from '../../images/Printer_management01@3x.png'
import { Progress } from 'saltui';
import './Index.scss';
class Printer extends Component {
    constructor(props) {
        super(props);
        const t = this;
        t.state = {
            printer: {},
            inkbox: {
                percent: 0
            },
            printerList: {},
            redirect: false,
            current: 0
        };
        console.log("printer props", props)
        //t.props.transPrinter({'printCurrent':0});
    }

    handleOnClick(){
        this.setState({ redirect: true });
    }

    componentWillReceiveProps(transProps){
        console.log("transProps", transProps)
        if (transProps.user && transProps.printer && transProps.inkbox){
            this.setState({
                printer: transProps.printer,
            }, function() {
                console.log("test4")
                if (transProps.inkbox.inkboxColors){
                    this.setState({
                        inkbox: {
                            percent: parseInt(transProps.inkbox.inkboxColors[0].tonerRemain)
                        }
                    }, function () {
                        console.log("test5")
                    });
                }
            });
            /* this.setState({
                user: transProps.user,
                printerList: transProps.printer.printList.rows,
                current: transProps.printer.printCurrent
            });
            if (transProps.printer.printList.rows.length > 0){
                this.setState({
                    printer: transProps.printer.printList.rows[transProps.printer.printCurrent]
                });
            } */
        }
    }

    componentWillUpdate(transProps, transState){
        console.log("componentWillUpdate", transProps)
        console.log("transState", transState)
    }

    componentWillMount(props, state){
        console.log("props", props)
        console.log("state", state)
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={
                { pathname: "/printlist", search: "", state: {}  }
            } />;
        }
        return (
            <header className="header header-print">
                <div className={this.state.printer.workStatus ? 'print-box' : 'print-box hide'}>
                    <div className="print-wrap">
                        <div className="print-inner">
                            <div className="print-img">
                                <div className="print-img-inner">
                                    <img src={printimg} className="print-img-info" />
                                    <div className={(this.state.printer.workStatus == 'error' ? 'print-img-status print-status-error' : (this.state.printer.onlineStatus == 1 ? 'print-img-status print-status-success' : 'print-img-status print-status-offline'))}></div>
                                </div>
                            </div>
                            <div className="print-progress">
                                <div className="progress-bar bg-success">
                                    <Progress percent={this.state.inkbox.percent} status={this.state.inkbox.percent <= 20 ? 'normal' : 'success'} showInfo={false} />
                                </div>
                            </div>
                        </div>
                        <div className="print-title">
                            <p className="print-title-sup">{this.state.printer.printerName}</p>
                            <div className="print-title-sub"><i className="icon icon-notice"></i>{this.state.printer.errorMsg}</div>
                        </div>
                    </div>
                    <div className="print-switch">
                        <a className="print-switch-btn" onClick={this.handleOnClick.bind(this)} href="javascript:;">切换</a>
                    </div>
                </div>
                <div className={this.state.printer.workStatus ? 'print-box hide' : 'print-box'}>
                    <div className="print-wrap">
                        <div className="print-inner">
                            <div className="print-img">
                                <div className="print-img-inner">
                                    <img src={printimgNone} className="print-img-info" />
                                    <div className="print-img-status print-status-empty"></div>
                                </div>
                            </div>
                            <div className="print-progress" style={{ display: 'none' }}>
                                <div className="progress-bar bg-success"></div>
                            </div>
                        </div>
                        <div className="print-title">
                            <p className="print-title-sup">尚未添加打印机</p>
                            <div className="print-title-sub">请先为组织添加云打印机设备</div>
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
