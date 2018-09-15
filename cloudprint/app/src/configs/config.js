
export const set = 'set$'
export const brandName = 'React' // slogan

// 开发环境默认配置
let _serverIp = 'http://192.168.0.110'//
let _port = '3000'
let _mpURL = 'http://mp.delicloud.xin'
let _convertURL = 'http://convert.delicloud.xin'
let _baseURL = `${_serverIp}:${_port}`
let _mockURL = 'http://192.168.0.88:9201'
let _jssdkURL = 'http://static-pretest.deli/h5/sdk/delicloud.min.js?v=202'
let _globalData = {
  printLoading: false
}

if (process.env.NODE_ENV === 'testing') { // 测试环境
  _serverIp = 'https://eapp.delicloud.xin/cloudprint'
  _mockURL = 'http://192.168.0.88:9201'
  _mpURL = 'http://mp.delicloud.xin'
  _convertURL = 'http://convert.delicloud.xin'
  _baseURL = 'http://convert.delicloud.xin'
  _jssdkURL = 'http://t.static.delicloud.com/h5/sdk/delicloud.min.js?v=test'
}
if (process.env.NODE_ENV === 'production') { // 发布环境
  _serverIp = 'https://eapp.delicloud.com/cloudprint'
  _mpURL = 'http://mp.delicloud.xin'
  _convertURL = 'http://convert.delicloud.xin'
  _baseURL = 'http://convert.delicloud.xin'
  _jssdkURL = 'https://static.delicloud.com/h5/sdk/delicloud.min.js?v=production'
}


export const serverIp = _serverIp
export const path = '/mock'
export const timeout = '15000' // 接口超时限制(ms)
export const mpURL = _mpURL
export const convertURL = _convertURL
export const baseURL = _baseURL
export const mockURL = _mockURL
export const jssdkURL = _jssdkURL
export const globalData = _globalData