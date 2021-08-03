import request from '@/utils/request'
//商铺列表
export function getStoreList(data) {
  return request({
    url: '/tenant/page',
    method: 'post',
    data
  })
}
//厂商列表
export function getFactoryList(data) {
  return request({
    url: '/factory/page',
    method: 'post',
    data
  })
}
//产品列表
export function getProductList(data) {
  return request({
    url: '/product/page',
    method: 'post',
    data
  })
}
//设备device/infoPage
export function getDevice(data) {
  return request({
    url: '/device/infoPage',
    method: 'post',
    data
  })
}
//升级包softupgradepackage/page
export function softList(data) {
  return request({
    url: '/softupgradepackage/page',
    method: 'post',
    data
  })
}
//OTA列表
export function getOtaList(data) {
  return request({
    url: '/task/pageInfo',
    method: 'post',
    data
  })
}
//OTA详情
export function getOtaDetail(data) {
  return request({
    url: `task/pageTaskDetail`,
    method: 'post',
    data
  })
}
//ota ex
export function getExDetail(data) {
  return request({
    url: `task/taskExtPageInfo`,
    method: 'post',
    data
  })
}
//用户列表
export function getUser(data) {
  return request({
    url: `user/page`,
    method: 'post',
    data
  })
}
//子设备详情
export function getSubDevice(name) {
  return request({
    url: `device/queryDeviceInfoByName`,
    method: 'get',
    params:{deviceName:name}
  })
}



