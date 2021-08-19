<template>
  <div style="display: flex;flex-direction: column;">

    <el-form :inline="true" size="small" style="padding-left: 10%">
      <el-form-item label="数据采集时间">
        <el-input style="width: 300px"
                  v-model="dataTime"
                  class="filter-item"
                  disabled
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="handleRefresh" :loading="refreshLoading" icon="el-icon-refresh" size="small">
        刷新
      </el-button>
      <el-tooltip class="item" effect="dark" content="勾选柜子编号进行OTA" placement="top">
        <el-button type="primary" @click="handleOta" icon="el-icon-thumb" size="small">电池包OTA</el-button>
      </el-tooltip>
    </el-form>
    <div style="position: relative">
      <el-checkbox :indeterminate="isIndeterminate" v-model="allChecked" @change="handleCheckAllChange"
                   style="position: absolute;left: 8%"
      >选择所有格口
      </el-checkbox>
    </div>
    <div class="box-main" v-loading="refreshLoading" element-loading-text="刷新中...">

      <div class="box-content" >
        <div v-for="(item,index) in cpData" class="box-item" :style="`width:${itemWidth}%;`">
          <el-checkbox-group v-model="checkList" @change="handleCheckedBox">
            <el-checkbox :disabled="disableCheck[index]" :label="index+1" :key="index" class="check-list"></el-checkbox>
          </el-checkbox-group>
<!--          查看状态-->
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-form :label-position="labelPosition" :model="statusData" label-width="120px" v-loading="statusLoading" size="mini">
              <el-form-item label="设备编号">
                <el-input v-model="statusData.deviceName"></el-input>
              </el-form-item>
              <el-form-item label="OTA状态">
                <el-input v-model="statusData.otaStatus"></el-input>
              </el-form-item>
              <el-form-item label="OTA版本">
                <el-input v-model="statusData.otaSoftVersion"></el-input>
              </el-form-item>
              <el-form-item label="是否在线">
                <el-input v-model="statusData.isOnline"></el-input>
              </el-form-item>
              <el-form-item label="下载进度">
                <el-input v-model="statusData.downloadProgress"></el-input>
              </el-form-item>
              <el-form-item label="安装进度">
                <el-input v-model="statusData.updateProgress"></el-input>
              </el-form-item>
              <el-form-item label="最后在线时间">
                <el-input v-model="statusData.onlineTime"></el-input>
              </el-form-item>
              <el-form-item label="最后离线时间">
                <el-input v-model="statusData.offlineTime"></el-input>
              </el-form-item>
              <el-form-item label="刷新时间">
                <el-input v-model="statusData.refreshTime"></el-input>
              </el-form-item>
            </el-form>

            <el-link class="show-status" :underline="false" v-if="!hasStatus[index]" slot="reference" @click="handleStatus(index)">...</el-link>

          </el-popover>
          <!--          电池-->
          <div class="battery">
            <img class="icon_battery" alt="电池" :src="icon_battery_route[index]">
            <img class="icon_lock" alt="锁仓" v-if="iconIsLocked[index]" :src="iconLock">

          </div>
          <span class="showSoc" v-if="!disableCheck[index]">{{showSoc[index] + '%'}}</span>
        </div>
      </div>
    </div>
    <!--ota-->
    <el-dialog
      title="选择要升级的设备信息和升级包"
      :visible.sync="otaDialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form ref="otaRef" :rules="otaRules" :model="otaTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="设备编码" prop="subDeviceNames">
          <el-input type="textarea" :rows="2" v-model="otaTemp.subDeviceNames" disabled style="width: 80%"
                    class="filter-item"
          />
        </el-form-item>
        <el-form-item label="软件版本" prop="packageId">
          <el-select v-model="otaTemp.packageId" placeholder="请选择软件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in softVersion"
              :key="item.index"
              :label="item.softVersion"
              :value="item.objectId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级方式" prop="updateType">
          <el-select v-model="otaTemp.updateType" placeholder="请选择升级方式" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in updateType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="otaDialogVisible = false">取消</el-button>
        <el-button type="primary" @click=ota()>开始OTA</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Comm from '@/views/sub/comm'
import { commandResult, deviceData, otaSend, queryDeviceStatus, querySoftVersion, refreshDevice } from '@/api/operation'
import { global } from '@/common'
import { iconBattery, isLocked, renderIsOnline, renderOtaStatus, renderProgress, renderTime } from '@/utils'

