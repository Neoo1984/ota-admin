<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item label="厂商名称">
        <el-input clearable v-model="listQuery.factoryName" placeholder="厂商名称" style="width: 200px"
                  class="filter-item"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-input clearable v-model="listQuery.productModel" placeholder="产品型号" style="width: 200px"
                  class="filter-item"
        ></el-input>
      </el-form-item>

      <el-button type="primary" @click="search" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="primary" @click="clearSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus" size="small">新增</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="产品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="renderType(scope.row.productType,true)">
            {{ renderType(scope.row.productType, false) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="厂商名称" align="center">
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
          <el-tag v-for="(item,index) in listHardVersion(scope.row.hardVersion)" type="success">
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="硬件版本" align="center">
        <template slot-scope="scope">
          {{ scope.row.hardVersion }}
        </template>
      </el-table-column>
      <el-table-column label="型号描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.details }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-popconfirm
            confirm-button-text="删除"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="是否确定删除？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              style="margin-left: 10px;color: #F56C6C"
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      v-loading="submitLoading"
      element-loading-text="提交中..."
      width="60%"
    >
      <el-form ref="dataForm" :rules="rules" :model="temp" class="demo-form-inline" :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input clearable v-model="temp.productName" placeholder="请输入产品名称" style="width: 80%" class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="厂商名称" prop="factoryName">
          <el-select v-model="temp.factoryName" placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in factoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <el-select v-model="temp.productType" placeholder="请选择产品类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in productType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productModel">
          <el-input clearable v-model="temp.productModel" placeholder="请输入产品型号" style="width: 80%" class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion">
          <el-tag
            :key="tag"
            v-for="tag in hardVersion"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="hardTagVisible"
            v-model="hardValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 硬件版本</el-button>
        </el-form-item>
        <el-form-item label="型号描述" prop="details">
          <el-input v-model="temp.details" type="textarea" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=cancelCreate()>取 消</el-button>
        <el-button type="primary" @click=createData()>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="updateDialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      element-loading-text="提交中..."
      width="60%"
    >
      <el-form v-loading="submitLoading" ref="updateForm" :rules="rules" :model="updateTemp" class="demo-form-inline"
               :label-position="labelPosition" label-width="100px"
      >
        <el-form-item label="产品名称" prop="details" label-width="25%">
          <el-input clearable v-model="updateTemp.productName" placeholder="请输入产品名称" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="厂商名称" prop="details" label-width="25%">
          <el-select v-model="updateTemp.factoryName" placeholder="请选择厂商名称" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in factoryName"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="productType" label-width="25%">
          <el-select v-model="updateTemp.productType" placeholder="请选择产品类型" style="width: 80%" class="filter-item">
            <el-option
              v-for="item in productType"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件版本" prop="hardVersion" label-width="25%">
          <el-tag
            :key="tag"
            v-for="tag in hardVersion"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="hardTagVisible"
            v-model="hardValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 硬件版本</el-button>
        </el-form-item>
        <el-form-item label="产品型号" prop="details" label-width="25%">
          <el-input clearable v-model="updateTemp.productModel" placeholder="请输入产品型号" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品型号描述" prop="details" label-width="25%">
          <el-input clearable v-model="updateTemp.details" type="textarea" style="width: 80%" class="filter-item"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click=cancelUpdate()>取 消</el-button>
        <el-button type="primary" :disabled="submitLoading" @click=updateData()>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList } from '@/api/table'
import Pagination from '@/components/Pagination'
import { createProduct, deleteProduct, getFactoryNameList, updateProduct } from '@/api/operation'
import { global } from '@/common'
import { renderType,renderHardVersion } from '@/utils'

export default {
  name: 'Product',
  components: { Pagination },
  data() {
    const validateHardVersion = (rule, value, callback) => {
      if (this.hardVersion.length === 0) {
        callback('硬件版本不可为空')
      } else if (this.hardVersion.indexOf(this.hardValue) !== -1) {
        callback(new Error('硬件版本不可重复'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      submitLoading: false,
      total: 0,
      labelPosition: 'right',
      factoryName: [],
      hardVersion: [],
      hardValue: '',
      productType: global.productType,
      renderType: renderType,
      renderHardVersion:renderHardVersion,
      getModel: {},
      listQuery: {
        current: 1,
        size: 20,
        factoryName: undefined,
        productModel: undefined
      },
      dialogVisible: false,
      updateDialogVisible: false,
      hardTagVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      disabled: false,
      dialogStatus: '',
      temp: {
        productName: undefined,
        factoryName: undefined,
        hardVersion: undefined,
        productModel: undefined,
        details: undefined,
        productType: undefined
      },
      updateTemp: {
        productName: '',
        factoryName: '',
        hardVersion: '',
        productId: '',
        productModel: '',
        details: '',
        productType: ''
      },
      rules: {
        factoryName: [{ required: true, message: '请选择厂商', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productModel: [{ required: true, message: '请输入产品型号', trigger: 'blur' }],
        productType: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
        hardVersion: [{ required: true, validator: validateHardVersion, trigger: 'change' }],
        details: [{ required: true, message: '请输入产品型号描述', trigger: 'blur' }]
      },
      updateRules: {
        factoryName: [{ required: true, message: '请选择厂商', trigger: 'blur' }],
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        productModel: [{ required: true, message: '请输入产品型号', trigger: 'blur' }],
        productType: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],
        details: [{ required: true, message: '请输入产品型号描述', trigger: 'blur' }],
        hardVersion: [{ required: true, validator: validateHardVersion, trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProductList(this.listQuery).then(res => {
        if (res.data.data.records !== null) {
          let data = res.data.data
          this.list = data.records
          this.total = data.total
          this.listLoading = false
        } else {
          this.listLoading = false
          this.$message({
            showClose: true,
            message: message,
            type: 'error'
          })
        }

      })

    },
    listHardVersion(hardVersion){
      return hardVersion.split(',')
    },
    //新增
    cancelCreate() {
      this.dialogVisible = false
      this.factoryName = []
      this.hardVersion = []
    },
    handleCreate() {
      this.resetTemp()
      this.factoryName = []
      this.hardVersion = []
      this.dialogVisible = true
      this.dialogStatus = 'create'
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var data = res.data.data
            data.forEach((item, index) => {
              this.factoryName.push({ value: item, label: item })
            })
          } else {
            this.$message({
              showClose: true,
              message: '不存在厂商',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.hardVersion.forEach((item, index) => {
            this.temp.hardVersion += item + ','
          })
          this.temp.hardVersion = this.temp.hardVersion.substring(0, this.temp.hardVersion.lastIndexOf(','))
          this.submitLoading = true
          createProduct(this.temp).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.submitLoading = false
              this.dialogVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 5000
              })
            } else {
              this.submitLoading = false
              this.$notify.error({
                title: '失败',
                message: message,
                duration: 5000
              })
            }
          })
          this.factoryName = []
          this.hardVersion = []
        }
      })
    },

    // 编辑
    cancelUpdate() {
      this.updateDialogVisible = false
      this.factoryName = []
      this.hardVersion = []
    },
    handleUpdate(index, row) {
      this.updateDialogVisible = true
      this.dialogStatus = 'update'
      this.updateTemp.details = row.details
      this.updateTemp.factoryName = row.factoryName
      this.hardVersion = []
      this.updateTemp.hardVersion = ''
      this.hardVersion = row.hardVersion.split(',')
      this.updateTemp.productType = row.productType
      this.productType.forEach((item, index) => {
        if (item.value.toString() === row.productType) {
          this.updateTemp.productType = item.value
        }
      })
      this.updateTemp.productModel = row.productModel
      this.updateTemp.productName = row.productName
      this.updateTemp.productId = row.productId
      getFactoryNameList().then(res => {
        if (res.data.success) {
          if (res.data.data.length !== 0) {
            var data = res.data.data
            data.forEach((item, index) => {
              this.factoryName.push({ value: item, label: item })
            })
          } else {
            this.$message({
              showClose: true,
              message: '不存在厂商',
              type: 'error'
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }
      })
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.hardVersion.forEach((item, index) => {
            this.updateTemp.hardVersion += item + ','
          })
          this.updateTemp.hardVersion = this.updateTemp.hardVersion.substring(0, this.updateTemp.hardVersion.lastIndexOf(','))
          this.submitLoading = true
          updateProduct(this.updateTemp).then(res => {
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
                type: 'error',
                duration: 0
              })
            }
          })
          this.submitLoading = false
          this.hardVersion = []
        }
      })
    },
    //硬件多选
    handleClose(tag) {
      this.hardVersion.splice(this.hardVersion.indexOf(tag), 1)
    },
    showInput() {
      this.hardTagVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let hardValue = this.hardValue
      if (hardValue) {
        this.hardVersion.push(hardValue)
      }
      this.hardTagVisible = false
      this.hardValue = ''
    },
    //删除
    handleDelete(index, row) {
      deleteProduct(row.productId).then(res => {
        const message = res.data.message
        if (res.data.success) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: message,
            type: 'error',
            duration: 0
          })
        }
      })
    },
    //搜索
    search() {
      this.getList()
    },
    //重置新增输入框
    resetTemp() {
      this.temp.productName = undefined
      this.temp.details = undefined
      this.temp.hardVersion = undefined
      this.temp.factoryName = undefined
      this.temp.productModel = undefined
      this.temp.productType = undefined
    },
    //重置搜索
    clearSearch() {
      this.listQuery.factoryName = undefined
      this.listQuery.productModel = undefined
      this.getList()
    }
  }
}
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
