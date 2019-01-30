import 'whatwg-fetch'
import Cookies from 'react-cookies'
import { serverIp, path, baseURL, mpURL, convertURL, timeout, mockURL } from '../../configs/config'
class Util{
    constructor() {
        this.previewSuitClass = 'preview-box'

        this.timer = {
            printerTimer: 0,
            printListTimer: 0,
            convertTimer: 0,
            getNewListTimer: 0
        }

        this.dictionary = {
            paper: {
                code: {
                    'A4': 'A4',
                        'A5': 'A5',
                            'B5(ISO)': 'B5(ISO)',
                                'B5(JIS)': 'B5(JIS)',
                                    'B6(ISO)': 'B6(ISO)',
                                        'B6(JIS)': 'B6(JIS)',
                                            '16K(184x260)': '16K(184x260)',
                                                '16K(197x273)': '16K(197x273)',
                                                    '16K(195x270)': '16K(195x270)',
                                                        '32K': '32K',
                                                            'Executive': 'Executive',
                                                                'Letter': 'Letter',
                                                                    'Legal': 'Legal',
                                                                        'folio': 'folio'
                },
                text: {
                    'A4': 'A4',
                        'A5': 'A5',
                            'B5(ISO)': 'B5(ISO)',
                                'B5(JIS)': 'B5(JIS)',
                                    'B6(ISO)': 'B6(ISO)',
                                        'B6(JIS)': 'B6(JIS)',
                                            '16K(184x260)': '16K(184x260)',
                                                '16K(197x273)': '16K(197x273)',
                                                    '16K(195x270': '16K(195x270',
                                                        '32K': '32K',
                                                            'Executive': 'Executive',
                                                                'Letter': 'Letter',
                                                                    'Legal': 'Legal',
                                                                        'folio': 'folio'
                },
                scale: {
                    'A4': {
                        paper: {
                            width: 8.267,
                                height: 11.692,
                            },
                        print: {
                            width: 7.935,
                                height: 11.36,
                            }
                    },
                    'A5': {
                        paper: {
                            width: 5.826,
                                height: 8.267,
                            },
                        print: {
                            width: 5.494,
                                height: 7.935,
                            },
                    },
                    'B5(ISO)': {
                        paper: {
                            width: 6.929,
                                height: 9.842,
                            },
                        print: {
                            width: 6.597,
                                height: 9.51,
                            },
                    },
                    'B5(JIS)': {
                        paper: {
                            width: 7.165,
                                height: 10.118,
                            },
                        print: {
                            width: 6.833,
                                height: 9.786,
                            },
                    },
                    'B6(ISO)': {
                        paper: {
                            width: 4.921,
                                height: 6.929,
                            },
                        print: {
                            width: 4.589,
                                height: 6.597,
                            },
                    },
                    'B6(JIS)': {
                        paper: {
                            width: 5.039,
                                height: 7.165,
                            },
                        print: {
                            width: 4.7070003,
                                height: 6.833,
                            },
                    },
                    '16K(184x260)': {
                        paper: {
                            width: 7.244,
                                height: 10.236,
                            },
                        print: {
                            width: 6.912,
                                height: 9.904,
                            },
                    },
                    '16K(197x273)': {
                        paper: {
                            width: 7.755,
                                height: 10.748,
                            },
                        print: {
                            width: 7.4230003,
                                height: 10.416,
                            },
                    },
                    '16K(195x270)': {
                        paper: {
                            width: 7.677,
                                height: 10.629,
                            },
                        print: {
                            width: 7.3450003,
                                height: 10.297,
                            },
                    },
                    '32K': {
                        paper: {
                            width: 5.314,
                                height: 7.677,
                            },
                        print: {
                            width: 4.982,
                                height: 7.345,
                            },
                    },
                    'Executive': {
                        paper: {
                            width: 7.165,
                                height: 10.5,
                            },
                        print: {
                            width: 6.833,
                                height: 10.168,
                            },
                    },
                    'Letter': {
                        paper: {
                            width: 8.267,
                                height: 11.692,
                            },
                        print: {
                            width: 7.935,
                                height: 11.36,
                            },
                    },
                    'Legal': {
                        paper: {
                            width: 8.5,
                                height: 14.0,
                            },
                        print: {
                            width: 8.168,
                                height: 13.668,
                            },
                    },
                    'folio': {
                        paper: {
                            width: 8.5,
                                height: 12.992,
                            },
                        print: {
                            width: 8.168,
                                height: 12.66,
                            },
                    }
                }
            },
            mode: {
                code: {
                    0: 0,
                    1: 1
                },
                text: {
                    0: '单面',
                    1: '双面'
                }
            },
            color: {
                code: {
                    'black': 'black',
                    'cmyk': 'cmyk'
                },
                text: {
                    'black': '黑白',
                    'cmyk': '彩色'
                }
            }
        }

        this.loadinger = {
            loadingRT : 0,
            printLoading: false,
            printLoadingText: ''
        }

        this.activePopup = null

        this.popupCount  = 0
    }

