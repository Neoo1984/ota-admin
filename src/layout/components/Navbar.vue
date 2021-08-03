<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <div class="user-avatar">你好, <span class="helloName">{{userInfo.userName}} </span> <i class="el-icon-arrow-down"></i></div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--          <router-link to="/">-->
          <!--            <el-dropdown-item>-->
          <!--              首页-->
          <!--            </el-dropdown-item>-->
          <!--          </router-link>-->
          <el-dropdown-item divided @click.native="handlePwd()">
            <span style="display:block;">修改账户</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="restPwdDialogVisible"
      width="40%">
      <el-form ref="ruleForm" :rules="rules" :model="ruleForm" class="demo-form-inline"
               :label-position="labelPosition"
               label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" show-password placeholder="请输入原密码" autocomplete="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" placeholder="请输入密码" autocomplete="false"></el-input>
        </el-form-item>
<!--        <el-form-item label="确认密码" prop="checkPass">-->
<!--          <el-input v-model="ruleForm.checkPass" placeholder="请确认密码" autocomplete="true"></el-input>-->
<!--        </el-form-item>-->

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click='restPwdDialogVisible = false'>取 消</el-button>
        <el-button type="primary" @click=confirmPwd()>确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {changePassword} from "@/api/user"
import {MessageBox} from "element-ui";
import store from "@/store";
import {changePasswordType} from "@/common/global";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
    ])

  },
  data() {
    const checkMobile = (rule, value, callback) => {
      const phone = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!phone.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (this.ruleForm.checkPass !== '') {
        this.$refs.ruleForm.validateField('checkPass');
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
      textMap: {
        resetPwd: '修改账户',
      },
      dialogStatus: '',
      restPwdDialogVisible: false,
      labelPosition: 'right',
      rules: {
        oldPassword: [{required: true, message: '请输入原密码', trigger: 'blur'}],
        newPassword: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        pass: [{required: true, validator: validatePass, trigger: 'blur'}],
        checkPass: [{required: true, validator: validatePass2, trigger: 'blur'}],
      },
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        changeType: changePasswordType.user,
        mobile:''
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      MessageBox.confirm(
        '是否退出登录？',
        "确认登出", {
          confirmButtonText: '退出登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })

    },
    handlePwd() {
      this.clearPwd()
      this.dialogStatus = 'resetPwd'
      this.ruleForm.mobile = this.userInfo.mobile
      this.restPwdDialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    confirmPwd() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const query = {
            mobile: this.ruleForm.mobile,
            changeType: changePasswordType.user,
            oldPassword: this.ruleForm.oldPassword,
            newPassword: this.ruleForm.newPassword
          }
          changePassword(query).then(res => {
            const message = res.data.message
            if (res.data.success) {
              this.restPwdDialogVisible = false
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
            } else {
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
    clearPwd() {
      this.ruleForm.newPassword = ''
      this.ruleForm.oldPassword = ''
    }

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          height: 40px;
          border-radius: 10px;
        }
        .helloName {
          color: #5cb6ff;
          font-weight: bold;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
