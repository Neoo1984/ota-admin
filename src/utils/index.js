/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} date
 * @returns {string}
 */
export function renderTime(date) {
  if (date != null) {
    let time = new Date(date).toJSON()
    return new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  } else {
    return '--'
  }
}

//设备是否在线 isOnline: 0：离线 1：上线
export function renderIsOnline(row, column, cellValue) {
  return row.isOnline === '1' ? '在线' : '离线'
}

/*ota状态 otaStatus:
1.ota指令下发中
2.ota指令下发成功 --收到设备通知
3.升级包下载中
4.升级包下载成功
5.升级包下载失败
6.设备固件更新中
7：设备固件更新失败
8：设备固件更新部分成功
9：设备固件更新成功*/
export function renderOtaStatus(row, column, cellValue) {
  switch (row.otaStatus) {
    case '1':
      return 'ota指令下发中'
    case '2':
      return 'ota指令下发成功'
    case '3':
      return '升级包下载中'
    case '4':
      return '升级包下载成功'
    case '5':
      return '升级包下载失败'
    case '6':
      return '设备固件更新中'
    case '7':
      return '设备固件更新失败'
    case '8':
      return '设备固件更新部分成功'
    case '9':
      return '设备固件更新成功'
    case '10':
      return 'ota超时'
    default:
      return '无数据'
  }
}

/*
* 渲染进度
* */
export function renderProgress(row, column, cellValue) {
  if (row.downloadProgress !== null && row.downloadProgress !== '') {
    return row.downloadProgress + '%'
  } else {
    return '--'
  }
}

/*
* 指令结果
* */
export function renderCmdResult(row, column, cellValue) {
  switch (row.cmdResult) {
    case '0':
      return '正确应答'
    case '1':
      return '无效报文'
    case '2':
      return '校验错误'
    case '3':
      return '指令超时'
    case '4':
      return '操作不必要'
    case '5':
      return '设备忙，无法操作'
    default:
      return '无数据'
  }
}

export function renderCmdStatus(row, column, cellValue) {
  return row.isOnline === '1' ? '发送成功' : '收到设备回执通知'
}

/**
 * 设备类型tag
 *  @param {string} type
 *  @param {boolean} isTag
 */
export function renderType(type, isTag) {
  if (isTag) {
    return type === '1' ? 'success' : type === '2' ? 'primary' : 'warning'
  } else {
    return type === '1' ? '电 池' : type === '2' ? '换电柜' : '两轮车'
  }
}

/**
 * 设备类型tag
 *  @param {string} val
 */
export function renderHardVersion(val) {
  return val === '1' ? 'success' : type === '2' ? 'primary' : 'warning'
}

// 指令类型 cmdType: 1:OTA指令 2：设备OTA版本查询 3：设备固件升级
// 指令状态 cmdStatus: 1:发送成功 2：受到设备回执通知
// 执行结果 cmdResult: 0: 正确应答 1:无效报文 2：校验错误 3：指令超时 4：操作不必要 5：设备忙，无法操作
export function renderCmdType(row, column, cellValue) {
  return row.deviceType === '1' ? 'OTA指令' : row.deviceType === '2' ? '设备OTA版本查询' : '设备固件升级'
}

/**
 * 任务状态
 * 1 已创建
 2 创建失败（设备响应）
 3 执行中
 4 已中止
 5 已结束
 *  @param {string | number} status
 *  @param {boolean} isTag
 */

export function renderTaskStatus(status, isTag) {
  if (isTag) {
    switch (status) {
      case 1:
        return 'primary'
      case 2:
        return 'warning'
      case 3:
        return 'info'
      default:
        return '--'
    }
  } else {
    switch (status) {
      case 1:
        return '执行中'
      case 2:
        return '已中止'
      case 3:
        return '已结束'
      default:
        return '--'
    }
  }

}

/*
任务状态
1 已创建
2 创建失败（设备响应）
3 执行中
4 已中止
5 已结束
*/
export function renderExTaskStatus(taskStatus) {
  switch (taskStatus) {
    case 0:
      return '开始任务'
    case 1:
      return '中止任务'
    case 2:
      return '恢复任务'
    case 3:
      return '删除任务'
    case 4:
      return '任务结束'
    default:
      return '--'
  }
}

export function renderSendStatus(sendStatus) {
  switch (sendStatus) {
    case '0':
      return '失败'
    case '1':
      return '成功'
    default:
      return '--'
  }
}

/*
任务操作
1 终止
2 恢复
*/
export function renderTaskOperate(operateType) {
  switch (operateType) {
    case '1':
      return '终止'
    case '2':
      return '恢复'
  }
}

/*
任务状态
1 已创建
2 创建失败（设备响应）
3 执行中
4 已中止*/
export function renderOtaUpdateStatus(row, column, cellValue) {
  switch (row.taskStatus) {
    case 1:
      return '已创建'
    case 2:
      return '创建失败'
    case 3:
      return '执行中'
    case 4:
      return '已中止'
    default:
      return '无数据'
  }
}

/**
 * 用户状态
 1 注销
 0 正常
 @param {string} isDelete
 @param {boolean} isTag
 用户角色
 1 注销
 0 正常
 */
