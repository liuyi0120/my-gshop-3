
import axios from 'axios'
import qs from 'qs'
import store from '../vuex/store'
import router from '../router'
// 请求超时的全局配置
axios.defaults.timeout = 20000 // 20s
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  const {method, data} = config
  // 如果是携带数据的post请求, 进行处理
  if (method.toLowerCase() === 'post' && data && typeof data === 'object') {
    config.data = qs.stringify(data)
  }
  //如果有tokden，就自动携带
  const token = localStorage.getItem('token_key')
  if (token) {
    config.headers.Authorzation = 'token '+ token
  }
  return config
})

// 添加一个响应拦截器
axios.interceptors.response.use(response => {
  // 返回response中的data数据, 这样请求成功的数据就是data了
  return response.data
}, error => {
  const status =error.response.status
  const msg =error.message
  if (status === 401) {
    //退出登录
    store.dispatch('logout')
    router.replace('/login')
    alert('error.response.data.message')
  }else if(status === 404){
    alert('请求资源不存在')
  }else{
    alert('请求异常: '+ msg )
  }
 
  return new Promise(() => {})
})

export default axios
