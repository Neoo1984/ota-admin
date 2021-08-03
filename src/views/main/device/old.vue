<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="设备类型">
          <el-select v-model="listQuery.deviceType" placeholder="请选择设备类型">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂家名称">
          <el-select v-model="listQuery.factoryName" placeholder="请选择厂商名称" style="width: 200px" class="filter-item">
            <el-option
              v-for="item in factoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-select v-model="listQuery.productModel" placeholder="请选择产品型号" style="width: 200px" class="filter-item">
            <el-option
              v-for="item in productModel"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本">
          <el-select v-model="listQuery.hardVersion" placeholder="请选择产品型号" style="width: 200px" class="filter-item">
            <el-option
              v-for="item in hardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="search" icon="el-icon-search" size="small">查询</el-button>
        <el-button type="primary" @click="handleMainCreate" icon="el-icon-plus" size="small">新建主设备</el-button>
        <el-button type="primary" @click="handleSlaveCreate" icon="el-icon-plus" size="small">新建从设备</el-button>
        <el-button type="primary" @click="handleUploadMain" icon="el-icon-document-add" size="small">批量导入</el-button>
        <el-button type="primary" @click="handleOta" icon="el-icon-thumb" size="small">批量OTA</el-button>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      @select="selectOta"
      @select-all="selectAllOta"
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>

      <el-table-column label="设备编号" align="center" width="150" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" width="150" :formatter="renderType">
      </el-table-column>
      <el-table-column label="厂商名称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.productModel }}
        </template>
      </el-table-column>

      <el-table-column label="硬件版本" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.hardVersion }}
        </template>
      </el-table-column>
      <el-table-column label="软件版本" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.softVersion }}
        </template>
      </el-table-column>
      <el-table-column label="主设备" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.mainDeviceName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleStatus(scope.$index, scope.row)">状态
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            @click="handleCommand(scope.$index, scope.row)">指令-->
<!--          </el-button>-->
          <el-popconfirm
            confirm-button-text='删除'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="是否确定删除？"
            @onConfirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              style="margin-left: 10px"
              size="mini"
              type="text"
              slot="reference">删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
                @pagination="getList"/>
    <!--新增 / 编辑-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="mainDialogVisible"
      width="60%">
      <el-form ref="mainDataForm" :rules="rules" :model="mainTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px">
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="mainTemp.factoryName" placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="mainTemp.deviceType" placeholder="请选择设备类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主设备编码" prop="mainDeviceName" v-if="isSlave">
          <el-input v-model="mainTemp.mainDeviceName" :disabled=slaveDisabled placeholder="请输入主设备" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceName">
          <el-input v-model="mainTemp.deviceName" placeholder="请输入设备编号" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel" v-if="mainTemp.factoryName &&  mainTemp.deviceType">
          <el-select v-model="mainTemp.productModel" placeholder="请选择产品型号" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion" v-if="mainTemp.factoryName && mainTemp.deviceType">
          <el-select v-model="mainTemp.hardVersion" placeholder="请选择硬件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本">
          <el-input v-model="mainTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click='mainDialogVisible = false'>取消</el-button>
        <el-button type="primary"
                   @click="dialogStatus ==='mainCreate'?createData():dialogStatus ==='slaveCreate'?createData() : updateData()">确 定</el-button>

      </span>
    </el-dialog>
    <!--上传-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="mainUploadDialogVisible"
      :show-close="false"
      width="60%">
      <el-form ref="uploadRef" :rules="rules" :model="mainTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px">
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="mainTemp.factoryName" placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="mainTemp.deviceType" placeholder="请选择设备类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主设备编码">
          <el-input v-model="mainTemp.mainDeviceName" placeholder="请输入主设备" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="产品型号" prop="productModel" v-if="mainTemp.factoryName &&  mainTemp.deviceType">
          <el-select v-model="mainTemp.productModel" placeholder="请选择产品型号" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion" v-if="mainTemp.factoryName && mainTemp.deviceType">
          <el-select v-model="mainTemp.hardVersion" placeholder="请选择硬件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本">
          <el-input v-model="mainTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="模板下载">
          <el-button size="small" type="success" @click=downloadExcel()>下载模板Excel</el-button>
          <el-link type="warning" :underline="false">请先下载模板，上传的Excel格式需和模板Excel格式一致</el-link>
        </el-form-item>

        <el-form-item label="上传Excel" style="width: 80%">
          <el-upload
            class="upload-demo"
            ref="upload"
            v-loading="uploadLoading"
            element-loading-text="上传中..."
            action=""
            :before-upload="handleBefore"
            :on-change="handleChange"
            :on-success="handleSuccess"
            :http-request="getFile"
            :limit=1
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>

        </el-form-item>

        <el-form-item label="结果文件下载" v-if="isDownload">
          <el-button size="small" type="success" @click=downloadResult()>下载结果文件</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click='cancelUpload()'>关 闭</el-button>
        <el-button type="primary" v-if="!isDownload" :disabled="uploadLoading" @click=uploadMain()>确 定</el-button>
      </span>
    </el-dialog>
    <!--    状态-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="deviceStatusVisible"
      width="90%">
      <el-table
        :data="statusData"
        v-loading='statusLoading'
        style="width: 100%">
        <el-table-column label="设备编号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.deviceName }}
          </template>
        </el-table-column>
        <el-table-column label="是否在线" align="center" width="150" :formatter="renderIsOnline">
        </el-table-column>
        <el-table-column label="在线时间" align="center" width="150" :formatter="renderOnlineTime">
        </el-table-column>
        <el-table-column label="离线时间" align="center" width="150" :formatter="renderOfflineTime">
        </el-table-column>
        <el-table-column label="OTA版本" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.otaSoftVersion }}
          </template>
        </el-table-column>
        <el-table-column label="OTA状态" align="center" width="150" :formatter="renderOtaStatus">
        </el-table-column>
        <el-table-column label="刷新时间" align="center" width="150" :formatter="renderRefreshTime">
        </el-table-column>
        <el-table-column label="安装进度" align="center" width="150" :formatter="renderUpdateProgress">
          <template slot-scope="scope">
            {{ scope.row.updateProgress }}
          </template>
        </el-table-column>
        <el-table-column label="下载进度" align="center" width="150" :formatter="renderDownloadProgress">
          <template slot-scope="scope">
            {{ scope.row.downloadProgress }}
          </template>
        </el-table-column>

      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click='deviceStatusVisible = false'>关 闭</el-button>
      </span>
    </el-dialog>
    <!--    指令-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="commandVisible"
      width="90%">
      <el-table
        :data="commandList"
        v-loading='cmdLoading'
        style="width: 100%">
        <el-table-column label="指令内容" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.cmd }}
          </template>
        </el-table-column>
        <el-table-column label="指令编码" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.cmdCode }}
          </template>
        </el-table-column>
        <el-table-column label="指令主键id" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.cmdId }}
          </template>
        </el-table-column>
        <el-table-column label="指令类型" align="center" width="150" :formatter="renderCmdType">
        </el-table-column>
        <el-table-column label="指令状态" align="center" width="150" :formatter="renderCmdStatus">
        </el-table-column>

        <el-table-column label="指令编号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.messageId }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" width="150">
          <template slot-scope="scope">
            {{ scope.row.deviceName }}
          </template>
        </el-table-column>
        <el-table-column label="指令结果" align="center" width="150" :formatter="renderCmdResult">
        </el-table-column>

      </el-table>
      <pagination v-show="commandTotal>0" :total="commandTotal" :page.sync="commandListQuery.current"
                  :limit.sync="commandListQuery.size" @pagination="getCommandList"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click='commandVisible = false'>关 闭</el-button>
      </span>
    </el-dialog>
    <!--ota-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="otaDialogVisible"
      width="60%">
      <el-form ref="otaRef" :rules="otaRules" :model="otaTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px">
        <el-form-item label="软件版本" prop="packageId">
          <el-select v-model="otaTemp.packageId" placeholder="请选择软件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in softVersion"
              :key="item.index"
              :label="item.softVersion"
              :value="item.objectId">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-select v-model="otaTemp.updateType" placeholder="请选择升级方式" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in updateType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            inactive-text="查看OTA结果"
            v-model="lookOtaTable">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="otaResultList"
            v-if="lookOtaTable"
            style="width: 100%">
            <el-table-column label="设备编号" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.deviceName }}
              </template>
            </el-table-column>
            <el-table-column label="OTA结果" align="center" width="150">
              <template slot-scope="scope">
                {{ scope.row.result }}
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click='otaDialogVisible = false'>{{ btnCancelText }}</el-button>
        <el-button type="primary" v-if="showResult" @click=ota()>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getDevice} from "@/api/table";
