import './util/js/rem.js';
import './util/sass/index.scss';
import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import { NavLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import PrintIndex from './pages/index/Index';
import PrintList from './pages/index/PrintList';
import PrintManage from './pages/manage/PrintManage';
import ManageTask from './pages/manage/PrintTask';
import PrintTask from './pages/index/PrintTask.js';
import PrintInk from './pages/manage/PrintInk';
import PreviewSetup from './pages/preview/Setup'; 
import PreviewIndex from './pages/preview/Index';
import logo from './logo.svg';
import printimg from './images/L1000DNW.png';
import printimgNone from './images/Printer_management01.png';
import { ScrollList, Icon, Group, Boxs, List } from 'saltui';
import Header from './pages/components/header/Header'
import Footer from './pages/components/footer/Footer'
// 引入路由
import createHistory from 'history/createBrowserHistory'
import Loading from './util/component/Loading.js';
const history = createHistory()

class App extends Component {
  constructor(){
    super();
    this.state = {
      print: [],
      printCurrent: 0,
      pageLoading: false
    }
  };
  
  componentWillMount() {
    // 注入配置信息
    deli.config({
      noncestr: "abcdefg", // 必填，生成签名的随机串
      appId: "373175764691976192", // 必填，应用ID
      timestamp: "1508755836143", // 必填，生成签名的时间戳
      signature: "26fcd1cab8ff455bfea0ee59a67bf122", // 必填，服务端生成的签名
      jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });

    // 验证签名失败
    deli.error(function (resp) {
      alert(JSON.stringify(resp));
    });
  }
  
  render() {
    return (
      <div className="App" id="page-index">
        <Header></Header>
          <Router>
            <div className="content">
              <Switch>
                <Route path="/" exact component={PrintIndex} />
                <Route path="/printlist" component={PrintList} />
                <Route path="/printtask" component={PrintTask} />
                <Route path="/printmanage" component={PrintManage} />
                <Route path="/managetask" component={ManageTask} />
                <Route path="/printink" component={PrintInk} />
                <Route path="/previewsetup" component={PreviewSetup} />
                <Route path="/previewindex" component={PreviewIndex} />
              </Switch>
            </div>
          </Router>
        <Loading pageLoading={false}></Loading>
      </div>
    );
  }
}

export default App;
