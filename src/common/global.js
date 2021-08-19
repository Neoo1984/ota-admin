/*
* 设备类型
* */
export const tempDeviceType = [
  {
    label: '全部',
    value: undefined
  },
  {
    label: '电池',
    value: "1"
  },
  {
    label: '换电柜',
    value: "2"
  },
  {
    label: '两轮车',
    value: "3"
  }
]
/*
* 设备类型
* */
export const deviceType = [
  {
    label: '电池',
    value: "1"
  },
  {
    label: '换电柜',
    value: "2"
  },
  {
    label: '两轮车',
    value: "3"
  }
]

/*
* 用户角色
* */
export const userRole = [
  {
    label: '超级管理员',
    value: '1'
  },
  {
    label: '一般管理员',
    value: '2'
  },
  {
    label: '用户',
    value: '3'
  }
]
/*
* 筛选用户角色
* */
export const filterUserRole = [
  {
    text: '超级管理员',
    value: '1'
  },
  {
    text: '一般管理员',
    value: '2'
  },
  {
    text: '用户',
    value: '3'
  }
]
/*
* 筛选用户角色
* */
export const filterUserState = [
  {
    text: '正常',
    value: '0'
  },
  {
    text: '已注销',
    value: '1'
  },
]
/*
* ota任务状态
* */
export const filterTaskState = [
  {
    text: '执行中',
    value: 1
  },
  {
    text: '已中止',
    value: 2
  },
  {
    text: '已结束',
    value: 3
  },

]
/*
* 设备是否在线
* */
export const isOnline = [
  {
    label: '全部',
    value: undefined
  },
  {
    label: '在线',
    value: '1'
  },
  {
    label: '离线',
    value: '0'
  },
]
/*
* 用户是否删除
* */
export const isDelete = [
  {
    label: '已注销',
    value: '1'
  },
  {
    label: '正常',
    value: '0'
  },
]
/*
* 产品类型，同设备类型
* */
export const productType = [
  {
    label: '电池',
    value: 1
  },
  {
    label: '换电柜',
    value: 2
  },
  {
    label: '两轮车',
    value: 3
  }
]
/*
* 升级方式
* */
export const updateType = [
  {
    label: 'ftp下载',
    value: 0
  },
  {
    label: 'Mqtt下载',
    value: 1
  },
  {
    label: 'http下载',
    value: 2
  }
]
/*
* 拆分包
* */
export const packageSplit = [
  {
    label: "不拆包",
    value: '0'
  }, {
    label: "拆包",
    value: '1'
  }
]
/*
*拆分长度
*  */
export const splitLength = [
  {
    label: 1024,
    value: 1024
  },
  {
    label: 0,
    value: 0
  },
]
/*
*任务状态
*  */
export const taskStatus = [
  {
    label: '全部',
    value: undefined
  },
  {
    label: '执行中',
    value: 1
  },
  {
    label: '已中止',
    value: 2
  },
  {
    label: '已结束',
    value: 3
  }
]
/*
OTA状态
*/
export const otaStatus = [
  {
    value: undefined,
    label: '全部'
  },
  {
    value: '1',
    label: 'ota指令下发中'
  },
  {
    value: '2',
    label: 'ota指令下发成功'
  },
  {
    value: '3',
    label: '升级包下载中'
  },
  {
    value: '4',
    label: '升级包下载成功'
  },
  {
    value: '5',
    label: '升级包下载失败'
  },
  {
    value: '6',
    label: '设备固件更新中'
  },
  {
    value: '7',
    label: '设备固件更新失败'
  },
  {
    value: '8',
    label: '设备固件更新部分成功'
  },
  {
    value: '9',
    label: '设备固件更新成功'
  },
  {
    value: '10',
    label: 'ota超时'
  },
]
/*
*修改密码类型
*
* '1' ：管理员重置密码
* '2'：用户修改密码（携带老密码）
*  */
export const changePasswordType = {
  admin: '2',
  user: '1'
}
/*
*登录类型
*
* '1' ：后台用户
*/
export const loginType = {
  default: '1',
}

