<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="设备类型">
          <el-select v-model="listQuery.deviceType" @change="getList" placeholder="请选择设备类型">
            <el-option
              v-for="item in listDeviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厂商">
          <el-select filterable @focus="getFactoryName" @change="getList" v-model="listQuery.factoryName"
                     placeholder="请选择厂商名称"
                     style="width: 200px" class="filter-item">
            <el-option
              v-for="item in listFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-select @focus="getProduct" @change="getList" v-model="listQuery.productModel" placeholder="请选择产品型号"
                     style="width: 200px" class="filter-item">
            <el-option
              v-for="item in listProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本">
          <el-select v-model="listQuery.hardVersion" @focus="getHard" @change="getList" placeholder="请选择产品型号"
                     style="width: 200px" class="filter-item">
            <el-option
              v-for="item in listHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否在线">
          <el-select v-model="listQuery.isOnline" @change="getList" placeholder="请选择是否在线" style="width: 200px"
                     class="filter-item">
            <el-option
              v-for="item in isOnline"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备编码">
          <el-input @change="getList" v-model="listQuery.deviceName" :disabled=slaveDisabled placeholder="请输入设备编码"
                    style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>

        <el-button type="primary" @click="getList" icon="el-icon-search" size="small">查询</el-button>
        <el-button type="primary" @click="handleMainCreate" icon="el-icon-plus" size="small">新建主设备</el-button>
        <el-button type="primary" @click="handleSlaveCreate" icon="el-icon-plus" size="small">新建从设备</el-button>
        <el-button type="primary" @click="handleUploadMain" icon="el-icon-document-add" size="small">批量导入</el-button>
        <el-tooltip class="item" effect="dark" content="请选择相同设备类型，厂家，硬件和产品型号的主设备！" placement="bottom-start">
          <el-button type="primary" @click="handleOta" icon="el-icon-thumb" size="small">批量OTA</el-button>
        </el-tooltip>
        <!--        <el-button type="primary" @click="handleOtaCreate" icon="el-icon-thumb" size="small">新建OTA任务</el-button>-->
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      @select="selectOta"
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column
        type="selection"
        width="40"
      >
      </el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>

      <el-table-column label="设备编号" :sortable="true" align="center" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类型"
                       align="center" :formatter="renderType" prop="deviceType">
      </el-table-column>
      <el-table-column label="厂商名称" align="center" prop="factory">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center">
        <template slot-scope="scope">
          {{ scope.row.productModel }}
        </template>
      </el-table-column>

      <el-table-column label="硬件版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.hardVersion || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="软件版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.softVersion || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="主设备" align="center">
        <template slot-scope="scope">
          {{ scope.row.mainDeviceName || '--' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.$index, scope.row)"
            v-if="scope.row.deviceType === '2'"
          >详情
          </el-button>
          <!--          <el-button
                      size="mini"
                      type="text"
                      @click="handleCommand(scope.$index, scope.row)">指令
                    </el-button>-->
          <el-popconfirm
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="是否确定删除？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              style="margin-left: 10px"
              size="mini"
              type="text"
              slot="reference"
            >删除
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size"
                @pagination="getList"
    />
    <!--新增 / 编辑-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="mainDialogVisible"
      width="60%"
    >
      <el-form ref="mainDataForm" :rules="rules" :model="mainTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="mainTemp.factoryName" @focus="getFactoryName" @change="getFormProduct"
                     placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="mainTemp.deviceType" placeholder="请选择设备类型" @change="getFormProduct" style="width: 80%"
                     class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主设备编码" prop="mainDeviceName" v-if="isSlave">
          <el-input v-model="mainTemp.mainDeviceName" :disabled=slaveDisabled placeholder="请输入主设备" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceName">
          <el-input v-model="mainTemp.deviceName" placeholder="请输入设备编号" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel" v-if="mainTemp.factoryName &&  mainTemp.deviceType">
          <el-select v-model="mainTemp.productModel" @focus="getFormProduct" @change="getFormHard" placeholder="请选择产品型号"
                     style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion" v-if="mainTemp.factoryName && mainTemp.deviceType">
          <el-select v-model="mainTemp.hardVersion" placeholder="请选择硬件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本">
          <el-input v-model="mainTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="mainDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="dialogStatus ==='mainCreate'?createData():dialogStatus ==='slaveCreate'?createData() : updateData()"
        >确 定</el-button>

      </span>
    </el-dialog>
    <!--上传-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="mainUploadDialogVisible"
      :show-close="false"
      width="60%"
    >
      <el-form ref="mainTemp" :rules="rules" :model="mainTemp"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="mainTemp.factoryName" @focus="getFactoryName" @change="getFormProduct"
                     placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempFactoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="mainTemp.deviceType" @change="getFormProduct" placeholder="请选择设备类型" style="width: 80%"
                     class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主设备编码">
          <el-input v-model="mainTemp.mainDeviceName" placeholder="请输入主设备" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>

        <el-form-item label="产品型号" prop="productModel" v-if="mainTemp.factoryName &&  mainTemp.deviceType">
          <el-select v-model="mainTemp.productModel" @focus="getFormProduct" @change="getFormHard" placeholder="请选择产品型号"
                     style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion" v-if="mainTemp.productModel">
          <el-select v-model="mainTemp.hardVersion" placeholder="请选择硬件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本">
          <el-input v-model="mainTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>

        <el-form-item label="模板下载">
          <el-button size="small" type="success" @click=downloadExcel()>下载模板Excel</el-button>
          <el-link type="warning" :underline="false"> 请先下载模板，上传的Excel格式需和模板Excel格式一致</el-link>
        </el-form-item>

        <el-form-item label="上传Excel" style="width: 80%" prop="excelFile">
          <el-upload
            class="upload-demo"
            ref="upload"
            v-loading="uploadLoading"
            element-loading-text="上传中..."
            action=""
            :on-success="handleSuccess"
            :http-request="getFile"
            :limit=1
            :on-change="handleChange"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="结果文件下载" v-if="isDownload">
          <el-button size="small" type="success" @click=downloadResult()>下载结果文件</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload()">关 闭</el-button>
        <el-button type="primary" v-if="!isDownload" :disabled="uploadLoading" @click=uploadMain()>确 定</el-button>
      </span>
    </el-dialog>

    <!--    指令-->
    <!--    <el-dialog
          :title="textMap[dialogStatus]"
          :visible.sync="commandVisible"
          width="90%"
        >
          <el-table
            :data="commandList"
            v-loading="cmdLoading"
            style="width: 100%"
          >
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
                      :limit.sync="commandListQuery.size" @pagination="getCommandList"
          />
          <span slot="footer" class="dialog-footer">
            <el-button @click="commandVisible = false">关 闭</el-button>
          </span>
        </el-dialog>-->
    <!--ota-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="otaDialogVisible"
      width="60%"
    >
      <el-form ref="otaRef" :rules="otaRules" :model="otaTemp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="厂商">
          <el-input style="width: 80%" v-model="otaTemp.factoryName" disabled/>
        </el-form-item>
        <el-form-item label="硬件版本">
          <el-input style="width: 80%" v-model="otaTemp.hardVersion" disabled/>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input style="width: 80%" v-model="otaTemp.productModel" disabled/>
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
        <el-form-item label="升级方式">
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
        <el-form-item>
          <el-switch
            inactive-text="查看OTA结果"
            v-model="lookOtaTable"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-table
            :data="otaResultList"
            v-if="lookOtaTable"
            style="width: 80%"
          >
            <el-table-column label="设备编号" align="center">
              <template slot-scope="scope">
                {{ scope.row.deviceName }}
              </template>
            </el-table-column>
            <el-table-column label="OTA结果" align="center">
              <template slot-scope="scope">
                {{ scope.row.result }}
              </template>
            </el-table-column>

          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="otaDialogVisible = false">{{ btnCancelText }}</el-button>
        <el-button type="primary" v-if="showResult" @click=ota()>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {getDevice} from '@/api/table'
import {
  createDevice,
  deleteDevice,
  downloadFile,
  getFactoryNameList,
  massSave,
  otaSend,
  queryProductModelList,
  querySoftVersion,
  updateDevice
} from '@/api/operation'
import {renderCmdResult, renderCmdStatus, renderCmdType, renderType} from '@/utils'
import {global} from "@/common";

export default {
  name: 'Device',
  components: {Pagination},
  data() {
    return {
      list: null,
      otaResultList: null,
      commandList: null,
      listLoading: false,
      cmdLoading: false,
      total: 0,
      uploadLoading: false,
      commandTotal: 0,
      labelPosition: 'right',
      btnCancelText: '取消',
      disabled: false,
      lookOtaTable: false,
      showResult: true,
      mainDialogVisible: false,
      isSlave: false,
      otaSoft: true,
      slaveDisabled: false,
      otaDialogVisible: false,
      commandVisible: false,
      listDeviceType: global.tempDeviceType,
      deviceType: global.deviceType,
      isOnline: global.isOnline,
      factoryNameFilter: [],
      dialogStatus: '',
      listQuery: {
        current: 1,
        size: 20,
        deviceType: undefined,
        factoryName: undefined,
        hardVersion: undefined,
        productModel: undefined,
        isOnline: undefined,
        deviceName: undefined,
      },
      commandListQuery: {
        current: 1,
        size: 20,
        deviceName: ''
      },
      otaTemp: {
        deviceNames: [],
        packageId: undefined,
        updateType: 0,
        factoryName: '',
        hardVersion: '',
        productModel: '',
        factoryNames: [],
        hardVersions: [],
        productModels: []
      },
      updateType: global.updateType,
      renderCmdResult: renderCmdResult,
      renderCmdStatus: renderCmdStatus,
      renderCmdType: renderCmdType,
      renderType: renderType,
      // validateFile:validateFile,
      deviceNames: [],
      listProductModel: [
        {
          label: '全部',
          value: undefined
        }
      ],

      listHardVersion: [
        {
          label: '全部',
          value: undefined
        }
      ],
      hardVersion: [],
      hard: [],
      listFactoryName: [
        {
          label: '全部',
          value: undefined
        }
      ],
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
        ota: 'OTA'
      },
      mainTemp: {
        mainDeviceName: undefined,
        deviceName: undefined,
        deviceType: undefined,
        factoryName: undefined,
        productKey: undefined,
        productModel: undefined,
        hardVersion: undefined,
        softVersion: undefined,
        manufactoryCode: '',
        excelFile: undefined
      },
      rules: {
        deviceName: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
        deviceType: [{required: true, message: '请选择设备类型', trigger: 'blur'}],
        factoryName: [{required: true, message: '请选择厂商名称', trigger: 'blur'}],
        productModel: [{required: true, message: '请选择产品型号', trigger: 'blur'}],
        hardVersion: [{required: true, message: '请选择硬件版本', trigger: 'blur'}],
        mainDeviceName: [{required: true, message: '请输入主设备编码', trigger: 'blur'}],
        excelFile: [{required: true, validator: this.validateFile}]
      },
      otaRules: {packageId: [{required: true, message: '请选择软件版本', trigger: 'blur'}]},
      uploadFile: '',
      isDownload: false,
      downloadUrl: '',
      fileName: '',
    }
  },

  created() {
    this.getList()
  },
  watch: {
    'mainTemp.productModel': function (e) {
      let keyIndex = ''
      if (this.tempProductModel !== undefined) {
        keyIndex = this.tempProductModel.indexOf(this.mainTemp.productModel.value)
        this.tempProductModel.forEach((item, index) => {
          if (this.mainTemp.productModel === item.value) {
            keyIndex = index
          }
        })

        this.mainTemp.productKey = this.tempProductKey[keyIndex]
      }
    }
  },
  /* watch: {
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

     }
   },*/

  methods: {
    //查询参数可以为空，查询设备列表
    getList() {
      this.listLoading = true
      if (this.listQuery.productModel === undefined) {
        this.listQuery.hardVersion = undefined
      }
      getDevice(this.listQuery).then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            let device = res.data.data
            this.list = device.records
            this.total = device.total
          }
        } else {
          this.$message({
            showClose: true,
            message: '获取设备失败',
            type: 'error'
          })
        }
      })
      this.listLoading = false
    },
