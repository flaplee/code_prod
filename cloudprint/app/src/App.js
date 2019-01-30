import './util/js/rem.js';
import './util/sass/index.scss';
import React, { Component } from 'react';
import {
  Router,
  Switch,
  Route,
  Link,
  NavLink
} from 'react-router-dom'
import { withRouter } from 'react-router'
import PrintIndex from './pages/index/Index';
import PrintList from './pages/index/PrintList';
import PrintManage from './pages/manage/PrintManage';
import ManageTask from './pages/manage/PrintTask';
import PrintTask from './pages/index/PrintTask';
import ChooseTask from './pages/index/ChooseTask';
import PrintInks from './pages/manage/PrintInks';
import PreviewSetup from './pages/preview/Setup';
import PreviewIndex from './pages/preview/Index';
import ScanDenied from './pages/scan/Denied';
import ScanUnbind from './pages/scan/Unbind';
import printLogin from './pages/login/Index'
import PrintHelp from './pages/help/PrintHelp';
import PrintAdd from './pages/help/PrintAdd';
import PrintScan from './pages/help/PrintScan';
import PrintPc from './pages/help/PrintPc';
import PrintMobile from './pages/help/PrintMobile';
import logo from './logo.svg';
import printimg from './images/L1000DNW@3x.png';
import printimgNone from './images/Printer_management01@3x.png';
import { ScrollList, Icon, Group, Boxs, List } from 'saltui';
// 引入路由
import { History, createHashHistory } from "history";
import Loading from './util/component/Loading.js';

class App extends Component {
  constructor(){
    super();
    this.state = {
      print: [],
      printCurrent: 0,
      PageContentClass: 'content'
    }
  };

  componentWillMount() {
    if (deli.android){
      this.setState({
        'PageContentClass': 'content print-android'
      })
    }
  }
  
  render() {
    const hashHistory = createHashHistory()
    return (
      <div className="App" id="page-index">
        <Router history={hashHistory}>
          <div className={this.state.PageContentClass}>
            <Switch>
              <Route path="/" exact component={PrintIndex} />
              <Route path="/printlist" component={PrintList} />
              <Route path="/printtask" component={PrintTask} />
              <Route path="/printmanage" component={PrintManage} />
              <Route path="/managetask" component={ManageTask} />
              <Route path="/printinks" component={PrintInks} />
              <Route path="/previewsetup" component={PreviewSetup} />
              <Route path="/previewindex" component={PreviewIndex} />
              <Route path="/choosetask" component={ChooseTask} />
              <Route path="/scandenied" component={ScanDenied} />
              <Route path="/scanunbind" component={ScanUnbind} />
              <Route path="/login" component={printLogin} />
              <Route path="/printhelp" component={PrintHelp} />
              
              <Route path="/printhelpadd" component={PrintAdd} />
              <Route path="/printhelpscan" component={PrintScan} />
              <Route path="/printhelppc" component={PrintPc} />
              <Route path="/printhelpmobile" component={PrintMobile} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
