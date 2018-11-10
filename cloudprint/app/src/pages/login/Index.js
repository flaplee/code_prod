import React from 'react';
import Cookies from 'react-cookies'
import './Index.scss';
import computerImg from '../../images/computer.png'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
// 引入路由
import { History, createHashHistory } from "history";
export default class Virtualprintlogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskCode: (new URLSearchParams(props.location.search)).get('taskCode') || '',
            redirectIndexNav: false
        };
    }

    handleOnClick(type){
        const self = this
        let taskCode = self.state.taskCode;
        let argee = (type && type=='confirm') ? 1 : 0;
        let loginData = new FormData();
        //loginData.append();
        //登陆授权
        fetch(mpURL + '/v1/app/user/loginAsk/reply/' + taskCode + '_' + argee +'', {
            method: 'POST',
            headers: {
                "MP_TOKEN": Cookies.load('token'),
            },
            body: {}
        }).then(
            function (response) {
                if (response.status !== 200) {
                    deli.common.notification.hidePreloader();
                    deli.common.notification.prompt({
                        "type": "error",
                        "text": '网络错误，请重试',
                        "duration": 2
                    }, function (data) { }, function (resp) { });
                    return;
                }
                response.json().then(function (json) {
                    deli.common.notification.hidePreloader();
                    if (json.code == 0) {
                        deli.common.notification.prompt({
                            "type": "success",
                            "text": '授权成功',
                            "duration": 2
                        }, function (data) {}, function (resp) {});
                    } else {
                        deli.common.notification.prompt({
                            "type": "error",
                            "text": json.msg,
                            "duration": 2
                        }, function (data) {}, function (resp) {});
                    }
                    self.setState({ redirectIndexNav: true }, function () {});
                });
            }
        ).catch(function (err) {
            deli.common.notification.hidePreloader();
            deli.common.notification.prompt({
                "type": "error",
                "text": '网络错误，请重试',
                "duration": 2
            }, function (data) {}, function (resp) {});
        });
    }
    
    handleOnConfirm() {

    }
    render(){
        const hashHistory = createHashHistory()
        if (this.state.redirectIndexNav) {
            hashHistory.goBack();
        }
        return (
            <div className="virtual-print-login">
                <div className="img-wrap">
                    <img src={computerImg} width="183" height="123"/>
                </div>
                <div className="text">
                    PC端智慧办公室管理后台登录确认
                </div>
                <div className="bottom-btn">
                    <div className="btn confirm-btn" onClick={this.handleOnClick.bind(this, 'confirm')}>
                    确认登录
                </div>
                    <div className="btn cancel-btn" onClick={this.handleOnClick.bind(this, 'cancel')}>
                    取消登录
                </div>
                </div>
            </div>
        )
    }
}