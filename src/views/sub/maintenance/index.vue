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
                   style="position: absolute;left: 8%">选择所有格口
      </el-checkbox>
    </div>
    <div class="box-main">

      <div class="box-content">
        <div v-for="(item,index) in cpData" class="box-item" :style="`width:${itemWidth}%;`">
          <el-checkbox-group v-model="checkList" @change="handleCheckedBox">
            <el-checkbox :disabled="disableCheck[index]" :label="index+1" :key="index" class="check-list"></el-checkbox>
          </el-checkbox-group>
          <!--          电池-->
          <div class="battery">
            <img class="icon_battery" alt="电池" :src='icon_battery_route[index]'>
            <img class="icon_battery" alt="电池" v-if="iconIsLocked" :src='iconLock'>
          </div>
          <div class="errors">
            <div v-for="(item,index) in iconError[index]" class="icon_battery_error"> {{ item }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--ota-->
    <el-dialog
      title="选择要升级的设备信息和升级包"
      :visible.sync="otaDialogVisible"
      width="60%"
    >
      <el-form ref="otaRef" :rules="otaRules" :model="otaTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="设备编码" prop="subDeviceNames">
          <el-input type="textarea" :rows="2" v-model="otaTemp.subDeviceNames" disabled style="width: 80%"
                    class="filter-item"/>
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
import {commandResult, deviceData, otaSend, querySoftVersion, refreshDevice} from "@/api/operation"
import {global} from "@/common"
import {batteryError, iconBattery, isLocked, renderTime} from "@/utils";

export default {
  name: 'Maintenance',
  components: {Comm},
  data() {
    return {
      labelPosition: 'right',
      otaDialogVisible: false,
      direction: 'rtl',
      itemWidth: 100,
      formInline: {},
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
        packageId: [{required: true, message: '请选择软件版本', trigger: 'blur'}],
        updateType: [{required: true, message: '请选择升级方式', trigger: 'blur'}]
      },
      deviceInfo: JSON.parse(sessionStorage.getItem('infoQuery')),
      //格口数据
      cpData: undefined,
      bigData: undefined,
      refreshLoading: false,
      //电池
      icon_battery_exist: false,
      disableCheck: [],
      icon_battery_route: [],
      iconError: [],
      iconIsLocked: false,
      iconLock: require('@/assets/battery/lock.svg')
    }
  },
  created() {
    this.getList()
  },
  methods: {

    async getList() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let res = await deviceData(this.deviceInfo.deviceName)
      if (res.data.success && res.data.data !== null) {
        this.dataTime = renderTime(res.data.data.dataTime)
        //电池
        this.cpData = Object.values(res.data.data.cpAndBatteryData)
        this.bigData = res.data.data.cabinetDataRecordVo
        this.itemWidth = 100 / (Math.ceil(this.cpData.length / 4))
        this.cpData.forEach((item, index, arr) => {
          if (item.batteryDataRecord !== null) {
            let res = iconBattery(item)
            this.icon_battery_route[index] = res.route
            this.disableCheck[index] = res.check
            this.iconError.push(batteryError(item))
            this.iconIsLocked = isLocked(item)
          } else {
            this.icon_battery_route[index] = require('@/assets/battery/empty.svg')
            this.disableCheck[index] = true
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '获取失败: ' + res.data.message,
          type: 'error'
        })
      }
      loading.close();
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

          interval = setInterval(function () {
            console.log(i)
            if (i === 4) {
              that.refreshLoading = false
              clearInterval(interval)
              that.$message({
                showClose: true,
                message: '刷新失败：' + cmdRes,
                type: 'error'
              })
            } else {
              commandResult(messageId).then(res => {
                if (res.data.data !== null) {
                  if (res.data.data.cmdStatus === '2') {
                    console.log(res.data.data.cmdStatus)
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
          productModel: productModel[0],
        }
        this.softVersion = []
        this.otaTemp.subDeviceNames = []
        querySoftVersion(query).then(res => {
            if (res.data.success) {
              if (res.data.data !== null) {
                let data = res.data.data
                data.forEach((item, value) => {
                  this.softVersion.push({softVersion: item.softVersion, objectId: item.objectId})
                })
              }
            }
          }
        )
        //吧勾选的deviceNames
        this.checkList.forEach((item, index, arr) => {
          this.otaTemp.subDeviceNames += this.cpData[item - 1].batteryDataRecord.batSn + ','
        })
        this.otaTemp.subDeviceNames = this.otaTemp.subDeviceNames.substring(0, this.otaTemp.subDeviceNames.lastIndexOf(','));
        this.otaDialogVisible = true

        this.$nextTick(() => {
          this.$refs['otaRef'].clearValidate()
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请先勾选要OTA的格口！',
          type: 'warning'
        });
      }
    },

    ota() {
      this.$refs['otaRef'].validate((valid) => {
        if (valid) {
          let sub = []
          sub = this.otaTemp.subDeviceNames.split(',')
          this.otaTemp.subDeviceNames = sub
          this.otaTemp.deviceNames.push(this.deviceInfo.deviceName)
          otaSend(this.otaTemp).then(res => {
            if (res.data.success) {
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
          this.otaDialogVisible = false

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
      console.log(this.checkList)
    },
  }

}
</script>

<style scoped>

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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
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
</style>