    startGetPrinterInfo(params, type){
        const self = this
        const timer = setInterval(() => {
            (type && type == 'printer') ? self.getPrinterInfo(params) : self.getPrintListInfo(params);
        }, (type && type == 'printer') ? 5000 : 3000);
        (type && type == 'printer') ? self.timer.printerTimer = timer : self.timer.printListTimer = timer;
    }

    stopGetPrinterInfo(timer){
        clearInterval(timer)
    }
    
    //查询打印机信息
    getPrinterInfo(params){
        fetch(mpURL + '/app/printer/queryStatus/' + params.sn, {
            method: 'GET',
            timeout: 60000,
            headers: {
                "MP_TOKEN": params.token
            }
        }).then(
            function (response) {
                if (response.status !== 200) {
                    if (typeof params.error === 'function') {
                        params.error()
                    }
                    return;
                }
                response.json().then(function (resp) {
                    if (typeof params.success === 'function') {
                        params.success(resp)
                    }
                });
            }
        ).catch(function (err) {
            if (typeof params.error === 'function') {
                params.error()
            }
        });
    }

    //分页查询打印机任务列表
    getPrintListInfo(params){
        let appData = new FormData();
        appData.append('pageNo', params.page);
        appData.append('pageSize', params.limit);
        appData.append('printerSn', params.sn);
        fetch(mpURL + '/app/printerTask/queryPage', {
            method: 'POST',
            timeout: 60000,
            headers: {
                "MP_TOKEN": params.token
            },
            body: appData
        }).then(
            function (response) {
                if (response.status !== 200) {
                    if(typeof params.error === 'function'){
                        params.error()
                    }
                    return;
                }
                response.json().then(function (json) {
                    if (typeof params.success === 'function') {
                        params.success(json)
                    }
                });
            }
        ).catch(function (err) {
            if (typeof params.error === 'function') {
                params.error()
            }
        });
    }

    goVisible(){
        document.querySelector('html.loading > body').style.visibility = 'visible'
    }

    isContains(w, a){
        if (!(w instanceof Array) || !(a instanceof Array)) return false;
        if (w.length < a.length) return false;
        var wStr = w.toString();
        for (var i = 0, len = a.length; i < len; i++) {
            if (wStr.indexOf(a[i]) == -1) return false;
        }
        return true;
    }

