import Mock from 'mockjs';

let Random = Mock.Random;
Mock.mock(/\/home\/index\/getList/g,{
    "data|30":[{
        "url":"@url",
        "title":'@name',
        "imgUrl":Random.image('300x200',Random.hex())
    }]
});

//获取所有所有打印机
Mock.mock(/\/print\/getprintlist/g, {
    "code": 0,
    "data": {
        "printerName": "打印机CC250",
        "printerSn": "PRINTER_CC250_12345",
        "printerType": "PRINTER_CC250",
        "workStatus": "idle",
        "onlineStatus": "0",
        "printerStatus": "create",
        "firmwareVersion": "1.1.1.0.1",
        "errorCode": "4615",
        "errorTime": "158838383",
        "inkboxSn": "123123",
        "inkboxStatus": "normal",
        "macAddress": "192.168.0.139",
        "networkMode": "wifi",
        "printerIp": "172.193.12.11",
        "ssid": "122",
        "wifiPwd": "122",
        "drumRemain": "122",
        "totalPageCount": 10,
        "totalPagerCount": 3,
        "errorPagerCount": 0
    }
});