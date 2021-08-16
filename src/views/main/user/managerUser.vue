<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="small">
      <el-form-item>
        <el-input
          v-model="listQuery.keyWord"
          placeholder="用户名/邮箱/手机"
          style="width: 400px"
          clearable
        >
          <el-button type="primary" slot="append" @click="getList" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleCreate">新增用户</el-button>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column type="index" align="center" label="序号" width="50" fixed="left"></el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="用户角色" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="renderRole(scope.row.userRole,true)">
            {{ renderRole(scope.row.userRole, false) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" :type="renderDelete(scope.row.isDelete,true)">
            {{ renderDelete(scope.row.isDelete, false) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="scope">
          {{ scope.row.createUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" :formatter="renderCreateTime"></el-table-column>
      <el-table-column label="更新人" align="center">
        <template slot-scope="scope">
          {{ scope.row.updateUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" :formatter="renderUpdateTime"></el-table-column>
      <el-table-column align="center" label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDetail(scope.row.$index, scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="changePassword(scope.row.$index, scope.row)"
          >密码
          </el-button>
          <el-popconfirm
            :confirm-button-text=confirmText(scope.row.isDelete,true)
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            :title=confirmText(scope.row.isDelete,false)
            @confirm="handleOperate(scope.$index,scope.row)"
          >
            <el-button
              style="margin-left: 10px"
              size="mini"
              type="text"
              slot="reference"
            >{{ scope.row.isDelete === '0' ? '注销' : '恢复' }}
            </el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form
        ref="dataForm"
        v-loading="submitLoading"
        :rules="rules"
        :model="temp"
        class="form-inline"
        :label-position="labelPosition"
        label-width="100px"
      >
        <el-form-item label="手机号" prop="mobile" v-if="dialogStatus==='create'">
          <el-input clearable v-model="temp.mobile" placeholder="请输入手机号" style="width: 80%" class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input clearable v-model="temp.userName" placeholder="请输入用户名" style="width: 80%" class="filter-item"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input clearable v-model="temp.email" placeholder=" 请输入邮箱地址" style="width:80%"></el-input>
        </el-form-item>

        <el-form-item label="用户角色" prop="userRole">
          <el-select v-model="temp.userRole" placeholder="请选择用户角色" style="width:80%">
            <el-option
              v-for="item in userRole"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogStatus==='create'">
          <el-input clearable show-password v-model="temp.password" placeholder=" 请输入密码" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='update'?updateData():createData()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      >
      <el-form   class="demo-form-inline" size="small">
        <el-form-item>
          <el-input
            v-model="password.newPassword"
            placeholder="请输入新密码"
            style="width: 100%"
            clearable
          >
            <el-button type="primary" @click="getList"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" type="primary" @click="changePasswordVisible = false">取 消</el-button>
    <el-button size="small" type="danger" @click="sendPassword">确认修改</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
import { getUser } from '@/api/table'
import Pagination from '@/components/Pagination'
import { addUser, operateUser, updateUser } from '@/api/operation'
import { renderDelete, renderTime, renderRole } from '@/utils'
import { isEmail, validatePhone } from '@/utils/validate'
import { changePasswordType, userRole } from '@/common/global'
import { Base64 } from 'js-base64'
import { changePassword } from '@/api/user'
import { MessageBox } from 'element-ui'

export default {
  name: 'ManagerUser',
  components: { Pagination },
  data() {
    return {
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      list: null,
      listLoading: false,
      dialogVisible: false,
      submitLoading: false,
      total: 0,
      labelPosition: 'right',
      validatePhone: validatePhone,
      isEmail: isEmail,
      renderDelete: renderDelete,
      renderRole: renderRole,
      userRole: userRole,
      textMap: {
        create: '新增',
        update: '编辑'
      },
      temp: {
        userName: undefined,
        mobile: undefined,
        email: undefined,
        userRole: undefined,
        password: undefined,
        userId: undefined
      },
      initTemp: {},
      dialogStatus: '',
      listQuery: {
        current: 1,
        size: 20,
        userType: '1',
        keyWord: undefined
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, {
          min: 1,
          max: 20,
          message: '用户名过长',
          trigger: 'blur'
        }],
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        userRole: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入电子邮箱', trigger: 'blur', validator: isEmail }]
      },
      changePasswordVisible:false,
      password:{
        mobile: '',
        newPassword: '',
        changeType: changePasswordType.admin
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUser(this.listQuery).then(res => {
        if (res.data.data !== null) {
          this.listLoading = false
          this.list = res.data.data.records
          this.total = res.data.data.total

        } else {
          this.listLoading = false
        }
      })

    },
    confirmText(isDelete, isText) {
      if (isText) {
        return isDelete === '0' ? '注销' : '恢复'
      } else {
        return isDelete === '0' ? '确认注销？' : '确认恢复？'
      }
    },
    renderCreateTime(row) {
      return renderTime(row.createTime)
    },
    renderUpdateTime(row) {
      return renderTime(row.updateTime)
    },
    handleDetail(index, row) {
      this.dialogStatus = 'update'
      this.temp.userName = row.userName
      this.temp.mobile = row.mobile
      this.temp.email = row.email
      this.temp.userId = row.userId
      this.temp.userRole = row.userRole
      this.temp.password = row.password
      this.initTemp = Object.assign({}, this.temp)

      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //删除temp中除了 userId之外的未改动值
    compareTemp() {
      for (let key in this.temp) {
        if (key !== 'userId') {
          if (this.temp[key] === this.initTemp[key]) {
            delete this.temp[key]
          }
        }
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          this.compareTemp()
          updateUser(this.temp).then(res => {
            if (res.data != null) {
              const message = res.data.message
              if (res.data.success) {
                this.submitLoading = false

                this.dialogVisible = false

                if (this.userInfo.userId === this.temp.userId) {
                  if (this.temp.userName !== undefined) {
                    this.$store.commit('user/SET_USERNAME', this.temp.userName)
                  }
                  let role = JSON.parse(sessionStorage.getItem('userRole'))
                  if (this.temp.userRole !== role) {
                    sessionStorage.setItem('path', '/dashboard')
                    MessageBox.confirm(
                      '当前权限已经修改，请重新登录',
                      '确认登出', {
                        confirmButtonText: '退出登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }
                    ).then(() => {
                      this.$store.dispatch('user/logout')
                      console.log(this.$route.fullPath)
                      this.$router.push(`/login?redirect=/dashboard`)
                    })

                  }
                } else {
                  this.getList()
                  this.$message({
                    showClose: true,
                    message: message,
                    type: 'success'
                  })
                }

              } else {
                this.submitLoading = false

                this.$message({
                  showClose: true,
                  message: message,
                  type: 'error'
                })
              }
            }

          })
        }
      })

    },
    handleOperate(index, row) {
      let query = {
        operateUserType: row.isDelete === '0' ? 1 : 2,
        userId: row.userId
      }
      operateUser(query).then(res => {
        if (res.data !== null) {
          let message = res.data.message
          this.getList()
          this.$message({
            showClose: true,
            message: message,
            type: res.data.success ? 'success' : 'false'
          })
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = Base64.encode(this.temp.password)
          this.submitLoading = true
          addUser(this.temp).then(res => {
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
              this.$message({
                showClose: true,
                message: message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    //修改密码
    changePassword(index,row) {
      this.password.newPassword = undefined
      this.password.mobile = row.mobile
      this.changePasswordVisible = true
    },
    sendPassword() {
      this.password.newPassword = Base64.encode(this.password.newPassword)
      changePassword(this.password).then((res) => {
        if (res.data != null) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: res.data.success ? 'success' : 'error'
          })
          if (res.data.success) {
            this.changePasswordVisible = false
            this.getList()
            //如果当前修改的为当前登陆的账号，则跳转到登录
            if (this.userInfo.mobile === this.password.mobile) {
              MessageBox.confirm(
                '密码已修改，请重新登录',
                '重新登录', {
                  confirmButtonText: '确认',
                  type: 'warning',
                  showClose: false,
                  showCancelButton: false,
                  closeOnClickModal: false,
                  closeOnPressEscape: false
                }
              ).then(() => {
                this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
              })
            }
          }
        }
      })

    },

    resetTemp() {
      this.temp.userName = undefined
      this.temp.mobile = undefined
      this.temp.email = undefined
      this.temp.userRole = undefined
      this.temp.password = undefined

    },
    //重置搜索
    clearSearch() {
      this.listQuery.keyWord = undefined
    }
  }

}

</script>
