<template>
  <div class="app-container">
    <div class="filter-container">
      <!--表单-->
      <el-row>
        <el-col :span="8">
          <el-form ref="mainDataForm" :rules="rules" :model="mainTemp" size="small" class="demo-form-inline"
                   :label-position="labelPosition"
                   label-width="100px"
          >
            <el-form-item label="设备编码" prop="mainDeviceName">
              <el-input v-model="mainTemp.deviceName" disabled style="width: 200px"
                        class="filter-item"
              ></el-input>
            </el-form-item>
            <el-form-item label="厂商名称" prop="factoryName">
              <el-select v-model="mainTemp.factoryName" disabled placeholder="请选择厂商名称" style="width: 200px"
                         class="filter-item"
              >
                <el-option
                  v-for="item in factoryName"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="mainTemp.deviceType" disabled placeholder="请选择设备类型" style="width: 200px"
                         class="filter-item"
              >
                <el-option
                  v-for="item in deviceType"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>

        </el-col>
        <el-col :span="8">
          <el-form ref="mainDataForm" :rules="rules" :model="mainTemp" size="small" class="demo-form-inline"
                   :label-position="labelPosition"
                   label-width="100px"
          >

            <el-form-item label="产品型号" prop="productModel">
              <el-select v-model="mainTemp.productModel" disabled placeholder="请选择产品型号" style="width: 200px"
                         class="filter-item"
              >
                <el-option
                  v-for="item in productModel"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="硬件版本" prop="hardVersion">
              <el-select v-model="mainTemp.hardVersion" disabled placeholder="请选择产品型号" style="width: 200px"
                         class="filter-item"
              >
                <el-option
                  v-for="item in hardVersion"
                  :key="item.index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>

        </el-col>
      </el-row>

      <el-table
        :data="statusData"
        v-loading="statusLoading"
        style="width: 90%"
      >
        <el-table-column label="设备编号" align="center">
          <template slot-scope="scope">
            {{ scope.row.deviceName }}
          </template>
        </el-table-column>
        <el-table-column label="是否在线" align="center" :formatter="renderIsOnline">
        </el-table-column>
        <el-table-column label="最后在线时间" align="center">
          <template slot-scope="scope">
            {{ renderTime(scope.row.onlineTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最后离线时间" align="center">
          <template slot-scope="scope">
            {{ renderTime(scope.row.offlineTime) }}
          </template>
        </el-table-column>
        <el-table-column label="OTA版本" align="center">
          <template slot-scope="scope">
            {{ scope.row.otaSoftVersion || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="OTA状态" align="center">
          <template slot-scope="scope">
            {{ renderOtaStatus(scope.row.otaStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="刷新时间" align="center">
          <template slot-scope="scope">
            {{ renderTime(scope.row.offlineTime) }}
          </template>
        </el-table-column>
        <el-table-column label="安装进度" align="center">
          <template slot-scope="scope">
            {{ renderProgress(scope.row.updateProgress) }}
          </template>
        </el-table-column>
        <el-table-column label="下载进度" align="center">
          <template slot-scope="scope">
            {{ renderProgress(scope.row.downloadProgress) }}
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>

</template>

<script>

import { renderTime, renderIsOnline, renderOtaStatus, renderProgress } from '@/utils'
import { queryDeviceStatus } from '@/api/operation'
import { global } from '@/common'

export default {
  name: 'Info',
  data() {
    return {
      statusData: null,
      statusLoading: false,
      labelPosition: 'right',
      renderIsOnline: renderIsOnline,
      renderOtaStatus: renderOtaStatus,
      renderProgress:renderProgress,
      renderTime:renderTime,
      deviceType: global.deviceType,
      productModel: [],
      mainTemp: {
        deviceName: '',
        deviceType: '',
        factoryName: '',
        productKey: '',
        productModel: '',
        hardVersion: ''
      },
      factoryName: [],
      hardVersion: [],
      rules: {
        deviceName: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        factoryName: [{ required: true, message: '请选择厂商名称', trigger: 'blur' }],
        productModel: [{ required: true, message: '请选择产品型号', trigger: 'blur' }],
        hardVersion: [{ required: true, message: '请选择硬件版本', trigger: 'blur' }]
      },
      infoQuery: JSON.parse(sessionStorage.getItem('infoQuery'))
    }
  },
  created() {
    this.handleStatus()
    this.setMainTemp()
  },
  methods: {
    // 状态
    handleStatus() {
      this.statusLoading = true
      const query = JSON.parse(sessionStorage.getItem('infoQuery'))
      this.statusData = []
      queryDeviceStatus(query).then(res => {
        if (res.data != null) {
          this.statusLoading = false
          if (res.data.success) {
            if (res.data.data !== null) {
              this.statusData.push(res.data.data)
            }
          } else {
            this.statusLoading = false

            this.$message({
              showClose: true,
              message: '无此设备或此设备未曾上线过',
              type: 'error',
              duration: 5000
            })
          }
        }

      })

    },
    //  添加表单
    setMainTemp() {
      this.mainTemp.deviceType = this.infoQuery.deviceType
      this.mainTemp.factoryName = this.infoQuery.factoryName
      this.mainTemp.productModel = this.infoQuery.productModel
      this.mainTemp.hardVersion = this.infoQuery.hardVersion
      this.mainTemp.deviceName = this.infoQuery.deviceName
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