export function renderDelete(isDelete, isTag) {
  if (isTag) {
    return isDelete === '1' ? 'danger' : 'success'
  } else {
    return isDelete === '1' ? '已注销' : '正 常'
  }
}

/**
 @param {string} role
 @param {boolean} isTag
 用户角色
 1 注销
 0 正常
 */
export function renderRole(role, isTag) {
  if (isTag) {
    return role === '1' ? 'warning' : role === '2' ? 'primary' : 'info'
  } else {
    return role === '1' ? '超级管理员' : role === '2' ? '一般管理员' : '一般用户'
  }
}

/*
95<soc<=100 满电
80<soc<=95 高电量
50<soc<=80 中高电量
20<soc<=50 中低电量
0<soc<=20 低电量
= -1      检测不到电量
空位 空电池

*/
export function iconBattery(item) {
  let bat = item.batteryDataRecord
  let com = item.compartmentDataRecordVo
  let res = {
    route: '',
    check: false
  }
  switch (true) {
    case bat.packSoc > 95 && bat.packSoc <= 100:
      res.route = require('@/assets/battery/battery100.svg')
      res.check = false
      return res
    case 80 < bat.packSoc && bat.packSoc <= 95:
      res.route = require('@/assets/battery/battery90.svg')
      res.check = false
      return res

    case 50 < bat.packSoc && bat.packSoc <= 80:
      res.route = require('@/assets/battery/battery60.svg')
      res.check = false
      return res
    case 20 < bat.packSoc && bat.packSoc <= 50:
      res.route = require('@/assets/battery/battery30.svg')
      res.check = false
      return res
    case 0 < bat.packSoc && bat.packSoc <= 20:
      res.route = require('@/assets/battery/battery10.svg')
      res.check = false
      return res
    case com.cpHardwareError === 1:
      res.route = require('@/assets/battery/hardware_error.svg')
      res.check = true
      return res
    case com.cpError === 1:
      res.route = require('@/assets/battery/software_error.svg')
      res.check = true
      return res
    case com.maintenanceState === 1:
      res.route = require('@/assets/battery/maintain.svg')
      res.check = true
      return res
    case com.batCommOk === 0 && com.batSwOff === 0:
      res.route = require('@/assets/battery/empty.svg')
      res.check = true
      return res
    case bat.packSoc === -1:
      res.route = require('@/assets/battery/unknown_battery.svg')
      res.check = true
      return res
    default:
      res.route = require('@/assets/battery/empty.svg')
      res.check = true
      return res
  }
}

export function isLocked(item) {
  let isLocked = false
  item.batteryDataRecord.cpLockState === 1 ? isLocked = true : false
  return isLocked
}

/*
1.充电过温
2.短路
3.放电过流
4.充电过流
5.总电压欠压
6.单节电池欠压
7.总电压过压
8.单节电池过压
9.前端采集错误
10.放电低温
11.充电低温
12.放电过温
13电池短路开关故障
14.电池通讯故障
*/
export function batteryError(item) {
  let data = item.batteryDataRecord
  let code = []
  let arr = [
    data.chtProt,
    data.scProt,
    data.docProt,
    data.cocProt,
    data.pvUvProt,
    data.cvUvPro,
    data.pvOvProt,
    data.cvOvProt,
    data.colFault,
    data.dltProt,
    data.cltProt,
    data.dhtProt
  ]
  //数组内顺序不要调换
  arr.forEach((item, index) => {
    if (item === 1) {
      code.push(index + 1)
    }
  })
  if (item.compartmentDataRecordVo.batSwOff === 0) {
    code.push(13)
  }
  if (item.compartmentDataRecordVo.batCommOk === 0) {
    code.push(14)
  }
  return code
}

/*
101.格口过温保护
102.电池过温保护
103.电池低温保护
104.充电柜异常断电告警
105.格口无法充电告警
106.电池过流告警
107.电池过压告警
108.电池欠压告警
109.单体欠压告警
110.单体过压告警
111.电芯压差过大保护
112.电池容量过衰告警
113.电池循环次数过大告警
114.水浸告警
115.充电单元烟雾告警
116.消防告警
117.消防启动
*/
export function type(type) {
  switch (type) {
    case 101:
      return '格口过温保护'
    case 102:
      return '电池过温保护'
    case 103:
      return '电池低温保护'
    case 104:
      return '充电柜异常断电告警'
    case 105:
      return '格口无法充电告警'
    case 106:
      return '电池过流告警'
    case 107:
      return '电池过压告警'
    case 108:
      return '电池欠压告警'
    case 109:
      return '单体欠压告警'
    case 110:
      return '单体过压告警'
    case 111:
      return '电芯压差过大保护'
    case 112:
      return '电池容量过衰告警'
    case 113:
      return '电池循环次数过大告警'
    case 114:
      return '水浸告警'
    case 115:
      return '充电单元烟雾告警'
    case 116:
      return '消防告警'
    case 117:
      return '消防启动'
  }
}

export function warningType(data) {
  let types = {}
  let values = []

  Object.keys(data).forEach((item, index) => {
    values = []
    data[item].forEach((current, i) => {
      values.push(type(current.warningType))
    })
    types[parseInt(item)] = values
  })
  return types
}
