<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">登录
      </el-button>

    </el-form>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form ref="registerForm" :rules="rules" :model="temp" :label-position="labelPosition" label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="手机号" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="邮箱" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-input v-model="temp.tenantId" placeholder="商户" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="密码" style="width: 80%" class="filter-item"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=" registerConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {validatePhone,validatePassword} from '@/utils/validate'
import {Base64} from "js-base64";
import { global } from '@/common'

export default {
  name: 'Login',
  data() {
    return {
      validatePhone: validatePhone,
      validatePassword: validatePassword,
      title: "注册",
      labelPosition: "right",
      dialogVisible: false,
      loginForm: {
        mobile: '',
        password: '',
        loginType: global.loginType.default
      },
      temp: {
        password: "",
        email: "",
        mobile: "",
        tenantId: "",
        userName: ""
      },
      rules: {
        mobile: [{required: true, trigger: 'blur', validator: validatePhone}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}],

      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      query:{}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          this.query = {
            mobile: this.loginForm.mobile,
            password: this.loginForm.password,
            loginType: global.loginType.default
          }
          this.query.password = Base64.encode(this.query.password)
          this.$store.dispatch('user/login',this.query ).then((response) => {
            if (response.data.success){
              sessionStorage.setItem('userInfo',JSON.stringify(response.data.data.userInfo))
              this.$router.push({path: this.redirect || '/'})
              this.loading = false
            }else {
              this.$notify({
                title: '失败',
                message: response.data.message,
                type: 'error',
                duration: 5000
              })
              this.loading = false
            }
          }).catch((response) => {
            this.$notify({
              title: '失败',
              message: response.data.message,
              type: 'error',
              duration: 5000
            })
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['registerForm'].clearValidate()
      })
    },
    registerConfirm() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({path: this.redirect || '/'})
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })

    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
