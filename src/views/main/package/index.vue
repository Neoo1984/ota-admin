<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item label="厂商">
        <el-select filterable @focus="getFactoryName" @change="getList" v-model="listQuery.factoryName"
                   placeholder="请选择厂商名称"
                   style="width: 200px" class="filter-item"
        >
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
        <el-input clearable v-model="listQuery.productModel" placeholder="产品型号" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="硬件型号">
        <el-input clearable v-model="listQuery.hardVersion" placeholder="硬件型号" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getList" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus" size="small">新增</el-button>
      <el-button type="primary" @click="clearSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>

    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>

      <el-table-column label="产品型号" align="center" width="120" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.productModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂商" align="center">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column label="硬件版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.hardVersion }}
        </template>
      </el-table-column>
      <el-table-column label="软件版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.softVersion }}
        </template>
      </el-table-column>
      <el-table-column label="软件版本描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.softDescribe }}
        </template>
      </el-table-column>

      <el-table-column label="软件详情" type="expand" width="150">
        <template slot-scope="props">
          <el-form label-position="left" class="fix-table-expand" label-width="100px">
            <el-form-item label="http下载地址">
              <span>{{ props.row.storeUrlPath }}</span>
            </el-form-item>
            <el-form-item label="ftp地址">
              <span>{{ props.row.storeFtpPath }}</span>
            </el-form-item>
            <el-form-item label="升级包md5">
              <span>{{ props.row.fileMd5 }}</span>
            </el-form-item>
            <el-form-item label="分包数">
              <span>{{ props.row.splitNums }}</span>
            </el-form-item>
            <el-form-item label="分包单元">
              <span>{{ props.row.splitLength }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.$index, scope.row)">编辑
          </el-button>
          <el-popconfirm
            confirm-button-text='删除'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="是否确定删除？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              style="margin-left: 10px;color: #F56C6C"
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="60%">
      <el-form ref="createRef" :rules="rules" :model="createTemp" class="demo-form-inline" :label-position="right"
               label-width="100px">
        <el-form-item label="厂商" prop="factoryName">
          <el-select v-model="createTemp.factoryName" @focus="getFactoryName" @change="getFormProduct" placeholder="请选择厂商" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in factoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="createTemp.deviceType" @change="getFormProduct" placeholder="请选择设备类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel" v-if="createTemp.factoryName &&  createTemp.deviceType">
          <el-select v-model="createTemp.productModel" @focus="getFormProduct" @change="getFormHard" placeholder="请选择产品型号" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempProductModel"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="硬件版本" prop="hardVersion" v-if="createTemp.factoryName &&  createTemp.deviceType">
          <el-select v-model="createTemp.hardVersion" placeholder="请选择硬件版本" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in tempHardVersion"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="软件版本" prop="softVersion">
          <el-input clearable v-model="createTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="软件描述" prop="softDescribe">
          <el-input clearable v-model="createTemp.softDescribe" placeholder="软件版本描述" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="是否拆包" prop="split" v-if="isSplit">
          <el-select v-model="createTemp.hasSplitPackage" placeholder="是否拆包" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in packageSplit"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拆包单位" prop="splitLength" v-if="createTemp.hasSplitPackage==='1' && isSplit">
          <el-select v-model="createTemp.splitLength" placeholder="请选择拆包单位" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in splitLength"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传软件包" prop="excelFile" style="width: 80%">
          <el-upload
            v-loading="uploadLoading"
            element-loading-text="上传中..."
            class="upload-demo"
            ref="upload"
            action=""
            :auto-upload='false'
            :on-change="handleChange"
            :on-error="handleError"
            :on-success="handleSuccess"
            :http-request="getFile"
            :on-remove="handleRemove"
            :limit=1>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" :disabled="fileList.length===0 || uploadLoading"
                   @click="dialogStatus ==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>

    <!--    update-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="updateDialogVisible"
      :close-on-click-modal="false"
      width="60%">
      <el-form ref="updateRef" :rules="rules" :model="createTemp" class="demo-form-inline" :label-position="right"
               label-width="100px">
        <el-form-item label="软件描述" prop="softDescribe">
          <el-input clearable v-model="createTemp.softDescribe" placeholder="软件版本描述" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=updateData()>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {softList} from "@/api/table";
