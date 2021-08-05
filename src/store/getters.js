const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userRole: state => state.user.userRole || sessionStorage.getItem('userRole'),
  userName: state => state.user.userName || sessionStorage.getItem('userName'),
  userType: state => state.user.userType,
  mobile: state => state.user.mobile,
  userId: state => state.user.userId,
}
export default getters
