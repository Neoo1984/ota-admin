<template>
  <div class="login-container">
    <el-form v-loading="loading" ref="loginForm" :model="loginForm" :rules="rules" class="login-form"
             label-position="top" label-width="80px"
    >
      <div class="title-container">
        <h3 class="title">OTA 后台管理</h3>
      </div>

      <el-form-item prop="mobile" label="手机号">
        <el-input
          prefix-icon="el-icon-user"
          ref="mobile"
          autocomplete="on"
          clearable
          v-model="loginForm.mobile"
          placeholder="手机号"
          name="mobile"
          auto-complete="on"
        ></el-input>

      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input
          ref="password"
          autocomplete="on"
          clearable
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          placeholder="密码"
          show-password
          auto-complete="on"
          style="width: 100%"
          @keyup.enter.native="handleLogin"
        ></el-input>

      </el-form-item>

      <!--        <el-button :loading="loading" type="danger" class="button-login"-->
      <!--                   @click.native.prevent="handleLogin"-->
      <!--        >登录-->
      <!--        </el-button>-->
      <div class="button-login"  @click="handleLogin">登 录</div>
    </el-form>


  </div>
</template>

<script>
import { validatePhone, validatePassword } from '@/utils/validate'
import { Base64 } from 'js-base64'
import { global } from '@/common'

export default {
  name: 'Login',
  data() {
    return {
      validatePhone: validatePhone,
      validatePassword: validatePassword,
      title: '注册',
      labelPosition: 'right',
      loginForm: {
        mobile: '',
        password: '',
        loginType: global.loginType.default
      },
      temp: {
        password: '',
        email: '',
        mobile: '',
        tenantId: '',
        userName: ''
      },
      rules: {
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]

      },
      loading: false,
      redirect: undefined,
      query: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
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
          this.$store.dispatch('user/login', this.query).then((response) => {
            if (response.data.success) {
              sessionStorage.setItem('userInfo', JSON.stringify(response.data.data.userInfo))
              sessionStorage.setItem('userRole', response.data.data.userInfo.userRole.toString())
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            } else {
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

//@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//  .login-container .el-input input {
//    color: $cursor;
//  }
//}

/* reset element-ui css */
/*.login-container {
  .el-input {
    //display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      //color: $light_gray;
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
}*/
</style>

<style scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  /*background-image: linear-gradient(-225deg, #65379B 0%, #886AEA 53%, #6457C6 100%);*/
  animation: fade-in 0.5s ease-in both;
  background-image: linear-gradient(to top, #88d3ce 0%, #6e45e2 100%);
}

.login-form {
  width: 400px;
  max-width: 100%;
  padding: 80px 35px;
  margin: 10% auto;
  /*background-color: #ffffff;*/
  border-radius: 8px;
  box-shadow: rgb(0 0 0 / 45%) 30px 30px 20px -20px;

  background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.title-container {
  position: relative;

}

.title {
  font-size: 26px;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: bold;
}

.button-login {
  width: 100%;
  margin-top: 30px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  color: #ffffffff;
  background-image: linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%);
}
.button-login:hover {
  color: #2b2f3a;
  background-image: linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%);
}
</style>
