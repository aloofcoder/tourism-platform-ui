import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['Content-Type'] = 'application/json'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response, 'response')
    // if the custom code is not 20000, it is judged as an error.
    if (res.head && res.head.ret !== 0) {
      Message({
        message: res.head.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return res
    }
  },
  error => {
    let msg = ''
    if (error.message.includes('timeout')) {
      msg = '请求超时，请按F5刷新重试！'
    } else if (error.response.status === 504 || error.response.status === 404) {
      msg = '服务器被吃了⊙﹏⊙∥'
    } else if (error.response.status === 403 || error.response.status === 401) {
      msg = '登陆失效，请重新登陆!'
      removeToken()
      router.push(`/login?redirect=${router.currentRoute.fullPath}`)
    } else if (error.response.status === 500) {
      msg = '服务器错误!'
    } else {
      msg = '未知错误!'
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
