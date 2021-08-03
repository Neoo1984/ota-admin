<template>

  <div style="display: flex;flex-direction: column;">

    <el-form :inline="true" size="small" style="padding-left: 10%">
      <el-form-item label="数据采集时间">
        <el-input style="width: 300px"
                  class="filter-item"
                  disabled
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="handleRefresh" icon="el-icon-refresh" size="small">刷新</el-button>
    </el-form>


    <div class="main">

      <div @click="drawer = true">
        <el-card class="right" type="primary" shadow="hover">
          <span>查看设备信息</span>
        </el-card>
      </div>
      <div class="content">
        <div v-for="item in list" class="item-div" :style="`width:${itemWidth}%;`">
          <el-card style="width: 100%;height: 100%;position:relative;">
            {{ item }}
          </el-card>

        </div>

      </div>

      <el-drawer
        :visible.sync="drawer"
        :direction="direction"
        :before-close="handleClose"
      >
        <comm :device-type="deviceType"
              :device-code="deviceCode"
              :factory-name="factoryName"
              :product-num="productNum"
              :hw-version="hwVersion"
        ></comm>
      </el-drawer>


    </div>
  </div>
</template>

<script>

import Comm from '@/views/sub/comm'

export default {
  name: 'Command',
  components: {Comm},
  data() {
    return {
      deviceType: '换电柜荣天',
      deviceCode: '0000000000011138',
      factoryName: '荣天',
      productNum: '00',
      hwVersion: 'v0.0.1',
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      drawer: false,
      direction: 'rtl',
      itemWidth: 0,
      formInline: {}
    }
  },
  created() {
    this.itemWidth = 100 / (Math.ceil(this.list.length / 4))

  },
  methods: {
    handleClose(done) {
      done()
    },
    handleRefresh() {

    },
    handleOta() {

    }
  }

}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column-reverse;
  justify-items: center;
  align-items: center;
  height: 760px;
  width: 100%;
  flex-wrap: wrap;
  margin-right: 15%;
  margin-left: 10%;
  margin-top: 20px;

}


.item-div {
  height: 180px;
  width: 33%;
  margin: 4px 4px 0 0;
}

.main {
  display: flex;
  flex-direction: row;
}

.right {
  position: fixed;
  background-color: #fff;
  color: #20a0ff;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  right: 20px;
  z-index: 5;
  line-height: 18px;
  margin-top: 17%;
  padding: 16px;
}
.fix-checkbox {
  position: absolute;
  right: 4px;
  bottom: 4px;
}
</style>