    //获取屏幕dpi
    getDPI(){
        var arrDPI = new Array();
        if (window.screen.deviceXDPI != undefined) {
            arrDPI[0] = window.screen.deviceXDPI;
            arrDPI[1] = window.screen.deviceYDPI;
        }
        else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);    
        }
        return arrDPI;
    }

    timeoutPromise(promise, timeout, error) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(error);
            }, timeout);
            promise.then(resolve, reject);
        });
    }
    
    fetchData(url, options, timeout, error) {
        const self = this
        error = error || 'Timeout error';
        options = options || {};
        timeout = timeout || 10000;
        return self.timeoutPromise(fetch(url, options), timeout, error);
    }

    HTTPGet(url, params, headers) {
        const self = this
        if (params) {
            let paramsArray = [];
            //encodeURIComponent
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return new Promise((resolve, reject) => {
            self.fetchData(url, {
                method: 'GET',
                headers: headers
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        reject({ status: res.status });
                    }
                })
                .then(res => {
                    resolve(res);
                })
                .catch(error => {
                    reject({ status: -1 });
                })
        })

    }

    HTTPPost(url, formData, headers) {
        const self = this
        return new Promise(function (resolve, reject) {
            self.fetchData(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        reject({ status: res.status })
                    }
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    reject({ status: -1 });
                })
        })
    }

    timeoutFetch(url, options, timeout = 60000, timeoutCallBack) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => {
                    reject(new Error('timeout'));
                    if (typeof timeoutCallBack === 'function') {
                        timeoutCallBack();
                    }
                }, timeout)
            )
        ]);
    }

     //显示loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
    showLoading(id, text) {
        const self = this
        document.querySelector('#' + id + ' .text').innerText = (text ? text : '加载中...')
        if (self.loadinger.loadingRT === 0) {
            document.getElementById(id).style.visibility = 'visible'
        }
        self.loadinger.loadingRT = 1
    }

     //关闭loading提示框, 每次调用引用计数＋1所以showLoading和hideLoading必须成对使用
    hideLoading(id) {
        const self = this
        if (self.loadinger.loadingRT > 0) {
            self.loadinger.loadingRT = 0
            if (self.loadinger.loadingRT === 0) {
                document.getElementById(id).style.visibility = 'hidden'
            }
        }
    }

    isLoading () {
        const self = this
        return self.loadinger.loadingRT > 0
    }

    // 弹出框按钮事件
    bindPopup(id, callconfirm, callclose){
        const self = this
        let $elConfirm = document.getElementById('popupsConfirm')
        let $elClose = document.getElementById('popupsClose')
        $elConfirm.addEventListener('click', function (e) {
            e.preventDefault();
            self.bindConfirmPopup(id, callconfirm);
        }, false);
        $elClose.addEventListener('click', function (e) {
            e.preventDefault();
            self.bindCancelPopup(id, callclose);
        }, false);
    }

    // 弹出框取确认钮事件
    bindConfirmPopup(id, callback) {
        const self = this
        self.closePopup(id);
        if (typeof callback === 'function') {
            callback();
        }
    }

    // 弹出框取消按钮事件
    bindCancelPopup(id, callback) {
        const self = this
        self.closePopup(id);
        if (typeof callback === 'function') {
            callback();
        }
    }

    // 设置弹出框进度条
    setPopupProgress(current, count, isReset){
        const self = this
        let $count = document.querySelector('#popups .text .count')
        let $progress = document.querySelector('#popups .progress .progress-wrap-bar .bar-core')
        if (isReset && isReset == true){
            $count.innerHTML = ''
            $progress.style.width = '0%'
        }else{
            $count.innerHTML = '（' + current + '/' + count + '）'
            $progress.style.width = parseInt(current / count * 100) + '%'
        }
    }

    // 显示弹出框
    showPopup(id, param) {
        const self = this
        if (self.activePopup) {
            document.getElementById(self.activePopup).style.display = '';
        } else {
            document.getElementById(id).style.display = 'block';
        }
        self.activePopup = id;
        document.getElementById(id).className = id;
        document.getElementById(id).style.display = 'block';
    }

    // 关闭弹出框
    closePopup(id) {
        const self = this
        var close;
        if (self.activePopup) {
            if (typeof id === 'string') {
                close = id === self.activePopup;
            } else{
                close = true;
            }
            if (close) {
                document.getElementById(self.activePopup).style.display = '';
                close = self.activePopup;
                document.getElementById(id).className = document.getElementById(id).style.display = self.activePopup = '';
                return true;
            }
        }
    }


}
const util = new Util();

export default util;