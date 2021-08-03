<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item label="厂商名称">
        <el-input v-model="listQuery.factoryName" placeholder="厂商名称" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-input v-model="listQuery.productModel" placeholder="产品型号" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="硬件型号">
        <el-input v-model="listQuery.hardVersion" placeholder="硬件型号" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-button type="primary" @click="search" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus" size="small">新增</el-button>
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
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>

      <el-table-column label="产品型号" align="center" width="120" fixed="left">
        <template slot-scope="scope">
          <span>{{ scope.row.productModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂商名称" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
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
      <el-table-column label="软件版本描述" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.softDescribe }}
        </template>
      </el-table-column>
      <el-table-column label="http下载地址" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.storeUrlPath }}
        </template>
      </el-table-column>
      <el-table-column label="ftp地址" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.storeFtpPath }}
        </template>
      </el-table-column>
      <el-table-column label="升级包md5" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.fileMd5 }}
        </template>
      </el-table-column>
      <el-table-column label="分包数" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.splitNums }}
        </template>
      </el-table-column>
      <el-table-column label="分包单元" align="center" width="90">
        <template slot-scope="scope">
          {{ scope.row.splitLength }}
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="60%">
      <el-form ref="createRef" :rules="rules" :model="createTemp" class="demo-form-inline" :label-position="right"
               label-width="100px">
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="createTemp.factoryName" placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in factoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select v-model="createTemp.deviceType" placeholder="请选择设备类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in deviceType"
              :key="item.index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel" v-if="createTemp.factoryName &&  createTemp.deviceType">
          <el-select v-model="createTemp.productModel" placeholder="请选择产品型号" style="width: 80%" class="filter-item">
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
          <el-input v-model="createTemp.softVersion" placeholder="请输入软件版本" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="软件描述" prop="softDescribe">
          <el-input v-model="createTemp.softDescribe" placeholder="软件版本描述" style="width: 80%"
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
            :before-upload="beforeUpload"
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
      width="60%">
      <el-form ref="updateRef" :rules="rules" :model="createTemp" class="demo-form-inline" :label-position="right"
               label-width="100px">
        <el-form-item label="软件描述" prop="softDescribe">
          <el-input v-model="createTemp.softDescribe" placeholder="软件版本描述" style="width: 80%"
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
        // excelFile: [{required: true, message: '请上传文件', trigger: 'blur'}],
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
    'createTemp.factoryName': function (e) {
      if (this.createTemp.factoryName !== '' && this.createTemp.deviceType !== '') {
        const getModel = {factoryName: this.createTemp.factoryName, productType: this.createTemp.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
              this.tempHard.length = 0
              this.createTemp.hardVersion = ''
              this.createTemp.productModel = ''

              var data = res.data.data.infoList
              data.forEach((item, index) => {
                this.tempHard.push(item.hardVersions)
                this.tempProductModel.push({value: item.productModel, label: item.productModel})
              })
              this.createTemp.productModel = this.tempProductModel[0].label
              if (this.tempHard.length !== 0 && this.tempHard[0].length !== 0) {
                this.tempHard[0].forEach((item, index) => {
                  this.tempHardVersion.push({value: item, label: item})
                })
              }
            } else {
              this.createTemp.productModel = ''
              this.createTemp.hardVersion = ''
              this.tempHard.length = 0
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
            }
          }

        })
      }
    },
    'createTemp.deviceType': function (e) {
      if (this.createTemp.factoryName !== '' && this.createTemp.deviceType !== '') {
        const getModel = {factoryName: this.createTemp.factoryName, productType: this.createTemp.deviceType}
        queryProductModelList(getModel).then(res => {
          if (res.data.success) {
            if (res.data.data.length !== 0 && res.data.data.infoList.length !== 0) {
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
              this.tempHard.length = 0
              this.createTemp.hardVersion = ''
              this.createTemp.productModel = ''

              const data = res.data.data.infoList
              data.forEach((item, index) => {
                this.tempHard.push(item.hardVersions)
                this.tempProductModel.push({value: item.productModel, label: item.productModel})
              })

              this.createTemp.productModel = this.tempProductModel[0].label
              if (this.tempHard.length !== 0 && this.tempHard[0].length !== 0) {
                this.tempHard[0].forEach((item, index) => {
                  this.tempHardVersion.push({value: item, label: item})
                })
              }

            } else {
              this.createTemp.productModel = ''
              this.createTemp.hardVersion = ''
              this.tempHard.length = 0
              this.tempHardVersion.length = 0
              this.tempProductModel.length = 0
            }
          }

        })
      }
    },
    'createTemp.productModel': function (e) {
      if (this.createTemp.factoryName !== '' && this.createTemp.deviceType !== '') {
        if (this.tempHard.length !== 0 && this.tempProductModel.length !== 0) {
          this.tempHardVersion.length = 0
          this.createTemp.hardVersion = ''
          var modelIndex = ''
          this.tempProductModel.forEach((item, index) => {
            if (this.createTemp.productModel === item.value) {
              modelIndex = index
            }
          })
          this.tempHard[modelIndex].forEach((item, index) => {
            this.tempHardVersion.push({value: item, label: item})
          })
          this.createTemp.hardVersion = this.tempHardVersion[0].value
        }

      }

    },

  },
  methods: {
    getFactoryNameList() {
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var data = res.data.data
            data.forEach((item, index) => {
              this.factoryName.push({value: item, label: item})
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
    getList() {
      this.listLoading = true
      softList(this.listQuery).then(response => {
        if (response !== null) {
          const message = response.data.message
          if (response.data.success) {
            const data = response.data.data
            this.list = data.records
            this.total = data.total
          } else {
            this.$message({
              showClose: true,
              message: message,
              type: 'error'
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: '网络错误，无法获取数据',
            type: 'error'
          });
        }

      })
      this.listLoading = false
    },
    resetTemp() {
      this.createTemp.factoryName = ""
      this.createTemp.hardVersion = ""
      this.createTemp.productModel = ""
      this.createTemp.hasSplitPackage = '0'
      this.createTemp.splitLength = 0
      this.createTemp.splitNums = 0
      this.createTemp.deviceType = ""
      this.createTemp.softDescribe = ''
      this.createTemp.softVersion = ''
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
      this.getFactoryNameList()
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
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
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
      this.listQuery.factoryName = ""
      this.listQuery.hardVersion = ""
      this.listQuery.productModel = ""
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
    beforeUpload(file) {

    },
    getFile(param) {
      this.uploadFile = param.file
    },

  }
}
</script>
