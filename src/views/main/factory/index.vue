<template>
  <div class="app-container">
    <el-form :inline="true" size="small">
      <el-form-item label="厂商名称">
        <el-input v-model="listQuery.factoryName" placeholder="厂商名称" style="width: 200px"
                  class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="厂商地址">
        <el-input v-model="listQuery.address" placeholder="厂商地址" style="width: 200px" class="filter-item"></el-input>
      </el-form-item>

      <el-button type="primary" @click="search" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="primary" @click="clearSearch" icon="el-icon-refresh-left" size="small">重置查询</el-button>
      <el-button type="primary" @click="handleCreate" icon="el-icon-plus" size="small">新增</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>

      <el-table-column label="厂商名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.factoryName }}
        </template>
      </el-table-column>
      <el-table-column label="厂商地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
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
      width="60%">
      <el-form v-loading="submitLoading" ref="dataForm" :rules="rules" :model="temp" class="demo-form-inline" :label-position="labelPosition"
               label-width="100px">
        <el-form-item label="厂商名称" prop="factoryName">
          <el-input :disabled=disabled v-model="temp.factoryName" placeholder="厂商名称" style="width: 80%"
                    class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="厂商地址" prop="address">
          <el-input v-model="temp.address" placeholder="厂商地址" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {getFactoryList} from "@/api/table";
import {createFactory, deleteFactory, updateFactory} from "@/api/operation";

import Pagination from '@/components/Pagination'

export default {
  name: 'factory',
  components: {Pagination},
  data() {
    return {
      list: null,
      listLoading: true,
      submitLoading:false,
      total: 0,
      labelPosition: 'right',
      listQuery: {
        current: 1,
        size: 20,
        factoryName: undefined,
        address: undefined
      },
      dialogVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      temp: {
        factoryName: undefined,
        address: undefined,
        factoryId: undefined
      },
      disabled: false,
      rules: {
        address: [{required: true, message: '请输入厂商地址', trigger: 'blur'}, {
          min: 1,
          max: 20,
          message: '厂商地址过长',
          trigger: 'blur'
        }],
        factoryName: [{required: true, message: '请输入厂商名称', trigger: 'blur'}, {
          min: 1,
          max: 20,
          message: '厂商名过长',
          trigger: 'blur'
        }],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getFactoryList(this.listQuery).then(response => {
        if (response.data.data !==null){
          const data = response.data.data
          this.list = data.records
          this.total = data.total
        }else {
          this.listLoading = false
          this.$message({
            showClose: true,
            message: '获取失败!',
            type: 'error'
          })
        }

      })
      this.listLoading = false;

    },
    resetTemp() {
      this.temp = {
        factoryName: "",
        address: "",
      }
    },
    //新增
    handleCreate() {
      this.resetTemp();
      this.disabled = false
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          createFactory(this.temp).then(res => {
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
                duration: 15000
              })
            }

          })
        }
      })
    },
    // update
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.dialogStatus = 'update'
      this.temp.factoryName = row.factoryName
      this.temp.address = row.address
      this.temp.factoryId = row.factoryId
      this.disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(index, row) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          updateFactory(this.temp).then(res => {
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
                duration: 15000
              })
            }
          })
        }
      })
    },

    //删除
    handleDelete(index, row) {
      deleteFactory(row.factoryId).then(res => {
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
      this.listQuery.address = ""
      this.getList()
    }
  }
}
</script>
