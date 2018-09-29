;
(function() {
    var shareConfig = {
        /*text: "我是对话框标题",*/
        title: "得力分享demo",
        desc: "得力分享内容",
        link: "http://www.nbdeli.com/",
        img_url: "http://www.nbdeli.com/formwork/default/images/logo.gif"
    };
    // 注入配置信息
    deli.config({
        noncestr: "abcdefg", // 必填，生成签名的随机串
        appId: "373175764691976192", // 必填，应用ID
        timestamp: "1508755836143", // 必填，生成签名的时间戳
        signature: "26fcd1cab8ff455bfea0ee59a67bf122", // 必填，服务端生成的签名
        jsApiList: ['common.navigation.setTitle', 'common.navigation.setRight', 'common.navigation.close', 'common.image.upload', 'common.image.preview', 'common.location.open', 'common.location.get', 'common.message.share', 'common.phone.vibrate', 'common.connection.getNetworkType', 'common.phone.getUUID', 'common.phone.getInterface', 'app.device.bind', 'app.user.telephoneCall', 'app.user.chatOpen', 'app.user.select', 'app.department.select'] // 必填，需要使用的jsapi列表
    });
    var Page = {
        init: function() {
            var that = this;
            var i = 0, j = 0, num;
            $("[data-type]").on("click", function(a) {
                var d = $(a.target),
                    e = d.attr("data-type");
                switch (e) {
                    //蓝牙接口
                    case "bluetoothOpen":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.open',
                            'data':{
                                'name':'device.bluetooth.open'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothClose":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.close',
                            'data':{
                                'name':'device.bluetooth.close'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothstartScan":
                        var scan = 1;
                        var start_event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': start_event_id,
                            'api':'device.bluetooth.startScan',
                            'data':{
                                'name':'device.bluetooth.startScan'
                            }
                        },function(data){
                            if(scan == 1){
                                if(data.event_id == start_event_id){
                                    deli.common.notification.prompt({
                                        "type": 'success', // loading, success, error, warning
                                        "text": JSON.stringify(data), //提示信息
                                        "duration": 2 //提示时间,单位为秒
                                    },function(data){
                                    },function(resp){});
                                }
                                scan = 0;
                            }
                        },function(resp){
                            if(resp.event_id == start_event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothStopScan":
                        var stop_event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': stop_event_id,
                            'api':'device.bluetooth.stopScan',
                            'data':{
                                'name':'device.bluetooth.stopScan'
                            }
                        },function(data){
                            if(data.event_id == stop_event_id){
                                deli.common.notification.prompt({
                                    "type": 'success', // loading, success, error, warning
                                    "text": JSON.stringify(data), //提示信息
                                    "duration": 2 //提示时间,单位为秒
                                },function(data){
                                },function(resp){});
                            }
                        },function(resp){
                            if(resp.event_id == stop_event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothGetScanList":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.getScanList',
                            'data':{
                                'name':'device.bluetooth.getScanList'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothGetPairedList":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.getPairedList',
                            'data':{
                                'name':'device.bluetooth.getPairedList'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothStatus":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.status',
                            'data':{
                                'name':'device.bluetooth.status'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothConnect":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.connect',
                            'data':{
                                'name':'蓝牙名称',
                                'device_id':'4507799C-0A0C-D6FB-279A-B99260CAC7EA',//0DEDC17E-225A-DE89-F419-05F2B1B89BF1
                                'status':''
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothDisconnect":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.disconnect',
                            'data':{
                                'name':'蓝牙名称',
                                'device_id':'4507799C-0A0C-D6FB-279A-B99260CAC7EA',//0DEDC17E-225A-DE89-F419-05F2B1B89BF1
                                'status':''
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothGetService":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.getService',
                            'data':{
                                'name':'蓝牙名称',
                                'device_id':'0DEDC17E-225A-DE89-F419-05F2B1B89BF1'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothBindService":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.bindService',
                            'data':{
                                'name':'蓝牙名称',
                                'device_id':'0DEDC17E-225A-DE89-F419-05F2B1B89BF1',
                                'service_id': 'F0001130-0451-4000-B000-000000000000',
                                'characteristic_id': 'F0001131-0451-4000-B000-000000000000'
                            }
                        },function(data){
                            alert(JSON.stringify(data));
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            alert(JSON.stringify(data));
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "bluetoothSend":
                        num = j++;
                        var event_id = (Date.now().toString());
                        var strArr = ['02010619fffe7d444c5a4d000401010101baa5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d0100b3a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d0400b6a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d050105bda5a5a5a5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d050100b8a5a5a5a5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d0600b8a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5',
                            '02010619fffe7d444c5a4d0600b8a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5'];
                        alert(strArr[num%(strArr.length)]);
                        deli.device.sdk.api({
                            'sdk_key':'bluetooth',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.bluetooth.sendData',
                            'data':{
                                'name':'蓝牙名称',
                                'device_id':'0DEDC17E-225A-DE89-F419-05F2B1B89BF1',
                                'value': strArr[num%(strArr.length)]
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;

                    //ibeacon接口
                    case "ibeaconStartSearch":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'ibeacon',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.ibeacon.startSearch',
                            'data':{
                                'name':'device.ibeacon.startSearch'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "ibeaconStopSearch":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'ibeacon',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.ibeacon.stopSearch',
                            'data':{
                                'name':'device.ibeacon.stopSearch'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "ibeaconGetSearch":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.api({
                            'sdk_key':'ibeacon',
                            'sdk_version':'1.0.0',
                            'event_id': event_id,
                            'api':'device.ibeacon.getSearch',
                            'data':{
                                'name':'device.ibeacon.getSearch'
                            }
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    
                    // bluetooth
                    case "devicebluetoothsdkinit":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.init({
                            'sdk_key':['bluetooth'],
                            'sdk_version':'1.0.0',
                            'event_id': event_id
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    case "devicebluetoothsdkdestory":
                        var event_id = (Date.now().toString());
                        deli.device.sdk.destory({
                            'sdk_key':['bluetooth'],
                            'sdk_version':'1.0.0',
                            'event_id': event_id
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;

                    // ibeacon
                    case "deviceibeaconsdkinit":
                        deli.device.sdk.init({
                            'sdk_key':['ibeacon','bluetooth'],
                            'sdk_version':'1.0.0',
                            'event_id':(Date.now().toString())
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                    
                    case "deviceibeaconsdkdestory":
                        deli.device.sdk.destory({
                            'sdk_key':['ibeacon','bluetooth'],
                            'sdk_version':'1.0.0',
                            'event_id':(Date.now().toString())
                        },function(data){
                            if(data.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        },function(resp){
                            if(resp.event_id == event_id){
                                alert(JSON.stringify(data));
                            }
                        });
                    break;
                }
            });
        }
    };
    Page.init();
    // 验证签名成功
    deli.ready(function() {
    });
    // 验证签名失败
    deli.error(function(resp) {
        alert(JSON.stringify(resp));
    });
})();