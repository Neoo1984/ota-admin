import request from '@/utils/request'
//商户新增
export function createStore(data) {
  return request({
    url: 'tenant/save',
    method: 'post',
    data
  })
}

//商户修改
export function updateStore(data) {
  return request({
    url: 'tenant/update',
    method: 'put',
    data
  })
}
//商户删除
export function deleteStore(id) {
  return request({
    url: `tenant/delete/`,
    method: 'delete',
    params:{tenantId:id}
  })
}
//厂商新增
export function createFactory(data) {
  return request({
    url: 'factory/save',
    method: 'post',
    data
  })
}
//厂商修改
export function updateFactory(data) {
  return request({
    url: 'factory/update',
    method: 'put',
    data
  })
}
//厂商删除
export function deleteFactory(id) {
  return request({
    url: `factory/delete`,
    method: 'delete',
    params:{factoryId:id}
  })
}
//厂商名称factory/getFactoryNameList
export function getFactoryNameList() {
  return request({
    url: 'factory/getFactoryNameList',
    method: 'get',
  })
}

//产品新增
export function createProduct(data) {
  return request({
    url: 'product/save',
    method: 'post',
    data
  })
}
//产品update
export function updateProduct(data) {
  return request({
    url: 'product/update',
    method: 'put',
    data
  })
}
//产品信息下拉product/queryProductModelList
export function queryProductModelList(data) {
  return request({
    url: 'product/queryProductModelList',
    method: 'put',
    data
  })
}
//产品删除
export function deleteProduct(id) {
  return request({
    url: `product/delete`,
    method: 'delete',
    params:{productId:id}
  })
}

//设备新增
export function createDevice(data) {
  return request({
    url: 'device/deviceInfoSave',
    method: 'post',
    data
  })
}
//设备update
export function updateDevice(data) {
  return request({
    url: 'device/infoUpdateById',
    method: 'put',
    data
  })
}
//设备删除
export function deleteDevice(id) {
  return request({
    url: `device/delete`,
    method: 'delete',
    params:{deviceId:id}
  })
}
//设备上传
export function massSave(data) {
  return request({
    url: 'device/massSave',
    method: 'post',
    data
  })
}
//设备下载device/massSaveResult
export function downloadFile(query) {
  return request({
    url: 'device/massSaveResult',
    method: 'post',
    params:query,
    responseType:'blob',
  })
}
//设备状态queryDeviceStatus
export function queryDeviceStatus(data) {
  return request({
    url: 'device/queryDeviceStatus',
    method: 'post',
    data
  })
}
//下发ota,command/otaSend
export function otaSend(data) {
  return request({
    url: 'command/otaSend',
    method: 'post',
    data
  })
}
//OTA任务导出表格
export function exportExcel(query,ex) {
  return request({
    url: ex ?'task/outputTaskExtInfo' : 'task/outputTaskDetail',
    method: 'post',
    data:query,
    responseType:'blob',
  })
}

//软件包查询
export function querySoftVersion(data) {
  return request({
    url: 'softupgradepackage/queryHardVersion',
    method: 'post',
    data
  })
}
//cmdPage
export function cmdPage(data) {
  return request({
    url: 'device/cmdPage',
    method: 'post',
    data
  })
}
//升级包新增softupgradepackage/save
export function softSave(data) {
  return request({
    url: 'softupgradepackage/save',
    method: 'post',
    data
  })
}
//升级包update
export function softUpdate(data) {
  return request({
    url: 'softupgradepackage/update',
    method: 'put',
    data
  })
}
//升级包删除
export function deleteSoft(id) {
  return request({
    url: `softupgradepackage/delete`,
    method: 'delete',
    params:{objectId:id}
  })
}

//OTA任务
export function otaTask(data) {
  return request({
    url: `task/createTask`,
    method: 'post',
    data
  })
}
//添加用户
export function addUser(data) {
  return request({
    url: `user/add`,
    method: 'post',
    data
  })
}
//修改用户
export function updateUser(data) {
  return request({
    url: `user/updateUserInfo`,
    method: 'put',
    data
  })
}
//注销/恢复 用户
export function operateUser(data) {
  return request({
    url: `user/operateUser`,
    method: 'post',
    data
  })
}
//查询设备数据
export function deviceData(deviceName) {
  return request({
    url: `device/queryDeviceData`,
    method: 'get',
    params:{deviceName:deviceName}
  })
}
// 刷新设备
export function operateTask(data) {
  return request({
    url: `task/operateTask`,
    method: 'post',
    data
  })
}
export function refreshDevice(deviceName) {
  return request({
    url: `device/refreshDeviceData`,
    method: 'get',
    params:{deviceName:deviceName}
  })
}
//设备指令查询
export function commandResult(id) {
  return request({
    url: `command/queryCommandResult`,
    method: 'get',
    params:{messageId:id}
  })
}
//告警 查询 device/queryEventInfo
export function getWarning(deviceName) {
  return request({
    url: `device/queryEventInfo`,
    method: 'get',
    params:{deviceName:deviceName}
  })
}


