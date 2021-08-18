<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item label="商户名称">
        <el-input clearable v-model="listQuery.tenantName" placeholder="商户名称" style="width: 200px" class="filter-item"
        ></el-input>
      </el-form-item>
      <el-form-item label="商户地址">
        <el-input clearable v-model="listQuery.address" placeholder="商户地址" style="width: 200px" class="filter-item"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人">
        <el-input clearable v-model="listQuery.manager" placeholder="联系人" style="width: 200px" class="filter-item"
        ></el-input>
      </el-form-item>
      <el-button type="primary" @click="search" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus" size="small">新增</el-button>
      <el-button type="success" @click="reSearch" icon="el-icon-refresh" size="small">重置搜索</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="商户名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.tenantName }}
        </template>
      </el-table-column>
      <el-table-column label="商户地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row.$index, scope.row)"
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
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form ref="temp" v-loading="submitLoading" :rules="rules" :model="temp" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px"
      >
        <el-form-item label="商户名称" prop="tenantName">
          <el-input :disabled=disabled v-model="temp.tenantName" placeholder="商户名称" style="width: 80%"
                    class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="商户地址" prop="address">
          <el-input v-model="temp.address" placeholder="商户地址" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="manager">
          <el-input v-model="temp.manager" placeholder="联系人" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="联系人电话" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitLoading" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStoreList } from '@/api/table'
import Pagination from '@/components/Pagination'
import { createStore, deleteStore, updateStore } from '@/api/operation'
import { validatePhone } from '@/utils/validate'

export default {
  name: 'Stores',
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      submitLoading: false,
      labelPosition: 'right',
      total: 0,
      disabled: false,
      listQuery: {
        current: 1,
        size: 20,
        tenantName: undefined,
        manager: undefined,
        address: undefined
      },
      dialogVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      temp: {
        tenantName: undefined,
        address: undefined,
        manager: undefined,
        mobile: undefined
      },
      validatePhone: validatePhone,

      rules: {
        tenantName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }, {
          min: 1,
          max: 20,
          message: '商户名过长',
          trigger: 'blur'
        }],
        address: [{ required: true, message: '请输入商户地址', trigger: 'blur' }, {
          min: 1,
          max: 20,
          message: '商户地址过长',
          trigger: 'blur'
        }],
        manager: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }, {
          min: 1,
          max: 20,
          message: '联系人姓名过长',
          trigger: 'blur'
        }],
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }]
      }

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getStoreList(this.listQuery).then(res => {
        if (res.data.success) {
          this.listLoading = false
          this.list = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.listLoading = false
          this.$message({
            showClose: true,
            message: res.data.message,
            type: 'error'
          })
        }

      })

    },

    //新增
    handleCreate() {
      this.resetTemp()
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.disabled = false
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    createData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          createStore(this.temp).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.submitLoading = false
              this.dialogVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: message,
                type: 'success'
              })
            } else {
              this.submitLoading = false
              this.$notify.error({
                title: '失败',
                message: message,
                type: 'error',
                duration: 0
              })
            }

          })
        }
      })
    },
    // 编辑
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.dialogStatus = 'update'
      this.temp = Object.assign({}, row)
      this.disabled = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.submitLoading = true
          updateStore(tempData).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.submitLoading = false
              this.dialogVisible = false
              this.getList()
              this.$message({
                showClose: true,
                message: message,
                type: 'success'
              })
            } else {
              this.submitLoading = false
              this.$notify.error({
                title: '失败',
                message: message,
                type: 'error',
                duration: 0
              })
            }
          })
        }
      })
    },

    //删除
    handleDelete(index, row) {
      deleteStore(row.tenantId).then(res => {
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
    resetTemp() {
      this.temp.tenantName = undefined
      this.temp.address = undefined
      this.temp.manager = undefined
      this.temp.mobile = undefined
    },
    //重置搜索
    reSearch() {
      this.listQuery.tenantName = undefined
      this.listQuery.address = undefined
      this.listQuery.manager = undefined
      this.getList()
    }
  }
}
</script>