import {global} from "@/common";
import {
  deleteSoft,
  getFactoryNameList,
  queryProductModelList,
  softSave,
  softUpdate
} from "@/api/operation";
import '@/styles/index.scss'
export default {
  name: 'Package',
  components: {Pagination},
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      right: "right",
      disabled: false,
      isSplit: false,
      hasFile: false,
      deviceType: global.deviceType,
      packageSplit: global.packageSplit,
      splitLength: global.splitLength,
      listFactoryName: [
        {
          label: '全部',
          value: undefined
        }
      ],
      listQuery: {
        current: 1,
        size: 20,
        factoryName: undefined,
        hardVersion: undefined,
        productModel: undefined,
        deviceType: undefined,
      },
      dialogVisible: false,
      updateDialogVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      factoryName: [],
      tempHardVersion: [],
      tempProductModel: [],
      tempProductKey: [],
      tempHard: [],
      createTemp: {
        softVersion: undefined,
        factoryName: undefined,
        hardVersion: undefined,
        productModel: undefined,
        hasSplitPackage: '0',
        splitLength: 0,
        splitNums: 0,
        objectId: "",
        softDescribe: "",
        deviceType: ""
      },
      rules: {
        factoryName: [{required: true, message: '请选择厂商', trigger: 'blur'}],
        productModel: [{required: true, message: '请选择产品型号', trigger: 'blur'}],
        hardVersion: [{required: true, message: '请选择硬件版本', trigger: 'blur'}],
        softVersion: [{required: true, message: '请选择软件版本', trigger: 'blur'}],
        hasSplitPackage: [{required: true, message: '请选择是否拆包', trigger: 'blur'}],
        splitLength: [{required: true, message: '请选择拆分单位', trigger: 'blur'}],
        softDescribe: [{required: true, message: '请输入软件版本描述', trigger: 'blur'}],
        deviceType: [{required: true, message: '请选择设备类型', trigger: 'blur'}],
      },
      uploadFile: '',
      fileList: [],
      uploadLoading: false
    }
  },
  created() {
    this.getList()
  },
  watch: {
    'mainTemp.productModel': function (e) {
      let keyIndex = ''
      if (this.tempProductModel !== undefined) {
        keyIndex = this.tempProductModel.indexOf(this.createTemp.productModel.value)
        this.tempProductModel.forEach((item, index) => {
          if (this.createTemp.productModel === item.value) {
            keyIndex = index
          }
        })

        this.createTemp.productKey = this.tempProductKey[keyIndex]
      }
    }
  },
  methods: {
    getFactoryName() {
      this.factoryName = []
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
            if (this.dialogVisible) {
              data.forEach((item, index) => {
                this.factoryName.push({ value: item, label: item })
              })
            } else {
              data.forEach((item, index) => {
                this.listFactoryName.push({ value: item, label: item })
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
    getList() {
      this.listLoading = true
      softList(this.listQuery).then(response => {
          if (response.data.success) {
            this.listLoading = false
            const data = response.data.data
            this.list = data.records
            this.total = data.total
          } else {
            this.listLoading = false
            this.$message({
              showClose: true,
              message: response.data.message,
              type: 'error'
            });
          }
      })
    },
    getFormProduct() {
      this.hard = []
      this.tempProductModel = []
      this.tempHardVersion = []
      this.tempProductKey = []
      this.createTemp.productModel = undefined
      this.createTemp.hardVersion = undefined
      let query = {
        factoryName: this.createTemp.factoryName,
        productType: this.createTemp.deviceType
      }
      this.product(query).then(res => {
        this.tempProductModel = res.productModel
        this.tempProductKey = res.productKey
      })
    },
    getFormHard() {
      this.createTemp.hardVersion = undefined
      this.tempHardVersion = this.hardVersions(this.tempProductModel, this.createTemp.productModel)
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
    resetTemp() {
      this.createTemp.factoryName = undefined
      this.createTemp.hardVersion = undefined
      this.createTemp.productModel = undefined
      this.createTemp.hasSplitPackage = '0'
      this.createTemp.splitLength = 0
      this.createTemp.splitNums = 0
      this.createTemp.deviceType = undefined
      this.createTemp.softDescribe = undefined
      this.createTemp.softVersion = undefined
    },
    //取消
    cancel() {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
      this.isSplit = false
    },
    //新增
    handleCreate() {
      this.dialogStatus = 'create'
      this.factoryName = []
      this.resetTemp()
      this.isSplit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['createRef'].clearValidate()
      })
    },
    createData() {
      this.$refs['createRef'].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          var form = new FormData() //携带文件必须使用此对象
          if (this.uploadFile) {
            form.append("file", this.uploadFile)
          }
          form.append('splitLength', this.createTemp.splitLength)
          form.append('splitNums', this.createTemp.splitNums)
          form.append('factoryName', this.createTemp.factoryName)
          form.append('deviceType', this.createTemp.deviceType)
          form.append('hardVersion', this.createTemp.hardVersion)
          form.append('productModel', this.createTemp.productModel)
          form.append('hasSplitPackage', this.createTemp.hasSplitPackage)
          form.append('softDescribe', this.createTemp.softDescribe)
          form.append('softVersion', this.createTemp.softVersion)
          this.uploadLoading = true

          softSave(form).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.uploadLoading = false
              this.dialogVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: message,
                type: 'success'
              })
            } else {
              this.uploadLoading = false
              this.$notify.error({
                title: '失败',
                message: message,
                duration: 5000
              })
            }
          })
          this.$refs.upload.clearFiles()
          this.isSplit = false
        }
      })

    },
    // update
    handleUpdate(index, row) {
      this.resetTemp();
      this.dialogStatus = 'update'
      this.createTemp.objectId = row.objectId
      this.createTemp.softDescribe = row.softDescribe
      this.createTemp.factoryName = row.factoryName
      this.createTemp.productModel = row.productModel
      this.createTemp.hardVersion = row.hardVersion
      this.createTemp.softVersion = row.softVersion
      this.updateDialogVisible = true
      this.$nextTick(() => {
        this.$refs['updateRef'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updateRef'].validate((valid) => {
        if (valid) {
          const query = {
            objectId: this.createTemp.objectId,
            softDescribe: this.createTemp.softDescribe,
            factoryName: this.createTemp.factoryName,
            productModel: this.createTemp.productModel,
            hardVersion: this.createTemp.hardVersion,
            softVersion: this.createTemp.softVersion,
          }
          softUpdate(query).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.updateDialogVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: message,
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: message,
                duration: 0
              })
            }
          })
        }
      })
    },

    //删除
    handleDelete(index, row) {
      deleteSoft(row.objectId).then(res => {
        const message = res.data.message
        if (res.data.success) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        } else {
          this.$message({
            type: 'error',
            message: message
          })
        }
      })
    },
    //搜索
    search() {
      this.getList()
    },
    //重置搜索
    clearSearch() {
      this.listQuery.factoryName = undefined
      this.listQuery.hardVersion = undefined
      this.listQuery.productModel = undefined
      this.getList()
    },
    //上传
    handleChange(file, fileList) {
      if (file || fileList) {
        this.fileList = fileList
        this.uploadFile = file
        this.uploadFile = file
        const isLt5M = file.size / 1024 / 1024 < 5
        if (isLt5M) {
          this.isSplit = true
          this.hasFile = true
        }
      } else {
        this.isSplit = false
      }
    },
    handleError(err, file, fileList) {
      fileList = []
    },
    handleSuccess(err, file, fileList) {
      fileList = []
      this.isSplit = false
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.isSplit = false
    },
    getFile(param) {
      this.uploadFile = param.file
    },

  }
}
</script>
