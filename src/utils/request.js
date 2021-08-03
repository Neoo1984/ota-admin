import axios from 'axios'
import {MessageBox} from 'element-ui'
import store from '@/store'
import {getToken, setToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API
    // withCredentials: true,
    // timeout: 5000
})
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['Token'] = getToken()
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)
service.interceptors.response.use(response => {
        setToken(response.headers['refresh-token'])
        sessionStorage.setItem('token', response.headers['refresh-token'])
        if (response.status === 200) {
            const data = response.data
          if (data !== null) {
            if (data.errorCode === '200007') {
              MessageBox.confirm(
                '登录过期，请重新登录',
                '确认登出', {
                  confirmButtonText: '重新登录',
                  type: 'warning',
                  showClose: false,
                  showCancelButton: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false
                }
              ).then(() => {
                store.dispatch('user/resetToken').then(() => {
                  location.reload()
                })
              })
              return Promise.reject(new Error(data.message || 'Error'))
              // TODO userType !== '1' 不让登录

            }
          }else {
            this.$message({
              showClose: true,
              message: '获取数据异常！',
              type: 'error'
            })
          }

            return response
        } else {

        }
    }


)
export default service
