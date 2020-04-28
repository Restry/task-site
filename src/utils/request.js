import axios from '@/js_sdk/gangdiedao-uni-axios'

const isDev = process.env.NODE_ENV === 'development';

let baseURL = isDev ? 'http://192.168.1.125:3000' : '';
// let baseURL = isDev ? 'http://127.0.0.1:3000' : '';

export const BaseURL = baseURL;

/**
 * 请求接口日志记录
 */
function _reqlog(req) {
  if (isDev) {
    console.log("请求地址：" + req.url, req.baseURL, req.data || req.params)
  }
  //TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
  if (isDev) {
    // console.log(`${res.config.url} 响应结果：`, res)
  }
}

// 创建自定义接口服务实例
const http = axios.create({
  baseURL,
  timeout: 60000,  // 不可超过 manifest.json 中配置 networkTimeout的超时时间
  // #ifdef H5
  withCredentials: true,
  // #endif
  headers: {
    'Content-Type': 'application/json',
    //'X-Requested-With': 'XMLHttpRequest',
  },
})

// 拦截器 在请求之前拦截
http.interceptors.request.use(config => {
  // code...
  // 获取本地存储的Cookie
  // const cookie = uni.getStorageSync('cookie')
  // // 设置Cookie
  // config.headers.Cookie = cookie

  // config.withCredentials=true;

  _reqlog(config)
  return config
})

// 拦截器 在请求之后拦截
http.interceptors.response.use(response => {
  _reslog(response)
  // code...
  // 获取cookie
  // let headerStr = JSON.stringify(response.headers)
  // let cookie = (/(?:Set-Cookie).+;/.exec(headerStr)[0]).replace(/Set-Cookie|:|"/g, "")
  // debugger;
  // if (cookie) {
  //     uni.setStorage({
  //         key: 'cookie',
  //         data: cookie.split(';')[0]
  //     })
  // }
  return response
}, error => {
  return Promise.reject(error.message)
})

export default http
