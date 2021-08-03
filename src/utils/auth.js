import Cookies from 'js-cookie'

const TokenKey = 'admin'

export function getToken() {
  return sessionStorage.getItem('token')
  // return Cookies.get(TokenKey)
}

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
  // }
export function setToken(token){
  sessionStorage.setItem('token',token)
}
export function removeToken() {
  sessionStorage.removeItem('token')
  // return Cookies.remove(TokenKey)
}
