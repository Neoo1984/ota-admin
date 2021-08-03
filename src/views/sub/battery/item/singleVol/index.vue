<template>

  <div style="display: flex;flex-direction: column;">

    <el-form :inline="true" size="small" style="padding-left: 10%">
      <el-form-item label="数据采集时间">
        <el-input style="width: 300px"
                  class="filter-item"
                  v-model="dataTime"
                  disabled
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="handleRefresh" :loading="refreshLoading" icon="el-icon-refresh" size="small">
        刷新
      </el-button>
    </el-form>

    <div class="box-main">

      <div class="box-content">
        <div v-for="(item,index) in cpData" :key="index" class="box-item" :style="`width:${itemWidth}%;`">

          <el-checkbox :label="index+1" :key="index" class="check-list"></el-checkbox>
          <div class="info">
            <span class="info-item" v-for="(item,index) in single[index]">{{item}}</span>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import {commandResult, deviceData, refreshDevice} from "@/api/operation";
import {renderTime} from "@/utils";

export default {
  name: 'SingleVol',
  data() {
    return {
      itemWidth: 100,
      deviceInfo: JSON.parse(sessionStorage.getItem('infoQuery')),
      dataTime: '',
      //格口数据
      cpData: undefined,
      single:[],
      //柜子

      refreshLoading: false,
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
          this.itemWidth = 100 / (Math.ceil(this.cpData.length / 4))
          this.cpData.forEach((item, index, arr) => {
            if (item.batteryDataRecord !== null) {
              this.single[index] = (JSON.parse(item.batteryDataRecord.cellVolts))
            }
          })
          loading.close();

        } else {
          loading.close();
          this.$message({
            showClose: true,
            message: '获取失败: ' + res.data.message,
            type: 'error'
          })
        }

    },

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

          }, 3000)

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

  }

}
</script>

<style scoped lang="scss">
.info {
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 100%;
  flex-wrap: wrap;
  .info-item {
    font-size: 14px;
    padding: 4px 2px 2px 8px;
  }

  .info-text {
    color: #1482f0;
  }
}
</style>
