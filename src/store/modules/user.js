import {login} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userName: '',
    userRole:'',
    userType:'',
    mobile: '',
    tenantId:'',
    email:'',
    loginType:'',
    userId:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLE:(state,userRole) => {
    state.userRole = userRole
    sessionStorage.setItem('userRole',userRole)
  },
  SET_USERTYPE:(state,userType) => {
    state.userType = userType
  },
  SET_USERNAME: (state, userName) => {
    state.userName = userName
    sessionStorage.setItem('userName',userName)
  },
  SET_LOGINTYPE: (state, loginType) => {
    state.loginType = loginType
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_MOBILE: (state, mobile) => {
    state.mobile = mobile
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {mobile, password, loginType} = userInfo
    return new Promise((resolve, reject) => {
      login({mobile: mobile.trim(), password: password, loginType: loginType}).then(response => {
        if (response.data.success){
          const token = response.data.data.token
          const data = response.data.data.userInfo
          commit('SET_TOKEN', token)
          commit('SET_ROLE',data.userRole)
          commit('SET_USERNAME',data.userName)
          setToken(token)
          resolve(response)
        }else {
          console.log(response)
          resolve(response)
        }
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    // return myAdmin Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken()
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    removeToken()
    resetRouter()
    commit('RESET_STATE')
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken()
      commit('RESET_STATE')
      resolve()
    })
  }
  // get user info
  // getInfo({ commit, state }) {
  //   return myAdmin Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response
  //
  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }
  //
  //       const { name, avatar } = data
  //
  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