export default {
  name: 'Maintenance',
  components: { Comm },
  data() {
    return {
      labelPosition: 'right',
      otaDialogVisible: false,
      direction: 'rtl',
      itemWidth: 100,
      isIndeterminate: true,
      dataTime: '',
      checkList: [], //选中的list
      allChecked: false, //是否全选
      updateType: global.updateType,
      otaTemp: {
        deviceNames: [],
        packageId: '',
        isSubDevice: 1,
        subDeviceNames: undefined,
        updateType: 0
      },
      softVersion: [],
      otaRules: {
        packageId: [{ required: true, message: '请选择软件版本', trigger: 'blur' }],
        updateType: [{ required: true, message: '请选择升级方式', trigger: 'blur' }]
      },
      deviceInfo: JSON.parse(sessionStorage.getItem('infoQuery')),
      //格口数据
      cpData: undefined,
      refreshLoading: false,
      //电池
      icon_battery_exist: false,
      disableCheck: [],
      icon_battery_route: [],
      iconError: [],
      showSoc:[],
      iconIsLocked: [true],
      iconLock: require('@/assets/battery/lock.svg'),
      iconMaintain: require('@/assets/battery/maintain.svg'),
      //状态
      hasStatus: [],
      statusData: {
        deviceName:'',
        downloadProgress:'',
        isOnline:'',
        offlineTime:'',
        onlineTime:'',
        otaSoftVersion:'',
        otaStatus:'',
        refreshTime:'',
        updateProgress:'',
      },
      statusLoading:false,
      renderIsOnline: renderIsOnline,
      renderOtaStatus: renderOtaStatus,
      renderTime:renderTime,
      renderProgress:renderProgress

    }
  },
  created() {
    this.getList()
  },
  methods: {

    async getList() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let res = await deviceData(this.deviceInfo.deviceName)
      if (res.data.success && res.data.data !== null) {
        this.dataTime = renderTime(res.data.data.dataTime)
        //电池
        this.cpData = Object.values(res.data.data.cpAndBatteryData)
        this.itemWidth = 100 / (Math.ceil(this.cpData.length / 4))
        this.cpData.forEach((item, index, arr) => {
          let res = iconBattery(item)
          if (res !== undefined) {
            this.icon_battery_route[index] = res.route
            this.showSoc[index] = res.soc
            this.disableCheck[index] = res.check
            // this.iconError.push(batteryError(item))
            this.iconIsLocked[index] = isLocked(item)
            this.hasStatus[index] = item.batteryDataRecord === null;
          }
        })
        loading.close()
      } else {
        loading.close()
        this.$message({
          showClose: true,
          message: '获取失败: ' + res.data.message,
          type: 'error'
        })
      }
    },

    //刷新数据
    async handleRefresh() {
      let that = this
      that.refreshLoading = true
      let messageId = ''
      let i = 0
      let interval = null
      let cmdRes = null
      let idRes = await refreshDevice(this.deviceInfo.deviceName)
      if (idRes.data !== null) {
        if (idRes.data.success) {
          messageId = idRes.data.data.messageId

          interval = setInterval(function() {
            if (i === 4) {
              that.refreshLoading = false
              clearInterval(interval)
              console.log('刷新失败' + cmdRes)
              that.$message({
                showClose: true,
                message: '刷新失败，请刷新重试！',
                type: 'error'
              })
            } else {
              commandResult(messageId).then(res => {
                if (res.data.data !== null) {
                  if (res.data.data.cmdStatus === '2') {
                    that.refreshLoading = false
                    clearInterval(interval)
                    that.getList()
                    that.$message({
                      showClose: true,
                      message: '刷新成功！',
                      type: 'success'
                    })
                  } else {
                    cmdRes = res.data.message
                    i++
                  }
                } else {
                  i++
                }
              })
            }

          }, 1000)

        } else {
          this.refreshLoading = false
          this.$message({
            showClose: true,
            message: '刷新失败：' + idRes.data.message,
            type: 'error'
          })
        }
      }
    },

    //OTA
    handleOta() {
      if (this.checkList.length > 0) {
        let factory = []
        let hardVersion = []
        let productModel = []
        const elementsAreEqual = array => !array.every(el => el === array[0])
        this.checkList.forEach(item => {
          factory.push(this.cpData[item - 1].deviceInfoVo.factoryName)
          hardVersion.push(this.cpData[item - 1].deviceInfoVo.hardVersion)
          productModel.push(this.cpData[item - 1].deviceInfoVo.productModel)
        })
        switch (true) {
          case elementsAreEqual(factory):
            this.$message({
              showClose: true,
              message: '请选择相同的厂商！',
              type: 'error'
            })
            break
          case elementsAreEqual(hardVersion):
            this.$message({
              showClose: true,
              message: '请选择相同的硬件版本！',
              type: 'error'
            })
            break
          case elementsAreEqual(productModel):
            this.$message({
              showClose: true,
              message: '请选择相同的产品型号！',
              type: 'error'
            })
            break
          default:
            break
        }

        const query = {
          factoryName: factory[0],
          hardVersion: hardVersion[0],
          productModel: productModel[0]
        }
        this.softVersion = []
        this.otaTemp.subDeviceNames = ''
        querySoftVersion(query).then(res => {
            if (res.data.success) {
              if (res.data.data !== null) {
                let data = res.data.data
                data.forEach((item, value) => {
                  this.softVersion.push({ softVersion: item.softVersion, objectId: item.objectId })
                })
              }
            }
          }
        )
        //吧勾选的deviceNames
        this.checkList.forEach((item, index, arr) => {
          this.otaTemp.subDeviceNames += this.cpData[item - 1].batteryDataRecord.batSn + ','
        })
        this.otaTemp.subDeviceNames = this.otaTemp.subDeviceNames.substring(0, this.otaTemp.subDeviceNames.lastIndexOf(','))
        this.otaDialogVisible = true

        this.$nextTick(() => {
          this.$refs['otaRef'].clearValidate()
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请先勾选要OTA的格口！',
          type: 'warning'
        })
      }
    },

    ota() {
      this.$refs['otaRef'].validate((valid) => {
        if (valid) {
          this.otaTemp.deviceNames = []
          let query = {
            subDeviceNames:[],
            deviceNames:[],
            packageId: this.otaTemp.packageId,
            isSubDevice: 1,
            updateType: 0
          }
          query.subDeviceNames = this.otaTemp.subDeviceNames.split(',')
          query.deviceNames.push(this.deviceInfo.deviceName)
          otaSend(query).then(res => {
            if (res.data.success) {
              this.otaDialogVisible = false
              this.$message({
                showClose: true,
                message: 'OTA下发成功',
                type: 'success'
              })
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              })
            }
          })

        }
      })

    },
    //全选
    handleCheckAllChange(val) {
      this.checkList = []

      this.disableCheck.forEach((item, index) => {
        if (item === false) {
          this.checkList.push(index + 1)
        }
      })
      this.isIndeterminate = false
      this.checkList = val ? this.checkList : []

    },
    //单选
    handleCheckedBox(val) {
      let i = 0
      this.disableCheck.forEach((item, index) => {
        if (item === false) {
          i++
        }
      })
      this.checkList = val
      this.allChecked = this.checkList.length === i
      this.isIndeterminate = this.checkList.length > 0 && this.checkList.length < i
    },
    // 状态
    handleStatus(index) {
      if (this.cpData[index].deviceInfo !== null && this.cpData[index].batteryDataRecord !== null) {
        let battery = this.cpData[index].batteryDataRecord
        let device = this.cpData[index].deviceInfoVo
        const query = {
          deviceName: battery.batSn,
          deviceType: '1',
          factoryName: device.factoryName,
          hardVersion: device.hardVersion,
          productModel: device.productModel
        }

        this.statusLoading = true
        queryDeviceStatus(query).then(res => {
            if (res.data.success) {
              this.statusLoading = false
              if (res.data.data !== null) {
                this.statusData = res.data.data
                this.statusData.offlineTime = renderTime(this.statusData.offlineTime)
                this.statusData.updateProgress = renderProgress(this.statusData.updateProgress)
                this.statusData.otaStatus = renderOtaStatus(this.statusData.otaStatus)
                this.statusData.isOnline = renderIsOnline(this.statusData.isOnline)
                this.statusData.downloadProgress = renderProgress(this.statusData.downloadProgress)
                this.statusData.onlineTime = renderTime(this.statusData.onlineTime)
                this.statusData.refreshTime = renderTime(this.statusData.refreshTime)
              }
            }
        })
      }

    },
  }

}
</script>

<style scoped lang="scss">

.icon_battery_error {
  width: 22px;
  height: 22px;
  line-height: 22px;
  border-radius: 50%;
  background-color: #8896B3;
  text-align: center;
  color: #ffffff;
  margin: 1px 2px 0 8px
}

.battery {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.icon_lock {
  position: absolute;
  width: 60px;
  height: 60px;
}
.showSoc {
  position: absolute;
  bottom: 8px;
  font-size: 12px;
}
.show-status {
  height: 30px;
  width: 40px;
  position: absolute;
  right: 6px;
}
.errors {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 100%;
  position: absolute;
  bottom: 0;
  padding-top: 10px;
}
.warning-row {
  background: oldlace;
}
</style>
