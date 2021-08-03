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
*     case 0:
      return '任务开始'
    case 1:
      return '任务中止'
    case 2:
      return '任务恢复'
    case 3:
      return '任务删除'
    case 4:
      return '任务结束'
*  */
export const taskStatus = [
  {
    label: '任务开始',
    value: 0
  },
  {
    label: '任务中止',
    value: 1
  },
  {
    label: '任务恢复',
    value: 2
  },
  {
    label: '任务删除',
    value: 3
  },
  {
    label: '任务结束',
    value: 4
  },
]
/*
OTA状态
*/
export const otaStatus = [
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

//电池信息
export const res =JSON.stringify({"message":"查询状态信息成功!","errorCode":"200","success":true,"data":{"deviceName":"0000000000011131","dataTime":"2021-07-16T06:01:32.000+00:00","cabinetDataRecordVo":{"objectId":1155,"deviceName":"0000000000011131","pdcOpen":1,"tsdOpen":1,"gasEmp":0,"p1Wat":0,"p2Wat":0,"radiatingFan":1,"bottleDoorOpen":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"cpAndBatteryData":{"1":{"compartmentDataRecordVo":{"objectId":12717,"deviceName":"0000000000011131","cpIndex":1,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"2":{"compartmentDataRecordVo":{"objectId":12718,"deviceName":"0000000000011131","cpIndex":2,"cpOpen":0,"chargerOn":1,"batCommOk":1,"batSwOff":1,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.5,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":{"objectId":712,"batSn":"N101120091400518","mosTmp":25,"packTmp1":25,"packTmp2":25,"packHiTmp":25,"packLoTmp":25,"packVolt":50.1,"packCur":0.0,"packSoc":100.0,"colFault":0,"pvUvProt":0,"pvOvProt":0,"cvUvPro":null,"cvOvProt":0,"scProt":0,"cocProt":0,"docProt":0,"chtProt":0,"dhtProt":0,"cltProt":0,"dltProt":0,"dcState":3,"cellVolts":"[3.34,3.309,3.344,3.341,3.348,3.342,3.351,3.349,3.343,3.365,3.34,3.352,3.36,3.344,3.367]","maxCellVolt":3.367,"minCellVolt":3.309,"cellVoltRange":0.058,"rmCap":20.0,"fcCap":0.101,"dsCap":20.0,"cycleTimes":1,"dataTime":"2021-07-16T06:01:32.000+00:00"}},"3":{"compartmentDataRecordVo":{"objectId":12719,"deviceName":"0000000000011131","cpIndex":3,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"4":{"compartmentDataRecordVo":{"objectId":12720,"deviceName":"0000000000011131","cpIndex":4,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":26.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"5":{"compartmentDataRecordVo":{"objectId":12721,"deviceName":"0000000000011131","cpIndex":5,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"6":{"compartmentDataRecordVo":{"objectId":12722,"deviceName":"0000000000011131","cpIndex":6,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"7":{"compartmentDataRecordVo":{"objectId":12723,"deviceName":"0000000000011131","cpIndex":7,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.5,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"8":{"compartmentDataRecordVo":{"objectId":12724,"deviceName":"0000000000011131","cpIndex":8,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":26.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"9":{"compartmentDataRecordVo":{"objectId":12725,"deviceName":"0000000000011131","cpIndex":9,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":24.5,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null},"10":{"compartmentDataRecordVo":{"objectId":12726,"deviceName":"0000000000011131","cpIndex":10,"cpOpen":0,"chargerOn":1,"batCommOk":1,"batSwOff":1,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":{"objectId":723,"batSn":"N211121022400041","mosTmp":25,"packTmp1":25,"packTmp2":24,"packHiTmp":25,"packLoTmp":24,"packVolt":50.9,"packCur":0.0,"packSoc":100.0,"colFault":0,"pvUvProt":0,"pvOvProt":0,"cvUvPro":null,"cvOvProt":0,"scProt":0,"cocProt":0,"docProt":0,"chtProt":0,"dhtProt":0,"cltProt":0,"dltProt":0,"dcState":3,"cellVolts":"[3.352,3.359,3.365,3.36,3.378,3.429,3.424,3.425,3.389,3.335,3.43,3.428,3.431,3.426,3.398]","maxCellVolt":3.431,"minCellVolt":3.336,"cellVoltRange":0.095,"rmCap":20.0,"fcCap":0.103,"dsCap":20.0,"cycleTimes":1,"dataTime":"2021-07-16T06:01:32.000+00:00"}},"11":{"compartmentDataRecordVo":{"objectId":12727,"deviceName":"0000000000011131","cpIndex":11,"cpOpen":0,"chargerOn":1,"batCommOk":0,"batSwOff":0,"sdAlm":0,"htOn":0,"panelCommunication":1,"cpTmp":25.0,"fireAlarmStatus":null,"highTempAlarmStatus":null,"lowTempAlarmStatus":null,"heatFanWorkState":0,"maintenanceState":0,"cpLockState":0,"cpHardwareError":0,"cpError":0,"dataTime":"2021-07-16T06:01:32.000+00:00"},"batteryDataRecord":null}}}})