//过滤表格

//获取产品型号productModel 和硬件版本
    getProduct() {
      this.listProductModel = [
        {
          label: '全部',
          value: undefined
        }
      ]
      if (this.listQuery.factoryName !== undefined && this.listQuery.deviceType !== undefined) {
        const product = {
          factoryName: this.listQuery.factoryName,
          productType: this.listQuery.deviceType
        }
        queryProductModelList(product).then(res => {
          if (res.data.success && res.data.data.length !== 0) {
            if (res.data.data.infoList.length !== 0) {
              let productData = res.data.data.infoList
              productData.forEach((item, index) => {
                if (item.hardVersions.length !== 0) {
                  this.hard.push(item.hardVersions)
                }
                this.listProductModel.push({value: item.productModel, label: item.productModel})
              })
            }
          }
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请先选择设备类型和厂商！',
          type: 'warning',
          duration: 2000
        });
      }
    },
    getHard() {
      this.listHardVersion.length = 0
      if (this.listQuery.productModel !== undefined) {
        this.listHardVersion = [
          {
            label: '全部',
            value: undefined
          }
        ]
        let modelIndex = ''
        this.listProductModel.forEach((item, index) => {
          if (this.listQuery.productModel === item.value) {
            modelIndex = index - 1
          }
        })
        if (this.hard.length !== 0 && this.hard[modelIndex].length !== 0) {
          this.hard[modelIndex].forEach((item, index) => {
            this.listHardVersion.push({value: item, label: item})
          })
        }
      } else {
        console.log(this.listHardVersion)
        this.listHardVersion = [
          {
            label: '全部',
            value: undefined
          }
        ]
        this.hard = []
      }
    },
    getFactoryName() {
      this.tempFactoryName = []
      this.listFactoryName = [
        {
          label: '全部',
          value: undefined
        }
      ]
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            let data = res.data.data
            if (this.mainDialogVisible || this.mainUploadDialogVisible) {
              data.forEach((item, index) => {
                this.tempFactoryName.push({value: item, label: item})
              })
            } else {
              data.forEach((item, index) => {
                this.listFactoryName.push({value: item, label: item})
              })
            }

          } else {
            console.error(res.data.message)
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })

    },
    //表单产品类型,硬件型号
    getFormProduct() {
      this.hard = []
      this.tempProductModel = []
      this.tempHardVersion = []
      this.tempProductKey = []
      this.mainTemp.productModel = undefined
      this.mainTemp.hardVersion = undefined
      let query = {
        factoryName: this.mainTemp.factoryName,
        productType: this.mainTemp.deviceType
      }
      this.product(query).then(res => {
        this.tempProductModel = res.productModel
        this.tempProductKey = res.productKey
      })
    },

    async product(query) {
      let list = {
        productModel: [],
        productKey: []
      }
      try {
        if (query.factoryName !== undefined && query.productType !== undefined) {
          let res = await queryProductModelList(query)
          let data = res.data.data
          if (data.infoList.length !== 0) {
            data.infoList.forEach((item, index) => {
              if (item.hardVersions.length !== 0) {
                this.hard.push(item.hardVersions)
              }
              list.productModel.push({value: item.productModel, label: item.productModel})
              list.productKey.push(item.productKey)
            })
          }

        }
      } catch (err) {
        console.log(err)
      }
      return list
    },

    //获取
    getFormHard() {
      this.mainTemp.hardVersion = undefined
      this.tempHardVersion = this.hardVersions(this.tempProductModel, this.mainTemp.productModel)
    },
    hardVersions(productModel, chosenProduct) {
      let list = []
      let modelIndex = 0
      productModel.forEach((item, index) => {
        if (chosenProduct === item.value) {
          modelIndex = index
        }
      })
      if (this.hard.length !== 0 && this.hard[modelIndex].length !== 0) {
        this.hard[modelIndex].forEach((item, index) => {
          list.push({value: item, label: item})
        })
      }
      return list
    },

    //新增主设备
    handleMainCreate() {
      this.dialogStatus = 'mainCreate'
      this.isSlave = false
      this.resetMainTemp()
      this.mainDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mainDataForm'].clearValidate()
      })
    },
    //新建从设备
    handleSlaveCreate() {
      this.dialogStatus = 'slaveCreate'
      this.isSlave = true
      this.resetMainTemp()
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

      this.mainTemp = Object.assign({}, row)
      this.deviceType.forEach((item, index) => {
        if (item.value.toString() === row.deviceType) {
          this.mainTemp.deviceType = item.value
        }
      })
      this.mainDialogVisible = true
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
              this.getList()
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
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
              this.getList()
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
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

    //下载模板
    downloadExcel() {
      let query = {fileName: 'upload/exampleExcel.xlsx'}
      downloadFile(query).then(res => {
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
        const fileName = 'exampleExcel.xlsx'
        if ('download' in document.createElement('a')) { // 非IE下载
          const eLink = document.createElement('a')
          eLink.download = fileName
          eLink.style.display = 'none'
          eLink.href = URL.createObjectURL(blob)
          document.body.appendChild(eLink)
          eLink.click()
          URL.revokeObjectURL(eLink.href) // 释放URL 对象
          document.body.removeChild(eLink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    //上传
    getFile(param) {
      this.uploadFile = param.file
    },
    handleChange(file, fileList) {
      // if (fileList.length && fileList.length >= 1) {
      //   /**引用对象然后验证表单域-这个可以清除上一步不通过时的提示*/
      //   this.$refs.uploadRef.validateField('upload');
      // }
      this.$refs.mainTemp.validateField('excelFile');
      console.log(this.$refs.upload.$el)
      // this.$refs.upload.$el.children[0].children[1].value = "";
    },
    validateFile(rule, value, callback) {
      if (!this.$refs.upload.uploadFiles.length) {
        callback(new Error('请选择要上传的文件'));
      } else if (this.$refs.upload.uploadFiles.length > 1) {
        callback(new Error('每次上传只支持一个文件'));
      }
      const regx = new RegExp("(.xlsx)$|(.xls)$");
      /**这里有个坑，单文件上传，第一次上传错误格式接着上传第二次格式，列表中数组值有两个*/
      if (!regx.test(this.$refs.upload.uploadFiles[0].name)) {
        callback(new Error('文件格式只支持xlsx、xls'));
      }
      callback();

    },
    //cancel
    cancelUpload() {
      this.mainUploadDialogVisible = false
      this.$refs.upload.clearFiles()
    },
    handleUploadMain() {
      this.resetMainTemp()
      this.isDownload = false
      this.mainUploadDialogVisible = true
      this.$nextTick(() => {
        this.$refs['mainTemp'].clearValidate()
      })
    },
    uploadMain() {
      this.$refs['mainTemp'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          var form = new FormData()

          if (this.uploadFile) {
            form.append('file', this.uploadFile)
          }
          form.append('factoryName', this.mainTemp.factoryName)
          form.append('deviceType', this.mainTemp.deviceType)
          if (this.mainTemp.mainDeviceName !== undefined) {
            form.append('mainDeviceName', this.mainTemp.mainDeviceName)
          }
          form.append('hardVersion', this.mainTemp.hardVersion)
          form.append('productModel', this.mainTemp.productModel)
          form.append('productKey', this.mainTemp.productKey)
          if (this.mainTemp.softVersion !== undefined) {
            form.append('softVersion', this.mainTemp.softVersion)
          }

          this.uploadLoading = true
          massSave(form).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.uploadLoading = false
              let name = res.data.data
              let index = name.lastIndexOf('/')
              this.fileName = name.substring(index + 1, name.length)
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
          const blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
          const fileName = this.fileName
          if ('download' in document.createElement('a')) { // 非IE下载
            const eLink = document.createElement('a')
            eLink.download = fileName
            eLink.style.display = 'none'
            eLink.href = URL.createObjectURL(blob)
            document.body.appendChild(eLink)
            eLink.click()
            URL.revokeObjectURL(eLink.href) // 释放URL 对象
            document.body.removeChild(eLink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      }
    },

    handleSuccess(res, file, fileList) {
      this.$refs.upload.clearValidate()
    },


//OTA
    selectOta(selection, row) {
      this.otaTemp.productModels = []
      this.otaTemp.factoryNames = []
      this.otaTemp.hardVersions = []
      console.log(selection)
      selection.forEach((item, index) => {
        this.otaTemp.deviceNames.push(item.deviceName)
        this.otaTemp.factoryNames.push(item.factoryName)
        this.otaTemp.hardVersions.push(item.hardVersion)
        this.otaTemp.productModels.push(item.productModel)
      })
    },
    handleOta() {
      if (this.otaTemp.deviceNames.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择需要OTA的设备！',
          type: 'warning',
          duration: 2000
        });
      } else if (!this.otaTemp.factoryNames.every((item, index, arr) => item === this.otaTemp.factoryNames[0])) {
        this.$notify({
          title: '警告',
          message: '批量OTA需要选择相同的厂商！',
          type: 'warning',
          duration: 2000
        });
      } else if (!this.otaTemp.hardVersions.every((item, index, arr) => item === this.otaTemp.hardVersions[0])) {
        this.$notify({
          title: '警告',
          message: '批量OTA需要选择相同的硬件版本！',
          type: 'warning',
          duration: 2000
        });
      } else if (!this.otaTemp.productModels.every((item, index, arr) => item === this.otaTemp.productModels[0])) {
        this.$notify({
          title: '警告',
          message: '批量OTA需要选择相同的产品型号！',
          type: 'warning',
          duration: 2000
        });
      } else {
        this.otaTemp.factoryName = this.otaTemp.factoryNames[0]
        this.otaTemp.productModel = this.otaTemp.productModels[0]
        this.otaTemp.hardVersion = this.otaTemp.hardVersions[0]
        this.btnCancelText = '取消'
        this.showResult = true
        this.otaResultList = null
        this.dialogStatus = 'ota'
        this.otaDialogVisible = true
        const query = {
          factoryName: this.otaTemp.factoryName,
          hardVersion: this.otaTemp.hardVersion,
          productModel: this.otaTemp.productModel
        }
        this.softVersion = []
        querySoftVersion(query).then(res => {
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
              })
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
          let query = {
            deviceNames: this.otaTemp.deviceNames,
            packageId: this.otaTemp.packageId,
            updateType: this.otaTemp.updateType,
          }
          otaSend(query).then(res => {
            if (res.data.success) {
              this.btnCancelText = '确认'
              this.showResult = false
              this.$message({
                showClose: true,
                message: 'OTA下发成功',
                type: 'success'
              })
              this.otaResultList = res.data.data.results
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: 'error'
              })
            }
          })
          this.softVersion = []
        }
      })

    },

    //新建OTA任务
    handleOtaCreate() {

    },

//清除表单
    resetMainTemp() {
      this.mainTemp.deviceName = undefined
      this.mainTemp.deviceType = undefined
      this.mainTemp.factoryName = undefined
      this.mainTemp.hardVersion = undefined
      this.mainTemp.softVersion = undefined
      this.mainTemp.productModel = undefined
      this.mainTemp.mainDeviceName = undefined
      this.mainTemp.productKey = undefined
    },

    //删除
    handleDelete(index, row) {
      console.log(1)
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
    handleDetail(index, row) {
      const {href} = this.$router.resolve({
        name: 'Info',
        path: '/info',
        query: {
          deviceName: row.deviceName,
          factoryName: row.factoryName,
          deviceType: row.deviceType,
          hardVersion: row.hardVersion,
          productModel: row.productModel,
        }
      })
      window.open(href, '_blank')
    },
  }
}
</script>