import {
  createDevice,
  massSave,
  getFactoryNameList,
  queryProductModelList,
  queryDeviceStatus,
  cmdPage, queryHardVersion, otaSend, updateDevice, deleteDevice, downloadFile
} from "@/api/operation";
import {renderTime} from '@/utils'
export default {
  name: 'Device',
  components: {Pagination},
  data() {
    return {
      list: null,
      otaResultList: null,
      statusData: [],
      commandList: null,
      listLoading: true,
      statusLoading: false,
      cmdLoading: false,
      total: 0,
      uploadLoading: false,
      commandTotal: 0,
      labelPosition: "right",
      btnCancelText: '取消',
      disabled: false,
      lookOtaTable: false,
      showResult: true,
      mainDialogVisible: false,
      isSlave: false,
      otaSoft: true,
      slaveDisabled: false,
      deviceStatusVisible: false,
      otaDialogVisible: false,
      commandVisible: false,
      deviceType: [
        {
          label: "电池",
          value: 1
        },
        {
          label: "换电柜",
          value: 2
        },
        {
          label: "两轮车",
          value: 3
        },
      ],
      listQuery: {
        current: 1,
        size: 20,
        deviceType: "",
        factoryName: "",
        hardVersion: "",
        productModel: "",
      },
      commandListQuery: {
        current: 1,
        size: 20,
        deviceName: ''
      },
      otaTemp: {
        deviceNames: [],
        packageId: '',
        updateType: 0
      },
      updateType: [
        {
          label: "ftp下载",
          value: 0
        },
        {
          label: "Mqtt下载",
          value: 1
        },
        {
          label: "http下载",
          value: 2
        }
      ],
      deviceNames: [],
      productModel: [],
      hardVersion: [],
      hard: [],
      factoryName: [],
      tempProductModel: [],
      tempHardVersion: [],
      tempFactoryName: [],
      tempProductKey: [],
      tempHard: [],
      softVersion: [],
      mainUploadDialogVisible: false,
      textMap: {
        update: '修改设备',
        mainCreate: '新建主设备',
        slaveCreate: '新建从设备',
        status: '设备状态',
        command: '指令详情',
        ota: "OTA"
      },
      dialogStatus: '',
      mainTemp: {
        mainDeviceName: "",
        deviceName: "",
        deviceType: "",
        factoryName: "",
        productKey: "",
        productModel: "",
        hardVersion: "",
        softVersion: undefined,
        excelFile: null,
        manufactoryCode: ''
      },
      rules: {
        deviceName: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
        deviceType: [{required: true, message: '请选择设备类型', trigger: 'blur'}],
        factoryName: [{required: true, message: '请选择厂商名称', trigger: 'blur'}],
        productModel: [{required: true, message: '请选择产品型号', trigger: 'blur'}],
        hardVersion: [{required: true, message: '请选择硬件版本', trigger: 'blur'}],
        mainDeviceName: [{required: true, message: '请输入主设备编码', trigger: 'blur'}],
        excelFile: [{required: true, message: '请选择上传文件', trigger: 'blur'}],
      },
      otaRules: {packageId: [{required: true, message: '请选择软件版本', trigger: 'blur'}]},
      uploadFile: '',
      isDownload: false,
      downloadUrl: "",
      fileName: ""
    }
  },

  created() {
    this.getList()
  },
  watch: {
    'listQuery.factoryName': function (e) {
      if (this.listQuery.factoryName !== '' && this.listQuery.deviceType !== '') {
        const getModel = {factoryName: this.listQuery.factoryName, productType: this.listQuery.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.hardVersion.length = 0
              this.productModel.length = 0
              this.hard.length = 0
              this.listQuery.hardVersion = ''
              this.listQuery.productModel = ''
              const data = res.data.data.infoList
              data.forEach((item, index) => {
                this.hard.push(item.hardVersions)
                this.productModel.push({value: item.productModel, label: item.productModel})
              })
              this.listQuery.productModel = this.productModel[0].label
              if (this.hard.length !== 0 && this.hard[0].length !== 0) {
                this.hard[0].forEach((item, index) => {
                  this.hardVersion.push({value: item, label: item})
                })
                this.listQuery.hardVersion = this.hardVersion[0].label
              } else {
                this.hardVersion.length = 0
              }
            } else {
              this.listQuery.hardVersion = ''
              this.listQuery.productModel = ''
              this.hard.length = 0
              this.hardVersion.length = 0
              this.productModel.length = 0
            }
          }

        })
      }
    },
    'listQuery.deviceType': function (e) {
      if (this.listQuery.factoryName !== '' && this.listQuery.deviceType !== '') {
        const getModel = {factoryName: this.listQuery.factoryName, productType: this.listQuery.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.hardVersion.length = 0
              this.productModel.length = 0
              this.hard.length = 0
              this.listQuery.hardVersion = ''
              this.listQuery.productModel = ''
              const data = res.data.data.infoList
              data.forEach((item, index) => {
                this.hard.push(item.hardVersions)
                this.productModel.push({value: item.productModel, label: item.productModel})
              })
              this.listQuery.productModel = this.productModel[0].label
              if (this.hard.length !== 0 && this.hard[0].length !== 0) {
                this.hard[0].forEach((item, index) => {
                  this.hardVersion.push({value: item, label: item})
                })
                this.listQuery.hardVersion = this.hardVersion[0].label
              } else {
                this.hardVersion.length = 0
              }
            } else {
              this.listQuery.hardVersion = ''
              this.listQuery.productModel = ''
              this.hard.length = 0
              this.hardVersion.length = 0
              this.productModel.length = 0
            }
          }
        })
      }
    },
    'listQuery.productModel': function (e) {
      if (this.listQuery.factoryName !== '' && this.listQuery.deviceType !== '') {
        if (this.hard.length !== 0 && this.productModel.length !== 0) {
          this.hardVersion.length = 0
          this.listQuery.hardVersion = ''
          var modelIndex = ''
          this.productModel.forEach((item, index) => {
            if (this.listQuery.productModel === item.value) {
              modelIndex = index
            }
          })
          this.hard[modelIndex].forEach((item, index) => {
            this.hardVersion.push({value: item, label: item})
          })
          this.listQuery.hardVersion = this.hardVersion[0].value
        } else {
          this.hardVersion.length = 0
        }
      }
    },
    'mainTemp.factoryName': function (e) {
      if (this.mainTemp.factoryName !== '' && this.mainTemp.deviceType !== '') {
        const getModel = {factoryName: this.mainTemp.factoryName, productType: this.mainTemp.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
              this.tempHard.length = 0
              this.mainTemp.hardVersion = ''
              this.mainTemp.productModel = ''

              var data = res.data.data.infoList
              data.forEach((item, index) => {
                this.tempHard.push(item.hardVersions)
                this.tempProductKey.push(item.productKey)
                this.tempProductModel.push({value: item.productModel, label: item.productModel})
              })
              this.mainTemp.productModel = this.tempProductModel[0].label
              if (this.tempHard.length !== 0 && this.tempHard[0].length !== 0) {
                this.tempHard[0].forEach((item, index) => {
                  this.tempHardVersion.push({value: item, label: item})
                })
              }
            } else {
              this.mainTemp.productModel = ''
              this.mainTemp.hardVersion = ''
              this.tempHard.length = 0
              this.tempProductKey.length = 0
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
            }
          }

        })
      }
    },
    'mainTemp.deviceType': function (e) {
      if (this.mainTemp.factoryName !== '' && this.mainTemp.deviceType !== '') {
        const getModel = {factoryName: this.mainTemp.factoryName, productType: this.mainTemp.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
              this.tempHard.length = 0
              this.mainTemp.hardVersion = ''
              this.mainTemp.productModel = ''

              const data = res.data.data.infoList
              data.forEach((item, index) => {
                this.tempProductKey.push(item.productKey)
                this.tempHard.push(item.hardVersions)
                this.tempProductModel.push({value: item.productModel, label: item.productModel})
              })

              this.mainTemp.productModel = this.tempProductModel[0].label
              if (this.tempHard.length !== 0 && this.tempHard[0].length !== 0) {
                this.tempHard[0].forEach((item, index) => {
                  this.tempHardVersion.push({value: item, label: item})
                })
              }

            } else {
              this.mainTemp.productModel = ''
              this.mainTemp.hardVersion = ''
              this.tempHard.length = 0
              this.tempProductKey.length = 0
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
            }
          }

        })
      }
    },
    'mainTemp.productModel': function (e) {
      if (this.mainTemp.factoryName !== '' && this.mainTemp.deviceType !== '') {
        if (this.tempHard.length !== 0 && this.tempProductModel.length !== 0) {
          this.tempHardVersion.length = 0
          this.mainTemp.hardVersion = ''
          var modelIndex = ''
          this.tempProductModel.forEach((item, index) => {
            if (this.mainTemp.productModel === item.value) {
              modelIndex = index
            }
          })

          this.mainTemp.productKey = this.tempProductKey[modelIndex]
          this.tempHard[modelIndex].forEach((item, index) => {
            this.tempHardVersion.push({value: item, label: item})
          })
          this.mainTemp.hardVersion = this.tempHardVersion[0].value
        }

      }

    },
  },

  methods: {
    getList() {
      this.listLoading = true
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            const data = res.data.data
            data.forEach((item, index) => {
              this.factoryName.push({value: item, label: item})
            })

            const product = {
              factoryName: this.listQuery.factoryName,
              productType: this.listQuery.deviceType
            }
            queryProductModelList(product).then(res => {
              this.hardVersion.length = 0
              this.productModel.length = 0
              this.hard.length = 0
              if (res.data.success) {
                if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
                  var productData = res.data.data.infoList
                  var modelIndex = ''
                  productData.forEach((item, index) => {
                    if (item.hardVersions.length !== 0) {
                      this.hard.push(item.hardVersions)
                    }
                    this.productModel.push({value: item.productModel, label: item.productModel})
                  })
                  this.productModel.forEach((item, index) => {
                    if (this.listQuery.productModel === item.value) {
                      modelIndex = index
                    }
                  })
                  if (this.hard.length !== 0 && this.hard[0].length !== 0) {
                    this.hard[modelIndex].forEach((item, index) => {
                      this.hardVersion.push({value: item, label: item})
                    })
                  }
                  //获取设备
                  getDevice(this.listQuery).then(res => {
                    if (res.data.success) {
                      if (res.data.data.length !== 0) {
                        var device = res.data.data
                        this.list = device.records
                        this.total = device.total
                        this.listLoading = false
                      } else {
                        this.listLoading = false
                        this.$message({
                          showClose: true,
                          message: '获取设备失败',
                          type: 'error'
                        });
                      }
                    } else {
                      this.listLoading = false
                      this.$message({
                        showClose: true,
                        message: '获取设备失败',
                        type: 'error'
                      });
                    }
                  })
                } else {
                  this.listLoading = false
                  this.$message({
                    showClose: true,
                    message: "未找到产品信息，查询设备失败！",
                    type: 'error'
                  });
                }
              } else {
                this.listLoading = false
                this.$message({
                  showClose: true,
                  message: "未找到产品信息，查询设备失败！",
                  type: 'error'
                });
              }
            })
          } else {
            this.listLoading = false
            this.$message({
              showClose: true,
              message: "未找到任何厂商，无法查询设备！",
              type: 'error'
            });
          }
        } else {
          this.listLoading = false
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }

      })
    },

    getFactoryNameList() {
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var data = res.data.data
            data.forEach((item, index) => {
              this.tempFactoryName.push({value: item, label: item})
            })
          } else {
            this.$message({
              showClose: true,
              message: '不存在厂商',
              type: 'error'
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })

    },
    //渲染设备类型
    renderType(row, column, cellValue) {
      return row.deviceType === "1" ? '电池' : row.deviceType === "2" ? '换电柜' : '两轮车'
    },
    // 指令类型 cmdType: 1:OTA指令 2：设备OTA版本查询 3：设备固件升级
    // 指令状态 cmdStatus: 1:发送成功 2：受到设备回执通知
    // 执行结果 cmdResult: 0: 正确应答 1:无效报文 2：校验错误 3：指令超时 4：操作不必要 5：设备忙，无法操作
    renderCmdType(row, column, cellValue) {
      return row.deviceType === "1" ? 'OTA指令' : row.deviceType === "2" ? '设备OTA版本查询' : '设备固件升级'
    },
    renderCmdStatus(row, column, cellValue) {
      return row.isOnline === "1" ? '发送成功' : '收到设备回执通知'
    },
    renderCmdResult(row, column, cellValue) {
      switch (row.cmdResult) {
        case "0":
          return "正确应答"
        case "1":
          return "无效报文"
        case "2":
          return "校验错误"
        case "3":
          return "指令超时"
        case "4":
          return "操作不必要"
        case "5":
          return "设备忙，无法操作"
        default:
          return "无数据"
      }
    },
    //downloadProgress /updateProgress 0-100
    //设备是否在线 isOnline: 0：离线 1：上线

    renderIsOnline(row, column, cellValue) {
      return row.isOnline === "1" ? '在线' : '离线'
    },
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
    renderOtaStatus(row, column, cellValue) {
      switch (row.otaStatus) {
        case "1":
          return 'ota指令下发中'
        case "2":
          return 'ota指令下发成功'
        case "3":
          return '升级包下载中'
        case "4":
          return '升级包下载成功'
        case "5":
          return '升级包下载失败'
        case "6":
          return '设备固件更新中'
        case "7":
          return '设备固件更新失败'
        case "8":
          return '设备固件更新部分成功'
        case "9":
          return '设备固件更新成功'
        case "10":
          return 'ota超时'
        default:
          return "无数据"
      }
    },
    renderOnlineTime(row) {
      return renderTime(row.onlineTime)
    },
    renderOfflineTime(row) {
      return renderTime(row.offlineTime)
    },
    renderRefreshTime(row) {
      return renderTime(row.refreshTime)
    },
    renderUpdateProgress(row) {
      if (row.updateProgress !== null){
        return row.updateProgress+'%'
      }
    },
    renderDownloadProgress(row) {
      if (row.downloadProgress !== null){
        return row.downloadProgress+'%'
      }
    },
    //新增主设备
    handleMainCreate() {
      this.dialogStatus = 'mainCreate'
      this.isSlave = false
      this.tempFactoryName = []
      this.resetMainTemp()
      this.getFactoryNameList()
      this.mainDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mainDataForm'].clearValidate()
      })
    },
    //新建从设备
    handleSlaveCreate() {
      this.dialogStatus = 'slaveCreate'
      this.isSlave = true
      this.tempFactoryName = []
      this.resetMainTemp()
      this.getFactoryNameList()
      this.mainDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mainDataForm'].clearValidate()
      })
    },
    //编辑
    handleUpdate(index, row) {
      this.resetMainTemp()
      this.dialogStatus = 'update'
      if (row.mainDeviceName !== '') {
        this.isSlave = true
      }
      this.tempFactoryName = []
      this.mainTemp = Object.assign({}, row)
      this.deviceType.forEach((item, index) => {
        if (item.value.toString() === row.deviceType) {
          this.mainTemp.deviceType = item.value
        }
      })
      this.mainDialogVisible = true
      this.getFactoryNameList()
      this.$nextTick(() => {
        this.$refs['mainDataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['mainDataForm'].validate((valid) => {
        if (valid) {
          createDevice(this.mainTemp).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.mainDialogVisible = false
              //新建成功后，直接搜索该设备,并且同步搜索框

              var query = {
                current: this.listQuery.current,
                size: this.listQuery.size,
                productModel: this.mainTemp.productModel,
                hardVersion: this.mainTemp.hardVersion,
                factoryName: this.mainTemp.factoryName,
                deviceType: this.mainTemp.deviceType,
              }
              this.resetMainTemp()
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
              })
              getDevice(query).then(res => {
                if (res.data.success) {
                  if (res.data.data.length !== 0) {
                    var device = res.data.data
                    this.list = device.records
                    this.total = device.total
                    this.listLoading = false
                  }
                } else {
                  this.listLoading = false
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error'
                  });
                }
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: message,
                duration: 5000
              })
            }

          })
        }
      })
    },
    updateData() {
      this.$refs['mainDataForm'].validate((valid) => {
        if (valid) {
          updateDevice(this.mainTemp).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.mainDialogVisible = false
              //更新成功后，直接搜索该设备
              var query = {
                current: this.listQuery.current,
                size: this.listQuery.size,
                productModel: this.mainTemp.productModel,
                hardVersion: this.mainTemp.hardVersion,
                factoryName: this.mainTemp.factoryName,
                deviceType: this.mainTemp.deviceType,
              }
              this.resetMainTemp()
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
              })
              getDevice(query).then(res => {
                if (res.data.success) {
                  if (res.data.data.length !== 0) {
                    var device = res.data.data
                    this.list = device.records
                    this.total = device.total
                    this.listLoading = false
                  }
                } else {
                  this.listLoading = false
                  this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error'
                  });
                }
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: message,
                duration: 5000
              })
            }

          })
        }
      })
    },

    // 指令
    handleCommand(index, row) {
      this.cmdLoading = true
      this.dialogStatus = 'command'
      this.commandVisible = true
      this.commandListQuery.deviceName = row.deviceName
      this.getCommandList(this.commandListQuery)
    },
    getCommandList(data) {
      cmdPage(data).then(res => {
        this.listLoading = false
        if (res.data.success) {
          this.cmdLoading = false

          this.commandList = res.data.data.records
          this.commandTotal = res.data.data.total
        } else {
          this.cmdLoading = false
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          });
        }
      })
    },
    // 状态
    handleStatus(index, row) {
      this.statusData = []
      this.statusLoading = true
      this.dialogStatus = 'status'
      this.deviceStatusVisible = true
      const deviceName = {
        deviceName: row.deviceName
      }
      queryDeviceStatus(deviceName).then(res => {
        if (res.data.success) {
          this.statusLoading = false
          if (res.data.data.length !== 0) {
            this.statusData.push(res.data.data)
            this.listLoading = false
          }
        } else {
          this.statusLoading = false
          this.$message({
            showClose: true,
            message: '无此设备或此设备未曾上线过',
            type: 'error'
          });
        }
      })

    },
    //下载模板
    downloadExcel(){
      var query = {fileName: 'upload/exampleExcel.xlsx'}
      downloadFile(query).then(res => {
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
        const fileName = 'exampleExcel.xlsx'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    //上传
    getFile(param) {
      this.uploadFile = param.file
    },
    //cancel
    cancelUpload(){
      this.mainUploadDialogVisible = false
      this.$refs.upload.clearFiles()
    },
    handleUploadMain() {
      this.tempFactoryName = []
      this.resetMainTemp()
      this.isDownload = false
      this.mainUploadDialogVisible = true
      this.getFactoryNameList()
      this.$nextTick(() => {
        this.$refs['uploadRef'].clearValidate()
      })
    },
    uploadMain() {
      this.$refs['uploadRef'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          var form = new FormData()

          if (this.uploadFile) {
            form.append("file", this.uploadFile)
          }
          form.append('factoryName', this.mainTemp.factoryName)
          form.append('deviceType', this.mainTemp.deviceType)
          form.append('mainDeviceName', this.mainTemp.mainDeviceName)
          form.append('hardVersion', this.mainTemp.hardVersion)
          form.append('productModel', this.mainTemp.productModel)
          form.append('productKey', this.mainTemp.productKey)
          form.append('softVersion', this.mainTemp.softVersion)
          this.uploadLoading = true
          massSave(form).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.uploadLoading = false
              var name = res.data.data
              var index = name.lastIndexOf("/");
              this.fileName = name.substring(index + 1, name.length);
              this.listLoading = false
              this.uploadFile = ''
              this.$message({
                type: 'success',
                message: '上传成功'
              })
              this.downloadUrl = res.data.data
              this.isDownload = true
            } else {
              this.uploadLoading = false
              this.listLoading = false
              this.$message({
                type: 'error',
                message: message
              })
            }
          })
          this.$refs.upload.clearFiles()
        }
      })
    },
    downloadResult() {
      if (this.downloadUrl) {
        const query = {fileName: this.downloadUrl}
        downloadFile(query).then(res => {
          const blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
          const fileName = this.fileName
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      }
    },
    handleBefore(file) {
    },
    handleChange(file, fileList) {
      console.log(fileList)
    },
    handleSuccess() {
      this.$refs.upload.clearValidate()
    },

//OTA
    selectOta(selection, row) {
      selection.forEach((item, index) => {
        this.otaTemp.deviceNames.push(item.deviceName)
      })
    },
    selectAllOta(selection) {
      selection.forEach((item, index) => {
        this.otaTemp.deviceNames.push(item.deviceName)
      })
    },
    handleOta() {
      if (this.otaTemp.deviceNames.length === 0) {
        this.$alert('请选择需要OTA的设备', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      } else {
        this.btnCancelText = '取消'
        this.showResult = true
        this.otaResultList = null
        this.dialogStatus = 'ota'
        this.otaDialogVisible = true
        const query = {
          factoryName: this.listQuery.factoryName,
          hardVersion: this.listQuery.hardVersion,
          productModel: this.listQuery.productModel
        }
        this.softVersion = []
        queryHardVersion(query).then(res => {
            if (res.data.success) {
              if (res.data.data.length !== 0) {
                var data = res.data.data
                data.forEach((item, value) => {
                  this.softVersion.push({softVersion: item.softVersion, objectId: item.objectId})
                })
              }
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
          }
        )
        this.$nextTick(() => {
          this.$refs['otaRef'].clearValidate()
        })
      }
    },
    ota() {
      this.$refs['otaRef'].validate((valid) => {
        if (valid) {
          otaSend(this.otaTemp).then(res => {
            if (res.data.success) {
              this.btnCancelText = '确认'
              this.showResult = false
              this.$message({
                showClose: true,
                message: "OTA下发成功",
                type: 'success'
              });
              this.otaResultList = res.data.data.results
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
          })
          this.softVersion = []
        }
      })


    },
//清除表单
    resetMainTemp() {
      this.mainTemp.deviceName = ''
      this.mainTemp.deviceType = ''
      this.mainTemp.factoryName = ''
      this.mainTemp.hardVersion = ''
      this.mainTemp.softVersion = ''
      this.mainTemp.productModel = ''
      this.mainTemp.mainDeviceName = ''
      this.mainTemp.productKey = ''
    },
//搜索
    search() {
      this.listLoading = true
      if (this.listQuery.productModel !== '' && this.listQuery.hardVersion !== '' && this.listQuery.factoryName !== '' && this.listQuery.deviceType !== '') {
        getDevice(this.listQuery).then(res => {
          if (res.data.success) {
            this.listLoading = false
            if (res.data.data.length !== 0) {
              var device = res.data.data
              this.list = device.records
              this.total = device.total
              this.listLoading = false
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              });
            }
          } else {
            this.listLoading = false
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          }
        })
      } else {
        this.listLoading = false
        this.$notify({
          title: '失败',
          message: '搜索参数不能为空',
          type: 'error',
          duration: 5000
        })
      }

    },

    //删除
    handleDelete(index, row) {
      deleteDevice(row.deviceId).then(res => {
        const message = res.data.message
        if (res.data.success) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      })
    },
  }
}
</script>
